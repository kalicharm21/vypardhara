import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DEMO_BUSINESS } from "@/lib/mockData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Download, RefreshCw, ScanLine, Lock, CheckCircle2, Users, Plus, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/business/card")({
  component: VyaparCardPage,
});

type Delegate = { id: string; name: string; role: string; expires: string };

function VyaparCardPage() {
  const b = DEMO_BUSINESS;
  const [flipped, setFlipped] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<null | { ok: boolean; ts: string }>(null);
  const [delegates, setDelegates] = useState<Delegate[]>([
    { id: "DLG-A91F", name: "Priya Menon", role: "Site Manager", expires: "2026-08-12" },
    { id: "DLG-7C2B", name: "Ravi Kumar", role: "Authorised Auditor", expires: "2026-06-30" },
  ]);

  const simulateScan = () => {
    setScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setScanning(false);
      setScanResult({ ok: true, ts: new Date().toLocaleTimeString() });
      toast.success("Card verified against UBID registry");
    }, 1600);
  };

  const addDelegate = () => {
    const d: Delegate = {
      id: `DLG-${Math.random().toString(16).slice(2, 6).toUpperCase()}`,
      name: "New Delegate", role: "Site Manager", expires: "2026-12-31",
    };
    setDelegates([...delegates, d]);
    toast.success(`Delegate ${d.id} issued`);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Layer 2 — Physical Identity
      </div>
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">VyaparCard</h1>
      <p className="text-sm text-muted-foreground">Tamper-evident physical and digital business credential.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[auto_1fr]">
        {/* Interactive flip card */}
        <div className="w-full max-w-md">
          <div
            className="relative w-full cursor-pointer aspect-[1.6/1] [perspective:1500px]"
            onClick={() => setFlipped(f => !f)}
            role="button"
            tabIndex={0}
            aria-label="Flip card"
          >
            <div
              className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]"
              style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
            >
              {/* Front */}
              <div className="absolute inset-0 [backface-visibility:hidden]">
                <div className="bg-gradient-hero relative h-full w-full overflow-hidden rounded-2xl p-6 text-primary-foreground shadow-elegant">
                  <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_80%_-10%,oklch(1_0_0/0.4),transparent_50%)]" />
                  <div className="absolute right-3 top-3 rounded-md bg-primary-foreground/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
                    Govt of Karnataka
                  </div>
                  <div className="relative flex h-full flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-80">
                        <ShieldCheck className="h-4 w-4" /> VyaparCard
                      </div>
                      <div className="mt-2 text-lg font-bold leading-tight">{b.tradeName}</div>
                      <div className="text-xs opacity-80">{b.legalName}</div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider opacity-70">UBID</div>
                        <div className="font-mono text-sm font-bold">{b.ubid}</div>
                      </div>
                      <div className="grid h-16 w-16 grid-cols-6 grid-rows-6 gap-px rounded-md bg-primary-foreground p-1">
                        {Array.from({ length: 36 }).map((_, i) => (
                          <div key={i} className={`${(i * 7 + 13) % 3 === 0 ? "bg-primary" : "bg-transparent"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Back */}
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <div className="relative h-full w-full overflow-hidden rounded-2xl border bg-card p-5 shadow-elegant">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Card Back</div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                    <Row k="Serial" v="VC-7F2A1C9D" />
                    <Row k="Issued" v={b.cardIssuedOn || "2025-09-12"} />
                    <Row k="Expires" v="2026-09-11" />
                    <Row k="Tier" v={b.complianceTier} />
                  </div>
                  <div className="mt-3 rounded-md border bg-muted/30 p-2 font-mono text-[9px] leading-tight text-muted-foreground">
                    ECDSA-P256 sig:<br />
                    304502210098f3a4c1b87e2d5c…7c2b9f4e8d3a1c6e0a9b<br />
                    Issued by: KCID-Authority-01
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Lock className="h-3 w-3" /> Tamper-evident hologram • Verified offline
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => setFlipped(f => !f)}>
              <RefreshCw className="mr-1 h-3.5 w-3.5" /> Flip card
            </Button>
            <Button size="sm" variant="outline" onClick={() => toast.success("Card downloaded as PDF")}>
              <Download className="mr-1 h-3.5 w-3.5" /> Download
            </Button>
            <Button size="sm" onClick={simulateScan} disabled={scanning}>
              <ScanLine className="mr-1 h-3.5 w-3.5" /> {scanning ? "Verifying…" : "Simulate scan"}
            </Button>
          </div>

          {/* Scan result panel */}
          <Card className="mt-4 p-4 shadow-soft">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>Scan verification</span>
              {scanResult && (
                <span className="inline-flex items-center gap-1 text-xs text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" /> verified
                </span>
              )}
            </div>
            {scanning && (
              <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                <ScanRow label="Reading QR payload" />
                <ScanRow label="Decoding JWT envelope" />
                <ScanRow label="Verifying ECDSA signature" />
                <ScanRow label="Looking up UBID in registry" />
              </div>
            )}
            {!scanning && scanResult && (
              <div className="mt-3 grid gap-1 text-xs">
                <KV k="UBID" v={b.ubid} />
                <KV k="Serial" v="VC-7F2A1C9D" />
                <KV k="Signature" v="valid (P-256)" />
                <KV k="Scanned at" v={scanResult.ts} />
              </div>
            )}
            {!scanning && !scanResult && (
              <div className="mt-2 text-xs text-muted-foreground">
                Click <em>Simulate scan</em> to see what an officer sees.
              </div>
            )}
          </Card>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <Card className="p-5 shadow-soft">
            <div className="mb-3 font-semibold">Card Details</div>
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <Detail label="UBID" value={b.ubid} mono />
              <Detail label="PAN" value={b.pan} mono />
              <Detail label="GSTIN" value={b.gstin} mono />
              <Detail label="Issued On" value={b.cardIssuedOn || "2025-09-12"} />
              <Detail label="Status" value="Active — tamper seal intact" />
              <Detail label="Authorised Signatory" value="Mr. Anil Sharma" />
            </div>
          </Card>

          <Card className="p-5 shadow-soft">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-semibold flex items-center gap-2"><Users className="h-4 w-4" /> Delegates ({delegates.length})</div>
              <Button size="sm" variant="outline" onClick={addDelegate}><Plus className="mr-1 h-3.5 w-3.5" /> Issue delegate</Button>
            </div>
            <div className="space-y-2">
              {delegates.map(d => (
                <div key={d.id} className="flex items-center justify-between rounded-md border bg-background p-3 text-sm">
                  <div>
                    <div className="font-medium">{d.name}</div>
                    <div className="text-xs text-muted-foreground">{d.role} • expires {d.expires}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground">{d.id}</span>
                    <Button size="icon" variant="ghost" onClick={() => { setDelegates(delegates.filter(x => x.id !== d.id)); toast.success(`Revoked ${d.id}`); }}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">Delegates carry short-lived sub-credentials bound to this UBID, with scoped permissions and instant revocation.</div>
          </Card>

          <Card className="p-5 shadow-soft">
            <div className="mb-3 font-semibold">How VyaparCard works</div>
            <ol className="space-y-2 text-sm">
              <Step n={1}>Present the card during any government interaction — renewals, inspections, signatory changes.</Step>
              <Step n={2}>Officer scans the QR. The digital token verifies against your UBID in real time.</Step>
              <Step n={3}>Tamper-evident seal triggers automatic alerts on unauthorised handling.</Step>
              <Step n={4}>Every scan is logged in the audit trail and visible in the Government Portal.</Step>
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={mono ? "font-mono text-sm" : "text-sm"}>{value}</div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="rounded-md border bg-muted/30 px-2 py-1"><div className="text-[9px] uppercase text-muted-foreground">{k}</div><div className="font-medium">{v}</div></div>;
}
function KV({ k, v }: { k: string; v: string }) {
  return <div className="flex items-center justify-between border-b py-1 last:border-0"><span className="text-muted-foreground">{k}</span><span className="font-mono">{v}</span></div>;
}
function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return <li className="flex gap-3"><span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">{n}</span><span>{children}</span></li>;
}
function ScanRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
      {label}…
    </div>
  );
}
