import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/business/submit")({
  component: SubmitForm,
});

function SubmitForm() {
  const [type, setType] = useState("renewal");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Submit / Renew</h1>
      <p className="text-sm text-muted-foreground">A single submission propagates to all linked departments via your UBID.</p>

      {submitted ? (
        <Card className="bg-gradient-card mt-6 p-8 shadow-soft">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-12 w-12 text-success" />
            <div>
              <div className="text-xl font-bold">Submission Received</div>
              <div className="text-sm text-muted-foreground">Reference: VYP-2026-{Math.floor(Math.random() * 100000)}</div>
            </div>
          </div>
          <div className="mt-6 space-y-2 text-sm">
            <Step ok label="Routed to Labour Dept" />
            <Step ok label="Routed to Factories Dept" />
            <Step ok label="Routed to KSPCB" />
            <Step ok={false} label="Awaiting Officer Review" />
          </div>
          <Button className="mt-6" onClick={() => setSubmitted(false)}>New Submission</Button>
        </Card>
      ) : (
        <Card className="mt-6 p-6 shadow-soft max-w-2xl">
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Submission filed"); setSubmitted(true); }} className="space-y-5">
            <div>
              <Label>Submission Type</Label>
              <select value={type} onChange={e => setType(e.target.value)} className="mt-1.5 h-10 w-full rounded-md border bg-background px-3 text-sm">
                <option value="renewal">Annual Renewal</option>
                <option value="signatory">Authorised Signatory Update</option>
                <option value="address">Address Change</option>
                <option value="closure">Closure Notice</option>
                <option value="return">Periodic Return</option>
              </select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="period">Period</Label>
                <Input id="period" defaultValue="FY 2025-26" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="file">Supporting Document</Label>
                <Input id="file" type="file" className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <textarea id="notes" rows={4} className="mt-1.5 w-full rounded-md border bg-background p-3 text-sm" placeholder="Add any context for the reviewing officer…" />
            </div>
            <div className="rounded-md border bg-secondary/40 p-3 text-xs text-muted-foreground">
              <FileCheck className="mb-1 inline h-3.5 w-3.5" /> By submitting, you authorise routing to all linked departments under your UBID. A VyaparCard scan or LiveLink session may be required to complete this filing.
            </div>
            <Button type="submit" size="lg">Submit Filing</Button>
          </form>
        </Card>
      )}
    </div>
  );
}

function Step({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border bg-background p-3">
      <div className={`h-2 w-2 rounded-full ${ok ? "bg-success" : "bg-warning live-dot"}`} />
      <span>{label}</span>
      {!ok && <span className="ml-auto text-xs text-muted-foreground">In progress</span>}
    </div>
  );
}
