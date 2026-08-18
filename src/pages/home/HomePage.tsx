import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Star, ChevronDown, CheckCircle2, ShieldCheck, Truck, RefreshCw, Award, Send, Flame } from 'lucide-react';
import { Category, Product, Review, FAQ } from '../../types/index.js';
import { api } from '../../services/api.js';
import { ProductCard } from '../../components/common/ProductCard.js';
import { ProductCardSkeleton, CategoryCardSkeleton } from '../../components/common/SkeletonLoader.js';
import { QuickViewModal } from '../../components/common/QuickViewModal.js';
import { useToast } from '../../context/ToastContext.js';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [topSellingProducts, setTopSellingProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const toast = useToast();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [cats, feat, top, fresh, revs, faqList] = await Promise.all([
          api.getCategories(),
          api.getFeaturedProducts(4),
          api.getTopSellingProducts(4),
          api.getNewArrivals(4),
          api.getReviews({ status: 'approved', featured: true }),
          api.getFAQs('active'),
        ]);

        setCategories(cats.filter((c) => c.status === 'active'));
        setFeaturedProducts(feat);
        setTopSellingProducts(top);
        setNewArrivals(fresh);
        setReviews(revs);
        setFaqs(faqList);
        if (faqList.length > 0) {
          setActiveFaqId(faqList[0].id);
        }
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    toast.success('Subscribed to PCH VIP Club!', 'Thank you for subscribing. Enjoy 10% off your next purchase.');
    setNewsletterEmail('');
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION (EDITORIAL AESTHETIC) */}
      <section className="relative overflow-hidden bg-white border-b border-pch">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
            {/* Left Hero Column */}
            <div className="lg:col-span-6 p-8 sm:p-14 lg:p-16 flex flex-col justify-center">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-[2px] w-12 bg-emerald-400"></span>
                <span className="text-[12px] font-bold tracking-widest text-emerald-800 uppercase">
                  Est. 1988 — Premium Pakistani Textiles
                </span>
              </div>

              <h1 className="text-5xl sm:text-7xl lg:text-[76px] font-serif italic text-pch-dark leading-[0.95] mb-6">
                Discover <br />
                Your <span className="text-emerald-700 not-italic font-sans font-black tracking-tight">STYLE.</span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-md mb-8">
                Experience the finest Pakistani fabrics and timeless craftsmanship. From everyday Swiss Voile lawn to luxury silk collections.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  id="hero-shop-now-btn"
                  onClick={() => onNavigate('/shop')}
                  className="bg-pch-dark text-white px-8 sm:px-10 py-4 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-black transition-colors shadow-md"
                >
                  Shop Now
                </button>
                <button
                  id="hero-explore-btn"
                  onClick={() => onNavigate('/shop?category=unstitched-lawn')}
                  className="border border-pch-dark text-pch-dark px-8 sm:px-10 py-4 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-pch-soft transition-colors"
                >
                  Explore Trends
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-8 mt-8 border-t border-pch grid grid-cols-3 gap-4 max-w-md">
                <div>
                  <p className="font-serif text-2xl font-bold text-pch-dark">100%</p>
                  <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Pure Fabrics</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-pch-dark">2-4 Days</p>
                  <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Nationwide COD</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-pch-dark">50k+</p>
                  <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Happy Clients</p>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Editorial Visual Mask */}
            <div className="lg:col-span-6 relative bg-pch-soft overflow-hidden flex items-end justify-end min-h-[400px] lg:min-h-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/30 to-transparent pointer-events-none" />
              
              <div className="w-full lg:w-[90%] h-full min-h-[400px] lg:h-[92%] hero-mask flex items-center justify-center overflow-hidden border-l-4 border-emerald-400 shadow-2xl relative">
                <img
                  src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85"
                  alt="Pakistan Cloth House Editorial"
                  className="w-full h-full object-cover object-center scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Floating Editorial Badge */}
              <div className="absolute bottom-8 left-8 p-5 bg-white shadow-xl flex flex-col gap-1 border-l-4 border-emerald-400 z-10">
                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Trending Now</span>
                <span className="text-base sm:text-lg font-serif italic text-pch-dark">Emerald Chiffon '26</span>
                <span className="text-sm font-bold text-pch-dark font-sans">Rs. 18,500</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 border-b border-pch pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[12px] font-bold uppercase tracking-widest text-emerald-800">
                Curated Collections
              </span>
            </div>
            <h2 className="font-serif italic text-3xl sm:text-4xl font-bold text-pch-dark">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/shop')}
            className="text-xs font-bold uppercase tracking-widest text-pch-dark hover:text-emerald-700 flex items-center gap-2 group transition"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {categories.slice(0, 8).map((cat) => (
              <div
                key={cat.id}
                id={`cat-card-${cat.slug}`}
                onClick={() => onNavigate(`/shop?category=${cat.slug}`)}
                className="group relative aspect-[3/4] rounded-sm overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 bg-slate-900 border border-pch"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-95"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                    {cat.productCount !== undefined ? `${cat.productCount} Designs` : 'Collection'}
                  </span>
                  <h3 className="font-serif italic text-xl font-bold mt-1 group-hover:text-emerald-200 transition">
                    {cat.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="uppercase tracking-widest text-[10px] font-bold">Explore</span>
                    <ArrowRight className="w-3 h-3 text-emerald-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. FEATURED PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 border-b border-pch pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[12px] font-bold uppercase tracking-widest text-emerald-800">
                Editorial Showcase
              </span>
            </div>
            <h2 className="font-serif italic text-3xl sm:text-4xl font-bold text-pch-dark">
              Featured Ensembles
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/shop?filter=featured')}
            className="text-xs font-bold uppercase tracking-widest text-pch-dark hover:text-emerald-700 flex items-center gap-2 group transition"
          >
            <span>View All Featured</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onNavigate={onNavigate}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. EDITORIAL PROMOTIONAL SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-sm overflow-hidden bg-pch-dark text-white shadow-2xl p-8 sm:p-14 border-l-8 border-emerald-400">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-300">
                Exclusive Spring/Summer Showcase
              </span>
              <h2 className="font-serif italic text-3xl sm:text-5xl font-bold leading-tight">
                Luxury Lawn & Pure Chiffon Dupattas
              </h2>
              <p className="text-sm sm:text-base text-emerald-100/90 max-w-xl leading-relaxed">
                Elevate your seasonal wardrobe with hand-embroidered schiffli motifs, pure silk borders, and organza insets. Use code <strong className="text-white bg-emerald-900 px-2 py-0.5 rounded-sm">PCH10</strong> at checkout for instant discounts.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/shop?category=unstitched-lawn')}
                  className="px-8 py-3.5 bg-white text-pch-dark font-bold text-xs uppercase tracking-widest hover:bg-emerald-100 transition shadow-lg"
                >
                  Explore Collection
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 hidden lg:flex justify-end">
              <div className="w-60 h-72 rounded-sm overflow-hidden shadow-2xl border-2 border-emerald-400/40 bg-emerald-950 rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
                  alt="Promotional Showcase"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TOP SELLING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 border-b border-pch pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-[12px] font-bold uppercase tracking-widest text-emerald-800">
                Customer Favorites
              </span>
            </div>
            <h2 className="font-serif italic text-3xl sm:text-4xl font-bold text-pch-dark">
              Top Selling Products
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/shop?sort=top-selling')}
            className="text-xs font-bold uppercase tracking-widest text-pch-dark hover:text-emerald-700 flex items-center gap-2 group transition"
          >
            <span>View All Best Sellers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topSellingProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onNavigate={onNavigate}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 6. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 border-b border-pch pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[12px] font-bold uppercase tracking-widest text-emerald-800">
                Fresh Drops
              </span>
            </div>
            <h2 className="font-serif italic text-3xl sm:text-4xl font-bold text-pch-dark">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/shop?sort=newest')}
            className="text-xs font-bold uppercase tracking-widest text-pch-dark hover:text-emerald-700 flex items-center gap-2 group transition"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onNavigate={onNavigate}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 7. WHY CHOOSE PAKISTAN CLOTH HOUSE (EDITORIAL CARDS) */}
      <section id="why-choose-us" className="bg-pch-soft py-16 sm:py-20 border-y border-pch scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-800">
              The PCH Promise
            </span>
            <h2 className="font-serif italic text-3xl sm:text-4xl font-bold text-pch-dark mt-2">
              Why Choose Pakistan Cloth House?
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              We stand apart through fiber authenticity, master artisanal embroideries, and reliable nationwide fulfilment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-sm border-l-4 border-emerald-400 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-sm bg-pch-soft text-pch-dark flex items-center justify-center mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif italic font-bold text-xl text-pch-dark mb-2">Premium Quality</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hand-selected 100% Swiss Voile lawn, Egyptian cotton, and pure silk fabrics tested rigorously for zero color bleed.
              </p>
            </div>

            <div className="bg-white p-8 rounded-sm border-l-4 border-emerald-400 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-sm bg-pch-soft text-pch-dark flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif italic font-bold text-xl text-pch-dark mb-2">Trusted Shopping</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Over 50,000+ satisfied clients across Pakistan and overseas. Transparent pricing with open parcel verification options.
              </p>
            </div>

            <div className="bg-white p-8 rounded-sm border-l-4 border-emerald-400 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-sm bg-pch-soft text-pch-dark flex items-center justify-center mb-6">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-serif italic font-bold text-xl text-pch-dark mb-2">Fast Delivery</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Speedy 2-4 business day delivery across Lahore, Karachi, Islamabad, and 200+ cities with reliable Cash on Delivery.
              </p>
            </div>

            <div className="bg-white p-8 rounded-sm border-l-4 border-emerald-400 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-sm bg-pch-soft text-pch-dark flex items-center justify-center mb-6">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="font-serif italic font-bold text-xl text-pch-dark mb-2">7-Day Return</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enjoy complete peace of mind with our no-questions-asked 7-day exchange and return policy on unworn articles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CUSTOMER REVIEWS (EDITORIAL QUOTE CARDS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-800">
            Real Testimonials
          </span>
          <h2 className="font-serif italic text-3xl sm:text-4xl font-bold text-pch-dark mt-2">
            What Our Customers Say
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Verified feedback from fashion connoisseurs and loyal patrons across Pakistan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-pch-soft p-6 sm:p-8 rounded-sm border border-emerald-200/50 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-amber-500 text-sm">★</span>
                  ))}
                </div>

                <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-pch flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-400 text-pch-dark font-bold text-xs flex items-center justify-center">
                    {rev.customerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-widest text-pch-dark">{rev.customerName}</h4>
                    <p className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified Buyer</span>
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                  {new Date(rev.createdAt).toLocaleDateString('en-PK', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FAQ ACCORDION SECTION */}
      <section id="faqs" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center mb-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-800">
            Got Questions?
          </span>
          <h2 className="font-serif italic text-3xl sm:text-4xl font-bold text-pch-dark mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = activeFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-sm border border-pch overflow-hidden shadow-2xs transition"
              >
                <button
                  id={`faq-toggle-${faq.id}`}
                  onClick={() => setActiveFaqId(isOpen ? null : faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-serif font-bold text-base sm:text-lg text-pch-dark hover:text-emerald-700 transition"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-emerald-700 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-pch pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. NEWSLETTER / CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-pch-dark text-white rounded-sm p-8 sm:p-14 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden border-t-4 border-emerald-400">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-300">
              Join the PCH VIP Club
            </span>
            <h2 className="font-serif italic text-3xl sm:text-4xl font-bold leading-tight">
              Get 10% Off Your First Order
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Subscribe to receive private preview access to our seasonal Lawn launches, Eid collections, and exclusive member discounts.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 px-5 py-3.5 rounded-sm bg-white/10 border border-emerald-700 text-white placeholder-emerald-300/70 text-sm focus:outline-emerald-300 focus:bg-white/20 transition"
              />
              <button
                type="submit"
                className="px-8 py-3.5 rounded-sm bg-emerald-400 text-pch-dark hover:bg-emerald-300 font-bold text-xs uppercase tracking-widest transition shrink-0 flex items-center justify-center gap-2 shadow-md"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
