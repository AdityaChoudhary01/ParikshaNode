import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Award, Medal, Trophy } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { Helmet } from 'react-helmet-async';

const LeaderboardPage = () => {
  const { quizId } = useParams();
  const { data: leaderboard, isLoading: isLeaderboardLoading } = useFetch(`/results/leaderboard/${quizId}`);
  const { data: quiz, isLoading: isQuizLoading } = useFetch(`/quizzes/${quizId}`);

  if (isLeaderboardLoading || isQuizLoading) return <Loader />;
  if (!leaderboard || !quiz) return <p className="text-center text-destructive">Could not load leaderboard data.</p>;
  
  const getRankIcon = (rank) => {
    if (rank === 0) return <Trophy className="text-yellow-500" />;
    if (rank === 1) return <Medal className="text-gray-400" />;
    if (rank === 2) return <Award className="text-yellow-700" />;
    return <span className="font-bold">{rank + 1}</span>;
  };

  // Filter out any entries where the user has been deleted (user is null)
  const validLeaderboard = leaderboard.filter(entry => entry.user);

  return (
    <>
      <Helmet>
        <title>{quiz ? `Leaderboard for "${quiz.title}"` : 'Leaderboard'} | ParikshaNode</title>
        <meta name="description" content={quiz ? `See the top scores and rankings for the ${quiz.title} quiz on ParikshaNode.` : 'Compete for the top spot.'} />
      </Helmet>
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Leaderboard</CardTitle>
        <CardDescription className="text-lg">Top scores for: {quiz.title}</CardDescription>
      </CardHeader>
      <CardContent>
        {validLeaderboard.length > 0 ? (
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
              {validLeaderboard.map((entry, index) => (
                <TableRow key={entry._id}>
                  <TableCell className="font-medium text-center flex justify-center items-center h-full pt-6">
                    {getRankIcon(index)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar src={entry.user.avatar?.url} alt={entry.user.username} size="sm" />
                      <span className="font-medium">{entry.user.username}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">{`${entry.score} / ${entry.totalQuestions}`}</TableCell>
                  <TableCell className="text-right">{`${entry.percentage.toFixed(1)}%`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-muted-foreground py-10">
            No one has taken this quiz yet. Be the first!
          </p>
        )}
      </CardContent>
    </Card>
    </>
  );
};


export default LeaderboardPage;
