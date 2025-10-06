import React, { useState, useEffect, useMemo, useRef, memo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import Loader from '@/components/Loader';
import { Trophy, Users, Zap, SkipForward, Clock, UserCheck, CheckCircle } from 'lucide-react'; 
import { Helmet } from 'react-helmet-async';
import { useFetch } from '@/hooks/useFetch';
import { cn } from '@/lib/utils';

const SOCKET_SERVER_URL = 'https://parikshanode-server.onrender.com'; 

// --- Extracted Text Input Component (Preserved for focus fix) ---
const MemoizedTextInput = memo(({ questionType, questionIndex, userAnswer, setUserAnswer, isAnswerLocked }) => {
    return (
        <div className="space-y-2" key={`text-input-wrapper-${questionIndex}`}>
            <Input
                // The key must be on the specific element losing focus
                key={`text-input-field-${questionIndex}`} 
                type="text"
                placeholder={questionType === 'fill-in-the-blank' ? 'Enter the missing word/phrase...' : 'Enter your short answer...'}
                value={userAnswer || ''}
                // Set userAnswer state on every change
                onChange={(e) => setUserAnswer(e.target.value)} 
                disabled={isAnswerLocked}
                autoFocus // Keep focus on the field when it mounts
                className="h-12 text-lg border-primary/50 focus:ring-primary focus:ring-offset-0 transition-shadow"
            />
            <p className="text-sm text-muted-foreground">
                {questionType === 'fill-in-the-blank' 
                    ? 'The server only checks for a match based on the first accepted answer.'
                    : 'Enter your answer (case-insensitive check).'
                }
            </p>
        </div>
    );
});
// ------------------------------------------


const LiveQuizPage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    
    // --- HOOKS MUST BE AT THE TOP ---
    const { data: quiz, isLoading: isQuizLoading } = useFetch(quizId ? `/quizzes/${quizId}` : null); 

    const [socket, setSocket] = useState(null);
    const [roomState, setRoomState] = useState({ 
        participants: [], 
        leaderboard: [], 
        status: 'connecting',
        currentQuestion: null, 
        currentQuestionIndex: -1,
        mode: 'manual', 
        autoTime: 0, 
    });
    // userAnswer stores string index for MC/TF, or text for fill/short answer
    const [userAnswer, setUserAnswer] = useState(null); 
    const [isAnswerLocked, setIsAnswerLocked] = useState(false);
    
    const [liveMode, setLiveMode] = useState('manual'); 
    const [autoTimerDuration, setAutoTimerDuration] = useState(30);
    const [visualTimeLeft, setVisualTimeLeft] = useState(0);

    // --- NEW REF FOR DISCONNECT TIMEOUT ---
    const disconnectTimeout = useRef(null);
    // ------------------------------------

    // --- Monitoring State ---
    const [monitoringData, setMonitoringData] = useState([]);
    const [warningCount, setWarningCount] = useState(0);
    const MAX_WARNINGS = 2;

    // Initial default time setup
    useEffect(() => {
        if (quiz && quiz.questions && quiz.questions.length > 0) {
            const defaultTime = quiz.questions[0].timer || 30;
            setAutoTimerDuration(defaultTime);
        }
    }, [quiz]);

    // Client-side countdown for visual feedback
    useEffect(() => {
        if (roomState.mode === 'auto' && roomState.status === 'in-progress') {
            const serverDuration = roomState.autoTime;

            setVisualTimeLeft(serverDuration);

            const interval = setInterval(() => {
                setVisualTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [roomState.currentQuestionIndex, roomState.mode, roomState.status, roomState.autoTime]);


    // 1. Initialize Socket Connection
    useEffect(() => {
        if (!user || isQuizLoading || !quiz) return;

        // Clear any previous disconnect timer before creating a new socket
        if (disconnectTimeout.current) {
            clearTimeout(disconnectTimeout.current);
            disconnectTimeout.current = null;
        }

        const newSocket = io(SOCKET_SERVER_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            // FIX: Clear the disconnect timeout immediately upon successful connection
            if (disconnectTimeout.current) {
                clearTimeout(disconnectTimeout.current);
                disconnectTimeout.current = null;
            }
            newSocket.emit('joinQuizRoom', { quizId, userId: user._id, username: user.username });
        });

        newSocket.on('updateRoomState', (data) => {
            setRoomState(prev => {
                // Reset answer state when a new question arrives
                if (data.currentQuestion && data.currentQuestion.questionIndex !== prev.currentQuestionIndex) {
                    setUserAnswer(null); 
                    setIsAnswerLocked(false);
                    // Reset warnings on a new question to be less aggressive
                    setWarningCount(0);
                    // Optionally reset monitoringData here if server tracks it per question
                    // setMonitoringData([]); 
                    if (data.mode === 'auto') setVisualTimeLeft(data.autoTime); 
                }
                return data;
            });
            
            const message = data.message;
            if (message) {
                const isSpam = message.includes('joined the room!') || 
                               message.includes('reconnected.') ||
                               message.includes('A player disconnected.');
                
                if (!isSpam) {
                    toast.info(message);
                }
            }
        });
        
        newSocket.on('answerFeedback', (data) => {
            toast[data.isCorrect ? 'success' : 'error'](data.message);
        });

        newSocket.on('disconnect', () => {
            // FIX: Use timeout to debounce the disconnect alert
            disconnectTimeout.current = setTimeout(() => {
                setRoomState(prev => ({ ...prev, status: 'disconnected' }));
                toast.error('Disconnected from live server.');
            }, 1000); // Wait 1 second before alerting
        });

        return () => {
            newSocket.disconnect();
            // Cleanup timeout on component unmount
            if (disconnectTimeout.current) {
                clearTimeout(disconnectTimeout.current);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, quizId, isQuizLoading, quiz]);

    // --- Monitoring Logic for Live Quiz (Non-Host Players Only) ---
    useEffect(() => {
        const creatorId = quiz?.createdBy?.toString();
        const isUserHost = user?._id === creatorId;
        
        // Only monitor non-host players and only when the quiz is active
        if (!user || isUserHost || roomState.status !== 'in-progress') return;

        const recordEvent = (eventType, data = {}) => {
            const newEvent = {
                timestamp: new Date().toISOString(),
                event: eventType,
                questionIndex: roomState.currentQuestionIndex,
                ...data
            };
            setMonitoringData(prev => [...prev, newEvent]);
        };

        const handleWarning = () => {
            setWarningCount(prev => {
                const newCount = prev + 1;
                if (newCount > MAX_WARNINGS) {
                    toast.error('Multiple violations detected. Submitting your quiz now.');
                    // In a live environment, you'd likely emit a 'kickPlayer' event.
                    // For now, we simulate submission locking.
                    setIsAnswerLocked(true); 
                } else {
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
    }, [user, quiz, roomState.status, roomState.currentQuestionIndex]);
    // --- END: Monitoring Logic for Live Quiz (Non-Host Players Only) ---

    // --- UTILITY FUNCTIONS ---
    const handleSubmitAnswer = () => {
        // For text input, userAnswer will be a string. For radio, it will be a string index.
        if (!socket || userAnswer === null || isAnswerLocked) return;
        
        // Treat an empty or whitespace answer from a text input as null for validation
        const finalAnswer = (typeof userAnswer === 'string') ? userAnswer.trim() : userAnswer;
        if (!finalAnswer) return; 

        setIsAnswerLocked(true); 
        
        socket.emit('submitLiveAnswer', { 
            quizId, 
            userId: user._id, 
            questionIndex: roomState.currentQuestionIndex, 
            answer: finalAnswer,
            // Send the monitoring data accumulated so far
            monitoringData: monitoringData
        });
    };
    
    const handleStartQuiz = () => {
        if (!socket) return;
        socket.emit('startQuiz', { quizId, mode: liveMode, autoTime: Number(autoTimerDuration) || 30 });
    }
    
    const handleNextQuestion = () => {
        if (!socket) return;
        socket.emit('nextQuestionHost', { quizId }); 
    }
    
    const handleNavigateHome = () => {
        if (socket) socket.disconnect();
        navigate('/');
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    // --------------------------


    // --- CALCULATED STATE ---
    const currentQuestionDetails = useMemo(() => {
        if (roomState.currentQuestionIndex === -1 || !quiz || !quiz.questions) return null;
        // Find the full question object from the original quiz data for type info
        return quiz.questions[roomState.currentQuestionIndex];
    }, [quiz, roomState.currentQuestionIndex]);
    
    const creatorId = quiz?.createdBy?.toString(); 
    const isUserHost = user?._id === creatorId;
    
    const hostUsername = roomState.participants.find(p => p.userId === creatorId)?.username || quiz?.createdBy?.username || 'Host';

    const nonHostParticipants = roomState.participants.filter(p => p.userId !== creatorId);
    const playersAnswered = nonHostParticipants.filter(p => p.lastAnsweredIndex === roomState.currentQuestionIndex).length;
    const totalUsersWhoShouldAnswer = nonHostParticipants.length; 
    
    const allNonHostsAnswered = totalUsersWhoShouldAnswer > 0 && playersAnswered === totalUsersWhoShouldAnswer;
    const atLeastOneAnswered = playersAnswered > 0;
    
    // Filter out the Host from the displayed leaderboard
    const leaderboardDisplay = useMemo(() => {
        return roomState.leaderboard.filter(p => p.userId !== creatorId);
    }, [roomState.leaderboard, creatorId]);
    // -----------------------------------------------------


    // --- RENDER CONDITIONALS (Prevents crash if data is loading) ---
    if (isQuizLoading || !user) return <Loader />;
    if (!quiz) return <p className="text-center text-destructive">Quiz not found.</p>;


    // ----------------------------------------------------------------------
    // --- NESTED COMPONENTS DEFINITIONS (Ensure all components are defined) ---
    // ----------------------------------------------------------------------

    const FinishedPanel = () => (
        <div className="text-center py-10 space-y-6">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500 flex items-center justify-center gap-3">
                <CheckCircle className="w-8 h-8"/> GAME OVER!
            </h2>
            <p className="text-lg text-muted-foreground">The final results are displayed on the leaderboard below.</p>
            
            <div className="mx-auto max-w-sm p-4 rounded-xl border border-primary/30 shadow-xl bg-card/70">
                <h3 className="text-xl font-bold mb-2">🏆 Winner</h3>
                <CardContent className="p-0">
                    {leaderboardDisplay.length > 0 ? (
                        <p className="text-3xl font-extrabold text-yellow-500 drop-shadow-md">
                            {leaderboardDisplay[0]?.username || 'N/A'} ({leaderboardDisplay[0]?.score || 0} pts)
                        </p>
                    ) : (
                        <p className="text-lg">No winner found among active players.</p>
                    )}
                </CardContent>
            </div>

            <Button onClick={handleNavigateHome} className="w-full max-w-sm mt-6 shadow-lg hover:shadow-xl transition-all">
                Return to Home
            </Button>
        </div>
    );

    const HostControlPanel = () => (
        <div className="space-y-6 py-6">
            <h3 className="text-2xl font-bold flex items-center gap-2 text-primary drop-shadow-sm"><Zap className="w-6 h-6 fill-primary/30"/> Host Control Panel</h3>
            <Card className="p-4 bg-secondary/70 border-primary/30 shadow-lg">
                <p className="font-extrabold text-xl">{roomState.currentQuestion?.text || 'Quiz is loading or finished.'}</p>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-border/50">
                    <span className="text-lg text-muted-foreground">Question: <span className="font-bold text-foreground">{roomState.currentQuestionIndex + 1} / {quiz.questions?.length || 0}</span></span>
                    <span className="text-green-500 font-bold text-lg">{playersAnswered}/{totalUsersWhoShouldAnswer} Answered</span> 
                </div>
            </Card>

            <div className="space-y-3">
                {roomState.mode === 'manual' ? (
                    <Button 
                        onClick={handleNextQuestion} 
                        disabled={!atLeastOneAnswered}
                        className="w-full h-14 text-lg shadow-primary/40 hover:shadow-primary/60 transition-all duration-300"
                    >
                        <SkipForward className="w-5 h-5 mr-2" /> 
                        {roomState.currentQuestionIndex + 1 >= (quiz.questions?.length || 0) ? 'End Game & Show Results' : (allNonHostsAnswered ? 'Show Results & Next Question' : 'Skip & Next Question')}
                    </Button>
                ) : (
                    <div className="text-center p-4 border rounded-lg bg-secondary/50 shadow-inner">
                        <p className="text-md font-medium flex items-center justify-center gap-1 text-red-500 mb-1">
                            <Clock className="w-5 h-5" /> AUTO ADVANCE ACTIVE
                        </p>
                        <p className="text-4xl font-extrabold text-primary">
                            {formatTime(visualTimeLeft)}
                        </p>
                    </div>
                )}
                
                {allNonHostsAnswered && roomState.mode === 'manual' ? (
                    <p className="text-center text-sm text-green-500 font-medium flex items-center justify-center gap-1"><UserCheck className="w-4 h-4"/> All players have submitted!</p>
                ) : (
                    <p className="text-center text-sm text-muted-foreground">
                        {roomState.mode === 'manual' ? 
                            'You control when to move to the next question.' : 
                            'Waiting for timer to expire.'
                        }
                    </p>
                )}
            </div>
        </div>
    );

    const PlayerQuizInterface = () => {
        const questionType = currentQuestionDetails?.type;
        
        // This helper renders the correct input based on question type
        const renderInput = () => {
            if (questionType === 'multiple-choice' || questionType === 'true-false') {
                const options = roomState.currentQuestion?.options || [];
                
                return (
                    <RadioGroup 
                        // For MC/TF, value must be the string index
                        value={userAnswer || ''} 
                        onValueChange={setUserAnswer} 
                        disabled={isAnswerLocked}
                    >
                        {options.map((option, index) => (
                            <div key={index} className={cn(
                                "flex items-center space-x-3 p-4 border-2 rounded-xl transition-all duration-200 cursor-pointer",
                                isAnswerLocked && String(userAnswer) === String(index) ? "bg-primary/20 border-primary shadow-md" : "hover:bg-secondary/70 border-border/70"
                            )}>
                                <RadioGroupItem value={String(index)} id={`live-q-${index}`} />
                                <Label htmlFor={`live-q-${index}`} className="flex-1 text-lg font-medium cursor-pointer">{option}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                );
            }

            if (questionType === 'fill-in-the-blank' || questionType === 'short-answer') {
                // FIX: Use the memoized component for stable text input
                return (
                    <MemoizedTextInput 
                        questionType={questionType}
                        questionIndex={roomState.currentQuestionIndex}
                        userAnswer={userAnswer}
                        setUserAnswer={setUserAnswer}
                        isAnswerLocked={isAnswerLocked}
                    />
                );
            }
            
            return <p className="text-destructive">Unsupported question type for live quiz.</p>;
        }

        // Determine button disable state: 
        const isTextType = questionType === 'fill-in-the-blank' || questionType === 'short-answer';
        const isAnswerEmpty = isTextType && (!userAnswer || String(userAnswer).trim() === '');
        // Disable if locked OR (answer is null AND it's a non-text type) OR (it's a text type AND the string is empty)
        const isSubmitDisabled = isAnswerLocked || (userAnswer === null && !isTextType) || isAnswerEmpty;


        return (
            <div className="space-y-6">
                <h3 className="text-2xl font-extrabold text-foreground/90">Q{roomState.currentQuestionIndex + 1}: {roomState.currentQuestion?.text || 'Loading...'}</h3>
                
                {renderInput()}

                <Button 
                    onClick={handleSubmitAnswer} 
                    disabled={isSubmitDisabled} 
                    className="w-full h-14 text-lg shadow-lg transition-all duration-300"
                >
                    {isAnswerLocked ? 'Answer Submitted' : 'Lock In Answer'}
                </Button>
                {isAnswerLocked && <p className="text-center text-sm font-semibold text-green-500 border-t border-green-500/50 pt-2">
                    <CheckCircle className="w-4 h-4 inline mr-1"/> Answer submitted. Waiting for host to advance.
                </p>}
                {warningCount > 0 && <p className="text-center text-sm text-red-500 font-medium">⚠️ {warningCount} out of {MAX_WARNINGS} warnings received. Cheating may lead to score submission failure.</p>}
            </div>
        );
    }
    
    const HostLobbyPanel = () => (
        <div className="text-center py-10 space-y-6 animate-in fade-in zoom-in-90 duration-500">
            <h2 className="text-3xl font-bold text-primary">Lobby Active</h2>
            <p className="text-lg text-muted-foreground">Current Players: <span className="font-bold text-foreground">{roomState.participants?.length || 0}</span></p>
            
            {isUserHost ? (
                <>
                    <Card className="p-5 mx-auto max-w-sm space-y-4 shadow-xl border-primary/30">
                        <div className="space-y-2">
                            <Label className="text-lg font-bold flex items-center justify-center text-foreground">Advance Mode</Label>
                            <RadioGroup value={liveMode} onValueChange={setLiveMode} className="flex justify-center space-x-6">
                                <div className="flex items-center space-x-2"><RadioGroupItem value="manual" id="mode-manual" /><Label htmlFor="mode-manual">Manual</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="auto" id="mode-auto" /><Label htmlFor="mode-auto">Automatic (Timed)</Label></div>
                            </RadioGroup>
                        </div>
                        
                        {liveMode === 'auto' && (
                            <div className="space-y-2">
                                <Label htmlFor="auto-timer" className="text-sm">Auto-Advance Time (seconds)</Label>
                                <Input 
                                    id="auto-timer"
                                    type="number"
                                    min="5"
                                    value={autoTimerDuration}
                                    onChange={(e) => setAutoTimerDuration(e.target.value)}
                                    className="text-center h-10"
                                />
                            </div>
                        )}
                    </Card>

                    <Button onClick={handleStartQuiz} disabled={(roomState.participants?.length || 0) < 1} className="w-full max-w-sm h-12 text-lg shadow-primary/50 hover:shadow-primary/70">
                        <Zap className="w-5 h-5 mr-2" /> Start Quiz
                    </Button>
                </>
            ) : (
                <Button disabled variant="outline" className="w-full max-w-sm h-12">
                    Waiting for Host ({hostUsername}) to Start
                </Button>
            )}
        </div>
    );


    return (
        <>
            <Helmet>
                <title>Live Quiz: {quiz.title} | ParikshaNode</title>
                <meta name="description" content={`Join the live multiplayer quiz for ${quiz.title}.`} />
            </Helmet>
            <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-8 my-8 animate-in fade-in duration-500">
                {/* Main Quiz Area */}
                <Card className="lg:col-span-2 shadow-2xl shadow-primary/20 border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-3xl font-extrabold flex items-center justify-between text-transparent bg-clip-text bg-gradient-to-r from-primary to-destructive">
                            <span>LIVE GAME: {quiz.title.toUpperCase()}</span>
                            <span className={`text-xl font-bold ${roomState.status === 'in-progress' ? 'text-green-500' : 'text-yellow-500'}`}>
                                {roomState.status.toUpperCase()}
                            </span>
                        </CardTitle>
                        <CardDescription className="text-lg">Hosted by: <span className="font-semibold text-foreground">{hostUsername}</span></CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Render Loader for initial state */}
                        {roomState.status === 'connecting' && <Loader />}

                        {/* Render Lobby or Quiz based on status */}
                        {roomState.status === 'waiting' && HostLobbyPanel()}

                        {roomState.status === 'in-progress' && roomState.currentQuestion && (
                            isUserHost ? <HostControlPanel /> : <PlayerQuizInterface />
                        )}
                        
                        {/* FINISHED State Handler */}
                        {roomState.status === 'finished' && <FinishedPanel />} 

                        {roomState.status === 'disconnected' && (
                             <div className="text-center py-10 space-y-4">
                                 <h2 className="text-xl font-semibold text-destructive">Connection Lost</h2>
                                 <p className="text-muted-foreground">Please refresh the page to try and reconnect.</p>
                             </div>
                        )}
                    </CardContent>
                </Card>

                {/* Sidebar: Leaderboard and Players */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Leaderboard Card */}
                    <Card className="shadow-xl border-primary/20">
                        <CardHeader className="p-4 border-b border-primary/30 bg-secondary/50 rounded-t-lg">
                            <CardTitle className="text-xl flex items-center gap-2 font-bold"><Trophy className="w-6 h-6 text-primary" /> Live Leaderboard</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <ul className="space-y-2">
                                {leaderboardDisplay.length > 0 ? (
                                    leaderboardDisplay.map((p, index) => (
                                        <li key={p.userId} className={cn(
                                            "flex justify-between items-center p-3 rounded-md text-md border-b border-dashed border-border/50 transition-all duration-300 hover:bg-accent/50",
                                            index === 0 ? 'bg-yellow-500/10 border-yellow-500 font-extrabold shadow-md' : '',
                                            p.userId === user?._id ? 'bg-primary/20 border-primary font-bold' : ''
                                        )}>
                                            <span>{index + 1}. {p.username}</span>
                                            <span className={index === 0 ? 'text-yellow-500' : 'text-primary'}>{p.score} pts</span> 
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground text-sm py-2">No scores yet, waiting for the first question...</p>
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                    
                    {/* Players Card */}
                    <Card className="shadow-xl border-secondary/20">
                        <CardHeader className="p-4 border-b border-secondary/30">
                            <CardTitle className="text-xl flex items-center gap-2 font-bold"><Users className="w-6 h-6 text-foreground/70" /> All Players ({roomState.participants.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <ul className="space-y-2">
                                {roomState.participants.map(p => (
                                    <li key={p.userId} className={cn(
                                        "flex justify-between items-center text-md",
                                        p.userId === user?._id ? 'font-bold text-primary' : 'text-muted-foreground'
                                    )}>
                                        <span>{p.username}</span>
                                        {p.userId === creatorId && <span className="font-medium">(Host)</span>}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default LiveQuizPage;
