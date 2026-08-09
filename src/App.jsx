// ─── App.jsx ──────────────────────────────────────────────────────────────────
import './index.css';

import { useEffect, useState, useCallback } from 'react';
import { useCart } from './hooks/useCart';
import { getCurrentUser, logout as apiLogout, getProfile } from './services/authService';
import { getProducts } from './services/productService';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AuthPage from './pages/AuthPage';

export default function App() {
  // ─ Font ─
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // ─ Auth state ─
  const [user, setUser] = useState(() => getCurrentUser());

  useEffect(() => {
    const stored = getCurrentUser();
    if (stored?.id) {
      getProfile(stored.id)
        .then((u) => { if (u) setUser(u); })
        .catch(() => {
          apiLogout();
          setUser(null);
        });
    }
  }, []);

  // ─ Products state ─
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    const data = await getProducts();
    setProducts(data);
    setProductsLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ─ Routing state ─
  const [page, setPage] = useState('home');
  const [params, setParams] = useState({});

  const navigate = useCallback((newPage, newParams = {}) => {
    setPage(newPage);
    setParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleRequireLogin = useCallback(() => {
    setPage('auth');
    setParams({ message: 'Silakan masuk terlebih dahulu untuk menambah produk atau mengakses keranjang.' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Safe navigate checking login requirement for protected routes
  const protectedNavigate = useCallback((newPage, newParams = {}) => {
    const currentUser = getCurrentUser();
    if ((newPage === 'cart' || newPage === 'checkout') && !currentUser) {
      handleRequireLogin();
      return;
    }
    navigate(newPage, newParams);
  }, [navigate, handleRequireLogin]);

  // ─ Cart state (strictly backed by backend API) ─
  const { cart, cartCount, cartTotal, addToCart, updateQty, removeFromCart, clearCart } = useCart(
    user,
    products,
    handleRequireLogin
  );

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    navigate('home');
  };

  const handleLogout = () => {
    apiLogout();
    setUser(null);
    navigate('home');
  };

  // ─ Page resolver ─
  const renderPage = () => {
    switch (page) {
      case 'home':
        return (
          <HomePage
            products={products}
            onNavigate={protectedNavigate}
            onAddToCart={addToCart}
          />
        );

      case 'products':
        return (
          <ProductListPage
            products={products}
            initialCategory={params.category ?? 'all'}
            onNavigate={protectedNavigate}
            onAddToCart={addToCart}
          />
        );

      case 'product-detail':
        return (
          <ProductDetailPage
            productId={params.productId}
            products={products}
            onNavigate={protectedNavigate}
            onAddToCart={addToCart}
          />
        );

      case 'cart':
        if (!user) {
          return <AuthPage message="Silakan masuk terlebih dahulu untuk mengakses keranjang." onAuthSuccess={handleAuthSuccess} onNavigate={protectedNavigate} />;
        }
        return (
          <CartPage
            cart={cart}
            cartTotal={cartTotal}
            onUpdateQty={updateQty}
            onRemove={removeFromCart}
            onNavigate={protectedNavigate}
          />
        );

      case 'checkout':
        if (!user) {
          return <AuthPage message="Silakan masuk terlebih dahulu untuk melakukan checkout." onAuthSuccess={handleAuthSuccess} onNavigate={protectedNavigate} />;
        }
        return (
          <CheckoutPage
            cart={cart}
            cartTotal={cartTotal}
            onNavigate={protectedNavigate}
            onClearCart={clearCart}
          />
        );

      case 'auth':
        return <AuthPage message={params.message} onAuthSuccess={handleAuthSuccess} onNavigate={protectedNavigate} />;

      default:
        return (
          <HomePage
            products={products}
            onNavigate={protectedNavigate}
            onAddToCart={addToCart}
          />
        );
    }
  };

  return (
    <>
      <Navbar
        cartCount={cartCount}
        currentPage={page}
        onNavigate={protectedNavigate}
        isLoggedIn={!!user}
        user={user}
        onLogout={handleLogout}
      />

      <main className="page-wrapper">
        {renderPage()}
        <Footer />
      </main>
    </>
  );
}
