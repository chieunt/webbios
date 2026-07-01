import { Context, Next } from 'hono';
import { verify } from 'hono/jwt';

async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function authMiddleware(c: Context<any>, next: Next) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Unauthorized: Missing or invalid token' }, 401);
  }

  const token = authHeader.split(' ')[1];

  // Dual Auth: API Key Logic
  if (token.startsWith('wb_sk_')) {
    const secretHash = await sha256(token);
    const cacheKey = `apikey:${secretHash}`;
    
    // 1. Check KV Cache
    if (c.env.CACHE_KV) {
      const cachedScopes = await c.env.CACHE_KV.get(cacheKey);
      if (cachedScopes) {
        c.set('user', { role: 'api_client', sub: 'api_key', scopes: JSON.parse(cachedScopes) });
        return await next();
      }
    }
    
    // 2. Cache Miss: Fallback to D1
    const query = `SELECT id, scopes, expires_at FROM wb_api_keys WHERE secret_hash = ? AND status = 'active'`;
    const result = await c.env.DB.prepare(query).bind(secretHash).first() as {id: string, scopes: string, expires_at: string | null} | undefined;
    
    if (!result) {
      return c.json({ success: false, error: 'Unauthorized: Invalid API Key' }, 401);
    }
    
    if (result.expires_at && new Date(result.expires_at) < new Date()) {
      return c.json({ success: false, error: 'Unauthorized: API Key expired' }, 401);
    }
    
    // 3. Update Cache & Set Context
    if (c.env.CACHE_KV) {
      // Cache for 1 hour (3600 seconds)
      c.executionCtx.waitUntil(c.env.CACHE_KV.put(cacheKey, result.scopes, { expirationTtl: 3600 }));
    }
    
    // Update last_used_at asynchronously
    const updateQuery = `UPDATE wb_api_keys SET last_used_at = datetime('now'), request_count = request_count + 1 WHERE id = ?`;
    c.executionCtx.waitUntil(c.env.DB.prepare(updateQuery).bind(result.id).run());
    
    c.set('user', { role: 'api_client', sub: result.id, scopes: JSON.parse(result.scopes) });
    return await next();
  }

  // Dual Auth: JWT Logic
  const secret = c.env.JWT_SECRET || 'super-secret-key-for-now';

  try {
    const payload = await verify(token, secret, 'HS256');
    c.set('user', payload);
    await next();
  } catch (err: any) {
    console.log('JWT Verify Error:', err);
    return c.json({ success: false, error: 'Unauthorized: Invalid token', details: err.message }, 401);
  }
}
