import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet-async';


const ResultsPage = () => {
  const { id: resultId } = useParams();
  // We need to fetch both the result and the full quiz to display options text
  const { data: result, isLoading: resultLoading, error: resultError } = useFetch(`/results/${resultId}`);
  const { data: quiz, isLoading: quizLoading, error: quizError } = useFetch(result ? `/quizzes/${result.quiz._id}` : null);

  if (resultLoading || quizLoading) return <Loader />;
  if (resultError) return <p className="text-center text-destructive">Error: {resultError}</p>;
  if (quizError) return <p className="text-center text-destructive">Error fetching quiz details: {quizError}</p>;
  if (!result || !quiz) return <p>Results not found.</p>;

  const scoreColor = result.percentage >= 75 ? 'text-green-500' : result.percentage >= 50 ? 'text-yellow-500' : 'text-red-500';

  return (
    <>
    <Helmet>
      <title>{result ? `Results for "${result.quiz.title}"` : 'Quiz Results'} | ParikshaNode</title>
      <meta name="description" content={result ? `View your score and detailed results for the ${result.quiz.title} quiz.` : 'Review your quiz performance.'} />
    </Helmet>
    <div className="max-w-4xl mx-auto">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-3xl">Quiz Results</CardTitle>
          <p className="text-muted-foreground">For: {quiz.title}</p>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Your Score</h2>
            <p className={cn("text-6xl font-bold my-2", scoreColor)}>{result.percentage.toFixed(1)}%</p>
            <p className="text-xl text-muted-foreground">
              You answered {result.score} out of {result.totalQuestions} questions correctly.
            </p>
          </div>
          <hr className="my-6" />
          <div>
            <h3 className="text-2xl font-semibold mb-4">Answer Review</h3>
            <div className="space-y-4 text-left">
              {result.answers.map((answer, index) => {
                const question = quiz.questions.find(q => q._id === answer.questionId);
                if (!question) return null;
                return (
                  <div key={answer.questionId} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-lg">{index + 1}. {answer.questionText}</p>
                      {answer.isCorrect ? (
                        <CheckCircle className="text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="text-red-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm mt-2">Correct Answer: {question.options[answer.correctAnswerIndex]}</p>
                    {!answer.isCorrect && (
                      <p className="text-sm text-destructive">Your Answer: {question.options[answer.userAnswerIndex]}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row justify-center gap-4">
            <Link to="/"><Button>Back to Home</Button></Link>
            <Link to={`/leaderboard/${result.quiz._id}`}><Button variant="outline">View Leaderboard</Button></Link>
        </CardFooter>
      </Card>
    </div>
    </>
  );
};


export default ResultsPage;
