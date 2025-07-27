import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, ArrowLeft, Store, Users, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { registerVendorSchema, loginSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

type AuthMode = "login" | "register";

export default function VendorAuth() {
  const [mode, setMode] = useState<AuthMode>("login");
  const { login } = useAuth();
  const { toast } = useToast();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm({
    resolver: zodResolver(registerVendorSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "vendor" as const,
      name: "",
      phone: "",
      businessName: "",
      status: "active",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: z.infer<typeof loginSchema>) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      login(data.user);
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to your vendor account.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: z.infer<typeof registerVendorSchema>) => {
      const response = await apiRequest("POST", "/api/auth/register/vendor", data);
      return response.json();
    },
    onSuccess: (data) => {
      login(data.user);
      toast({
        title: "Welcome!",
        description: "Your vendor account has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  const onLoginSubmit = (data: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: z.infer<typeof registerVendorSchema>) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Beautiful Street Food Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&h=1316")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}></div>
        </div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        {/* Street Food Themed Elements */}
        <div className="absolute top-10 left-10 text-orange-200 opacity-30 text-3xl">
          🍛
        </div>
        <div className="absolute top-32 right-16 text-yellow-300 opacity-30 text-2xl">
          🌮
        </div>
        <div className="absolute bottom-20 left-20 text-red-300 opacity-30 text-2xl">
          🍜
        </div>
        <div className="absolute top-1/2 right-10 text-orange-300 opacity-25 text-xl">
          🥘
        </div>
        <div className="absolute bottom-32 right-32 text-green-300 opacity-25 text-xl">
          🍕
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-8 pb-8 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <Link href="/home">
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="flex justify-center items-center min-h-[calc(100vh-120px)]">
          <div className="max-w-4xl w-full flex gap-8">
            {/* Left side - App Features */}
            <div className="flex-1 hidden lg:flex flex-col justify-center space-y-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Street Food Vendor Benefits</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Store className="h-5 w-5 text-orange-500" />
                    <span className="text-gray-700">Easy inventory management</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-orange-500" />
                    <span className="text-gray-700">Connect with verified suppliers</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                    <span className="text-gray-700">Track orders and growth</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-center">
                  <p className="text-gray-600 text-sm italic">
                    "Join thousands of street food vendors growing their business with our platform"
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Auth Form */}
            <div className="w-full lg:w-96">
              <Card className="shadow-2xl bg-white/95 backdrop-blur-sm border-0">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center rounded-t-lg">
                  <CardTitle className="flex items-center justify-center text-xl font-bold">
                    <ShoppingCart className="mr-2 h-6 w-6" />
                    {mode === "login" ? "Street Vendor Login" : "Join as Street Vendor"}
                  </CardTitle>
                  <p className="text-orange-100 text-sm mt-1">
                    {mode === "login" ? "Welcome back to your food business!" : "Start your street food business today!"}
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  {mode === "login" ? (
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Enter your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="space-y-3">
                          <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                            size="lg"
                            disabled={loginMutation.isPending}
                          >
                            {loginMutation.isPending ? "Logging in..." : "Login to Dashboard"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
                            onClick={() => setMode("register")}
                          >
                            Don't have an account? Register
                          </Button>
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Choose a username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Create a password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="businessName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your business name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="space-y-3">
                          <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                            size="lg"
                            disabled={registerMutation.isPending}
                          >
                            {registerMutation.isPending ? "Creating Account..." : "Create Vendor Account"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
                            onClick={() => setMode("login")}
                          >
                            Already have an account? Login
                          </Button>
                        </div>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}