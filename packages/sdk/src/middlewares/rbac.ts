import { Context, Next } from 'hono';

export function checkPermission(requiredPermission: string) {
  return async (c: Context<any>, next: Next) => {
    const userPayload = c.get('user');
    
    if (!userPayload) {
      return c.json({ success: false, error: 'Forbidden: No user context found' }, 403);
    }

    // 1. API Key Role Check
    if (userPayload.role === 'api_client') {
      const scopes = userPayload.scopes || [];
      if (scopes.includes(requiredPermission) || scopes.includes('*')) {
        return await next();
      }
      return c.json({ success: false, error: `Forbidden: API Key lacks required scope: ${requiredPermission}` }, 403);
    }

    // 2. Owner Role Check
    if (userPayload.role === 'owner') {
      return await next();
    }

    if (!userPayload.sub) {
      return c.json({ success: false, error: 'Forbidden: Invalid user context' }, 403);
    }

    // 3. User Permission Check via Raw SQL
    const query = `
      SELECT p.id 
      FROM wb_users u
      INNER JOIN wb_role_permissions rp ON u.role_id = rp.role_id
      INNER JOIN wb_permissions p ON rp.permission_id = p.id
      WHERE u.id = ? AND p.slug = ?
      LIMIT 1
    `;
    
    try {
      const result = await c.env.DB.prepare(query).bind(userPayload.sub, requiredPermission).first();
      
      if (!result) {
        return c.json({ success: false, error: 'Forbidden: Insufficient permissions' }, 403);
      }

      await next();
    } catch (err: any) {
      return c.json({ success: false, error: 'Forbidden: Error checking permissions', details: err.message }, 500);
    }
  };
}
