import React, { useState } from 'react';
import { ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { Product } from '../../types/index.js';
import { useCart } from '../../context/CartContext.js';

interface ProductCardProps {
  product: Product;
  onNavigate: (path: string) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onNavigate,
  onQuickView,
}) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const mainImage = product.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80';

  const currentPrice = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock <= 0) return;

    setIsAdding(true);
    const defaultVariant = product.variants && product.variants.length > 0 ? product.variants[0] : undefined;

    setTimeout(() => {
      addToCart(product, defaultVariant, 1);
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }, 300);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onNavigate(`/products/${product.slug}`)}
      className="group relative bg-white rounded-sm border border-pch overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image Container with Editorial Badges */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Editorial Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.newArrival && (
            <span className="bg-emerald-300 text-pch-dark text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs shadow-xs">
              New
            </span>
          )}
          {hasDiscount && (
            <span className="bg-rose-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {product.featured && !product.newArrival && (
            <span className="bg-pch-dark text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs shadow-xs">
              Featured
            </span>
          )}
        </div>

        {/* Sold Out Overlay */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center z-20">
            <span className="bg-white text-slate-900 font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-xs shadow-md">
              Sold Out
            </span>
          </div>
        )}

        {/* Quick View Hover Action */}
        {onQuickView && (
          <div className="absolute inset-x-2.5 bottom-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 z-10">
            <button
              id={`quick-view-btn-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="flex-1 bg-white/95 hover:bg-white text-pch-dark text-[11px] font-bold uppercase tracking-wider py-2 px-3 rounded-xs shadow-md backdrop-blur-xs flex items-center justify-center gap-1.5 transition active:scale-95 border border-pch"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-700" />
              <span>Quick View</span>
            </button>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Star Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400 truncate max-w-[65%]">
              {product.categoryName || 'Textiles'}
            </span>
            <div className="flex items-center gap-0.5 text-amber-500 font-bold text-[11px]">
              <span>★</span>
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title (Editorial Serif Italic) */}
          <h3 className="font-serif italic text-[15px] sm:text-base font-bold text-pch-dark line-clamp-1 group-hover:text-emerald-800 transition-colors">
            {product.name}
          </h3>

          {product.fabric && (
            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
              {product.fabric}
            </p>
          )}
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-3 pt-2.5 border-t border-pch flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-bold text-pch-dark font-sans">
                Rs. {(currentPrice ?? 0).toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-[11px] text-slate-400 line-through">
                  Rs. {(product.price ?? 0).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            id={`add-to-cart-btn-${product.id}`}
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || isAdding}
            className={`p-2 rounded-xs font-bold text-xs transition flex items-center gap-1.5 shadow-2xs ${
              isAdded
                ? 'bg-emerald-400 text-pch-dark'
                : product.stock <= 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-pch-soft text-pch-dark hover:bg-pch-dark hover:text-white active:scale-95 border border-pch'
            }`}
            title="Add to Shopping Cart"
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-pch-dark" />
                <span className="text-[10px] uppercase font-bold hidden sm:inline">Added</span>
              </>
            ) : isAdding ? (
              <div className="w-3.5 h-3.5 border-2 border-pch-dark border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase font-bold hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
