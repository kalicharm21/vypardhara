import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Search, GitMerge, Radio, AlertTriangle, FileText, MapPin, Building2,
} from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const items = [
  { to: "/gov", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/gov/businesses", label: "Business Directory", icon: Building2 },
  { to: "/gov/query", label: "Query Console", icon: Search },
  { to: "/gov/review", label: "ER Review Queue", icon: GitMerge },
  { to: "/gov/livelink", label: "LiveLink Feeds", icon: Radio },
  { to: "/gov/alerts", label: "Alerts & Risks", icon: AlertTriangle },
  { to: "/gov/map", label: "Geo-Heatmap", icon: MapPin },
  { to: "/gov/audit", label: "Audit Trail", icon: FileText },
];

export function GovSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r bg-sidebar">
      <div className="px-4 py-4 border-b">
        <Logo />
        <div className="mt-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Government Portal
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {items.map(i => {
          const active = i.exact ? path === i.to : path.startsWith(i.to);
          return (
            <Link
              key={i.to}
              to={i.to}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <i.icon className="h-4 w-4" />
              {i.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3">
        <Link to="/business" className="block rounded-md bg-secondary px-3 py-2 text-xs text-secondary-foreground hover:bg-accent">
          ← Switch to Business Portal
        </Link>
      </div>
    </aside>
  );
}
