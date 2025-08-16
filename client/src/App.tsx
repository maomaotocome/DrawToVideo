import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { AuthGate } from "@/components/AuthGate";
import WorldClassLanding from "@/pages/WorldClassLanding";
import MVPCreatePage from "@/pages/MVPCreatePage";
import UltimateCreatePage from "@/pages/UltimateCreatePage";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <Switch>
      {/* 直接显示创建页面，如果未认证则在页面内处理 */}
      <Route path="/" component={UltimateCreatePage} />
      <Route path="/create" component={UltimateCreatePage} />
      <Route path="/mvp-create" component={MVPCreatePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
