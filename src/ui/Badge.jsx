const styles = {
  good: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warn: "bg-amber-50 text-amber-700 border-amber-200",
  bad: "bg-rose-50 text-rose-700 border-rose-200",
  info: "bg-sky-50 text-sky-700 border-sky-200",
  neutral: "bg-slate-50 text-slate-700 border-slate-200",
};

export default function Badge({ variant = "neutral", children }) {
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold ${styles[variant] || styles.neutral}`}>
      {children}
    </span>
  );
}
