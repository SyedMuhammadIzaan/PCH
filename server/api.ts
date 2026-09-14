import { Router, Request, Response } from 'express';
import * as repo from '../src/db/repository.ts';

export const apiRouter = Router();

// --- Auth Routes ---
apiRouter.post('/auth/google', async (req: Request, res: Response) => {
  try {
    const { email, name, avatar } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required for Google Sign In' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await repo.getUserByEmail(cleanEmail);

    if (!user) {
      user = await repo.createUser({
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        role: 'customer',
        status: 'active',
        phone: '+92 300 1234567',
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ error: 'This account has been deactivated. Please contact support.' });
    }

    const token = `token-${user.id}-${Date.now()}`;
    return res.json({
      user,
      token,
      message: 'Google Sign In successful',
    });
  } catch (err: any) {
    console.error('Error in /auth/google:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await repo.getUserByEmail(cleanEmail);

    // Support quick demo logins or initial account creation
    if (!user) {
      if (cleanEmail.includes('admin')) {
        user = await repo.createUser({
          name: 'Admin PCH',
          email: cleanEmail,
          role: 'admin',
          status: 'active',
          phone: '+92 300 0000000',
        });
      } else {
        user = await repo.createUser({
          name: cleanEmail.split('@')[0],
          email: cleanEmail,
          role: 'customer',
          status: 'active',
          phone: '+92 300 1111111',
        });
      }
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ error: 'This account has been deactivated. Please contact support.' });
    }

    const token = `token-${user.id}-${Date.now()}`;
    return res.json({
      user,
      token,
      message: 'Login successful',
    });
  } catch (err: any) {
    console.error('Error in /auth/login:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

apiRouter.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and Email are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await repo.getUserByEmail(cleanEmail);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const user = await repo.createUser({
      name,
      email: cleanEmail,
      phone: phone || '',
      role: 'customer',
      status: 'active',
    });

    const token = `token-${user.id}-${Date.now()}`;
    return res.status(201).json({
      user,
      token,
      message: 'Account registered successfully',
    });
  } catch (err: any) {
    console.error('Error in /auth/register:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

apiRouter.get('/auth/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    let user = null;

    if (token.startsWith('token-')) {
      const parts = token.split('-');
      // Format: token-<id>-timestamp
      const userId = parts.slice(1, -1).join('-');
      if (userId) {
        user = await repo.getUserById(userId);
      }
    }

    if (!user) {
      const allUsers = await repo.getAllUsers();
      user = allUsers[0] || null;
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    return res.json({ user });
  } catch (err: any) {
    console.error('Error in /auth/me:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

apiRouter.post('/auth/logout', (_req: Request, res: Response) => {
  return res.json({ message: 'Logged out successfully' });
});

// --- Category Routes ---
apiRouter.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await repo.getCategories();
    return res.json(categories);
  } catch (err: any) {
    console.error('Error in GET /categories:', err);
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/categories/:slugOrId', async (req: Request, res: Response) => {
  try {
    const { slugOrId } = req.params;
    let category = await repo.getCategoryBySlug(slugOrId);
    if (!category) {
      category = await repo.getCategoryById(slugOrId);
    }
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.json(category);
  } catch (err: any) {
    console.error('Error in GET /categories/:slugOrId:', err);
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/categories', async (req: Request, res: Response) => {
  try {
    const { name, slug, description, image, status } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    const catSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const category = await repo.createCategory({
      name,
      slug: catSlug,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      status: status || 'active',
    });
    return res.status(201).json(category);
  } catch (err: any) {
    console.error('Error in POST /categories:', err);
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/categories/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await repo.updateCategory(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    console.error('Error in PUT /categories/:id:', err);
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/categories/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await repo.deleteCategory(id);
    if (!success) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.json({ success: true, message: 'Category deleted' });
  } catch (err: any) {
    console.error('Error in DELETE /categories/:id:', err);
    return res.status(500).json({ error: err.message });
  }
});

// --- Product Routes ---
apiRouter.get('/products', async (req: Request, res: Response) => {
  try {
    const {
      categoryId,
      categorySlug,
      search,
      minPrice,
      maxPrice,
      size,
      color,
      inStock,
      featured,
      newArrival,
      status,
      fabric,
      season,
      collection,
      sort,
      limit,
      page,
    } = req.query;

    let targetCategoryId = categoryId as string;
    if (!targetCategoryId && categorySlug) {
      const cat = await repo.getCategoryBySlug(categorySlug as string);
      if (cat) targetCategoryId = cat.id;
    }

    const result = await repo.getProducts({
      categoryId: targetCategoryId,
      search: search as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      size: size as string,
      color: color as string,
      inStock: inStock === 'true',
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      newArrival: newArrival === 'true' ? true : newArrival === 'false' ? false : undefined,
      status: status as any,
      fabric: fabric as string,
      season: season as string,
      collection: collection as string,
      sort: sort as any,
      limit: limit ? Number(limit) : undefined,
      page: page ? Number(page) : undefined,
    });

    return res.json(result);
  } catch (err: any) {
    console.error('Error in GET /products:', err);
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/products/top-selling', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 8;
    const result = await repo.getProducts({
      sort: 'popular',
      limit,
    });
    return res.json(result.products);
  } catch (err: any) {
    console.error('Error in GET /products/top-selling:', err);
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/products/new-arrivals', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 8;
    const result = await repo.getProducts({
      newArrival: true,
      sort: 'newest',
      limit,
    });
    return res.json(result.products);
  } catch (err: any) {
    console.error('Error in GET /products/new-arrivals:', err);
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/products/featured', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 8;
    const result = await repo.getProducts({
      featured: true,
      limit,
    });
    return res.json(result.products);
  } catch (err: any) {
    console.error('Error in GET /products/featured:', err);
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/products/:slugOrId', async (req: Request, res: Response) => {
  try {
    const { slugOrId } = req.params;
    let product = await repo.getProductBySlug(slugOrId);
    if (!product) {
      product = await repo.getProductById(slugOrId);
    }
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json(product);
  } catch (err: any) {
    console.error('Error in GET /products/:slugOrId:', err);
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/products', async (req: Request, res: Response) => {
  try {
    const product = await repo.createProduct(req.body);
    return res.status(201).json(product);
  } catch (err: any) {
    console.error('Error in POST /products:', err);
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await repo.updateProduct(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    console.error('Error in PUT /products/:id:', err);
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await repo.deleteProduct(id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json({ success: true, message: 'Product deleted' });
  } catch (err: any) {
    console.error('Error in DELETE /products/:id:', err);
    return res.status(500).json({ error: err.message });
  }
});

// --- Order Routes ---
apiRouter.get('/orders', async (req: Request, res: Response) => {
  try {
    const { userId, status } = req.query;
    const orders = await repo.getOrders({
      userId: userId as string,
      status: status as string,
    });
    return res.json(orders);
  } catch (err: any) {
    console.error('Error in GET /orders:', err);
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/orders/:idOrNumber', async (req: Request, res: Response) => {
  try {
    const { idOrNumber } = req.params;
    let order = await repo.getOrderById(idOrNumber);
    if (!order) {
      order = await repo.getOrderByNumber(idOrNumber);
    }
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    return res.json(order);
  } catch (err: any) {
    console.error('Error in GET /orders/:idOrNumber:', err);
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/orders', async (req: Request, res: Response) => {
  try {
    const order = await repo.createOrder(req.body);
    return res.status(201).json(order);
  } catch (err: any) {
    console.error('Error in POST /orders:', err);
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/orders/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;
    const updated = await repo.updateOrderStatus(id, orderStatus, paymentStatus);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    console.error('Error in PUT /orders/:id/status:', err);
    return res.status(500).json({ error: err.message });
  }
});

// --- Review Routes ---
apiRouter.get('/reviews', async (req: Request, res: Response) => {
  try {
    const { productId, status, featured } = req.query;
    let reviewsList = await repo.getReviews(productId as string);
    if (status) {
      reviewsList = reviewsList.filter((r) => r.status === status);
    }
    if (featured === 'true') {
      reviewsList = reviewsList.filter((r) => r.featured);
    }
    return res.json(reviewsList);
  } catch (err: any) {
    console.error('Error in GET /reviews:', err);
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/reviews', async (req: Request, res: Response) => {
  try {
    const review = await repo.createReview(req.body);
    return res.status(201).json(review);
  } catch (err: any) {
    console.error('Error in POST /reviews:', err);
    return res.status(500).json({ error: err.message });
  }
});

// --- FAQ Routes ---
apiRouter.get('/faqs', async (_req: Request, res: Response) => {
  try {
    const faqs = await repo.getFaqs();
    return res.json(faqs);
  } catch (err: any) {
    console.error('Error in GET /faqs:', err);
    return res.status(500).json({ error: err.message });
  }
});

// --- Admin Stats and Management Routes ---
apiRouter.get('/admin/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await repo.getDashboardStats();
    return res.json(stats);
  } catch (err: any) {
    console.error('Error in GET /admin/stats:', err);
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/admin/dashboard', async (_req: Request, res: Response) => {
  try {
    const stats = await repo.getDashboardStats();
    return res.json(stats);
  } catch (err: any) {
    console.error('Error in GET /admin/dashboard:', err);
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/admin/users', async (_req: Request, res: Response) => {
  try {
    const users = await repo.getAllUsers();
    return res.json(users);
  } catch (err: any) {
    console.error('Error in GET /admin/users:', err);
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/admin/customers', async (_req: Request, res: Response) => {
  try {
    const users = await repo.getAllUsers();
    return res.json(users);
  } catch (err: any) {
    console.error('Error in GET /admin/customers:', err);
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/admin/customers/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await repo.updateUser(id, { status });
    if (!updated) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    console.error('Error in PUT /admin/customers/:id/status:', err);
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/admin/orders/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;
    const updated = await repo.updateOrderStatus(id, orderStatus, paymentStatus);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    console.error('Error in PUT /admin/orders/:id/status:', err);
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/admin/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await repo.updateUser(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    console.error('Error in PUT /admin/users/:id:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Cloud SQL PostgreSQL Connection Health Check
apiRouter.get('/admin/db-status', async (_req: Request, res: Response) => {
  try {
    const stats = await repo.getDashboardStats();
    return res.json({
      status: 'connected',
      database: 'PostgreSQL (Cloud SQL)',
      counts: {
        products: stats.totalProducts,
        categories: stats.totalCategories,
        orders: stats.totalOrders,
        users: stats.totalCustomers,
      },
      time: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({
      status: 'error',
      database: 'PostgreSQL (Cloud SQL)',
      error: err.message,
    });
  }
});
