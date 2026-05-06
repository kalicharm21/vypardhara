import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { REVIEW_PAIRS, type ReviewPair } from "@/lib/mockData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitMerge, X, Eye, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/gov/review")({
  component: ReviewQueue,
});

function ReviewQueue() {
  const [pairs, setPairs] = useState<ReviewPair[]>(REVIEW_PAIRS);
  const [filter, setFilter] = useState<"all" | "pending" | "auto-merge" | "review">("pending");

  const filtered = pairs.filter(p => {
    if (filter === "all") return true;
    if (filter === "pending") return p.status === "pending";
    return p.suggestedAction === filter && p.status === "pending";
  });

  const act = (id: string, status: ReviewPair["status"], msg: string) => {
    setPairs(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    toast.success(msg);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <ShieldAlert className="h-3.5 w-3.5 text-primary" /> Precision-First Review
      </div>
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Entity Resolution Queue</h1>
      <p className="text-sm text-muted-foreground">Wrong merges are catastrophic. Ambiguous pairs never auto-commit.</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {(["pending", "auto-merge", "review", "all"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-accent"
            }`}>{f}</button>
        ))}
      </div>

      <div className="mt-5 grid gap-4">
        {filtered.map(p => (
          <Card key={p.id} className="bg-gradient-card p-5 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">{p.id}</span>
                <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase ${
                  p.suggestedAction === "auto-merge" ? "bg-success/15 text-success" :
                  p.suggestedAction === "review" ? "bg-warning/20 text-warning-foreground" :
                  "bg-muted text-muted-foreground"
                }`}>{p.suggestedAction}</span>
                {p.status !== "pending" && (
                  <span className="rounded-md bg-info/15 px-2 py-0.5 text-[11px] font-medium text-info">{p.status}</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Composite:</span>
                <span className="text-base font-bold tabular-nums">{p.scores.composite.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <RecordCard label="Record A" r={p.recordA} />
              <RecordCard label="Record B" r={p.recordB} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Score label="Name" v={p.scores.name} weight={0.2} />
              <Score label="Address" v={p.scores.address} weight={0.2} />
              <Score label="PAN/GSTIN" v={p.scores.pan} weight={0.5} />
              <Score label="Intra-dept" v={p.scores.intra} weight={0.1} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" disabled={p.status !== "pending"} onClick={() => act(p.id, "merged", "Pair merged into single UBID. Decision logged.")}>
                <GitMerge className="mr-1 h-3.5 w-3.5" /> Confirm Merge
              </Button>
              <Button size="sm" variant="outline" disabled={p.status !== "pending"} onClick={() => act(p.id, "rejected", "Pair rejected. Recorded as training signal.")}>
                <X className="mr-1 h-3.5 w-3.5" /> Reject
              </Button>
              <Button size="sm" variant="ghost" disabled={p.status !== "pending"} onClick={() => act(p.id, "split", "Marked for split review.")}>
                <Eye className="mr-1 h-3.5 w-3.5" /> Defer / Split
              </Button>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card className="p-10 text-center text-sm text-muted-foreground">No pairs in this filter.</Card>
        )}
      </div>
    </div>
  );
}

function RecordCard({ label, r }: { label: string; r: { dept: string; name: string; address: string; pan?: string } }) {
  return (
    <div className="rounded-md border bg-background p-3">
      <div className="mb-1 flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium">{r.dept}</span>
      </div>
      <div className="font-medium">{r.name}</div>
      <div className="text-xs text-muted-foreground">{r.address}</div>
      {r.pan && <div className="mt-1 font-mono text-xs">{r.pan}</div>}
    </div>
  );
}

function Score({ label, v, weight }: { label: string; v: number; weight: number }) {
  return (
    <div className="rounded-md border bg-background p-2">
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">w={weight}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${v * 100}%` }} />
      </div>
      <div className="mt-1 text-right text-xs tabular-nums">{v.toFixed(2)}</div>
    </div>
  );
}
