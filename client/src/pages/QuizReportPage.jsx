import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Avatar from '@/components/ui/Avatar';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
// FIX: Added Users to the import list
import { ArrowLeft, Trophy, BarChart, Clock, Hash, CheckCircle, XCircle, Users } from 'lucide-react'; 
import { cn } from '@/lib/utils'; 

const QuizReportPage = () => {
    const { quizId } = useParams();
    const { data, isLoading, error } = useFetch(`/results/report/${quizId}`);

    if (isLoading) return <Loader />;
    if (error) return <p className="text-center text-destructive">Error: {error}</p>;
    if (!data || !data.quiz) return <p className="text-center">Report not found.</p>;

    const { quiz, report, analytics } = data; // Destructure the new analytics object

    // Helper to format average time in seconds to minutes and seconds
    const formatAvgTime = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = Math.floor(totalSeconds % 60); // Use Math.floor for seconds
        return `${mins}m ${secs}s`;
    }
    
    // Helper to determine score text color
    const getScoreColor = (percentage) => {
        if (percentage >= 75) return 'text-green-500';
        if (percentage >= 50) return 'text-yellow-500';
        return 'text-destructive';
    };
    
    // Helper for table row styling
    const getRowClass = (index) => {
        if (index === 0) return 'bg-yellow-500/10 border-primary/50 font-bold hover:bg-yellow-500/20 shadow-lg shadow-yellow-500/10';
        return 'hover:bg-accent/50';
    };


    return (
        <>
            <Helmet>
                <title>Quiz Report: "{quiz.title}" | ParikshaNode</title>
                <meta name="description" content={`Detailed report for the quiz "${quiz.title}", including all attempts, scores, and rankings.`} />
            </Helmet>
            <div className="max-w-5xl mx-auto py-8 space-y-8 animate-in fade-in duration-700">
                <div className="flex items-center gap-4 mb-8 border-b border-border/50 pb-4">
                    <Link to="/my-quizzes"><ArrowLeft className="w-8 h-8 text-muted-foreground hover:text-primary transition-colors" /></Link>
                    <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text 
                                    bg-gradient-to-r from-primary to-destructive drop-shadow-md">
                        Quiz Report: {quiz.title}
                    </h1>
                </div>

                {/* --- START: Feature 1: Quiz Analytics Card --- */}
                <Card className="shadow-xl shadow-secondary/30 border-primary/20 animate-in slide-in-from-bottom-8 duration-700 delay-100">
                    <CardHeader>
                        <CardTitle className="text-3xl flex items-center gap-3 font-bold text-foreground/90"><BarChart className="w-7 h-7 text-primary" /> Performance Analytics</CardTitle>
                        <CardDescription className="text-lg">Key statistics calculated across all {analytics.totalAttempts} attempts.</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Analytic Tiles */}
                        {[
                            { title: 'Attempts', value: analytics.totalAttempts, icon: Users, color: 'text-foreground' }, // Used Users icon
                            { title: 'Avg. Score', value: `${analytics.avgPercentage}%`, icon: CheckCircle, color: getScoreColor(parseFloat(analytics.avgPercentage)) },
                            { title: 'Avg. Time', value: formatAvgTime(analytics.avgTimeInSeconds), icon: Clock, color: 'text-primary' },
                            { title: 'Total Qs', value: quiz.questions.length, icon: Hash, color: 'text-foreground' },
                        ].map((item, index) => (
                            <div key={index} className="flex flex-col border border-border/70 p-4 rounded-xl shadow-lg bg-secondary/50 transition-all duration-300 hover:scale-[1.03]">
                                <p className="text-sm text-muted-foreground">{item.title}</p>
                                <p className={cn("text-3xl font-extrabold mt-1", item.color)}>
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </CardContent>
                    
                    {analytics.mostMissedQuestions.length > 0 && (
                        <CardContent className="pt-0">
                            <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-destructive">
                                <XCircle className="w-5 h-5 fill-destructive/30" /> Top 5 Most Missed Questions
                            </h3>
                            <ul className="list-disc pl-8 space-y-2 border border-destructive/20 p-4 rounded-lg bg-destructive/5">
                                {analytics.mostMissedQuestions.map((q, index) => (
                                    <li key={q.questionId} className="text-md text-foreground/90">
                                        <span className="font-extrabold text-destructive mr-2">({q.missedCount} misses)</span>
                                        {q.text}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    )}
                </Card>
                {/* --- END: Feature 1: Quiz Analytics Card --- */}

                {/* Attempt History Table */}
                <Card className="shadow-xl border-primary/20 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-foreground/90">Detailed Attempt History</CardTitle>
                        <CardDescription>All results, ranked by score.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {report && report.length > 0 ? (
                            <div className="overflow-x-auto border rounded-xl shadow-inner">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-secondary/70">
                                            <TableHead className="w-[100px] text-center text-lg font-bold">Rank</TableHead>
                                            <TableHead className="text-lg font-bold">User</TableHead>
                                            <TableHead className="text-right text-lg font-bold">Score</TableHead>
                                            <TableHead className="text-right text-lg font-bold">Percentage</TableHead>
                                            <TableHead className="text-right text-lg font-bold">Time Taken</TableHead> 
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {report.map((entry, index) => (
                                            <TableRow 
                                                key={entry._id}
                                                className={cn("transition-all duration-300", getRowClass(index))}
                                            >
                                                <TableCell className="font-medium text-center flex justify-center items-center h-full pt-6">
                                                    {index === 0 ? <Trophy className="w-6 h-6 text-yellow-400 drop-shadow-md" fill="gold" /> : <span className="text-lg font-bold">{index + 1}</span>}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar src={entry.user?.avatar?.url} alt={entry.user?.username} size="sm" />
                                                        <span className="font-semibold text-foreground/90">{entry.user?.username || 'Deleted User'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right text-lg font-bold text-primary">{`${entry.score} / ${entry.totalQuestions}`}</TableCell>
                                                <TableCell className="text-right text-lg font-extrabold" style={{ color: getScoreColor(entry.percentage) }}>{`${entry.percentage.toFixed(1)}%`}</TableCell>
                                                <TableCell className="text-right font-medium text-muted-foreground">{formatAvgTime(entry.timeTakenInSeconds)}</TableCell> 
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground py-10 border-2 border-dashed border-border/50 rounded-lg">No one has attempted this quiz yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default QuizReportPage;
