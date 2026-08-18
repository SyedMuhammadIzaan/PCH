import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, FolderTree } from 'lucide-react';
import { Category } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const toast = useToast();

  const fetchCats = async () => {
    setLoading(true);
    try {
      const cats = await api.getCategories();
      setCategories(cats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('Curated Pakistani fabrics and pret wear.');
    setImage('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80');
    setIsModalOpen(true);
  };

  const openEditModal = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setDescription(c.description || '');
    setImage(c.image);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      image,
      status: 'active' as const,
    };

    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, payload);
        toast.success('Category Updated', `Saved changes for ${name}`);
      } else {
        await api.createCategory(payload);
        toast.success('Category Created', `Added ${name}`);
      }
      setIsModalOpen(false);
      fetchCats();
    } catch (e: any) {
      toast.error('Error', e.message || 'Could not save category.');
    }
  };

  const handleDeleteCategory = async (id: string, catName: string) => {
    if (!confirm(`Delete category "${catName}"?`)) return;
    try {
      await api.deleteCategory(id);
      toast.info('Category Deleted', `Removed ${catName}`);
      fetchCats();
    } catch (e) {
      toast.error('Delete Failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif italic text-xl font-bold text-pch-dark">Store Collections & Categories</h2>
          <p className="text-xs text-slate-500">Manage categories displayed on the storefront and navigation.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-pch-dark hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-sm transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div key={c.id} className="bg-white rounded-sm border border-pch overflow-hidden shadow-xs flex flex-col justify-between">
            <div className="aspect-[16/9] w-full bg-slate-100 overflow-hidden relative">
              <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded-xs bg-white text-pch-dark text-[10px] font-bold uppercase border border-pch">
                {c.productCount || 0} Products
              </span>
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif italic text-lg font-bold text-pch-dark">{c.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{c.description}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-1">Slug: {c.slug}</p>
              </div>
              <div className="pt-3 border-t border-pch flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(c)}
                  className="p-1.5 text-slate-600 hover:text-pch-dark hover:bg-slate-100 rounded-xs"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(c.id, c.name)}
                  className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xs"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-pch max-w-md w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-pch">
              <h3 className="font-serif italic text-xl font-bold text-pch-dark">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Velvet Formals"
                  className="w-full px-3 py-2 border border-pch rounded-sm focus:outline-emerald-700 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Banner Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 border border-pch rounded-sm focus:outline-emerald-700"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-pch rounded-sm focus:outline-emerald-700"
                />
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
