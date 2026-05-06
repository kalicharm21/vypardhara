import { createFileRoute, Link } from "@tanstack/react-router";
import { DEMO_BUSINESS } from "@/lib/mockData";
import { Card } from "@/components/ui/card";
import { StatusBadge, TierBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { IdCard, Radio, FileCheck, AlertCircle, Calendar, ShieldCheck } from "lucide-react";
import { StatCard } from "@/components/StatCard";

export const Route = createFileRoute("/business/")({
  component: BusinessHome,
});

function BusinessHome() {
  const b = DEMO_BUSINESS;
  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Business Account
      </div>
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Welcome, {b.tradeName}</h1>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span className="font-mono text-xs">{b.ubid}</span>
        <StatusBadge status={b.status} />
        <TierBadge tier={b.complianceTier} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Compliance Tier" value={b.complianceTier} icon={ShieldCheck} accent="success" />
        <StatCard label="Activity Score" value={b.activityScore} icon={FileCheck} accent="info" trend="Updated weekly" />
        <StatCard label="Last Inspection" value={`${b.monthsSinceInspection}mo`} icon={Calendar} accent={b.monthsSinceInspection > 18 ? "warning" : "primary"} trend={b.lastInspection} />
        <StatCard label="Open Notices" value={b.riskFlags.length} icon={AlertCircle} accent={b.riskFlags.length ? "destructive" : "success"} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Link to="/business/card" className="group">
          <Card className="bg-gradient-hero relative overflow-hidden p-6 text-primary-foreground shadow-elegant transition-all group-hover:shadow-glow">
            <IdCard className="h-7 w-7 opacity-90" />
            <div className="mt-3 text-lg font-bold">Your VyaparCard</div>
            <div className="text-sm text-primary-foreground/80">Tamper-evident physical & digital identity. Required for every government interaction.</div>
            <div className="mt-4 text-xs">View card →</div>
          </Card>
        </Link>
        <Link to="/business/livelink" className="group">
          <Card className="bg-gradient-card p-6 shadow-soft transition-all group-hover:shadow-elegant">
            <Radio className="h-7 w-7 text-destructive" />
            <div className="mt-3 text-lg font-bold">Start LiveLink Session</div>
            <div className="text-sm text-muted-foreground">When physical inspection isn't possible, stream a live verified video feed of your premises.</div>
            <div className="mt-4 text-xs text-primary">Begin session →</div>
          </Card>
        </Link>
        <Link to="/business/submit" className="group">
          <Card className="bg-gradient-card p-6 shadow-soft transition-all group-hover:shadow-elegant">
            <FileCheck className="h-7 w-7 text-primary" />
            <div className="mt-3 text-lg font-bold">Submit / Renew Filing</div>
            <div className="text-sm text-muted-foreground">File a return, request renewal, or update authorised signatory across all linked departments.</div>
            <div className="mt-4 text-xs text-primary">Open form →</div>
          </Card>
        </Link>
      </div>

      <Card className="mt-6 p-5 shadow-soft">
        <div className="mb-3 font-semibold">Linked Department Records</div>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {b.records.map((r, i) => (
            <div key={i} className="rounded-md border bg-background p-3">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium">{r.dept}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{r.recordId}</span>
              </div>
              <div className="mt-1 text-sm font-medium">{r.nameOnRecord}</div>
              <div className="text-[11px] text-muted-foreground">Last event: {r.lastEvent} • {r.lastEventDate}</div>
            </div>
          ))}
        </div>
      </Card>

      {b.riskFlags.length > 0 && (
        <Card className="mt-4 border-destructive/30 bg-destructive/5 p-5">
          <div className="mb-2 flex items-center gap-2 font-semibold text-destructive"><AlertCircle className="h-4 w-4" /> Action Required</div>
          <ul className="space-y-1 text-sm">
            {b.riskFlags.map((f, i) => <li key={i}>• {f}</li>)}
          </ul>
          <Button size="sm" className="mt-3">Resolve Issues</Button>
        </Card>
      )}
    </div>
  );
}
