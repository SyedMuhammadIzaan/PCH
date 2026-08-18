import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../../types/index.js';
import { api } from '../../services/api.js';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onSearchSubmit: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onSearchSubmit,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickCategories = [
    'Luxury Lawn',
    'Stitched Pret',
    "Men's Kurta",
    'Festive Chiffon',
    'Khaddar',
    'Silk & Velvet',
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.getProducts({ search: query, limit: 6 });
        setResults(res.products);
      } catch (e) {
        console.error('Search error', e);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="p-4 sm:p-6 border-b border-zinc-100 flex items-center gap-3">
          <Search className="w-6 h-6 text-emerald-700 shrink-0" />
          <input
            ref={inputRef}
            id="search-modal-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                onSearchSubmit(query);
                onClose();
              }
            }}
            placeholder="Search Pakistani lawn, stitched pret, silk, kurta, shawls..."
            className="w-full bg-transparent text-lg text-zinc-900 placeholder-zinc-400 focus:outline-hidden font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        {!query && (
          <div className="p-6 bg-emerald-50/40 border-b border-emerald-100/50">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Popular Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setQuery(cat);
                  }}
                  className="text-xs px-3 py-1.5 rounded-full bg-white border border-emerald-200 text-emerald-900 hover:bg-emerald-700 hover:text-white transition font-medium shadow-2xs"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <div className="py-12 text-center text-sm text-zinc-500 flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
              <span>Searching catalog...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                <span>Products ({results.length})</span>
                <button
                  onClick={() => {
                    onSearchSubmit(query);
                    onClose();
                  }}
                  className="text-emerald-700 hover:underline flex items-center gap-1 font-bold"
                >
                  View All Results <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {results.map((product) => (
                <div
                  key={product.id}
                  id={`search-result-${product.id}`}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-emerald-50/70 border border-transparent hover:border-emerald-200 cursor-pointer transition group"
                >
                  <img
                    src={product.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=200&q=80'}
                    alt={product.name}
                    className="w-14 h-16 object-cover rounded-xl shrink-0 border border-zinc-200 group-hover:scale-105 transition"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider truncate">
                      {product.categoryName || 'Fashion'}
                    </p>
                    <p className="text-sm font-bold text-zinc-900 truncate group-hover:text-emerald-950">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-emerald-800">
                        Rs. {(product.discountPrice || product.price || 0).toLocaleString()}
                      </span>
                      {product.discountPrice && (
                        <span className="text-xs text-zinc-400 line-through">
                          Rs. {(product.price || 0).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-emerald-700 group-hover:translate-x-1 transition shrink-0" />
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="py-12 text-center">
              <p className="text-base font-semibold text-zinc-800">No products found for "{query}"</p>
              <p className="text-xs text-zinc-500 mt-1">Try searching for lawn, pret, kurta, silk, or khaddar.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
