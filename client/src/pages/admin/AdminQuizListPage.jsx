import React from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/Dialog";
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { PlusCircle, Edit, Trash2, Share2, Copy } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '@/api/axiosConfig';

const AdminQuizListPage = () => {
  const { data: quizzes, isLoading, error, refetch } = useFetch('/quizzes');
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz? This will also delete all associated results.')) {
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage All Quizzes</CardTitle>
          <CardDescription>View, edit, or delete any quiz on the platform.</CardDescription>
        </div>
        <Link to="/quiz/new">
          <Button><PlusCircle className="w-4 h-4 mr-2" />Create New Quiz</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quizzes && quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                  <TableRow key={quiz._id}>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell>{quiz.category}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{quiz.createdBy?.username || 'N/A'}</TableCell>
                    <TableCell className="text-right space-x-2">
                       <Dialog>
                        <DialogTrigger asChild>
                           <Button variant="outline" size="icon"><Share2 className="w-4 h-4" /></Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Share Quiz</DialogTitle><DialogDescription>Share this link with anyone to take the quiz.</DialogDescription></DialogHeader>
                           <div className="space-y-2">
                            <Label>Quiz Link</Label>
                            <div className="flex gap-2">
                              <Input readOnly value={`${window.location.origin}/quiz/${quiz._id}`} />
                              <Button size="icon" onClick={() => copyToClipboard(`${window.location.origin}/quiz/${quiz._id}`)}><Copy className="w-4 h-4"/></Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Link to={`/quiz/edit/${quiz._id}`}><Button variant="outline" size="icon"><Edit className="w-4 h-4" /></Button></Link>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(quiz._id)}><Trash2 className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan="4" className="h-24 text-center">No quizzes found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminQuizListPage;
