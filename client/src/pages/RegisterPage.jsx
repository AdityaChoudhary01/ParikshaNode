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
import { Helmet } from 'react-helmet-async';
import { UserPlus } from 'lucide-react'; 
import { cn } from '@/lib/utils'; 

// --- SEO CONSTANTS ---
const SITE_NAME = "ParikshaNode";
const SITE_URL = "https://parikshanode.netlify.app/"; // IMPORTANT: Replace with your live domain
const REGISTER_URL = `${SITE_URL}register`;

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false); 

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }
        setIsLoading(true);
        try {
            // Use the api instance to make a POST request
            const response = await api.post('/auth/register', { username, email, password });
            dispatch(setCredentials(response.data));
            toast.success('Registration successful!');
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
                {/* Primary SEO Tags */}
                <title>Create Your Free Account | ParikshaNode Quiz Platform</title>
                <meta 
                    name="description" 
                    content="Sign up for ParikshaNode to instantly access thousands of quizzes, track your learning progress, join live quiz battles, and compete on global leaderboards. It's fast and free!" 
                />
                <link rel="canonical" href={REGISTER_URL} />
            </Helmet>
            <div className="flex justify-center items-center min-h-[80vh]">
                <Card className={cn(
                    "w-full max-w-md p-2 shadow-2xl shadow-primary/30 border-primary/20",
                    "animate-in fade-in slide-in-from-top-10 duration-700" // Entrance animation
                )}>
                    <CardHeader className="text-center space-y-3">
                        <div className="flex justify-center"><UserPlus className="w-10 h-10 text-primary drop-shadow-md" /></div>
                        {/* H1 for primary page focus */}
                        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text 
                                         bg-gradient-to-r from-primary to-destructive">
                            Join ParikshaNode
                        </h1>
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
                        </CardContent>
                        <CardFooter className="flex flex-col items-stretch">
                            <Button 
                                type="submit" 
                                disabled={isLoading}
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
