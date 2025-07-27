import { useState } from "react";
import { requireAuth } from "@/lib/auth";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldQuestion, TrendingUp, Store, Warehouse, Package, Users, Activity, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type ActiveTab = "overview" | "vendors" | "suppliers" | "orders";

export default function AdminDashboard() {
  const user = requireAuth(["admin"]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const { toast } = useToast();

  if (!user) return null;

  const { data: vendors = [], isLoading: vendorsLoading } = useQuery<any[]>({
    queryKey: ["/api/users/vendors"],
  });

  const { data: suppliers = [], isLoading: suppliersLoading } = useQuery<any[]>({
    queryKey: ["/api/users/suppliers"],
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery<any[]>({
    queryKey: ["/api/orders"],
  });

  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      const response = await apiRequest("PUT", `/api/users/${userId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/vendors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users/suppliers"] });
      toast({
        title: "Status updated",
        description: "User status has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleToggleUserStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    updateUserStatusMutation.mutate({ userId, status: newStatus });
  };

  const stats = {
    totalVendors: vendors.length,
    totalSuppliers: suppliers.length,
    totalOrders: orders.length,
    totalGMV: orders.reduce((sum: number, order: any) => sum + parseFloat(order.totalAmount || "0"), 0),
    activeVendors: vendors.filter((v: any) => v.status === "active").length,
    pendingSuppliers: suppliers.filter((s: any) => s.status === "pending").length,
    pendingOrders: orders.filter((o: any) => o.status === "pending").length,
    fulfilledOrders: orders.filter((o: any) => o.status === "fulfilled").length,
  };

  const renderOverviewSection = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Platform Overview</h2>
      
      {/* Main Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 text-center">
            <Store className="mx-auto h-8 w-8 mb-2 opacity-80" />
            <h3 className="text-2xl font-bold">{stats.totalVendors}</h3>
            <p className="text-sm opacity-90">Total Vendors</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4 text-center">
            <Warehouse className="mx-auto h-8 w-8 mb-2 opacity-80" />
            <h3 className="text-2xl font-bold">{stats.totalSuppliers}</h3>
            <p className="text-sm opacity-90">Total Suppliers</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4 text-center">
            <Package className="mx-auto h-8 w-8 mb-2 opacity-80" />
            <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
            <p className="text-sm opacity-90">Total Orders</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          <CardContent className="p-4 text-center">
            <TrendingUp className="mx-auto h-8 w-8 mb-2 opacity-80" />
            <h3 className="text-2xl font-bold">₹{stats.totalGMV.toFixed(0)}</h3>
            <p className="text-sm opacity-90">Total GMV</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">New vendor registered</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Supplier added new product</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Order fulfilled successfully</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">New supplier pending approval</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Platform Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Order Fulfillment Rate</span>
                  <span>{stats.totalOrders > 0 ? Math.round((stats.fulfilledOrders / stats.totalOrders) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${stats.totalOrders > 0 ? (stats.fulfilledOrders / stats.totalOrders) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Active Vendors</span>
                  <span>{stats.totalVendors > 0 ? Math.round((stats.activeVendors / stats.totalVendors) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${stats.totalVendors > 0 ? (stats.activeVendors / stats.totalVendors) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Approved Suppliers</span>
                  <span>{stats.totalSuppliers > 0 ? Math.round(((stats.totalSuppliers - stats.pendingSuppliers) / stats.totalSuppliers) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${stats.totalSuppliers > 0 ? ((stats.totalSuppliers - stats.pendingSuppliers) / stats.totalSuppliers) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderVendorsSection = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Vendors</h2>
      
      <Card>
        <CardContent className="p-0">
          {vendorsLoading ? (
            <div className="p-6 text-center">Loading vendors...</div>
          ) : vendors.length === 0 ? (
            <div className="p-6 text-center">
              <Store className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-muted-foreground">No vendors registered yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium">Business Name</th>
                    <th className="text-left p-4 font-medium">Contact Person</th>
                    <th className="text-left p-4 font-medium">Email</th>
                    <th className="text-left p-4 font-medium">Phone</th>
                    <th className="text-left p-4 font-medium">Join Date</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor: any) => (
                    <tr key={vendor.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{vendor.businessName || "N/A"}</td>
                      <td className="p-4">{vendor.name}</td>
                      <td className="p-4">{vendor.email}</td>
                      <td className="p-4">{vendor.phone || "N/A"}</td>
                      <td className="p-4">{new Date(vendor.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <Badge variant={vendor.status === "active" ? "default" : "secondary"}>
                          {vendor.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleUserStatus(vendor.id, vendor.status)}
                          disabled={updateUserStatusMutation.isPending}
                        >
                          {vendor.status === "active" ? "Suspend" : "Activate"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderSuppliersSection = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Suppliers</h2>
      
      <Card>
        <CardContent className="p-0">
          {suppliersLoading ? (
            <div className="p-6 text-center">Loading suppliers...</div>
          ) : suppliers.length === 0 ? (
            <div className="p-6 text-center">
              <Warehouse className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-muted-foreground">No suppliers registered yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium">Company Name</th>
                    <th className="text-left p-4 font-medium">Contact Person</th>
                    <th className="text-left p-4 font-medium">Email</th>
                    <th className="text-left p-4 font-medium">Phone</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier: any) => (
                    <tr key={supplier.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{supplier.companyName}</td>
                      <td className="p-4">{supplier.contactPerson}</td>
                      <td className="p-4">{supplier.email}</td>
                      <td className="p-4">{supplier.phone || "N/A"}</td>
                      <td className="p-4">
                        <Badge variant={supplier.status === "active" ? "default" : supplier.status === "pending" ? "secondary" : "outline"}>
                          {supplier.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleUserStatus(supplier.id, supplier.status)}
                          disabled={updateUserStatusMutation.isPending}
                        >
                          {supplier.status === "active" ? "Suspend" : supplier.status === "pending" ? "Approve" : "Activate"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderOrdersSection = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Monitor Orders</h2>
      
      <Card>
        <CardContent className="p-0">
          {ordersLoading ? (
            <div className="p-6 text-center">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-6 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-muted-foreground">No orders placed yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium">Order ID</th>
                    <th className="text-left p-4 font-medium">Vendor</th>
                    <th className="text-left p-4 font-medium">Amount</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-mono text-sm">#{order.id.slice(-8)}</td>
                      <td className="p-4">{order.vendorName}</td>
                      <td className="p-4 font-medium">₹{order.totalAmount}</td>
                      <td className="p-4">
                        <Badge variant={order.status === "fulfilled" ? "default" : "secondary"}>
                          {order.status === "fulfilled" ? (
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                          ) : (
                            <Clock className="mr-1 h-3 w-3" />
                          )}
                          {order.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0">
              <Card>
                <CardHeader className="bg-yellow-500 text-black">
                  <CardTitle className="flex items-center">
                    <ShieldQuestion className="mr-2 h-5 w-5" />
                    Admin Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    <button
                      onClick={() => setActiveTab("overview")}
                      className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 ${
                        activeTab === "overview" ? "bg-yellow-50 border-r-2 border-yellow-500" : ""
                      }`}
                    >
                      <TrendingUp className="h-4 w-4" />
                      <span>Overview</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("vendors")}
                      className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 ${
                        activeTab === "vendors" ? "bg-yellow-50 border-r-2 border-yellow-500" : ""
                      }`}
                    >
                      <Store className="h-4 w-4" />
                      <span>Manage Vendors</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("suppliers")}
                      className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 ${
                        activeTab === "suppliers" ? "bg-yellow-50 border-r-2 border-yellow-500" : ""
                      }`}
                    >
                      <Warehouse className="h-4 w-4" />
                      <span>Manage Suppliers</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 ${
                        activeTab === "orders" ? "bg-yellow-50 border-r-2 border-yellow-500" : ""
                      }`}
                    >
                      <Package className="h-4 w-4" />
                      <span>Monitor Orders</span>
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {activeTab === "overview" && renderOverviewSection()}
              {activeTab === "vendors" && renderVendorsSection()}
              {activeTab === "suppliers" && renderSuppliersSection()}
              {activeTab === "orders" && renderOrdersSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
