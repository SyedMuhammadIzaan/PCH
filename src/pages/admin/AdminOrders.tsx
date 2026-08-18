import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Eye, Edit2, CheckCircle2, Clock, Truck, XCircle, X } from 'lucide-react';
import { Order, OrderStatus } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const toast = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const all = await api.getOrders();
      setOrders(all);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await api.updateOrderStatus(orderId, { orderStatus: newStatus });
      toast.success('Order Status Updated', `Status changed to ${newStatus}`);
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
    } catch (e) {
      toast.error('Update Failed');
    }
  };

  const handleSaveNotes = async (orderId: string, notes: string) => {
    try {
      await api.updateOrderStatus(orderId, { orderStatus: selectedOrder?.orderStatus });
      toast.success('Fulfillment Notes Saved');
      fetchOrders();
    } catch (e) {
      toast.error('Failed to update notes');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress.city.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif italic text-xl font-bold text-pch-dark">Order Fulfillment & Logistics</h2>
          <p className="text-xs text-slate-500">Track, update delivery status, and dispatch courier tracking numbers.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order #, client, city..."
              className="pl-9 pr-3 py-2 bg-white border border-pch rounded-sm text-xs w-64 focus:outline-emerald-700"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-pch rounded-sm text-xs focus:outline-emerald-700 font-bold uppercase"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-sm border border-pch shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-pch bg-slate-50 text-slate-400 uppercase tracking-widest text-[10px]">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pch">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-pch-dark">{ord.orderNumber}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{ord.customerName}</p>
                    <p className="text-[10px] text-slate-400">{ord.shippingAddress?.city || 'Lahore'}, {ord.shippingAddress?.province || 'Punjab'}</p>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">{ord.items?.length || 0} items</td>
                  <td className="py-3 px-4 font-bold text-pch-dark">Rs. {(ord.total ?? (ord as any).totalAmount ?? 0).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-slate-100 text-slate-700">
                      {(ord.paymentMethod || 'cod').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderStatus)}
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-xs border focus:outline-emerald-700 ${
                        ord.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' :
                        ord.orderStatus === 'shipped' ? 'bg-blue-50 text-blue-900 border-blue-200' :
                        ord.orderStatus === 'processing' ? 'bg-amber-50 text-amber-900 border-amber-200' :
                        ord.orderStatus === 'cancelled' ? 'bg-rose-50 text-rose-900 border-rose-200' : 'bg-slate-50 text-slate-700 border-slate-300'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-2.5 py-1 bg-pch-soft text-pch-dark hover:bg-emerald-100 rounded-xs font-bold text-[10px] uppercase tracking-wider border border-pch"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-pch max-w-xl w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-pch">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Order Inspection</span>
                <h3 className="font-serif italic text-xl font-bold text-pch-dark">
                  Order #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Customer & Shipping */}
              <div className="bg-slate-50 p-4 rounded-sm border border-pch">
                <p className="font-bold text-slate-900">{selectedOrder.customerName} ({selectedOrder.customerPhone || 'N/A'})</p>
                <p className="text-slate-500 text-[11px]">{selectedOrder.customerEmail}</p>
                <p className="text-slate-700 mt-1">{selectedOrder.shippingAddress?.address || (selectedOrder.shippingAddress as any)?.street || 'Lahore'}, {selectedOrder.shippingAddress?.city || 'Lahore'}, {selectedOrder.shippingAddress?.province || 'Punjab'}</p>
              </div>

              {/* Items List */}
              <div className="divide-y divide-pch border border-pch rounded-sm p-3 max-h-48 overflow-y-auto">
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <img src={it.productImage} alt="" className="w-8 h-10 object-cover rounded-xs border border-pch" />
                      <div>
                        <p className="font-bold text-slate-900">{it.productName}</p>
                        <p className="text-[10px] text-slate-400">{it.variantInfo || 'Standard'} • Qty: {it.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-pch-dark">Rs. {(it.subtotal ?? ((it.price ?? 0) * (it.quantity ?? 1)) ?? 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Courier Tracking Info */}
              <div className="p-3 bg-pch-soft border border-emerald-200 rounded-sm">
                <p className="font-bold uppercase tracking-wider text-pch-dark text-[10px] mb-1">
                  Courier Tracking Code (TCS Express)
                </p>
                <p className="font-mono font-bold text-emerald-900 text-sm">
                  {selectedOrder.orderNumber ? `TCS-${selectedOrder.orderNumber.replace(/[^0-9]/g, '')}` : 'TCS-89324810PK'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
