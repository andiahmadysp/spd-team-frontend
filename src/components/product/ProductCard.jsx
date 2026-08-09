// ─── ProductCard ─────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import * as Icons from 'lucide-react';
import { formatRupiah } from '../../data/dummy';

function PromoBadge({ badgeColor, badge }) {
  if (!badge) return null;
  const styles = {
    red:     { background: 'var(--red-600)',   color: '#fff' },
    dark:    { background: 'var(--gray-900)',   color: '#fff' },
    amber:   { background: 'var(--amber-500)', color: 'var(--gray-900)' },
    neutral: { background: 'var(--gray-200)',   color: 'var(--gray-700)' },
  };
  return (
    <span className="promo-badge" style={{ ...styles[badgeColor], fontSize: 9 }}>
      {badge}
    </span>
  );
}

function StarRating({ rating }) {
  const numericRating = typeof rating === 'number' ? rating : parseFloat(rating) || 0;
  return (
    <div className="product-rating">
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star} width="10" height="10" viewBox="0 0 24 24"
            fill={star <= Math.round(numericRating) ? 'currentColor' : 'var(--gray-200)'}
            stroke={star <= Math.round(numericRating) ? 'currentColor' : 'var(--gray-300)'}
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
      <span className="rating-count" style={{ fontWeight: 500 }}>{numericRating.toFixed(1)}</span>
    </div>
  );
}

export default function ProductCard({ product, onCardClick, onAddToCart }) {
  const [imgError, setImgError] = useState(false);

  const iconName = product.icon
    ? product.icon.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')
    : 'Package';
  const IconComponent = Icons[iconName] || Icons.Package;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isOutOfStock) onAddToCart(product);
  };

  return (
    <div
      id={`product-card-${product.id || product._id}`}
      className={`product-card${isOutOfStock ? ' is-disabled' : ''}`}
      onClick={() => onCardClick(product)}
    >
      {/* Image area */}
      <div className="product-img">
        {product.imageUrl && !imgError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <IconComponent className="product-img-icon" />
        )}

        {product.badge && (
          <span className="product-badge">
            <PromoBadge badge={product.badge} badgeColor={product.badgeColor} />
          </span>
        )}

        {!isOutOfStock && (
          <button
            className="product-wishlist"
            aria-label="Wishlist"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart style={{ width: 12, height: 12 }} />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="product-body">
        <p className="product-vendor">{product.vendor}</p>
        <p className="product-name">{product.name}</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginTop: 'var(--space-2)' }}>
          <div>
            <span className="product-price">{formatRupiah(product.price)}</span>
            {product.originalPrice && (
              <span className="product-price-original">{formatRupiah(product.originalPrice)}</span>
            )}
          </div>
          {!isOutOfStock && (
            <button
              id={`add-to-cart-${product.id || product._id}`}
              className="btn btn-primary btn-sm"
              style={{ padding: '4px 8px', height: 26, minWidth: 'auto', borderRadius: 'var(--radius-md)' }}
              onClick={handleAddToCart}
              title="Tambah ke keranjang"
            >
              <ShoppingCart style={{ width: 11, height: 11 }} />
            </button>
          )}
        </div>

        <StarRating rating={product.rating} />
      </div>
    </div>
  );
}
