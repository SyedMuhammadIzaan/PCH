import React, { useState, useEffect } from 'react';
import {
  Banknote,
  ShoppingBag,
  Package,
  Star,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Eye,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { DashboardStats, Order, Product } from '../../types/index.js';
import { api } from '../../services/api.js';
import { StatCardSkeleton } from '../../components/common/SkeletonLoader.js';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [dashStats, orders, prods] = await Promise.all([
          api.getDashboardStats(),
          api.getOrders(),
          api.getProducts({ limit: 50 }),
        ]);

        setStats(dashStats);
        setRecentOrders(orders.slice(0, 5));
        setLowStockProducts(prods.products.filter((p) => p.stock > 0 && p.stock <= 10));
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 4 Core KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-sm border border-pch shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Revenue</span>
            <div className="w-10 h-10 rounded-sm bg-pch-soft text-pch-dark flex items-center justify-center border border-pch">
              <Banknote className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif italic text-2xl sm:text-3xl font-bold text-pch-dark">
              Rs. {(stats?.totalRevenue || 0).toLocaleString()}
            </h3>
            <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% from last month</span>
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-sm border border-pch shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Orders</span>
            <div className="w-10 h-10 rounded-sm bg-pch-soft text-pch-dark flex items-center justify-center border border-pch">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif italic text-2xl sm:text-3xl font-bold text-pch-dark">
              {stats?.totalOrders || 0}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              {stats?.pendingOrders || 0} pending fulfillment
            </p>
          </div>
        </div>

        {/* Catalog Products */}
        <div className="bg-white p-6 rounded-sm border border-pch shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Active Articles</span>
            <div className="w-10 h-10 rounded-sm bg-pch-soft text-pch-dark flex items-center justify-center border border-pch">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif italic text-2xl sm:text-3xl font-bold text-pch-dark">
              {stats?.totalProducts || 0}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              {lowStockProducts.length} low in warehouse
            </p>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white p-6 rounded-sm border border-pch shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Avg Store Rating</span>
            <div className="w-10 h-10 rounded-sm bg-pch-soft text-pch-dark flex items-center justify-center border border-pch">
              <Star className="w-5 h-5 text-amber-500 fill-current" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif italic text-2xl sm:text-3xl font-bold text-pch-dark">
              {(stats?.averageRating || 4.9).toFixed(1)} / 5.0
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              {stats?.totalReviews || 0} verified customer reviews
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders + Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-sm border border-pch shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-pch">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Transactions</span>
              <h2 className="font-serif italic text-xl font-bold text-pch-dark">Recent Customer Orders</h2>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-pch-dark hover:underline flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-pch text-slate-400 uppercase tracking-widest text-[10px]">
                  <th className="py-2.5 px-3">Order #</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">City</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pch">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold font-mono text-pch-dark">{ord.orderNumber}</td>
                    <td className="py-3 px-3 font-medium text-slate-900">{ord.customerName}</td>
                    <td className="py-3 px-3 text-slate-500">{ord.shippingAddress?.city || 'Lahore'}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">Rs. {(ord.total ?? (ord as any).totalAmount ?? 0).toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-xs font-bold text-[10px] uppercase tracking-wider ${
                        (ord.orderStatus || (ord as any).status) === 'delivered' ? 'bg-emerald-100 text-emerald-900' :
                        (ord.orderStatus || (ord as any).status) === 'shipped' ? 'bg-blue-100 text-blue-900' :
                        (ord.orderStatus || (ord as any).status) === 'processing' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {ord.orderStatus || (ord as any).status || 'pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Watchlist (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-sm border border-pch shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-pch">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 className="font-serif italic text-lg font-bold text-pch-dark">Stock Alerts</h2>
            </div>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs font-bold text-pch-dark hover:underline"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">All fabrics & pret items are well-stocked.</p>
            ) : (
              lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 p-2.5 rounded-sm bg-slate-50 border border-pch">
                  <img src={p.images[0]?.imageUrl} alt="" className="w-10 h-12 object-cover rounded-xs border border-pch shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-slate-900 truncate">{p.name}</p>
                    <p className="text-[11px] text-slate-400">Rs. {(p.price ?? 0).toLocaleString()}</p>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-xs bg-rose-100 text-rose-800">
                    {p.stock} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
