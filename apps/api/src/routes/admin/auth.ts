import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import { getDb } from '../../db'
import { wbUsers, wbSessions, wbRoles, wbRolePermissions, wbPermissions } from '@webbios/db/src/schema'
import { eq } from 'drizzle-orm'
import { verifyPassword, generateToken } from '../../utils/crypto'
import { ulid } from 'ulid'
import { authMiddleware } from '../../middlewares/auth'

type Bindings = {
  DB: D1Database
  JWT_SECRET: string
}

const authApp = new Hono<{ Bindings: Bindings }>()

authApp.post('/login', async (c) => {
  const body = await c.req.json()
  const { email, password } = body

  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400)
  }

  const db = getDb(c.env.DB)

  // 1. Find user by email
  const userRecords = await db.select({
    id: wbUsers.id,
    email: wbUsers.email,
    passwordHash: wbUsers.passwordHash,
    firstName: wbUsers.firstName,
    lastName: wbUsers.lastName,
    avatarUrl: wbUsers.avatarUrl,
    status: wbUsers.status,
    roleId: wbUsers.roleId,
    roleSlug: wbRoles.slug
  })
  .from(wbUsers)
  .leftJoin(wbRoles, eq(wbUsers.roleId, wbRoles.id))
  .where(eq(wbUsers.email, email))
  .limit(1)

  const user = userRecords[0]

  if (!user) {
    return c.json({ error: 'Invalid email or password' }, 401)
  }

  if (user.status !== 'active') {
    return c.json({ error: 'Account is deactivated' }, 403)
  }

  // 2. Verify password
  const isValid = await verifyPassword(password, user.passwordHash)
  if (!isValid) {
    return c.json({ error: 'Invalid email or password' }, 401)
  }

  // 3. Update lastLoginAt
  await db.update(wbUsers).set({ lastLoginAt: new Date().toISOString() }).where(eq(wbUsers.id, user.id))

  // 4. Generate JWT Access Token
  const secret = c.env.JWT_SECRET || 'webbios-dev-secret-key'
  
  const payload = {
    sub: user.id,
    role: user.roleSlug,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2, // 2 hours
  }
  const accessToken = await sign(payload, secret)

  // 5. Generate Refresh Token and store session
  const refreshToken = generateToken()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30) // 30 days

  await db.insert(wbSessions).values({
    id: ulid(),
    userId: user.id,
    refreshToken,
    userAgent: c.req.header('user-agent'),
    ipAddress: c.req.header('x-real-ip') || c.req.header('cf-connecting-ip') || 'unknown',
    expiresAt: expiresAt.toISOString()
  })

  return c.json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      role: user.roleSlug
    }
  })
})

authApp.get('/me', authMiddleware, async (c) => {
  const userPayload = c.get('user')
  const db = getDb(c.env.DB)

  const userRecords = await db.select({
    id: wbUsers.id,
    email: wbUsers.email,
    firstName: wbUsers.firstName,
    lastName: wbUsers.lastName,
    avatarUrl: wbUsers.avatarUrl,
    roleSlug: wbRoles.slug
  })
  .from(wbUsers)
  .leftJoin(wbRoles, eq(wbUsers.roleId, wbRoles.id))
  .where(eq(wbUsers.id, userPayload.sub))
  .limit(1)

  const user = userRecords[0]
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  // Get permissions
  let permSlugs: string[] = []
  
  if (user.roleSlug === 'owner') {
    const allPerms = await db.select({ slug: wbPermissions.slug }).from(wbPermissions)
    permSlugs = allPerms.map(p => p.slug)
  } else {
    const userPerms = await db.select({ slug: wbPermissions.slug })
      .from(wbUsers)
      .innerJoin(wbRolePermissions, eq(wbUsers.roleId, wbRolePermissions.roleId))
      .innerJoin(wbPermissions, eq(wbRolePermissions.permissionId, wbPermissions.id))
      .where(eq(wbUsers.id, user.id))
    
    permSlugs = userPerms.map(p => p.slug)
  }

  return c.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      role: user.roleSlug
    },
    permissions: permSlugs
  })
})

export default authApp
