import { sql } from 'drizzle-orm';
import { db } from './index.ts';
import { categories, products, users, reviews, faqs, orders } from './schema.ts';
import { initialCategories, initialProducts, initialUsers, initialReviews, initialFAQs, initialOrders } from '../../server/db.ts';

export async function seedDatabaseIfNeeded() {
  try {
    // Check if categories are already present
    const [catCountResult] = await db.select({ count: sql<number>`count(*)::int` }).from(categories);
    const existingCount = catCountResult?.count || 0;

    if (existingCount > 0) {
      console.log(`Cloud SQL PostgreSQL already populated with ${existingCount} categories. Skipping full seed.`);
      // Make sure admin and current user exist in users table
      await ensureAdminAndUser();
      return;
    }

    console.log('Seeding Cloud SQL PostgreSQL database with authentic Pakistan Cloth House data...');

    // 1. Seed Categories
    for (const cat of initialCategories) {
      await db
        .insert(categories)
        .values({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image: cat.image,
          productCount: cat.productCount || 0,
          status: cat.status,
          createdAt: new Date(cat.createdAt),
          updatedAt: new Date(cat.updatedAt),
        })
        .onConflictDoNothing();
    }
    console.log(`Seeded ${initialCategories.length} categories.`);

    // 2. Seed Products
    for (const prod of initialProducts) {
      await db
        .insert(products)
        .values({
          id: prod.id,
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          price: prod.price,
          discountPrice: prod.discountPrice || null,
          stock: prod.stock,
          categoryId: prod.categoryId,
          categoryName: prod.categoryName || '',
          subcategory: prod.subcategory || '',
          featured: prod.featured,
          newArrival: prod.newArrival,
          status: prod.status,
          sku: prod.sku,
          fabric: prod.fabric || 'Lawn',
          material: prod.material || '',
          color: prod.color || '',
          collection: prod.collection || 'Summer 2026',
          season: prod.season || 'Summer',
          careInstructions: prod.careInstructions || '',
          productCode: prod.productCode || '',
          salesCount: prod.salesCount || 0,
          rating: prod.rating || 5.0,
          reviewCount: prod.reviewCount || 0,
          images: prod.images || [],
          variants: prod.variants || [],
          seoTitle: prod.seoTitle || prod.name,
          seoDescription: prod.seoDescription || prod.description,
          createdAt: new Date(prod.createdAt),
          updatedAt: new Date(prod.updatedAt),
        })
        .onConflictDoNothing();
    }
    console.log(`Seeded ${initialProducts.length} products.`);

    // 3. Seed Users
    for (const u of initialUsers) {
      await db
        .insert(users)
        .values({
          id: u.id,
          uid: u.id,
          name: u.name,
          email: u.email.toLowerCase().trim(),
          phone: u.phone || '',
          avatar: u.avatar || '',
          role: u.role,
          status: u.status,
          createdAt: new Date(u.createdAt),
          updatedAt: new Date(u.updatedAt),
        })
        .onConflictDoNothing();
    }
    console.log(`Seeded ${initialUsers.length} users.`);

    // 4. Seed Reviews
    for (const rev of initialReviews) {
      await db
        .insert(reviews)
        .values({
          id: rev.id,
          productId: rev.productId,
          productName: rev.productName || '',
          userId: rev.userId || null,
          customerName: rev.customerName,
          rating: rev.rating,
          comment: rev.comment,
          image: rev.image || null,
          status: rev.status,
          featured: rev.featured,
          createdAt: new Date(rev.createdAt),
        })
        .onConflictDoNothing();
    }
    console.log(`Seeded ${initialReviews.length} reviews.`);

    // 5. Seed FAQs
    for (const faq of initialFAQs) {
      await db
        .insert(faqs)
        .values({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          status: faq.status,
          displayOrder: faq.displayOrder,
          createdAt: new Date(faq.createdAt),
          updatedAt: new Date(faq.updatedAt),
        })
        .onConflictDoNothing();
    }
    console.log(`Seeded ${initialFAQs.length} FAQs.`);

    // 6. Seed Orders
    for (const ord of initialOrders) {
      await db
        .insert(orders)
        .values({
          id: ord.id,
          orderNumber: ord.orderNumber,
          userId: ord.userId,
          customerName: ord.customerName,
          customerEmail: ord.customerEmail,
          customerPhone: ord.customerPhone,
          subtotal: ord.subtotal,
          discount: ord.discount,
          shipping: ord.shipping,
          total: ord.total,
          paymentMethod: ord.paymentMethod,
          paymentStatus: ord.paymentStatus,
          orderStatus: ord.orderStatus,
          shippingAddress: ord.shippingAddress,
          items: ord.items,
          notes: ord.notes || '',
          createdAt: new Date(ord.createdAt),
          updatedAt: new Date(ord.updatedAt),
        })
        .onConflictDoNothing();
    }
    console.log(`Seeded ${initialOrders.length} orders.`);

    await ensureAdminAndUser();
    console.log('PostgreSQL database initialization complete!');
  } catch (err) {
    console.error('Error seeding PostgreSQL database:', err);
  }
}

async function ensureAdminAndUser() {
  try {
    // Ensure primary admin account exists in Cloud SQL
    await db
      .insert(users)
      .values({
        id: 'admin-pch-root',
        uid: 'admin-pch-root',
        name: 'Admin Pakistan Cloth House',
        email: 'admin@pch.pk',
        phone: '+92 300 0000000',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: 'admin',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing();

    // Ensure logged-in user email exists as customer
    await db
      .insert(users)
      .values({
        id: 'user-izaan',
        uid: 'user-izaan',
        name: 'Muhammad Izaan',
        email: 'muhammadizaan201@gmail.com',
        phone: '+92 300 1234567',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        role: 'customer',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing();
  } catch (e) {
    console.warn('Could not ensure default users:', e);
  }
}
