import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import { Input } from '@/components/ui/Input'; // Import Input for text answers
import { Label } from '@/components/ui/Label';
import { Lock, HelpCircle, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils'; // Import cn utility

const QuizPage = () => {
    const { id: quizId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    // Fetch quiz data and the user's entire quiz history for a more reliable check.
    const { data: quiz, isLoading: isQuizLoading, error } = useFetch(`/quizzes/${quizId}`);
    const { data: history, isLoading: isHistoryLoading } = useFetch(user ? '/results/my-history' : null);

    const [quizStarted, setQuizStarted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({}); 
    const [overallTimeLeft, setOverallTimeLeft] = useState(0);

    // --- START: Feature 1: Time Tracking ---
    const quizStartTime = useRef(null);
    // --- END: Feature 1: Time Tracking ---

    // New state for monitoring
    const [monitoringData, setMonitoringData] = useState([]);
    const [warningCount, setWarningCount] = useState(0);
    const MAX_WARNINGS = 2;

    // FIX: Ref to persist the last warning time across renders (for effective debouncing)
    const lastWarningTimeRef = useRef(0);
    const WARNING_DEBOUNCE_MS = 500; // Increased time buffer to ensure suppression


    // Check if the fetched history contains a result for the current quiz.
    const previousAttempt = useMemo(() => {
        if (!user || !history) return null;
        // Find a result where the quiz ID matches the one from the URL.
        return history.find(result => {
            const attemptedQuizId = result.quiz?._id || result.quiz;
            return attemptedQuizId === quizId;
        });
    }, [history, quizId, user]);


    // Redirect the user if a previous attempt was found.
    useEffect(() => {
        if (previousAttempt) {
            toast.info('You have already completed this quiz.');
            // Use the ID from the found result object for the redirect.
            navigate(`/results/${previousAttempt._id}`, { replace: true });
        }
    }, [previousAttempt, navigate]);


    useEffect(() => {
        if (quiz && quiz.timerType === 'overall') {
            setOverallTimeLeft(quiz.timer * 60);
        }
    }, [quiz]);

    // New useEffect for monitoring events, active only when the quiz has started
    useEffect(() => {
        if (!quizStarted) return;

        const recordEvent = (eventType, data = {}) => {
            const newEvent = {
                timestamp: new Date().toISOString(),
                eventType,
                ...data
            };
            setMonitoringData(prev => [...prev, newEvent]);
        };

        const handleSubmitAndAlert = () => {
             // Use this helper to ensure handleSubmit is only called once
             if (isSubmitting) return;
             handleSubmit();
        };

        const handleWarning = () => {
            const now = Date.now();
            
            // FIX: Check against the persistent ref value for debouncing
            if (now - lastWarningTimeRef.current < WARNING_DEBOUNCE_MS) {
                return; // Suppress duplicate events within the debounce window
            }
            lastWarningTimeRef.current = now; // Update the persistent ref time

            setWarningCount(prev => {
                const newCount = prev + 1;
                if (newCount > MAX_WARNINGS) {
                    toast.error('Multiple violations detected. Submitting your quiz now.');
                    handleSubmitAndAlert();
                } else {
                    // We use `warningCount` from state inside toast message, which is fine
                    toast.warn(`Warning ${newCount}/${MAX_WARNINGS}: Leaving the quiz window or using copy/paste is not allowed.`);
                }
                return newCount;
            });
        };

        const handleCopyPaste = (event) => {
            const eventType = event.type;
            const data = event.clipboardData ? event.clipboardData.getData('text') : null;
            recordEvent(eventType, { clipboardData: data });
            handleWarning();
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                recordEvent('tab_switch_away');
                handleWarning();
            } else {
                recordEvent('tab_switch_back');
            }
        };

        window.addEventListener('copy', handleCopyPaste);
        window.addEventListener('cut', handleCopyPaste);
        window.addEventListener('paste', handleCopyPaste);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('copy', handleCopyPaste);
            window.removeEventListener('cut', handleCopyPaste);
            window.removeEventListener('paste', handleCopyPaste);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [quizStarted, navigate, quizId, isSubmitting]); // Removed warningCount from deps as it's modified in the setter


    const handleStartQuiz = () => {
        setQuizStarted(true);
        // --- START: Feature 1: Record Start Time ---
        quizStartTime.current = Date.now();
        // --- END: Feature 1: Record Start Time ---
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            handleSubmit();
        }
    };

    // Generalized answer handler for any input type
    const handleAnswerSelect = (questionId, value) => {
        setUserAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        
        // --- START: Feature 1: Calculate and Send Time Taken ---
        const endTime = Date.now();
        const timeTakenInSeconds = quizStartTime.current 
            ? Math.floor((endTime - quizStartTime.current) / 1000) 
            : 0; // Fallback to 0 if start time wasn't recorded
        // --- END: Feature 1: Calculate and Send Time Taken ---

        try {
            const response = await api.post(`/quizzes/${quizId}/submit`, { 
                userAnswers, 
                monitoringData,
                timeTakenInSeconds // Send time taken
            });
            toast.success('Quiz submitted successfully!');
            navigate(`/results/${response.data.resultId}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit quiz.');
            setIsSubmitting(false);
        }
    };

    // Update loading check to include history loading.
    if (isQuizLoading || (user && isHistoryLoading)) return <Loader />;
    if (error) return <p className="text-center text-destructive mt-8">Error: {error}</p>;
    if (!quiz) return <p className="text-center mt-8">Quiz not found.</p>;

    // If a previous attempt exists, render nothing while the redirect happens.
    if (previousAttempt) {
        return null;
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
    
    // FIX APPLIED HERE: Check explicitly for undefined to allow 0 to be a valid answer value.
    const currentAnswer = userAnswers[currentQuestion._id] !== undefined ? userAnswers[currentQuestion._id] : '';

    // --- START: Feature 4: Dynamic Question Renderer ---
    const renderQuestionInput = () => {
        const questionType = currentQuestion.type || 'multiple-choice';
        
        switch (questionType) {
            case 'true-false':
            case 'multiple-choice': {
                const options = currentQuestion.options || [];
                
                // Handle True/False options if not explicitly set (default to T/F strings)
                const isTrueFalse = questionType === 'true-false';
                const displayOptions = isTrueFalse && options.length === 0 ? ['True', 'False'] : options;

                return (
                    <RadioGroup
                        // For MC/T-F, store the index as a number in state, but use string for RadioGroup
                        value={typeof currentAnswer === 'number' ? String(currentAnswer) : ''}
                        onValueChange={(value) => handleAnswerSelect(currentQuestion._id, parseInt(value))}
                    >
                        {displayOptions.map((option, index) => (
                            <div
                                key={index}
                                // ENHANCEMENT: Modern Radio option styling with hover and selected feedback
                                className={cn(
                                    "flex items-center space-x-3 p-4 border-2 rounded-xl transition-all duration-300 cursor-pointer",
                                    (currentAnswer !== '' && parseInt(currentAnswer) === index) ? "bg-primary/20 border-primary shadow-md" : "hover:bg-secondary/70 border-border/70 hover:border-primary/50"
                                )}
                            >
                                <RadioGroupItem value={index.toString()} id={`${currentQuestion._id}-${index}`} />
                                <Label htmlFor={`${currentQuestion._id}-${index}`} className="text-lg flex-1 font-medium cursor-pointer">
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                );
            }
            case 'fill-in-the-blank':
            case 'short-answer':
                return (
                    <div className="space-y-4">
                        <Label htmlFor={`answer-${currentQuestion._id}`} className="sr-only">Your Answer</Label>
                        <Input
                            id={`answer-${currentQuestion._id}`}
                            type="text"
                            value={currentAnswer}
                            onChange={(e) => handleAnswerSelect(currentQuestion._id, e.target.value)}
                            placeholder="Type your answer here..."
                            // ENHANCEMENT: Modern Input styling
                            className="h-12 text-lg border-input/50 focus-visible:ring-primary focus-visible:border-primary/80 transition-all duration-300"
                        />
                        <p className="text-sm text-muted-foreground">
                            {questionType === 'fill-in-the-blank' 
                                ? 'Enter the word or phrase that completes the blank.'
                                : 'Enter your short answer. Spelling counts!'
                            }
                        </p>
                    </div>
                );
            
            default:
                return <p className="text-destructive">Unsupported Question Type.</p>;
        }
    };
    // --- END: Feature 4: Dynamic Question Renderer ---


    return (
        <>
            <Helmet>
                <title>{`Take the "${quiz.title}" Quiz | ParikshaNode`}</title>
                <meta name="description" content={quiz.description} />
            </Helmet>

            <div className="max-w-4xl mx-auto relative my-8 px-4">
                {/* Login Overlay (Modernized) */}
                {!user && (
                    <div className="absolute inset-0 bg-background/90 backdrop-blur-md z-10 flex items-center justify-center rounded-xl shadow-2xl shadow-primary/40">
                        <div className="text-center p-10 bg-card/90 border border-primary/30 rounded-xl animate-in zoom-in-90 duration-500">
                            <Lock className="mx-auto h-14 w-14 text-primary mb-4 drop-shadow-md" />
                            <h2 className="text-2xl font-bold mb-2">Login to Start the Quiz</h2>
                            <p className="text-muted-foreground mb-6 text-lg">
                                Create an account or log in to save your score and track your history.
                            </p>
                            <div className="flex justify-center gap-4">
                                <Link to={`/login?redirect=/quiz/${quizId}`}><Button className="h-12 shadow-primary/40">Login</Button></Link>
                                <Link to="/register"><Button variant="outline" className="h-12 border-primary/50 text-primary">Sign Up</Button></Link>
                            </div>
                        </div>
                    </div>
                )}

                <Card className="shadow-2xl shadow-primary/20 border-primary/20 animate-in fade-in duration-700">
                    {/* Quiz Details / Start Screen */}
                    {!quizStarted ? (
                        <>
                            <CardHeader className="text-center pt-8">
                                <CardTitle className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text 
                                                      bg-gradient-to-r from-primary to-destructive drop-shadow-md">
                                    {quiz.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center text-center p-10 space-y-8">
                                <p className="text-lg text-muted-foreground max-w-prose">{quiz.description}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xl font-semibold">
                                    <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-secondary/50 border border-border/70">
                                        <HelpCircle className="h-6 w-6 text-primary" />
                                        <span>{quiz.questions.length} Questions</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-secondary/50 border border-border/70">
                                        <Clock className="h-6 w-6 text-primary" />
                                        <span>
                                            {quiz.timerType === 'overall'
                                                ? `${quiz.timer} Minutes (Overall)`
                                                : quiz.timerType === 'per_question'
                                                ? 'Timed per question'
                                                : 'No Time Limit'}
                                        </span>
                                    </div>
                                </div>
                                <Button size="lg" onClick={handleStartQuiz} className="h-14 text-xl shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-all duration-300 animate-pulse hover:animate-none">
                                    Start Quiz Now
                                </Button>
                            </CardContent>
                        </>
                    ) : (
                        <>
                            {/* Quiz In-Progress View */}
                            <CardHeader className="flex flex-row items-center justify-between space-x-6 py-6">
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-foreground/90">{quiz.title}</h2>
                                    <div className="w-full bg-secondary rounded-full h-3 mt-2 overflow-hidden border border-border/70">
                                        <div className="bg-primary h-3 rounded-full shadow-lg shadow-primary/40 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                                    </div>
                                    <p className="text-sm font-medium mt-1 text-primary">{Math.round(progress)}% Complete</p>
                                </div>
                                {quiz.timerType === 'overall' && overallTimeLeft > 0 && (
                                    <Timer seconds={overallTimeLeft} onTimeUp={handleSubmit} />
                                )}
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="p-6 border-2 border-primary/20 rounded-xl bg-secondary/30 shadow-inner">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-extrabold text-foreground/90">
                                            Q{currentQuestionIndex + 1}. {currentQuestion.text}
                                        </h2>
                                        {quiz.timerType === 'per_question' && (
                                            <Timer
                                                key={currentQuestionIndex}
                                                seconds={currentQuestion.timer}
                                                onTimeUp={handleNext}
                                            />
                                        )}
                                    </div>
                                    {/* --- START: Dynamic Question Input Render --- */}
                                    {renderQuestionInput()}
                                    {/* --- END: Dynamic Question Input Render --- */}
                                </div>
                                
                                {warningCount > 0 && 
                                    <p className="text-center text-red-500 font-medium mt-4">
                                        ⚠️ Warning {warningCount}/{MAX_WARNINGS} received. Focus is important!
                                    </p>
                                }

                                <div className="mt-8 flex justify-end">
                                    {currentQuestionIndex === quiz.questions.length - 1 ? (
                                        <Button 
                                            onClick={handleSubmit} 
                                            disabled={isSubmitting || currentAnswer === ''} 
                                            variant="destructive"
                                            className="h-12 text-lg px-8 shadow-destructive/40 hover:shadow-destructive/60 transition-all duration-300"
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Finish & Submit Quiz'}
                                        </Button>
                                    ) : (
                                        <Button 
                                            onClick={handleNext} 
                                            disabled={currentAnswer === ''}
                                            className="h-12 text-lg px-8 shadow-primary/40 hover:shadow-primary/60 transition-all duration-300"
                                        >
                                            Next Question
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </>
                    )}
                </Card>
            </div>
        </>
    );
};

export default QuizPage;
