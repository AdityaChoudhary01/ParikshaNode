import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '@/api/axiosConfig';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader';
import Timer from '@/components/Timer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Helmet } from 'react-helmet-async';

const QuizPage = () => {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  const { data: quiz, isLoading: isQuizLoading, error } = useFetch(`/quizzes/${quizId}`);
  
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
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-x-4">
          <div className="flex-1">
            <CardTitle>{quiz.title}</CardTitle>
            <div className="w-full bg-secondary rounded-full h-2.5 mt-2">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          {/* Render overall timer if selected */}
          {quiz.timerType === 'overall' && (
            <Timer seconds={quiz.timer * 60} onTimeUp={handleSubmit} />
          )}
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{currentQuestion.text}</h2>
              {/* Render per-question timer if selected */}
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