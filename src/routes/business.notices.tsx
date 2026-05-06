import { createFileRoute } from "@tanstack/react-router";
import { DEMO_BUSINESS } from "@/lib/mockData";
import { Card } from "@/components/ui/card";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/business/notices")({
  component: Notices,
});

const NOTICES = [
  { date: "2026-04-28", from: "KSPCB", title: "Effluent treatment review due", priority: "medium" },
  { date: "2026-04-15", from: "Labour Dept", title: "EPF return submission acknowledged", priority: "low" },
  { date: "2026-03-30", from: "Factories Dept", title: "Annual renewal window open", priority: "high" },
  { date: "2026-03-12", from: "GST", title: "GSTR-3B filing successful", priority: "low" },
];

function Notices() {
  const b = DEMO_BUSINESS;
  const all = [
    ...b.riskFlags.map((f, i) => ({ date: "Today", from: "Activity Engine", title: f, priority: "high" as const })),
    ...NOTICES,
  ];
  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl flex items-center gap-3"><Bell className="h-6 w-6 text-primary" /> Notices</h1>
      <p className="text-sm text-muted-foreground">{all.length} notices from departments and the Activity Engine</p>

      <div className="mt-5 space-y-3">
        {all.map((n, i) => (
          <Card key={i} className="flex items-start justify-between gap-3 p-4 shadow-soft">
            <div>
              <div className="text-xs text-muted-foreground">{n.date} • {n.from}</div>
              <div className="text-sm font-medium">{n.title}</div>
            </div>
            <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase ${
              n.priority === "high" ? "bg-destructive text-destructive-foreground" :
              n.priority === "medium" ? "bg-warning text-warning-foreground" :
              "bg-muted text-muted-foreground"
            }`}>{n.priority}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
