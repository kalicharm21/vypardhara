import { createFileRoute } from "@tanstack/react-router";
import { StatCard } from "@/components/StatCard";
import {
  Building2, ShieldCheck, AlertTriangle, IdCard, Radio, GitMerge, TrendingUp, ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";
import { Card } from "@/components/ui/card";
import {
  stats, sectorBreakdown, districtBreakdown, inspectionTrend, tierBreakdown,
  ALERTS, LIVE_SESSIONS,
} from "@/lib/mockData";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/gov/")({
  component: GovDashboard,
});

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function GovDashboard() {
  const s = stats();
  const sectors = sectorBreakdown();
  const districts = districtBreakdown();
  const trend = inspectionTrend();
  const tiers = tierBreakdown();
  const liveNow = LIVE_SESSIONS.filter(l => l.status === "live").length;
  const criticalAlerts = ALERTS.filter(a => a.severity === "critical").length;

  return (
    <div className="p-6 md:p-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Karnataka Commerce & Industries</div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Active Business Intelligence</h1>
          <p className="text-sm text-muted-foreground">Real-time view across 40+ department systems</p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-success/10 px-3 py-1 text-xs font-medium text-success">
            <span className="h-2 w-2 rounded-full bg-success live-dot" /> {liveNow} live sessions
          </span>
          <Link to="/gov/query"><Button size="sm" variant="outline">Run Query <ArrowUpRight className="ml-1 h-3 w-3" /></Button></Link>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Businesses" value={s.total} icon={Building2} trend="+38 this month" />
        <StatCard label="Active (verified)" value={s.active} icon={ShieldCheck} accent="success" trend={`${Math.round(s.active/s.total*100)}% of base`} />
        <StatCard label="VyaparCards Issued" value={s.cards} icon={IdCard} accent="info" trend={`${Math.round(s.cards/s.total*100)}% coverage`} />
        <StatCard label="Inspection Backlog" value={s.overdue} icon={AlertTriangle} accent="warning" trend="Active, no inspection >18mo" />
      </div>

      {/* Charts row */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="bg-gradient-card p-5 lg:col-span-2 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">Inspections — Physical vs LiveLink</div>
              <div className="text-xs text-muted-foreground">Last 12 months</div>
            </div>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Area type="monotone" dataKey="physical" stroke="var(--chart-1)" fill="url(#g1)" strokeWidth={2} />
              <Area type="monotone" dataKey="livelink" stroke="var(--chart-2)" fill="url(#g2)" strokeWidth={2} />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-gradient-card p-5 shadow-soft">
          <div className="mb-4">
            <div className="font-semibold">Compliance Tier</div>
            <div className="text-xs text-muted-foreground">Distribution across base</div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={tiers} dataKey="count" nameKey="tier" innerRadius={50} outerRadius={90} paddingAngle={3}>
                {tiers.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="bg-gradient-card p-5 lg:col-span-2 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">District-wise Activity</div>
              <div className="text-xs text-muted-foreground">Active vs Dormant vs Shell-suspect</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={districts}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="district" stroke="var(--muted-foreground)" fontSize={11} angle={-15} height={50} textAnchor="end" />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="active" stackId="a" fill="var(--chart-2)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="dormant" stackId="a" fill="var(--chart-3)" />
              <Bar dataKey="shell" stackId="a" fill="var(--chart-4)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-gradient-card p-5 shadow-soft">
          <div className="mb-4">
            <div className="font-semibold">Sectors</div>
            <div className="text-xs text-muted-foreground">By count</div>
          </div>
          <div className="space-y-2">
            {sectors.sort((a,b)=>b.value-a.value).map((s2, i) => (
              <div key={s2.name}>
                <div className="flex justify-between text-xs">
                  <span>{s2.name}</span>
                  <span className="text-muted-foreground">{s2.value}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full" style={{ width: `${(s2.value/500)*100*4}%`, background: COLORS[i % COLORS.length] }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Activity feeds */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="bg-gradient-card p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="font-semibold flex items-center gap-2"><Radio className="h-4 w-4 text-primary" /> Live LiveLink Sessions</div>
              <div className="text-xs text-muted-foreground">Streaming now</div>
            </div>
            <Link to="/gov/livelink" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {LIVE_SESSIONS.slice(0, 5).map(l => (
              <div key={l.id} className="flex items-center justify-between rounded-md border bg-background p-3">
                <div>
                  <div className="text-sm font-medium">{l.ubid}</div>
                  <div className="text-xs text-muted-foreground">{l.officer} • {l.durationMin}min</div>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                  l.status === "live" ? "bg-destructive/15 text-destructive" :
                  l.status === "verified" ? "bg-success/15 text-success" :
                  l.status === "failed" ? "bg-destructive/15 text-destructive" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {l.status === "live" && <span className="h-1.5 w-1.5 rounded-full bg-destructive live-dot" />}
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-gradient-card p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="font-semibold flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive" /> Critical Alerts</div>
              <div className="text-xs text-muted-foreground">{criticalAlerts} critical • {ALERTS.length} total</div>
            </div>
            <Link to="/gov/alerts" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <div className="space-y-2">
            {ALERTS.slice(0, 6).map(a => (
              <div key={a.id} className="flex items-start justify-between gap-3 rounded-md border bg-background p-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{a.legalName}</div>
                  <div className="text-xs text-muted-foreground truncate">{a.message}</div>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                  a.severity === "critical" ? "bg-destructive text-destructive-foreground" :
                  a.severity === "high" ? "bg-warning text-warning-foreground" :
                  "bg-muted text-muted-foreground"
                }`}>{a.severity}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4">
        <Card className="bg-gradient-hero relative overflow-hidden p-6 text-primary-foreground shadow-elegant">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold"><GitMerge className="h-4 w-4" /> ER Review Queue</div>
              <div className="mt-1 text-2xl font-bold">60 candidate pairs awaiting human review</div>
              <div className="text-sm text-primary-foreground/80">Precision-first: ambiguous cases never auto-merge.</div>
            </div>
            <Link to="/gov/review"><Button variant="secondary">Open Review Queue</Button></Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
