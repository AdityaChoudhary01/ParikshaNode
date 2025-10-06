import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import api from '@/api/axiosConfig';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Shield, UserCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils'; // Import cn utility

// PAGINATION CONFIG
const PAGE_LIMIT = 10;

const AdminUserListPage = () => {
  const [currentPage, setCurrentPage] = useState(1); // New State
  const [isDeleting, setIsDeleting] = React.useState(false);

  const userFetchUrl = useMemo(() => {
    return `/users?page=${currentPage}&limit=${PAGE_LIMIT}`;
  }, [currentPage]);

  // Use fetchResult to get data and metadata
  const { data: fetchResult, isLoading, error, refetch } = useFetch(userFetchUrl, [userFetchUrl]);
  
  const users = fetchResult?.users || [];
  const totalPages = fetchResult?.pages || 1;
  const totalUsers = fetchResult?.totalUsers || 0;


  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      setIsDeleting(true);
      try {
        await api.delete(`/users/${id}`);
        toast.success('User deleted successfully');
        // If deleting the last item on a page, move to the previous page
        if (users.length === 1 && currentPage > 1) {
             setCurrentPage(prev => prev - 1);
        } else {
             refetch(); // Refetch the user list
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete user');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="text-center text-destructive">Error: {error}</p>;

  return (
    <Card className={cn("shadow-2xl shadow-primary/20 border-primary/20", "animate-in fade-in slide-in-from-top-10 duration-700")}>
      <CardHeader className="py-6 border-b border-border/50">
        <CardTitle className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text 
                              bg-gradient-to-r from-primary to-destructive drop-shadow-md flex items-center gap-3">
            <UserCheck className="w-8 h-8"/> Manage Users ({totalUsers})
        </CardTitle>
        <CardDescription className="text-lg mt-1">View and manage all registered users.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="overflow-x-auto border rounded-xl shadow-inner">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/70">
                  <TableHead className="text-lg font-bold">Username</TableHead>
                  <TableHead className="text-lg font-bold">Email</TableHead>
                  <TableHead className="text-lg font-bold">Role</TableHead>
                  <TableHead className="text-lg font-bold">Joined On</TableHead>
                  <TableHead className="text-right text-lg font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users && users.length > 0 ? (
                  users.map((user, index) => (
                    <TableRow 
                        key={user._id} 
                        className={cn(
                            "hover:bg-primary/5 transition-all duration-300 hover:shadow-md",
                            user.role === 'admin' ? 'bg-primary/10 border-l-4 border-primary/50' : '', // Highlight Admins
                            "animate-in fade-in slide-in-from-bottom-2"
                        )}
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="font-semibold text-foreground/90 flex items-center gap-2">
                        {user.role === 'admin' && <Shield className="w-5 h-5 text-primary fill-primary/30" />}
                        {user.username}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{user.email}</TableCell>
                      <TableCell className={user.role === 'admin' ? 'font-bold text-primary' : 'text-foreground/90'}>{user.role.toUpperCase()}</TableCell>
                      <TableCell className="text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        {user.role !== 'admin' ? (
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            onClick={() => handleDelete(user._id)} 
                            disabled={isDeleting}
                            className="shadow-md hover:shadow-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground/80">Protected</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="5" className="h-24 text-center">
                        <div className="py-8 space-y-2 border-2 border-dashed border-primary/30 rounded-xl bg-card/50">
                            <p className="text-xl text-muted-foreground font-medium">No users found on this page.</p>
                        </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
  );
};


export default AdminUserListPage;
