import { createFileRoute } from "@tanstack/react-router";
import { BUSINESSES, districtBreakdown } from "@/lib/mockData";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/gov/map")({
  component: GeoMap,
});

function GeoMap() {
  const districts = districtBreakdown();
  const [hover, setHover] = useState<string | null>(null);

  // simple bbox for Karnataka
  const minLat = 11.5, maxLat = 18.5, minLng = 74, maxLng = 78.5;
  const project = (lat: number, lng: number) => ({
    x: ((lng - minLng) / (maxLng - minLng)) * 100,
    y: ((maxLat - lat) / (maxLat - minLat)) * 100,
  });

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl flex items-center gap-3">
        <MapPin className="h-6 w-6 text-primary" /> Geo-Heatmap
      </h1>
      <p className="text-sm text-muted-foreground">Spatial distribution of registered businesses across Karnataka</p>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="bg-gradient-card overflow-hidden p-4 shadow-soft">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-secondary/40">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,oklch(0.65_0.14_230/0.15),transparent_70%)]" />
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              <rect x="0" y="0" width="100" height="100" fill="transparent" />
              {/* Karnataka outline approximation */}
              <path d="M 22 8 Q 35 6, 48 12 L 62 18 Q 70 28, 68 40 L 72 55 Q 70 70, 60 82 L 48 92 Q 35 90, 28 80 L 18 65 Q 12 50, 16 35 Z"
                fill="oklch(0.45 0.18 255 / 0.06)" stroke="oklch(0.45 0.18 255 / 0.4)" strokeWidth="0.3" />
              {BUSINESSES.map(b => {
                const p = project(b.lat, b.lng);
                const color = b.status === "active" ? "var(--success)" : b.status === "shell-suspect" ? "var(--destructive)" : b.status === "dormant" ? "var(--warning)" : "var(--muted-foreground)";
                return (
                  <circle key={b.ubid} cx={p.x} cy={p.y} r={0.5} fill={color} opacity={0.6} />
                );
              })}
            </svg>
            <div className="absolute bottom-3 left-3 rounded-md border bg-background/90 p-2 text-xs backdrop-blur">
              <div className="font-semibold mb-1">Legend</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" /> Active</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning" /> Dormant</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-destructive" /> Shell-suspect</div>
            </div>
          </div>
        </Card>

        <Card className="p-5 shadow-soft">
          <div className="mb-3 font-semibold">District Breakdown</div>
          <div className="space-y-3">
            {districts.map(d => {
              const total = d.active + d.dormant + d.shell;
              return (
                <div key={d.district}
                  onMouseEnter={() => setHover(d.district)} onMouseLeave={() => setHover(null)}
                  className={`rounded-md border p-3 transition-colors ${hover === d.district ? "bg-accent" : "bg-background"}`}>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{d.district}</div>
                    <div className="text-xs text-muted-foreground">{total}</div>
                  </div>
                  <div className="mt-2 flex h-1.5 w-full overflow-hidden rounded-full">
                    <div className="bg-success" style={{ width: `${(d.active / total) * 100}%` }} />
                    <div className="bg-warning" style={{ width: `${(d.dormant / total) * 100}%` }} />
                    <div className="bg-destructive" style={{ width: `${(d.shell / total) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
