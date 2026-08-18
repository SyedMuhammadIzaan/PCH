import React, { useState, useEffect } from 'react';
import { Star, ShoppingBag, Truck, ShieldCheck, RefreshCw, ChevronRight, Check, CheckCircle2, Zap, Send, Share2, Sparkles } from 'lucide-react';
import { Product, ProductVariant, Review } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useCart } from '../../context/CartContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';
import { ProductCard } from '../../components/common/ProductCard.js';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Interaction State
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Review Form State
  const [reviewerName, setReviewerName] = useState(user?.name || '');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      setQuantity(1);
      setSelectedImageIdx(0);
      setSelectedVariant(undefined);
      try {
        const prod = await api.getProduct(slug);
        if (prod) {
          setProduct(prod);
          if (prod.variants && prod.variants.length > 0) {
            setSelectedVariant(prod.variants[0]);
          } else {
            setSelectedVariant(undefined);
          }
          // Load reviews for this product
          const revs = await api.getReviews({ productId: prod.id, status: 'approved' });
          setReviews(revs);

          // Load related products from same category
          const related = await api.getProducts({ categoryId: prod.categoryId, limit: 4 });
          setRelatedProducts(related.products.filter((p) => p.id !== prod.id));
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-zinc-600">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold text-zinc-900 mb-2">Product Not Found</h2>
        <p className="text-zinc-500 text-sm mb-6">The requested garment could not be found or has been retired.</p>
        <button
          onClick={() => onNavigate('/shop')}
          className="px-6 py-3 bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const currentVariant = selectedVariant || (product.variants && product.variants.length > 0 ? product.variants[0] : undefined);
  const unitPrice = (product.discountPrice || product.price) + (currentVariant?.additionalPrice || 0);
  const availableStock = currentVariant ? currentVariant.stock : product.stock;
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;

  const handleAddToCart = () => {
    if (availableStock <= 0) return;
    setIsAdding(true);
    setTimeout(() => {
      addToCart(product, currentVariant, quantity);
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }, 300);
  };

  const handleBuyNow = () => {
    if (availableStock <= 0) return;
    addToCart(product, currentVariant, quantity);
    onNavigate('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const newRev = await api.createReview({
        productId: product.id,
        customerName: reviewerName || 'Customer',
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviews([newRev, ...reviews]);
      setReviewComment('');
      toast.success('Review Submitted', 'Thank you! Your verified review has been published.');
    } catch (e) {
      toast.error('Submission Failed', 'Could not submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <button onClick={() => onNavigate('/')} className="hover:text-emerald-800">Home</button>
        <ChevronRight className="w-3 h-3" />
        <button onClick={() => onNavigate('/shop')} className="hover:text-emerald-800">Shop</button>
        <ChevronRight className="w-3 h-3" />
        <button
          onClick={() => onNavigate(`/shop?category=${product.categorySlug}`)}
          className="hover:text-emerald-800 capitalize"
        >
          {product.categoryName || 'Fabrics'}
        </button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-900 font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Layout (Gallery + Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails list */}
          {product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[600px] shrink-0 pb-2 sm:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-20 h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition bg-zinc-100 ${
                    selectedImageIdx === idx ? 'border-emerald-800 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image with subtle zoom */}
          <div className="flex-1 aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-lg relative group">
            <img
              src={product.images[selectedImageIdx]?.imageUrl || product.images[0]?.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            {product.newArrival && (
              <span className="absolute top-4 left-4 bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-md">
                NEW 2026
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Buying Info & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                {product.categoryName || 'Textiles'}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success('Link Copied', 'Product link copied to clipboard!');
                }}
                className="text-zinc-400 hover:text-emerald-800 p-1.5 rounded-lg hover:bg-emerald-50 transition"
                title="Share product"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 mt-1 leading-tight">
              {product.name}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-current' : 'text-zinc-200'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-zinc-900">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-zinc-400">({product.reviewCount} customer reviews)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-baseline gap-4">
            <span className="text-3xl font-extrabold text-emerald-950 font-sans">
              Rs. {(unitPrice ?? 0).toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-base text-zinc-400 line-through">
                Rs. {(product.price ?? 0).toLocaleString()}
              </span>
            )}
            {hasDiscount && (
              <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-md bg-rose-600 text-white">
                Save Rs. {((product.price ?? 0) - (product.discountPrice ?? 0)).toLocaleString()}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-zinc-600 leading-relaxed">
            {product.description}
          </p>

          {/* Product Specifications Table */}
          <div className="border border-zinc-200 rounded-2xl overflow-hidden divide-y divide-zinc-100 text-xs">
            {product.fabric && (
              <div className="grid grid-cols-3 p-3 bg-zinc-50/50">
                <span className="font-bold text-zinc-700">Fabric Quality:</span>
                <span className="col-span-2 text-zinc-900 font-medium">{product.fabric}</span>
              </div>
            )}
            {product.pieces && (
              <div className="grid grid-cols-3 p-3">
                <span className="font-bold text-zinc-700">Pieces / Inclusions:</span>
                <span className="col-span-2 text-zinc-900 font-medium">{product.pieces}</span>
              </div>
            )}
            {product.color && (
              <div className="grid grid-cols-3 p-3 bg-zinc-50/50">
                <span className="font-bold text-zinc-700">Color Palette:</span>
                <span className="col-span-2 text-zinc-900 font-medium">{product.color}</span>
              </div>
            )}
            {product.careInstructions && (
              <div className="grid grid-cols-3 p-3">
                <span className="font-bold text-zinc-700">Care Instructions:</span>
                <span className="col-span-2 text-zinc-900 font-medium">{product.careInstructions}</span>
              </div>
            )}
          </div>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2">
                <span>Select Option / Size:</span>
                {currentVariant && (
                  <span className="text-emerald-800 font-semibold">{currentVariant.value}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = (currentVariant?.id || product.variants[0]?.id) === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      disabled={v.stock <= 0}
                      className={`text-xs px-4 py-2.5 rounded-xl border font-bold transition flex items-center gap-1.5 ${
                        isSelected
                          ? 'border-emerald-800 bg-emerald-800 text-white shadow-xs'
                          : v.stock <= 0
                          ? 'border-zinc-200 bg-zinc-100 text-zinc-400 line-through cursor-not-allowed'
                          : 'border-zinc-200 bg-white text-zinc-800 hover:border-emerald-700'
                      }`}
                    >
                      <span>{v.value}</span>
                      {v.additionalPrice > 0 && (
                        <span className={`text-[10px] ${isSelected ? 'text-emerald-200' : 'text-zinc-500'}`}>
                          (+Rs. {v.additionalPrice})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector & Live Stock Indicator */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center border border-zinc-300 rounded-xl overflow-hidden bg-zinc-50">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2.5 text-zinc-600 hover:bg-zinc-200 font-bold transition"
              >
                -
              </button>
              <span className="px-5 py-2.5 text-sm font-bold text-zinc-900">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                disabled={quantity >= availableStock}
                className="px-4 py-2.5 text-zinc-600 hover:bg-zinc-200 font-bold transition disabled:opacity-30"
              >
                +
              </button>
            </div>

            <div className="text-right">
              {availableStock > 0 ? (
                <div className="text-xs">
                  <span className="text-emerald-800 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    In Stock ({availableStock} units ready for shipping)
                  </span>
                </div>
              ) : (
                <span className="text-xs text-rose-600 font-bold">Currently Sold Out</span>
              )}
            </div>
          </div>

          {/* Action Buttons: Add to Bag + Buy Now */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <button
                id="pdp-add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={availableStock <= 0 || isAdding}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg ${
                  isAdded
                    ? 'bg-emerald-800 text-white'
                    : availableStock <= 0
                    ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                    : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-900/15 active:scale-98'
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
                    <span>Add to Shopping Bag</span>
                  </>
                )}
              </button>

              <button
                id="pdp-buy-now-btn"
                onClick={handleBuyNow}
                disabled={availableStock <= 0}
                className="px-6 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm transition flex items-center gap-2 active:scale-98 shadow-md"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50/70 grid grid-cols-3 gap-3 text-center text-xs">
            <div className="flex flex-col items-center gap-1.5">
              <Truck className="w-5 h-5 text-emerald-700" />
              <span className="font-bold text-zinc-900">Nationwide COD</span>
              <span className="text-[10px] text-zinc-500">2-4 Business Days</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 border-x border-zinc-200">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span className="font-bold text-zinc-900">100% Authentic</span>
              <span className="text-[10px] text-zinc-500">Pure Swiss Voile</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <RefreshCw className="w-5 h-5 text-emerald-700" />
              <span className="font-bold text-zinc-900">7-Day Return</span>
              <span className="text-[10px] text-zinc-500">Easy Exchange</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Ratings Section */}
      <section className="pt-12 border-t border-zinc-200 space-y-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            Verified Feedback
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 mt-1">
            Customer Reviews ({reviews.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-6">
            {reviews.length === 0 ? (
              <p className="text-sm text-zinc-500 italic">No reviews yet for this article. Be the first to share your thoughts!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="p-6 rounded-2xl bg-zinc-50/60 border border-zinc-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-zinc-900">{rev.customerName}</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified Purchase
                      </span>
                    </div>
                    <span className="text-xs text-zinc-400">
                      {new Date(rev.createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-zinc-200'}`}
                      />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Write a Review Form */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <h4 className="font-serif font-bold text-xl text-zinc-900">Write a Review</h4>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Your Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-500 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= reviewRating ? 'fill-current' : 'text-zinc-200'}`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-zinc-700 ml-2">{reviewRating} out of 5</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="e.g. Fatima Tariq"
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-xs focus:outline-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Your Feedback
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details on fabric drape, embroidery detail, color vibrancy..."
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-xs focus:outline-emerald-700"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md"
              >
                {submittingReview ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-zinc-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">
              You May Also Like
            </h3>
            <button
              onClick={() => onNavigate(`/shop?category=${product.categorySlug}`)}
              className="text-xs font-bold text-emerald-800 hover:underline"
            >
              View More
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
