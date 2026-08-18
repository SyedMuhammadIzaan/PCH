export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount?: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId?: string;
  imageUrl: string;
  displayOrder: number;
}

export interface ProductVariant {
  id: string;
  productId?: string;
  name: string; // e.g. "Size", "Type", "Color"
  value: string; // e.g. "Small", "Medium", "Unstitched 3-Piece"
  additionalPrice: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  categoryId: string;
  categoryName?: string;
  subcategory?: string;
  featured: boolean;
  newArrival: boolean;
  status: 'active' | 'inactive';
  sku: string;
  fabric?: string;
  material?: string;
  color?: string;
  collection?: string;
  season?: string;
  careInstructions?: string;
  productCode?: string;
  salesCount: number;
  rating: number;
  reviewCount: number;
  images: ProductImage[];
  variants: ProductVariant[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  userId?: string;
  customerName: string;
  rating: number;
  comment: string;
  image?: string;
  status: 'approved' | 'pending' | 'rejected';
  featured: boolean;
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  status: 'active' | 'inactive';
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variantId?: string;
  variantName?: string;
  variantValue?: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  additionalInstructions?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cod' | 'online';

export interface OrderItem {
  id: string;
  orderId?: string;
  productId: string;
  productName: string;
  productImage: string;
  variantId?: string;
  variantInfo?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
  deliveredOrders: number;
  lowStockProducts: number;
  salesOverview: { date: string; sales: number; orders: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
  ordersByStatus: { name: string; value: number; color: string }[];
  topSellingProducts: { id: string; name: string; category: string; price: number; sales: number; stock: number; image: string }[];
  salesByCategory: { category: string; sales: number; count: number }[];
}
