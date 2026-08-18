import { Router, Request, Response } from 'express';
import { db } from './db.js';

export const apiRouter = Router();

// --- Auth Routes ---
apiRouter.post('/auth/google', (req: Request, res: Response) => {
  try {
    const { email, name, avatar } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required for Google Sign In' });
    }

    let user = db.getUserByEmail(email);
    if (!user) {
      user = db.createUser({
        name: name || email.split('@')[0],
        email,
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
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    let user = db.getUserByEmail(email);

    // Support quick demo logins or initial account creation
    if (!user) {
      if (email.includes('admin')) {
        user = db.createUser({
          name: 'Admin PCH',
          email,
          role: 'admin',
          status: 'active',
          phone: '+92 300 0000000',
        });
      } else {
        user = db.createUser({
          name: email.split('@')[0],
          email,
          role: 'customer',
          status: 'active',
          phone: '+92 300 1111111',
        });
      }
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ error: 'This account has been deactivated. Please contact support.' });
    }

    // In a real environment, verify hashed password
    const token = `token-${user.id}-${Date.now()}`;
    return res.json({
      user,
      token,
      message: 'Login successful',
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and Email are required' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const user = db.createUser({
      name,
      email,
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
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const token = authHeader.replace('Bearer ', '');
  const parts = token.split('-');
  const userId = parts.length >= 2 ? `${parts[1]}-${parts[2] || ''}` : '';

  const user = db.getUserById(userId) || db.getUsers()[0];
  if (!user) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  return res.json({ user });
});

apiRouter.post('/auth/logout', (_req: Request, res: Response) => {
  return res.json({ message: 'Logged out successfully' });
});

// --- Category Routes ---
apiRouter.get('/categories', (_req: Request, res: Response) => {
  try {
    const categories = db.getCategories();
    return res.json(categories);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/categories/:slugOrId', (req: Request, res: Response) => {
  const { slugOrId } = req.params;
  const category = db.getCategoryBySlug(slugOrId) || db.getCategoryById(slugOrId);
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }
  return res.json(category);
});

apiRouter.post('/categories', (req: Request, res: Response) => {
  try {
    const { name, slug, description, image, status } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    const catSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const category = db.createCategory({
      name,
      slug: catSlug,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      status: status || 'active',
    });
    return res.status(201).json(category);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/categories/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = db.updateCategory(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/categories/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = db.deleteCategory(id);
    if (!success) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.json({ success: true, message: 'Category deleted' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// --- Product Routes ---
apiRouter.get('/products', (req: Request, res: Response) => {
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
      sort,
      limit,
      page,
    } = req.query;

    const result = db.getProducts({
      categoryId: categoryId as string,
      categorySlug: categorySlug as string,
      search: search as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      size: size as string,
      color: color as string,
      inStock: inStock === 'true',
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      newArrival: newArrival === 'true' ? true : newArrival === 'false' ? false : undefined,
      status: status as any,
      sort: sort as any,
      limit: limit ? Number(limit) : undefined,
      page: page ? Number(page) : undefined,
    });

    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/products/top-selling', (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 8;
    const products = db.getTopSellingProducts(limit);
    return res.json(products);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/products/new-arrivals', (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 8;
    const products = db.getNewArrivals(limit);
    return res.json(products);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/products/featured', (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 8;
    const products = db.getFeaturedProducts(limit);
    return res.json(products);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/products/:slugOrId', (req: Request, res: Response) => {
  const { slugOrId } = req.params;
  const product = db.getProductBySlug(slugOrId) || db.getProductById(slugOrId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json(product);
});

apiRouter.post('/products', (req: Request, res: Response) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      discountPrice,
      stock,
      categoryId,
      subcategory,
      featured,
      newArrival,
      status,
      sku,
      fabric,
      material,
      color,
      collection,
      season,
      careInstructions,
      productCode,
      images,
      variants,
      seoTitle,
      seoDescription,
    } = req.body;

    if (!name || price === undefined || !categoryId) {
      return res.status(400).json({ error: 'Product name, price, and category are required' });
    }

    const prodSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProduct = db.createProduct({
      name,
      slug: prodSlug,
      description: description || '',
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      stock: Number(stock || 0),
      categoryId,
      subcategory,
      featured: Boolean(featured),
      newArrival: Boolean(newArrival),
      status: status || 'active',
      sku: sku || `PCH-${Math.floor(1000 + Math.random() * 9000)}`,
      fabric,
      material,
      color,
      collection,
      season,
      careInstructions,
      productCode: productCode || `PCH-${Date.now().toString().slice(-4)}`,
      images: images || [],
      variants: variants || [],
      seoTitle,
      seoDescription,
    });

    return res.status(201).json(newProduct);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/products/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = db.updateProduct(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/products/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = db.deleteProduct(id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json({ success: true, message: 'Product deleted' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// --- Reviews ---
apiRouter.get('/reviews', (req: Request, res: Response) => {
  try {
    const { productId, status, featured } = req.query;
    const reviews = db.getReviews({
      productId: productId as string,
      status: status as any,
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
    });
    return res.json(reviews);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/reviews', (req: Request, res: Response) => {
  try {
    const { productId, customerName, rating, comment, image, status, featured, userId } = req.body;
    if (!productId || !customerName || !rating || !comment) {
      return res.status(400).json({ error: 'Product, customer name, rating, and comment are required' });
    }

    const review = db.createReview({
      productId,
      customerName,
      rating: Number(rating),
      comment,
      image,
      userId,
      status: status || 'approved', // Auto-approved for customer convenience, admin can moderate
      featured: Boolean(featured),
    });

    return res.status(201).json(review);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/reviews/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = db.updateReview(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Review not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/reviews/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = db.deleteReview(id);
    if (!success) {
      return res.status(404).json({ error: 'Review not found' });
    }
    return res.json({ success: true, message: 'Review deleted' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// --- FAQs ---
apiRouter.get('/faqs', (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const faqs = db.getFAQs(status as any);
    return res.json(faqs);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/faqs', (req: Request, res: Response) => {
  try {
    const { question, answer, status, displayOrder } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }
    const faq = db.createFAQ({
      question,
      answer,
      status: status || 'active',
      displayOrder: displayOrder ? Number(displayOrder) : 99,
    });
    return res.status(201).json(faq);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/faqs/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = db.updateFAQ(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/faqs/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = db.deleteFAQ(id);
    if (!success) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    return res.json({ success: true, message: 'FAQ deleted' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// --- Orders ---
apiRouter.post('/orders', (req: Request, res: Response) => {
  try {
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      subtotal,
      discount,
      shipping,
      total,
      paymentMethod,
      paymentStatus,
      orderStatus,
      shippingAddress,
      items,
      notes,
    } = req.body;

    if (!customerName || !shippingAddress || !items || items.length === 0) {
      return res.status(400).json({ error: 'Customer details, shipping address, and order items are required' });
    }

    const order = db.createOrder({
      userId: userId || 'user-guest',
      customerName,
      customerEmail: customerEmail || 'guest@pch.pk',
      customerPhone: customerPhone || '',
      subtotal: Number(subtotal),
      discount: Number(discount || 0),
      shipping: Number(shipping || 0),
      total: Number(total),
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentStatus || (paymentMethod === 'online' ? 'paid' : 'pending'),
      orderStatus: orderStatus || 'pending',
      shippingAddress,
      items,
      notes,
    });

    return res.status(201).json(order);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to place order' });
  }
});

apiRouter.get('/orders', (req: Request, res: Response) => {
  try {
    const { userId, status, paymentStatus } = req.query;
    const orders = db.getOrders({
      userId: userId as string,
      status: status as string,
      paymentStatus: paymentStatus as string,
    });
    return res.json(orders);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/orders/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const order = db.getOrderById(id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  return res.json(order);
});

apiRouter.put('/admin/orders/:id/status', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;
    const order = db.updateOrderStatus(id, { orderStatus, paymentStatus });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    return res.json(order);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// --- Admin Customers & Dashboard ---
apiRouter.get('/admin/customers', (_req: Request, res: Response) => {
  try {
    const customers = db.getCustomers();
    return res.json(customers);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/admin/customers/:id/status', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = db.updateUserStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/admin/dashboard', (_req: Request, res: Response) => {
  try {
    const stats = db.getDashboardStats();
    return res.json(stats);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
