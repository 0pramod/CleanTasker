export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-xl border border-line bg-white shadow-soft ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, right, subtitle }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
      <div>
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        {subtitle ? <div className="mt-1 text-xs text-slate-500">{subtitle}</div> : null}
      </div>
      {right}
    </div>
  );
}
