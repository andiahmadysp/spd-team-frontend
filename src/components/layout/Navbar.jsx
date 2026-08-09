// ─── Navbar ──────────────────────────────────────────────────────────────────
import { Grid2X2, ShoppingBag, LogIn, User, LogOut } from 'lucide-react';

export default function Navbar({ cartCount = 0, currentPage, onNavigate, isLoggedIn, user, onLogout }) {
  const navItems = [
    { id: 'home',     label: 'Beranda' },
    { id: 'products', label: 'Produk' },
  ];

  return (
    <nav className="layout-nav">
      <div className="nav-inner">
        {/* Brand */}
        <a className="nav-brand" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
          <span className="nav-logo">
            <Grid2X2 className="icon-xs" />
          </span>
          <span className="nav-wordmark">Marketo</span>
        </a>

        {/* Nav Links */}
        <div className="nav-links">
          {navItems.map((item) => (
            <a
              key={item.id}
              className={`nav-link${currentPage === item.id ? ' active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="nav-actions">
          <button
            id="nav-cart-btn"
            className="nav-icon-btn"
            aria-label="Keranjang"
            onClick={() => onNavigate('cart')}
          >
            <ShoppingBag className="icon-md" />
            {cartCount > 0 && (
              <span className="cart-badge-count">{cartCount > 99 ? '99+' : cartCount}</span>
            )}
          </button>

          {isLoggedIn ? (
            <div className="row row-gap-2">
              <span className="btn btn-secondary btn-sm" style={{ cursor: 'default' }}>
                <User className="icon-xs" />
                {user?.firstName || user?.name?.split(' ')[0] || 'Akun'}
              </span>
              <button
                className="action-btn"
                title="Keluar"
                onClick={onLogout}
                style={{ height: 28, width: 28 }}
              >
                <LogOut className="icon-xs" />
              </button>
            </div>
          ) : (
            <button id="nav-login-btn" className="btn btn-primary btn-sm" onClick={() => onNavigate('auth')}>
              <LogIn className="icon-xs" />
              Masuk
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
