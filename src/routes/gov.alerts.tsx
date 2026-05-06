import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ALERTS, type Alert } from "@/lib/mockData";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/gov/alerts")({
  component: Alerts,
});

function Alerts() {
  const [sev, setSev] = useState<Alert["severity"] | "all">("all");
  const list = ALERTS.filter(a => sev === "all" || a.severity === sev);

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl flex items-center gap-3">
        <AlertTriangle className="h-6 w-6 text-destructive" /> Alerts & Risk Signals
      </h1>
      <p className="text-sm text-muted-foreground">{list.length} alerts in view</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {(["all", "critical", "high", "medium", "low"] as const).map(s => (
          <button key={s} onClick={() => setSev(s)}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              sev === s ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-accent"
            }`}>{s}</button>
        ))}
      </div>

      <div className="mt-5 grid gap-3">
        {list.map(a => (
          <Card key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-4 shadow-soft">
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 h-2 w-2 rounded-full ${
                a.severity === "critical" ? "bg-destructive live-dot" :
                a.severity === "high" ? "bg-warning" :
                a.severity === "medium" ? "bg-info" : "bg-muted-foreground"
              }`} />
              <div>
                <div className="text-sm font-semibold">
                  <Link to="/gov/businesses/$ubid" params={{ ubid: a.ubid }} className="hover:underline">{a.legalName}</Link>
                  <span className="ml-2 font-mono text-xs text-muted-foreground">{a.ubid}</span>
                </div>
                <div className="text-sm text-muted-foreground">{a.message}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">Raised {a.raisedAt} • {a.type.replace("-", " ")}</div>
              </div>
            </div>
            <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase ${
              a.severity === "critical" ? "bg-destructive text-destructive-foreground" :
              a.severity === "high" ? "bg-warning text-warning-foreground" :
              a.severity === "medium" ? "bg-info text-info-foreground" :
              "bg-muted text-muted-foreground"
            }`}>{a.severity}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
