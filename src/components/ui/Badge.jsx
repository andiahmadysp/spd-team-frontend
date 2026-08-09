// ─── Badge ────────────────────────────────────────────────────────────────────
// Props:
//   variant: 'success' | 'warning' | 'error' | 'info' | 'neutral'
//   dot    : boolean — show dot indicator
//   dotColor: string  — dot background color

export default function Badge({ variant = 'neutral', dot = false, dotColor, children, className = '' }) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {dot && (
        <span
          className="badge-dot-ind"
          style={{ background: dotColor }}
        />
      )}
      {children}
    </span>
  );
}
