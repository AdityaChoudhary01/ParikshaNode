import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Avatar from '@/components/ui/Avatar';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy } from 'lucide-react';

const QuizReportPage = () => {
    const { quizId } = useParams();
    const { data, isLoading, error } = useFetch(`/results/report/${quizId}`);

    if (isLoading) return <Loader />;
    if (error) return <p className="text-center text-destructive">Error: {error}</p>;
    if (!data || !data.quiz) return <p className="text-center">Report not found.</p>;

    const { quiz, report } = data;

    return (
        <>
            <Helmet>
                <title>Quiz Report: "{quiz.title}" | ParikshaNode</title>
                <meta name="description" content={`Detailed report for the quiz "${quiz.title}", including all attempts, scores, and rankings.`} />
            </Helmet>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Link to="/my-quizzes"><ArrowLeft className="w-6 h-6 hover:text-primary transition-colors" /></Link>
                    <h1 className="text-3xl font-bold">Quiz Report</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">{quiz.title}</CardTitle>
                        <CardDescription>All attempts and scores for this quiz.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {report && report.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px] text-center">Rank</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead className="text-right">Score</TableHead>
                                        <TableHead className="text-right">Percentage</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {report.map((entry, index) => (
                                        <TableRow key={entry._id}>
                                            <TableCell className="font-medium text-center flex justify-center items-center h-full pt-6">
                                                {index === 0 ? <Trophy className="text-yellow-500" /> : index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar src={entry.user?.avatar?.url} alt={entry.user?.username} size="sm" />
                                                    <span className="font-medium">{entry.user?.username || 'Deleted User'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">{`${entry.score} / ${entry.totalQuestions}`}</TableCell>
                                            <TableCell className="text-right">{`${entry.percentage.toFixed(1)}%`}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-center text-muted-foreground py-10">No one has attempted this quiz yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default QuizReportPage;
