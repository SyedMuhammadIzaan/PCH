import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, HelpCircle } from 'lucide-react';
import { FAQ } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminFAQs: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const toast = useToast();

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const all = await api.getFAQs();
      setFaqs(all);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openCreateModal = () => {
    setEditingFaq(null);
    setQuestion('');
    setAnswer('');
    setIsModalOpen(true);
  };

  const openEditModal = (f: FAQ) => {
    setEditingFaq(f);
    setQuestion(f.question);
    setAnswer(f.answer);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<FAQ> = {
      question,
      answer,
      displayOrder: faqs.length + 1,
      status: 'active',
    };

    try {
      if (editingFaq) {
        await api.updateFAQ(editingFaq.id, payload);
        toast.success('FAQ Updated');
      } else {
        await api.createFAQ(payload);
        toast.success('FAQ Created');
      }
      setIsModalOpen(false);
      fetchFaqs();
    } catch (e) {
      toast.error('Save Failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FAQ entry?')) return;
    try {
      await api.deleteFAQ(id);
      toast.info('FAQ Removed');
      fetchFaqs();
    } catch (e) {
      toast.error('Delete Failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif italic text-xl font-bold text-pch-dark">FAQ Management</h2>
          <p className="text-xs text-slate-500">Add and update questions & answers displayed on the FAQ accordion.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-pch-dark hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-sm transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ</span>
        </button>
      </div>

      <div className="space-y-3">
        {faqs.map((f) => (
          <div key={f.id} className="bg-white p-5 rounded-sm border border-pch shadow-2xs flex items-start justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <h3 className="font-serif italic text-base font-bold text-pch-dark">{f.question}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{f.answer}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => openEditModal(f)}
                className="p-1.5 text-slate-600 hover:text-pch-dark hover:bg-slate-100 rounded-xs"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(f.id)}
                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xs"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-pch max-w-md w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-pch">
              <h3 className="font-serif italic text-xl font-bold text-pch-dark">
                {editingFaq ? 'Edit FAQ' : 'Add FAQ Question'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. Do you offer Cash on Delivery across Pakistan?"
                  className="w-full px-3 py-2 border border-pch rounded-sm focus:outline-emerald-700 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Answer *
                </label>
                <textarea
                  rows={4}
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Provide a helpful and thorough response..."
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
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
