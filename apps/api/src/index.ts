import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { seed } from '@webbios/db/src/seed'

type Bindings = {
  DB: D1Database
  JWT_SECRET: string
  STORAGE: R2Bucket
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors())

app.get('/', (c) => {
  return c.json({
    name: 'WebbiOS Core API',
    version: '2.0.0',
    architecture: '4-Layer',
    status: 'online'
  })
})

app.post('/seed', async (c) => {
  try {
    await seed(c.env)
    return c.json({ success: true, message: 'Core Kernel database seeded successfully' })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

import { getDb } from './db'
import { wbUsers, wbRoles } from '@webbios/db/src/schema'
import { eq } from 'drizzle-orm'
import { hashPassword } from './utils/crypto'
import { ulid } from 'ulid'

app.post('/setup-owner', async (c) => {
  try {
    const db = getDb(c.env.DB)
    const ownerRole = await db.select().from(wbRoles).where(eq(wbRoles.slug, 'owner')).limit(1)
    if (ownerRole.length === 0) return c.json({ error: 'Owner role not found. Run /seed first.' }, 404)

    const existingUser = await db.select().from(wbUsers).where(eq(wbUsers.email, 'admin@webbios.local')).limit(1)
    if (existingUser.length > 0) return c.json({ error: 'Owner already exists' }, 400)

    const pwdHash = await hashPassword('Admin@123')
    await db.insert(wbUsers).values({
      id: ulid(),
      email: 'admin@webbios.local',
      passwordHash: pwdHash,
      firstName: 'System',
      lastName: 'Admin',
      roleId: ownerRole[0].id,
      status: 'active',
    })
    return c.json({ success: true, message: 'Owner created: admin@webbios.local / Admin@123' })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

import authApp from './routes/admin/auth'
import dashboardApp from './routes/admin/dashboard'
import menusApp from './routes/admin/menus'
import permissionsApp from './routes/admin/permissions'
import rolesApp from './routes/admin/roles'
import updatesApp from './routes/admin/updates'
import settingsApp from './routes/admin/settings'
import webhooksApp from './routes/admin/webhooks'
import mediaApp from './routes/admin/media'
import marketplaceApp from './routes/admin/marketplace'
import appsApp from './routes/admin/apps'
import usersApp from './routes/admin/users'
import auditLogsApp from './routes/admin/audit_logs'
import apiKeysApp from './routes/admin/api_keys'

import storefrontConfigApp from './routes/storefront/config'
import publicApp from './routes/public'

app.route('/v1/public', publicApp)
app.route('/v1/admin/auth', authApp)
app.route('/v1/admin/dashboard', dashboardApp)
app.route('/v1/admin/menus', menusApp)
app.route('/v1/admin/permissions', permissionsApp)
app.route('/v1/admin/roles', rolesApp)
app.route('/v1/admin/updates', updatesApp)
app.route('/v1/admin/settings', settingsApp)
app.route('/v1/admin/webhooks', webhooksApp)
app.route('/v1/admin/media', mediaApp)
app.route('/v1/admin/marketplace', marketplaceApp)
app.route('/v1/admin/apps', appsApp)
app.route('/v1/admin/users', usersApp)
app.route('/v1/admin/audit-logs', auditLogsApp)
app.route('/v1/admin/api-keys', apiKeysApp)
// Gateway: Forward CRM requests to CRM Worker via Service Binding
app.all('/v1/admin/crm/*', async (c) => {
  const crmApi = c.env.CRM_API;
  if (!crmApi) {
    return c.json({ success: false, error: 'CRM service not available' }, 503);
  }
  // Strip the /v1/admin/crm prefix, pass the rest to CRM Worker
  const url = new URL(c.req.url);
  const crmPath = url.pathname.replace('/v1/admin/crm', '');
  const targetUrl = new URL(crmPath + url.search, 'https://wb-api-crm.internal');

  const res = await crmApi.fetch(targetUrl.toString(), {
    method: c.req.method,
    headers: c.req.raw.headers,
    body: c.req.method !== 'GET' && c.req.method !== 'HEAD' ? c.req.raw.body : undefined,
  });

  return new Response(res.body, {
    status: res.status,
    headers: res.headers,
  });
});

// Storefront routes
app.route('/v1/storefront/config', storefrontConfigApp)

export default app
