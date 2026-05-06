import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Layers, ShieldCheck, Radio, Building2, ArrowRight, IdCard, GitMerge,
  Activity, Eye, MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { stats } from "@/lib/mockData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VyaparDhara — Unified Business Identity & Live Intelligence" },
      { name: "description", content: "Three-layer platform: UBID entity resolution, VyaparCard physical identity, and LiveLink real-time verification for Karnataka Commerce & Industries." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const s = stats();
  const layers = [
    {
      icon: GitMerge, title: "Layer 1 — UBID Engine",
      desc: "AI-powered entity resolution links records across 40+ department systems. Four-signal similarity (name, address, PAN/GSTIN, intra-dept) with graph clustering and human-in-the-loop review.",
      tag: "Entity Resolution",
    },
    {
      icon: IdCard, title: "Layer 2 — VyaparCard",
      desc: "Tamper-evident physical + digital identity card issued to every verified business. Required for any government interaction. Defeats ghost businesses and shell entities at issuance.",
      tag: "Physical Identity",
    },
    {
      icon: Radio, title: "Layer 3 — LiveLink",
      desc: "Real-time video verification protocol. When physical inspection is impossible, the business streams a GPS-stamped live feed of premises. Connects database truth to physical truth.",
      tag: "Live Verification",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Logo />
          <div className="flex items-center gap-2 text-sm">
            <a href="#layers" className="hidden sm:inline px-3 py-1.5 text-muted-foreground hover:text-foreground">Platform</a>
            <a href="#stats" className="hidden sm:inline px-3 py-1.5 text-muted-foreground hover:text-foreground">Live Stats</a>
            <Link to="/business"><Button variant="ghost" size="sm">Business Login</Button></Link>
            <Link to="/gov"><Button size="sm">Gov Portal <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(1_0_0/0.15),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="max-w-3xl text-primary-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-primary-foreground" /></span>
              AI for Bharat • PAN IIT Bangalore • Theme 1
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Connecting <span className="italic">database truth</span> to <span className="italic">physical truth</span>.
            </h1>
            <p className="mt-5 text-lg/relaxed text-primary-foreground/80 md:text-xl/relaxed">
              VyaparDhara is a three-layer intelligence platform that resolves business identities across 40+ Karnataka department systems, issues a tamper-evident VyaparCard to every verified business, and continuously verifies them through live video feeds.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/gov">
                <Button size="lg" variant="secondary" className="font-semibold">
                  Open Government Portal <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/business">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                  Open Business Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section id="stats" className="border-b">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border md:grid-cols-4">
          {[
            { label: "Businesses Indexed", v: s.total.toLocaleString() },
            { label: "Active (live-verified)", v: s.active.toLocaleString() },
            { label: "VyaparCards Issued", v: s.cards.toLocaleString() },
            { label: "Inspection Backlog", v: s.overdue.toLocaleString() },
          ].map((x) => (
            <div key={x.label} className="bg-background px-6 py-6">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{x.label}</div>
              <div className="mt-1 text-3xl font-bold tracking-tight">{x.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Three layers */}
      <section id="layers" className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold text-primary">The Platform</div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Three layers. One platform.</h2>
          <p className="mt-3 text-muted-foreground">Every other system stops at matching records. We verify the business physically exists and stay continuously connected to its operational reality.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {layers.map((l, i) => (
            <Card key={i} className="bg-gradient-card group relative overflow-hidden p-6 shadow-soft transition-all hover:shadow-elegant">
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/15" />
              <div className="relative">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <l.icon className="h-5 w-5" />
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">{l.tag}</div>
                <h3 className="mt-1 text-lg font-bold">{l.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{l.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Differentiators */}
      <section className="border-t bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">What makes VyaparDhara different</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { i: ShieldCheck, t: "Verifies physical existence", d: "Not just records — we confirm businesses are real, on the ground." },
              { i: Eye, t: "Live, on-demand verification", d: "No more 18-month-old event data. We see it now." },
              { i: Activity, t: "Active = confirmed by video", d: "Status reflects ground truth, not stale paperwork." },
              { i: Building2, t: "40+ department systems", d: "Unified shadow schema. No source system modified." },
              { i: GitMerge, t: "Precision-first ER", d: "A wrong merge is treated as catastrophic, not acceptable." },
              { i: MapPin, t: "Geo & PIN-aware", d: "Answer 'active factories in PIN 560058 with no inspection in 18 months' in seconds." },
            ].map((x, i) => (
              <div key={i} className="rounded-lg border bg-card p-5 shadow-soft">
                <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <x.i className="h-4 w-4" />
                </div>
                <div className="font-semibold">{x.t}</div>
                <div className="mt-1 text-sm text-muted-foreground">{x.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Card className="bg-gradient-hero relative overflow-hidden p-10 text-primary-foreground shadow-elegant">
          <div className="relative max-w-2xl">
            <h3 className="text-2xl font-bold md:text-3xl">Explore the prototype</h3>
            <p className="mt-2 text-primary-foreground/80">Pre-loaded with 500 mock businesses across Karnataka, ER review queue, live LiveLink sessions, and a query console that answers the impossible question.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/gov"><Button size="lg" variant="secondary">Government Dashboard</Button></Link>
              <Link to="/business"><Button size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">Business Dashboard</Button></Link>
            </div>
          </div>
        </Card>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <Layers className="mx-auto mb-2 h-4 w-4" />
        VyaparDhara • Hackathon prototype • Karnataka Commerce & Industries
      </footer>
    </div>
  );
}
