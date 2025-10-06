import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/Dialog";
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { PlusCircle, Edit, Trash2, Share2, Copy, BarChart2, Zap, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '@/api/axiosConfig';
import { Helmet } from 'react-helmet-async';
import { cn } from '@/lib/utils'; // Import cn utility

// PAGINATION CONFIG
const PAGE_LIMIT = 10;

const MyQuizzesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const quizFetchUrl = useMemo(() => {
    return `/quizzes/myquizzes?page=${currentPage}&limit=${PAGE_LIMIT}`;
  }, [currentPage]);
  
  const { data: fetchResult, isLoading, error, refetch } = useFetch(quizFetchUrl, [quizFetchUrl]);
  
  const quizzes = fetchResult?.quizzes || [];
  const totalPages = fetchResult?.pages || 1;
  const totalQuizzes = fetchResult?.totalQuizzes || 0;

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await api.delete(`/quizzes/${id}`);
        toast.success('Quiz deleted successfully');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to delete quiz');
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied to clipboard!');
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="text-center text-destructive">Error: {error}</p>;

  return (
    <>
      <Helmet>
        <title>My Quizzes | ParikshaNode</title>
        <meta name="description" content="Manage and view reports for the quizzes you have created on ParikshaNode." />
      </Helmet>
      <Card className={cn("max-w-4xl mx-auto shadow-2xl shadow-primary/20 border-primary/20", "animate-in fade-in slide-in-from-top-10 duration-700")}>
        <CardHeader className="flex flex-row items-center justify-between py-6 border-b border-border/50">
          <div>
            <CardTitle className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text 
                                  bg-gradient-to-r from-primary to-destructive drop-shadow-md">
                My Quizzes ({totalQuizzes})
            </CardTitle>
            <CardDescription className="text-lg mt-1">Manage and share the quizzes you have created.</CardDescription>
          </div>
          <Link to="/quiz/new">
            <Button className="h-11 px-6 text-lg shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-all duration-300">
              <PlusCircle className="w-5 h-5 mr-2" />Create New Quiz
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto border rounded-xl shadow-inner">
            {quizzes && quizzes.length > 0 ? (
                <Table>
                <TableHeader>
                    <TableRow className="bg-secondary/70">
                    <TableHead className="text-lg font-bold">Title</TableHead>
                    <TableHead className="text-lg font-bold">Category</TableHead>
                    <TableHead className="text-lg font-bold">Questions</TableHead>
                    <TableHead className="text-right text-lg font-bold">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {quizzes.map((quiz, index) => (
                        <TableRow 
                            key={quiz._id}
                            className={cn(
                                "hover:bg-primary/5 transition-all duration-300 hover:shadow-md",
                                "animate-in fade-in slide-in-from-bottom-2"
                            )}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <TableCell className="font-semibold text-foreground/90">{quiz.title}</TableCell>
                            <TableCell className="text-muted-foreground">{quiz.category}</TableCell>
                            <TableCell className="font-medium text-primary">{quiz.questions.length}</TableCell>
                            <TableCell className="text-right space-x-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="icon" className="hover:border-primary/80 transition-colors">
                                        <Share2 className="w-4 h-4 text-primary" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className="text-xl font-bold text-primary">Share Quiz</DialogTitle>
                                        <DialogDescription>Share these links with others to take your quiz.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        
                                        {/* Live Quiz Link */}
                                        <div className="space-y-2 p-3 border-l-4 border-primary bg-primary/5 rounded-md shadow-inner">
                                            <Label htmlFor="liveLink" className="flex items-center font-extrabold text-primary"><Zap className="w-4 h-4 mr-2 fill-primary/50" /> Live Quiz Link (Multiplayer)</Label>
                                            <div className="flex gap-2">
                                            <Input id="liveLink" readOnly value={`${window.location.origin}/live-quiz/${quiz._id}`} />
                                            <Button size="icon" onClick={() => copyToClipboard(`${window.location.origin}/live-quiz/${quiz._id}`)} className="shadow-sm">
                                                <Copy className="w-4 h-4"/>
                                            </Button>
                                            </div>
                                        </div>

                                        {/* Standard Quiz Web Link */}
                                        <div className="space-y-2">
                                            <Label htmlFor="quizLink">Standard Quiz Link (Single Player)</Label>
                                            <div className="flex gap-2">
                                            <Input id="quizLink" readOnly value={`${window.location.origin}/quiz/${quiz._id}`} />
                                            <Button size="icon" onClick={() => copyToClipboard(`${window.location.origin}/quiz/${quiz._id}`)} className="shadow-sm"><Copy className="w-4 h-4"/></Button>
                                            </div>
                                        </div>

                                        {/* App Download Link */}
                                        <div className="space-y-2">
                                            <Label htmlFor="appDownload">App Download Link (Android APK)</Label>
                                            <div className="flex gap-2">
                                            <Input 
                                                id="appDownload" 
                                                readOnly 
                                                value="https://github.com/AdityaChoudhary01/ParikshaNode/releases/download/v1.0.0/parikshanode.apk" 
                                            />
                                            <Button 
                                                size="icon" 
                                                onClick={() => copyToClipboard('https://github.com/AdityaChoudhary01/ParikshaNode/releases/download/v1.0.0/parikshanode.apk')}
                                                className="shadow-sm"
                                            >
                                                <Copy className="w-4 h-4"/>
                                            </Button>
                                            </div>
                                        </div>

                                        {/* Quiz ID */}
                                        <div className="space-y-2">
                                            <Label htmlFor="quizId">Quiz ID</Label>
                                            <Input id="quizId" readOnly value={quiz._id} />
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Link to={`/quiz/report/${quiz._id}`}>
                                <Button variant="outline" size="icon" className="hover:border-primary/80 transition-colors">
                                    <BarChart2 className="w-4 h-4 text-primary" />
                                </Button>
                            </Link>
                            <Link to={`/quiz/edit/${quiz._id}`}>
                                <Button variant="outline" size="icon" className="hover:border-primary/80 transition-colors">
                                    <Edit className="w-4 h-4 text-primary" />
                                </Button>
                            </Link>
                            <Button variant="destructive" size="icon" onClick={() => handleDelete(quiz._id)} className="shadow-md hover:shadow-lg transition-all">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            ) : (
                <div className="text-center py-10">
                    <div className="py-8 space-y-4 border-2 border-dashed border-primary/30 rounded-xl bg-card/50">
                        <p className="text-xl text-muted-foreground font-medium">You haven't created any quizzes yet.</p>
                        <Link to="/quiz/new">
                            <Button className="shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300">
                                Start Creating!
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                  <Button 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="icon"
                  >
                      <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <span className="text-lg font-semibold text-foreground/90">
                      Page {currentPage} of {totalPages}
                  </span>
                  <Button 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      size="icon"
                  >
                      <ArrowRight className="w-5 h-5" />
                  </Button>
              </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default MyQuizzesPage;
