import { Hono } from 'hono'
import { getDb } from '../../db'
import { wbUsers, wbInstalledApps } from '@webbios/db/src/schema'
import { sql } from 'drizzle-orm'
import { authMiddleware } from '../../middlewares/auth'
import { checkPermission } from '../../middlewares/rbac'

type Bindings = {
  DB: D1Database
}

const dashboardApp = new Hono<{ Bindings: Bindings }>()

dashboardApp.use('*', authMiddleware)

/**
 * GET /v1/admin/dashboard/stats
 * Core Kernel dashboard — returns system-level stats.
 * Suite-specific stats (orders, products, customers) will be provided by separate Suite APIs.
 */
dashboardApp.get('/stats', checkPermission('dashboard:view'), async (c) => {
  const db = getDb(c.env.DB)

  // System-level stats only (Core Kernel)
  const usersResult = await db.select({ count: sql<number>`count(*)` }).from(wbUsers)
  const appsResult = await db.select({ count: sql<number>`count(*)` }).from(wbInstalledApps)

  return c.json({
    // Core stats
    totalUsers: usersResult[0].count || 0,
    totalApps: appsResult[0].count || 0,
    // Placeholders for Suite stats (will be overridden by Commerce Suite when installed)
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
  })
})

export default dashboardApp
