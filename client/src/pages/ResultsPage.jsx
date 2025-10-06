import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, XCircle, Clock, FileText, Trophy } from 'lucide-react'; // Added Clock, FileText, Trophy
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet-async';


const ResultsPage = () => {
    const { id: resultId } = useParams();
    
    // 1. Fetch the user's result (which contains the detailed answers)
    const { data: result, isLoading: resultLoading, error: resultError } = useFetch(`/results/${resultId}`);
    
    // 2. FIX: Using the public endpoint /quizzes/:id for quiz details
    const { data: quiz, isLoading: quizLoading, error: quizError } = useFetch(result ? `/quizzes/${result.quiz._id}` : null);


    if (resultLoading || quizLoading) return <Loader />;
    if (resultError) return <p className="text-center text-destructive">Error: {resultError}</p>;
    if (quizError) return <p className="text-center text-destructive">Error fetching quiz details: {quizError}</p>;
    if (!result || !quiz) return <p>Results not found.</p>;

    // Helper to format time taken
    const formatTime = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}m ${secs}s`;
    }
    
    // Determine score color and title based on percentage
    const scorePercentage = result.percentage.toFixed(1);
    const scoreColor = scorePercentage >= 75 ? 'text-green-500' : scorePercentage >= 50 ? 'text-yellow-500' : 'text-destructive';
    const scoreIcon = scorePercentage >= 75 ? CheckCircle : scorePercentage >= 50 ? XCircle : XCircle;


    return (
        <>
        <Helmet>
            <title>{result ? `Results for "${result.quiz.title}"` : 'Quiz Results'} | ParikshaNode</title>
            <meta name="description" content={result ? `View your score and detailed results for the ${result.quiz.title} quiz.` : 'Review your quiz performance.'} />
        </Helmet>
        <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-top-10 duration-700">
            <Card className="text-center shadow-2xl shadow-primary/30 border-primary/20">
                <CardHeader className="pt-8">
                    <CardTitle className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text 
                                          bg-gradient-to-r from-primary to-destructive drop-shadow-md flex items-center justify-center gap-3">
                        <FileText className="w-8 h-8" /> Quiz Results
                    </CardTitle>
                    <p className="text-lg text-muted-foreground">For: <span className="font-semibold text-foreground">{quiz.title}</span></p>
                </CardHeader>
                
                <CardContent className="pt-4">
                    <div className="p-6 border-2 border-primary/20 rounded-xl bg-secondary/30 shadow-inner mb-8">
                        <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-2">
                            <span className={cn("w-6 h-6", scoreColor)}>{React.createElement(scoreIcon, { className: 'w-full h-full' })}</span>
                            Your Final Score
                        </h2>
                        <p className={cn("text-8xl font-extrabold", scoreColor, "my-4 drop-shadow-xl")}>
                            {scorePercentage}%
                        </p>
                        <p className="text-xl text-muted-foreground font-medium">
                            {result.score} out of {result.totalQuestions} questions correct.
                        </p>
                        
                        {/* --- START: Feature 1: Display Time Taken --- */}
                        {result.timeTakenInSeconds > 0 && (
                            <p className="mt-3 text-lg font-semibold flex items-center justify-center gap-2 text-primary">
                                <Clock className="w-5 h-5"/>
                                Time Taken: {formatTime(result.timeTakenInSeconds)}
                            </p>
                        )}
                        {/* --- END: Feature 1: Display Time Taken --- */}
                    </div>
                    
                    <hr className="my-8 border-t-2 border-border/70" />
                    
                    <div>
                        <h3 className="text-3xl font-bold mb-6 text-left text-foreground/90">Detailed Answer Review</h3>
                        <div className="space-y-6 text-left">
                            {result.answers.map((answer, index) => {
                                // Find the corresponding question in the fetched quiz to get its type/options if needed
                                const question = quiz.questions.find(q => q._id === answer.questionId);
                                if (!question) return null;

                                let userAnswerDisplay = answer.userAnswer || 'Not Answered';
                                let correctAnswerDisplay = answer.correctAnswer;
                                
                                return (
                                    <div 
                                        key={answer.questionId} 
                                        className={cn(
                                            "p-5 rounded-xl transition-all duration-300 border-2",
                                            answer.isCorrect ? "bg-green-500/10 border-green-500/50 shadow-md shadow-green-500/10" : "bg-destructive/10 border-destructive/50 shadow-md shadow-destructive/10"
                                        )}
                                    >
                                        <div className="flex justify-between items-start">
                                            <p className="font-extrabold text-xl mb-2 text-foreground/90">
                                                {index + 1}. {answer.questionText} 
                                            </p>
                                            {answer.isCorrect ? (
                                                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 fill-green-600/20" />
                                            ) : (
                                                <XCircle className="w-6 h-6 text-destructive flex-shrink-0 fill-destructive/20" />
                                            )}
                                        </div>
                                        
                                        <p className="text-md mt-2 font-medium">
                                            Correct Answer: <span className="text-green-600 dark:text-green-400 font-bold">{correctAnswerDisplay}</span>
                                        </p>
                                        
                                        {!answer.isCorrect && (
                                            <p className="text-md mt-1 font-medium text-destructive">
                                                Your Answer: <span className="font-bold">{userAnswerDisplay}</span>
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Type: {question.type.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col sm:flex-row justify-center gap-4 py-6 border-t border-border/50">
                    <Link to="/"><Button className="h-12 px-6 text-lg shadow-primary/40 hover:shadow-primary/60">Back to Home</Button></Link>
                    <Link to={`/leaderboard/${result.quiz._id}`}>
                        <Button variant="outline" className="h-12 px-6 text-lg border-primary/50 text-primary hover:bg-primary/10">
                            <Trophy className="w-5 h-5 mr-2" /> View Leaderboard
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
        </>
    );
};


export default ResultsPage;
