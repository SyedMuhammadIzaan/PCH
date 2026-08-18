import React, { useState, useEffect } from 'react';
import { Package, Search, Truck, CheckCircle2, Clock, XCircle, ChevronRight, Printer, RefreshCw } from 'lucide-react';
import { Order, OrderStatus } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';

interface OrdersPageProps {
  onNavigate: (path: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const toast = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const allOrders = await api.getOrders(user?.id ? { userId: user.id } : undefined);
      setOrders(allOrders);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleSearchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchOrderNumber.trim()) {
      fetchOrders();
      return;
    }

    try {
      const all = await api.getOrders();
      const match = all.find(
        (o) => o.orderNumber.toLowerCase() === searchOrderNumber.trim().toLowerCase()
      );
      if (match) {
        setSelectedOrder(match);
        toast.success('Order Found', `Loaded details for #${match.orderNumber}`);
      } else {
        toast.error('Order Not Found', `No order found with tracking number #${searchOrderNumber}`);
      }
    } catch (e) {
      toast.error('Search Failed', 'Could not locate order.');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await api.updateOrderStatus(orderId, { orderStatus: 'cancelled' });
      toast.info('Order Cancelled', 'Your order status has been updated to cancelled.');
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: 'cancelled' });
      }
    } catch (e) {
      toast.error('Error', 'Could not cancel order.');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.orderStatus === statusFilter;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-sm bg-blue-50 text-blue-800 border border-blue-200">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            Shipped (In Transit)
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-sm bg-amber-50 text-amber-800 border border-amber-200">
            <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            Packing & Quality Check
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-sm bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-sm bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            Pending Verification
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-pch pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <button onClick={() => onNavigate('/')} className="hover:text-pch-dark">Home</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-pch-dark font-semibold">Orders & Tracking</span>
          </div>
          <h1 className="font-serif italic text-3xl sm:text-4xl font-bold text-pch-dark">
            Order Tracking & History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Live delivery tracking with TCS / Leopard Courier across Pakistan.
          </p>
        </div>

        {/* Live Order Lookup Form */}
        <form onSubmit={handleSearchOrder} className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              value={searchOrderNumber}
              onChange={(e) => setSearchOrderNumber(e.target.value)}
              placeholder="Search Order (e.g. PCH-1001)"
              className="pl-9 pr-3 py-2 bg-slate-50 border border-pch rounded-sm text-xs font-medium focus:bg-white focus:outline-emerald-700 w-52 sm:w-64 uppercase"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-pch-dark hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-sm transition"
          >
            Track
          </button>
        </form>
      </div>

      {/* Selected Order Detail Modal / Highlight View */}
      {selectedOrder && (
        <div className="bg-pch-soft border border-emerald-200 p-6 sm:p-8 rounded-sm shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pch">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Order Details</span>
              <h2 className="font-serif italic text-2xl font-bold text-pch-dark">
                Order #{selectedOrder.orderNumber}
              </h2>
              <p className="text-xs text-slate-500">
                Placed on {new Date(selectedOrder.createdAt).toLocaleDateString('en-PK', { dateStyle: 'long' })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(selectedOrder.orderStatus)}
              <button
                onClick={() => window.print()}
                className="p-2 bg-white rounded-sm border border-pch text-slate-700 hover:text-pch-dark transition text-xs font-bold flex items-center gap-1.5"
                title="Print Order Receipt"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print Receipt</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                Close View
              </button>
            </div>
          </div>

          {/* Timeline Status */}
          <div className="py-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-pch-dark mb-4">Delivery Status Timeline</p>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${
                  ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].includes(selectedOrder.orderStatus)
                    ? 'bg-pch-dark text-white' : 'bg-slate-200 text-slate-500'
                }`}>1</div>
                <span className="font-bold text-pch-dark">Order Booked</span>
                <span className="text-[10px] text-slate-400">Verified</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${
                  ['processing', 'shipped', 'delivered'].includes(selectedOrder.orderStatus)
                    ? 'bg-pch-dark text-white' : 'bg-slate-200 text-slate-500'
                }`}>2</div>
                <span className="font-bold text-pch-dark">Quality Check</span>
                <span className="text-[10px] text-slate-400">Packaging</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${
                  ['shipped', 'delivered'].includes(selectedOrder.orderStatus)
                    ? 'bg-pch-dark text-white' : 'bg-slate-200 text-slate-500'
                }`}>3</div>
                <span className="font-bold text-pch-dark">In Transit</span>
                <span className="text-[10px] text-slate-400">TCS / Leopard</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${
                  selectedOrder.orderStatus === 'delivered'
                    ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>4</div>
                <span className="font-bold text-pch-dark">Delivered</span>
                <span className="text-[10px] text-slate-400">Parcel Received</span>
              </div>
            </div>
          </div>

          {/* Items Breakdown */}
          <div className="bg-white p-4 rounded-sm border border-pch divide-y divide-pch">
            {selectedOrder.items?.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <img src={item.productImage} alt="" className="w-12 h-14 object-cover rounded-xs border border-pch" />
                  <div>
                    <p className="font-bold text-xs text-slate-900">{item.productName}</p>
                    {item.variantInfo && (
                      <p className="text-[11px] text-emerald-800">{item.variantInfo}</p>
                    )}
                    <p className="text-[11px] text-slate-400">Qty: {item.quantity} × Rs. {(item.price ?? 0).toLocaleString()}</p>
                  </div>
                </div>
                <span className="font-bold text-xs text-pch-dark">
                  Rs. {(item.subtotal ?? ((item.price ?? 0) * (item.quantity ?? 1)) ?? 0).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Address & Tracking Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-4 rounded-sm border border-pch">
              <p className="font-bold uppercase tracking-widest text-slate-400 text-[10px] mb-1">Recipient & Address</p>
              <p className="font-bold text-slate-900">{selectedOrder.customerName} ({selectedOrder.customerPhone || 'N/A'})</p>
              <p className="text-slate-600 mt-0.5">{selectedOrder.shippingAddress?.address || (selectedOrder.shippingAddress as any)?.street || 'Lahore'}, {selectedOrder.shippingAddress?.city || 'Lahore'}, {selectedOrder.shippingAddress?.province || 'Punjab'}</p>
            </div>
            <div className="bg-white p-4 rounded-sm border border-pch flex flex-col justify-between">
              <div>
                <p className="font-bold uppercase tracking-widest text-slate-400 text-[10px] mb-1">Courier Tracking Info</p>
                <p className="font-bold text-pch-dark">Courier: TCS Express Pakistan</p>
                <p className="text-slate-600">Tracking Code: <strong className="font-mono text-emerald-800">{selectedOrder.orderNumber ? `TCS-${selectedOrder.orderNumber.replace(/[^0-9]/g, '')}` : 'TCS-89324810PK'}</strong></p>
              </div>
              {selectedOrder.orderStatus === 'pending' && (
                <button
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                  className="mt-3 text-xs text-rose-600 hover:underline font-bold text-left"
                >
                  Cancel this order
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Orders List & Status Filter */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 text-xs">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-sm font-bold uppercase tracking-wider transition ${
                statusFilter === st
                  ? 'bg-pch-dark text-white'
                  : 'bg-white border border-pch text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-pch-dark border-t-transparent rounded-full animate-spin" />
            <span>Loading orders...</span>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="bg-white rounded-sm border border-pch divide-y divide-pch shadow-xs overflow-hidden">
            {filteredOrders.map((ord) => (
              <div
                key={ord.id}
                onClick={() => setSelectedOrder(ord)}
                className="p-5 hover:bg-slate-50 cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-sm bg-pch-soft text-pch-dark flex items-center justify-center shrink-0 border border-pch">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif italic font-bold text-base text-pch-dark">
                        #{ord.orderNumber}
                      </h3>
                      {getStatusBadge(ord.orderStatus)}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {ord.items?.length || 0} items • Placed {new Date(ord.createdAt).toLocaleDateString('en-PK', { dateStyle: 'medium' })}
                    </p>
                    <p className="text-xs font-bold text-slate-900 mt-1">
                      Rs. {(ord.total ?? (ord as any).totalAmount ?? 0).toLocaleString()} ({(ord.paymentMethod || 'cod').toUpperCase()})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-pch-dark hover:underline flex items-center gap-1">
                    <span>View Tracking</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-sm border border-pch p-8">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-serif italic text-xl font-bold text-slate-900 mb-1">No Orders Found</h3>
            <p className="text-xs text-slate-500 mb-4">You have not placed any orders matching this status yet.</p>
            <button
              onClick={() => onNavigate('/shop')}
              className="px-6 py-2.5 bg-pch-dark text-white font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-black transition"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
