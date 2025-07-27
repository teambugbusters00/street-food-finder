import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Users, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function Welcome() {
  const [showMainPage, setShowMainPage] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated && user) {
    const dashboardPath = `/${user.role}/dashboard`;
    window.location.href = dashboardPath;
    return null;
  }

  const handleContinue = () => {
    setShowMainPage(true);
    // Redirect to home page after animation
    setTimeout(() => {
      window.location.href = "/home";
    }, 1000);
  };

  if (showMainPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-center text-white animate-fade-out">
          <div className="text-6xl mb-4 animate-pulse">✨</div>
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Solution!</h1>
          <p className="text-xl opacity-90">Loading your marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        {/* Team collaboration background image */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&h=1316")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}></div>
        </div>
        {/* Animated background elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-16 w-20 h-20 bg-white/20 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-white/15 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 text-center text-white px-8 max-w-4xl mx-auto">
        {/* Team Introduction */}
        <div className="mb-12 animate-slide-down">
          <div className="flex items-center justify-center mb-6">
            <Users className="h-12 w-12 mr-4 text-yellow-300" />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-yellow-300 mb-2">We are Team</h2>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mb-4">
                ZIPP UP
              </h1>
              
              {/* Team Members with LinkedIn Links */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 text-sm">
                <a 
                  href="https://www.linkedin.com/in/diya-agarwal-b85228336" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/30 backdrop-blur-sm rounded-lg p-3 animate-fade-in-1 hover:bg-white/40 transition-all duration-300 cursor-pointer transform hover:scale-105"
                >
                  <div className="text-yellow-300 font-semibold">Diya Agarwal</div>
                  <div className="text-xs opacity-80">Team Lead</div>
                  <div className="text-xs text-blue-200 mt-1">LinkedIn →</div>
                </a>
                <a 
                  href="https://www.linkedin.com/in/vijay----jangid" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/30 backdrop-blur-sm rounded-lg p-3 animate-fade-in-2 hover:bg-white/40 transition-all duration-300 cursor-pointer transform hover:scale-105"
                >
                  <div className="text-yellow-300 font-semibold">Vijay Jangid</div>
                  <div className="text-xs opacity-80">Developer</div>
                  <div className="text-xs text-blue-200 mt-1">LinkedIn →</div>
                </a>
                <a 
                  href="https://www.linkedin.com/in/garvita-agarwal-0995a7322" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/30 backdrop-blur-sm rounded-lg p-3 animate-fade-in-3 hover:bg-white/40 transition-all duration-300 cursor-pointer transform hover:scale-105"
                >
                  <div className="text-yellow-300 font-semibold">Garvita Agarwal</div>
                  <div className="text-xs opacity-80">Designer</div>
                  <div className="text-xs text-blue-200 mt-1">LinkedIn →</div>
                </a>
                <a 
                  href="https://www.linkedin.com/in/harshita-gehlot-4635a6336" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/30 backdrop-blur-sm rounded-lg p-3 animate-fade-in-1 hover:bg-white/40 transition-all duration-300 cursor-pointer transform hover:scale-105"
                >
                  <div className="text-yellow-300 font-semibold">Harshita Gehlot</div>
                  <div className="text-xs opacity-80">Analyst</div>
                  <div className="text-xs text-blue-200 mt-1">LinkedIn →</div>
                </a>
                <a 
                  href="https://www.linkedin.com/in/karan-purohit-417717352" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/30 backdrop-blur-sm rounded-lg p-3 animate-fade-in-2 hover:bg-white/40 transition-all duration-300 cursor-pointer transform hover:scale-105"
                >
                  <div className="text-yellow-300 font-semibold">Karan Purohit</div>
                  <div className="text-xs opacity-80">Developer</div>
                  <div className="text-xs text-blue-200 mt-1">LinkedIn →</div>
                </a>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 animate-slide-up">
            <h3 className="text-3xl font-bold mb-4 flex items-center justify-center">
              <Sparkles className="h-8 w-8 mr-3 text-yellow-300 animate-spin-slow" />
              Welcome to Our Solution!
            </h3>
            <p className="text-xl opacity-90 mb-4 leading-relaxed">
              This is a welcome introduction showcasing our team's collaborative work on the Street Food Marketplace platform.
            </p>
            <p className="text-lg opacity-80 mb-6 leading-relaxed">
              Our comprehensive solution connects <span className="text-yellow-300 font-semibold">Street Food Vendors</span> with 
              <span className="text-green-300 font-semibold"> Quality Suppliers</span>, creating a seamless marketplace ecosystem.
            </p>
            <p className="text-sm opacity-70 italic">
              Note: This welcome screen is a temporary introduction to demonstrate our team's collaborative approach to solving marketplace challenges.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 rounded-lg p-4 animate-fade-in-1">
                <div className="text-3xl mb-2">🍛</div>
                <h4 className="font-semibold mb-1">Vendors</h4>
                <p className="text-sm opacity-80">Best quality ingredients</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 animate-fade-in-2">
                <div className="text-3xl mb-2">🏭</div>
                <h4 className="font-semibold mb-1">Suppliers</h4>
                <p className="text-sm opacity-80">Reach more customers</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 animate-fade-in-3">
                <div className="text-3xl mb-2">🚀</div>
                <h4 className="font-semibold mb-1">Growth</h4>
                <p className="text-sm opacity-80">Scale your business</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Stats */}
        <div className="mb-8 animate-slide-up-delayed">
          <div className="flex justify-center items-center space-x-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-300">500+</div>
              <div className="text-sm opacity-80">Happy Vendors</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-green-300">200+</div>
              <div className="text-sm opacity-80">Trusted Suppliers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-300">50k+</div>
              <div className="text-sm opacity-80">Orders Delivered</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="animate-bounce-subtle">
          <Button
            onClick={handleContinue}
            size="lg"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-xl px-8 py-4 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105"
          >
            Enter Marketplace
            <ChevronRight className="ml-2 h-6 w-6 animate-pulse" />
          </Button>
          
          <p className="mt-4 text-sm opacity-70 animate-pulse">
            Experience the future of street food business
          </p>
        </div>
      </div>
    </div>
  );
}