import React, { useState } from 'react';
import { User, Lock, Mail, Phone, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';
import { GoogleSignInModal } from '../../components/common/GoogleSignInModal.js';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, register } = useAuth();
  const toast = useToast();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegisterMode) {
        await register({ name, email, password, phone });
        toast.success('Account Created', 'Welcome to Pakistan Cloth House!');
        onNavigate('/account');
      } else {
        await login(email, password);
        toast.success('Welcome Back', 'Signed in successfully.');
        onNavigate('/account');
      }
    } catch (err: any) {
      toast.error('Authentication Error', err.message || 'Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border border-emerald-100 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-1 border border-emerald-200">
            <User className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-zinc-900">
            {isRegisterMode ? 'Create an Account' : 'Sign In to PCH'}
          </h1>
          <p className="text-xs text-zinc-500">
            {isRegisterMode
              ? 'Join our VIP member circle for fast checkout and exclusive promotions'
              : 'Access your order history, saved addresses, and tailored recommendations'}
          </p>
        </div>

        {/* Google One-Click Sign In Button */}
        <button
          id="google-signin-btn"
          type="button"
          onClick={() => setIsGoogleModalOpen(true)}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl border border-zinc-300 hover:bg-zinc-50 text-zinc-700 font-semibold text-xs transition flex items-center justify-center gap-3 shadow-xs hover:border-zinc-400"
        >
          {/* Google G SVG */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-zinc-200"></div>
          <span className="flex-shrink mx-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Or with email
          </span>
          <div className="flex-grow border-t border-zinc-200"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fatima Tariq"
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:bg-white focus:outline-emerald-800"
                />
                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:bg-white focus:outline-emerald-800"
              />
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            </div>
          </div>

          {isRegisterMode && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-700 mb-1">
                Mobile Number (Pakistan)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:bg-white focus:outline-emerald-800"
                />
                <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:bg-white focus:outline-emerald-800"
              />
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition shadow-md flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isRegisterMode ? 'Create PCH Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center pt-2 border-t border-zinc-100">
          <button
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-xs text-emerald-800 font-bold hover:underline"
          >
            {isRegisterMode
              ? 'Already have an account? Sign In here'
              : "Don't have an account? Create an account now"}
          </button>
        </div>
      </div>

      {/* Google Account Selector Modal */}
      <GoogleSignInModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={() => onNavigate('/account')}
      />
    </div>
  );
};
