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

function MainAppContent() {
  const [currentPath, setCurrentPath] = useState('/');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [adminTab, setAdminTab] = useState('dashboard');
  const { user, isAdmin } = useAuth();

  // Scroll to top on navigation or handle hash scrolls
  const navigate = (path: string) => {
    if (path.includes('#')) {
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

  // Route Dispatcher
  const renderCurrentView = () => {
    // 1. Admin Dedicated Login Route
    if (currentPath === '/admin/login') {
      return <AdminLoginPage onNavigate={navigate} />;
    }

    // 2. Admin Protected Routes
    if (currentPath.startsWith('/admin')) {
      if (!isAdmin) {
        return <AdminLoginPage onNavigate={navigate} />;
      }

      return (
        <AdminLayout
          currentTab={adminTab}
          onTabChange={(tab) => setAdminTab(tab)}
          onNavigate={navigate}
        >
          {adminTab === 'dashboard' && <AdminDashboard onNavigateTab={(t) => setAdminTab(t)} />}
          {adminTab === 'products' && <AdminProducts />}
          {adminTab === 'categories' && <AdminCategories />}
          {adminTab === 'orders' && <AdminOrders />}
          {adminTab === 'users' && <AdminUsers />}
          {adminTab === 'reviews' && <AdminReviews />}
          {adminTab === 'faqs' && <AdminFAQs />}
        </AdminLayout>
      );
    }

    // 2. Customer Routes
    let pageComponent = null;

    if (currentPath === '/' || currentPath === '') {
      pageComponent = <HomePage onNavigate={navigate} />;
    } else if (currentPath.startsWith('/shop')) {
      pageComponent = <ShopPage onNavigate={navigate} currentPath={currentPath} />;
    } else if (currentPath.startsWith('/products/')) {
      const slug = currentPath.replace('/products/', '');
      pageComponent = <ProductDetailPage slug={slug} onNavigate={navigate} />;
    } else if (currentPath.startsWith('/checkout')) {
      pageComponent = <CheckoutPage onNavigate={navigate} />;
    } else if (currentPath.startsWith('/orders')) {
      pageComponent = <OrdersPage onNavigate={navigate} />;
    } else if (currentPath.startsWith('/account')) {
      pageComponent = <AccountPage onNavigate={navigate} />;
    } else if (currentPath.startsWith('/login')) {
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
