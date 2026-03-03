import { Card } from "./Card.jsx";
import Badge from "./Badge.jsx";

export default function StatCard({ title, value, sub, badge }) {
  return (
    <Card className="p-5">
      <div className="text-sm font-semibold text-slate-600 flex items-center justify-between gap-2">
        <span>{title}</span>
        {badge ? <Badge variant={badge.variant}>{badge.text}</Badge> : null}
      </div>
      <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
      {sub ? <div className="mt-2 text-sm text-slate-500">{sub}</div> : null}
    </Card>
  );
}
