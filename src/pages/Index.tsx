import { Button } from "@/components/ui/button";
import { Heart, Sparkles, BookOpen, Brain, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import mascotDoll from "@/assets/mascot-doll.png";
import heroBg from "@/assets/hero-bg.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-pink-50/80 to-purple-50/80" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-4 py-2 mb-6 shadow-soft">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Your Friendly Learning Companion</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Learn with{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  EduChat
                </span>
                <Heart className="inline-block w-12 h-12 text-primary ml-2 animate-bounce-slow" />
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Chat with your AI learning buddy, get instant answers, and ace your quizzes! 
                Learning has never been this fun! 🌸
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button 
                  onClick={() => navigate("/auth")}
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all text-lg px-8"
                >
                  Get Started
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  onClick={() => navigate("/auth")}
                  size="lg"
                  variant="outline"
                  className="rounded-full text-lg px-8"
                >
                  Sign In
                  <Trophy className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-3xl opacity-20 animate-pulse" />
                <img 
                  src={mascotDoll}
                  alt="Your Learning Buddy"
                  className="relative w-80 h-80 object-contain animate-float drop-shadow-2xl"
                />
                <div className="absolute top-0 right-0">
                  <span className="text-6xl animate-wave inline-block origin-bottom-right">
                    👋
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why You'll{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Love
              </span>{" "}
              Learning Here
            </h2>
            <p className="text-muted-foreground text-lg">
              We make studying fun and engaging! 💕
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-8 rounded-2xl bg-gradient-card shadow-card hover:shadow-soft transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Answers</h3>
              <p className="text-muted-foreground">
                Get help with your homework anytime, anywhere! Our AI buddy is always ready to assist.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-card shadow-card hover:shadow-soft transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Interactive Quizzes</h3>
              <p className="text-muted-foreground">
                Test your knowledge with fun quizzes and track your progress as you learn!
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-card shadow-card hover:shadow-soft transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Friendly & Fun</h3>
              <p className="text-muted-foreground">
                Learning doesn't have to be boring! Chat with your cute AI friend and enjoy studying.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-background via-pink-50 to-purple-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Learning Journey? 🌟
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students who are making learning fun and effective with EduChat!
          </p>
          <Button 
            onClick={() => navigate("/auth")}
            size="lg"
            className="rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all text-lg px-12"
          >
            Get Started Now
            <Sparkles className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
