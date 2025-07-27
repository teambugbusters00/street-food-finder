import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Warehouse, ShieldQuestion, TrendingUp, Users, Package, Star, Utensils } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user) {
    const dashboardPath = `/${user.role}/dashboard`;
    window.location.href = dashboardPath;
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&h=1316")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}></div>
        </div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Utensils className="h-12 w-12 text-orange-600 mr-4" />
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800">
                Street Food <span className="text-orange-600">Marketplace</span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
              मारकेट में सबसे अच्छा रॉ मैटेरियल - सीधे सप्लायर से वेंडर तक
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>500+ Vendors</span>
              </div>
              <div className="flex items-center">
                <Package className="h-4 w-4 mr-1" />
                <span>200+ Suppliers</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Growing Daily</span>
              </div>
            </div>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white/90 backdrop-blur-sm border-0 animate-slide-up relative overflow-hidden">
              <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}></div>
              </div>
              <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center rounded-t-lg relative z-10">
                <CardTitle className="flex items-center justify-center text-xl">
                  <ShoppingCart className="mr-2 h-7 w-7" />
                  Street Vendor
                </CardTitle>
                <p className="text-orange-100 text-sm mt-1">स्ट्रीट फूड वेंडर</p>
              </CardHeader>
              <CardContent className="p-6 text-center relative z-10">
                <div className="mb-4">
                  <div className="text-4xl mb-2">🍛</div>
                  <p className="text-gray-700 mb-4 font-medium">
                    Browse premium raw materials, manage inventory, and place orders from verified suppliers across the city.
                  </p>
                </div>
                <div className="space-y-2 mb-4 text-sm text-gray-500">
                  <div className="flex items-center justify-center">
                    <Star className="h-3 w-3 mr-1 text-yellow-500" />
                    <span>Quality ingredients guaranteed</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    <span>Competitive pricing</span>
                  </div>
                </div>
                <Link href="/vendor/auth">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700" size="lg">
                    Start Your Business
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white/90 backdrop-blur-sm border-0 animate-slide-up-delayed relative overflow-hidden">
              <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}></div>
              </div>
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center rounded-t-lg relative z-10">
                <CardTitle className="flex items-center justify-center text-xl">
                  <Warehouse className="mr-2 h-7 w-7" />
                  Supplier
                </CardTitle>
                <p className="text-blue-100 text-sm mt-1">सप्लायर/होलसेलर</p>
              </CardHeader>
              <CardContent className="p-6 text-center relative z-10">
                <div className="mb-4">
                  <div className="text-4xl mb-2">🏭</div>
                  <p className="text-gray-700 mb-4 font-medium">
                    List your products, manage bulk orders, and connect with hundreds of street food vendors.
                  </p>
                </div>
                <div className="space-y-2 mb-4 text-sm text-gray-500">
                  <div className="flex items-center justify-center">
                    <Users className="h-3 w-3 mr-1 text-blue-500" />
                    <span>Reach thousands of vendors</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Package className="h-3 w-3 mr-1 text-green-500" />
                    <span>Bulk order management</span>
                  </div>
                </div>
                <Link href="/supplier/auth">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" size="lg">
                    Grow Your Network
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white/90 backdrop-blur-sm border-0 animate-bounce-subtle relative overflow-hidden">
              <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}></div>
              </div>
              <CardHeader className="bg-gradient-to-r from-purple-600 to-violet-600 text-white text-center rounded-t-lg relative z-10">
                <CardTitle className="flex items-center justify-center text-xl">
                  <ShieldQuestion className="mr-2 h-7 w-7" />
                  Admin
                </CardTitle>
                <p className="text-purple-100 text-sm mt-1">एडमिन पैनल</p>
              </CardHeader>
              <CardContent className="p-6 text-center relative z-10">
                <div className="mb-4">
                  <div className="text-4xl mb-2">🛡️</div>
                  <p className="text-gray-700 mb-4 font-medium">
                    Complete platform management, user oversight, and marketplace administration.
                  </p>
                </div>
                <div className="space-y-2 mb-4 text-sm text-gray-500">
                  <div className="flex items-center justify-center">
                    <ShieldQuestion className="h-3 w-3 mr-1 text-purple-500" />
                    <span>Secure access control</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    <span>Analytics & insights</span>
                  </div>
                </div>
                <Link href="/admin/auth">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700" size="lg">
                    Admin Access
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Why Choose Our Platform?</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <div className="text-3xl mb-3">🤝</div>
                <h3 className="font-semibold text-gray-800 mb-2">Trusted Network</h3>
                <p className="text-gray-600 text-sm">Verified suppliers and vendors for secure transactions</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="font-semibold text-gray-800 mb-2">Best Prices</h3>
                <p className="text-gray-600 text-sm">Competitive wholesale rates directly from suppliers</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <div className="text-3xl mb-3">🚚</div>
                <h3 className="font-semibold text-gray-800 mb-2">Quick Delivery</h3>
                <p className="text-gray-600 text-sm">Fast and reliable delivery across the city</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}