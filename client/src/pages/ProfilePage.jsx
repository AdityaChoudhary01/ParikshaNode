import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
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
import { setCredentials } from '@/app/slices/authSlice';

const ProfilePage = () => {
  // Use useSelector to get the latest user state from the Redux store
  const { user } = useSelector((state) => state.auth);
  // Use useFetch to get user data for the initial load and history.
  const { data: fetchedUser, isLoading, error } = useFetch(user ? '/users/profile' : null);
  const { data: history, isLoading: historyLoading } = useFetch(user ? '/results/my-history' : null);
  
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Set the local username state from the fetched user data
  useEffect(() => {
    if (fetchedUser) {
      setUsername(fetchedUser.username);
    }
  }, [fetchedUser]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await api.put('/users/profile', { username });
      // The server returns the complete updated user object
      dispatch(setCredentials(response.data));
      toast.success('Profile updated successfully!');
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
      // The server returns only the new avatar object, so we merge it with the existing user object from Redux
      const updatedUser = { ...user, avatar: response.data };
      dispatch(setCredentials(updatedUser)); // Update the global state
      toast.success('Profile picture updated!');
      setAvatarFile(null); // Clear file input
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="text-center text-destructive">{error}</p>;

  // Use the Redux state `user` for displaying profile details
  const displayUser = user || fetchedUser;

  return (
    <>
    <Helmet>
      <title>My Profile | ParikshaNode</title>
      <meta name="description" content="Manage your ParikshaNode profile. Update your username, change your avatar, and view your quiz history." />
    </Helmet>

    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Avatar */}
        <div className="md:col-span-1 flex flex-col items-center space-y-4">
          <Avatar src={displayUser?.avatar?.url} alt={displayUser?.username} size="xl" />
          <Input type="file" onChange={(e) => setAvatarFile(e.target.files[0])} />
          <Button onClick={handleAvatarUpload} disabled={isUpdating || !avatarFile} className="w-full">
            {isUpdating ? 'Uploading...' : 'Upload Picture'}
          </Button>
        </div>
        
        {/* Right Column: Details */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader><CardTitle>Profile Details</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={displayUser?.email || ''} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <Button type="submit" disabled={isUpdating}>{isUpdating ? 'Saving...' : 'Save Changes'}</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quiz History Section */}
      <Card>
        <CardHeader><CardTitle>My Quiz History</CardTitle></CardHeader>
        <CardContent>
          {historyLoading ? <Loader /> : (
            history && history.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quiz</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((result) => (
                      <TableRow key={result._id}>
                        <TableCell className="font-medium">
                          <Link to={`/results/${result._id}`} className="hover:underline text-primary">{result.quiz.title}</Link>
                        </TableCell>
                        <TableCell>{new Date(result.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">{`${result.score}/${result.totalQuestions}`}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : <p>You haven't attempted any quizzes yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  );
};


export default ProfilePage;
