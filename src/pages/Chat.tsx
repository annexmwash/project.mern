import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Heart, Send, Sparkles, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { streamChat } from "@/utils/aiChat";
import mascotDoll from "@/assets/mascot-doll.png";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      loadMessages(session.user.id);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadMessages = async (userId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(50);

    if (error) {
      console.error("Error loading messages:", error);
      return;
    }

    if (data && data.length > 0) {
      setMessages(data.map(msg => ({
        id: msg.id,
        content: msg.content,
        role: msg.role as "user" | "assistant",
        timestamp: new Date(msg.created_at),
      })));
    } else {
      const welcomeMsg: Message = {
        id: "welcome",
        content: "Hi there! 💖 I'm your friendly learning buddy! Ask me anything about your studies or try a quiz!",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages([welcomeMsg]);
    }
  };

  const saveMessage = async (content: string, role: "user" | "assistant") => {
    if (!user) return;
    
    await supabase.from("messages").insert({
      user_id: user.id,
      content,
      role,
    });
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    await saveMessage(userMessage.content, "user");

    let assistantContent = "";
    const upsertAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            content: assistantContent,
            role: "assistant" as const,
            timestamp: new Date(),
          },
        ];
      });
    };

    try {
      const chatMessages = messages
        .filter(m => m.id !== "welcome")
        .map(m => ({ role: m.role, content: m.content }));
      
      chatMessages.push({ role: "user", content: userMessage.content });

      await streamChat({
        messages: chatMessages,
        onDelta: upsertAssistant,
        onDone: () => {
          setIsLoading(false);
          saveMessage(assistantContent, "assistant");
        },
      });
    } catch (error: any) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get response",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-pink-50 to-purple-50">
      <div className="container mx-auto p-4 max-w-6xl">
        <header className="flex items-center justify-between mb-6 pt-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              EduChat
            </h1>
          </div>
          <Button variant="outline" className="rounded-full" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 p-6 rounded-2xl shadow-card bg-gradient-card">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary p-1 mb-4">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl">
                  👩‍🎓
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Welcome, {user?.email?.split("@")[0] || "Student"}!
              </h2>
              <p className="text-muted-foreground text-center text-sm mb-6">
                Keep learning and growing! 🌟
              </p>

              <div className="w-full space-y-4">
                <Button
                  onClick={() => navigate("/quiz")}
                  className="w-full rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Take a Quiz
                </Button>
              </div>
            </div>
          </Card>

          <Card className="md:col-span-2 p-6 rounded-2xl shadow-card bg-white/80 backdrop-blur">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
              <div className="relative">
                <img
                  src={mascotDoll}
                  alt="Mascot"
                  className="w-16 h-16 animate-float"
                />
                <div className="absolute -top-1 -right-1">
                  <span className="text-2xl animate-wave inline-block origin-bottom-right">
                    👋
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Your Learning Buddy</h3>
                <p className="text-sm text-muted-foreground">Always here to help! 💕</p>
              </div>
            </div>

            <div className="h-[400px] overflow-y-auto mb-4 space-y-4 pr-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl p-4 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-br-md"
                        : "bg-muted rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-md p-4">
                    <p className="text-sm">Typing...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
                placeholder="Ask me anything... 💭"
                className="rounded-full border-2 focus:border-primary"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading}
                className="rounded-full w-12 h-12 p-0 bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;
