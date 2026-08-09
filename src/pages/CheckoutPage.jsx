// ─── CheckoutPage ─────────────────────────────────────────────────────────────
import { useState } from 'react';
import { CreditCard, X, CircleCheck, ArrowLeft } from 'lucide-react';
import * as Icons from 'lucide-react';
import { formatRupiah } from '../data/dummy';

function OrderSummaryItem({ item }) {
  const [imgError, setImgError] = useState(false);
  const iconName = item.product.icon
    ? item.product.icon.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')
    : 'Package';
  const IC = Icons[iconName] || Icons.Package;

  return (
    <div className="order-summary-item">
      <div className="order-summary-item-img" style={{ overflow: 'hidden' }}>
        {item.product.imageUrl && !imgError ? (
          <img
            src={item.product.imageUrl}
            alt={item.product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <IC style={{ width: 13, height: 13 }} />
        )}
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
  );
}

// ─ Confirmation Modal ─
function ConfirmModal({ cart, cartTotal, shipping, onClose, onConfirm }) {
  const total = cartTotal + shipping;
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <div className="modal-head">
          <div>
            <p className="modal-title">Konfirmasi Pembelian</p>
            <p className="modal-sub">Pastikan detail pesanan sudah benar</p>
          </div>
          <button className="modal-close" aria-label="Tutup" onClick={onClose}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-summary stack-2">
            {cart.map((item) => (
              <div key={item.product.id || item.product._id} className="modal-line">
                <span className="modal-line-label">{item.product.name} ×{item.qty}</span>
                <span className="modal-line-value">{formatRupiah(item.product.price * item.qty)}</span>
              </div>
            ))}
            <div className="modal-line">
              <span className="modal-line-label">Ongkos Kirim</span>
              <span className="modal-line-value" style={{ color: shipping === 0 ? 'var(--green-600)' : 'inherit' }}>
                {shipping === 0 ? 'Gratis' : formatRupiah(shipping)}
              </span>
            </div>
            <div className="modal-divider" />
            <div className="modal-line modal-total">
              <span className="modal-line-label">Total</span>
              <span className="modal-line-value">{formatRupiah(total)}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button id="modal-cancel-btn" className="btn btn-secondary btn-md" style={{ flex: 1 }} onClick={onClose}>
            Batal
          </button>
          <button id="modal-confirm-btn" className="btn btn-primary btn-md" style={{ flex: 1 }} onClick={onConfirm}>
            <CreditCard style={{ width: 13, height: 13 }} />
            Bayar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}

// ─ Success Screen ─
function SuccessScreen({ orderNumber, onNavigate }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" style={{ color: 'var(--green-600)' }}>
        <CircleCheck style={{ width: 52, height: 52 }} />
      </div>
      <p className="empty-state-title">Pesanan Berhasil!</p>
      <p className="empty-state-desc">
        Nomor pesanan:{' '}
        <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}>
          {orderNumber}
        </strong>
        <br />Pesananmu sedang diproses. Estimasi tiba 2–3 hari kerja.
      </p>
      <button
        id="success-home-btn"
        className="btn btn-primary btn-md"
        style={{ marginTop: 'var(--space-6)' }}
        onClick={() => onNavigate('home')}
      >
        Kembali ke Beranda
      </button>
    </div>
  );
}

const PROVINCES = [
  'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur',
  'Bali', 'Sumatera Utara', 'Lainnya',
];

export default function CheckoutPage({ cart, cartTotal, onNavigate, onClearCart }) {
  const SHIPPING = cartTotal > 150000 ? 0 : 15000;

  const [form, setForm] = useState({
    fullName: '', phone: '', address: '', city: '', province: '', postal: '', notes: '',
  });
  const [errors,      setErrors]     = useState({});
  const [showModal,   setShowModal]  = useState(false);
  const [success,     setSuccess]    = useState(false);
  const [orderNumber] = useState(`ORD-${Date.now().toString().slice(-8)}`);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Nama lengkap wajib diisi';
    if (!form.phone.trim())    errs.phone    = 'Nomor telepon wajib diisi';
    if (!form.address.trim())  errs.address  = 'Alamat wajib diisi';
    if (!form.city.trim())     errs.city     = 'Kota wajib diisi';
    if (!form.province)        errs.province = 'Provinsi wajib dipilih';
    if (!form.postal.trim())   errs.postal   = 'Kode pos wajib diisi';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setShowModal(true);
  };

  const handleConfirm = () => {
    setShowModal(false);
    setSuccess(true);
    onClearCart();
  };

  if (cart.length === 0 && !success) { onNavigate('cart'); return null; }
  if (success) return <SuccessScreen orderNumber={orderNumber} onNavigate={onNavigate} />;

  return (
    <>
      <div className="checkout-grid">

        {/* ─ Form ─ */}
        <div className="stack-6">
          <div>
            <button
              className="btn btn-ghost btn-sm"
              style={{ marginBottom: 'var(--space-5)' }}
              onClick={() => onNavigate('cart')}
            >
              <ArrowLeft style={{ width: 12, height: 12 }} />
              Kembali ke Keranjang
            </button>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
              Checkout
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              Lengkapi informasi pengiriman untuk melanjutkan.
            </p>
          </div>

          <form id="checkout-form" className="card card-p-lg stack-6" onSubmit={handleSubmit}>
            <p className="form-section-title">Informasi Pengiriman</p>

            <div className="stack-4">
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">Nama Lengkap</label>
                <input
                  id="fullName" name="fullName" type="text"
                  className={`form-input${errors.fullName ? ' is-error' : ''}`}
                  placeholder="Budi Santoso"
                  value={form.fullName} onChange={handleChange}
                />
                {errors.fullName && <span className="form-error">{errors.fullName}</span>}
              </div>

              {/* Phone + City */}
              <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Nomor Telepon</label>
                  <input
                    id="phone" name="phone" type="tel"
                    className={`form-input${errors.phone ? ' is-error' : ''}`}
                    placeholder="08xxxxxxxxxx"
                    value={form.phone} onChange={handleChange}
                  />
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="city">Kota</label>
                  <input
                    id="city" name="city" type="text"
                    className={`form-input${errors.city ? ' is-error' : ''}`}
                    placeholder="Jakarta Selatan"
                    value={form.city} onChange={handleChange}
                  />
                  {errors.city && <span className="form-error">{errors.city}</span>}
                </div>
              </div>

              {/* Address */}
              <div className="form-group">
                <label className="form-label" htmlFor="address">Alamat Lengkap</label>
                <textarea
                  id="address" name="address"
                  className={`form-textarea${errors.address ? ' is-error' : ''}`}
                  rows={3}
                  placeholder="Jl. Nama Jalan No. xx, RT/RW, Kelurahan, Kecamatan"
                  value={form.address} onChange={handleChange}
                />
                {errors.address && <span className="form-error">{errors.address}</span>}
              </div>

              {/* Province + Postal */}
              <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="province">Provinsi</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      id="province" name="province"
                      className={`form-select${errors.province ? ' is-error' : ''}`}
                      style={{ paddingRight: 32 }}
                      value={form.province} onChange={handleChange}
                    >
                      <option value="">Pilih provinsi</option>
                      {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                    </select>
                    <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-tertiary)', display: 'flex' }}>
                      <Icons.ChevronDown style={{ width: 12, height: 12 }} />
                    </span>
                  </div>
                  {errors.province && <span className="form-error">{errors.province}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="postal">Kode Pos</label>
                  <input
                    id="postal" name="postal" type="text"
                    className={`form-input${errors.postal ? ' is-error' : ''}`}
                    placeholder="12345" maxLength={5}
                    value={form.postal} onChange={handleChange}
                  />
                  {errors.postal && <span className="form-error">{errors.postal}</span>}
                </div>
              </div>

              {/* Notes */}
              <div className="form-group">
                <label className="form-label" htmlFor="notes">Catatan untuk Kurir (opsional)</label>
                <input
                  id="notes" name="notes" type="text"
                  className="form-input"
                  placeholder="Instruksi khusus..."
                  value={form.notes} onChange={handleChange}
                />
              </div>
            </div>

            <button id="checkout-submit-btn" type="submit" className="btn btn-primary btn-lg btn-full">
              <CreditCard style={{ width: 15, height: 15 }} />
              Konfirmasi Pesanan
            </button>
          </form>
        </div>

        {/* ─ Order Summary ─ */}
        <aside className="order-summary-card">
          <div className="order-summary-head">
            <span>Ringkasan Pesanan</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontWeight: 400 }}>
              {cart.length} item
            </span>
          </div>
          <div className="order-summary-body stack-4">
            <div className="stack-2">
              {cart.map((item) => (
                <OrderSummaryItem key={item.product.id || item.product._id} item={item} />
              ))}
            </div>

            <div className="divider" />

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
                {formatRupiah(cartTotal + SHIPPING)}
              </span>
            </div>
          </div>
        </aside>
      </div>

      {/* ─ Modal ─ */}
      {showModal && (
        <ConfirmModal
          cart={cart}
          cartTotal={cartTotal}
          shipping={SHIPPING}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
