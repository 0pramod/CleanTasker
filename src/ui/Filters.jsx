export function FiltersBar({ left, right }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">{left}</div>
      <div className="flex flex-wrap items-center gap-3">{right}</div>
    </div>
  );
}

export function Input({ placeholder }) {
  return (
    <input
      placeholder={placeholder}
      className="h-10 w-[320px] max-w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
    />
  );
}

export function Select({ label }) {
  return (
    <button className="inline-flex h-10 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
      {label}
      <span className="text-slate-400">▾</span>
    </button>
  );
}

export function SmallButton({ children }) {
  return (
    <button className="inline-flex h-10 items-center rounded-md border border-line bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
      {children}
    </button>
  );
}

export function PrimaryButton({ children }) {
  return (
    <button className="inline-flex h-10 items-center rounded-md bg-nav px-4 text-sm font-semibold text-white hover:opacity-95">
      {children}
    </button>
  );
}
