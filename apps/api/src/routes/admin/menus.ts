import { Hono } from 'hono'
import { getDb } from '../../db'
import { wbMenus, wbRolePermissions, wbUsers, wbPermissions } from '@webbios/db/src/schema'
import { authMiddleware } from '../../middlewares/auth'
import { eq, asc } from 'drizzle-orm'
import { ulid } from 'ulid'

type Bindings = {
  DB: D1Database
}

const menusApp = new Hono<{ Bindings: Bindings }>()

menusApp.use('*', authMiddleware)

menusApp.get('/', async (c) => {
  const db = getDb(c.env.DB)
  const user = c.get('user')

  if (!user || !user.sub) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  // 1. Fetch user's roleId from the database
  const dbUserRecords = await db.select({ roleId: wbUsers.roleId })
    .from(wbUsers)
    .where(eq(wbUsers.id, user.sub as string))
    .limit(1)

  const dbUser = dbUserRecords[0]
  if (!dbUser) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  // 2. Lấy toàn bộ Menu đang visible
  const allMenusResult = await db.select()
    .from(wbMenus)
    .where(eq(wbMenus.isVisible, true))
    .orderBy(asc(wbMenus.position))

  let allowedMenus = allMenusResult;

  if (user.role !== 'owner') {
    // Lấy danh sách permission slugs của user hiện tại
    const userPerms = await db.select({ slug: wbPermissions.slug })
      .from(wbRolePermissions)
      .innerJoin(wbPermissions, eq(wbRolePermissions.permissionId, wbPermissions.id))
      .where(eq(wbRolePermissions.roleId, dbUser.roleId))

    const permSlugs = userPerms.map(p => p.slug)

    // Lọc Menu dựa trên permissionSlug
    allowedMenus = allMenusResult.filter(menu => {
      if (!menu.permissionSlug) return true // Không yêu cầu quyền
      return permSlugs.includes(menu.permissionSlug) // User có quyền
    })
  }

  // 4. Build Tree
  const buildTree = (parentId: string | null): any[] => {
    return allowedMenus
      .filter(m => m.parentId === parentId)
      .map(m => ({
        ...m,
        children: buildTree(m.id)
      }))
  }

  const menuTree = buildTree(null)

  return c.json({ data: menuTree })
})

// Create Menu
menusApp.post('/', async (c) => {
  try {
    const db = getDb(c.env.DB)
    const body = await c.req.json()
    
    const newMenu = {
      ...body,
      id: body.id || ulid()
    }

    await db.insert(wbMenus).values(newMenu)
    return c.json({ success: true, data: newMenu })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Update Menu
menusApp.put('/:id', async (c) => {
  try {
    const db = getDb(c.env.DB)
    const id = c.req.param('id')
    const body = await c.req.json()

    // Lấy menu hiện tại để kiểm tra
    const existingRows = await db.select().from(wbMenus).where(eq(wbMenus.id, id)).limit(1)
    const existing = existingRows[0]
    if (!existing) {
      return c.json({ success: false, error: 'Menu not found' }, 404)
    }

    if (existing.isSystem) {
      // Nếu là menu hệ thống, chỉ cho phép sửa label, icon, translations, isVisible
      delete body.path
      delete body.permissionSlug
      delete body.parentId
      delete body.position
      delete body.isSystem
    }

    await db.update(wbMenus).set(body).where(eq(wbMenus.id, id))
    return c.json({ success: true })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Batch Reorder Menus
menusApp.post('/reorder', async (c) => {
  const db = getDb(c.env.DB)
  const body = await c.req.json()
  const items: { id: string, parentId: string | null, position: number }[] = body.items

  if (!items || !Array.isArray(items)) {
    return c.json({ error: 'Invalid payload: items array required' }, 400)
  }

  // Lấy các menu hệ thống để loại trừ việc reorder
  const systemMenusRows = await db.select({ id: wbMenus.id }).from(wbMenus).where(eq(wbMenus.isSystem, true))
  const systemMenuIds = systemMenusRows.map(r => r.id)

  // Update each menu sequentially within one request
  for (const item of items) {
    if (systemMenuIds.includes(item.id)) {
      continue; // Bỏ qua không cập nhật position/parentId cho menu hệ thống
    }
    await db.update(wbMenus).set({
      parentId: item.parentId,
      position: item.position
    }).where(eq(wbMenus.id, item.id))
  }

  return c.json({ success: true })
})

// Delete Menu
menusApp.delete('/:id', async (c) => {
  const db = getDb(c.env.DB)
  const id = c.req.param('id')

  const existingRows = await db.select({ isSystem: wbMenus.isSystem }).from(wbMenus).where(eq(wbMenus.id, id)).limit(1)
  if (existingRows[0]?.isSystem) {
    return c.json({ success: false, error: 'Cannot delete system menu' }, 403)
  }

  await db.delete(wbMenus).where(eq(wbMenus.id, id))
  return c.json({ success: true })
})

export default menusApp
