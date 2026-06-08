import { Hono } from 'hono'
import { getDb } from '../../db'
import { wbRoles, wbRolePermissions } from '@webbios/db/src/schema'
import { authMiddleware } from '../../middlewares/auth'
import { eq } from 'drizzle-orm'
import { ulid } from 'ulid'

type Bindings = {
  DB: D1Database
  JWT_SECRET: string
}

const rolesApp = new Hono<{ Bindings: Bindings }>()

rolesApp.use('*', authMiddleware)

// Get all roles
rolesApp.get('/', async (c) => {
  const db = getDb(c.env.DB)
  const allRoles = await db.select().from(wbRoles).orderBy(wbRoles.createdAt)
  return c.json({ data: allRoles })
})

// Get permissions for a role
rolesApp.get('/:id/permissions', async (c) => {
  const db = getDb(c.env.DB)
  const roleId = c.req.param('id')
  
  const perms = await db.select({ permissionId: wbRolePermissions.permissionId })
    .from(wbRolePermissions)
    .where(eq(wbRolePermissions.roleId, roleId))
    
  return c.json({ data: perms.map(p => p.permissionId) })
})

// Create role
rolesApp.post('/', async (c) => {
  const db = getDb(c.env.DB)
  const body = await c.req.json()
  
  const roleId = ulid()
  
  const newRole = {
    id: roleId,
    name: body.name,
    slug: body.slug,
    description: body.description || null,
    isSystem: body.isSystem || false,
    createdAt: new Date().toISOString()
  }

  try {
    const queries = []
    queries.push(db.insert(wbRoles).values(newRole))
    
    if (body.permissionIds && Array.isArray(body.permissionIds) && body.permissionIds.length > 0) {
      const rpValues = body.permissionIds.map((pid: string) => ({
        roleId,
        permissionId: pid
      }))
      queries.push(db.insert(wbRolePermissions).values(rpValues))
    }
    
    await db.batch(queries as any)
    
    return c.json({ success: true, data: newRole })
  } catch (err: any) {
    if (err.message?.includes('UNIQUE constraint failed')) {
      return c.json({ success: false, error: 'Slug must be unique' }, 400)
    }
    return c.json({ success: false, error: err.message }, 500)
  }
})

// Update role
rolesApp.put('/:id', async (c) => {
  const db = getDb(c.env.DB)
  const roleId = c.req.param('id')
  const body = await c.req.json()

  try {
    const queries = []
    
    // Update role details
    queries.push(
      db.update(wbRoles)
        .set({
          name: body.name,
          slug: body.slug,
          description: body.description || null,
          isSystem: body.isSystem || false
        })
        .where(eq(wbRoles.id, roleId))
    )
    
    // Replace role permissions
    if (body.permissionIds && Array.isArray(body.permissionIds)) {
      queries.push(db.delete(wbRolePermissions).where(eq(wbRolePermissions.roleId, roleId)))
      if (body.permissionIds.length > 0) {
        const rpValues = body.permissionIds.map((pid: string) => ({
          roleId,
          permissionId: pid
        }))
        queries.push(db.insert(wbRolePermissions).values(rpValues))
      }
    }
    
    await db.batch(queries as any)
    
    return c.json({ success: true })
  } catch (err: any) {
    if (err.message?.includes('UNIQUE constraint failed')) {
      return c.json({ success: false, error: 'Slug must be unique' }, 400)
    }
    return c.json({ success: false, error: err.message }, 500)
  }
})

// Delete role
rolesApp.delete('/:id', async (c) => {
  const db = getDb(c.env.DB)
  const roleId = c.req.param('id')

  try {
    await db.batch([
      db.delete(wbRolePermissions).where(eq(wbRolePermissions.roleId, roleId)),
      db.delete(wbRoles).where(eq(wbRoles.id, roleId))
    ] as any)
    
    return c.json({ success: true })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

export default rolesApp
