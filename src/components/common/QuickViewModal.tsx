import React, { useState } from 'react';
import { X, Star, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw, ArrowRight } from 'lucide-react';
import { Product, ProductVariant } from '../../types/index.js';
import { useCart } from '../../context/CartContext.js';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedImageIndex(0);
      setSelectedVariant(product?.variants && product.variants.length > 0 ? product.variants[0] : undefined);
    }
  }, [isOpen, product?.id]);

  if (!isOpen || !product) return null;

  const currentVariant = selectedVariant || (product.variants && product.variants.length > 0 ? product.variants[0] : undefined);
  const unitPrice = (product.discountPrice || product.price) + (currentVariant?.additionalPrice || 0);
  const availableStock = currentVariant ? currentVariant.stock : product.stock;

  const handleAddToCart = () => {
    if (availableStock <= 0) return;
    setIsAdding(true);

    setTimeout(() => {
      addToCart(product, currentVariant, quantity);
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
        onClose();
      }, 800);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-quickview-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 text-zinc-600 hover:text-zinc-900 shadow-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Gallery Column */}
          <div className="p-6 bg-zinc-50 flex flex-col justify-between">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-white border border-zinc-200 shadow-xs">
              <img
                src={product.images[selectedImageIndex]?.imageUrl || product.images[0]?.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                      selectedImageIndex === idx ? 'border-emerald-700 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Ratings */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-emerald-800 uppercase tracking-widest">
                  {product.categoryName || 'Textiles'}
                </span>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-zinc-400 font-normal">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 leading-tight">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3 my-4">
                <span className="text-2xl font-bold text-emerald-950 font-sans">
                  Rs. {(unitPrice ?? 0).toLocaleString()}
                </span>
                {product.discountPrice && (
                  <span className="text-sm text-zinc-400 line-through">
                    Rs. {(product.price ?? 0).toLocaleString()}
                  </span>
                )}
                {product.discountPrice && (
                  <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-md uppercase">
                    Save Rs. {((product.price ?? 0) - (product.discountPrice ?? 0)).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-zinc-600 line-clamp-3 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">
                    Select Option / Size:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => {
                      const isSelected = (currentVariant?.id || product.variants[0]?.id) === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          disabled={v.stock <= 0}
                          className={`text-xs px-3.5 py-2 rounded-xl border font-medium transition ${
                            isSelected
                              ? 'border-emerald-800 bg-emerald-800 text-white shadow-xs'
                              : v.stock <= 0
                              ? 'border-zinc-200 bg-zinc-100 text-zinc-400 line-through cursor-not-allowed'
                              : 'border-zinc-200 bg-white text-zinc-800 hover:border-emerald-600'
                          }`}
                        >
                          {v.value} {v.additionalPrice > 0 && `(+Rs. ${v.additionalPrice})`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity & Stock Status */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2 text-zinc-600 hover:bg-zinc-200 font-bold transition"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-bold text-zinc-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                    disabled={quantity >= availableStock}
                    className="px-3.5 py-2 text-zinc-600 hover:bg-zinc-200 font-bold transition disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                <div className="text-xs">
                  {availableStock > 0 ? (
                    <span className="text-emerald-800 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      In Stock ({availableStock} available)
                    </span>
                  ) : (
                    <span className="text-rose-600 font-bold">Out of stock</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions & Value Props */}
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <div className="flex gap-3">
                <button
                  id="quickview-add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={availableStock <= 0 || isAdding}
                  className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-md ${
                    isAdded
                      ? 'bg-emerald-800 text-white'
                      : availableStock <= 0
                      ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                      : 'bg-emerald-800 hover:bg-emerald-900 text-white active:scale-98 shadow-emerald-900/10'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Added to Bag ✓</span>
                    </>
                  ) : isAdding ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag (Rs. {((unitPrice ?? 0) * (quantity ?? 1)).toLocaleString()})</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onNavigate(`/products/${product.slug}`);
                  }}
                  className="px-4 py-3 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <span>Full View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Delivery Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-3 text-[11px] text-zinc-500 text-center">
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-zinc-50">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  <span>Nationwide COD</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-zinc-50">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>100% Authentic</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-zinc-50">
                  <RefreshCw className="w-4 h-4 text-emerald-700" />
                  <span>7-Day Return</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
