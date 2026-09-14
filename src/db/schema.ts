import { pgTable, text, integer, doublePrecision, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import type { ProductImage, ProductVariant, ShippingAddress, OrderItem } from '../types/index.js';

// 1. Users Table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID or unique user identifier
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  avatar: text('avatar'),
  role: text('role').default('customer').notNull(), // 'admin' | 'customer'
  status: text('status').default('active').notNull(), // 'active' | 'inactive'
  passwordHash: text('password_hash'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. Categories Table
export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  productCount: integer('product_count').default(0).notNull(),
  status: text('status').default('active').notNull(), // 'active' | 'inactive'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Products Table
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  price: integer('price').notNull(),
  discountPrice: integer('discount_price'),
  stock: integer('stock').default(0).notNull(),
  categoryId: text('category_id').references(() => categories.id),
  categoryName: text('category_name'),
  subcategory: text('subcategory'),
  featured: boolean('featured').default(false).notNull(),
  newArrival: boolean('new_arrival').default(false).notNull(),
  status: text('status').default('active').notNull(), // 'active' | 'inactive'
  sku: text('sku').notNull(),
  fabric: text('fabric'),
  material: text('material'),
  color: text('color'),
  collection: text('collection'),
  season: text('season'),
  careInstructions: text('care_instructions'),
  productCode: text('product_code'),
  salesCount: integer('sales_count').default(0).notNull(),
  rating: doublePrecision('rating').default(5.0).notNull(),
  reviewCount: integer('review_count').default(0).notNull(),
  images: jsonb('images').$type<ProductImage[]>().default([]).notNull(),
  variants: jsonb('variants').$type<ProductVariant[]>().default([]).notNull(),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 4. Orders Table
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  userId: text('user_id').notNull(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  subtotal: integer('subtotal').notNull(),
  discount: integer('discount').default(0).notNull(),
  shipping: integer('shipping').default(0).notNull(),
  total: integer('total').notNull(),
  paymentMethod: text('payment_method').notNull(), // 'cod' | 'online'
  paymentStatus: text('payment_status').default('pending').notNull(), // 'pending' | 'paid' | 'failed' | 'refunded'
  orderStatus: text('order_status').default('pending').notNull(), // 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: jsonb('shipping_address').$type<ShippingAddress>().notNull(),
  items: jsonb('items').$type<OrderItem[]>().notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 5. Reviews Table
export const reviews = pgTable('reviews', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull(),
  productName: text('product_name'),
  userId: text('user_id'),
  customerName: text('customer_name').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment').notNull(),
  image: text('image'),
  status: text('status').default('approved').notNull(), // 'approved' | 'pending' | 'rejected'
  featured: boolean('featured').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 6. FAQs Table
export const faqs = pgTable('faqs', {
  id: text('id').primaryKey(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  status: text('status').default('active').notNull(), // 'active' | 'inactive'
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
