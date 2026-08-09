// ─── Footer ──────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="page-footer">
      <div className="footer-inner">
        <div>
          <p className="footer-brand">Marketo</p>
          <p className="footer-meta">
            &copy; {new Date().getFullYear()} Marketo Inc. All rights reserved. &middot; Specialized Platform Development &middot; Binus University
          </p>
        </div>
      </div>
    </footer>
  );
}
