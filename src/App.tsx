
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import Dashboard from "./pages/Index";
import Templates from "./pages/Templates";
import PipelineBuilder from "./pages/PipelineBuilder";
import Downloads from "./pages/Downloads";
import Docker from "./pages/Docker";
import Jenkins from "./pages/Jenkins";
import SimulatePipeline from "./pages/SimulatePipeline";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            }
          />
          <Route
            path="/templates"
            element={
              <AppLayout>
                <Templates />
              </AppLayout>
            }
          />
          <Route
            path="/builder"
            element={
              <AppLayout>
                <PipelineBuilder />
              </AppLayout>
            }
          />
          <Route
            path="/downloads"
            element={
              <AppLayout>
                <Downloads />
              </AppLayout>
            }
          />
          <Route
            path="/docker"
            element={
              <AppLayout>
                <Docker />
              </AppLayout>
            }
          />
          <Route
            path="/jenkins"
            element={
              <AppLayout>
                <Jenkins />
              </AppLayout>
            }
          />
          <Route
            path="/simulate"
            element={
              <AppLayout>
                <SimulatePipeline />
              </AppLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <AppLayout>
                <Settings />
              </AppLayout>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
