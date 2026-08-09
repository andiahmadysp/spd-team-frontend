// ─── CartPage ─────────────────────────────────────────────────────────────────
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { formatRupiah } from '../data/dummy';

function CartItem({ item, onUpdateQty, onRemove }) {
  const { product, qty } = item;

  const iconName = product.icon
    ? product.icon.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')
    : 'Package';
  const IconComponent = Icons[iconName] || Icons.Package;

  return (
    <div id={`cart-item-${product.id}`} className="cart-item">
      {/* Thumbnail */}
      <div className="cart-item-img">
        <IconComponent style={{ width: 22, height: 22 }} />
      </div>

      {/* Info */}
      <div className="cart-item-body">
        <p className="cart-item-vendor">{product.vendor}</p>
        <p className="cart-item-name">{product.name}</p>
        <p className="cart-item-price">{formatRupiah(product.price)}</p>
      </div>

      {/* Actions */}
      <div className="cart-item-actions">
        <div className="qty-selector">
          <button
            className="qty-btn"
            id={`cart-qty-minus-${product.id}`}
            onClick={() => onUpdateQty(product.id, qty - 1)}
          >
            <Minus style={{ width: 12, height: 12 }} />
          </button>
          <span className="qty-value">{qty}</span>
          <button
            className="qty-btn"
            id={`cart-qty-plus-${product.id}`}
            onClick={() => onUpdateQty(product.id, qty + 1)}
          >
            <Plus style={{ width: 12, height: 12 }} />
          </button>
        </div>

        <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', minWidth: 88, textAlign: 'right' }}>
          {formatRupiah(product.price * qty)}
        </span>

        <button
          id={`cart-remove-${product.id}`}
          className="action-btn danger"
          aria-label="Hapus"
          onClick={() => onRemove(product.id)}
        >
          <Trash2 style={{ width: 14, height: 14 }} />
        </button>
      </div>
    </div>
  );
}

export default function CartPage({ cart, cartTotal, onUpdateQty, onRemove, onNavigate }) {
  const SHIPPING = cartTotal > 150000 ? 0 : 15000;
  const total    = cartTotal + SHIPPING;

  if (cart.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <ShoppingBag style={{ width: 48, height: 48 }} />
        </div>
        <p className="empty-state-title">Keranjang kosong</p>
        <p className="empty-state-desc">
          Tambahkan produk favoritmu ke keranjang untuk melanjutkan belanja.
        </p>
        <button
          id="cart-shop-btn"
          className="btn btn-primary btn-md"
          style={{ marginTop: 'var(--space-6)' }}
          onClick={() => onNavigate('products')}
        >
          Mulai Belanja
          <ArrowRight style={{ width: 14, height: 14 }} />
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-grid">

      {/* ─ Cart Items ─ */}
      <div className="stack-4">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 className="page-header-title">Keranjang</h1>
          <p className="page-header-desc">{cart.length} item dalam keranjang</p>
        </div>

        <div className="stack-3">
          {cart.map((item) => (
            <CartItem
              key={item.product.id}
              item={item}
              onUpdateQty={onUpdateQty}
              onRemove={onRemove}
            />
          ))}
        </div>
      </div>

      {/* ─ Order Summary ─ */}
      <aside className="order-summary-card">
        <div className="order-summary-head">Ringkasan Pesanan</div>
        <div className="order-summary-body stack-4">

          {/* Items list */}
          <div className="stack-2">
            {cart.map((item) => (
              <div key={item.product.id} className="order-summary-item">
                <div className="order-summary-item-img">
                  {(() => {
                    const n = item.product.icon
                      ? item.product.icon.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')
                      : 'Package';
                    const IC = Icons[n] || Icons.Package;
                    return <IC style={{ width: 13, height: 13 }} />;
                  })()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 'var(--text-xs)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.product.name}
                  </p>
                  <p style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>×{item.qty}</p>
                </div>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, flexShrink: 0 }}>
                  {formatRupiah(item.product.price * item.qty)}
                </span>
              </div>
            ))}
          </div>

          <div className="divider" />

          {/* Totals */}
          <div className="stack-2">
            <div className="order-line">
              <span className="order-line-label">Subtotal</span>
              <span className="order-line-value">{formatRupiah(cartTotal)}</span>
            </div>
            <div className="order-line">
              <span className="order-line-label">Ongkos Kirim</span>
              <span className="order-line-value" style={{ color: SHIPPING === 0 ? 'var(--green-600)' : 'inherit' }}>
                {SHIPPING === 0 ? 'Gratis' : formatRupiah(SHIPPING)}
              </span>
            </div>
          </div>

          <div className="divider" />

          <div className="order-line order-total">
            <span style={{ fontWeight: 600 }}>Total</span>
            <span style={{ fontWeight: 700, fontSize: 'var(--text-md)' }}>
              {formatRupiah(total)}
            </span>
          </div>

          {SHIPPING === 0 && (
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--green-700)', background: 'var(--green-50)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--green-100)' }}>
              🎉 Kamu dapat gratis ongkir!
            </p>
          )}

          <button
            id="cart-checkout-btn"
            className="btn btn-primary btn-lg btn-full"
            onClick={() => onNavigate('checkout')}
          >
            Lanjut ke Checkout
            <ArrowRight style={{ width: 15, height: 15 }} />
          </button>

          <button
            className="btn btn-ghost btn-md btn-full"
            onClick={() => onNavigate('products')}
          >
            Lanjut Belanja
          </button>
        </div>
      </aside>
    </div>
  );
}
