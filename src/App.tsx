import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext.js';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { CartProvider } from './context/CartContext.js';
import { Navbar } from './components/common/Navbar.js';
import { Footer } from './components/common/Footer.js';
import { SearchModal } from './components/common/SearchModal.js';
import { CartDrawer } from './components/common/CartDrawer.js';

// Pages
import { HomePage } from './pages/home/HomePage.js';
import { ShopPage } from './pages/shop/ShopPage.js';
import { ProductDetailPage } from './pages/product/ProductDetailPage.js';
import { CheckoutPage } from './pages/checkout/CheckoutPage.js';
import { OrdersPage } from './pages/orders/OrdersPage.js';
import { AccountPage } from './pages/account/AccountPage.js';
import { LoginPage } from './pages/auth/LoginPage.js';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout.js';
import { AdminDashboard } from './pages/admin/AdminDashboard.js';
import { AdminProducts } from './pages/admin/AdminProducts.js';
import { AdminCategories } from './pages/admin/AdminCategories.js';
import { AdminOrders } from './pages/admin/AdminOrders.js';
import { AdminReviews } from './pages/admin/AdminReviews.js';
import { AdminFAQs } from './pages/admin/AdminFAQs.js';
import { AdminUsers } from './pages/admin/AdminUsers.js';
import { AdminLoginPage } from './pages/admin/AdminLoginPage.js';

function parseCurrentRoute(): string {
  if (typeof window === 'undefined') return '/';

  // 1. Check query parameters (e.g. ?route=/admin/login or ?path=/admin/login or ?admin=true)
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const queryRoute = searchParams.get('route') || searchParams.get('path') || searchParams.get('r');
    if (queryRoute) {
      return queryRoute.startsWith('/') ? queryRoute : `/${queryRoute}`;
    }
    if (searchParams.has('admin')) {
      const adminVal = searchParams.get('admin');
      if (adminVal && adminVal !== 'true' && adminVal !== '1') {
        return `/admin/${adminVal}`;
      }
      return '/admin/login';
    }
  } catch {}

  // 2. Check hash route (e.g. #/admin/login or #admin/login or #/shop)
  const hash = window.location.hash;
  if (hash) {
    const cleanHash = hash.replace(/^#\/?/, '/');
    if (cleanHash.startsWith('/admin') || cleanHash.startsWith('/shop') || cleanHash.startsWith('/orders') || cleanHash.startsWith('/account') || cleanHash.startsWith('/login') || cleanHash.startsWith('/checkout') || cleanHash.startsWith('/products/')) {
      return cleanHash;
    }
  }

  // 3. Check browser pathname
  const pathname = window.location.pathname;
  if (pathname && pathname !== '/') {
    return pathname;
  }

  return '/';
}

function MainAppContent() {
  const [currentPath, setCurrentPath] = useState(parseCurrentRoute);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  // Listen to browser navigation (back/forward, URL changes, popstate, hashchange)
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(parseCurrentRoute());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Scroll to top on navigation or handle hash scrolls
  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
    }

    if (path.includes('#') && !path.startsWith('#/')) {
      const [basePath, hash] = path.split('#');
      if (basePath && basePath !== currentPath) {
        setCurrentPath(basePath);
      }
      setTimeout(() => {
        const elem = document.getElementById(hash);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Normalize path string
  const normalizedPath = (() => {
    const base = currentPath.split('?')[0].split('#')[0].trim();
    if (!base || base === '/') return '/';
    return base.replace(/\/+$/, ''); // Strip trailing slash e.g. /admin/login/ -> /admin/login
  })();

  // Derive Admin Tab from Path if in /admin
  const getAdminTabFromPath = (path: string): string => {
    if (path === '/admin' || path === '/admin/login' || path === '/admin/dashboard') {
      return 'dashboard';
    }
    const match = path.match(/^\/admin\/([a-z0-9_-]+)/);
    if (match && match[1]) {
      return match[1];
    }
    return 'dashboard';
  };

  const adminTab = getAdminTabFromPath(normalizedPath);

  const handleAdminTabChange = (tab: string) => {
    navigate(tab === 'dashboard' ? '/admin/dashboard' : `/admin/${tab}`);
  };

  // Route Dispatcher
  const renderCurrentView = () => {
    // 1. Explicit Admin Login Route or Unauthenticated /admin Access
    if (normalizedPath === '/admin/login') {
      if (isAdmin) {
        // Already logged in as admin, show dashboard
        return (
          <AdminLayout
            currentTab={adminTab}
            onTabChange={handleAdminTabChange}
            onNavigate={navigate}
          >
            {adminTab === 'dashboard' && <AdminDashboard onNavigateTab={handleAdminTabChange} />}
            {adminTab === 'products' && <AdminProducts />}
            {adminTab === 'categories' && <AdminCategories />}
            {adminTab === 'orders' && <AdminOrders />}
            {adminTab === 'users' && <AdminUsers />}
            {adminTab === 'reviews' && <AdminReviews />}
            {adminTab === 'faqs' && <AdminFAQs />}
          </AdminLayout>
        );
      }
      return <AdminLoginPage onNavigate={navigate} />;
    }

    // 2. Any other /admin Route
    if (normalizedPath === '/admin' || normalizedPath.startsWith('/admin/')) {
      if (!isAdmin) {
        return <AdminLoginPage onNavigate={navigate} />;
      }

      return (
        <AdminLayout
          currentTab={adminTab}
          onTabChange={handleAdminTabChange}
          onNavigate={navigate}
        >
          {adminTab === 'dashboard' && <AdminDashboard onNavigateTab={handleAdminTabChange} />}
          {adminTab === 'products' && <AdminProducts />}
          {adminTab === 'categories' && <AdminCategories />}
          {adminTab === 'orders' && <AdminOrders />}
          {adminTab === 'users' && <AdminUsers />}
          {adminTab === 'reviews' && <AdminReviews />}
          {adminTab === 'faqs' && <AdminFAQs />}
        </AdminLayout>
      );
    }

    // 3. Customer Routes
    let pageComponent = null;

    if (normalizedPath === '/' || normalizedPath === '') {
      pageComponent = <HomePage onNavigate={navigate} />;
    } else if (normalizedPath.startsWith('/shop')) {
      pageComponent = <ShopPage onNavigate={navigate} currentPath={currentPath} />;
    } else if (normalizedPath.startsWith('/products/')) {
      const slug = normalizedPath.replace('/products/', '');
      pageComponent = <ProductDetailPage slug={slug} onNavigate={navigate} />;
    } else if (normalizedPath.startsWith('/checkout')) {
      pageComponent = <CheckoutPage onNavigate={navigate} />;
    } else if (normalizedPath.startsWith('/orders')) {
      pageComponent = <OrdersPage onNavigate={navigate} />;
    } else if (normalizedPath.startsWith('/account')) {
      pageComponent = <AccountPage onNavigate={navigate} />;
    } else if (normalizedPath.startsWith('/login')) {
      pageComponent = <LoginPage onNavigate={navigate} />;
    } else {
      pageComponent = <HomePage onNavigate={navigate} />;
    }

    return (
      <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-emerald-300 selection:text-pch-dark">
        <Navbar
          currentPath={currentPath}
          onNavigate={navigate}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
        <main className="flex-1">{pageComponent}</main>
        <Footer onNavigate={navigate} />
      </div>
    );
  };

  return (
    <>
      {renderCurrentView()}

      {/* Global Customer Search & Cart */}
      {!currentPath.startsWith('/admin') && (
        <>
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onNavigate={navigate}
          />
          <CartDrawer onNavigate={navigate} />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <MainAppContent />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
