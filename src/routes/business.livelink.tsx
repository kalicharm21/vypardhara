import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DEMO_BUSINESS } from "@/lib/mockData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Radio, Camera, MapPin, CheckCircle2, Phone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/business/livelink")({
  component: LiveLinkBiz,
});

type Phase = "ready" | "preflight" | "live" | "complete";

function LiveLinkBiz() {
  const b = DEMO_BUSINESS;
  const [phase, setPhase] = useState<Phase>("ready");
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (phase !== "live") return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const start = () => {
    setPhase("preflight");
    toast.info("Pre-flight checks running…");
    setTimeout(() => {
      setPhase("live");
      setSeconds(0);
      toast.success("LiveLink active. Officer Insp. R. Iyer has joined.");
    }, 1800);
  };
  const end = () => {
    setPhase("complete");
    toast.success("Session ended. Verification report being generated.");
  };

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl flex items-center gap-3">
        <Radio className="h-6 w-6 text-destructive" /> LiveLink Session
      </h1>
      <p className="text-sm text-muted-foreground">Live, GPS-stamped video verification of your premises.</p>

      {phase === "ready" && (
        <Card className="bg-gradient-card mt-6 p-8 shadow-soft">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold">Start a verification session</h2>
            <p className="mt-2 text-sm text-muted-foreground">Use LiveLink when neither your authorised signatory nor a delegate can physically attend an inspection. The session is recorded, GPS-stamped, and reviewed by an authorised officer in real-time.</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Step n={1} title="Pre-flight" desc="Camera, mic & GPS check" />
              <Step n={2} title="Live verification" desc="Officer guides you through premises" />
              <Step n={3} title="Auto report" desc="Verification report generated & logged" />
            </div>

            <Button size="lg" className="mt-6" onClick={start}>
              <Radio className="mr-2 h-4 w-4" /> Begin LiveLink Session
            </Button>
          </div>
        </Card>
      )}

      {phase === "preflight" && (
        <Card className="mt-6 p-8 shadow-soft text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <div className="mt-4 font-semibold">Running pre-flight checks…</div>
          <div className="mt-1 text-sm text-muted-foreground">Camera • Microphone • GPS • Connecting to officer</div>
        </Card>
      )}

      {phase === "live" && (
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_300px]">
          <Card className="overflow-hidden shadow-elegant">
            <div className="relative aspect-video w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
              <div className="absolute inset-0 opacity-40 mix-blend-overlay shimmer" />
              <div className="absolute inset-0 grid place-items-center text-white/40">
                <div className="text-center">
                  <Camera className="mx-auto h-16 w-16" />
                  <div className="mt-2 text-sm">Your camera • Live to officer</div>
                </div>
              </div>
              <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-destructive/90 px-2.5 py-1 text-xs font-semibold text-destructive-foreground backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-white live-dot" /> LIVE • {fmt(seconds)}
              </div>
              <div className="absolute right-3 top-3 rounded-md bg-black/50 px-2 py-1 font-mono text-xs text-white">
                GPS {b.lat.toFixed(4)},{b.lng.toFixed(4)}
              </div>
            </div>
            <div className="flex items-center justify-between border-t p-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-success" />
                Connected to <span className="font-semibold">Insp. R. Iyer</span>
              </div>
              <Button variant="destructive" onClick={end}>End Session</Button>
            </div>
          </Card>
          <div className="space-y-3">
            <Card className="p-4 shadow-soft">
              <div className="text-xs font-medium uppercase text-muted-foreground">Officer's Instruction</div>
              <div className="mt-1 text-sm">"Please walk to the production floor and show the machinery in operation."</div>
            </Card>
            <Card className="p-4 shadow-soft">
              <div className="text-xs font-medium uppercase text-muted-foreground">Auto-checks</div>
              <ul className="mt-2 space-y-1 text-sm">
                <Check label="GPS matches registered address" ok />
                <Check label="Camera continuous (no cuts)" ok />
                <Check label="Audio active" ok />
                <Check label="Screenshots: 3 captured" ok />
              </ul>
            </Card>
            <Card className="p-4 shadow-soft">
              <Button variant="outline" size="sm" className="w-full"><Phone className="mr-2 h-3.5 w-3.5" /> Call Support</Button>
            </Card>
          </div>
        </div>
      )}

      {phase === "complete" && (
        <Card className="bg-gradient-card mt-6 p-8 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xl font-bold">Session Verified</div>
              <div className="text-sm text-muted-foreground">Activity Engine has been updated with this verification signal.</div>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ReportRow label="Session ID" value="LL-2026-05-04-1023" />
            <ReportRow label="Duration" value={fmt(seconds || 312)} />
            <ReportRow label="GPS Match" value="✓ Match" />
            <ReportRow label="Outcome" value="Verified" />
            <ReportRow label="Officer" value="Insp. R. Iyer" />
            <ReportRow label="Screenshots" value="11 GPS-stamped" />
          </div>
          <Button className="mt-6" onClick={() => setPhase("ready")}>Done</Button>
        </Card>
      )}
    </div>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="rounded-md border bg-background p-4">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{n}</div>
      <div className="mt-2 font-semibold">{title}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </div>
  );
}
function Check({ label, ok }: { label: string; ok: boolean }) {
  return <li className="flex items-center gap-2"><CheckCircle2 className={`h-3.5 w-3.5 ${ok ? "text-success" : "text-muted-foreground"}`} /> {label}</li>;
}
function ReportRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background p-3">
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
function fmt(sec: number) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
