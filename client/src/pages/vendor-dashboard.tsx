import { useState, useEffect } from "react";
import { requireAuth } from "@/lib/auth";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, ShoppingCart, Plus, Minus, Package, Users, Clock, CheckCircle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type ActiveTab = "browse" | "cart" | "orders" | "group";

export default function VendorDashboard() {
  const user = requireAuth(["vendor"]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("browse");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  if (!user) return null;

  const { data: products = [], isLoading: productsLoading } = useQuery<any[]>({
    queryKey: ["/api/products"],
  });

  const { data: cartItems = [], isLoading: cartLoading } = useQuery<any[]>({
    queryKey: ["/api/cart", user.id],
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery<any[]>({
    queryKey: ["/api/orders/vendor", user.id],
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const response = await apiRequest("POST", "/api/cart", {
        vendorId: user.id,
        productId,
        quantity,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", user.id] });
      toast({
        title: "Added to cart",
        description: "Product has been added to your cart successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add to cart",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const response = await apiRequest("PUT", `/api/cart/${id}`, { quantity });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", user.id] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/cart/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", user.id] });
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
      });
    },
  });

  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/orders", {
        vendorId: user.id,
        cartItems: cartItems,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", user.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders/vendor", user.id] });
      toast({
        title: "Order placed!",
        description: "Your order has been placed successfully.",
      });
      setActiveTab("orders");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to place order",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredProducts = products.filter((product: any) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cartTotal = cartItems.reduce((total: number, item: any) => 
    total + (parseFloat(item.product?.price || "0") * item.quantity), 0
  );

  const cartItemCount = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);

  const handleAddToCart = (productId: string, quantity: number) => {
    addToCartMutation.mutate({ productId, quantity });
  };

  const renderBrowseSection = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Available Raw Materials</h2>
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {productsLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
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
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product: any) => (
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
                <p className="text-sm text-muted-foreground mb-2">{product.supplierName}</p>
                <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-green-600">₹{product.price}/kg</span>
                  <Badge variant="outline">{product.stock}kg available</Badge>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <Input
                    type="number"
                    id={`qty-${product.id}`}
                    min={product.minOrder}
                    max={product.stock}
                    defaultValue={product.minOrder}
                    className="w-20 text-sm"
                  />
                  <span className="text-sm text-muted-foreground">kg</span>
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    const qtyInput = document.getElementById(`qty-${product.id}`) as HTMLInputElement;
                    const quantity = parseInt(qtyInput.value);
                    handleAddToCart(product.id, quantity);
                  }}
                  disabled={addToCartMutation.isPending}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderCartSection = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      
      {cartLoading ? (
        <div>Loading cart...</div>
      ) : cartItems.length === 0 ? (
        <Alert>
          <Package className="h-4 w-4" />
          <AlertDescription>
            Your cart is empty. Browse materials and add items to your cart.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item: any) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product?.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.supplierName}</p>
                    <p className="text-lg font-bold text-green-600">₹{item.product?.price}/kg</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCartMutation.mutate({ id: item.id, quantity: Math.max(1, item.quantity - 1) })}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{item.quantity}kg</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCartMutation.mutate({ id: item.id, quantity: item.quantity + 1 })}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <div className="w-20 text-right font-bold">
                      ₹{(parseFloat(item.product?.price || "0") * item.quantity).toFixed(2)}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFromCartMutation.mutate(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Card className="bg-primary/5">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold">Total Amount:</span>
                <span className="text-2xl font-bold text-green-600">₹{cartTotal.toFixed(2)}</span>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => placeOrderMutation.mutate()}
                disabled={placeOrderMutation.isPending || cartItems.length === 0}
              >
                {placeOrderMutation.isPending ? "Placing Order..." : "Place Order"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const renderOrdersSection = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      
      {ordersLoading ? (
        <div>Loading orders...</div>
      ) : orders.length === 0 ? (
        <Alert>
          <Package className="h-4 w-4" />
          <AlertDescription>
            You haven't placed any orders yet. Browse materials and place your first order!
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Card key={order.id} className={order.status === "fulfilled" ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={order.status === "fulfilled" ? "default" : "secondary"}>
                    {order.status === "fulfilled" ? (
                      <CheckCircle className="mr-1 h-3 w-3" />
                    ) : (
                      <Clock className="mr-1 h-3 w-3" />
                    )}
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
                  <span className="font-semibold">Total Amount:</span>
                  <span className="font-bold text-lg">₹{order.totalAmount}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderGroupSection = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Group Ordering</h2>
      
      <Alert className="mb-6">
        <Users className="h-4 w-4" />
        <AlertDescription>
          Join with other vendors to get bulk pricing and reduced delivery costs!
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Available Group Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">Vegetable Bulk Order #001</h4>
                  <Badge variant="outline">3 vendors joined</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Onions, Tomatoes, Potatoes - Minimum 50kg each
                </p>
                <p className="text-xs text-muted-foreground mb-3">Delivery: Tomorrow</p>
                <Button size="sm" className="w-full">Join Group</Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">Spices Bulk Order #002</h4>
                  <Badge variant="outline">2 vendors joined</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Red Chili, Turmeric, Coriander - Minimum 10kg each
                </p>
                <p className="text-xs text-muted-foreground mb-3">Delivery: Day after tomorrow</p>
                <Button size="sm" className="w-full">Join Group</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create New Group Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Order Title</label>
                <Input placeholder="e.g., Weekly Vegetable Order" />
              </div>
              <div>
                <label className="text-sm font-medium">Required Items</label>
                <textarea
                  className="w-full p-2 border rounded-md resize-none"
                  rows={3}
                  placeholder="List items and quantities needed"
                ></textarea>
              </div>
              <div>
                <label className="text-sm font-medium">Delivery Date</label>
                <Input type="date" />
              </div>
              <Button className="w-full">Create Group Order</Button>
            </div>
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
                <CardHeader className="bg-primary text-primary-foreground">
                  <CardTitle className="flex items-center">
                    <Package className="mr-2 h-5 w-5" />
                    Vendor Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    <button
                      onClick={() => setActiveTab("browse")}
                      className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 ${
                        activeTab === "browse" ? "bg-primary/10 border-r-2 border-primary" : ""
                      }`}
                    >
                      <Search className="h-4 w-4" />
                      <span>Browse Materials</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("cart")}
                      className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 ${
                        activeTab === "cart" ? "bg-primary/10 border-r-2 border-primary" : ""
                      }`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>My Cart</span>
                      {cartItemCount > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {cartItemCount}
                        </Badge>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 ${
                        activeTab === "orders" ? "bg-primary/10 border-r-2 border-primary" : ""
                      }`}
                    >
                      <Package className="h-4 w-4" />
                      <span>My Orders</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("group")}
                      className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 ${
                        activeTab === "group" ? "bg-primary/10 border-r-2 border-primary" : ""
                      }`}
                    >
                      <Users className="h-4 w-4" />
                      <span>Group Ordering</span>
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {activeTab === "browse" && renderBrowseSection()}
              {activeTab === "cart" && renderCartSection()}
              {activeTab === "orders" && renderOrdersSection()}
              {activeTab === "group" && renderGroupSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
