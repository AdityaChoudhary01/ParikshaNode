import React from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/Button';
import { Eye, Clock, ListChecks } from 'lucide-react'; // Added Clock and ListChecks for visual detail
import { Helmet } from 'react-helmet-async';
import { cn } from '@/lib/utils'; // Import cn utility for dynamic classes

const HistoryPage = () => {
  const { data: history, isLoading, error } = useFetch('/results/my-history');

  if (isLoading) return <Loader />;
  if (error) return <p className="text-center text-destructive">Error: {error}</p>;

  // Helper function for score coloring
  const getScoreColor = (percentage) => {
    if (percentage >= 75) return 'text-green-500';
    if (percentage >= 50) return 'text-yellow-500';
    return 'text-destructive';
  };

  return (
    <>
      <Helmet>
        <title>My Quiz History | ParikshaNode</title>
        <meta name="description" content="Review all the quizzes you have attempted on ParikshaNode, check your scores, and view detailed results." />
      </Helmet>
    <Card className="max-w-5xl mx-auto shadow-2xl shadow-primary/20 animate-in fade-in slide-in-from-top-10 duration-700">
      <CardHeader className="text-center pt-8 pb-6">
        <ListChecks className="w-10 h-10 mx-auto text-primary" />
        <CardTitle className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text 
                              bg-gradient-to-r from-primary to-destructive">
            My Quiz History
        </CardTitle>
        <CardDescription className="text-lg">A detailed record of all the quizzes you've completed.</CardDescription>
      </CardHeader>
      <CardContent>
        {history && history.length > 0 ? (
          <div className="overflow-x-auto border rounded-xl shadow-inner">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/70">
                  <TableHead className="text-lg">Quiz Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead><Clock className="w-4 h-4 inline mr-1" /> Date Taken</TableHead>
                  <TableHead className="text-right">Score (%)</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((result) => (
                  <TableRow key={result._id} className="hover:bg-primary/5 transition-all duration-200">
                    <TableCell className="font-semibold text-lg text-foreground/90">
                        {result.quiz.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{result.quiz.category}</TableCell>
                    <TableCell>{new Date(result.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className={cn("text-right font-extrabold text-lg", getScoreColor(result.percentage))}>
                        {`${result.score} / ${result.totalQuestions}`} <span className="text-sm">({result.percentage.toFixed(1)}%)</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link to={`/results/${result._id}`}>
                        <Button 
                            variant="outline" 
                            size="sm"
                            className="text-primary border-primary/50 hover:bg-primary/10 hover:border-primary transition-all duration-200"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 space-y-4 border-2 border-dashed border-primary/30 rounded-xl bg-card/50">
            <p className="text-xl text-muted-foreground font-medium">You haven't completed any quizzes yet.</p>
            <Link to="/">
                <Button className="mt-4 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300">
                    Find a Quiz to Take
                </Button>
            </Link>
          </div>
        )}
        </CardContent>
    </Card>
    </>
  );
};


export default HistoryPage;
