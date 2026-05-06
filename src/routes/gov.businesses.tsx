import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BUSINESSES, type BusinessStatus } from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { StatusBadge, TierBadge } from "@/components/StatusBadge";
import { Search } from "lucide-react";

export const Route = createFileRoute("/gov/businesses")({
  component: Directory,
});

function Directory() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<BusinessStatus | "all">("all");
  const [pin, setPin] = useState("");
  const filtered = useMemo(() => {
    return BUSINESSES.filter(b => {
      if (status !== "all" && b.status !== status) return false;
      if (pin && !b.pincode.includes(pin)) return false;
      if (q) {
        const t = q.toLowerCase();
        return b.legalName.toLowerCase().includes(t) ||
          b.tradeName.toLowerCase().includes(t) ||
          b.ubid.toLowerCase().includes(t) ||
          b.pan.toLowerCase().includes(t);
      }
      return true;
    });
  }, [q, status, pin]);

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Business Directory</h1>
      <p className="text-sm text-muted-foreground">{filtered.length} of {BUSINESSES.length} businesses</p>

      <Card className="mt-5 p-4 shadow-soft">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_140px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search UBID, name, PAN…" className="pl-9" />
          </div>
          <select className="h-9 rounded-md border bg-background px-3 text-sm" value={status} onChange={e => setStatus(e.target.value as BusinessStatus | "all")}>
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="dormant">Dormant</option>
            <option value="shell-suspect">Shell Suspect</option>
            <option value="closed">Closed</option>
            <option value="unverified">Unverified</option>
          </select>
          <Input value={pin} onChange={e => setPin(e.target.value)} placeholder="PIN code" />
        </div>
      </Card>

      <Card className="mt-4 overflow-hidden shadow-soft">
        <div className="max-h-[65vh] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-secondary text-secondary-foreground">
              <tr className="text-left">
                <th className="px-4 py-2 font-medium">UBID</th>
                <th className="px-4 py-2 font-medium">Legal Name</th>
                <th className="px-4 py-2 font-medium">Sector</th>
                <th className="px-4 py-2 font-medium">PIN</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Tier</th>
                <th className="px-4 py-2 font-medium">Activity</th>
                <th className="px-4 py-2 font-medium">Last Insp.</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 200).map(b => (
                <tr key={b.ubid} className="border-t hover:bg-muted/40">
                  <td className="px-4 py-2 font-mono text-xs">
                    <Link to="/gov/businesses/$ubid" params={{ ubid: b.ubid }} className="text-primary hover:underline">{b.ubid}</Link>
                  </td>
                  <td className="px-4 py-2">
                    <div className="font-medium">{b.legalName}</div>
                    <div className="text-xs text-muted-foreground">{b.district}</div>
                  </td>
                  <td className="px-4 py-2">{b.sector}</td>
                  <td className="px-4 py-2 font-mono text-xs">{b.pincode}</td>
                  <td className="px-4 py-2"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-2"><TierBadge tier={b.complianceTier} /></td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${b.activityScore}%` }} />
                      </div>
                      <span className="text-xs">{b.activityScore}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">{b.monthsSinceInspection}mo ago</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 200 && (
          <div className="border-t bg-muted/30 px-4 py-2 text-center text-xs text-muted-foreground">
            Showing first 200 results. Refine filters to narrow.
          </div>
        )}
      </Card>
    </div>
  );
}
