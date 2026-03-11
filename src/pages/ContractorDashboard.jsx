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
import {
  jobs,
  contractorWorkerCompliance,
  contractorInspectionAudits,
  contractorClientRequests,
  contractorShiftRosters,
  contractorTimesheets,
} from "../data/mockContractors.js";

export default function ContractorDashboard() {
  const company = "ABC Cleaning Services";
  const myJobs = jobs.filter((j) => j.contractor === company);

  const totalJobs = myJobs.length;
  const completedJobs = myJobs.filter((j) => j.status === "Completed").length;
  const delayedJobs = myJobs.filter((j) => j.delayed).length;
  const delayRate = pct(delayedJobs, totalJobs);
  const avgDuration = Math.round(avg(myJobs.map((j) => j.durationMin)));
  const avgRating = round1(avg(myJobs.map((j) => j.rating)));

  const workerTotal = contractorWorkerCompliance.length;
  const workerValid = contractorWorkerCompliance.filter((w) => w.status === "Valid").length;
  const workerExpiring = contractorWorkerCompliance.filter((w) => w.status === "Expiring").length;
  const workerPending = contractorWorkerCompliance.filter((w) => w.status === "Pending").length;
  const workerExpired = contractorWorkerCompliance.filter((w) => w.status === "Expired").length;

  const complianceScore = Math.round(
    (workerValid * 100 + workerExpiring * 70 + workerPending * 50) /
      Math.max(1, workerTotal)
  );

  const openRequests = contractorClientRequests.reduce((sum, r) => sum + r.open, 0);
  const closedRequests = contractorClientRequests.reduce((sum, r) => sum + r.closed, 0);
  const avgResponseTime = round1(
    avg(contractorClientRequests.map((r) => r.avgResponseHours))
  );
  const requestEscalations = contractorClientRequests.reduce(
    (sum, r) => sum + r.escalations,
    0
  );

  const inspectionScore =
    contractorInspectionAudits[contractorInspectionAudits.length - 1]?.score ?? 0;
  const reinspectionsNeeded = contractorInspectionAudits.filter(
    (m) => m.failed > 0
  ).length;

  const donut = [
    { name: "Valid", value: pct(workerValid, workerTotal) },
    { name: "Expiring", value: pct(workerExpiring, workerTotal) },
    { name: "Pending", value: pct(workerPending, workerTotal) },
    { name: "Expired", value: pct(workerExpired, workerTotal) },
  ];
  const donutColors = ["#1AA6A6", "#F59E0B", "#38BDF8", "#EF4444"];

  const jobTrend = buildContractorTrend(myJobs);

  const inspectionBreakdown = contractorInspectionAudits.map((m) => ({
    month: m.month,
    pass: m.pass,
    minor: m.minor,
    major: m.major,
    failed: m.failed,
  }));

  const workforceChart = contractorShiftRosters.map((r) => ({
    site: r.site,
    required: r.required,
    assigned: r.assigned,
  }));

  const timesheetChart = contractorTimesheets.map((t) => ({
    site: t.site,
    scheduledHours: t.scheduledHours,
    actualHours: t.actualHours,
  }));

  const complianceColumns = [
    {
      key: "worker",
      title: "Worker",
      render: (r) => <span className="font-semibold">{r.worker}</span>,
    },
    { key: "site", title: "Site" },
    { key: "document", title: "Document" },
    {
      key: "days",
      title: "Days Remaining",
      render: (r) => (
        <Badge
          variant={
            r.status === "Expired"
              ? "bad"
              : r.status === "Expiring"
              ? "warn"
              : r.status === "Pending"
              ? "info"
              : "good"
          }
        >
          {r.status === "Expired" ? `${Math.abs(r.days)}d overdue` : r.days ? `${r.days}d` : "—"}
        </Badge>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (r) => (
        <Badge
          variant={
            r.status === "Valid"
              ? "good"
              : r.status === "Expiring"
              ? "warn"
              : r.status === "Pending"
              ? "info"
              : "bad"
          }
        >
          {r.status}
        </Badge>
      ),
    },
  ];

  const requestColumns = [
    { key: "week", title: "Week" },
    { key: "open", title: "Open Requests" },
    { key: "closed", title: "Closed Requests" },
    {
      key: "avgResponseHours",
      title: "Avg Response",
      render: (r) => <span className="font-semibold">{r.avgResponseHours}h</span>,
    },
    {
      key: "escalations",
      title: "Escalations",
      render: (r) => (
        <Badge variant={r.escalations ? "warn" : "good"}>{r.escalations}</Badge>
      ),
    },
  ];

  const timesheetColumns = [
    {
      key: "site",
      title: "Site",
      render: (r) => <span className="font-semibold">{r.site}</span>,
    },
    { key: "scheduledHours", title: "Scheduled Hours" },
    { key: "actualHours", title: "Actual Hours" },
    {
      key: "attendance",
      title: "Attendance",
      render: (r) => <span className="font-semibold">{r.attendance}%</span>,
    },
    {
      key: "missingTimesheets",
      title: "Missing Timesheets",
      render: (r) => (
        <Badge variant={r.missingTimesheets ? "warn" : "good"}>
          {r.missingTimesheets}
        </Badge>
      ),
    },
  ];

  const overtimeHours = contractorTimesheets.reduce(
    (sum, t) => sum + Math.max(0, t.actualHours - t.scheduledHours),
    0
  );
  const avgAttendance = Math.round(avg(contractorTimesheets.map((t) => t.attendance)));
  const missingTimesheets = contractorTimesheets.reduce(
    (sum, t) => sum + t.missingTimesheets,
    0
  );

  return (
    <div className="space-y-6">
      {/* Health snapshot */}
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard
          title="My Compliance Score"
          value={`${complianceScore}%`}
          sub="Based on document status"
          badge={{
            variant:
              complianceScore >= 85
                ? "good"
                : complianceScore >= 70
                ? "warn"
                : "bad",
            text:
              complianceScore >= 85
                ? "Good"
                : complianceScore >= 70
                ? "Watch"
                : "Risk",
          }}
        />

        <StatCard
          title="Expiring Docs (30d)"
          value={workerExpiring + workerExpired}
          sub={`${workerExpired} urgent (expired)`}
          badge={{
            variant: workerExpired > 0 ? "bad" : "warn",
            text: workerExpired > 0 ? "Urgent" : "Soon",
          }}
        />

        <StatCard
          title="Active Workers"
          value={workerTotal}
          sub="Workers assigned to sites"
        />

        <StatCard
          title="Active Sites"
          value={contractorShiftRosters.length}
          sub="Current assignments"
        />
      </div>

      {/* Operations snapshot */}
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="Total Jobs" value={totalJobs} sub="Last 6 weeks" />

        <StatCard
          title="On-Time Rate"
          value={`${100 - delayRate}%`}
          sub={`${completedJobs} completed`}
          badge={{
            variant: delayRate <= 10 ? "good" : delayRate <= 20 ? "warn" : "bad",
            text: delayRate <= 10 ? "Good" : delayRate <= 20 ? "Watch" : "Risk",
          }}
        />

        <StatCard
          title="Open Requests"
          value={openRequests}
          sub={`${requestEscalations} escalations`}
          badge={{
            variant: requestEscalations ? "warn" : "good",
            text: requestEscalations ? "Action" : "Stable",
          }}
        />

        <StatCard
          title="Inspection Score"
          value={`${inspectionScore}%`}
          sub={`Reinspections: ${reinspectionsNeeded}`}
          badge={{
            variant:
              inspectionScore >= 85
                ? "good"
                : inspectionScore >= 70
                ? "warn"
                : "bad",
            text:
              inspectionScore >= 85
                ? "Strong"
                : inspectionScore >= 70
                ? "Watch"
                : "Risk",
          }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="My SLA Performance"
          subtitle={`${company} • completion vs delay trend`}
          right={
            <div className="flex items-center gap-2">
              <Select label="Last 6 weeks" />
              <SmallButton>Download</SmallButton>
            </div>
          }
        >
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={jobTrend}>
                <CartesianGrid stroke="#E6EDF7" strokeDasharray="4 4" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="completionRate"
                  name="Completion %"
                  stroke="#1AA6A6"
                  strokeWidth={3}
                  dot
                />
                <Line
                  type="monotone"
                  dataKey="delayRate"
                  name="Delay %"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Inspection Results"
          subtitle="Quality results from recent audits"
          right={<PrimaryButton>View Reports</PrimaryButton>}
        >
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <MiniMetric label="Avg Score" value={inspectionScore} />
            <MiniMetric label="Avg Rating" value={`${avgRating || "—"}/5`} />
            <MiniMetric label="Avg Duration" value={`${avgDuration}m`} />
          </div>

          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inspectionBreakdown}>
                <CartesianGrid stroke="#E6EDF7" strokeDasharray="4 4" />
                <XAxis dataKey="month" />
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
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Workforce Overview"
          subtitle="Assigned vs required workers by site"
          right={<Select label="All Sites" />}
        >
          <div className="h-[240px] mb-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workforceChart}>
                <CartesianGrid stroke="#E6EDF7" strokeDasharray="4 4" />
                <XAxis dataKey="site" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="required" name="Required" fill="#0B3557" />
                <Bar dataKey="assigned" name="Assigned" fill="#1AA6A6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <Table
            columns={[
              {
                key: "site",
                title: "Site",
                render: (r) => <span className="font-semibold">{r.site}</span>,
              },
              { key: "required", title: "Required" },
              { key: "assigned", title: "Assigned" },
              {
                key: "gap",
                title: "Coverage",
                render: (r) => {
                  const gap = r.assigned - r.required;
                  return (
                    <Badge variant={gap >= 0 ? "good" : "warn"}>
                      {gap >= 0 ? "Covered" : `${Math.abs(gap)} short`}
                    </Badge>
                  );
                },
              },
            ]}
            rows={contractorShiftRosters}
            rowKey={(r) => r.site}
          />
        </ChartCard>

        <ChartCard
          title="Worker Compliance"
          subtitle="Document health across your workforce"
          right={<SmallButton>Upload Docs</SmallButton>}
        >
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div className="h-[230px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donut}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={96}
                    paddingAngle={2}
                  >
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
                <div
                  key={s.name}
                  className="flex items-center justify-between rounded-lg border border-line bg-white px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded"
                      style={{ background: donutColors[i] }}
                    />
                    <span className="text-sm font-semibold text-slate-700">
                      {s.name}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {s.value}%
                  </div>
                </div>
              ))}

              <div className="rounded-lg border border-line bg-slate-50 p-3 text-sm text-slate-700">
                Compliance score: <span className="font-semibold">{complianceScore}%</span>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <Table
              columns={complianceColumns}
              rows={contractorWorkerCompliance}
              rowKey={(r) => r.worker + r.document}
            />
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Timesheet Analytics"
          subtitle="Scheduled vs actual hours by site"
          right={<Select label="This week" />}
        >
          <div className="mb-4 grid gap-3 sm:grid-cols-4">
            <MiniMetric
              label="Scheduled Hours"
              value={contractorTimesheets.reduce((s, t) => s + t.scheduledHours, 0)}
            />
            <MiniMetric
              label="Actual Hours"
              value={contractorTimesheets.reduce((s, t) => s + t.actualHours, 0)}
            />
            <MiniMetric label="Overtime" value={overtimeHours} />
            <MiniMetric label="Attendance" value={`${avgAttendance}%`} />
          </div>

          <div className="h-[220px] mb-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timesheetChart}>
                <CartesianGrid stroke="#E6EDF7" strokeDasharray="4 4" />
                <XAxis dataKey="site" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="scheduledHours"
                  name="Scheduled Hours"
                  fill="#0B3557"
                />
                <Bar
                  dataKey="actualHours"
                  name="Actual Hours"
                  fill="#1AA6A6"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <Table columns={timesheetColumns} rows={contractorTimesheets} rowKey={(r) => r.site} />

          <div className="mt-3 text-xs text-slate-500">
            Missing timesheets: {missingTimesheets}. Higher actual hours than scheduled usually means overtime or roster gaps.
          </div>
        </ChartCard>

        <ChartCard
          title="Client Requests"
          subtitle="Open/closed requests and response time"
          right={<PrimaryButton>Export</PrimaryButton>}
        >
          <div className="mb-4 grid gap-3 sm:grid-cols-4">
            <MiniMetric label="Open Requests" value={openRequests} />
            <MiniMetric label="Closed Requests" value={closedRequests} />
            <MiniMetric label="Avg Response" value={`${avgResponseTime}h`} />
            <MiniMetric label="Escalations" value={requestEscalations} />
          </div>

          <div className="h-[220px] mb-5">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={contractorClientRequests}>
                <CartesianGrid stroke="#E6EDF7" strokeDasharray="4 4" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="open"
                  name="Open Requests"
                  stroke="#0B3557"
                  strokeWidth={3}
                  dot
                />
                <Line
                  type="monotone"
                  dataKey="closed"
                  name="Closed Requests"
                  stroke="#1AA6A6"
                  strokeWidth={3}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <Table columns={requestColumns} rows={contractorClientRequests} rowKey={(r) => r.week} />
        </ChartCard>
      </div>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="rounded-lg border border-line bg-slate-50 p-3">
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

function buildContractorTrend(myJobs) {
  const weeks = ["W1", "W2", "W3", "W4", "W5", "W6"];
  return weeks.map((week) => {
    const weekJobs = myJobs.filter((j) => j.week === week);
    return {
      week,
      completionRate: pct(
        weekJobs.filter((j) => j.status === "Completed").length,
        weekJobs.length || 1
      ),
      delayRate: pct(
        weekJobs.filter((j) => j.delayed).length,
        weekJobs.length || 1
      ),
    };
  });
}

function pct(n, d) {
  return Math.round((n / Math.max(1, d)) * 100);
}

function avg(nums) {
  const arr = nums.filter((n) => Number.isFinite(n));
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

function round1(n) {
  return Math.round(n * 10) / 10;
}