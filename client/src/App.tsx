import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { authStorage } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import Welcome from "@/pages/welcome";
import Home from "@/pages/home";
import VendorAuth from "@/pages/vendor-auth";
import SupplierAuth from "@/pages/supplier-auth";
import AdminAuth from "@/pages/admin-auth";
import VendorDashboard from "@/pages/vendor-dashboard";
import SupplierDashboard from "@/pages/supplier-dashboard";
import AdminDashboard from "@/pages/admin-dashboard.tsx";

function Router() {
  const { user, isAuthenticated } = authStorage.get();

  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/home" component={Home} />
      
      {/* Auth routes */}
      <Route path="/vendor/auth" component={VendorAuth} />
      <Route path="/supplier/auth" component={SupplierAuth} />
      <Route path="/admin/auth" component={AdminAuth} />
      
      {/* Dashboard routes - protected */}
      <Route path="/vendor/dashboard">
        {isAuthenticated && user?.role === "vendor" ? <VendorDashboard /> : <Welcome />}
      </Route>
      <Route path="/supplier/dashboard">
        {isAuthenticated && user?.role === "supplier" ? <SupplierDashboard /> : <Welcome />}
      </Route>
      <Route path="/admin/dashboard">
        {isAuthenticated && user?.role === "admin" ? <AdminDashboard /> : <Welcome />}
      </Route>
      
      {/* Fallback to 404 */}
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
