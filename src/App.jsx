import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ManagerLayout from "./layouts/ManagerLayout.jsx";
import ContractorLayout from "./layouts/ContractorLayout.jsx";

import ManagerDashboard from "./pages/ManagerDashboard.jsx";
import ManagerPerformance from "./pages/ManagerPerformance.jsx";

import ContractorDashboard from "./pages/ContractorDashboard.jsx";
import ContractorPerformance from "./pages/ContractorPerformance.jsx";

import Contractors from "./pages/Contractors.jsx";
import WorkforceTracker from "./pages/WorkforceTracker.jsx";
import WorkforceVerification from "./pages/WorkforceVerification.jsx";
import ComplianceTracker from "./pages/ComplianceTracker.jsx";

import CleanerDashboard from "./pages/CleanerDashboard.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/contractor/dashboard" replace />} />
        <Route path="/cleaner/dashboard" element={<CleanerDashboard />} />

        <Route path="/manager" element={<ManagerLayout />}>
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="performance" element={<ManagerPerformance />} />
          <Route path="contractors" element={<Contractors />} />
          <Route path="workforce" element={<WorkforceTracker />} />
          <Route path="verification" element={<WorkforceVerification />} />
          <Route path="compliance" element={<ComplianceTracker />} />
        </Route>

        <Route path="/contractor" element={<ContractorLayout />}>
          <Route path="dashboard" element={<ContractorDashboard />} />
          <Route path="performance" element={<ContractorPerformance />} />
          <Route path="workforce" element={<WorkforceTracker />} />
          <Route path="verification" element={<WorkforceVerification />} />
          <Route path="compliance" element={<ComplianceTracker />} />
        </Route>

        <Route path="*" element={<Navigate to="/contractor/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}