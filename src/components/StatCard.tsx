import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label, value, icon: Icon, trend, accent = "primary",
}: {
  label: string; value: string | number; icon: LucideIcon; trend?: string;
  accent?: "primary" | "success" | "warning" | "destructive" | "info";
}) {
  const accentMap = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/20 text-warning-foreground",
    destructive: "bg-destructive/15 text-destructive",
    info: "bg-info/15 text-info",
  };
  return (
    <Card className="bg-gradient-card relative overflow-hidden p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-2 text-3xl font-bold tracking-tight">{value}</div>
          {trend && <div className="mt-1 text-xs text-muted-foreground">{trend}</div>}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", accentMap[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
