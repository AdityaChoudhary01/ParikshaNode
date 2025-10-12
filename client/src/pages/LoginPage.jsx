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
import { Cloud, ArrowRight, User } from 'lucide-react'; // Changed icons for a lighter theme
import { cn } from '@/lib/utils';

// --- SEO CONSTANTS ---
const SITE_NAME = "ParikshaNode";
const SITE_URL = "https://parikshanode.netlify.app/";
const LOGIN_URL = `${SITE_URL}login`;

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
                <title>Secure Login to ParikshaNode | Access Quizzes & History</title>
                <meta
                    name="description"
                    content="Securely log in to your ParikshaNode account to track your quiz history, view detailed performance analytics, access admin tools (if applicable), and start new learning challenges."
                />
                <link rel="canonical" href={LOGIN_URL} />
            </Helmet>
            
            {/* ETHEREAL LIGHT MODE OVERHAUL */}
            <div className="relative min-h-screen flex justify-center items-center bg-gray-50 text-gray-900 overflow-hidden p-4">
                
                {/* 1. Ethereal Background Vibe: Soft, blurred light gradients (Simulating morning sky) */}
                <div className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-sky-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob-slow"></div>
                <div className="absolute bottom-10 right-10 w-[50vw] h-[50vw] bg-fuchsia-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob-slow animation-delay-4000"></div>

                {/* The Login Card Container - Centerpiece (Glassmorphism Effect) */}
                <Card className={cn(
                    "w-full max-w-lg p-8 md:p-12 z-10", 
                    // Ethereal/Glassmorphism Effect
                    "bg-white/70 backdrop-blur-3xl border border-gray-200/50 rounded-[40px]",
                    "shadow-3xl shadow-gray-300/60 transition-all duration-500 hover:shadow-sky-300/70",
                    "animate-in fade-in slide-in-from-bottom-5 duration-1000 ease-out" 
                )}>
                    <CardHeader className="text-center space-y-4">
                        {/* Soft Icon with Subtle Shadow */}
                        <div className="flex justify-center">
                            <Cloud className="w-14 h-14 text-sky-500 drop-shadow-md"/> 
                        </div>
                        {/* H1 Title with a soft, organic gradient */}
                        <h1 className="text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text 
                                         bg-gradient-to-r from-sky-600 to-indigo-700">
                            Ascend
                        </h1>
                        <CardDescription className="text-xl text-gray-500 font-light tracking-wide">
                            Access your knowledge cloud with ease.
                        </CardDescription>
                    </CardHeader>
                    
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-8 mt-8">
                            <div className="space-y-3">
                                <Label htmlFor="email" className="font-semibold text-lg text-indigo-500 tracking-wider">
                                    Email Address
                                </Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="your-name@sky.net" 
                                    required 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    // Clean, elevated Input Style
                                    className="h-14 text-lg bg-white border-2 border-gray-200 rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:border-sky-400 transition-all duration-300 placeholder:text-gray-400/80"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="password" className="font-semibold text-lg text-indigo-500 tracking-wider">
                                    Password
                                </Label>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    required 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    // Clean, elevated Input Style
                                    className="h-14 text-lg bg-white border-2 border-gray-200 rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:border-sky-400 transition-all duration-300 placeholder:text-gray-400/80"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col items-stretch pt-10">
                            <Button 
                                type="submit" 
                                disabled={isLoading}
                                // Button Style: Soft, inviting gradient, deep shadow for lift
                                className={cn(
                                    "h-14 text-xl font-bold rounded-2xl tracking-wide",
                                    "bg-gradient-to-r from-sky-500 to-indigo-600 text-white",
                                    "shadow-lg shadow-sky-400/50 hover:shadow-xl hover:shadow-indigo-500/50",
                                    "transition-all duration-300 transform hover:-translate-y-1",
                                )}
                            >
                                {isLoading ? 'Authenticating...' : (
                                    <>
                                        Sign In <ArrowRight className="ml-2 w-5 h-5" />
                                    </>
                                )}
                            </Button>
                            <div className="mt-8 text-center text-lg text-gray-500">
                                First time here? 
                                <Link 
                                    to="/register" 
                                    // Soft, prominent link
                                    className="ml-2 font-extrabold text-indigo-600 hover:text-sky-500 transition-colors"
                                >
                                    Create a Cloud Account
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>

                {/* Content Addition: Subtle Branding */}
                <div className="absolute top-4 right-4 text-gray-400 text-sm font-semibold tracking-widest z-0 flex items-center">
                    PARIKSHANODE <User className="ml-2 w-4 h-4"/>
                </div>
            </div>
            {/* NOTE: You still need the 'animate-blob' custom CSS from the previous answer for the background effect, renamed to 'animate-blob-slow' */}
        </>
    );
};

export default LoginPage;