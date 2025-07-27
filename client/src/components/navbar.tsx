import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut, Store } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getUserDisplayName = () => {
    switch (user.role) {
      case "vendor":
        return `Vendor: ${user.businessName || user.name}`;
      case "supplier":
        return `Supplier: ${user.companyName}`;
      case "admin":
        return "Admin Panel";
      default:
        return user.name;
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center space-x-2 font-bold text-lg">
            <Store className="h-6 w-6" />
            <span>Street Market</span>
          </a>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {getUserDisplayName()}
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
