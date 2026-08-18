import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Check, X, Star, Sparkles, Filter } from 'lucide-react';
import { Product, Category } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const toast = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState<number>(5500);
  const [discountPrice, setDiscountPrice] = useState<string>('');
  const [stock, setStock] = useState<number>(20);
  const [fabric, setFabric] = useState('100% Swiss Voile Lawn');
  const [color, setColor] = useState('Emerald Green & Ivory');
  const [description, setDescription] = useState('');
  const [careInstructions, setCareInstructions] = useState('Dry clean recommended. Wash dark colors separately.');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        api.getProducts({ limit: 100 }),
        api.getCategories(),
      ]);
      setProducts(prods.products);
      setCategories(cats);
      if (cats.length > 0 && !categoryId) {
        setCategoryId(cats[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setCategoryId(categories[0]?.id || 'cat-1');
    setPrice(6500);
    setDiscountPrice('');
    setStock(25);
    setFabric('100% Swiss Voile Pure Lawn');
    setColor('Emerald Green & Mint');
    setDescription('Exclusive Pakistani embroidered lawn ensemble with schiffli detailing and pure chiffon dupatta.');
    setCareInstructions('Hand wash separately in cold water. Do not bleach.');
    setImageUrl('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80');
    setIsFeatured(false);
    setIsNewArrival(true);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategoryId(p.categoryId);
    setPrice(p.price);
    setDiscountPrice(p.discountPrice ? String(p.discountPrice) : '');
    setStock(p.stock);
    setFabric(p.fabric || '');
    setColor(p.color || '');
    setDescription(p.description);
    setCareInstructions(p.careInstructions || '');
    setImageUrl(p.images[0]?.imageUrl || '');
    setIsFeatured(p.featured);
    setIsNewArrival(p.newArrival);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCat = categories.find((c) => c.id === categoryId);

    const productPayload: Partial<Product> = {
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      categoryId,
      categoryName: selectedCat?.name || 'Textiles',
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      stock: Number(stock),
      description,
      fabric,
      color,
      careInstructions,
      featured: isFeatured,
      newArrival: isNewArrival,
      status: 'active',
      images: [
        {
          id: `img-${Date.now()}-1`,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
          displayOrder: 1,
        },
      ],
      variants: [
        { id: 'v1', name: 'Type', value: 'Standard Unstitched', stock: Number(stock), additionalPrice: 0 },
      ],
    };

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productPayload);
        toast.success('Product Updated', `Saved changes for ${name}`);
      } else {
        await api.createProduct(productPayload);
        toast.success('Product Created', `Added ${name} to store catalog`);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      toast.error('Error', err.message || 'Could not save product.');
    }
  };

  const handleDeleteProduct = async (id: string, prodName: string) => {
    if (!confirm(`Are you sure you want to delete "${prodName}" from the store?`)) return;
    try {
      await api.deleteProduct(id);
      toast.info('Product Deleted', `Removed ${prodName}`);
      fetchProducts();
    } catch (e) {
      toast.error('Delete Failed');
    }
  };

  const [activeQuickFilter, setActiveQuickFilter] = useState<'all' | 'new-arrivals' | 'featured' | 'low-stock'>('all');

  const handleToggleBadge = async (p: Product, field: 'newArrival' | 'featured') => {
    try {
      const updatedValue = !p[field];
      await api.updateProduct(p.id, { [field]: updatedValue });
      toast.success(
        'Product Updated',
        `${p.name} ${field === 'newArrival' ? (updatedValue ? 'marked as New Arrival' : 'removed from New Arrivals') : (updatedValue ? 'marked as Featured' : 'removed from Featured')}`
      );
      fetchProducts();
    } catch (e: any) {
      toast.error('Update Failed', e.message || 'Could not update product');
    }
  };

  const handleQuickStock = async (p: Product, delta: number) => {
    const newStock = Math.max(0, p.stock + delta);
    try {
      await api.updateProduct(p.id, { stock: newStock });
      toast.info('Stock Updated', `${p.name} inventory: ${newStock} units`);
      fetchProducts();
    } catch (e: any) {
      toast.error('Stock Update Failed');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.categoryName || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.fabric || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || p.categoryId === categoryFilter;
    
    let matchQuick = true;
    if (activeQuickFilter === 'new-arrivals') matchQuick = Boolean(p.newArrival);
    else if (activeQuickFilter === 'featured') matchQuick = Boolean(p.featured);
    else if (activeQuickFilter === 'low-stock') matchQuick = p.stock <= 10;

    return matchSearch && matchCat && matchQuick;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, fabrics..."
              className="pl-9 pr-4 py-2 bg-white border border-pch rounded-sm text-xs w-56 focus:outline-emerald-700 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-pch rounded-sm text-xs focus:outline-emerald-700"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-pch-dark hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-sm transition flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Quick Filter Pill Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveQuickFilter('all')}
          className={`px-3 py-1.5 rounded-sm font-bold uppercase tracking-wider transition ${
            activeQuickFilter === 'all'
              ? 'bg-pch-dark text-white'
              : 'bg-white border border-pch text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Items ({products.length})
        </button>
        <button
          onClick={() => setActiveQuickFilter('new-arrivals')}
          className={`px-3 py-1.5 rounded-sm font-bold uppercase tracking-wider transition flex items-center gap-1.5 ${
            activeQuickFilter === 'new-arrivals'
              ? 'bg-emerald-800 text-white'
              : 'bg-white border border-pch text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Arrivals ({products.filter((p) => p.newArrival).length})</span>
        </button>
        <button
          onClick={() => setActiveQuickFilter('featured')}
          className={`px-3 py-1.5 rounded-sm font-bold uppercase tracking-wider transition flex items-center gap-1.5 ${
            activeQuickFilter === 'featured'
              ? 'bg-amber-700 text-white'
              : 'bg-white border border-pch text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>Featured Showcase ({products.filter((p) => p.featured).length})</span>
        </button>
        <button
          onClick={() => setActiveQuickFilter('low-stock')}
          className={`px-3 py-1.5 rounded-sm font-bold uppercase tracking-wider transition ${
            activeQuickFilter === 'low-stock'
              ? 'bg-rose-700 text-white'
              : 'bg-white border border-pch text-slate-600 hover:bg-slate-50'
          }`}
        >
          Low Stock ({products.filter((p) => p.stock <= 10).length})
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-sm border border-pch shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-pch bg-slate-50 text-slate-400 uppercase tracking-widest text-[10px]">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (PKR)</th>
                <th className="py-3 px-4">Inventory</th>
                <th className="py-3 px-4">1-Click Badges</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pch">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={p.images[0]?.imageUrl}
                      alt=""
                      className="w-10 h-12 object-cover rounded-xs border border-pch shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate max-w-xs">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.fabric}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-emerald-800">{p.categoryName || 'Fabrics'}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900">Rs. {(p.price ?? 0).toLocaleString()}</span>
                    {p.discountPrice && (
                      <span className="text-[10px] text-rose-600 block">
                        Sale: Rs. {(p.discountPrice ?? 0).toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleQuickStock(p, -1)}
                        className="w-5 h-5 bg-slate-100 hover:bg-slate-200 rounded-xs flex items-center justify-center font-bold text-slate-700"
                        title="Decrease Stock"
                      >
                        -
                      </button>
                      <span className={`font-bold px-2 py-0.5 rounded-xs text-[10px] ${
                        p.stock <= 5 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {p.stock}
                      </span>
                      <button
                        onClick={() => handleQuickStock(p, 1)}
                        className="w-5 h-5 bg-slate-100 hover:bg-slate-200 rounded-xs flex items-center justify-center font-bold text-slate-700"
                        title="Increase Stock"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleBadge(p, 'newArrival')}
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-xs border transition flex items-center gap-1 ${
                          p.newArrival
                            ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                        }`}
                        title="Click to toggle New Arrival badge"
                      >
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>New Arrival</span>
                      </button>

                      <button
                        onClick={() => handleToggleBadge(p, 'featured')}
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-xs border transition flex items-center gap-1 ${
                          p.featured
                            ? 'bg-amber-100 border-amber-300 text-amber-900'
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                        }`}
                        title="Click to toggle Featured badge"
                      >
                        <Star className="w-2.5 h-2.5" />
                        <span>Featured</span>
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 text-slate-600 hover:text-pch-dark hover:bg-slate-100 rounded-xs"
                      title="Edit Product"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xs"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-pch max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-pch">
              <h3 className="font-serif italic text-xl font-bold text-pch-dark">
                {editingProduct ? 'Edit Product Details' : 'Add New Textile Ensemble'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Royal Embroidered Swiss Lawn 3-Piece"
                    className="w-full px-3 py-2 border border-pch rounded-sm focus:outline-emerald-700 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 border border-pch rounded-sm focus:outline-emerald-700"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Regular Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-pch rounded-sm focus:outline-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Discount / Sale Price (PKR, Optional)
                  </label>
                  <input
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="e.g. 4990"
                    className="w-full px-3 py-2 border border-pch rounded-sm focus:outline-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Inventory Stock Count *
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-pch rounded-sm focus:outline-emerald-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border border-pch rounded-sm focus:outline-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Fabric Type
                  </label>
                  <input
                    type="text"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    placeholder="100% Swiss Voile Lawn"
                    className="w-full px-3 py-2 border border-pch rounded-sm focus:outline-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Color / Motif
                  </label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="Emerald Green & Gold"
                    className="w-full px-3 py-2 border border-pch rounded-sm focus:outline-emerald-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Product Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-pch rounded-sm focus:outline-emerald-700"
                  />
                </div>

                <div className="flex items-center gap-6 sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="accent-emerald-700"
                    />
                    <span>Feature on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={isNewArrival}
                      onChange={(e) => setIsNewArrival(e.target.checked)}
                      className="accent-emerald-700"
                    />
                    <span>Mark as New Arrival</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-pch flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-pch text-slate-600 rounded-sm font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-pch-dark hover:bg-black text-white rounded-sm font-bold uppercase tracking-wider"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
