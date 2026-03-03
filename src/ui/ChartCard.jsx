import { Card, CardHeader } from "./Card.jsx";

export default function ChartCard({ title, subtitle, right, children }) {
  return (
    <Card>
      <CardHeader title={title} subtitle={subtitle} right={right} />
      <div className="p-5">{children}</div>
    </Card>
  );
}
