import React from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Star,
  HelpCircle,
  ArrowLeft,
  Shield,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

interface AdminLayoutProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onNavigate,
  children,
}) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Product Catalog', icon: Package },
    { id: 'categories', label: 'Category Management', icon: FolderTree },
    { id: 'orders', label: 'Orders & Fulfillment', icon: ShoppingBag },
    { id: 'users', label: 'Registered Customers', icon: Users },
    { id: 'reviews', label: 'Customer Reviews', icon: Star },
    { id: 'faqs', label: 'FAQ Center', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-pch-dark text-white flex flex-col justify-between shrink-0">
        <div>
          {/* Logo / Admin Badge */}
          <div className="p-6 border-b border-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-2xl text-white">
                PCH<span className="text-emerald-400 font-sans">.</span>
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                  Control Center
                </span>
                <span className="text-[9px] text-slate-300">Administration</span>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1 text-xs">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-tab-${item.id}`}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-bold uppercase tracking-wider transition ${
                    isActive
                      ? 'bg-emerald-400 text-pch-dark shadow-xs'
                      : 'text-slate-300 hover:bg-emerald-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Tools */}
        <div className="p-4 border-t border-emerald-900 space-y-2 text-xs">
          <button
            onClick={() => onNavigate('/')}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-sm bg-emerald-900 hover:bg-emerald-800 text-slate-200 font-semibold transition"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </button>

          <div className="px-4 py-2 flex items-center justify-between text-[11px] text-slate-300">
            <div>
              <p className="font-bold text-white truncate max-w-[120px]">{user?.name || 'Administrator'}</p>
              <p className="text-[9px] text-emerald-400">admin@pakistanclothhouse.pk</p>
            </div>
            <button
              onClick={() => {
                logout();
                onNavigate('/admin/login');
              }}
              className="text-rose-400 hover:text-rose-300"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto max-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-pch px-6 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Administration</span>
            <h1 className="font-serif italic text-2xl font-bold text-pch-dark capitalize">
              {currentTab.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Store Database Active
            </span>
          </div>
        </header>

        {/* Tab Viewport */}
        <div className="p-6 sm:p-8">{children}</div>
      </main>
    </div>
  );
};
