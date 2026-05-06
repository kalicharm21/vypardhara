import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LIVE_SESSIONS, BUSINESSES } from "@/lib/mockData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Radio, MapPin, Camera, CheckCircle2, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/gov/livelink")({
  component: LiveLink,
});

function LiveLink() {
  const live = LIVE_SESSIONS.filter(s => s.status === "live");
  const [selected, setSelected] = useState(live[0]?.id ?? LIVE_SESSIONS[0].id);
  const session = LIVE_SESSIONS.find(s => s.id === selected)!;
  const business = BUSINESSES.find(b => b.ubid === session.ubid)!;
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl flex items-center gap-3">
        <Radio className="h-6 w-6 text-destructive" />
        LiveLink Verification Feeds
      </h1>
      <p className="text-sm text-muted-foreground">Real-time, GPS-stamped video verification of business premises.</p>

      <div className="mt-5 grid gap-4 lg:grid-cols-[280px_1fr]">
        {/* sessions list */}
        <Card className="overflow-hidden shadow-soft">
          <div className="border-b bg-secondary px-3 py-2 text-xs font-semibold uppercase tracking-wider">All Sessions</div>
          <div className="max-h-[70vh] overflow-auto">
            {LIVE_SESSIONS.map(s => (
              <button key={s.id} onClick={() => setSelected(s.id)}
                className={`flex w-full items-center justify-between gap-2 border-b px-3 py-2.5 text-left text-sm transition-colors ${selected === s.id ? "bg-primary/10" : "hover:bg-muted/40"}`}>
                <div className="min-w-0">
                  <div className="font-mono text-xs text-muted-foreground">{s.ubid}</div>
                  <div className="truncate text-xs">{s.officer}</div>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                  s.status === "live" ? "bg-destructive/15 text-destructive" :
                  s.status === "verified" ? "bg-success/15 text-success" :
                  s.status === "failed" ? "bg-destructive/15 text-destructive" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {s.status === "live" && <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-destructive live-dot" />}
                  {s.status}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* viewer */}
        <div className="space-y-4">
          <Card className="overflow-hidden shadow-elegant">
            <div className="relative aspect-video w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
              {/* fake CCTV overlay */}
              <div className="absolute inset-0 opacity-40 mix-blend-overlay shimmer" />
              <div className="absolute inset-0 grid place-items-center text-white/40">
                <div className="text-center">
                  <Camera className="mx-auto h-16 w-16" />
                  <div className="mt-2 text-sm">Live feed — premises camera 01</div>
                </div>
              </div>
              <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-destructive/90 px-2.5 py-1 text-xs font-semibold text-destructive-foreground backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-white live-dot" /> LIVE
              </div>
              <div className="absolute right-3 top-3 rounded-md bg-black/50 px-2 py-1 font-mono text-xs text-white">
                {new Date(Date.now() - tick * 1000).toLocaleTimeString()}
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-xs text-white">
                <div className="rounded-md bg-black/50 px-2 py-1 font-mono">
                  GPS {business.lat.toFixed(4)}°N, {business.lng.toFixed(4)}°E
                </div>
                <div className="rounded-md bg-black/50 px-2 py-1">{session.ubid}</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4">
              <div>
                <div className="font-semibold">{business.legalName}</div>
                <div className="text-xs text-muted-foreground">{business.address}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => toast.success("Screenshot captured & GPS stamped")}>
                  <Camera className="mr-1 h-3.5 w-3.5" /> Capture
                </Button>
                <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90"
                  onClick={() => toast.success("Session marked Verified. Activity Engine updated.")}>
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Mark Verified
                </Button>
                <Button size="sm" variant="destructive" onClick={() => toast.error("Session marked Failed. Compliance flag raised.")}>
                  <XCircle className="mr-1 h-3.5 w-3.5" /> Fail
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-4 shadow-soft">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> Duration
              </div>
              <div className="mt-1 text-2xl font-bold">{session.durationMin} min</div>
            </Card>
            <Card className="p-4 shadow-soft">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> GPS Match
              </div>
              <div className={`mt-1 text-2xl font-bold ${session.gpsMatch ? "text-success" : "text-destructive"}`}>
                {session.gpsMatch ? "Match" : "Mismatch"}
              </div>
            </Card>
            <Card className="p-4 shadow-soft">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Camera className="h-3.5 w-3.5" /> Screenshots
              </div>
              <div className="mt-1 text-2xl font-bold">{session.screenshots}</div>
            </Card>
          </div>

          <Card className="p-5 shadow-soft">
            <div className="mb-2 font-semibold">Session Details</div>
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div><div className="text-xs text-muted-foreground">Officer</div><div>{session.officer}</div></div>
              <div><div className="text-xs text-muted-foreground">Representative</div><div>{session.representative}</div></div>
              <div><div className="text-xs text-muted-foreground">Started</div><div>{session.startedAt}</div></div>
              <div><div className="text-xs text-muted-foreground">UBID</div><div className="font-mono text-xs">{session.ubid}</div></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
