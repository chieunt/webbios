import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Bảng quản lý tenant (Dành cho bản SaaS Trial)
export const tenants = sqliteTable('tenants', {
  id: text('id').primaryKey(), // uuid
  name: text('name').notNull(),
  subdomain: text('subdomain').notNull().unique(),
  status: text('status').notNull().default('active'), // active, suspended
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Bảng nhân viên / admin
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').references(() => tenants.id),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('staff'), // owner, admin, staff
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Bảng khách mua hàng
export const customers = sqliteTable('customers', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').references(() => tenants.id),
  email: text('email').unique(),
  phone: text('phone'),
  fullName: text('full_name').notNull(),
  totalOrders: integer('total_orders').default(0),
  totalSpent: real('total_spent').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Bảng sản phẩm
export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').references(() => tenants.id),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  price: real('price').notNull().default(0),
  compareAtPrice: real('compare_at_price'),
  status: text('status').notNull().default('draft'), // draft, active, archived
  stock: integer('stock').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Bảng đơn hàng
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').references(() => tenants.id),
  orderNumber: text('order_number').notNull().unique(),
  customerId: text('customer_id').references(() => customers.id),
  status: text('status').notNull().default('pending'), // pending, confirmed, processing, shipped, completed
  total: real('total').notNull().default(0),
  paymentStatus: text('payment_status').notNull().default('unpaid'), // unpaid, paid, refunded
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
