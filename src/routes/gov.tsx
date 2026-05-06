import { createFileRoute, Outlet } from "@tanstack/react-router";
import { GovSidebar } from "@/components/GovSidebar";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/gov")({
  component: GovLayout,
});

function GovLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <GovSidebar />
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
