import { Hono } from 'hono'
import { getDb } from '../../db'
import { wbPermissions, wbRolePermissions } from '@webbios/db/src/schema'
import { authMiddleware } from '../../middlewares/auth'
import { eq } from 'drizzle-orm'
import { ulid } from 'ulid'

type Bindings = {
  DB: D1Database
}

const permissionsApp = new Hono<{ Bindings: Bindings }>()

permissionsApp.use('*', authMiddleware)

// Get all permissions
permissionsApp.get('/', async (c) => {
  const db = getDb(c.env.DB)
  const allPermissions = await db.select().from(wbPermissions)
  return c.json({ data: allPermissions })
})

// Create permission
permissionsApp.post('/', async (c) => {
  const db = getDb(c.env.DB)
  const body = await c.req.json()
  
  const slugParts = (body.slug || '').split(':')
  const groupName = slugParts[0] || 'custom'
  
  const newPermission = {
    ...body,
    id: body.id || ulid(),
    name: body.name || body.slug,
    groupName: body.groupName || groupName
  }

  await db.insert(wbPermissions).values(newPermission)
  return c.json({ success: true, data: newPermission })
})

// Update permission
permissionsApp.put('/:id', async (c) => {
  const db = getDb(c.env.DB)
  const id = c.req.param('id')
  const body = await c.req.json()

  await db.update(wbPermissions).set(body).where(eq(wbPermissions.id, id))
  return c.json({ success: true })
})

// Delete permission
permissionsApp.delete('/:id', async (c) => {
  const db = getDb(c.env.DB)
  const id = c.req.param('id')

  // Check if permission is in use by roles
  const inUseByRoles = await db.select().from(wbRolePermissions).where(eq(wbRolePermissions.permissionId, id)).limit(1)
  if (inUseByRoles.length > 0) {
    return c.json({ error: 'Cannot delete permission because it is assigned to one or more roles' }, 400)
  }

  await db.delete(wbPermissions).where(eq(wbPermissions.id, id))
  return c.json({ success: true })
})

export default permissionsApp
