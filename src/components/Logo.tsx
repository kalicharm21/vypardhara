import { Link } from "@tanstack/react-router";
import { Layers } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 font-bold ${className}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero shadow-glow">
        <Layers className="h-4 w-4 text-primary-foreground" />
      </div>
      <span className="text-lg tracking-tight">
        Vyapar<span className="text-gradient">Dhara</span>
      </span>
    </Link>
  );
}
