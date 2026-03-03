import { Card, CardHeader } from "../ui/Card.jsx";
import { FiltersBar, Input, Select, SmallButton } from "../ui/Filters.jsx";
import { Table } from "../ui/Table.jsx";
import Badge from "../ui/Badge.jsx";
import { workforceDocs } from "../data/mockContractors.js";

export default function WorkforceTracker() {
  const columns = [
    { key: "contractor", title: "Contractor", render: (r) => <span className="font-semibold text-sky-700">{r.contractor}</span> },
    { key: "document", title: "Document" },
    { key: "expiry", title: "Expiry Date" },
    { key: "days", title: "Days Remaining", render: (r) => <Badge variant={r.days <= 7 ? "bad" : r.days <= 30 ? "warn" : "neutral"}>{r.days}d</Badge> },
    { key: "docStatus", title: "Status", render: (r) => <Badge variant={docVariant(r.docStatus)}>{r.docStatus}</Badge> },
    { key: "overall", title: "Overall", render: (r) => <Badge variant={overallVariant(r.overall)}>{r.overall}</Badge> },
  ];

  return (
    <Card>
      <CardHeader title="Workforce Tracker" subtitle="Documents and expiry monitoring" right={<SmallButton>Export</SmallButton>} />
      <div className="p-5">
        <FiltersBar
          left={<Input placeholder="Search contractor..." />}
          right={
            <>
              <Select label="All Sites" />
              <Select label="All Contractors" />
              <Select label="Next 30 Days" />
            </>
          }
        />
        <Table columns={columns} rows={workforceDocs} rowKey={(r) => r.contractor + r.document} />
      </div>
    </Card>
  );
}

function docVariant(s) {
  const v = String(s).toLowerCase();
  if (v === "valid") return "good";
  if (v === "pending") return "info";
  if (v === "expiring") return "warn";
  return "bad";
}

function overallVariant(s) {
  const v = String(s).toLowerCase();
  if (v === "verified") return "good";
  if (v === "pending") return "info";
  return "bad";
}
