// ─── Alert ────────────────────────────────────────────────────────────────────
// Props:
//   variant: 'success' | 'warning' | 'error' | 'info'
//   title  : string
//   desc   : string (optional)
//   icon   : ReactNode

export default function Alert({ variant = 'info', title, desc, icon }) {
  return (
    <div className={`alert alert-${variant}`}>
      {icon && <span className="alert-icon">{icon}</span>}
      <div>
        {title && <p className="alert-title">{title}</p>}
        {desc && <p className="alert-desc">{desc}</p>}
      </div>
    </div>
  );
}
