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
import { LogIn, Zap } from 'lucide-react'; // Added Zap for a modern icon
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
            
            {/* ULTRA MODERN UI ENHANCEMENTS: DARK MODE, BACKGROUND GRADIENT, AND FLOATING ELEMENTS */}
            <div className="relative min-h-screen flex justify-center items-center bg-gray-950 text-white overflow-hidden p-4">
                {/* 1. Background Vibe: Subtle, animated neon glow effect (simulated with large, blurred circles) */}
                <div className="absolute top-0 left-0 w-80 h-80 bg-fuchsia-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

                {/* The Login Card Container - Centerpiece */}
                <Card className={cn(
                    "w-full max-w-lg p-6 md:p-10 z-10", // Increased padding and max-width for presence
                    // The 'Out-of-the-World' Effect: Semi-transparent dark background, subtle border, heavy shadow
                    "bg-gray-800/80 backdrop-blur-xl border border-primary/20 rounded-3xl",
                    "shadow-2xl shadow-fuchsia-500/30 transition-all duration-500 hover:shadow-cyan-500/40",
                    "animate-in fade-in slide-in-from-top-10 duration-1000" // Slower, smoother entrance
                )}>
                    <CardHeader className="text-center space-y-4">
                        {/* Modern Icon with Neon Glow */}
                        <div className="flex justify-center">
                             {/* Replaced LogIn with Zap for more dynamism */}
                            <Zap className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_8px_rgba(52,211,255,0.7)]" /> 
                        </div>
                        {/* H1 Title with a more vibrant, high-tech gradient */}
                        <h1 className="text-5xl font-black tracking-tight text-transparent bg-clip-text 
                                         bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-primary">
                            SYSTEM ACCESS
                        </h1>
                        <CardDescription className="text-xl text-gray-300 font-light tracking-wide">
                            Secure Terminal: Enter your biometrics.
                        </CardDescription>
                    </CardHeader>
                    
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-8 mt-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="font-medium text-lg text-cyan-300/80 tracking-wider">
                                    <Zap className="inline w-4 h-4 mr-2 -mt-1 text-cyan-400"/>
                                    ACCESS ID (Email)
                                </Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="user@datacore.net" 
                                    required 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    // High-Tech Input Style
                                    className="h-14 text-xl bg-gray-900 border-2 border-cyan-500/30 text-white rounded-xl focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:border-fuchsia-500 transition-all duration-300 placeholder:text-gray-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="font-medium text-lg text-cyan-300/80 tracking-wider">
                                    <LogIn className="inline w-4 h-4 mr-2 -mt-1 text-cyan-400"/>
                                    SECURITY KEY (Password)
                                </Label>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    required 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    // High-Tech Input Style
                                    className="h-14 text-xl bg-gray-900 border-2 border-cyan-500/30 text-white rounded-xl focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:border-fuchsia-500 transition-all duration-300 placeholder:text-gray-500"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col items-stretch pt-8">
                            <Button 
                                type="submit" 
                                disabled={isLoading}
                                // Power Button Style: Neon gradient, thick shadow, slightly lifted
                                className={cn(
                                    "h-14 text-xl font-bold rounded-xl tracking-widest",
                                    "bg-gradient-to-r from-cyan-500 to-fuchsia-600",
                                    "shadow-[0_4px_15px_rgba(52,211,255,0.4)] hover:shadow-[0_6px_20px_rgba(236,72,153,0.6)]",
                                    "transition-all duration-300 transform hover:-translate-y-0.5",
                                )}
                            >
                                {isLoading ? 'INITIATING SEQUENCE...' : 'ACCESS GRANTED'}
                            </Button>
                            <div className="mt-8 text-center text-lg text-gray-400">
                                Need a new profile? 
                                <Link 
                                    to="/register" 
                                    // Neon Link Style
                                    className="ml-2 font-extrabold text-fuchsia-400 hover:text-cyan-400 transition-colors drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]"
                                >
                                    Activate New Core
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>

                {/* Content Addition: Footer/Slogan */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-600 text-sm tracking-widest z-0">
                    PARIKSHANODE // KNOWLEDGE PROTOCOL V3.1
                </div>
            </div>
            {/* ADD A CUSTOM CSS BLOCK TO TAILWIND CONFIG OR GLOBAL CSS FOR THE ANIMATION */}
            {/* The following CSS is needed for the 'animate-blob' class */}
            {/* @keyframes blob {
                0% { transform: translate(0px, 0px) scale(1); }
                33% { transform: translate(30px, -50px) scale(1.1); }
                66% { transform: translate(-20px, 20px) scale(0.9); }
                100% { transform: translate(0px, 0px) scale(1); }
            }
            .animate-blob { animation: blob 7s infinite cubic-bezier(0.6, -0.28, 0.735, 0.045); }
            .animation-delay-4000 { animation-delay: 4s; }
            */}
        </>
    );
};

export default LoginPage;