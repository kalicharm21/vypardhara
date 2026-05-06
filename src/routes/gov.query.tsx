import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BUSINESSES } from "@/lib/mockData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, Building2 } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

export const Route = createFileRoute("/gov/query")({
  component: QueryConsole,
});

const PRESETS = [
  "Active factories in PIN 560058 with no inspection in the last 18 months",
  "Shell-suspect businesses in Bengaluru Urban",
  "Businesses without VyaparCard in Mysuru",
  "Top 10 districts by dormant businesses",
  "Pharma sector businesses with activity score > 80",
];

type Filter = (b: typeof BUSINESSES[number]) => boolean;
function parse(q: string): { description: string; filter: Filter } {
  const s = q.toLowerCase();
  const filters: Filter[] = [];
  const desc: string[] = [];
  const pin = s.match(/\b(\d{6})\b/);
  if (pin) { filters.push(b => b.pincode === pin[1]); desc.push(`PIN ${pin[1]}`); }
  if (s.includes("active") && !s.includes("not active")) { filters.push(b => b.status === "active"); desc.push("active"); }
  if (s.includes("dormant")) { filters.push(b => b.status === "dormant"); desc.push("dormant"); }
  if (s.includes("shell")) { filters.push(b => b.status === "shell-suspect"); desc.push("shell-suspect"); }
  if (s.includes("factor")) { filters.push(b => b.category === "Factory"); desc.push("category: Factory"); }
  if (s.includes("without vyaparcard") || s.includes("no card")) { filters.push(b => !b.vyaparCardIssued); desc.push("no VyaparCard"); }
  const months = s.match(/(\d+)\s*months?/);
  if (months && (s.includes("no inspection") || s.includes("not inspected"))) {
    const n = parseInt(months[1]);
    filters.push(b => b.monthsSinceInspection >= n);
    desc.push(`no inspection ≥ ${n} months`);
  }
  for (const sector of ["Pharma", "Textiles", "Manufacturing", "Food Processing", "Chemicals", "Engineering", "IT Services", "Logistics", "Retail", "Agriculture"]) {
    if (s.includes(sector.toLowerCase())) { filters.push(b => b.sector === sector); desc.push(sector); }
  }
  for (const district of ["Bengaluru Urban", "Mysuru", "Mangaluru", "Hubballi", "Belagavi", "Tumakuru", "Kalaburagi"]) {
    if (s.includes(district.toLowerCase())) { filters.push(b => b.district === district); desc.push(district); }
  }
  const scoreMatch = s.match(/score\s*[>≥]\s*(\d+)/);
  if (scoreMatch) { const n = +scoreMatch[1]; filters.push(b => b.activityScore > n); desc.push(`score > ${n}`); }
  return {
    description: desc.length ? desc.join(" • ") : "All businesses",
    filter: (b) => filters.every(f => f(b)),
  };
}

function QueryConsole() {
  const [q, setQ] = useState(PRESETS[0]);
  const [submitted, setSubmitted] = useState(PRESETS[0]);
  const { description, filter } = useMemo(() => parse(submitted), [submitted]);
  const results = useMemo(() => BUSINESSES.filter(filter), [filter]);

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-primary" /> Natural-language Query Console
      </div>
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Ask the system</h1>
      <p className="text-sm text-muted-foreground">The query the problem statement said was impossible — answered in seconds.</p>

      <Card className="mt-5 bg-gradient-card p-5 shadow-soft">
        <form
          onSubmit={(e) => { e.preventDefault(); setSubmitted(q); }}
          className="flex flex-col gap-3 md:flex-row"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g., Active factories in PIN 560058 with no inspection in 18 months"
              className="h-11 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button type="submit" size="lg">Run Query</Button>
        </form>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {PRESETS.map(p => (
            <button key={p} onClick={() => { setQ(p); setSubmitted(p); }}
              className="rounded-full border bg-background px-3 py-1 text-xs hover:bg-accent">{p}</button>
          ))}
        </div>
      </Card>

      <div className="mt-5 flex items-center justify-between">
        <div className="text-sm">
          <span className="font-semibold">{results.length}</span> result{results.length === 1 ? "" : "s"}
          <span className="ml-2 text-muted-foreground">— {description}</span>
        </div>
      </div>

      <Card className="mt-3 overflow-hidden shadow-soft">
        <div className="max-h-[60vh] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-secondary text-secondary-foreground">
              <tr className="text-left">
                <th className="px-4 py-2 font-medium">UBID</th>
                <th className="px-4 py-2 font-medium">Business</th>
                <th className="px-4 py-2 font-medium">PIN</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Last Insp.</th>
                <th className="px-4 py-2 font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {results.slice(0, 150).map(b => (
                <tr key={b.ubid} className="border-t hover:bg-muted/40">
                  <td className="px-4 py-2 font-mono text-xs">
                    <Link to="/gov/businesses/$ubid" params={{ ubid: b.ubid }} className="text-primary hover:underline">{b.ubid}</Link>
                  </td>
                  <td className="px-4 py-2"><div className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5 text-muted-foreground" /> <span>{b.legalName}</span></div><div className="text-xs text-muted-foreground">{b.sector} • {b.district}</div></td>
                  <td className="px-4 py-2 font-mono text-xs">{b.pincode}</td>
                  <td className="px-4 py-2"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-2 text-xs">{b.monthsSinceInspection}mo ago</td>
                  <td className="px-4 py-2">{b.activityScore}</td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">No businesses match this query.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
