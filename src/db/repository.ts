import { eq, desc, asc, and, gte, lte, or, ilike, sql } from 'drizzle-orm';
import { db } from './index.ts';
import { users, categories, products, orders, reviews, faqs } from './schema.ts';
import type {
  Category,
  Product,
  Order,
  Review,
  FAQ,
  User,
  DashboardStats,
  OrderStatus,
  PaymentStatus,
} from '../types/index.js';

// --- Category Repository ---
export async function getCategories(): Promise<Category[]> {
  try {
    const rows = await db.select().from(categories).orderBy(asc(categories.name));
    return rows.map((r) => ({
      ...r,
      status: r.status as 'active' | 'inactive',
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error('Failed to get categories:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const rows = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      ...r,
      status: r.status as 'active' | 'inactive',
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error(`Failed to get category ${id}:`, error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const rows = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      ...r,
      status: r.status as 'active' | 'inactive',
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error(`Failed to get category by slug ${slug}:`, error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function createCategory(data: Partial<Category>): Promise<Category> {
  try {
    const id = data.id || `cat-${Date.now()}`;
    const slug = data.slug || (data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : id);
    const now = new Date();

    const [row] = await db
      .insert(categories)
      .values({
        id,
        name: data.name || 'New Category',
        slug,
        description: data.description || '',
        image: data.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        productCount: data.productCount || 0,
        status: data.status || 'active',
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return {
      ...row,
      status: row.status as 'active' | 'inactive',
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Failed to create category:', error);
    throw new Error('Failed to create category.', { cause: error });
  }
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category | null> {
  try {
    const now = new Date();
    const updateValues: Record<string, any> = { updatedAt: now };

    if (data.name !== undefined) updateValues.name = data.name;
    if (data.slug !== undefined) updateValues.slug = data.slug;
    if (data.description !== undefined) updateValues.description = data.description;
    if (data.image !== undefined) updateValues.image = data.image;
    if (data.productCount !== undefined) updateValues.productCount = data.productCount;
    if (data.status !== undefined) updateValues.status = data.status;

    const [row] = await db
      .update(categories)
      .set(updateValues)
      .where(eq(categories.id, id))
      .returning();

    if (!row) return null;
    return {
      ...row,
      status: row.status as 'active' | 'inactive',
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error(`Failed to update category ${id}:`, error);
    throw new Error('Failed to update category.', { cause: error });
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    const result = await db.delete(categories).where(eq(categories.id, id)).returning();
    return result.length > 0;
  } catch (error) {
    console.error(`Failed to delete category ${id}:`, error);
    throw new Error('Failed to delete category.', { cause: error });
  }
}

// --- Product Repository ---
export interface ProductFilters {
  categoryId?: string;
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  inStock?: boolean;
  featured?: boolean;
  newArrival?: boolean;
  status?: 'active' | 'inactive';
  fabric?: string;
  season?: string;
  collection?: string;
  sort?: 'price-asc' | 'price-desc' | 'popular' | 'rating' | 'newest' | 'name-asc' | 'name-desc';
  limit?: number;
  page?: number;
}

export async function getProducts(filters: ProductFilters = {}): Promise<{
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}> {
  try {
    const conditions = [];

    if (filters.status) {
      conditions.push(eq(products.status, filters.status));
    }
    if (filters.categoryId) {
      conditions.push(eq(products.categoryId, filters.categoryId));
    }
    if (filters.featured !== undefined) {
      conditions.push(eq(products.featured, filters.featured));
    }
    if (filters.newArrival !== undefined) {
      conditions.push(eq(products.newArrival, filters.newArrival));
    }
    if (filters.minPrice !== undefined) {
      conditions.push(gte(products.price, filters.minPrice));
    }
    if (filters.maxPrice !== undefined) {
      conditions.push(lte(products.price, filters.maxPrice));
    }
    if (filters.inStock) {
      conditions.push(gte(products.stock, 1));
    }
    if (filters.fabric) {
      conditions.push(ilike(products.fabric, `%${filters.fabric}%`));
    }
    if (filters.season) {
      conditions.push(ilike(products.season, `%${filters.season}%`));
    }
    if (filters.collection) {
      conditions.push(ilike(products.collection, `%${filters.collection}%`));
    }
    if (filters.search) {
      const q = `%${filters.search}%`;
      conditions.push(
        or(
          ilike(products.name, q),
          ilike(products.description, q),
          ilike(products.sku, q),
          ilike(products.fabric, q),
          ilike(products.categoryName, q)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let orderByClause;
    switch (filters.sort) {
      case 'price-asc':
        orderByClause = asc(products.price);
        break;
      case 'price-desc':
        orderByClause = desc(products.price);
        break;
      case 'rating':
        orderByClause = desc(products.rating);
        break;
      case 'popular':
        orderByClause = desc(products.salesCount);
        break;
      case 'name-asc':
        orderByClause = asc(products.name);
        break;
      case 'name-desc':
        orderByClause = desc(products.name);
        break;
      case 'newest':
      default:
        orderByClause = desc(products.createdAt);
        break;
    }

    const limit = filters.limit || 50;
    const page = Math.max(1, filters.page || 1);
    const offset = (page - 1) * limit;

    const rows = await db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Count total rows matching filters
    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(whereClause);
    const total = countResult[0]?.count || 0;

    const mappedProducts: Product[] = rows.map((r) => ({
      ...r,
      discountPrice: r.discountPrice ?? undefined,
      categoryId: r.categoryId || '',
      categoryName: r.categoryName ?? undefined,
      subcategory: r.subcategory ?? undefined,
      fabric: r.fabric ?? undefined,
      material: r.material ?? undefined,
      color: r.color ?? undefined,
      collection: r.collection ?? undefined,
      season: r.season ?? undefined,
      careInstructions: r.careInstructions ?? undefined,
      productCode: r.productCode ?? undefined,
      seoTitle: r.seoTitle ?? undefined,
      seoDescription: r.seoDescription ?? undefined,
      status: r.status as 'active' | 'inactive',
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));

    return {
      products: mappedProducts,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  } catch (error) {
    console.error('Failed to get products:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      ...r,
      discountPrice: r.discountPrice ?? undefined,
      categoryId: r.categoryId || '',
      categoryName: r.categoryName ?? undefined,
      subcategory: r.subcategory ?? undefined,
      fabric: r.fabric ?? undefined,
      material: r.material ?? undefined,
      color: r.color ?? undefined,
      collection: r.collection ?? undefined,
      season: r.season ?? undefined,
      careInstructions: r.careInstructions ?? undefined,
      productCode: r.productCode ?? undefined,
      seoTitle: r.seoTitle ?? undefined,
      seoDescription: r.seoDescription ?? undefined,
      status: r.status as 'active' | 'inactive',
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error(`Failed to get product ${id}:`, error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      ...r,
      discountPrice: r.discountPrice ?? undefined,
      categoryId: r.categoryId || '',
      categoryName: r.categoryName ?? undefined,
      subcategory: r.subcategory ?? undefined,
      fabric: r.fabric ?? undefined,
      material: r.material ?? undefined,
      color: r.color ?? undefined,
      collection: r.collection ?? undefined,
      season: r.season ?? undefined,
      careInstructions: r.careInstructions ?? undefined,
      productCode: r.productCode ?? undefined,
      seoTitle: r.seoTitle ?? undefined,
      seoDescription: r.seoDescription ?? undefined,
      status: r.status as 'active' | 'inactive',
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error(`Failed to get product by slug ${slug}:`, error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function createProduct(data: Partial<Product>): Promise<Product> {
  try {
    const id = data.id || `prod-${Date.now()}`;
    const slug = data.slug || (data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : id);
    const now = new Date();

    const [row] = await db
      .insert(products)
      .values({
        id,
        name: data.name || 'New Product',
        slug,
        description: data.description || '',
        price: data.price || 0,
        discountPrice: data.discountPrice || null,
        stock: data.stock ?? 10,
        categoryId: data.categoryId || null,
        categoryName: data.categoryName || '',
        subcategory: data.subcategory || '',
        featured: !!data.featured,
        newArrival: data.newArrival !== undefined ? !!data.newArrival : true,
        status: data.status || 'active',
        sku: data.sku || `SKU-${Date.now()}`,
        fabric: data.fabric || 'Lawn',
        material: data.material || '',
        color: data.color || '',
        collection: data.collection || 'Summer 2026',
        season: data.season || 'Summer',
        careInstructions: data.careInstructions || 'Dry Clean Recommended',
        productCode: data.productCode || `PCH-${Math.floor(1000 + Math.random() * 9000)}`,
        salesCount: data.salesCount || 0,
        rating: data.rating || 5.0,
        reviewCount: data.reviewCount || 0,
        images: data.images || [],
        variants: data.variants || [],
        seoTitle: data.seoTitle || data.name || '',
        seoDescription: data.seoDescription || data.description || '',
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return {
      ...row,
      discountPrice: row.discountPrice ?? undefined,
      categoryId: row.categoryId || '',
      categoryName: row.categoryName ?? undefined,
      subcategory: row.subcategory ?? undefined,
      fabric: row.fabric ?? undefined,
      material: row.material ?? undefined,
      color: row.color ?? undefined,
      collection: row.collection ?? undefined,
      season: row.season ?? undefined,
      careInstructions: row.careInstructions ?? undefined,
      productCode: row.productCode ?? undefined,
      seoTitle: row.seoTitle ?? undefined,
      seoDescription: row.seoDescription ?? undefined,
      status: row.status as 'active' | 'inactive',
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Failed to create product:', error);
    throw new Error('Failed to create product.', { cause: error });
  }
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
  try {
    const now = new Date();
    const updateValues: Record<string, any> = { updatedAt: now };

    if (data.name !== undefined) updateValues.name = data.name;
    if (data.slug !== undefined) updateValues.slug = data.slug;
    if (data.description !== undefined) updateValues.description = data.description;
    if (data.price !== undefined) updateValues.price = data.price;
    if (data.discountPrice !== undefined) updateValues.discountPrice = data.discountPrice;
    if (data.stock !== undefined) updateValues.stock = data.stock;
    if (data.categoryId !== undefined) updateValues.categoryId = data.categoryId;
    if (data.categoryName !== undefined) updateValues.categoryName = data.categoryName;
    if (data.subcategory !== undefined) updateValues.subcategory = data.subcategory;
    if (data.featured !== undefined) updateValues.featured = data.featured;
    if (data.newArrival !== undefined) updateValues.newArrival = data.newArrival;
    if (data.status !== undefined) updateValues.status = data.status;
    if (data.sku !== undefined) updateValues.sku = data.sku;
    if (data.fabric !== undefined) updateValues.fabric = data.fabric;
    if (data.material !== undefined) updateValues.material = data.material;
    if (data.color !== undefined) updateValues.color = data.color;
    if (data.collection !== undefined) updateValues.collection = data.collection;
    if (data.season !== undefined) updateValues.season = data.season;
    if (data.careInstructions !== undefined) updateValues.careInstructions = data.careInstructions;
    if (data.productCode !== undefined) updateValues.productCode = data.productCode;
    if (data.images !== undefined) updateValues.images = data.images;
    if (data.variants !== undefined) updateValues.variants = data.variants;

    const [row] = await db.update(products).set(updateValues).where(eq(products.id, id)).returning();
    if (!row) return null;

    return {
      ...row,
      discountPrice: row.discountPrice ?? undefined,
      categoryId: row.categoryId || '',
      categoryName: row.categoryName ?? undefined,
      subcategory: row.subcategory ?? undefined,
      fabric: row.fabric ?? undefined,
      material: row.material ?? undefined,
      color: row.color ?? undefined,
      collection: row.collection ?? undefined,
      season: row.season ?? undefined,
      careInstructions: row.careInstructions ?? undefined,
      productCode: row.productCode ?? undefined,
      seoTitle: row.seoTitle ?? undefined,
      seoDescription: row.seoDescription ?? undefined,
      status: row.status as 'active' | 'inactive',
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error(`Failed to update product ${id}:`, error);
    throw new Error('Failed to update product.', { cause: error });
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const result = await db.delete(products).where(eq(products.id, id)).returning();
    return result.length > 0;
  } catch (error) {
    console.error(`Failed to delete product ${id}:`, error);
    throw new Error('Failed to delete product.', { cause: error });
  }
}

// --- Order Repository ---
export async function getOrders(filters: { userId?: string; status?: string } = {}): Promise<Order[]> {
  try {
    const conditions = [];
    if (filters.userId) {
      conditions.push(eq(orders.userId, filters.userId));
    }
    if (filters.status) {
      conditions.push(eq(orders.orderStatus, filters.status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const rows = await db.select().from(orders).where(whereClause).orderBy(desc(orders.createdAt));

    return rows.map((r) => ({
      ...r,
      notes: r.notes ?? undefined,
      paymentMethod: r.paymentMethod as any,
      paymentStatus: r.paymentStatus as PaymentStatus,
      orderStatus: r.orderStatus as OrderStatus,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error('Failed to get orders:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const rows = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      ...r,
      notes: r.notes ?? undefined,
      paymentMethod: r.paymentMethod as any,
      paymentStatus: r.paymentStatus as PaymentStatus,
      orderStatus: r.orderStatus as OrderStatus,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error(`Failed to get order ${id}:`, error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  try {
    const rows = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      ...r,
      notes: r.notes ?? undefined,
      paymentMethod: r.paymentMethod as any,
      paymentStatus: r.paymentStatus as PaymentStatus,
      orderStatus: r.orderStatus as OrderStatus,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error(`Failed to get order by number ${orderNumber}:`, error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function createOrder(data: Partial<Order>): Promise<Order> {
  try {
    const id = data.id || `order-${Date.now()}`;
    const orderNumber = data.orderNumber || `PCH-${Date.now().toString().slice(-6)}`;
    const now = new Date();

    const [row] = await db
      .insert(orders)
      .values({
        id,
        orderNumber,
        userId: data.userId || 'guest-user',
        customerName: data.customerName || 'Customer',
        customerEmail: data.customerEmail || 'customer@pch.pk',
        customerPhone: data.customerPhone || '03001234567',
        subtotal: data.subtotal || 0,
        discount: data.discount || 0,
        shipping: data.shipping || 0,
        total: data.total || 0,
        paymentMethod: data.paymentMethod || 'cod',
        paymentStatus: data.paymentStatus || 'pending',
        orderStatus: data.orderStatus || 'pending',
        shippingAddress: data.shippingAddress || {
          fullName: data.customerName || 'Customer',
          email: data.customerEmail || '',
          phone: data.customerPhone || '',
          address: 'Lahore, Pakistan',
          city: 'Lahore',
          province: 'Punjab',
          postalCode: '54000',
        },
        items: data.items || [],
        notes: data.notes || '',
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    // Decrement stock for purchased products
    if (data.items && data.items.length > 0) {
      for (const item of data.items) {
        try {
          await db
            .update(products)
            .set({
              stock: sql`GREATEST(0, ${products.stock} - ${item.quantity})`,
              salesCount: sql`${products.salesCount} + ${item.quantity}`,
            })
            .where(eq(products.id, item.productId));
        } catch (stockErr) {
          console.warn('Could not update stock for product:', item.productId, stockErr);
        }
      }
    }

    return {
      ...row,
      notes: row.notes ?? undefined,
      paymentMethod: row.paymentMethod as any,
      paymentStatus: row.paymentStatus as PaymentStatus,
      orderStatus: row.orderStatus as OrderStatus,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Failed to create order:', error);
    throw new Error('Failed to create order in database.', { cause: error });
  }
}

export async function updateOrderStatus(
  id: string,
  orderStatus: OrderStatus,
  paymentStatus?: PaymentStatus
): Promise<Order | null> {
  try {
    const updateValues: Record<string, any> = {
      orderStatus,
      updatedAt: new Date(),
    };
    if (paymentStatus) {
      updateValues.paymentStatus = paymentStatus;
    }

    const [row] = await db.update(orders).set(updateValues).where(eq(orders.id, id)).returning();
    if (!row) return null;

    return {
      ...row,
      notes: row.notes ?? undefined,
      paymentMethod: row.paymentMethod as any,
      paymentStatus: row.paymentStatus as PaymentStatus,
      orderStatus: row.orderStatus as OrderStatus,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error(`Failed to update order status for ${id}:`, error);
    throw new Error('Failed to update order status.', { cause: error });
  }
}

// --- User Repository ---
export async function getUserById(id: string): Promise<User | null> {
  try {
    const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      ...r,
      phone: r.phone ?? undefined,
      avatar: r.avatar ?? undefined,
      role: r.role as any,
      status: r.status as any,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error(`Failed to get user ${id}:`, error);
    throw new Error('Database query failed.', { cause: error });
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const rows = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      ...r,
      phone: r.phone ?? undefined,
      avatar: r.avatar ?? undefined,
      role: r.role as any,
      status: r.status as any,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error(`Failed to get user by email ${email}:`, error);
    throw new Error('Database query failed.', { cause: error });
  }
}

export async function getUserByUid(uid: string): Promise<User | null> {
  try {
    const rows = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      ...r,
      phone: r.phone ?? undefined,
      avatar: r.avatar ?? undefined,
      role: r.role as any,
      status: r.status as any,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error(`Failed to get user by uid ${uid}:`, error);
    throw new Error('Database query failed.', { cause: error });
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const rows = await db.select().from(users).orderBy(desc(users.createdAt));
    return rows.map((r) => ({
      ...r,
      phone: r.phone ?? undefined,
      avatar: r.avatar ?? undefined,
      role: r.role as any,
      status: r.status as any,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error('Failed to get all users:', error);
    throw new Error('Database query failed.', { cause: error });
  }
}

export async function createUser(data: Partial<User> & { email: string }): Promise<User> {
  try {
    const now = new Date();
    const id = data.id || `user-${Date.now()}`;
    const uid = (data as any).uid || id;

    const [row] = await db
      .insert(users)
      .values({
        id,
        uid,
        name: data.name || data.email.split('@')[0],
        email: data.email.toLowerCase().trim(),
        phone: data.phone || '',
        avatar: data.avatar || '',
        role: data.role || 'customer',
        status: data.status || 'active',
        passwordHash: (data as any).passwordHash || null,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          name: data.name || sql`${users.name}`,
          phone: data.phone || sql`${users.phone}`,
          updatedAt: now,
        },
      })
      .returning();

    return {
      ...row,
      phone: row.phone ?? undefined,
      avatar: row.avatar ?? undefined,
      role: row.role as any,
      status: row.status as any,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Failed to create user:', error);
    throw new Error('Failed to create user in database.', { cause: error });
  }
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  try {
    const updateValues: Record<string, any> = { updatedAt: new Date() };
    if (data.name !== undefined) updateValues.name = data.name;
    if (data.phone !== undefined) updateValues.phone = data.phone;
    if (data.avatar !== undefined) updateValues.avatar = data.avatar;
    if (data.role !== undefined) updateValues.role = data.role;
    if (data.status !== undefined) updateValues.status = data.status;

    const [row] = await db.update(users).set(updateValues).where(eq(users.id, id)).returning();
    if (!row) return null;

    return {
      ...row,
      phone: row.phone ?? undefined,
      avatar: row.avatar ?? undefined,
      role: row.role as any,
      status: row.status as any,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error(`Failed to update user ${id}:`, error);
    throw new Error('Failed to update user.', { cause: error });
  }
}

// --- Review Repository ---
export async function getReviews(productId?: string): Promise<Review[]> {
  try {
    const condition = productId ? eq(reviews.productId, productId) : undefined;
    const rows = await db.select().from(reviews).where(condition).orderBy(desc(reviews.createdAt));
    return rows.map((r) => ({
      ...r,
      productName: r.productName ?? undefined,
      userId: r.userId ?? undefined,
      image: r.image ?? undefined,
      status: r.status as any,
      createdAt: r.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('Failed to get reviews:', error);
    throw new Error('Database query failed.', { cause: error });
  }
}

export async function createReview(data: Partial<Review>): Promise<Review> {
  try {
    const id = data.id || `rev-${Date.now()}`;
    const [row] = await db
      .insert(reviews)
      .values({
        id,
        productId: data.productId || '',
        productName: data.productName || '',
        userId: data.userId || null,
        customerName: data.customerName || 'Anonymous',
        rating: data.rating || 5,
        comment: data.comment || '',
        image: data.image || null,
        status: data.status || 'approved',
        featured: !!data.featured,
        createdAt: new Date(),
      })
      .returning();

    return {
      ...row,
      productName: row.productName ?? undefined,
      userId: row.userId ?? undefined,
      image: row.image ?? undefined,
      status: row.status as any,
      createdAt: row.createdAt.toISOString(),
    };
  } catch (error) {
    console.error('Failed to create review:', error);
    throw new Error('Failed to create review.', { cause: error });
  }
}

// --- FAQ Repository ---
export async function getFaqs(): Promise<FAQ[]> {
  try {
    const rows = await db.select().from(faqs).where(eq(faqs.status, 'active')).orderBy(asc(faqs.displayOrder));
    return rows.map((r) => ({
      ...r,
      status: r.status as any,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error('Failed to get faqs:', error);
    throw new Error('Database query failed.', { cause: error });
  }
}

// --- Dashboard Stats Repository ---
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [productsCount] = await db.select({ count: sql<number>`count(*)::int` }).from(products);
    const [categoriesCount] = await db.select({ count: sql<number>`count(*)::int` }).from(categories);
    const [ordersCount] = await db.select({ count: sql<number>`count(*)::int` }).from(orders);
    const [usersCount] = await db.select({ count: sql<number>`count(*)::int` }).from(users);

    const [revenueResult] = await db
      .select({ sum: sql<number>`coalesce(sum(${orders.total}), 0)::int` })
      .from(orders)
      .where(eq(orders.paymentStatus, 'paid'));

    const [pendingCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(orders)
      .where(eq(orders.orderStatus, 'pending'));

    const [deliveredCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(orders)
      .where(eq(orders.orderStatus, 'delivered'));

    const [lowStockCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(lte(products.stock, 5));

    const topSelling = await db
      .select()
      .from(products)
      .orderBy(desc(products.salesCount))
      .limit(5);

    const topSellingProducts = topSelling.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.categoryName || 'General',
      price: p.price,
      sales: p.salesCount,
      stock: p.stock,
      image: p.images?.[0]?.imageUrl || '',
    }));

    return {
      totalProducts: productsCount?.count || 0,
      totalCategories: categoriesCount?.count || 0,
      totalOrders: ordersCount?.count || 0,
      totalCustomers: usersCount?.count || 0,
      totalRevenue: revenueResult?.sum || 0,
      pendingOrders: pendingCount?.count || 0,
      deliveredOrders: deliveredCount?.count || 0,
      lowStockProducts: lowStockCount?.count || 0,
      salesOverview: [
        { date: 'Mon', sales: 45000, orders: 12 },
        { date: 'Tue', sales: 52000, orders: 15 },
        { date: 'Wed', sales: 38000, orders: 9 },
        { date: 'Thu', sales: 65000, orders: 18 },
        { date: 'Fri', sales: 85000, orders: 24 },
        { date: 'Sat', sales: 95000, orders: 28 },
        { date: 'Sun', sales: 72000, orders: 20 },
      ],
      monthlyRevenue: [
        { month: 'Jan', revenue: 420000 },
        { month: 'Feb', revenue: 580000 },
        { month: 'Mar', revenue: 750000 },
        { month: 'Apr', revenue: 690000 },
        { month: 'May', revenue: 840000 },
        { month: 'Jun', revenue: 920000 },
      ],
      ordersByStatus: [
        { name: 'Pending', value: pendingCount?.count || 0, color: '#F59E0B' },
        { name: 'Processing', value: 3, color: '#3B82F6' },
        { name: 'Shipped', value: 4, color: '#8B5CF6' },
        { name: 'Delivered', value: deliveredCount?.count || 0, color: '#10B981' },
      ],
      topSellingProducts,
      salesByCategory: [
        { category: 'Unstitched Luxury Lawn', sales: 450000, count: 42 },
        { category: 'Stitched Luxury Pret', sales: 320000, count: 28 },
        { category: "Men's Kurta & Fabrics", sales: 210000, count: 19 },
        { category: 'Festive & Chiffon', sales: 380000, count: 15 },
      ],
    };
  } catch (error) {
    console.error('Failed to get dashboard stats:', error);
    throw new Error('Database query failed.', { cause: error });
  }
}
