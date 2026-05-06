import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { FileText, GitMerge, Radio, IdCard, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/gov/audit")({
  component: Audit,
});

const LOG = [
  { t: "2026-05-04 09:42", who: "Insp. R. Iyer", action: "Confirmed merge", target: "PAIR-0023 → UBID-KA-000168", icon: GitMerge },
  { t: "2026-05-04 09:31", who: "System", action: "Auto-merge committed", target: "PAIR-0019 (composite 0.92)", icon: GitMerge },
  { t: "2026-05-04 09:18", who: "Insp. S. Patil", action: "LiveLink session verified", target: "UBID-KA-000412", icon: Radio },
  { t: "2026-05-04 08:55", who: "System", action: "Card issued", target: "UBID-KA-000497", icon: IdCard },
  { t: "2026-05-04 08:21", who: "Insp. M. Hegde", action: "Inspection logged (pass)", target: "UBID-KA-000051", icon: ShieldCheck },
  { t: "2026-05-03 18:04", who: "Insp. K. Rao", action: "Rejected merge", target: "PAIR-0011 (false positive)", icon: GitMerge },
  { t: "2026-05-03 17:30", who: "System", action: "Activity score recomputed", target: "82 businesses", icon: FileText },
  { t: "2026-05-03 16:11", who: "Insp. P. Shetty", action: "LiveLink session failed", target: "UBID-KA-000088 (GPS mismatch)", icon: Radio },
];

function Audit() {
  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl flex items-center gap-3">
        <FileText className="h-6 w-6 text-primary" /> Audit Trail
      </h1>
      <p className="text-sm text-muted-foreground">Every decision is logged, reversible, and reviewable.</p>

      <Card className="mt-5 p-5 shadow-soft">
        <ol className="relative ml-3 space-y-5 border-l pl-6">
          {LOG.map((l, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[34px] top-0 flex h-6 w-6 items-center justify-center rounded-full border bg-background">
                <l.icon className="h-3 w-3 text-primary" />
              </span>
              <div className="text-xs text-muted-foreground">{l.t} • {l.who}</div>
              <div className="text-sm font-medium">{l.action}</div>
              <div className="text-xs text-muted-foreground">{l.target}</div>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
