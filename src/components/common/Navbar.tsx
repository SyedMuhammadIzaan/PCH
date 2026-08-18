import React, { useState } from 'react';
import { ShoppingBag, Search, User as UserIcon, Menu, X, Shield, ChevronDown, Sparkles, LogOut, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext.js';
import { useAuth } from '../../context/AuthContext.js';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onOpenSearch }) => {
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const { user, isAdmin, logout, quickSwitchUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/#categories' },
    { name: 'New Arrivals', path: '/shop?sort=newest&filter=new-arrivals' },
    { name: 'Best Sellers', path: '/shop?sort=top-selling' },
    { name: 'About Us', path: '/#why-choose-us' },
    { name: 'FAQs', path: '/#faqs' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-pch transition-all shadow-2xs">
      {/* Top Announcement Bar */}
      <div className="bg-pch-dark text-white text-[11px] py-2 px-4 text-center font-bold tracking-widest uppercase flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Nationwide Express Delivery across Pakistan | <strong>FREE Delivery</strong> on orders over Rs. 3,500 | COD Available</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-sm text-slate-700 hover:text-pch-dark hover:bg-pch-soft transition"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Editorial Logo */}
          <div className="flex items-center cursor-pointer select-none" onClick={() => onNavigate('/')}>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-serif font-black tracking-tighter text-pch-dark">
                PCH<span className="text-emerald-500 font-sans">.</span>
              </span>
              <div className="hidden sm:flex flex-col border-l border-pch pl-2.5">
                <span className="font-serif text-sm font-bold tracking-tight text-pch-dark uppercase leading-none">
                  Pakistan Cloth House
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-emerald-800 font-bold mt-0.5">
                  Est. 1988 — Fabrics & Pret
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links (Editorial Style) */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.name}
                  id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => onNavigate(link.path)}
                  className={`text-[12px] font-bold uppercase tracking-widest transition-colors relative py-2 ${
                    isActive
                      ? 'text-pch-dark border-b-2 border-emerald-400 font-black'
                      : 'text-slate-500 hover:text-pch-dark'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons (Search, User, Cart) */}
          <div className="flex items-center gap-3">
            {/* Search Pill Button */}
            <button
              id="header-search-btn"
              onClick={onOpenSearch}
              className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-3.5 py-1.5 rounded-full border border-pch text-xs text-slate-400 transition"
              aria-label="Search collection"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline text-[11px] font-medium">Search collection...</span>
            </button>

            {/* User Account Button / Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  id="header-user-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 py-1 px-2 rounded-full text-pch-dark hover:bg-pch-soft transition text-xs font-semibold border border-transparent hover:border-pch"
                  aria-label="User Account"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold text-slate-800 max-w-[90px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-zinc-200 py-2 z-50 animate-in fade-in duration-150"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-zinc-100">
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-bold text-zinc-900 truncate">{user.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1 text-xs">
                      <button
                        id="menu-orders-btn"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigate('/orders');
                        }}
                        className="w-full text-left px-4 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-emerald-800 flex items-center gap-2.5 transition font-medium"
                      >
                        <Package className="w-4 h-4 text-emerald-800" />
                        <span>My Orders & Tracking</span>
                      </button>

                      <button
                        id="menu-account-btn"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigate('/account');
                        }}
                        className="w-full text-left px-4 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-emerald-800 flex items-center gap-2.5 transition font-medium"
                      >
                        <UserIcon className="w-4 h-4 text-emerald-800" />
                        <span>Account Profile</span>
                      </button>
                    </div>

                    <div className="border-t border-zinc-100 pt-1">
                      <button
                        id="menu-logout-btn"
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="header-signin-btn"
                onClick={() => onNavigate('/login')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition border border-emerald-200 shadow-2xs"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Shopping Bag Button */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 rounded-full hover:bg-pch-soft transition group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-6 h-6 text-pch-dark" />
              {itemCount > 0 && (
                <span
                  id="cart-badge-count"
                  className="absolute -top-1 -right-1 bg-emerald-300 text-pch-dark text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white"
                >
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-pch bg-white px-4 pt-2 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate(link.path);
              }}
              className="w-full text-left px-3 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest text-slate-700 hover:text-pch-dark hover:bg-pch-soft transition"
            >
              {link.name}
            </button>
          ))}
          <div className="pt-3 border-t border-pch flex flex-col gap-1.5">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('/orders');
              }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-sm flex items-center gap-2"
            >
              <Package className="w-4 h-4 text-emerald-800" />
              <span>Track Orders</span>
            </button>
            {user ? (
              <>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('/account');
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-sm flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4 text-emerald-800" />
                  <span>My Profile ({user.name})</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-sm flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('/login');
                }}
                className="w-full text-left px-3 py-2.5 text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg flex items-center gap-2 border border-emerald-200"
              >
                <UserIcon className="w-4 h-4 text-emerald-800" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
