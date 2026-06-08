import { Context, Next } from 'hono'
import { getDb } from '../db'
import { wbUsers, wbRolePermissions, wbPermissions } from '@webbios/db/src/schema'
import { eq } from 'drizzle-orm'

export function checkPermission(requiredPermission: string) {
  return async (c: Context, next: Next) => {
    const userPayload = c.get('user')
    if (!userPayload || !userPayload.sub) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // Owner role bypasses permission checks
    if (userPayload.role === 'owner') {
      return await next()
    }

    const db = getDb(c.env.DB)

    // Check if the user's role has the required permission
    const result = await db.select({ id: wbPermissions.id })
      .from(wbUsers)
      .innerJoin(wbRolePermissions, eq(wbUsers.roleId, wbRolePermissions.roleId))
      .innerJoin(wbPermissions, eq(wbRolePermissions.permissionId, wbPermissions.id))
      .where(eq(wbUsers.id, userPayload.sub))
      .where(eq(wbPermissions.slug, requiredPermission))
      .limit(1)

    if (result.length === 0) {
      return c.json({ error: 'Forbidden: Insufficient permissions' }, 403)
    }

    await next()
  }
}
