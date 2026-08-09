// ─── ProductListPage ──────────────────────────────────────────────────────────
import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { PRODUCTS as DUMMY_PRODUCTS, CATEGORIES } from '../data/dummy';
import ProductCard from '../components/product/ProductCard';
import Pagination from '../components/ui/Pagination';

const PAGE_SIZE = 8;

export default function ProductListPage({ products = DUMMY_PRODUCTS, initialCategory = 'all', onNavigate, onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('default');

  const activeProducts = products.length > 0 ? products : DUMMY_PRODUCTS;

  const filtered = useMemo(() => {
    let result = activeProducts;
    if (activeCategory !== 'all') result = result.filter((p) => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.vendor && p.vendor.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }
    if (sortBy === 'price-asc')  result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating')     result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [activeProducts, activeCategory, search, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleCategoryChange = (catId) => { setActiveCategory(catId); setCurrentPage(1); };
  const handleSearch = (e) => { setSearch(e.target.value); setCurrentPage(1); };

  return (
    <div className="stack-8">

      {/* ─ Page header ─ */}
      <header className="page-header">
        <p className="page-header-meta">Marketo · Katalog</p>
        <h1 className="page-header-title">Daftar Produk</h1>
        <p className="page-header-desc">
          Temukan produk dari berbagai kategori dengan harga terbaik.
        </p>
      </header>

      {/* ─ Search + Sort ─ */}
      <div className="search-row">
        <div className="input-with-icon" style={{ flex: 1 }}>
          <span className="input-icon"><Search style={{ width: 14, height: 14 }} /></span>
          <input
            id="product-search"
            type="text"
            className="form-input"
            placeholder="Cari nama produk, brand, deskripsi..."
            value={search}
            onChange={handleSearch}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <select
            id="product-sort"
            className="form-select"
            style={{ paddingRight: 32, minWidth: 160 }}
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
          >
            <option value="default">Urutkan</option>
            <option value="price-asc">Harga: Terendah</option>
            <option value="price-desc">Harga: Tertinggi</option>
            <option value="rating">Rating Terbaik</option>
          </select>
          <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-tertiary)', display: 'flex' }}>
            <SlidersHorizontal style={{ width: 12, height: 12 }} />
          </span>
        </div>
      </div>

      {/* ─ Category pills ─ */}
      <div className="category-scroll" style={{ marginBottom: 0 }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            id={`filter-cat-${cat.id}`}
            className={`tag${activeCategory === cat.id ? ' tag-active' : ''}`}
            onClick={() => handleCategoryChange(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ─ Result count ─ */}
      <div className="row-between">
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
          {filtered.length} produk ditemukan
        </span>
      </div>

      {/* ─ Product grid ─ */}
      {paginated.length > 0 ? (
        <div className="grid-4">
          {paginated.map((product) => (
            <ProductCard
              key={product.id || product._id}
              product={product}
              onCardClick={(p) => onNavigate('product-detail', { productId: p.id || p._id })}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Search style={{ width: 40, height: 40 }} />
          </div>
          <p className="empty-state-title">Produk tidak ditemukan</p>
          <p className="empty-state-desc">Coba kata kunci atau kategori yang berbeda.</p>
        </div>
      )}

      {/* ─ Pagination ─ */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        </div>
      )}
    </div>
  );
}
