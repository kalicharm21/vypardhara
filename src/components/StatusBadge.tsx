import { cn } from "@/lib/utils";
import type { BusinessStatus, ComplianceTier } from "@/lib/mockData";

export function StatusBadge({ status }: { status: BusinessStatus }) {
  const map: Record<BusinessStatus, { label: string; cls: string }> = {
    active: { label: "Active", cls: "bg-success/15 text-success border-success/30" },
    dormant: { label: "Dormant", cls: "bg-warning/15 text-warning-foreground border-warning/40" },
    "shell-suspect": { label: "Shell Suspect", cls: "bg-destructive/15 text-destructive border-destructive/30" },
    closed: { label: "Closed", cls: "bg-muted text-muted-foreground border-border" },
    unverified: { label: "Unverified", cls: "bg-info/15 text-info border-info/30" },
  };
  const m = map[status];
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", m.cls)}>
      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {m.label}
    </span>
  );
}

export function TierBadge({ tier }: { tier: ComplianceTier }) {
  const map: Record<ComplianceTier, string> = {
    A: "bg-success text-success-foreground",
    B: "bg-info text-info-foreground",
    C: "bg-warning text-warning-foreground",
    D: "bg-destructive text-destructive-foreground",
  };
  return (
    <span className={cn("inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold", map[tier])}>
      {tier}
    </span>
  );
}
