import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Package,
  Shield,
  LogOut,
  CheckCircle2,
  Save,
  Clock,
  Truck,
  Heart,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useCart } from '../../context/CartContext.js';
import { useToast } from '../../context/ToastContext.js';
import { api } from '../../services/api.js';
import { Order } from '../../types/index.js';
import { GoogleSignInModal } from '../../components/common/GoogleSignInModal.js';

interface AccountPageProps {
  onNavigate: (path: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate }) => {
  const { user, logout, isAdmin, login, loginWithGoogle, register } = useAuth();
  const { addToCart } = useCart();
  const toast = useToast();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'wishlist'>('profile');

  // Auth Form State (when not logged in)
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '+92 300 1234567');
  const [city, setCity] = useState('Lahore');
  const [province, setProvince] = useState('Punjab');
  const [street, setStreet] = useState('House #42, Street 8, Phase 5, DHA');
  const [postalCode, setPostalCode] = useState('54000');
  const [isSaving, setIsSaving] = useState(false);

  // Orders State
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Addresses State
  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 'addr-1',
      title: 'Home (Default)',
      recipient: user?.name || 'Customer Name',
      street: 'House #42, Street 8, Phase 5, DHA',
      city: 'Lahore',
      province: 'Punjab',
      phone: '+92 300 1234567',
      isDefault: true,
    },
    {
      id: 'addr-2',
      title: 'Studio / Office',
      recipient: user?.name || 'Customer Name',
      street: 'Floor 3, Gulberg Heights, MM Alam Road',
      city: 'Lahore',
      province: 'Punjab',
      phone: '+92 321 7654321',
      isDefault: false,
    },
  ]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddrTitle, setNewAddrTitle] = useState('Home');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Lahore');
  const [newAddrProvince, setNewAddrProvince] = useState('Punjab');
  const [newAddrPhone, setNewAddrPhone] = useState('+92 300 ');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '+92 300 1234567');
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    setOrdersLoading(true);
    try {
      const orders = await api.getOrders({ userId: user?.id });
      setUserOrders(orders);
    } catch (e) {
      console.error(e);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (authMode === 'signin') {
        await login(authEmail, authPassword);
        toast.success('Welcome Back!', 'You have successfully signed in.');
      } else {
        await register({ name: authName, email: authEmail, phone: authPhone, password: authPassword });
        toast.success('Account Created', 'Welcome to Pakistan Cloth House!');
      }
    } catch (err: any) {
      toast.error('Authentication Failed', err.message || 'Please check your credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthLoading(true);
    try {
      await loginWithGoogle('customer@pakistanclothhouse.com', 'Ayesha Khan');
      toast.success('Signed in with Google', 'Welcome to Pakistan Cloth House!');
    } catch (err: any) {
      toast.error('Google Sign-in Failed', err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      localStorage.setItem('pch_user_profile', JSON.stringify({ name, phone, street, city, province, postalCode }));
      toast.success('Profile Saved', 'Your contact and delivery preferences have been updated.');
    } catch (e) {
      toast.error('Save Failed', 'Could not update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet.trim()) return;
    const newAddr = {
      id: `addr-${Date.now()}`,
      title: newAddrTitle,
      recipient: name || 'Customer',
      street: newAddrStreet,
      city: newAddrCity,
      province: newAddrProvince,
      phone: newAddrPhone,
      isDefault: false,
    };
    setSavedAddresses([...savedAddresses, newAddr]);
    setIsAddressModalOpen(false);
    setNewAddrStreet('');
    toast.success('Address Saved', 'New delivery address added to your address book.');
  };

  const handleDeleteAddress = (id: string) => {
    setSavedAddresses(savedAddresses.filter((a) => a.id !== id));
    toast.info('Address Removed');
  };

  // If user is not logged in, render the Customer Sign In & Portal Landing
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Customer Account Portal
          </span>
          <h1 className="font-serif italic text-3xl sm:text-4xl font-bold text-pch-dark">
            Sign In or Join Pakistan Cloth House
          </h1>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            Manage your orders, track shipments in real-time, save your favourite bespoke lawn ensembles, and enjoy express checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Sign In / Register Card */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-sm border border-pch shadow-sm space-y-6">
            <div className="flex border-b border-pch text-xs">
              <button
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-2.5 font-bold uppercase tracking-wider text-center transition ${
                  authMode === 'signin'
                    ? 'border-b-2 border-emerald-700 text-pch-dark font-black'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2.5 font-bold uppercase tracking-wider text-center transition ${
                  authMode === 'register'
                    ? 'border-b-2 border-emerald-700 text-pch-dark font-black'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Google 1-Click Button */}
            <button
              onClick={() => setIsGoogleModalOpen(true)}
              disabled={authLoading}
              className="w-full py-2.5 px-4 bg-white border border-pch hover:bg-slate-50 rounded-sm text-xs font-bold text-slate-700 flex items-center justify-center gap-3 transition shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[10px] uppercase font-bold text-slate-400">Or with email</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
              {authMode === 'register' && (
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="e.g. Zainab Malik"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-pch rounded-sm focus:bg-white focus:outline-emerald-700"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-pch rounded-sm focus:bg-white focus:outline-emerald-700"
                />
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Phone Number (for Courier SMS)
                  </label>
                  <input
                    type="tel"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-pch rounded-sm focus:bg-white focus:outline-emerald-700"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-pch rounded-sm focus:bg-white focus:outline-emerald-700"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-pch-dark hover:bg-black text-white font-bold text-xs uppercase tracking-widest rounded-sm transition flex items-center justify-center gap-2 shadow-xs"
              >
                {authLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>{authMode === 'signin' ? 'Sign In to Account' : 'Complete Registration'}</span>
                )}
              </button>
            </form>
          </div>

          {/* Member Benefits Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-pch-soft p-6 rounded-sm border border-emerald-200 space-y-4">
              <div className="flex items-center gap-2 text-emerald-900 font-serif font-bold text-lg">
                <Sparkles className="w-5 h-5 text-emerald-700" />
                <span>PCH Membership Perks</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Live Order Tracking:</strong> Track real-time courier dispatches (TCS/Leopard) to your doorstep.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Saved Delivery Addresses:</strong> 1-click checkout with stored shipping destinations.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>VIP Pre-Launch Access:</strong> Early access to summer lawn & festive unstitched drops.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Free Returns & Exchange:</strong> Seamless 7-day hassle-free fabric exchange guarantee.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Google Account Selector Modal */}
        <GoogleSignInModal
          isOpen={isGoogleModalOpen}
          onClose={() => setIsGoogleModalOpen(false)}
        />
      </div>
    );
  }

  // If user IS logged in, render the full customer account management hub
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header */}
      <div className="border-b border-pch pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Customer Portal</span>
          <h1 className="font-serif italic text-3xl font-bold text-pch-dark">
            Welcome, {user.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage your account profile, delivery addresses, and tracked orders.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              logout();
              onNavigate('/');
            }}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1.5 px-3 py-2 rounded-sm border border-rose-200 hover:bg-rose-50 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Nav & VIP Badge Card */}
        <div className="md:col-span-4 space-y-4">
          <div className="bg-pch-soft p-6 rounded-sm border border-emerald-200 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-400 text-pch-dark font-bold text-xl flex items-center justify-center mx-auto border-2 border-white shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-serif italic text-lg font-bold text-pch-dark">{user.name}</h3>
              <p className="text-xs text-emerald-900 font-semibold">{user.email}</p>
              <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-sm bg-white text-pch-dark border border-pch">
                {isAdmin ? 'Store Administrator' : 'VIP Lawn Member'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-sm border border-pch divide-y divide-pch text-xs overflow-hidden">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full p-3.5 text-left font-bold flex items-center justify-between transition ${
                activeTab === 'profile'
                  ? 'bg-pch-dark text-white'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserIcon className="w-4 h-4" />
                <span>Personal Profile</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full p-3.5 text-left font-bold flex items-center justify-between transition ${
                activeTab === 'orders'
                  ? 'bg-pch-dark text-white'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>Order History & Tracking</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full p-3.5 text-left font-bold flex items-center justify-between transition ${
                activeTab === 'addresses'
                  ? 'bg-pch-dark text-white'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4" />
                <span>Delivery Address Book</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>
        </div>

        {/* Right Main Content Panel */}
        <div className="md:col-span-8">
          {/* TAB 1: Profile Form */}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 sm:p-8 rounded-sm border border-pch shadow-sm space-y-6">
              <h3 className="font-serif italic text-xl font-bold text-pch-dark pb-2 border-b border-pch">
                Personal & Contact Details
              </h3>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-pch rounded-sm focus:bg-white focus:outline-emerald-700 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full px-3.5 py-2.5 bg-slate-100 border border-pch rounded-sm text-slate-500 cursor-not-allowed font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-700 mb-1">
                      Contact Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0300-1234567"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-pch rounded-sm focus:bg-white focus:outline-emerald-700 font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-700 mb-1">
                      Default Street Address
                    </label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="House, Street, Sector..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-pch rounded-sm focus:bg-white focus:outline-emerald-700 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-pch rounded-sm focus:bg-white focus:outline-emerald-700 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-700 mb-1">
                      Province
                    </label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-pch rounded-sm focus:bg-white focus:outline-emerald-700 font-medium"
                    >
                      <option value="Punjab">Punjab</option>
                      <option value="Sindh">Sindh</option>
                      <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                      <option value="Balochistan">Balochistan</option>
                      <option value="Islamabad Capital Territory">Islamabad</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-pch-dark hover:bg-black text-white font-bold text-xs uppercase tracking-widest rounded-sm transition flex items-center gap-2 shadow-xs"
                  >
                    {isSaving ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Profile Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Orders & Tracking */}
          {activeTab === 'orders' && (
            <div className="bg-white p-6 sm:p-8 rounded-sm border border-pch shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-pch">
                <h3 className="font-serif italic text-xl font-bold text-pch-dark">
                  My Orders & Live Dispatches
                </h3>
                <button
                  onClick={() => onNavigate('/orders')}
                  className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
                >
                  <span>Tracking Lookup</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {ordersLoading ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading order records...</div>
              ) : userOrders.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-700 text-sm">No orders placed yet.</p>
                  <p className="text-xs text-slate-400">Explore our new arrivals and unstitched lawn collections.</p>
                  <button
                    onClick={() => onNavigate('/shop')}
                    className="px-5 py-2 bg-pch-dark text-white font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-black transition"
                  >
                    Explore Shop
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-sm border border-pch hover:border-emerald-700 transition space-y-3 bg-slate-50/50"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pch pb-2">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                            Order Number
                          </span>
                          <p className="font-mono font-bold text-pch-dark text-xs">{ord.orderNumber}</p>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                            Placed On
                          </span>
                          <p className="text-xs text-slate-600">
                            {new Date(ord.createdAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                            Total
                          </span>
                          <p className="font-bold text-slate-900 text-xs">
                            Rs. {(ord.totalAmount ?? 0).toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <span
                            className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs ${
                              ord.orderStatus === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.orderStatus === 'shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.orderStatus}
                          </span>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="space-y-1.5">
                        {ord.items?.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-xs">
                            <span className="text-slate-700 font-medium">
                              {item.productName} × {item.quantity}
                            </span>
                            <span className="font-bold text-slate-900">
                              Rs. {(item.price ?? 0).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Addresses Book */}
          {activeTab === 'addresses' && (
            <div className="bg-white p-6 sm:p-8 rounded-sm border border-pch shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-pch">
                <h3 className="font-serif italic text-xl font-bold text-pch-dark">
                  Delivery Address Book
                </h3>
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="px-3 py-1.5 bg-pch-dark text-white font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-black transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-sm border border-pch space-y-2 relative bg-slate-50/50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-pch-dark flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                        <span>{addr.title}</span>
                      </span>
                      {addr.isDefault && (
                        <span className="text-[9px] font-bold uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-xs">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700">{addr.street}</p>
                    <p className="text-xs text-slate-500 font-medium">{addr.city}, {addr.province}</p>
                    <p className="text-[11px] text-slate-400">Phone: {addr.phone}</p>

                    <div className="pt-2 border-t border-pch flex justify-end gap-2">
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-rose-600 hover:text-rose-800 text-[11px] font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Address Modal */}
              {isAddressModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                  <div className="bg-white rounded-sm border border-pch max-w-md w-full p-6 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-pch pb-3">
                      <h4 className="font-serif italic text-lg font-bold text-pch-dark">Add New Address</h4>
                      <button onClick={() => setIsAddressModalOpen(false)}>✕</button>
                    </div>

                    <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Address Label (e.g. Home, Boutique, Office)
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddrTitle}
                          onChange={(e) => setNewAddrTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-pch rounded-sm focus:outline-emerald-700"
                        />
                      </div>

                      <div>
                        <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddrStreet}
                          onChange={(e) => setNewAddrStreet(e.target.value)}
                          placeholder="House / Flat #, Street, Area"
                          className="w-full px-3 py-2 border border-pch rounded-sm focus:outline-emerald-700"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            required
                            value={newAddrCity}
                            onChange={(e) => setNewAddrCity(e.target.value)}
                            className="w-full px-3 py-2 border border-pch rounded-sm focus:outline-emerald-700"
                          />
                        </div>
                        <div>
                          <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Province
                          </label>
                          <select
                            value={newAddrProvince}
                            onChange={(e) => setNewAddrProvince(e.target.value)}
                            className="w-full px-3 py-2 border border-pch rounded-sm focus:outline-emerald-700"
                          >
                            <option value="Punjab">Punjab</option>
                            <option value="Sindh">Sindh</option>
                            <option value="Khyber Pakhtunkhwa">KPK</option>
                            <option value="Balochistan">Balochistan</option>
                            <option value="Islamabad">Islamabad</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-4 border-t border-pch">
                        <button
                          type="button"
                          onClick={() => setIsAddressModalOpen(false)}
                          className="px-4 py-2 border border-pch rounded-sm font-bold text-slate-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-pch-dark text-white rounded-sm font-bold hover:bg-black uppercase tracking-wider"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
