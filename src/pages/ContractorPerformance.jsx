import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import StatCard from "../ui/StatCard.jsx";
import ChartCard from "../ui/ChartCard.jsx";
import Badge from "../ui/Badge.jsx";
import { Table } from "../ui/Table.jsx";
import { Select, SmallButton } from "../ui/Filters.jsx";
import { jobs, jobTrend } from "../data/mockContractors.js";

export default function ContractorPerformance() {
  const company = "ABC Cleaning Services";
  const myJobs = jobs.filter((j) => j.contractor === company);

  const totalJobs = myJobs.length;
  const completedJobs = myJobs.filter((j) => j.status === "Completed").length;
  const delayedJobs = myJobs.filter((j) => j.delayed).length;

  const completionRate = pct(completedJobs, totalJobs);
  const delayRate = pct(delayedJobs, totalJobs);
  const avgDuration = Math.round(avg(myJobs.map((j) => j.durationMin)));
  const avgRating = round1(avg(myJobs.map((j) => j.rating)));

  const trend = jobTrend.map((t) => {
    const weekJobs = myJobs.filter((j) => j.week === t.week);
    return {
      week: t.week,
      completionRate: pct(
        weekJobs.filter((j) => j.status === "Completed").length,
        Math.max(1, weekJobs.length)
      ),
      delayRate: pct(
        weekJobs.filter((j) => j.delayed).length,
        Math.max(1, weekJobs.length)
      ),
    };
  });

  const rows = myJobs
    .slice()
    .sort((a, b) => (a.week > b.week ? 1 : -1))
    .map((j) => ({
      id: j.id,
      week: j.week,
      site: j.site,
      status: j.status,
      delayed: j.delayed,
      duration: j.durationMin,
      rating: j.rating,
    }));

  const cols = [
    { key: "week", title: "Week" },
    { key: "site", title: "Site", render: (r) => <span className="font-semibold">{r.site}</span> },
    { key: "status", title: "Status", render: (r) => <Badge variant={r.status === "Completed" ? "good" : "warn"}>{r.status}</Badge> },
    { key: "delayed", title: "Delay", render: (r) => <Badge variant={r.delayed ? "bad" : "good"}>{r.delayed ? "Yes" : "No"}</Badge> },
    { key: "duration", title: "Duration", render: (r) => <span className="font-semibold">{r.duration}m</span> },
    { key: "rating", title: "Rating", render: (r) => <span className="font-semibold">{r.rating.toFixed(1)}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="Total Jobs" value={totalJobs} sub="Last 6 weeks" />
        <StatCard title="Completion Rate" value={`${completionRate}%`} sub={`${completedJobs} completed`} badge={{ variant: completionRate >= 85 ? "good" : completionRate >= 70 ? "warn" : "bad", text: completionRate >= 85 ? "Good" : completionRate >= 70 ? "Watch" : "Risk" }} />
        <StatCard title="Delay Rate" value={`${delayRate}%`} sub={`${delayedJobs} delayed`} badge={{ variant: delayRate <= 10 ? "good" : delayRate <= 20 ? "warn" : "bad", text: delayRate <= 10 ? "Stable" : delayRate <= 20 ? "Watch" : "High" }} />
        <StatCard title="Avg Job Duration" value={`${avgDuration}m`} sub={`Rating: ${avgRating || "—"}/5`} />
      </div>

      <ChartCard
        title="My Completion vs Delay"
        subtitle={`${company} • weekly performance`}
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
      </ChartCard>

      <ChartCard
        title="Performance Summary"
        subtitle="Quick comparison and weekly execution"
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-line bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-500">Platform Avg Completion</div>
            <div className="mt-1 text-xl font-bold text-slate-900">78%</div>
          </div>
          <div className="rounded-lg border border-line bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-500">Your Completion</div>
            <div className="mt-1 text-xl font-bold text-slate-900">{completionRate}%</div>
          </div>
          <div className="rounded-lg border border-line bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-500">Your Delay Rate</div>
            <div className="mt-1 text-xl font-bold text-slate-900">{delayRate}%</div>
          </div>
        </div>
      </ChartCard>

      <ChartCard
        title="Job History"
        subtitle="Latest jobs (demo data)"
      >
        <Table columns={cols} rows={rows} rowKey={(r) => r.id} />
      </ChartCard>
    </div>
  );
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