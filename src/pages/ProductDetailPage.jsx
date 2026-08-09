// ─── ProductDetailPage ────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { ShoppingCart, Minus, Plus, ChevronRight, Star, Package, CircleCheck } from 'lucide-react';
import * as Icons from 'lucide-react';
import { getProductById as getDummyProductById, PRODUCTS as DUMMY_PRODUCTS, formatRupiah } from '../data/dummy';
import { getProductById as fetchBackendProductById } from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';

function StockBadge({ stock }) {
  if (stock === 0) return <Badge variant="error"   dot dotColor="var(--red-600)">Habis</Badge>;
  if (stock <= 5)  return <Badge variant="warning" dot dotColor="var(--amber-500)">Stok Terbatas ({stock})</Badge>;
  return               <Badge variant="success" dot dotColor="var(--green-600)">Tersedia ({stock})</Badge>;
}

export default function ProductDetailPage({ productId, products = [], onNavigate, onAddToCart }) {
  const [product, setProduct] = useState(() => {
    return products.find((p) => (p.id || p._id) === productId) || getDummyProductById(productId);
  });
  const [qty, setQty]         = useState(1);
  const [added, setAdded]     = useState(false);
  const [loading, setLoading] = useState(!product);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
    const existing = products.find((p) => (p.id || p._id) === productId);
    if (existing) {
      setProduct(existing);
      setLoading(false);
    } else if (productId) {
      setLoading(true);
      fetchBackendProductById(productId).then((fetched) => {
        setProduct(fetched || getDummyProductById(productId));
        setLoading(false);
      });
    }
  }, [productId, products]);

  if (loading) {
    return (
      <div className="empty-state">
        <p className="empty-state-title">Memuat detail produk...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><Package style={{ width: 48, height: 48 }} /></div>
        <p className="empty-state-title">Produk tidak ditemukan</p>
        <button className="btn btn-primary btn-md" style={{ marginTop: 'var(--space-4)' }} onClick={() => onNavigate('products')}>
          Kembali ke Produk
        </button>
      </div>
    );
  }

  const iconName = product.icon
    ? product.icon.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')
    : 'Package';
  const IconComponent = Icons[iconName] || Icons.Package;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    onAddToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const activeProducts = products.length > 0 ? products : DUMMY_PRODUCTS;
  const related = activeProducts
    .filter((p) => p.category === product.category && (p.id || p._id) !== (product.id || product._id))
    .slice(0, 4);

  const numericRating = typeof product.rating === 'number' ? product.rating : parseFloat(product.rating) || 0;

  return (
    <div className="stack-12">

      {/* ─ Breadcrumb ─ */}
      <nav className="breadcrumb">
        <span className="breadcrumb-item" onClick={() => onNavigate('home')}>Beranda</span>
        <ChevronRight className="breadcrumb-sep" style={{ width: 12, height: 12 }} />
        <span className="breadcrumb-item" onClick={() => onNavigate('products')}>Produk</span>
        <ChevronRight className="breadcrumb-sep" style={{ width: 12, height: 12 }} />
        <span style={{ color: 'var(--color-text-primary)' }}>{product.name}</span>
      </nav>

      {/* ─ Main detail ─ */}
      <div className="detail-grid">

        {/* Image */}
        <div className="detail-img">
          {product.imageUrl && !imgError ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setImgError(true)}
            />
          ) : (
            <IconComponent className="detail-img-icon" />
          )}
          {product.badge && (
            <span style={{ position: 'absolute', top: 'var(--space-4)', left: 'var(--space-4)' }}>
              <span
                className="promo-badge"
                style={{
                  background: product.badgeColor === 'red'   ? 'var(--red-600)'
                    : product.badgeColor === 'dark'  ? '#003366'
                    : product.badgeColor === 'amber' ? 'var(--amber-500)' : 'var(--gray-200)',
                  color: product.badgeColor === 'amber' ? 'var(--gray-900)' : '#fff',
                }}
              >
                {product.badge}
              </span>
            </span>
          )}
        </div>

        {/* Info */}
        <div className="stack-6">
          <div className="stack-4">
            <div>
              <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 6 }}>
                {product.vendor || 'Market Store'}
              </p>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {product.name}
              </h1>
            </div>

            {/* Rating (Ulasan removed as requested) */}
            <div className="row row-gap-2">
              <div className="stars">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} style={{ width: 14, height: 14, fill: s <= Math.round(numericRating) ? 'currentColor' : 'var(--gray-200)', stroke: s <= Math.round(numericRating) ? 'currentColor' : 'var(--gray-300)' }} />
                ))}
              </div>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                {numericRating.toFixed(1)} / 5
              </span>
            </div>

            {/* Price */}
            <div className="row row-gap-3">
              <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>
                {formatRupiah(product.price)}
              </span>
              {product.originalPrice && (
                <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-tertiary)', textDecoration: 'line-through' }}>
                  {formatRupiah(product.originalPrice)}
                </span>
              )}
            </div>

            <StockBadge stock={product.stock} />
          </div>

          {/* Desc */}
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.75 }}>
            {product.description || 'Deskripsi produk berkualitas tinggi dari brand terpercaya.'}
          </p>

          {/* Tags */}
          {Array.isArray(product.tags) && product.tags.length > 0 && (
            <div className="row wrap row-gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}

          {/* Actions */}
          {!isOutOfStock && (
            <div className="stack-4">
              <div className="row row-gap-4">
                <div className="qty-selector">
                  <button className="qty-btn" id="qty-minus" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>
                    <Minus style={{ width: 13, height: 13 }} />
                  </button>
                  <span className="qty-value">{qty}</span>
                  <button className="qty-btn" id="qty-plus" onClick={() => setQty((q) => Math.min(product.stock, q + 1))} disabled={qty >= product.stock}>
                    <Plus style={{ width: 13, height: 13 }} />
                  </button>
                </div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                  Maks. {product.stock} item
                </span>
              </div>

              <button
                id="detail-add-to-cart"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                onClick={handleAddToCart}
              >
                <ShoppingCart style={{ width: 16, height: 16 }} />
                Tambah ke Keranjang
              </button>

              {added && (
                <Alert
                  variant="success"
                  icon={<CircleCheck style={{ width: 14, height: 14 }} />}
                  title="Ditambahkan ke keranjang"
                  desc={`${qty}× ${product.name} berhasil ditambahkan.`}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─ Related products ─ */}
      {related.length > 0 && (
        <section>
          <div className="section-head">
            <p className="section-eyebrow">Kategori Serupa</p>
            <h2 className="section-title">Produk Lainnya</h2>
          </div>
          <div className="grid-4">
            {related.map((p) => (
              <ProductCard
                key={p.id || p._id}
                product={p}
                onCardClick={(p) => onNavigate('product-detail', { productId: p.id || p._id })}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
