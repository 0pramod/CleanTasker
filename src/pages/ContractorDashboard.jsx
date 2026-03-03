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
} from "recharts";

import StatCard from "../ui/StatCard.jsx";
import ChartCard from "../ui/ChartCard.jsx";
import Badge from "../ui/Badge.jsx";
import { Table } from "../ui/Table.jsx";
import { Select, SmallButton, PrimaryButton } from "../ui/Filters.jsx";
import { workforceDocs, contractorSites, inspections } from "../data/mockContractors.js";

export default function ContractorDashboard() {
  const company = "ABC Cleaning Services";
  const myDocs = workforceDocs.filter((d) => d.contractor === company);

  const valid = myDocs.filter((d) => d.docStatus === "Valid").length;
  const expiring = myDocs.filter((d) => d.docStatus === "Expiring").length;
  const pending = myDocs.filter((d) => d.docStatus === "Pending").length;
  const totalDocs = Math.max(1, myDocs.length);

  const myComplianceScore = scoreFromDocs({ valid, expiring, pending, total: totalDocs });
  const expiring30 = myDocs.filter((d) => d.days <= 30).length;
  const expiring7 = myDocs.filter((d) => d.days <= 7).length;

  const activeWorkers = 12;
  const activeSites = 3;
  const pendingApprovals = pending + 1;
  const recentInspection = inspections[inspections.length - 1]?.score ?? 0;

  const donut = [
    { name: "Valid", value: pct(valid, totalDocs) },
    { name: "Expiring", value: pct(expiring, totalDocs) },
    { name: "Pending", value: pct(pending, totalDocs) },
  ];
  const donutColors = ["#1AA6A6", "#F59E0B", "#38BDF8"];

  const expiryAlerts = myDocs
    .slice()
    .sort((a, b) => a.days - b.days)
    .filter((d) => d.days <= 30)
    .slice(0, 6);

  const expiryColumns = [
    { key: "document", title: "Document", render: (r) => <span className="font-semibold">{r.document}</span> },
    { key: "expiry", title: "Expiry Date" },
    { key: "days", title: "Days Left", render: (r) => <Badge variant={r.days <= 7 ? "bad" : "warn"}>{r.days}d</Badge> },
    { key: "docStatus", title: "Status", render: (r) => <Badge variant={docVariant(r.docStatus)}>{r.docStatus}</Badge> },
  ];

  const siteColumns = [
    { key: "site", title: "Site", render: (r) => <span className="font-semibold">{r.site}</span> },
    { key: "workers", title: "Workers" },
    { key: "attendance", title: "Attendance", render: (r) => <span className="font-semibold">{r.attendance}%</span> },
    { key: "completion", title: "Completion", render: (r) => <span className="font-semibold">{r.completion}%</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard
          title="My Compliance Score"
          value={`${myComplianceScore}%`}
          sub="Based on document status"
          badge={{ variant: myComplianceScore >= 85 ? "good" : myComplianceScore >= 70 ? "warn" : "bad", text: myComplianceScore >= 85 ? "Good" : myComplianceScore >= 70 ? "Watch" : "Risk" }}
        />
        <StatCard
          title="Expiring Docs (30d)"
          value={expiring30}
          sub={`${expiring7} urgent (≤7d)`}
          badge={{ variant: expiring7 ? "bad" : "warn", text: expiring7 ? "Urgent" : "Soon" }}
        />
        <StatCard title="Active Workers" value={activeWorkers} sub="Workers assigned to sites" />
        <StatCard title="Active Sites" value={activeSites} sub="Current assignments" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="My Compliance Overview"
          subtitle={`${company} • document health`}
          right={<div className="flex items-center gap-2"><Select label="This month" /><SmallButton>Upload Docs</SmallButton></div>}
        >
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donut} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100} paddingAngle={2}>
                    {donut.map((_, i) => (
                      <Cell key={i} fill={donutColors[i % donutColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {donut.map((s, i) => (
                <div key={s.name} className="flex items-center justify-between rounded-lg border border-line bg-white px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded" style={{ background: donutColors[i] }} />
                    <span className="text-sm font-semibold text-slate-700">{s.name}</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">{s.value}%</div>
                </div>
              ))}
              <div className="mt-2 text-xs text-slate-500">
                Keep “Expiring” near zero to avoid site access issues.
              </div>
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Inspection Trend"
          subtitle="Last 6 inspections"
          right={<PrimaryButton>View Reports</PrimaryButton>}
        >
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={inspections}>
                <CartesianGrid stroke="#E6EDF7" strokeDasharray="4 4" />
                <XAxis dataKey="date" />
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
          title="Expiry Alerts"
          subtitle="Most urgent items to fix"
          right={<SmallButton>Send Reminder</SmallButton>}
        >
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant={expiring7 ? "bad" : "neutral"}>{expiring7} urgent (≤7d)</Badge>
            <Badge variant={expiring30 ? "warn" : "neutral"}>{expiring30} expiring (≤30d)</Badge>
            <Badge variant="info">{pendingApprovals} pending</Badge>
            <Badge variant="neutral">Recent inspection: {recentInspection}%</Badge>
          </div>

          {expiryAlerts.length ? (
            <Table columns={expiryColumns} rows={expiryAlerts} rowKey={(r) => r.document} />
          ) : (
            <div className="rounded-lg border border-line bg-slate-50 p-6 text-sm text-slate-600">
              No documents expiring in the next 30 days 🎉
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Site Activity"
          subtitle="Workers, attendance, completion per site"
          right={<Select label="All Sites" />}
        >
          <div className="h-[220px] mb-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contractorSites}>
                <CartesianGrid stroke="#E6EDF7" strokeDasharray="4 4" />
                <XAxis dataKey="site" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="attendance" fill="#1AA6A6" />
                <Bar dataKey="completion" fill="#0B3557" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <Table columns={siteColumns} rows={contractorSites} rowKey={(r) => r.site} />
        </ChartCard>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard title="Pending Approvals" value={pendingApprovals} sub="Docs awaiting review" badge={{ variant: pendingApprovals ? "info" : "good", text: pendingApprovals ? "Action" : "Clear" }} />
        <StatCard title="Recent Inspection Score" value={`${recentInspection}%`} sub="Latest site inspection result" />
        <StatCard title="Focus This Week" value={expiring7 ? "Urgent Docs" : expiring30 ? "Renew Soon" : "Maintain"} sub={expiring7 ? "Fix expiring docs within 7 days" : expiring30 ? "Renew expiring docs within 30 days" : "Keep compliance stable"} badge={{ variant: expiring7 ? "bad" : expiring30 ? "warn" : "good", text: expiring7 ? "High" : expiring30 ? "Medium" : "Low" }} />
      </div>
    </div>
  );
}

function pct(n, total) {
  return Math.round((n / Math.max(1, total)) * 100);
}

function scoreFromDocs({ valid, expiring, pending, total }) {
  const raw = valid * 100 + expiring * 70 + pending * 60;
  return Math.round(raw / Math.max(1, total));
}

function docVariant(s) {
  const v = String(s).toLowerCase();
  if (v === "valid") return "good";
  if (v === "pending") return "info";
  if (v === "expiring") return "warn";
  return "bad";
}
