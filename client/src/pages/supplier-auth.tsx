import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Warehouse, ArrowLeft, Package, TrendingUp, Shield } from "lucide-react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { registerSupplierSchema, loginSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

type AuthMode = "login" | "register";

export default function SupplierAuth() {
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
    resolver: zodResolver(registerSupplierSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "supplier" as const,
      name: "",
      phone: "",
      companyName: "",
      contactPerson: "",
      businessLicense: "",
      status: "pending",
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
        description: "Successfully logged in to your supplier account.",
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
    mutationFn: async (data: z.infer<typeof registerSupplierSchema>) => {
      const response = await apiRequest("POST", "/api/auth/register/supplier", data);
      return response.json();
    },
    onSuccess: (data) => {
      login(data.user);
      toast({
        title: "Application Submitted!",
        description: "Your supplier application is under review.",
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

  const onRegisterSubmit = (data: z.infer<typeof registerSupplierSchema>) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Beautiful Warehouse/Supply Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&h=1316")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}></div>
        </div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0l8 6-8 6V8h-6v8h6V12z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        {/* Supply Chain Themed Elements */}
        <div className="absolute top-10 left-10 text-blue-200 opacity-30 text-3xl">
          📦
        </div>
        <div className="absolute top-32 right-16 text-indigo-300 opacity-30 text-2xl">
          🏭
        </div>
        <div className="absolute bottom-20 left-20 text-purple-300 opacity-30 text-2xl">
          🚚
        </div>
        <div className="absolute top-1/2 right-10 text-blue-300 opacity-25 text-xl">
          📋
        </div>
        <div className="absolute bottom-32 right-32 text-indigo-300 opacity-25 text-xl">
          ⚖️
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
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Supplier Benefits</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700">Reach thousands of vendors</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700">Grow your business network</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700">Secure payment processing</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-center">
                  <p className="text-gray-600 text-sm italic">
                    "Trusted by suppliers nationwide for wholesale food distribution"
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Auth Form */}
            <div className="w-full lg:w-96">
              <Card className="shadow-2xl bg-white/95 backdrop-blur-sm border-0">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center rounded-t-lg">
                  <CardTitle className="flex items-center justify-center text-xl font-bold">
                    <Warehouse className="mr-2 h-6 w-6" />
                    {mode === "login" ? "Supplier Login" : "Join as Supplier"}
                  </CardTitle>
                  <p className="text-blue-100 text-sm mt-1">
                    {mode === "login" ? "Welcome back to your supplier portal!" : "Supply quality ingredients to street vendors!"}
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
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                            size="lg"
                            disabled={loginMutation.isPending}
                          >
                            {loginMutation.isPending ? "Logging in..." : "Access Supplier Portal"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                            onClick={() => setMode("register")}
                          >
                            New supplier? Apply now
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
                                <Input placeholder="Enter your business email" {...field} />
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
                                <Input type="password" placeholder="Create a secure password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your company name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="contactPerson"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Person</FormLabel>
                              <FormControl>
                                <Input placeholder="Primary contact person" {...field} />
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
                                <Input placeholder="Business phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="businessLicense"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business License</FormLabel>
                              <FormControl>
                                <Input placeholder="Business license number" {...field} />
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
                            {registerMutation.isPending ? "Submitting Application..." : "Submit Supplier Application"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                            onClick={() => setMode("login")}
                          >
                            Already approved? Login
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