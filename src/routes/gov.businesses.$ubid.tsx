import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BUSINESSES } from "@/lib/mockData";
import { Card } from "@/components/ui/card";
import { StatusBadge, TierBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, IdCard, MapPin, Calendar, Users, IndianRupee, ShieldCheck, AlertTriangle, Radio } from "lucide-react";

export const Route = createFileRoute("/gov/businesses/$ubid")({
  component: BusinessDetail,
  notFoundComponent: () => (
    <div className="p-8"><Link to="/gov/businesses" className="text-primary">← Back to directory</Link><p className="mt-4">Business not found.</p></div>
  ),
  loader: ({ params }) => {
    const b = BUSINESSES.find(x => x.ubid === params.ubid);
    if (!b) throw notFound();
    return b;
  },
});

function BusinessDetail() {
  const b = Route.useLoaderData();
  return (
    <div className="p-6 md:p-8">
      <Link to="/gov/businesses" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Directory</Link>

      <header className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="font-mono text-xs text-muted-foreground">{b.ubid}</div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{b.legalName}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
            <StatusBadge status={b.status} />
            <TierBadge tier={b.complianceTier} />
            <span className="text-muted-foreground">{b.sector} • {b.category}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {b.vyaparCardIssued && (
            <span className="inline-flex items-center gap-1.5 rounded-md border bg-success/10 px-3 py-1.5 text-xs text-success">
              <IdCard className="h-3.5 w-3.5" /> VyaparCard issued {b.cardIssuedOn}
            </span>
          )}
          {b.liveLinkEnabled && (
            <span className="inline-flex items-center gap-1.5 rounded-md border bg-info/10 px-3 py-1.5 text-xs text-info">
              <Radio className="h-3.5 w-3.5" /> LiveLink enabled
            </span>
          )}
        </div>
      </header>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="bg-gradient-card p-5 shadow-soft lg:col-span-2">
          <div className="mb-3 font-semibold">Identity & Operations</div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="PAN" value={b.pan} mono />
            <Field label="GSTIN" value={b.gstin} mono />
            <Field label="Address" value={b.address} icon={MapPin} />
            <Field label="PIN Code" value={b.pincode} mono />
            <Field label="Registered On" value={b.registeredOn} icon={Calendar} />
            <Field label="Employees" value={String(b.employees)} icon={Users} />
            <Field label="Annual Revenue" value={`₹ ${b.annualRevenueCr} Cr`} icon={IndianRupee} />
            <Field label="Activity Score" value={`${b.activityScore} / 100`} />
          </div>
        </Card>

        <Card className="bg-gradient-card p-5 shadow-soft">
          <div className="mb-3 flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4 text-primary" /> Compliance Snapshot</div>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Activity Score</div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-hero" style={{ width: `${b.activityScore}%` }} />
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Months since inspection</div>
              <div className={`mt-0.5 text-xl font-bold ${b.monthsSinceInspection > 18 ? "text-destructive" : ""}`}>{b.monthsSinceInspection}</div>
            </div>
            {b.riskFlags.length > 0 && (
              <div>
                <div className="mb-1 flex items-center gap-1 text-xs font-medium text-destructive"><AlertTriangle className="h-3 w-3" /> Risk Flags</div>
                <ul className="space-y-1">
                  {b.riskFlags.map((f: string, i: number) => (
                    <li key={i} className="rounded-md border border-destructive/20 bg-destructive/5 px-2 py-1 text-xs text-destructive">{f}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Button size="sm" className="mt-4 w-full">Initiate Inspection</Button>
        </Card>
      </div>

      <Card className="mt-4 p-5 shadow-soft">
        <div className="mb-3 font-semibold">Linked Department Records ({b.records.length})</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4">Dept</th>
                <th className="py-2 pr-4">Record ID</th>
                <th className="py-2 pr-4">Name on Record</th>
                <th className="py-2 pr-4">Last Event</th>
              </tr>
            </thead>
            <tbody>
              {b.records.map((r: any, i: number) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-2 pr-4"><span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium">{r.dept}</span></td>
                  <td className="py-2 pr-4 font-mono text-xs">{r.recordId}</td>
                  <td className="py-2 pr-4">{r.nameOnRecord}</td>
                  <td className="py-2 pr-4 text-xs text-muted-foreground">{r.lastEvent} • {r.lastEventDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="mt-4 p-5 shadow-soft">
        <div className="mb-3 font-semibold">Inspection History</div>
        {b.inspections.length === 0 ? (
          <div className="rounded-md border bg-muted/30 p-4 text-sm text-muted-foreground">No inspections recorded.</div>
        ) : (
          <ol className="relative ml-3 space-y-4 border-l pl-5">
            {b.inspections.map((ins: any) => (
              <li key={ins.id} className="relative">
                <span className={`absolute -left-[26px] top-1 h-3 w-3 rounded-full border-2 border-background ${
                  ins.outcome === "pass" ? "bg-success" :
                  ins.outcome === "minor-issue" ? "bg-warning" :
                  ins.outcome === "major-issue" ? "bg-destructive" : "bg-muted-foreground"
                }`} />
                <div className="text-sm font-medium">{ins.date} — {ins.officer}</div>
                <div className="text-xs text-muted-foreground">{ins.type === "livelink" ? "🔴 LiveLink" : "Physical"} • {ins.outcome.replace("-", " ")}</div>
                <div className="mt-1 text-sm">{ins.notes}</div>
              </li>
            ))}
          </ol>
        )}
      </Card>
    </div>
  );
}

function Field({ label, value, icon: Icon, mono }: { label: string; value: string; icon?: any; mono?: boolean }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-0.5 flex items-center gap-1.5 text-sm ${mono ? "font-mono" : ""}`}>
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />} {value}
      </div>
    </div>
  );
}
