import React from 'react';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ListChecks, Users } from 'lucide-react';
import { cn } from '@/lib/utils'; // Import cn utility

const AdminDashboardPage = () => {
  const { data: quizzes, isLoading: quizzesLoading } = useFetch('/quizzes');
  const { data: users, isLoading: usersLoading } = useFetch('/users');

  if (quizzesLoading || usersLoading) return <Loader />;

  return (
    <div className="animate-in fade-in slide-in-from-top-10 duration-700">
      
      {/* Enhanced Gradient Title */}
      <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-transparent bg-clip-text 
                      bg-gradient-to-r from-primary to-destructive drop-shadow-md">
        Admin Dashboard
      </h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Card 1: Total Quizzes */}
        <Card className={cn(
            "shadow-xl border-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-[1.03]",
            "animate-in slide-in-from-bottom-8 delay-100"
        )}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-foreground/90">Total Quizzes</CardTitle>
            <ListChecks className="h-6 w-6 text-primary drop-shadow-sm" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-primary">{quizzes?.length || 0}</div>
            <p className="text-sm text-muted-foreground mt-1">Total number of quizzes in the system.</p>
          </CardContent>
        </Card>
        
        {/* Card 2: Total Users */}
        <Card className={cn(
            "shadow-xl border-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-[1.03]",
            "animate-in slide-in-from-bottom-8 delay-200"
        )}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-foreground/90">Total Users</CardTitle>
            <Users className="h-6 w-6 text-primary drop-shadow-sm" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-primary">{users?.length || 0}</div>
            <p className="text-sm text-muted-foreground mt-1">Total number of registered users.</p>
          </CardContent>
        </Card>
        
        {/* You can add a third card here if needed, e.g., 'Quizzes Created Today' */}
        
      </div>
    </div>
  );
};


export default AdminDashboardPage;
