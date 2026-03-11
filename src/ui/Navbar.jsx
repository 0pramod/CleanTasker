import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="h-[72px] bg-nav">
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 ring-1 ring-white/10">
              <Logo className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-semibold tracking-wide text-white">
              CleanTasker
            </div>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <TopLink to="/contractor/dashboard" label="Dashboard" />
            <TopLink to="/manager/contractors" label="Sites" fake />
            <TopLink to="/manager/contractors" label="Tasks" fake dropdown />
            <TopLink to="/manager/contractors" label="Inspections" fake />
            <TopLink to="/manager/contractors" label="Staff Planner" fake dropdown />
            <TopLink to="/manager/contractors" label="Contractors" activeUnderline />
            <TopLink to="/manager/contractors" label="Reports" fake dropdown />
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button className="rounded-lg p-2 text-white/90 hover:bg-white/10 hover:text-white">
            <BagIcon className="h-5 w-5" />
          </button>
          <button className="rounded-lg p-2 text-white/90 hover:bg-white/10 hover:text-white">
            <GearIcon className="h-5 w-5" />
          </button>
          <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-sm font-semibold text-nav">
            PY
          </div>
        </div>
      </div>
    </header>
  );
}

function TopLink({ to, label, fake, activeUnderline, dropdown }) {
  const base =
    "relative inline-flex items-center gap-2 px-1 py-2 text-sm font-semibold text-white/90 hover:text-white";
  const chevron = dropdown ? <span className="text-white/80">▾</span> : null;

  if (fake) {
    return (
      <span className={base}>
        {label} {chevron}
      </span>
    );
  }

  return (
    <NavLink to={to} className={base}>
      {label} {chevron}
      {activeUnderline && (
        <span className="absolute left-1/2 top-[52px] h-[2px] w-14 -translate-x-1/2 rounded bg-white/90" />
      )}
    </NavLink>
  );
}

function Logo({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M6 12c0-3.3 2.7-6 6-6h6v6c0 3.3-2.7 6-6 6H6v-6z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M10 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BagIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M7 9V7a5 5 0 0 1 10 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 9h12l-1 12H7L6 9z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function GearIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" stroke="currentColor" strokeWidth="2" />
      <path
        d="M19.4 15a8 8 0 0 0 .1-1l2-1.2-2-3.4-2.3.6a8 8 0 0 0-1.7-1l-.3-2.3H9.8l-.3 2.3a8 8 0 0 0-1.7 1l-2.3-.6-2 3.4 2 1.2a8 8 0 0 0 0 2l-2 1.2 2 3.4 2.3-.6a8 8 0 0 0 1.7 1l.3 2.3h4.4l.3-2.3a8 8 0 0 0 1.7-1l2.3.6 2-3.4-2-1.2z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
}