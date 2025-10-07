import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '@/api/axiosConfig';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import Avatar from '@/components/ui/Avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ListChecks, PlusCircle, Trophy, Star, Award, BookOpen, Brain, CheckCircle, Lightbulb, UserCheck, User as UserIcon } from 'lucide-react'; 
import { cn } from '@/lib/utils';
import { useDispatch } from 'react-redux'; 
import { setCredentials } from '@/app/slices/authSlice'; 

// All required icons for dynamic rendering must be mapped here
const IconMap = {
    'Star': Star,
    'Award': Award,
    'PlusCircle': PlusCircle,
    'BookOpen': BookOpen,
    'CheckCircle': CheckCircle,
    'Brain': Brain,
    'Trophy': Trophy,
    'Lightbulb': Lightbulb,
    'UserCheck': UserCheck,
}

const ProfilePage = () => {
  // 1. Primary Fetch: Get core user data.
  const { data: user, isLoading, error, refetch } = useFetch('/users/profile');
  
  // CRITICAL FIX: Enforce sequential fetching to prevent race conditions.
  // The history fetch only runs if the primary fetch is NOT loading AND did NOT error.
  const shouldFetchHistory = !isLoading && !error;
  
  // 2. Secondary Fetch: Get history data (Conditional fetch).
  const { data: history, isLoading: historyLoading } = useFetch(
    shouldFetchHistory ? '/results/my-history' : null
  );

  const dispatch = useDispatch(); 

  const [username, setUsername] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // CRITICAL FIX: Removed the useEffect dispatch that was causing instability.
  // The username state update is sufficient, and the Redux state update will 
  // happen automatically if the token changes or upon successful update actions.
  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      // NOTE: User profile update does not return a new token, so no setCredentials here.
      const response = await api.put('/users/profile', { username });
      
      // Update Redux state with new user object (e.g., username) for Navbar consistency
      dispatch(setCredentials(response.data)); 
      
      toast.success('Profile updated successfully!');
      refetch(); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    setIsUpdating(true);
    try {
      const response = await api.put('/users/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Profile picture updated!');
      
      // Since the avatar URL changed, refresh profile data and ensure Navbar update
      // The refetch will trigger the user data load, and the Navbar relies on Redux.
      refetch(); 
      setAvatarFile(null); // Clear file input
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="text-center text-destructive">{error}</p>;

  const userAchievements = user?.achievements || [];

  // Helper for counter card styling
  const counterCardClass = "text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-lg border-primary/20 hover:border-primary";

  return (
    <>
    <Helmet>
      <title>My Profile | ParikshaNode</title>
      <meta name="description" content="Manage your ParikshaNode profile. Update your username, change your avatar, and view your quiz history." />
    </Helmet>

    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-top-10 duration-700">
      <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text 
                      bg-gradient-to-r from-primary to-destructive drop-shadow-md">
        My Dashboard & Profile
      </h1>
      
      {/* Feature 2: Gamification Counters Display */}
      <div className="grid gap-6 md:grid-cols-3">
          <Card className={cn(counterCardClass, "delay-100")}>
              <CardHeader className="p-4"><CardTitle className="text-lg flex items-center justify-center gap-2"><ListChecks className="w-5 h-5 text-primary" /> Quizzes Completed</CardTitle></CardHeader>
              <CardContent className="p-4 pt-0">
                  <p className="text-4xl font-extrabold text-primary">{user?.quizzesCompletedCount || 0}</p>
              </CardContent>
          </Card>
          <Card className={cn(counterCardClass, "delay-200")}>
              <CardHeader className="p-4"><CardTitle className="text-lg flex items-center justify-center gap-2"><PlusCircle className="w-5 h-5 text-primary" /> Quizzes Created</CardTitle></CardHeader>
              <CardContent className="p-4 pt-0">
                  <p className="text-4xl font-extrabold text-primary">{user?.quizzesCreatedCount || 0}</p>
              </CardContent>
          </Card>
          <Card className={cn(counterCardClass, "delay-300")}>
              <CardHeader className="p-4"><CardTitle className="text-lg flex items-center justify-center gap-2"><Brain className="w-5 h-5 text-primary" /> Correct Answers</CardTitle></CardHeader>
              <CardContent className="p-4 pt-0">
                  <p className="text-4xl font-extrabold text-primary">{user?.totalCorrectAnswers || 0}</p>
              </CardContent>
          </Card>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 pt-4">
        {/* Left Column: Avatar & Upload */}
        <div className="md:col-span-1 flex flex-col items-center space-y-4 p-4 rounded-xl bg-card/70 shadow-lg border border-border/50">
          <Avatar src={user?.avatar?.url} alt={user?.username} size="xl" />
          <Input type="file" onChange={(e) => setAvatarFile(e.target.files[0])} className="border-primary/30" />
          <Button 
            onClick={handleAvatarUpload} 
            disabled={isUpdating || !avatarFile} 
            className="w-full h-10 shadow-primary/40 hover:shadow-primary/60"
          >
            {isUpdating ? 'Uploading...' : 'Upload Picture'}
          </Button>
        </div>
        
        {/* Right Column: Details */}
        <div className="md:col-span-2">
          <Card className="shadow-xl border-primary/20">
            <CardHeader><CardTitle className="text-2xl text-foreground/90">Profile Details</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-semibold">Email</Label>
                  <Input id="email" value={user?.email || ''} disabled className="bg-secondary/50 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="font-semibold">Username</Label>
                  <Input 
                    id="username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                    className="h-10 focus-visible:ring-primary"
                  />
                </div>
                <Button type="submit" disabled={isUpdating} className="shadow-primary/40 hover:shadow-primary/60">
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Feature 2: Achievements Display */}
      <Card className="shadow-xl border-primary/20">
        <CardHeader><CardTitle className="flex items-center gap-2 text-2xl text-primary"><Trophy className="w-6 h-6 fill-primary/30" /> My Achievements</CardTitle></CardHeader>
        <CardContent>
            {userAchievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userAchievements.map((achievement, index) => {
                        const IconComponent = IconMap[achievement.icon] || Trophy; 
                        return (
                            <div 
                                key={achievement._id} 
                                className={cn(
                                    "flex items-center gap-4 p-4 border rounded-xl bg-secondary/70 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20",
                                    "animate-in fade-in slide-in-from-bottom-2"
                                )}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="p-3 rounded-full bg-primary/20 text-primary drop-shadow-sm">
                                    <IconComponent className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-foreground">{achievement.name}</p>
                                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-center text-muted-foreground py-4 border-2 border-dashed border-border/50 rounded-lg">You haven't earned any achievements yet. Keep quizzing!</p>
            )}
        </CardContent>
      </Card>
      
      {/* Quiz History Section */}
      <Card className="shadow-xl border-primary/20">
        <CardHeader><CardTitle className="text-2xl text-foreground/90">Recent Quiz History</CardTitle></CardHeader>
        <CardContent>
          {historyLoading ? <Loader /> : (
            history && history.length > 0 ? (
              <div className="overflow-x-auto border rounded-xl shadow-inner">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/70">
                      <TableHead className="font-bold">Quiz</TableHead>
                      <TableHead className="font-bold">Date</TableHead>
                      <TableHead className="text-right font-bold">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.slice(0, 5).map((result) => ( // Show top 5 recent results
                      <TableRow key={result._id} className="hover:bg-primary/5 transition-all duration-150">
                        <TableCell className="font-medium">
                          <Link to={`/results/${result._id}`} className="hover:underline text-primary font-semibold">{result.quiz.title}</Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{new Date(result.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right font-semibold">{`${result.score}/${result.totalQuestions}`}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : <p className="text-center text-muted-foreground py-4">You haven't attempted any quizzes yet.</p>
          )}
          {history && history.length > 5 && (
            <div className="text-center mt-4">
                <Link to="/history">
                    <Button variant="link" className="text-primary hover:text-primary/80">View Full History</Button>
                </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default ProfilePage;
