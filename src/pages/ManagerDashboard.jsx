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
import { contractors, platformComplianceTrend, slaTrend, workforceDocs } from "../data/mockContractors.js";

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

  const upcoming = workforceDocs
    .slice()
    .sort((a, b) => a.days - b.days)
    .slice(0, 6);

  const upcomingColumns = [
    { key: "contractor", title: "Contractor", render: (r) => <span className="font-semibold">{r.contractor}</span> },
    { key: "document", title: "Document" },
    { key: "expiry", title: "Expiry" },
    { key: "days", title: "Days", render: (r) => <Badge variant={r.days <= 7 ? "bad" : r.days <= 30 ? "warn" : "neutral"}>{r.days}d</Badge> },
    { key: "docStatus", title: "Status", render: (r) => <Badge variant={docVariant(r.docStatus)}>{r.docStatus}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="Total Contractors" value={totalContractors} sub="All registered contractors" />
        <StatCard title="Active Contractors" value={activeContractors} sub="Contractors on Site" />
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
