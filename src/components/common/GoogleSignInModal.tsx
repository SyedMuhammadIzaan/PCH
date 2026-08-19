import React, { useState, useEffect } from 'react';
import { User, X, Plus, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface SavedGoogleAccount {
  email: string;
  name: string;
  avatar?: string;
}

const DEFAULT_ACCOUNTS: SavedGoogleAccount[] = [
  {
    email: 'muhammadizaan201@gmail.com',
    name: 'Muhammad Izaan',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
  },
];

export const GoogleSignInModal: React.FC<GoogleSignInModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginWithGoogle } = useAuth();
  const toast = useToast();

  const [savedAccounts, setSavedAccounts] = useState<SavedGoogleAccount[]>([]);
  const [isCustomAccount, setIsCustomAccount] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pch_saved_google_accounts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedAccounts(parsed);
          return;
        }
      }
    } catch {}
    setSavedAccounts(DEFAULT_ACCOUNTS);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectAccount = async (account: SavedGoogleAccount) => {
    setLoading(true);
    try {
      await loginWithGoogle(account.email, account.name);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error('Sign-in Error', err.message || 'Could not connect account.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;

    setLoading(true);
    const emailToUse = customEmail.trim().toLowerCase();
    const nameToUse = customName.trim() || emailToUse.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    try {
      await loginWithGoogle(emailToUse, nameToUse);

      // Save to saved accounts list
      const updatedAccounts = [
        { email: emailToUse, name: nameToUse },
        ...savedAccounts.filter((a) => a.email !== emailToUse),
      ].slice(0, 4);

      setSavedAccounts(updatedAccounts);
      localStorage.setItem('pch_saved_google_accounts', JSON.stringify(updatedAccounts));

      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error('Google Sign-in Failed', err.message || 'Unable to authenticate with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden font-sans">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
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
            <div>
              <h3 className="font-medium text-base text-zinc-900 leading-tight">Sign in with Google</h3>
              <p className="text-xs text-zinc-500">to continue to Pakistan Cloth House</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          {!isCustomAccount ? (
            <>
              <p className="text-xs font-semibold text-zinc-700">Choose a Google Account</p>

              {/* Saved accounts list */}
              <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-xl overflow-hidden shadow-2xs">
                {savedAccounts.map((acc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={loading}
                    onClick={() => handleSelectAccount(acc)}
                    className="w-full p-3.5 flex items-center justify-between gap-3 text-left hover:bg-zinc-50 transition group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {acc.avatar ? (
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-9 h-9 rounded-full object-cover border border-zinc-200"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm border border-emerald-200">
                          {acc.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-zinc-900 truncate group-hover:text-emerald-900">
                          {acc.name}
                        </p>
                        <p className="text-[11px] text-zinc-500 truncate">{acc.email}</p>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-emerald-800 group-hover:translate-x-0.5 transition shrink-0" />
                  </button>
                ))}

                {/* Add / Use another account button */}
                <button
                  type="button"
                  onClick={() => setIsCustomAccount(true)}
                  className="w-full p-3.5 flex items-center gap-3 text-left hover:bg-zinc-50 text-emerald-800 hover:text-emerald-950 font-semibold text-xs transition"
                >
                  <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span>Use another Google / Gmail account</span>
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                <span className="text-xs font-bold text-zinc-800">Enter your Google Account details</span>
                <button
                  type="button"
                  onClick={() => setIsCustomAccount(false)}
                  className="text-xs text-emerald-800 font-semibold hover:underline"
                >
                  Back to accounts
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                  Google Email / Gmail Address *
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:bg-white focus:outline-emerald-700 focus:border-emerald-700 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                  Your Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Muhammad Izaan"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:bg-white focus:outline-emerald-700 focus:border-emerald-700 transition"
                />
              </div>

              <div className="pt-2 flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsCustomAccount(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Next & Connect</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Privacy Note */}
          <div className="pt-3 border-t border-zinc-100 flex items-start gap-2 text-[11px] text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <p className="leading-tight">
              To continue, Google will share your name, email address, and profile picture with Pakistan Cloth House.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
