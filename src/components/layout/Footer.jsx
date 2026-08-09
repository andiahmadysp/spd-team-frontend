// ─── Footer ──────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="page-footer">
      <div className="footer-inner">
        <div>
          <p className="footer-brand">Marketo</p>
          <p className="footer-meta">
            Specialized Platform Development &middot; Binus University &middot; 2024
          </p>
        </div>
        <div className="footer-stack">
          <span className="footer-chip">Inter</span>
          <span className="footer-sep" />
          <span className="footer-chip">Lucide React</span>
          <span className="footer-sep" />
          <span className="footer-chip">React + Vite</span>
        </div>
      </div>
    </footer>
  );
}
