import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types/index.js';
import { api } from '../services/api.js';
import { useToast } from './ToastContext.js';
import { auth, googleAuthProvider } from '../lib/firebase.js';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  loginWithGoogle: (customEmail?: string, customName?: string) => Promise<void>;
  register: (data: { name: string; email: string; phone?: string; password?: string }) => Promise<void>;
  logout: () => void;
  quickSwitchUser: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const toast = useToast();

  useEffect(() => {
    // Check existing stored auth token and verify with backend
    const checkAuth = async () => {
      const token = localStorage.getItem('pch_auth_token');
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.user);
        } catch {
          localStorage.removeItem('pch_auth_token');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();

    // Firebase Auth State Listener
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser && fbUser.email && !localStorage.getItem('pch_auth_token')) {
        try {
          const res = await api.loginWithGoogle({
            email: fbUser.email,
            name: fbUser.displayName || fbUser.email.split('@')[0],
            avatar: fbUser.photoURL || undefined,
          });
          localStorage.setItem('pch_auth_token', res.token);
          setUser(res.user);
        } catch (e) {
          console.warn('Firebase user sync note:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (customEmail?: string, customName?: string) => {
    setLoading(true);
    try {
      if (customEmail) {
        // Direct / custom account connection (e.g., from Google Account picker modal)
        const email = customEmail.toLowerCase().trim();
        const name = customName || email.split('@')[0];
        const res = await api.loginWithGoogle({
          email,
          name,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        });
        localStorage.setItem('pch_auth_token', res.token);
        setUser(res.user);
        toast.success(`Welcome, ${res.user.name}!`, 'Connected via Google Account.');
        return;
      }

      // Real Firebase Google popup authentication
      try {
        const result = await signInWithPopup(auth, googleAuthProvider);
        const fbUser = result.user;
        const res = await api.loginWithGoogle({
          email: fbUser.email || 'user@gmail.com',
          name: fbUser.displayName || 'Google User',
          avatar: fbUser.photoURL || undefined,
        });
        localStorage.setItem('pch_auth_token', res.token);
        setUser(res.user);
        toast.success(`Welcome, ${res.user.name}!`, 'Signed in with Firebase Google Auth.');
      } catch (popupErr: any) {
        // Fallback gracefully if popup is restricted by sandbox iframe or dismissed
        if (popupErr.code === 'auth/popup-blocked' || popupErr.code === 'auth/cancelled-popup-request') {
          toast.info('Google Sign-In Option', 'Please select or confirm your Google account.');
        }
        throw popupErr;
      }
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        toast.error('Google Sign In', err.message || 'Could not connect with Google.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password?: string) => {
    setLoading(true);
    const cleanEmail = email.toLowerCase().trim();
    try {
      // 1. Try Firebase Authentication if password provided
      if (password && password.length >= 6) {
        try {
          await signInWithEmailAndPassword(auth, cleanEmail, password);
        } catch (fbErr: any) {
          // If user doesn't exist on Firebase yet, continue to backend DB check (for seeded demo accounts)
          console.warn('Firebase signin notice:', fbErr.code);
        }
      }

      // 2. Authenticate against PostgreSQL database backend
      const res = await api.login(cleanEmail, password);
      localStorage.setItem('pch_auth_token', res.token);
      setUser(res.user);
      toast.success(`Welcome back, ${res.user.name}!`, res.user.role === 'admin' ? 'Admin Portal Active' : 'Storefront Ready');
    } catch (err: any) {
      toast.error('Login Failed', err.message || 'Please check your email and credentials');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; phone?: string; password?: string }) => {
    setLoading(true);
    const cleanEmail = data.email.toLowerCase().trim();
    try {
      // 1. Register with Firebase Authentication if password provided
      if (data.password && data.password.length >= 6) {
        try {
          await createUserWithEmailAndPassword(auth, cleanEmail, data.password);
        } catch (fbErr: any) {
          // If already in Firebase or email in use, continue to ensure DB record exists
          if (fbErr.code !== 'auth/email-already-in-use') {
            console.warn('Firebase registration notice:', fbErr.code);
          }
        }
      }

      // 2. Create user in PostgreSQL database
      const res = await api.register({
        name: data.name,
        email: cleanEmail,
        phone: data.phone,
        password: data.password,
      });
      localStorage.setItem('pch_auth_token', res.token);
      setUser(res.user);
      toast.success(`Welcome to PCH, ${res.user.name}!`, 'Your account has been created.');
    } catch (err: any) {
      toast.error('Registration Failed', err.message || 'Could not create account');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    firebaseSignOut(auth).catch(() => {});
    api.logout().catch(() => {});
    localStorage.removeItem('pch_auth_token');
    setUser(null);
    toast.info('Signed Out', 'You have been signed out.');
  };

  const quickSwitchUser = async (role: UserRole) => {
    if (role === 'admin') {
      await login('admin@pch.pk');
    } else {
      await login('customer@pch.pk');
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        loginWithGoogle,
        register,
        logout,
        quickSwitchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
