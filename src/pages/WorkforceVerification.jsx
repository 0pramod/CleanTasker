import { Card, CardHeader } from "../ui/Card.jsx";
import { FiltersBar, Input, Select, SmallButton } from "../ui/Filters.jsx";
import { Table } from "../ui/Table.jsx";
import Badge from "../ui/Badge.jsx";
import { verificationRows } from "../data/mockContractors.js";

export default function WorkforceVerification() {
  const columns = [
    { key: "worker", title: "Worker", render: (r) => <span className="font-semibold">{r.worker}</span> },
    { key: "contractor", title: "Contractor", render: (r) => <span className="font-semibold text-sky-700">{r.contractor}</span> },
    { key: "site", title: "Site" },
    { key: "check", title: "Check" },
    { key: "status", title: "Status", render: (r) => <Badge variant={variant(r.status)}>{r.status}</Badge> },
  ];

  return (
    <Card>
      <CardHeader title="Workforce Verification" subtitle="Worker identity and certification checks" right={<SmallButton>Export</SmallButton>} />
      <div className="p-5">
        <div className="mb-4 flex flex-wrap gap-2">
          <button className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white">All</button>
          <button className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Contractors</button>
          <button className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Certifications</button>
          <button className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Gift Checklist</button>
        </div>

        <FiltersBar
          left={<Input placeholder="Search worker..." />}
          right={
            <>
              <Select label="All Sites" />
              <Select label="Last 30 Days" />
            </>
          }
        />

        <Table columns={columns} rows={verificationRows} rowKey={(r) => r.worker + r.check} />
      </div>
    </Card>
  );
}

function variant(s) {
  const v = String(s).toLowerCase();
  if (v === "verified") return "good";
  if (v === "pending") return "info";
  return "bad";
}
