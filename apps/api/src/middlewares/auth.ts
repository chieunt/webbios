import { Context, Next } from 'hono'
import { verify } from 'hono/jwt'

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized: Missing or invalid token' }, 401)
  }

  const token = authHeader.split(' ')[1]
  const secret = c.env.JWT_SECRET || 'webbios-dev-secret-key'

  try {
    const payload = await verify(token, secret, 'HS256')
    c.set('user', payload)
    await next()
  } catch (err: any) {
    console.log('JWT Verify Error:', err)
    return c.json({ error: 'Unauthorized: Invalid token', details: err.message }, 401)
  }
}
