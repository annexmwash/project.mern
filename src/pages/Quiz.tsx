import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Heart, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
}

const Quiz = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      loadQuiz();
    };
    checkAuth();
  }, [navigate]);

  const loadQuiz = async () => {
    const { data: quizData, error: quizError } = await supabase
      .from("quizzes")
      .select("*")
      .limit(1)
      .single();

    if (quizError || !quizData) {
      console.error("Error loading quiz:", quizError);
      toast({
        title: "Error",
        description: "Failed to load quiz",
        variant: "destructive",
      });
      return;
    }

    setQuiz(quizData);

    const { data: questionsData, error: questionsError } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("quiz_id", quizData.id);

    if (questionsError || !questionsData) {
      console.error("Error loading questions:", questionsError);
      return;
    }

    setQuestions(
      questionsData.map((q) => ({
        id: q.id,
        question: q.question,
        options: JSON.parse(q.options as any),
        correct_answer: q.correct_answer,
      }))
    );
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);

    if (answerIndex === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
        saveQuizAttempt();
      }
    }, 1000);
  };

  const saveQuizAttempt = async () => {
    if (!user || !quiz) return;

    await supabase.from("quiz_attempts").insert({
      user_id: user.id,
      quiz_id: quiz.id,
      score: score + (selectedAnswer === questions[currentQuestion].correct_answer ? 1 : 0),
      total_questions: questions.length,
    });
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-pink-50 to-purple-50 flex items-center justify-center">
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 rounded-2xl shadow-card text-center bg-gradient-card">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-primary to-secondary mb-4">
              <Star className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">🎀 Great Job!</h2>
            <p className="text-muted-foreground">You completed the quiz!</p>
          </div>

          <div className="bg-white rounded-xl p-6 mb-6">
            <p className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              {score}/{questions.length}
            </p>
            <p className="text-muted-foreground">Correct Answers</p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={resetQuiz}
              className="w-full rounded-full bg-gradient-to-r from-primary to-secondary"
            >
              Try Again
            </Button>
            <Button
              onClick={() => navigate("/chat")}
              variant="outline"
              className="w-full rounded-full"
            >
              Back to Chat
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-pink-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-3xl pt-8">
        <Button
          onClick={() => navigate("/chat")}
          variant="outline"
          className="mb-6 rounded-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Chat
        </Button>

        <Card className="p-8 rounded-2xl shadow-card bg-gradient-card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              Score: {score}
            </div>
          </div>

          <div className="mb-8">
            <div className="w-full bg-muted rounded-full h-2 mb-6">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              />
            </div>

            <h3 className="text-2xl font-semibold mb-8">
              {questions[currentQuestion].question}
            </h3>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  variant="outline"
                  className={`w-full p-6 text-left justify-start rounded-xl text-base transition-all ${
                    selectedAnswer === index
                      ? index === questions[currentQuestion].correct_answer
                        ? "bg-accent border-accent text-accent-foreground"
                        : "bg-destructive/10 border-destructive"
                      : "hover:bg-primary/5 hover:border-primary"
                  }`}
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted mr-3 font-semibold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;
