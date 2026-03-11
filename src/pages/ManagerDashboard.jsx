import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
} from "recharts";

import StatCard from "../ui/StatCard.jsx";
import ChartCard from "../ui/ChartCard.jsx";
import Badge from "../ui/Badge.jsx";
import { Table } from "../ui/Table.jsx";
import { Select, SmallButton, PrimaryButton } from "../ui/Filters.jsx";
import {
  contractors,
  platformComplianceTrend,
  slaTrend,
  workforceDocs,
  inspectionAudits,
  clientRequests,
  clientRequestSites,
  shiftRosters,
  timesheetAnalytics,
} from "../data/mockContractors.js";

export default function ManagerDashboard() {
  const totalContractors = contractors.length;
  const activeContractors = contractors.filter((c) => c.status === "Active").length;
  const nonCompliant = contractors.filter((c) => c.score < 70 || c.status !== "Active").length;
  const totalWorkers = contractors.reduce((sum, c) => sum + c.workers, 0);
  const sitesCoveredToday = contractors.reduce((sum, c) => sum + c.sites, 0);

  const expiring30 = workforceDocs.filter((d) => d.days <= 30).length;
  const expiring7 = workforceDocs.filter((d) => d.days <= 7).length;
  const riskLevel = nonCompliant >= 2 ? "Medium" : "Low";

  const complianceSplit = makeComplianceSplit(contractors);
  const donutColors = ["#1AA6A6", "#F59E0B", "#EF4444", "#94A3B8"];

  const workforceByContractor = contractors.map((c) => ({
    name: shortName(c.name),
    workers: c.workers,
    sites: c.sites,
  }));

  const highRisk = [...contractors]
    .sort((a, b) => b.risk - a.risk)
    .slice(0, 5)
    .map((c) => ({
      name: c.name,
      risk: c.risk,
      missing: c.missing,
      expiring: c.expiring,
      expired: c.expired,
      inspection: c.lastInspection,
      onTime: c.onTime,
    }));

  const riskColumns = [
    { key: "name", title: "Contractor", render: (r) => <span className="font-semibold text-sky-700">{r.name}</span> },
    { key: "risk", title: "Risk", render: (r) => <Badge variant={riskVariant(r.risk)}>Risk {r.risk}</Badge> },
    { key: "missing", title: "Missing" },
    { key: "expiring", title: "Expiring" },
    { key: "expired", title: "Expired" },
    { key: "inspection", title: "Last Inspection", render: (r) => <span className="font-semibold">{r.inspection}%</span> },
    { key: "onTime", title: "On-Time", render: (r) => <span className="font-semibold">{r.onTime}%</span> },
  ];

  const upcoming = workforceDocs.slice().sort((a, b) => a.days - b.days).slice(0, 6);
  const upcomingColumns = [
    { key: "contractor", title: "Contractor", render: (r) => <span className="font-semibold">{r.contractor}</span> },
    { key: "document", title: "Document" },
    { key: "expiry", title: "Expiry" },
    { key: "days", title: "Days", render: (r) => <Badge variant={r.days <= 7 ? "bad" : r.days <= 30 ? "warn" : "neutral"}>{r.days}d</Badge> },
    { key: "docStatus", title: "Status", render: (r) => <Badge variant={docVariant(r.docStatus)}>{r.docStatus}</Badge> },
  ];

  const totalAuditChecks = inspectionAudits.reduce((sum, a) => sum + a.pass + a.minor + a.major + a.failed, 0);
  const totalAuditPass = inspectionAudits.reduce((sum, a) => sum + a.pass, 0);
  const totalAuditFail = inspectionAudits.reduce((sum, a) => sum + a.failed, 0);
  const totalReinspections = inspectionAudits.reduce((sum, a) => sum + a.reinspections, 0);
  const avgAuditScore = Math.round(inspectionAudits.reduce((sum, a) => sum + a.avgScore, 0) / Math.max(1, inspectionAudits.length));
  const auditPassRate = Math.round((totalAuditPass / Math.max(1, totalAuditChecks)) * 100);
  const auditChart = inspectionAudits.map((a) => ({
    name: shortName(a.contractor),
    pass: a.pass,
    minor: a.minor,
    major: a.major,
    failed: a.failed,
  }));

  const requestTotal = clientRequests.reduce((sum, r) => sum + r.open, 0);
  const requestClosed = clientRequests.reduce((sum, r) => sum + r.closed, 0);
  const requestClosureRate = Math.round((requestClosed / Math.max(1, requestTotal)) * 100);
  const avgResponseTime = (
    clientRequests.reduce((sum, r) => sum + r.avgResponseHours, 0) / Math.max(1, clientRequests.length)
  ).toFixed(1);
  const escalations = clientRequests.reduce((sum, r) => sum + r.escalations, 0);

  const clientColumns = [
    { key: "client", title: "Client / Site", render: (r) => <span className="font-semibold">{r.client}</span> },
    { key: "requests", title: "Requests" },
    { key: "avgResponse", title: "Avg Response", render: (r) => <span className="font-semibold">{r.avgResponse}h</span> },
    { key: "sla", title: "SLA Status", render: (r) => <Badge variant={r.sla === "Good" ? "good" : r.sla === "Watch" ? "warn" : "bad"}>{r.sla}</Badge> },
  ];

  const totalRequiredShifts = shiftRosters.reduce((sum, r) => sum + r.required, 0);
  const totalScheduledShifts = shiftRosters.reduce((sum, r) => sum + r.scheduled, 0);
  const understaffedShifts = shiftRosters.reduce((sum, r) => sum + r.understaffed, 0);
  const rosterChart = shiftRosters.map((r) => ({ site: r.site, required: r.required, scheduled: r.scheduled }));

  const totalScheduledHours = timesheetAnalytics.reduce((sum, t) => sum + t.scheduledHours, 0);
  const totalActualHours = timesheetAnalytics.reduce((sum, t) => sum + t.actualHours, 0);
  const totalOvertimeHours = timesheetAnalytics.reduce((sum, t) => sum + Math.max(0, t.actualHours - t.scheduledHours), 0);
  const avgAttendance = Math.round(timesheetAnalytics.reduce((sum, t) => sum + t.attendance, 0) / Math.max(1, timesheetAnalytics.length));
  const missingTimesheets = timesheetAnalytics.reduce((sum, t) => sum + t.missingTimesheets, 0);
  const timesheetChart = timesheetAnalytics.map((t) => ({
    name: shortName(t.contractor),
    scheduledHours: t.scheduledHours,
    actualHours: t.actualHours,
  }));
  const timesheetColumns = [
    { key: "contractor", title: "Contractor", render: (r) => <span className="font-semibold text-sky-700">{r.contractor}</span> },
    { key: "scheduledHours", title: "Scheduled Hours" },
    { key: "actualHours", title: "Actual Hours" },
    { key: "attendance", title: "Attendance", render: (r) => <span className="font-semibold">{r.attendance}%</span> },
    { key: "missingTimesheets", title: "Missing Timesheets", render: (r) => <Badge variant={r.missingTimesheets === 0 ? "good" : r.missingTimesheets <= 2 ? "warn" : "bad"}>{r.missingTimesheets}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="Total Contractors" value={totalContractors} sub="All registered contractors" />
        <StatCard title="Active Contractors" value={activeContractors} sub="Currently active" />
        <StatCard title="Expiring Docs (30d)" value={expiring30} sub={`${expiring7} urgent (≤7d)`} badge={{ variant: expiring7 ? "bad" : "warn", text: expiring7 ? "Urgent" : "Watch" }} />
        <StatCard title="Non-Compliant" value={nonCompliant} sub="Score < 70 or not Active" badge={{ variant: nonCompliant ? "warn" : "good", text: riskLevel }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Compliance Overview"
          subtitle="Platform-wide document status split"
          right={<div className="flex items-center gap-2"><Select label="Last 30 days" /><SmallButton>Download</SmallButton></div>}
        >
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={complianceSplit} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100} paddingAngle={2}>
                    {complianceSplit.map((_, i) => (
                      <Cell key={i} fill={donutColors[i % donutColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {complianceSplit.map((s, i) => (
                <div key={s.name} className="flex items-center justify-between rounded-lg border border-line bg-white px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded" style={{ background: donutColors[i] }} />
                    <span className="text-sm font-semibold text-slate-700">{s.name}</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">{s.value}%</div>
                </div>
              ))}
              <div className="mt-2 text-xs text-slate-500">
                Tip: focus on “Expired/Missing” first — they’re instant risk.
              </div>
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Compliance Trend"
          subtitle="Avg compliance score (last 6 months)"
          right={<PrimaryButton>Export</PrimaryButton>}
        >
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={platformComplianceTrend}>
                <CartesianGrid stroke="#E6EDF7" strokeDasharray="4 4" />
                <XAxis dataKey="month" />
                <YAxis domain={[50, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#0B3557" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Workforce Distribution"
          subtitle="Workers and sites by contractor"
          right={<Select label="All Sites" />}
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workforceByContractor}>
                <CartesianGrid stroke="#E6EDF7" strokeDasharray="4 4" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="workers" fill="#1AA6A6" />
                <Bar dataKey="sites" fill="#0B3557" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="SLA Performance"
          subtitle="On-time vs late completion trend"
          right={<Select label="Last 6 weeks" />}
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={slaTrend}>
                <CartesianGrid stroke="#E6EDF7" strokeDasharray="4 4" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="onTime" stroke="#1AA6A6" fill="#1AA6A6" strokeWidth={2} fillOpacity={0.18} />
                <Area type="monotone" dataKey="late" stroke="#F59E0B" fill="#F59E0B" strokeWidth={2} fillOpacity={0.14} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Inspection Audit Results"
          subtitle="Quality outcomes across contractors"
          right={<div className="flex items-center gap-2"><Select label="Last 30 days" /><SmallButton>Download</SmallButton></div>}
        >
          <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricMini label="Pass Rate" value={`${auditPassRate}%`} />
            <MetricMini label="Failed Audits" value={totalAuditFail} />
            <MetricMini label="Avg Audit Score" value={avgAuditScore} />
            <MetricMini label="Reinspections" value={totalReinspections} />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={auditChart}>
                <CartesianGrid stroke="#E6EDF7" strokeDasharray="4 4" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pass" stackId="a" fill="#1AA6A6" />
                <Bar dataKey="minor" stackId="a" fill="#F59E0B" />
                <Bar dataKey="major" stackId="a" fill="#FB7185" />
                <Bar dataKey="failed" stackId="a" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Client Requests"
          subtitle="Customer demand and responsiveness"
          right={<PrimaryButton>Export</PrimaryButton>}
        >
          <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricMini label="Total Requests" value={requestTotal} />
            <MetricMini label="Avg Response Time" value={`${avgResponseTime}h`} />
            <MetricMini label="Requests Closed" value={`${requestClosureRate}%`} />
            <MetricMini label="Escalations" value={escalations} />
          </div>
          <div className="h-[220px] mb-5">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={clientRequests}>
                <CartesianGrid stroke="#E6EDF7" strokeDasharray="4 4" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="open" name="Open Requests" stroke="#0B3557" strokeWidth={3} dot />
                <Line type="monotone" dataKey="closed" name="Closed Requests" stroke="#1AA6A6" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <Table columns={clientColumns} rows={clientRequestSites} rowKey={(r) => r.client} />
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Shift Rosters"
          subtitle="Required vs scheduled staffing by site"
          right={<Select label="This week" />}
        >
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <MetricMini label="Required Shifts" value={totalRequiredShifts} />
            <MetricMini label="Scheduled Shifts" value={totalScheduledShifts} />
            <MetricMini label="Understaffed" value={understaffedShifts} />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rosterChart}>
                <CartesianGrid stroke="#E6EDF7" strokeDasharray="4 4" />
                <XAxis dataKey="site" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="required" name="Required" fill="#0B3557" />
                <Bar dataKey="scheduled" name="Scheduled" fill="#1AA6A6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Timesheet Analytics"
          subtitle="Scheduled vs actual hours, attendance, missing entries"
          right={<SmallButton>Download</SmallButton>}
        >
          <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricMini label="Scheduled Hours" value={totalScheduledHours} />
            <MetricMini label="Actual Hours" value={totalActualHours} />
            <MetricMini label="Overtime Hours" value={totalOvertimeHours} />
            <MetricMini label="Attendance Rate" value={`${avgAttendance}%`} />
          </div>
          <div className="h-[220px] mb-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timesheetChart}>
                <CartesianGrid stroke="#E6EDF7" strokeDasharray="4 4" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="scheduledHours" name="Scheduled Hours" fill="#0B3557" />
                <Bar dataKey="actualHours" name="Actual Hours" fill="#1AA6A6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Table columns={timesheetColumns} rows={timesheetAnalytics} rowKey={(r) => r.contractor} />
          <div className="mt-3 text-xs text-slate-500">
            Missing timesheets currently: {missingTimesheets}. Higher actual hours than scheduled usually signals overtime or roster gaps.
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="High Risk Contractors"
          subtitle="Sorted by risk score"
          right={<SmallButton>View All</SmallButton>}
        >
          <Table columns={riskColumns} rows={highRisk} rowKey={(r) => r.name} />
        </ChartCard>

        <ChartCard
          title="Upcoming Expiries"
          subtitle="Most urgent expiring documents"
          right={<SmallButton>Notify</SmallButton>}
        >
          <Table columns={upcomingColumns} rows={upcoming} rowKey={(r) => r.contractor + r.document} />
        </ChartCard>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard title="Total Active Workers" value={totalWorkers} sub="Across all contractors" />
        <StatCard title="Sites Covered Today" value={sitesCoveredToday} sub="Sum of active site assignments" />
        <StatCard title="Portfolio Risk Level" value={riskLevel} sub="Based on non-compliance + expiries" badge={{ variant: riskLevel === "Low" ? "good" : "warn", text: riskLevel }} />
      </div>
    </div>
  );
}

function MetricMini({ label, value }) {
  return (
    <div className="rounded-lg border border-line bg-slate-50 p-3">
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

function shortName(name) {
  const parts = name.split(" ");
  return parts.length <= 2 ? name : parts[0] + " " + parts[1];
}

function makeComplianceSplit(list) {
  const good = list.filter((c) => c.score >= 85).length;
  const expiring = list.filter((c) => c.score >= 70 && c.score < 85).length;
  const expired = list.filter((c) => c.score >= 50 && c.score < 70).length;
  const missing = list.filter((c) => c.score < 50).length;
  const total = Math.max(1, list.length);
  const toPct = (n) => Math.round((n / total) * 100);
  return [
    { name: "Compliant", value: toPct(good) },
    { name: "Expiring Soon", value: toPct(expiring) },
    { name: "Expired", value: toPct(expired) },
    { name: "Missing", value: toPct(missing) },
  ];
}

function docVariant(s) {
  const v = String(s).toLowerCase();
  if (v === "valid") return "good";
  if (v === "pending") return "info";
  if (v === "expiring") return "warn";
  return "bad";
}

function riskVariant(score) {
  if (score >= 75) return "bad";
  if (score >= 45) return "warn";
  return "good";
}