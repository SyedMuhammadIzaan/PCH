import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, KeyRound, Sparkles, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const { login, quickSwitchUser } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('admin@pch.pk');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password || 'admin123');
      toast.success('Admin Authenticated', 'Welcome to PCH Control Center');
      onNavigate('/admin/dashboard');
    } catch (err: any) {
      toast.error('Authentication Failed', err.message || 'Invalid administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAdmin = async () => {
    setLoading(true);
    try {
      await quickSwitchUser('admin');
      toast.success('Admin Mode Activated', 'Entered demo administrative portal.');
      onNavigate('/admin/dashboard');
    } catch (err: any) {
      toast.error('Login Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans">
      {/* Top Header */}
      <header className="p-6 flex items-center justify-between border-b border-slate-800">
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-serif font-black text-xl text-white">
            PCH<span className="text-emerald-400">.</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 border border-emerald-900 bg-emerald-950/60 px-2 py-0.5 rounded">
            Admin Portal
          </span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
              PCH Staff & Admin Access
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Secure control center for catalog management, order fulfillment, and store analytics.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-300 mb-1.5">
                Staff Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pch.pk"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-emerald-500 focus:border-emerald-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-300 mb-1.5">
                Security Password / Token
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-emerald-500 focus:border-emerald-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-xl transition shadow-lg flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In as Administrator</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition border border-slate-700 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Instant Demo Admin Access</span>
            </button>

            <div className="flex items-center gap-2 text-[10px] text-slate-500 justify-center">
              <KeyRound className="w-3 h-3 text-slate-500" />
              <span>Standard demo credentials: admin@pch.pk / admin123</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-slate-600 border-t border-slate-900">
        © 2026 Pakistan Cloth House Internal Administration System. Restricted Access.
      </footer>
    </div>
  );
};
