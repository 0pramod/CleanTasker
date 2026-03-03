import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

import StatCard from "../ui/StatCard.jsx";
import ChartCard from "../ui/ChartCard.jsx";
import Badge from "../ui/Badge.jsx";
import { Table } from "../ui/Table.jsx";
import { Select, SmallButton, PrimaryButton } from "../ui/Filters.jsx";
import { contractors, jobs, jobTrend } from "../data/mockContractors.js";

export default function ManagerPerformance() {
  const totalJobs = jobs.length;
  const completedJobs = jobs.filter((j) => j.status === "Completed").length;
  const delayedJobs = jobs.filter((j) => j.delayed).length;

  const completionRate = pct(completedJobs, totalJobs);
  const delayRate = pct(delayedJobs, totalJobs);
  const avgDuration = Math.round(avg(jobs.map((j) => j.durationMin)));

  const platformAvgRating = round1(avg(jobs.map((j) => j.rating)));

  const riskScore = calcPortfolioRisk({ delayRate, completionRate, avgDuration });

  const trend = jobTrend.map((t) => ({
    week: t.week,
    completionRate: pct(t.completed, t.total),
    delayRate: pct(t.delayed, t.total),
  }));

  const jobsByContractor = groupBy(jobs, (j) => j.contractorId);
  const perfRows = contractors.map((c) => {
    const cj = jobsByContractor[c.id] || [];
    const total = cj.length;
    const completed = cj.filter((j) => j.status === "Completed").length;
    const delayed = cj.filter((j) => j.delayed).length;
    const avgDur = total ? Math.round(avg(cj.map((j) => j.durationMin))) : 0;
    const rating = total ? round1(avg(cj.map((j) => j.rating))) : null;

    // risk: delay% + low compliance + low inspection (weights)
    const delayPct = pct(delayed, total || 1);
    const r =
      delayPct * 0.4 +
      (100 - c.score) * 0.3 +
      (100 - c.lastInspection) * 0.3;

    return {
      id: c.id,
      contractor: c.name,
      jobs: total,
      completion: pct(completed, total || 1),
      delay: delayPct,
      avgDur,
      rating,
      inspection: c.lastInspection,
      compliance: c.score,
      risk: Math.round(r),
    };
  }).sort((a, b) => b.risk - a.risk);

  const jobsChart = perfRows.map((r) => ({ name: shortName(r.contractor), jobs: r.jobs }));
  const durationChart = perfRows.map((r) => ({ name: shortName(r.contractor), avgDur: r.avgDur }));

  const columns = [
    { key: "contractor", title: "Contractor", render: (r) => <span className="font-semibold text-sky-700">{r.contractor}</span> },
    { key: "jobs", title: "Jobs" },
    { key: "completion", title: "Completion", render: (r) => <span className="font-semibold">{r.completion}%</span> },
    { key: "delay", title: "Delay", render: (r) => <span className="font-semibold">{r.delay}%</span> },
    { key: "avgDur", title: "Avg Duration", render: (r) => <span className="font-semibold">{r.avgDur}m</span> },
    { key: "inspection", title: "Inspection", render: (r) => <span className="font-semibold">{r.inspection}%</span> },
    { key: "compliance", title: "Compliance", render: (r) => <span className="font-semibold">{r.compliance}%</span> },
    { key: "risk", title: "Risk", render: (r) => <Badge variant={riskVariant(r.risk)}>Risk {r.risk}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="Total Jobs" value={totalJobs} sub="Last 6 weeks" />
        <StatCard title="Completion Rate" value={`${completionRate}%`} sub={`${completedJobs} completed`} badge={{ variant: completionRate >= 85 ? "good" : completionRate >= 70 ? "warn" : "bad", text: completionRate >= 85 ? "Good" : completionRate >= 70 ? "Watch" : "Risk" }} />
        <StatCard title="Delay Rate" value={`${delayRate}%`} sub={`${delayedJobs} delayed`} badge={{ variant: delayRate <= 10 ? "good" : delayRate <= 20 ? "warn" : "bad", text: delayRate <= 10 ? "Stable" : delayRate <= 20 ? "Watch" : "High" }} />
        <StatCard title="Avg Job Duration" value={`${avgDuration}m`} sub="Mean time to complete" badge={{ variant: avgDuration <= 65 ? "good" : avgDuration <= 90 ? "warn" : "bad", text: "Efficiency" }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Completion vs Delay Trend"
          subtitle="Rates over time (last 6 weeks)"
          right={<div className="flex items-center gap-2"><Select label="Last 6 weeks" /><SmallButton>Download</SmallButton></div>}
        >
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid stroke="#E6EDF7" strokeDasharray="4 4" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="completionRate" name="Completion %" stroke="#1AA6A6" strokeWidth={3} dot />
                <Line type="monotone" dataKey="delayRate" name="Delay %" stroke="#F59E0B" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Completion should stay high. Delay should trend down.
          </div>
        </ChartCard>

        <ChartCard
          title="Portfolio Performance Summary"
          subtitle="What matters to operations"
          right={<PrimaryButton>Export</PrimaryButton>}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <SummaryRow label="SLA Compliance" value={`${Math.max(0, 100 - delayRate)}%`} badge={delayRate <= 10 ? { v: "good", t: "On track" } : delayRate <= 20 ? { v: "warn", t: "Watch" } : { v: "bad", t: "Breach risk" }} />
            <SummaryRow label="Avg Contractor Rating" value={platformAvgRating ? `${platformAvgRating}/5` : "—"} badge={platformAvgRating >= 4.2 ? { v: "good", t: "Strong" } : platformAvgRating >= 3.6 ? { v: "warn", t: "Mixed" } : { v: "bad", t: "Low" }} />
            <SummaryRow label="Performance Risk Score" value={riskScore} badge={riskScore <= 30 ? { v: "good", t: "Low" } : riskScore <= 60 ? { v: "warn", t: "Medium" } : { v: "bad", t: "High" }} />
            <SummaryRow label="Focus" value={delayRate > 15 ? "Reduce delays" : completionRate < 80 ? "Improve completion" : "Maintain"} badge={{ v: "neutral", t: "This week" }} />
          </div>
          <div className="mt-4 rounded-lg border border-line bg-slate-50 p-4 text-sm text-slate-700">
            Best action: target the top 2 contractors by <span className="font-semibold">Risk</span> and fix delays + inspections.
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Jobs Completed per Contractor" subtitle="Workload distribution" right={<Select label="All Sites" />}>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={jobsChart}>
                <CartesianGrid stroke="#E6EDF7" strokeDasharray="4 4" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="jobs" name="Jobs" fill="#0B3557" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Average Completion Time" subtitle="Mean duration per contractor" right={<Select label="Last 6 weeks" />}>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={durationChart}>
                <CartesianGrid stroke="#E6EDF7" strokeDasharray="4 4" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgDur" name="Minutes" fill="#1AA6A6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Contractor Performance" subtitle="Completion, delays, duration, inspection and risk" right={<SmallButton>View All</SmallButton>}>
        <Table columns={columns} rows={perfRows} rowKey={(r) => r.id} />
      </ChartCard>
    </div>
  );
}

function SummaryRow({ label, value, badge }) {
  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <div className="text-xl font-bold text-slate-900">{value}</div>
        {badge ? <Badge variant={badge.v}>{badge.t}</Badge> : null}
      </div>
    </div>
  );
}

function groupBy(list, keyFn) {
  return list.reduce((acc, item) => {
    const k = keyFn(item);
    (acc[k] ||= []).push(item);
    return acc;
  }, {});
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

function shortName(name) {
  const parts = String(name).split(" ");
  return parts.length <= 2 ? name : parts[0] + " " + parts[1];
}

function calcPortfolioRisk({ delayRate, completionRate, avgDuration }) {
  // Simple executive score (0-100). Higher = worse.
  const risk =
    delayRate * 0.6 +
    (100 - completionRate) * 0.3 +
    Math.max(0, (avgDuration - 60)) * 0.2;
  return Math.max(0, Math.min(100, Math.round(risk)));
}

function riskVariant(score) {
  if (score > 60) return "bad";
  if (score > 30) return "warn";
  return "good";
}
