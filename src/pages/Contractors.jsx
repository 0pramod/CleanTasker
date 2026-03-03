import { Card, CardHeader } from "../ui/Card.jsx";
import { Input, Select, SmallButton, FiltersBar } from "../ui/Filters.jsx";
import { Table } from "../ui/Table.jsx";
import Badge from "../ui/Badge.jsx";
import { contractors } from "../data/mockContractors.js";

export default function Contractors() {
  const columns = [
    { key: "name", title: "Contractor", render: (r) => <span className="font-semibold text-sky-700">{r.name}</span> },
    { key: "contact", title: "Contact Person" },
    { key: "phone", title: "Phone" },
    { key: "sites", title: "Active Sites" },
    { key: "workers", title: "Total Workers" },
    { key: "score", title: "Compliance Score", render: (r) => <span className="font-semibold">{r.score}%</span> },
    { key: "status", title: "Status", render: (r) => <Badge variant={statusVariant(r.status)}>{r.status}</Badge> },
  ];

  return (
    <Card>
      <CardHeader title="Contractors" subtitle="Directory and quick compliance view" right={<SmallButton>Export</SmallButton>} />
      <div className="p-5">
        <FiltersBar
          left={<Input placeholder="Search contractors..." />}
          right={
            <>
              <Select label="All Contractors" />
              <Select label="All Document Types" />
              <Select label="Next 30 Days" />
            </>
          }
        />
        <Table columns={columns} rows={contractors} rowKey={(r) => r.id} />
        <div className="mt-3 text-xs text-slate-500">
          Showing 1 - {contractors.length} of {contractors.length} records
        </div>
      </div>
    </Card>
  );
}

function statusVariant(status) {
  const s = String(status).toLowerCase();
  if (s === "active") return "good";
  if (s === "expiring") return "warn";
  if (s === "expired") return "bad";
  return "neutral";
}
