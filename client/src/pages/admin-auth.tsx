import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldQuestion, ArrowLeft, Shield, Database, Users } from "lucide-react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loginSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

export default function AdminAuth() {
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@streetmarket.com",
      password: "admin123",
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
        title: "Welcome Admin!",
        description: "Successfully logged in to admin panel.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid admin credentials",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Admin Dashboard Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&h=1316")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}></div>
        </div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0l8 6-8 6V8h-6v8h6V12z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        {/* Admin Themed Elements */}
        <div className="absolute top-10 left-10 text-purple-200 opacity-30 text-3xl">
          🛡️
        </div>
        <div className="absolute top-32 right-16 text-violet-300 opacity-30 text-2xl">
          ⚙️
        </div>
        <div className="absolute bottom-20 left-20 text-indigo-300 opacity-30 text-2xl">
          📊
        </div>
        <div className="absolute top-1/2 right-10 text-purple-300 opacity-25 text-xl">
          🔐
        </div>
        <div className="absolute bottom-32 right-32 text-violet-300 opacity-25 text-xl">
          👨‍💼
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
            {/* Left side - Admin Features */}
            <div className="flex-1 hidden lg:flex flex-col justify-center space-y-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Control Panel</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-purple-500" />
                    <span className="text-gray-700">Manage vendors and suppliers</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Database className="h-5 w-5 text-purple-500" />
                    <span className="text-gray-700">Monitor all platform activity</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-purple-500" />
                    <span className="text-gray-700">Secure platform administration</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-center">
                  <p className="text-gray-600 text-sm italic">
                    "Complete oversight and control of the street food marketplace platform"
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Auth Form */}
            <div className="w-full lg:w-96">
              <Card className="shadow-2xl bg-white/95 backdrop-blur-sm border-0">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-violet-600 text-white text-center rounded-t-lg">
                  <CardTitle className="flex items-center justify-center text-xl font-bold">
                    <ShieldQuestion className="mr-2 h-6 w-6" />
                    Admin Access Portal
                  </CardTitle>
                  <p className="text-purple-100 text-sm mt-1">
                    Secure administrative access to the platform
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  <Alert className="mb-4 border-purple-200 bg-purple-50">
                    <ShieldQuestion className="h-4 w-4" />
                    <AlertDescription className="text-sm text-purple-700">
                      Admin credentials are pre-filled for demonstration. In production, these would be secured.
                    </AlertDescription>
                  </Alert>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Admin Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter admin email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Admin Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter admin password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                        size="lg"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Authenticating..." : "Access Admin Panel"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}