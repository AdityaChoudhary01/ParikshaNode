import React from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const HistoryPage = () => {
  const { data: history, isLoading, error } = useFetch('/results/my-history');

  if (isLoading) return <Loader />;
  if (error) return <p className="text-center text-destructive">Error: {error}</p>;

  return (
    <>
      <Helmet>
        <title>My Quiz History | ParikshaNode</title>
        <meta name="description" content="Review all the quizzes you have attempted on ParikshaNode, check your scores, and view detailed results." />
      </Helmet>
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>My Quiz History</CardTitle>
        <CardDescription>A record of all the quizzes you've completed.</CardDescription>
      </CardHeader>
      <CardContent>
        {history && history.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quiz Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date Taken</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((result) => (
                <TableRow key={result._id}>
                  <TableCell className="font-medium">{result.quiz.title}</TableCell>
                  <TableCell>{result.quiz.category}</TableCell>
                  <TableCell>{new Date(result.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right font-semibold">{`${result.score} / ${result.totalQuestions} (${result.percentage.toFixed(1)}%)`}</TableCell>
                  <TableCell className="text-center">
                    <Link to={`/results/${result._id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">You haven't completed any quizzes yet.</p>
            <Link to="/"><Button className="mt-4">Find a Quiz to Take</Button></Link>
          </div>
        )}
        </CardContent>
    </Card>
    </>
  );
};

export default HistoryPage;