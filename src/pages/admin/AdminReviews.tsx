import React, { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Review } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const all = await api.getReviews();
      setReviews(all);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.updateReview(id, { status });
      toast.success('Review Status Updated', `Status changed to ${status}`);
      fetchReviews();
    } catch (e) {
      toast.error('Update Failed');
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      await api.updateReview(id, { featured: !currentFeatured });
      toast.success('Featured Status', !currentFeatured ? 'Review featured on homepage' : 'Review unfeatured');
      fetchReviews();
    } catch (e) {
      toast.error('Update Failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this customer review?')) return;
    try {
      await api.deleteReview(id);
      toast.info('Review Deleted');
      fetchReviews();
    } catch (e) {
      toast.error('Delete Failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif italic text-xl font-bold text-pch-dark">Customer Reviews & Testimonials</h2>
        <p className="text-xs text-slate-500">Approve authentic customer reviews and curate featured testimonials for the homepage.</p>
      </div>

      <div className="bg-white rounded-sm border border-pch shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-pch bg-slate-50 text-slate-400 uppercase tracking-widest text-[10px]">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Comment</th>
                <th className="py-3 px-4">Homepage Feature</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pch">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{r.customerName}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center text-amber-500 font-bold">
                      <span>★</span>
                      <span className="ml-1 text-slate-700">{r.rating}/5</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-md text-slate-600 italic">
                    "{r.comment}"
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleFeatured(r.id, r.featured)}
                      className={`px-2.5 py-1 rounded-xs font-bold text-[10px] uppercase tracking-wider transition ${
                        r.featured
                          ? 'bg-emerald-400 text-pch-dark'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {r.featured ? 'Featured on Home' : 'Not Featured'}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-xs font-bold text-[10px] uppercase tracking-wider ${
                      r.status === 'approved' ? 'bg-emerald-100 text-emerald-900' :
                      r.status === 'rejected' ? 'bg-rose-100 text-rose-900' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    {r.status !== 'approved' && (
                      <button
                        onClick={() => handleUpdateStatus(r.id, 'approved')}
                        className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-xs"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {r.status !== 'rejected' && (
                      <button
                        onClick={() => handleUpdateStatus(r.id, 'rejected')}
                        className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-xs"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xs"
                      title="Delete"
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
    </div>
  );
};
