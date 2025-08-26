import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import api from '@/api/axiosConfig';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader';
import Timer from '@/components/Timer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/Label';
import { Lock } from 'lucide-react';

const QuizPage = () => {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  const { data: quiz, isLoading: isQuizLoading, error } = useFetch(`/quizzes/${quizId}`);
  const { user } = useSelector((state) => state.auth); // 👈 Get user state
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

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

  if (isQuizLoading) return <Loader />;
  if (error) return <p className="text-center text-destructive">Error: {error}</p>;
  if (!quiz) return <p>Quiz not found.</p>;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <>
      <Helmet>
        <title>{quiz ? `Take the "${quiz.title}" Quiz` : 'Loading Quiz...'} | ParikshaNode</title>
        <meta name="description" content={quiz ? quiz.description : 'Test your knowledge with ParikshaNode.'} />
      </Helmet>
      
      {/* Add 'relative' positioning to this parent container */}
      <div className="max-w-4xl mx-auto relative">

        {/* ---- START: Login Wall Overlay ---- */}
        {!user && (
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
            <div className="text-center p-8">
              <Lock className="mx-auto h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-2">Login to Start the Quiz</h2>
              <p className="text-muted-foreground mb-6">
                Create an account or log in to save your score, track your history, and compete on the leaderboard.
              </p>
              <div className="flex justify-center gap-4">
                <Link to={`/login?redirect=/quiz/${quizId}`}>
                  <Button>Login</Button>
                </Link>
                <Link to={`/register?redirect=/quiz/${quizId}`}>
                  <Button variant="outline">Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
        {/* ---- END: Login Wall Overlay ---- */}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-x-4">
            <div className="flex-1">
              <CardTitle>{quiz.title}</CardTitle>
              <div className="w-full bg-secondary rounded-full h-2.5 mt-2">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
            {quiz.timerType === 'overall' && (
              <Timer seconds={quiz.timer * 60} onTimeUp={handleSubmit} />
            )}
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{currentQuestion.text}</h2>
                {quiz.timerType === 'per_question' && (
                  <Timer key={currentQuestionIndex} seconds={currentQuestion.timer} onTimeUp={handleNext} />
                )}
              </div>
              <RadioGroup value={userAnswers[currentQuestion._id]?.toString()} onValueChange={(value) => handleAnswerSelect(currentQuestion._id, parseInt(value))}>
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2 p-3 border rounded-md hover:bg-accent">
                    <RadioGroupItem value={index.toString()} id={`${currentQuestion._id}-${index}`} />
                    <Label htmlFor={`${currentQuestion._id}-${index}`} className="text-lg flex-1 cursor-pointer">{option}</Label>
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
        </Card>
      </div>
    </>
  );
};

export default QuizPage;
