import { pgTable, text, timestamp, boolean, integer, decimal, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleEnum = pgEnum('role', ['owner', 'admin', 'manager', 'viewer']);
export const orgStatusEnum = pgEnum('org_status', ['pending', 'action_required', 'approved', 'rejected']);
export const productStatusEnum = pgEnum('product_status', ['draft', 'active']);
export const orderStatusEnum = pgEnum('order_status', [
  'received',
  'confirmed',
  'rejected',
  'preparing',
  'ready',
  'picked_up',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'completed',
  'cancelled',
  'delayed',
  'failed',
  'return_requested',
  'refunded'
]);

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  emailVerified: boolean('email_verified').default(false),
  image: text('image'),
  organizationId: text('organization_id').references(() => organizations.id),
  role: roleEnum('role').default('owner'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Organizations table
export const organizations = pgTable('organizations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').default(''),
  logo: text('logo').default(''),
  slug: text('slug').notNull().unique(),
  ownerId: text('owner_id').notNull(),
  currency: text('currency').default('SAR'),
  status: orgStatusEnum('status').default('pending'),
  memberCount: integer('member_count').default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Categories table
export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  parentId: text('parent_id'),
  organizationId: text('organization_id').notNull().references(() => organizations.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Products table
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  categoryId: text('category_id').references(() => categories.id),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').default(0),
  brand: text('brand'),
  status: productStatusEnum('status').default('draft'),
  organizationId: text('organization_id').notNull().references(() => organizations.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Orders table (Partner Orders)
export const orders = pgTable('orders', {
  id: text('id').primaryKey(), // partner_order_id
  mainOrderId: text('main_order_id').notNull(),
  organizationId: text('organization_id').notNull().references(() => organizations.id),
  customerId: text('customer_id').notNull(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email'),
  customerPhone: text('customer_phone'),
  address: text('address'), // JSON string of address
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('SAR'),
  status: orderStatusEnum('status').default('received'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  estimatedReadyTime: timestamp('estimated_ready_time'),
  completedAt: timestamp('completed_at'),
});

// Order Items table
export const orderItems = pgTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  productId: text('product_id').references(() => products.id),
  productName: text('product_name'),
  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  status: text('status').default('confirmed'),
});

// Order Status History
export const orderStatusHistory = pgTable('order_status_history', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  status: orderStatusEnum('status').notNull(),
  previousStatus: orderStatusEnum('previous_status'),
  changedBy: text('changed_by'),
  notes: text('notes'),
  metadata: text('metadata'), // JSON string
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Webhook Logs
export const webhookLogs = pgTable('webhook_logs', {
  id: text('id').primaryKey(), // event_id
  eventType: text('event_type').notNull(),
  orderId: text('order_id').notNull().references(() => orders.id),
  payload: text('payload').notNull(), // JSON string
  sentAt: timestamp('sent_at').defaultNow().notNull(),
  responseStatus: integer('response_status'),
  responseBody: text('response_body'),
  retryCount: integer('retry_count').default(0),
  success: boolean('success').default(false),
});

// Sessions table (for better-auth)
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Accounts table (for better-auth)
export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Verification tokens (for better-auth)
export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Members table (linking Users and Organizations)
export const members = pgTable('members', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organizations.id),
  userId: text('user_id').notNull().references(() => users.id),
  role: roleEnum('role').default('viewer').notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
  memberships: many(members),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  members: many(members),
  products: many(products),
  orders: many(orders),
  categories: many(categories),
}));

export const membersRelations = relations(members, ({ one }) => ({
  organization: one(organizations, {
    fields: [members.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
}));

export const productsRelations = relations(products, ({ one }) => ({
  organization: one(organizations, {
    fields: [products.organizationId],
    references: [organizations.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [orders.organizationId],
    references: [organizations.id],
  }),
  items: many(orderItems),
  history: many(orderStatusHistory),
  webhooks: many(webhookLogs),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const orderStatusHistoryRelations = relations(orderStatusHistory, ({ one }) => ({
  order: one(orders, {
    fields: [orderStatusHistory.orderId],
    references: [orders.id],
  }),
}));

export const webhookLogsRelations = relations(webhookLogs, ({ one }) => ({
  order: one(orders, {
    fields: [webhookLogs.orderId],
    references: [orders.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ one }) => ({
  organization: one(organizations, {
    fields: [categories.organizationId],
    references: [organizations.id],
  }),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: 'category_parent',
  }),
}));
