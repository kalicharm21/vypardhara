import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BusinessSidebar } from "@/components/BusinessSidebar";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/business")({
  component: BusinessLayout,
});

function BusinessLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <BusinessSidebar />
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
