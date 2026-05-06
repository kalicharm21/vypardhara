import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, IdCard, Radio, FileCheck, History, Bell } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const items = [
  { to: "/business", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/business/card", label: "VyaparCard", icon: IdCard },
  { to: "/business/livelink", label: "LiveLink Session", icon: Radio },
  { to: "/business/submit", label: "Submit / Renew", icon: FileCheck },
  { to: "/business/history", label: "Compliance History", icon: History },
  { to: "/business/notices", label: "Notices", icon: Bell },
];

export function BusinessSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r bg-sidebar">
      <div className="px-4 py-4 border-b">
        <Logo />
        <div className="mt-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Business Portal
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
        <Link to="/gov" className="block rounded-md bg-secondary px-3 py-2 text-xs text-secondary-foreground hover:bg-accent">
          → Switch to Government Portal
        </Link>
      </div>
    </aside>
  );
}
