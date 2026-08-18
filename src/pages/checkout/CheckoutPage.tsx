import React, { useState } from 'react';
import { Truck, ShieldCheck, CreditCard, Banknote, Smartphone, CheckCircle2, ChevronRight, ArrowLeft, Tag, X, Lock, Sparkles, Printer } from 'lucide-react';
import { useCart } from '../../context/CartContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';
import { api } from '../../services/api.js';
import { Order, PaymentMethod } from '../../types/index.js';
import { OrderSuccessModal } from '../../components/common/OrderSuccessModal.js';

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
}

const PAKISTAN_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Gujranwala',
  'Sialkot',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Abbottabad',
  'Mardan',
  'Sukkur',
  'Other City',
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { items, subtotal, discount, shipping, total, promoCode, clearCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();

  // Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '03001234567');
  const [address, setAddress] = useState('House #42, Street 8, Phase 5, DHA');
  const [city, setCity] = useState('Lahore');
  const [province, setProvince] = useState('Punjab');
  const [postalCode, setPostalCode] = useState('54000');
  const [orderNotes, setOrderNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [walletPhone, setWalletPhone] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  if (items.length === 0 && !placedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-4">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-zinc-900 mb-2">Your Bag is Empty</h2>
        <p className="text-sm text-zinc-500 mb-6">Please add items to your cart before proceeding to checkout.</p>
        <button
          onClick={() => onNavigate('/shop')}
          className="px-8 py-3.5 rounded-xl bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider"
        >
          Explore Collections
        </button>
      </div>
    );
  }

  // ORDER CONFIRMATION VIEW
  if (placedOrder) {
    const orderTotal = placedOrder.total || 0;
    const orderAddress = placedOrder.shippingAddress?.address || (placedOrder.shippingAddress as any)?.street || 'Lahore, Pakistan';
    const orderCity = placedOrder.shippingAddress?.city || 'Lahore';

    return (
      <>
        {/* Success Popup Modal */}
        <OrderSuccessModal
          order={placedOrder}
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          onNavigate={onNavigate}
        />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white rounded-3xl border border-emerald-200 shadow-xl p-8 sm:p-12 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                Order Confirmed & Placed!
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 mt-1">
                Thank You, {placedOrder.customerName?.split(' ')[0] || 'Valued Customer'}!
              </h1>
              <p className="text-sm text-zinc-600 mt-2">
                Your order <strong className="text-emerald-950 font-mono">#{placedOrder.orderNumber}</strong> has been successfully booked with Pakistan Post / TCS Express.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-zinc-50 rounded-2xl p-6 text-left border border-zinc-200 space-y-4 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-zinc-200">
                <span className="text-zinc-500 font-semibold">Delivery Address</span>
                <span className="font-bold text-zinc-900 text-right max-w-xs truncate">
                  {orderAddress}, {orderCity}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-zinc-200">
                <span className="text-zinc-500 font-semibold">Payment Method</span>
                <span className="font-bold text-zinc-900 uppercase">
                  {placedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : placedOrder.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-zinc-200">
                <span className="text-zinc-500 font-semibold">Estimated Delivery</span>
                <span className="font-bold text-emerald-800">2 - 4 Business Days</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-zinc-900 pt-1">
                <span>Total Amount to Pay</span>
                <span className="text-emerald-950 text-base font-extrabold">
                  Rs. {orderTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <button
                onClick={() => setShowSuccessModal(true)}
                className="px-6 py-3.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>View Order Popup</span>
              </button>
              <button
                onClick={() => onNavigate('/orders')}
                className="px-6 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider transition shadow-md"
              >
                Track Order Status
              </button>
              <button
                onClick={() => onNavigate('/shop')}
                className="px-6 py-3.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs uppercase tracking-wider transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !address || !city) {
      toast.error('Missing Details', 'Please fill in all required shipping address fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customerId: user?.id || 'guest-customer',
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        items: items.map((item, idx) => ({
          id: `item-${Date.now()}-${idx}`,
          productId: item.productId,
          productName: item.product.name,
          productImage: item.product.images[0]?.imageUrl || '',
          variantId: item.variantId,
          variantInfo: item.variantValue ? `${item.variantName || 'Option'}: ${item.variantValue}` : undefined,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
        })),
        shippingAddress: {
          fullName,
          phone,
          address,
          city,
          province,
          postalCode,
          country: 'Pakistan',
        },
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        subtotal,
        discount,
        shipping,
        total,
        notes: orderNotes,
      };

      const newOrder = await api.createOrder(orderData);
      clearCart();
      setPlacedOrder(newOrder);
      setShowSuccessModal(true);
      toast.success('Order Placed!', `Your order #${newOrder.orderNumber} has been received.`);
    } catch (err: any) {
      toast.error('Order Failed', err.message || 'Could not place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-6">
        <div>
          <button
            onClick={() => onNavigate('/shop')}
            className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Shopping</span>
          </button>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900">
            Secure Checkout
          </h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <Lock className="w-3.5 h-3.5" />
          <span className="font-bold">256-Bit Encrypted</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Shipping & Payment Information */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Contact & Delivery Info */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
              <Truck className="w-5 h-5 text-emerald-800" />
              <h2 className="font-serif text-xl font-bold text-zinc-900">1. Delivery Address (Pakistan)</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ayesha Khan"
                  className="w-full px-4 py-3 border border-zinc-300 rounded-xl text-sm focus:outline-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Email Address (For Invoices) *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 border border-zinc-300 rounded-xl text-sm focus:outline-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Mobile Number (For Courier SMS) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full px-4 py-3 border border-zinc-300 rounded-xl text-sm focus:outline-emerald-700"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Complete Street Address / House / Plaza *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House # 12-A, Street 4, Sector F-7/2..."
                  className="w-full px-4 py-3 border border-zinc-300 rounded-xl text-sm focus:outline-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-300 rounded-xl text-sm focus:outline-emerald-700 bg-white"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Province *
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-300 rounded-xl text-sm focus:outline-emerald-700 bg-white"
                >
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Islamabad Capital Territory">Islamabad Capital</option>
                  <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                  <option value="Azad Kashmir">Azad Kashmir</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Special Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Call before delivery, leave with guard..."
                  className="w-full px-4 py-3 border border-zinc-300 rounded-xl text-sm focus:outline-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Method Selector */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
              <Banknote className="w-5 h-5 text-emerald-800" />
              <h2 className="font-serif text-xl font-bold text-zinc-900">2. Payment Method</h2>
            </div>

            <div className="space-y-3">
              {/* Option 1: COD */}
              <label
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-800 bg-emerald-50/40 shadow-xs'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 accent-emerald-800"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-zinc-900">Cash on Delivery (COD)</span>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Most Popular
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    Pay in cash directly to TCS/Leopard courier at your doorstep upon receiving your parcel.
                  </p>
                </div>
              </label>

              {/* Option 2: Online Card */}
              <label
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${
                  paymentMethod === 'card'
                    ? 'border-emerald-800 bg-emerald-50/40 shadow-xs'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="mt-1 accent-emerald-800"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-zinc-900">Credit / Debit Card</span>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <CreditCard className="w-4 h-4 text-zinc-600" />
                      <span>Visa / Mastercard</span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    Safe 3D-Secure payment via local Pakistani banks (HBL, Meezan, Alfalah, Standard Chartered).
                  </p>

                  {paymentMethod === 'card' && (
                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-emerald-100">
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="MM / YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="CVC / CVV"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </label>

              {/* Option 3: JazzCash / EasyPaisa */}
              <label
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${
                  paymentMethod === 'jazzcash'
                    ? 'border-emerald-800 bg-emerald-50/40 shadow-xs'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="jazzcash"
                  checked={paymentMethod === 'jazzcash'}
                  onChange={() => setPaymentMethod('jazzcash')}
                  className="mt-1 accent-emerald-800"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-zinc-900">JazzCash / EasyPaisa Wallet</span>
                    <Smartphone className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    Instant approval through your mobile wallet application.
                  </p>

                  {paymentMethod === 'jazzcash' && (
                    <div className="mt-3 pt-3 border-t border-emerald-100">
                      <input
                        type="tel"
                        placeholder="JazzCash / EasyPaisa Mobile Number (03XXXXXXXXX)"
                        value={walletPhone}
                        onChange={(e) => setWalletPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs"
                      />
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 space-y-6 sticky top-28 shadow-xl">
            <h3 className="font-serif text-xl font-bold text-zinc-900 pb-3 border-b border-zinc-100">
              Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h3>

            {/* Item list */}
            <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-zinc-100 pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 pt-3 first:pt-0">
                  <img
                    src={item.product.images[0]?.imageUrl}
                    alt={item.product.name}
                    className="w-14 h-16 object-cover rounded-lg border border-zinc-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-900 truncate">{item.product.name}</p>
                    {item.variantValue && (
                      <p className="text-[11px] text-emerald-800">{item.variantValue}</p>
                    )}
                    <p className="text-xs text-zinc-500 mt-1">
                      Qty: {item.quantity} × Rs. {(item.price ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-zinc-900">
                    Rs. {((item.price ?? 0) * (item.quantity ?? 1)).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs pt-4 border-t border-zinc-100 text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-900">Rs. {(subtotal ?? 0).toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount ({promoCode})</span>
                  <span>-Rs. {(discount ?? 0).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-bold text-zinc-900">
                  {shipping === 0 ? <span className="text-emerald-700">FREE</span> : `Rs. ${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-zinc-950 pt-3 border-t border-zinc-200">
                <span>Total Amount</span>
                <span className="text-emerald-950 font-sans text-xl">Rs. {(total ?? 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="place-order-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm uppercase tracking-wider transition shadow-lg shadow-emerald-900/15 flex items-center justify-center gap-2 active:scale-98"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Place Order (Rs. {(total ?? 0).toLocaleString()})</span>
                </>
              )}
            </button>

            <div className="text-center text-[11px] text-zinc-400 space-y-1">
              <p>✓ 100% Genuine Pakistani Textiles Guarantee</p>
              <p>✓ 7-Day Hassle-Free Exchange Policy</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
