import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../ui/Navbar.jsx";

export default function ManagerLayout() {
  return (
    <div className="min-h-screen bg-pagebg">
      <Navbar />

      <div className="mx-auto max-w-[1200px] px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Manager Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Portfolio view: risk, compliance, workforce, performance
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2 rounded-lg border border-line bg-white p-2 shadow-sm">
          <Tab to="/manager/dashboard">Dashboard</Tab>
          <Tab to="/manager/performance">Performance</Tab>
          <Tab to="/manager/contractors">Contractors</Tab>
          <Tab to="/manager/workforce">Workforce</Tab>
          <Tab to="/manager/verification">Verification</Tab>
          <Tab to="/manager/compliance">Compliance</Tab>
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