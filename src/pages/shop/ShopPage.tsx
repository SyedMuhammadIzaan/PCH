import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, RotateCcw, Search, ChevronRight } from 'lucide-react';
import { Product, Category } from '../../types/index.js';
import { api } from '../../services/api.js';
import { ProductCard } from '../../components/common/ProductCard.js';
import { ProductCardSkeleton } from '../../components/common/SkeletonLoader.js';
import { QuickViewModal } from '../../components/common/QuickViewModal.js';

interface ShopPageProps {
  initialCategory?: string;
  initialSort?: string;
  initialFilter?: string;
  onNavigate: (path: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory,
  initialSort,
  initialFilter,
  onNavigate,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(initialCategory || '');
  const [selectedSort, setSelectedSort] = useState<string>(initialSort || 'newest');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 25000 });
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(initialFilter === 'featured');
  const [newArrivalsOnly, setNewArrivalsOnly] = useState<boolean>(initialFilter === 'new-arrivals');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Mobile Filter Drawer
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (initialCategory) setSelectedCategorySlug(initialCategory);
    if (initialSort) setSelectedSort(initialSort);
    if (initialFilter === 'featured') setFeaturedOnly(true);
    if (initialFilter === 'new-arrivals') setNewArrivalsOnly(true);
  }, [initialCategory, initialSort, initialFilter]);

  // Load Categories on mount
  useEffect(() => {
    api.getCategories().then((cats) => setCategories(cats.filter((c) => c.status === 'active'))).catch(console.error);
  }, []);

  // Fetch Products based on current filters
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const params: Record<string, any> = {
          sort: selectedSort,
          categorySlug: selectedCategorySlug || undefined,
          search: searchQuery || undefined,
          minPrice: priceRange.min > 0 ? priceRange.min : undefined,
          maxPrice: priceRange.max < 25000 ? priceRange.max : undefined,
          inStock: inStockOnly || undefined,
          featured: featuredOnly || undefined,
          newArrival: newArrivalsOnly || undefined,
          limit: 50,
        };

        const res = await api.getProducts(params);
        setProducts(res.products);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [selectedCategorySlug, selectedSort, priceRange, inStockOnly, featuredOnly, newArrivalsOnly, searchQuery]);

  const resetFilters = () => {
    setSelectedCategorySlug('');
    setSelectedSort('newest');
    setPriceRange({ min: 0, max: 25000 });
    setInStockOnly(false);
    setFeaturedOnly(false);
    setNewArrivalsOnly(false);
    setSearchQuery('');
  };

  const hasActiveFilters =
    !!selectedCategorySlug ||
    priceRange.min > 0 ||
    priceRange.max < 25000 ||
    inStockOnly ||
    featuredOnly ||
    newArrivalsOnly ||
    !!searchQuery;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner & Breadcrumbs */}
      <div className="border-b border-zinc-100 pb-6">
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
          <button onClick={() => onNavigate('/')} className="hover:text-emerald-800">Home</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-900 font-semibold">Shop Collections</span>
          {selectedCategorySlug && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-emerald-800 font-bold capitalize">
                {categories.find((c) => c.slug === selectedCategorySlug)?.name || selectedCategorySlug}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900">
              {selectedCategorySlug
                ? categories.find((c) => c.slug === selectedCategorySlug)?.name || 'Fashion Collection'
                : 'All Pakistani Fashion & Fabrics'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Showing {products.length} {products.length === 1 ? 'article' : 'articles'} crafted with pure fibers.
            </p>
          </div>

          {/* Desktop & Mobile Sort Controls */}
          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              id="mobile-filter-btn"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-800 font-bold text-xs flex items-center gap-2 shadow-xs"
            >
              <Filter className="w-4 h-4 text-emerald-800" />
              <span>Filters</span>
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-700 shadow-2xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-emerald-800" />
              <span className="text-zinc-400 hidden sm:inline">Sort by:</span>
              <select
                id="shop-sort-select"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="bg-transparent focus:outline-hidden font-bold text-zinc-900 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="top-selling">Best Selling</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="highest-rated">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100/60 text-xs">
          <span className="font-bold text-emerald-950">Active Filters:</span>

          {selectedCategorySlug && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-emerald-200 text-emerald-900 font-medium shadow-2xs">
              Category: {categories.find((c) => c.slug === selectedCategorySlug)?.name}
              <button onClick={() => setSelectedCategorySlug('')} className="hover:text-emerald-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-emerald-200 text-emerald-900 font-medium shadow-2xs">
              Search: "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="hover:text-emerald-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {priceRange.max < 25000 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-emerald-200 text-emerald-900 font-medium shadow-2xs">
              Max Price: Rs. {priceRange.max.toLocaleString()}
              <button onClick={() => setPriceRange({ min: 0, max: 25000 })} className="hover:text-emerald-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-emerald-200 text-emerald-900 font-medium shadow-2xs">
              In Stock Only
              <button onClick={() => setInStockOnly(false)} className="hover:text-emerald-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {featuredOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-emerald-200 text-emerald-900 font-medium shadow-2xs">
              Featured Articles
              <button onClick={() => setFeaturedOnly(false)} className="hover:text-emerald-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {newArrivalsOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-emerald-200 text-emerald-900 font-medium shadow-2xs">
              New Arrivals
              <button onClick={() => setNewArrivalsOnly(false)} className="hover:text-emerald-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={resetFilters}
            className="ml-auto text-emerald-800 hover:text-emerald-950 font-bold underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>
      )}

      {/* Main Shop Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar (Desktop) */}
        <aside className="hidden lg:block space-y-8 pr-4">
          {/* Quick Search */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2">
              Search Products
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, fabric, color..."
                className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:bg-white focus:outline-emerald-700 font-medium"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Categories Filter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">
              Categories
            </h3>
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedCategorySlug('')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                  selectedCategorySlug === ''
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-zinc-600 hover:bg-emerald-50 hover:text-emerald-900'
                }`}
              >
                <span>All Categories</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategorySlug(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                    selectedCategorySlug === cat.slug
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-zinc-600 hover:bg-emerald-50 hover:text-emerald-900'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {cat.productCount !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                      selectedCategorySlug === cat.slug ? 'bg-emerald-900 text-emerald-100' : 'bg-zinc-100 text-zinc-500'
                    }`}>
                      {cat.productCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">
              <span>Price Range (PKR)</span>
              <span className="text-emerald-800">Up to Rs. {priceRange.max.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="25000"
              step="500"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ min: 0, max: Number(e.target.value) })}
              className="w-full accent-emerald-800 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-zinc-400 mt-1">
              <span>Rs. 1,000</span>
              <span>Rs. 25,000+</span>
            </div>
          </div>

          {/* Additional Toggles */}
          <div className="space-y-3 pt-4 border-t border-zinc-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2">
              Preferences
            </h3>

            <label className="flex items-center gap-3 text-xs text-zinc-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded-md accent-emerald-800"
              />
              <span>In Stock Only</span>
            </label>

            <label className="flex items-center gap-3 text-xs text-zinc-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={newArrivalsOnly}
                onChange={(e) => setNewArrivalsOnly(e.target.checked)}
                className="w-4 h-4 rounded-md accent-emerald-800"
              />
              <span>New Arrivals Only</span>
            </label>

            <label className="flex items-center gap-3 text-xs text-zinc-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => setFeaturedOnly(e.target.checked)}
                className="w-4 h-4 rounded-md accent-emerald-800"
              />
              <span>Featured Only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area (3 Columns on desktop) */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onNavigate={onNavigate}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-zinc-50 rounded-3xl border border-zinc-200 p-8">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-zinc-900 mb-2">No Products Found</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-6 leading-relaxed">
                We couldn't find any products matching your current filters. Try loosening your criteria or resetting your search.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider transition"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                  <h3 className="font-serif text-lg font-bold text-zinc-900">Filters</h3>
                  <button onClick={() => setIsMobileFilterOpen(false)}>
                    <X className="w-5 h-5 text-zinc-500" />
                  </button>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2">Category</h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategorySlug('')}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                        selectedCategorySlug === '' ? 'bg-emerald-800 text-white' : 'text-zinc-600'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCategorySlug(c.slug)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                          selectedCategorySlug === c.slug ? 'bg-emerald-800 text-white' : 'text-zinc-600'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2">
                    Max Price: Rs. {priceRange.max.toLocaleString()}
                  </h4>
                  <input
                    type="range"
                    min="1000"
                    max="25000"
                    step="500"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ min: 0, max: Number(e.target.value) })}
                    className="w-full accent-emerald-800"
                  />
                </div>

                {/* Toggles */}
                <div className="space-y-2 pt-4 border-t border-zinc-100">
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="accent-emerald-800"
                    />
                    <span>In Stock Only</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={featuredOnly}
                      onChange={(e) => setFeaturedOnly(e.target.checked)}
                      className="accent-emerald-800"
                    />
                    <span>Featured Only</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={newArrivalsOnly}
                      onChange={(e) => setNewArrivalsOnly(e.target.checked)}
                      className="accent-emerald-800"
                    />
                    <span>New Arrivals Only</span>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-100 flex gap-3">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
