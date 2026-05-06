import { createFileRoute } from "@tanstack/react-router";
import { DEMO_BUSINESS } from "@/lib/mockData";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/business/history")({
  component: History,
});

function History() {
  const b = DEMO_BUSINESS;
  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Compliance History</h1>
      <p className="text-sm text-muted-foreground">All inspections, renewals, and verifications</p>

      <Card className="mt-6 p-5 shadow-soft">
        {b.inspections.length === 0 ? (
          <div className="rounded-md border bg-muted/30 p-4 text-sm text-muted-foreground">No history recorded yet.</div>
        ) : (
          <ol className="relative ml-3 space-y-5 border-l pl-5">
            {b.inspections.map(ins => (
              <li key={ins.id} className="relative">
                <span className={`absolute -left-[26px] top-1 h-3 w-3 rounded-full border-2 border-background ${
                  ins.outcome === "pass" ? "bg-success" :
                  ins.outcome === "minor-issue" ? "bg-warning" :
                  ins.outcome === "major-issue" ? "bg-destructive" : "bg-muted-foreground"
                }`} />
                <div className="text-sm font-medium">{ins.date} — {ins.officer}</div>
                <div className="text-xs text-muted-foreground">{ins.type === "livelink" ? "🔴 LiveLink" : "Physical inspection"} • Outcome: {ins.outcome.replace("-", " ")}</div>
                <div className="mt-1 text-sm">{ins.notes}</div>
              </li>
            ))}
          </ol>
        )}
      </Card>
    </div>
  );
}
