import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, Sparkles, Truck, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext.js';

interface CartDrawerProps {
  onNavigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    shipping,
    total,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    promoCode,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const [inputCode, setInputCode] = useState('');

  if (!isCartDrawerOpen) return null;

  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleCheckoutClick = () => {
    setIsCartDrawerOpen(false);
    onNavigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-800" />
              <h2 className="font-serif text-xl font-bold text-zinc-900">Your Shopping Bag</h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              id="close-cart-drawer-btn"
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Alert */}
          <div className="px-5 py-3 bg-emerald-50/60 border-b border-emerald-100/60">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-emerald-950 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-700" />
                {amountNeededForFreeShipping === 0
                  ? '🎉 You unlocked FREE Nationwide Delivery!'
                  : `Add Rs. ${amountNeededForFreeShipping.toLocaleString()} more for FREE Delivery!`}
              </span>
              <span className="text-emerald-800 font-bold">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-emerald-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-700 rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-zinc-100">
            {items.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-800 mb-4">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="font-serif text-lg font-bold text-zinc-900 mb-1">Your bag is empty</h3>
                <p className="text-xs text-zinc-500 max-w-xs mb-6 leading-relaxed">
                  Discover our latest luxury unstitched lawn, stitched pret, and men's collection.
                </p>
                <button
                  id="empty-cart-shop-btn"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    onNavigate('/shop');
                  }}
                  className="px-6 py-3 rounded-xl bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-900 transition shadow-md shadow-emerald-900/10"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 first:pt-0">
                  <img
                    src={item.product.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=200&q=80'}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-xl shrink-0 border border-zinc-200 bg-zinc-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif font-bold text-sm text-zinc-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-400 hover:text-rose-600 p-1 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.variantValue && (
                        <p className="text-xs text-emerald-800 font-medium mt-0.5">
                          {item.variantName || 'Option'}: <span className="font-semibold">{item.variantValue}</span>
                        </p>
                      )}

                      <p className="text-xs font-bold text-zinc-900 mt-1">
                        Rs. {(item.price ?? 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-50">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden bg-zinc-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-zinc-600 hover:bg-zinc-200 text-xs font-bold transition"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-zinc-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-zinc-600 hover:bg-zinc-200 text-xs font-bold transition"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-emerald-950 font-sans">
                        Rs. {((item.price ?? 0) * (item.quantity ?? 1)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Actions */}
          {items.length > 0 && (
            <div className="p-5 border-t border-zinc-100 bg-zinc-50/70 space-y-4">
              {/* Promo Code Input */}
              <div className="flex gap-2">
                {promoCode ? (
                  <div className="flex-1 flex items-center justify-between px-3 py-2 bg-emerald-100/70 border border-emerald-300 rounded-xl text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-semibold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Code: <strong>{promoCode}</strong> (-Rs. {discount})</span>
                    </div>
                    <button onClick={removePromoCode} className="text-emerald-800 hover:text-emerald-950 font-bold">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="Promo code (e.g. PCH10)"
                      className="flex-1 px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs uppercase focus:outline-emerald-700"
                    />
                    <button
                      onClick={() => {
                        if (inputCode) {
                          applyPromoCode(inputCode);
                          setInputCode('');
                        }
                      }}
                      className="px-3 py-2 bg-zinc-800 hover:bg-zinc-900 text-white rounded-xl text-xs font-semibold transition"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Cost Calculations */}
              <div className="space-y-1.5 text-xs text-zinc-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-900">Rs. {(subtotal ?? 0).toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount</span>
                    <span>-Rs. {(discount ?? 0).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-zinc-900">
                    {shipping === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `Rs. ${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-zinc-950 pt-2 border-t border-zinc-200">
                  <span>Grand Total</span>
                  <span className="text-emerald-950 text-base font-sans font-extrabold">
                    Rs. {(total ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="cart-drawer-checkout-btn"
                onClick={handleCheckoutClick}
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm flex items-center justify-center gap-2 transition active:scale-98 shadow-md shadow-emerald-900/10"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-zinc-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Encrypted checkout & 100% Guaranteed Pakistani Fabrics</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
