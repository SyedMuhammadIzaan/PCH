import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types/index.js';
import { api } from '../services/api.js';
import { useToast } from './ToastContext.js';

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
    // Check existing stored auth token; default to unauthenticated
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
  }, []);

  const loginWithGoogle = async (customEmail?: string, customName?: string) => {
    setLoading(true);
    try {
      const email = customEmail || 'google.user@gmail.com';
      const name = customName || 'Google User';
      const res = await api.loginWithGoogle({
        email,
        name,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      });
      localStorage.setItem('pch_auth_token', res.token);
      setUser(res.user);
      toast.success(`Welcome, ${res.user.name}!`, 'Connected via Google Account.');
    } catch (err: any) {
      toast.error('Google Sign In Failed', err.message || 'Could not connect with Google.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password?: string) => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
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
    try {
      const res = await api.register(data);
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
