import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import api from '@/api/axiosConfig';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader';
import Timer from '@/components/Timer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/Label';
// ADDED: Imported new icons
import { Lock, HelpCircle, Clock } from 'lucide-react';

const QuizPage = () => {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { data: quiz, isLoading: isQuizLoading, error } = useFetch(`/quizzes/${quizId}`);
  const { data: attemptStatus, isLoading: isStatusLoading } = useFetch(user ? `/quizzes/${quizId}/attempt-status` : null);

  // ADDED: State to manage if the quiz has started
  const [quizStarted, setQuizStarted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [overallTimeLeft, setOverallTimeLeft] = useState(0);

  useEffect(() => {
    if (attemptStatus && attemptStatus.attempted) {
      toast.info('You have already completed this quiz.');
      navigate(`/results/${attemptStatus.resultId}`, { replace: true });
    }
  }, [attemptStatus, navigate]);

  useEffect(() => {
    if (quiz && quiz.timerType === 'overall') {
      setOverallTimeLeft(quiz.timer * 60);
    }
  }, [quiz]);

  // ADDED: Handler to start the quiz
  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await api.post(`/quizzes/${quizId}/submit`, { userAnswers });
      toast.success('Quiz submitted successfully!');
      navigate(`/results/${response.data.resultId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit quiz.');
      setIsSubmitting(false);
    }
  };

  if (isQuizLoading || (user && isStatusLoading)) return <Loader />;
  if (error) return <p className="text-center text-destructive mt-8">Error: {error}</p>;
  if (!quiz) return <p className="text-center mt-8">Quiz not found.</p>;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <>
      <Helmet>
        <title>{`Take the "${quiz.title}" Quiz | ParikshaNode`}</title>
        <meta name="description" content={quiz.description} />
      </Helmet>

      <div className="max-w-4xl mx-auto relative my-8 px-4">
        {!user && (
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
            <div className="text-center p-8">
              <Lock className="mx-auto h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-2">Login to Start the Quiz</h2>
              <p className="text-muted-foreground mb-6">
                Create an account or log in to save your score and track your history.
              </p>
              <div className="flex justify-center gap-4">
                {/* UPDATED: Redirect link */}
                <Link to={`/login?redirect=/quiz/${quizId}`}>
                  <Button>Login</Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        <Card>
          {/* --- CONDITIONAL RENDERING START --- */}
          {!quizStarted ? (
            // --- 1. QUIZ DETAILS VIEW (Before Start) ---
            <>
              <CardHeader>
                <CardTitle className="text-center text-3xl">{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center p-8">
                <p className="text-muted-foreground mb-6 max-w-prose">{quiz.description}</p>
                <div className="flex flex-col sm:flex-row gap-6 mb-8">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    <span className="font-medium">{quiz.questions.length} Questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="font-medium">
                      {quiz.timerType === 'overall'
                        ? `${quiz.timer} Minutes (Overall)`
                        : quiz.timerType === 'per_question'
                        ? 'Timed per question'
                        : 'No time limit'}
                    </span>
                  </div>
                </div>
                <Button size="lg" onClick={handleStartQuiz}>
                  Start Quiz Now
                </Button>
              </CardContent>
            </>
          ) : (
            // --- 2. QUIZ IN-PROGRESS VIEW (After Start) ---
            <>
              <CardHeader className="flex flex-row items-center justify-between space-x-4">
                <div className="flex-1">
                  <CardTitle>{quiz.title}</CardTitle>
                  <div className="w-full bg-secondary rounded-full h-2.5 mt-2">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
                {quiz.timerType === 'overall' && overallTimeLeft > 0 && (
                  <Timer seconds={overallTimeLeft} onTimeUp={handleSubmit} />
                )}
              </CardHeader>

              <CardContent>
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{currentQuestion.text}</h2>
                    {quiz.timerType === 'per_question' && (
                      <Timer
                        key={currentQuestionIndex}
                        seconds={currentQuestion.timer}
                        onTimeUp={handleNext}
                      />
                    )}
                  </div>

                  <RadioGroup
                    value={userAnswers[currentQuestion._id]?.toString()}
                    onValueChange={(value) => handleAnswerSelect(currentQuestion._id, parseInt(value))}
                  >
                    {currentQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 mb-2 p-3 border rounded-md hover:bg-accent transition-colors"
                      >
                        <RadioGroupItem value={index.toString()} id={`${currentQuestion._id}-${index}`} />
                        <Label htmlFor={`${currentQuestion._id}-${index}`} className="text-lg flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="mt-6 flex justify-end">
                  {currentQuestionIndex === quiz.questions.length - 1 ? (
                    <Button onClick={handleSubmit} disabled={isSubmitting} variant="destructive">
                      {isSubmitting ? 'Submitting...' : 'Finish & Submit Quiz'}
                    </Button>
                  ) : (
                    <Button onClick={handleNext}>Next Question</Button>
                  )}
                </div>
              </CardContent>
            </>
          )}
          {/* --- CONDITIONAL RENDERING END --- */}
        </Card>
      </div>
    </>
  );
};

export default QuizPage;
