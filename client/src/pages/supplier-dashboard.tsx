import { useState } from "react";
import { requireAuth } from "@/lib/auth";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Warehouse, Plus, Package, ShoppingBag, BarChart3, Edit, Trash2, Check } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

type ActiveTab = "products" | "add-product" | "orders" | "analytics";

export default function SupplierDashboard() {
  const user = requireAuth(["supplier"]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("products");
  const { toast } = useToast();

  if (!user) return null;

  const { data: products = [], isLoading: productsLoading } = useQuery<any[]>({
    queryKey: ["/api/products/supplier", user.id],
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery<any[]>({
    queryKey: ["/api/orders/supplier", user.id],
  });

  const form = useForm({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      price: "",
      stock: 0,
      minOrder: 1,
      imageUrl: "",
      supplierId: user.id,
    },
  });

  const addProductMutation = useMutation({
    mutationFn: async (data: any) => {
      // Set default image based on category
      let defaultImage = "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
      
      if (data.category === "vegetables") {
        defaultImage = "https://images.unsplash.com/photo-1506976785307-8732e854ad03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
      } else if (data.category === "spices") {
        defaultImage = "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
      } else if (data.category === "oils") {
        defaultImage = "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
      } else if (data.category === "grains") {
        defaultImage = "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
      }

      const response = await apiRequest("POST", "/api/products", {
        ...data,
        imageUrl: data.imageUrl || defaultImage,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products/supplier", user.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      form.reset();
      setActiveTab("products");
      toast({
        title: "Product added",
        description: "Your product has been added successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add product",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiRequest("DELETE", `/api/products/${productId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products/supplier", user.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product deleted",
        description: "Product has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete product",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const fulfillOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const response = await apiRequest("PUT", `/api/orders/${orderId}/status`, {
        status: "fulfilled",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders/supplier", user.id] });
      toast({
        title: "Order fulfilled",
        description: "Order has been marked as fulfilled.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to fulfill order",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    addProductMutation.mutate(data);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(productId);
    }
  };

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((order: any) => order.status === "pending").length,
    fulfilledOrders: orders.filter((order: any) => order.status === "fulfilled").length,
    totalRevenue: orders.reduce((sum: number, order: any) => {
      const orderTotal = order.items?.reduce((itemSum: number, item: any) => 
        itemSum + (parseFloat(item.price) * item.quantity), 0) || 0;
      return sum + orderTotal;
    }, 0),
  };

  const renderProductsSection = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Products</h2>
        <Button onClick={() => setActiveTab("add-product")}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      {productsLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-300"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-4"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <Alert>
          <Package className="h-4 w-4" />
          <AlertDescription>
            No products listed yet. Add your first product to start selling!
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-green-600">₹{product.price}/kg</span>
                  <Badge variant="outline">{product.stock}kg stock</Badge>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDeleteProduct(product.id)}
                    disabled={deleteProductMutation.isPending}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderAddProductSection = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Fresh Red Onions" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="vegetables">Vegetables</SelectItem>
                            <SelectItem value="spices">Spices & Masala</SelectItem>
                            <SelectItem value="oils">Oils & Ghee</SelectItem>
                            <SelectItem value="grains">Grains & Pulses</SelectItem>
                            <SelectItem value="dairy">Dairy Products</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price per KG/Unit (₹) *</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="e.g., 25" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Available Stock (KG/Units) *</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 500" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Image URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter image URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Description</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="Describe quality, origin, packaging details..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="minOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Order Quantity (KG/Units)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 10" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button type="submit" disabled={addProductMutation.isPending}>
                  {addProductMutation.isPending ? "Adding..." : "Add Product"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setActiveTab("products")}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );

  const renderOrdersSection = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>
      
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
            <p className="text-sm opacity-90">Total Orders</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500 text-white">
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold">{stats.pendingOrders}</h3>
            <p className="text-sm opacity-90">Pending Orders</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500 text-white">
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold">{stats.fulfilledOrders}</h3>
            <p className="text-sm opacity-90">Fulfilled Orders</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500 text-white">
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</h3>
            <p className="text-sm opacity-90">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      {ordersLoading ? (
        <div>Loading orders...</div>
      ) : orders.length === 0 ? (
        <Alert>
          <ShoppingBag className="h-4 w-4" />
          <AlertDescription>
            No orders received yet. Orders from vendors will appear here.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                    <p className="text-sm text-muted-foreground">
                      From: {order.vendorName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={order.status === "fulfilled" ? "default" : "secondary"}>
                    {order.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-3">
                  {order.items?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.product?.name} ({item.quantity}kg)</span>
                      <span>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-semibold">
                    Order Total: ₹{order.items?.reduce((sum: number, item: any) => 
                      sum + (parseFloat(item.price) * item.quantity), 0).toFixed(2)}
                  </span>
                  {order.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => fulfillOrderMutation.mutate(order.id)}
                      disabled={fulfillOrderMutation.isPending}
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Mark as Fulfilled
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderAnalyticsSection = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Sales Analytics</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products.slice(0, 4).map((product: any, index: number) => (
                <div key={product.id} className="flex justify-between items-center">
                  <span className="text-sm">{product.name}</span>
                  <Badge variant="outline">
                    {Math.floor(Math.random() * 200) + 50}kg sold
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <BarChart3 className="h-4 w-4" />
              <AlertDescription>
                Sales chart and detailed analytics would be integrated here using Chart.js or similar library.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
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
                <CardHeader className="bg-green-600 text-white">
                  <CardTitle className="flex items-center">
                    <Warehouse className="mr-2 h-5 w-5" />
                    Supplier Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    <button
                      onClick={() => setActiveTab("products")}
                      className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 ${
                        activeTab === "products" ? "bg-green-50 border-r-2 border-green-600" : ""
                      }`}
                    >
                      <Package className="h-4 w-4" />
                      <span>My Products</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("add-product")}
                      className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 ${
                        activeTab === "add-product" ? "bg-green-50 border-r-2 border-green-600" : ""
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Product</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 ${
                        activeTab === "orders" ? "bg-green-50 border-r-2 border-green-600" : ""
                      }`}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Order Management</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("analytics")}
                      className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 ${
                        activeTab === "analytics" ? "bg-green-50 border-r-2 border-green-600" : ""
                      }`}
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>Analytics</span>
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {activeTab === "products" && renderProductsSection()}
              {activeTab === "add-product" && renderAddProductSection()}
              {activeTab === "orders" && renderOrdersSection()}
              {activeTab === "analytics" && renderAnalyticsSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
