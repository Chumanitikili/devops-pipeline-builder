
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <SidebarTrigger />
            </div>
            {children}
          </div>
        </div>
      </div>
      <Toaster />
      <Sonner />
    </SidebarProvider>
  );
}
