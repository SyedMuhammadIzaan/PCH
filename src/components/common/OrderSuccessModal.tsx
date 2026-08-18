import React from 'react';
import { CheckCircle2, Package, Truck, MapPin, CreditCard, ArrowRight, Printer, Sparkles, X, ShoppingBag } from 'lucide-react';
import { Order } from '../../types/index.js';

interface OrderSuccessModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  isOpen,
  onClose,
  onNavigate,
}) => {
  if (!isOpen || !order) return null;

  const total = order.total || 0;
  const subtotal = order.subtotal || total;
  const discount = order.discount || 0;
  const shipping = order.shipping || 0;
  const address = order.shippingAddress?.address || (order.shippingAddress as any)?.street || 'Lahore, Pakistan';
  const city = order.shippingAddress?.city || 'Lahore';
  const customerName = order.customerName || order.shippingAddress?.fullName || 'Valued Customer';
  const items = order.items || [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden my-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-8 text-center relative">
          <button
            id="close-order-success-modal"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-emerald-400 text-emerald-950 flex items-center justify-center mx-auto mb-3 shadow-lg ring-4 ring-emerald-400/30 animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-widest text-emerald-300 font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Order Confirmed & Booked!</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Thank You, {customerName.split(' ')[0]}!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-md mx-auto">
            Your booking <strong className="text-white font-mono bg-emerald-950/60 px-2 py-0.5 rounded">#{order.orderNumber}</strong> has been received and sent for dispatch.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <div className="flex items-center gap-2 text-zinc-500 font-semibold mb-1">
                <Truck className="w-4 h-4 text-emerald-700" />
                <span>Estimated Arrival</span>
              </div>
              <p className="font-bold text-zinc-900 text-sm">2 - 4 Business Days</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">TCS Express / Pakistan Post</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <div className="flex items-center gap-2 text-zinc-500 font-semibold mb-1">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <span>Payment Method</span>
              </div>
              <p className="font-bold text-zinc-900 text-sm uppercase">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Paid'}
              </p>
              <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                {order.paymentStatus === 'paid' ? 'Payment Verified ✓' : 'Pay at doorstep'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <div className="flex items-center gap-2 text-zinc-500 font-semibold mb-1">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Delivery City</span>
              </div>
              <p className="font-bold text-zinc-900 text-sm truncate">{city}</p>
              <p className="text-[10px] text-zinc-500 truncate mt-0.5">{address}</p>
            </div>
          </div>

          {/* Purchased Items List */}
          {items.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center justify-between">
                <span>Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                <span className="text-zinc-400 font-normal">Order #{order.orderNumber}</span>
              </h4>

              <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-2xl overflow-hidden bg-zinc-50/50">
                {items.map((item, idx) => (
                  <div key={item.id || idx} className="p-3.5 flex items-center gap-3 bg-white">
                    {item.productImage && (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-12 h-14 object-cover rounded-lg border border-zinc-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-900 truncate">{item.productName}</p>
                      {item.variantInfo && (
                        <p className="text-[11px] text-emerald-800 font-medium">{item.variantInfo}</p>
                      )}
                      <p className="text-[11px] text-zinc-500">Qty: {item.quantity} × Rs. {item.price?.toLocaleString()}</p>
                    </div>
                    <span className="text-xs font-bold text-zinc-900 font-sans">
                      Rs. {(item.subtotal || item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal</span>
              <span className="font-semibold text-zinc-900">Rs. {subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>Voucher Discount</span>
                <span>-Rs. {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-600">
              <span>Delivery Fee</span>
              <span className="font-semibold text-zinc-900">
                {shipping === 0 ? <strong className="text-emerald-800">FREE Delivery</strong> : `Rs. ${shipping}`}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-emerald-200 text-sm font-extrabold text-zinc-950">
              <span>Total Amount to Pay</span>
              <span className="text-emerald-950 text-base font-sans font-black">
                Rs. {total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-zinc-200 hover:bg-white text-zinc-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
            <button
              id="modal-continue-shopping-btn"
              onClick={() => {
                onClose();
                onNavigate('/shop');
              }}
              className="px-5 py-2.5 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold text-xs uppercase tracking-wider transition"
            >
              Continue Shopping
            </button>
            <button
              id="modal-track-orders-btn"
              onClick={() => {
                onClose();
                onNavigate('/orders');
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-emerald-900/10 flex items-center justify-center gap-1.5"
            >
              <span>Track My Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
