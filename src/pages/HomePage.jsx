// ─── HomePage ────────────────────────────────────────────────────────────────
import { ArrowRight, Truck, Shield, Zap } from 'lucide-react';
import { PRODUCTS as DUMMY_PRODUCTS, CATEGORIES } from '../data/dummy';
import ProductCard from '../components/product/ProductCard';

const STATS = [
  { value: '10.000+', label: 'Produk Tersedia' },
  { value: '50.000+', label: 'Pelanggan Aktif' },
  { value: '4.9',     label: 'Rating Rata-rata' },
  { value: '2 Hari',  label: 'Estimasi Pengiriman' },
];

const BENEFITS = [
  { icon: Truck,   title: 'Gratis Ongkir',       desc: 'Pengiriman gratis untuk setiap pembelian di atas Rp 150.000' },
  { icon: Shield,  title: 'Belanja Aman',         desc: 'Transaksi dilindungi enkripsi & garansi uang kembali 30 hari' },
  { icon: Zap,     title: 'Pengiriman Cepat',     desc: 'Barang tiba dalam 1–3 hari kerja ke seluruh Indonesia' },
];

export default function HomePage({ products = DUMMY_PRODUCTS, onNavigate, onAddToCart }) {
  const activeProducts = products.length > 0 ? products : DUMMY_PRODUCTS;
  const featuredProducts = activeProducts.filter((p) => p.stock > 0).slice(0, 8);

  return (
    <div className="stack-12">

      {/* ─ Hero ─ */}
      <section className="hero">
        <div>
          <h1 className="hero-title">
            Temukan Semua yang<br />
            <span className="hero-title-muted">Kamu Butuhkan.</span>
          </h1>
          <p className="hero-desc">
            Ribuan produk pilihan dari brand terpercaya.
            Harga terbaik, pengiriman cepat, pengalaman belanja yang menyenangkan.
          </p>
          <div className="hero-actions">
            <button
              id="hero-shop-btn"
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('products')}
            >
              Mulai Belanja
              <ArrowRight className="icon-sm" />
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => onNavigate('auth')}
            >
              Daftar Gratis
            </button>
          </div>

          {/* Stats strip */}
          <div className="hero-stats">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="hero-stat-value">{s.value}</p>
                <p className="hero-stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─ Featured Products ─ */}
      <section>
        <div className="row-between section-head">
          <div>
            <p className="section-eyebrow">Pilihan Editor</p>
            <h2 className="section-title">Produk Unggulan</h2>
          </div>
          <button
            id="home-view-all-btn"
            className="btn btn-ghost btn-md"
            onClick={() => onNavigate('products')}
          >
            Lihat Semua
            <ArrowRight className="icon-sm" />
          </button>
        </div>
        <div className="grid-4">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id || product._id}
              product={product}
              onCardClick={(p) => onNavigate('product-detail', { productId: p.id || p._id })}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </section>

      {/* ─ Kategori ─ */}
      <section>
        <div className="section-head">
          <p className="section-eyebrow">Jelajahi</p>
          <h2 className="section-title">Kategori Populer</h2>
        </div>
        <div className="grid-3">
          {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
            <button
              key={cat.id}
              id={`category-${cat.id}`}
              className="category-card"
              onClick={() => onNavigate('products', { category: cat.id })}
            >
              <p className="category-card-name">{cat.label}</p>
              <p className="category-card-count">
                {activeProducts.filter((p) => p.category === cat.id).length} produk
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* ─ Benefits ─ */}
      <section>
        <div className="section-head">
          <p className="section-eyebrow">Keunggulan</p>
          <h2 className="section-title">Kenapa Marketo?</h2>
        </div>
        <div className="grid-3">
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className="info-card">
              <div className="info-card-avatar">
                <benefit.icon style={{ width: 16, height: 16 }} />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 4 }}>
                  {benefit.title}
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
                  {benefit.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
