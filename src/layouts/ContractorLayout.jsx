import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../ui/Navbar.jsx";

export default function ContractorLayout() {
  return (
    <div className="min-h-screen bg-pagebg">
      <Navbar />

      <div className="mx-auto max-w-[1200px] px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Contractor Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Your company view: compliance health, expiry alerts, sites, inspections
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2 rounded-lg border border-line bg-white p-2 shadow-sm">
          <Tab to="/contractor/dashboard">Dashboard</Tab>
          <Tab to="/contractor/performance">My Performance</Tab>
          <Tab to="/contractor/workforce">Workforce</Tab>
          <Tab to="/contractor/verification">Verification</Tab>
          <Tab to="/contractor/compliance">Compliance</Tab>
        </div>

        <Outlet />
      </div>
    </div>
  );
}

function Tab({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "rounded-md px-3 py-2 text-sm font-medium",
          isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}