import {
  Product,
  Category,
  Review,
  FAQ,
  Order,
  DashboardStats,
  User,
} from '../types/index.js';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('pch_auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  async loginWithGoogle(googleData: { email: string; name?: string; avatar?: string }): Promise<{ user: User; token: string }> {
    return fetchJson(`${API_BASE}/auth/google`, {
      method: 'POST',
      body: JSON.stringify(googleData),
    });
  },

  async login(email: string, password?: string): Promise<{ user: User; token: string }> {
    return fetchJson(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(data: { name: string; email: string; phone?: string; password?: string }): Promise<{ user: User; token: string }> {
    return fetchJson(`${API_BASE}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMe(): Promise<{ user: User }> {
    return fetchJson(`${API_BASE}/auth/me`);
  },

  async logout(): Promise<void> {
    return fetchJson(`${API_BASE}/auth/logout`, { method: 'POST' });
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    return fetchJson(`${API_BASE}/categories`);
  },

  async getCategory(slugOrId: string): Promise<Category> {
    return fetchJson(`${API_BASE}/categories/${slugOrId}`);
  },

  async createCategory(data: Partial<Category>): Promise<Category> {
    return fetchJson(`${API_BASE}/categories`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    return fetchJson(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    return fetchJson(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
    });
  },

  // Products
  async getProducts(params?: Record<string, any>): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
    }
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchJson(`${API_BASE}/products${queryString}`);
  },

  async getTopSellingProducts(limit = 8): Promise<Product[]> {
    return fetchJson(`${API_BASE}/products/top-selling?limit=${limit}`);
  },

  async getNewArrivals(limit = 8): Promise<Product[]> {
    return fetchJson(`${API_BASE}/products/new-arrivals?limit=${limit}`);
  },

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    return fetchJson(`${API_BASE}/products/featured?limit=${limit}`);
  },

  async getProduct(slugOrId: string): Promise<Product> {
    return fetchJson(`${API_BASE}/products/${slugOrId}`);
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    return fetchJson(`${API_BASE}/products`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    return fetchJson(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    return fetchJson(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Reviews
  async getReviews(params?: { productId?: string; status?: string; featured?: boolean }): Promise<Review[]> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          query.append(key, String(val));
        }
      });
    }
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchJson(`${API_BASE}/reviews${queryString}`);
  },

  async createReview(data: Partial<Review>): Promise<Review> {
    return fetchJson(`${API_BASE}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateReview(id: string, data: Partial<Review>): Promise<Review> {
    return fetchJson(`${API_BASE}/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteReview(id: string): Promise<{ success: boolean }> {
    return fetchJson(`${API_BASE}/reviews/${id}`, {
      method: 'DELETE',
    });
  },

  // FAQs
  async getFAQs(status?: string): Promise<FAQ[]> {
    const query = status ? `?status=${status}` : '';
    return fetchJson(`${API_BASE}/faqs${query}`);
  },

  async createFAQ(data: Partial<FAQ>): Promise<FAQ> {
    return fetchJson(`${API_BASE}/faqs`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateFAQ(id: string, data: Partial<FAQ>): Promise<FAQ> {
    return fetchJson(`${API_BASE}/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteFAQ(id: string): Promise<{ success: boolean }> {
    return fetchJson(`${API_BASE}/faqs/${id}`, {
      method: 'DELETE',
    });
  },

  // Orders
  async createOrder(data: any): Promise<Order> {
    return fetchJson(`${API_BASE}/orders`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getOrders(params?: { userId?: string; status?: string }): Promise<Order[]> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          query.append(key, String(val));
        }
      });
    }
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchJson(`${API_BASE}/orders${queryString}`);
  },

  async getOrder(id: string): Promise<Order> {
    return fetchJson(`${API_BASE}/orders/${id}`);
  },

  async updateOrderStatus(id: string, data: { orderStatus?: string; paymentStatus?: string }): Promise<Order> {
    return fetchJson(`${API_BASE}/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Admin Dashboard & Customers
  async getDashboardStats(): Promise<DashboardStats> {
    return fetchJson(`${API_BASE}/admin/dashboard`);
  },

  async getCustomers(): Promise<any[]> {
    return fetchJson(`${API_BASE}/admin/customers`);
  },

  async updateCustomerStatus(id: string, status: string): Promise<any> {
    return fetchJson(`${API_BASE}/admin/customers/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};
