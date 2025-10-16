import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/app/slices/authSlice';
import { toast } from 'react-toastify';
import api from '@/api/axiosConfig'; // Import the axios instance
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Checkbox } from '@/components/ui/Checkbox'; // NEW: Import Checkbox
import { Helmet } from 'react-helmet-async';
import { UserPlus } from 'lucide-react'; // Added icon
import { cn } from '@/lib/utils'; // Added cn utility

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // NEW STATE: Consent checkbox
  const [agreedToTerms, setAgreedToTerms] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    // NEW CRITICAL CHECK: Ensure consent is given
    if (!agreedToTerms) {
      toast.error('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    
    setIsLoading(true);
    try {
      // Use the api instance to make a POST request
      const response = await api.post('/auth/register', { username, email, password });
      dispatch(setCredentials(response.data));
      toast.success('Registration successful! Welcome to ParikshaNode.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create an Account | ParikshaNode</title>
        <meta name="description" content="Sign up for ParikshaNode to create and take quizzes, track your progress, and compete on the leaderboards." />
      </Helmet>
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className={cn(
        "w-full max-w-md p-2 shadow-2xl shadow-primary/30 border-primary/20",
        "animate-in fade-in slide-in-from-top-10 duration-700"
      )}>
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center"><UserPlus className="w-10 h-10 text-primary drop-shadow-md" /></div>
          <CardTitle className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text 
                              bg-gradient-to-r from-primary to-destructive">
            Join ParikshaNode
          </CardTitle>
          <CardDescription className="text-lg">Enter your details to create your account and get started.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="font-semibold text-base">Username</Label>
              <Input 
                id="username" 
                required 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 text-lg border-input/50 focus-visible:ring-primary focus-visible:border-primary/80 transition-all duration-300"
              />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-semibold text-base">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                required 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                className="h-12 text-lg border-input/50 focus-visible:ring-primary focus-visible:border-primary/80 transition-all duration-300"
              />
            </div>
            
            {/* NEW: Legal Consent Checkbox */}
            <div className="flex items-start space-x-3 pt-2">
              <Checkbox 
                id="terms-consent"
                checked={agreedToTerms}
                onCheckedChange={setAgreedToTerms}
                className="w-5 h-5 mt-1 border-primary/50 data-[state=checked]:bg-primary"
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="terms-consent" className="text-sm font-normal text-muted-foreground cursor-pointer">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    Terms of Service
                  </Link>{', '}
                  <Link to="/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </Link>{', and '}
                  <Link to="/dmca" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    DMCA Policy
                  </Link>
                </Label>
              </div>
            </div>

          </CardContent>
          <CardFooter className="flex flex-col items-stretch">
            <Button 
              type="submit" 
              disabled={isLoading || !agreedToTerms}
              className="h-12 text-lg shadow-primary/40 hover:shadow-primary/60 transition-all duration-300"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
            <div className="mt-6 text-center text-md text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-primary hover:underline transition-colors">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
    </>
  );
};


export default RegisterPage;
