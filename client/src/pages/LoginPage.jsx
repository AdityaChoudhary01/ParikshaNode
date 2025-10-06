import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/app/slices/authSlice';
import { toast } from 'react-toastify';
import api from '@/api/axiosConfig';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Helmet } from 'react-helmet-async';
import { LogIn } from 'lucide-react'; // Added icon
import { cn } from '@/lib/utils'; // Added cn utility

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      dispatch(setCredentials(response.data));
      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | ParikshaNode</title>
        <meta name="description" content="Login to your ParikshaNode account to access your profile, quiz history, and start new challenges." />
      </Helmet>
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className={cn(
        "w-full max-w-md p-2 shadow-2xl shadow-primary/30 border-primary/20",
        "animate-in fade-in slide-in-from-top-10 duration-700" // Entrance animation
      )}>
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center"><LogIn className="w-10 h-10 text-primary drop-shadow-md" /></div>
          <CardTitle className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text 
                              bg-gradient-to-r from-primary to-destructive">
            Welcome Back!
          </CardTitle>
          <CardDescription className="text-lg">Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold text-base">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="h-12 text-lg border-input/50 focus-visible:ring-primary focus-visible:border-primary/80 transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-semibold text-base">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="h-12 text-lg border-input/50 focus-visible:ring-primary focus-visible:border-primary/80 transition-all duration-300"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="h-12 text-lg shadow-primary/40 hover:shadow-primary/60 transition-all duration-300"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
            <div className="mt-6 text-center text-md text-muted-foreground">
              Don't have an account? <Link to="/register" className="font-bold text-primary hover:underline transition-colors">Create one</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
    </>
  );
};


export default LoginPage;
