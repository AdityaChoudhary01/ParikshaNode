import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Award, Medal, Trophy } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { Helmet } from 'react-helmet-async';
import { cn } from '@/lib/utils';

const LeaderboardPage = () => {
  const { quizId } = useParams();
  const { data: leaderboard, isLoading: isLeaderboardLoading } = useFetch(`/results/leaderboard/${quizId}`);
  const { data: quiz, isLoading: isQuizLoading } = useFetch(`/quizzes/${quizId}`);

  if (isLeaderboardLoading || isQuizLoading) return <Loader />;
  if (!leaderboard || !quiz) return <p className="text-center text-destructive mt-12">Could not load leaderboard data.</p>;

  const getRankIcon = (rank) => {
    if (rank === 0) return <Trophy className="w-10 h-10 text-yellow-400 drop-shadow-xl" fill="gold" />;
    if (rank === 1) return <Medal className="w-9 h-9 text-gray-400 drop-shadow-lg" fill="silver" />;
    if (rank === 2) return <Award className="w-9 h-9 text-yellow-700 drop-shadow-md" fill="bronze" />;
    return <span className="font-bold text-lg text-muted-foreground">{rank + 1}</span>;
  };

  const getRowClass = (rank) => {
    if (rank === 0) return 'bg-yellow-500/10 border-primary/50 font-bold hover:bg-yellow-500/20 shadow-lg';
    if (rank === 1) return 'bg-gray-400/10 border-secondary/50 font-medium hover:bg-gray-400/20';
    if (rank === 2) return 'bg-yellow-700/10 border-secondary/50 font-medium hover:bg-yellow-700/20';
    return 'hover:bg-accent/50';
  };

  const validLeaderboard = leaderboard.filter(entry => entry.user);

  return (
    <>
      <Helmet>
        <title>{quiz ? `Leaderboard for "${quiz.title}"` : 'Leaderboard'} | ParikshaNode</title>
        <meta name="description" content={quiz ? `See the top scores and rankings for the ${quiz.title} quiz on ParikshaNode.` : 'Compete for the top spot.'} />
      </Helmet>

      <Card className="max-w-5xl mx-auto shadow-2xl shadow-primary/30 animate-in fade-in zoom-in-75 duration-700">
        <CardHeader className="text-center pt-8">
          <CardTitle className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-destructive drop-shadow-md">
            Global Leaderboard
          </CardTitle>
          <CardDescription className="text-xl font-medium mt-2">Quiz: {quiz.title}</CardDescription>
          <p className="mt-2 text-muted-foreground text-sm">
            Updated: {new Date().toLocaleString()}
          </p>
        </CardHeader>

        <CardContent>
          {validLeaderboard.length > 0 ? (
            <div className="overflow-x-auto border rounded-xl shadow-inner">
              <Table className="min-w-[700px]">
                <TableHeader>
                  <TableRow className="bg-secondary/70">
                    <TableHead className="w-[100px] text-center text-lg">Rank</TableHead>
                    <TableHead className="text-lg">Player</TableHead>
                    <TableHead className="text-right text-lg">Score</TableHead>
                    <TableHead className="text-right text-lg">Percentage</TableHead>
                    <TableHead className="text-center text-lg hidden md:table-cell">Badges</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validLeaderboard.map((entry, index) => (
                    <TableRow 
                      key={entry._id} 
                      className={cn("transition-all duration-300", getRowClass(index))}
                    >
                      {/* Rank */}
                      <TableCell className="font-medium text-center flex justify-center items-center h-full pt-6">
                        {getRankIcon(index)}
                      </TableCell>

                      {/* Player */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar src={entry.user.avatar?.url} alt={entry.user.username} size="md" />
                          <div className="flex flex-col">
                            <span className="text-lg font-semibold text-foreground/90">{entry.user.username}</span>
                            <span className="text-sm text-muted-foreground">
                              {entry.user.streak ? `🔥 ${entry.user.streak}-quiz streak` : ''}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Score */}
                      <TableCell className="text-right text-lg font-extrabold text-primary">
                        {`${entry.score} / ${entry.totalQuestions}`}
                      </TableCell>

                      {/* Percentage */}
                      <TableCell className="text-right text-lg font-bold">
                        {`${entry.percentage.toFixed(1)}%`}
                      </TableCell>

                      {/* Badges / achievements */}
                      <TableCell className="text-center hidden md:table-cell">
                        <div className="flex justify-center gap-2">
                          {entry.user.badges?.slice(0,3).map((badge, i) => (
                            <Avatar key={i} src={badge.icon} alt={badge.name} size="sm" />
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 space-y-4 border-2 border-dashed border-primary/30 rounded-xl bg-card/50">
              <p className="text-xl text-muted-foreground font-medium">No one has taken this quiz yet.</p>
              <p className="text-xl font-bold text-primary">Be the first to set the record!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default LeaderboardPage;
