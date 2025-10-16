import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFetch } from '@/hooks/useFetch';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import Loader from '@/components/Loader';
import { Clock, HelpCircle, Tag, BookOpen, LayoutDashboard, BarChart, Trophy, FileText, Search, Zap, ArrowLeft, ArrowRight, Download, X, Lightbulb, TrendingUp, Users, HeartHandshake, Info, Mail, DollarSign } from 'lucide-react'; 
import { Helmet } from 'react-helmet-async';
import { cn } from '@/lib/utils'; 

// --- START: CUSTOM ULTRA-MODERN BUTTON COMPONENT (ENHANCED) ---

/**
 * @typedef {'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'} UltraButtonVariant
 * @typedef {'default' | 'sm' | 'lg' | 'icon' | 'xl'} UltraButtonSize
 */

const UltraButton = React.forwardRef(({ className, variant = "default", size = "default", children, disabled, onClick, type = "button", ...props }, ref) => {
    
    // 1. Base Styles - Added active:scale-[0.95] for a more tactile press
    const baseStyles = "inline-flex items-center justify-center font-extrabold tracking-wide transition-all duration-300 active:scale-[0.95] disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-primary/60 whitespace-nowrap";
    
    // 2. Size Map
    const sizeMap = {
        default: "h-10 px-4 py-2 text-base rounded-lg",
        sm: "h-9 rounded-lg px-3 text-sm",
        lg: "h-11 rounded-xl px-8 text-lg",
        xl: "h-14 sm:h-16 px-8 sm:px-10 rounded-2xl text-xl sm:text-2xl",
        icon: "h-10 w-10 rounded-full p-2",
    };

    // 3. Variant Map - Increased shadow intensity and hover scale
    const variantMap = {
        // High-Impact Primary Button (Neon Purple)
        default: "bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.8)] hover:from-primary hover:to-purple-700 hover:shadow-[0_30px_60px_rgba(var(--primary-rgb),1)] hover:scale-[1.03] ring-2 ring-primary/40",
        // Destructive / Alert Button (Fiery Red)
        destructive: "bg-gradient-to-r from-destructive to-red-600 text-white shadow-[0_20px_40px_-10px_rgba(var(--destructive-rgb),0.8)] hover:from-destructive hover:to-red-700 hover:shadow-[0_30px_60px_rgba(var(--destructive-rgb),1)] hover:scale-[1.03] ring-2 ring-destructive/40",
        // Outline (Holographic Glass)
        outline: "border-2 border-primary/50 bg-card/50 text-foreground/90 shadow-xl backdrop-blur-lg hover:bg-primary/20 hover:border-primary/80 hover:text-primary hover:scale-[1.01] transition-all duration-300",
        // Secondary (Subtle Dark Glow)
        secondary: "bg-secondary/80 text-secondary-foreground shadow-lg shadow-input/50 hover:bg-secondary hover:scale-[1.01] ring-1 ring-input/50",
        // Ghost (Minimalist)
        ghost: "hover:bg-accent/20 hover:text-accent-foreground",
        // Link (Text-only action)
        link: "text-primary underline-offset-4 hover:underline hover:scale-[1.01] font-semibold",
    };

    return (
        <button
            ref={ref}
            className={cn(baseStyles, sizeMap[size], variantMap[variant], className)}
            onClick={onClick}
            disabled={disabled}
            type={type}
            {...props}
        >
            {children}
        </button>
    );
});
UltraButton.displayName = 'UltraButton';

// --- END: CUSTOM ULTRA-MODERN BUTTON COMPONENT ---

// SEO CONSTANTS 
const SITE_NAME_SHORT = "ParikshaNode";
const SITE_NAME_FULL = "ParikshaNode | Master Any Subject, One Quiz at a Time"; // Your desired page title
const SITE_URL = "https://parikshanode.netlify.app/";
const LOGO_URL = "https://parikshanode.netlify.app/logo.png";
const MAIN_DESCRIPTION = "ParikshaNode is the ultimate MERN quiz platform for students and pros. Create quizzes, track deep analytics, and join ad-free live battles.";
// --- START: useDebounce Hook Definition (Preserved) ---
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};
// --- END: useDebounce Hook Definition ---

// PAGINATION CONFIG
const PAGE_LIMIT = 12;

const HomePage = () => {
    const { user } = useSelector((state) => state.auth);

    // PAGINATION STATE
    const [currentPage, setCurrentPage] = useState(1);

    // ... [Rest of the functional logic remains the same] ...
    const [searchTerm, setSearchTerm] = useState('');
    const [instantSearchTerm, setInstantSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showApkButton, setShowApkButton] = useState(true);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const activeSearchTerm = useMemo(() => {
        return instantSearchTerm || debouncedSearchTerm;
    }, [instantSearchTerm, debouncedSearchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeSearchTerm, selectedCategory]);

    const quizFetchUrl = useMemo(() => {
        let url = `/quizzes?page=${currentPage}&limit=${PAGE_LIMIT}&`;
        if (activeSearchTerm) url += `keyword=${encodeURIComponent(activeSearchTerm)}&`;
        if (selectedCategory && selectedCategory !== 'All') url += `category=${encodeURIComponent(selectedCategory)}&`;
        return url;
    }, [activeSearchTerm, selectedCategory, currentPage]);

    const { data: fetchResult, isLoading: quizzesLoading, error: quizzesError } = useFetch(quizFetchUrl, [quizFetchUrl]);
    const quizzes = fetchResult?.quizzes || [];
    const totalPages = fetchResult?.pages || 1;

    const { data: history, isLoading: historyLoading } = useFetch(user ? '/results/my-history' : null);

    const handleSearchKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setInstantSearchTerm(searchTerm);
        } else {
            setInstantSearchTerm('');
        }
    }, [searchTerm]);

    const attemptedQuizzesMap = useMemo(() => {
        if (!history) return {};
        const map = {};
        history.forEach(result => {
            const quizId = result.quiz?._id || result.quiz;
            map[quizId] = result._id;
        });
        return map;
    }, [history]);

    const allCategories = useMemo(() => {
        const defaultCategories = new Set(['Science', 'History', 'Programming', 'General Knowledge', 'Sports', 'Art', 'Literature']);
        const fetchedCategories = new Set(quizzes.map(q => q.category));
        return new Set([...defaultCategories, ...fetchedCategories]);
    }, [quizzes]);

    const recommendedCategory = useMemo(() => {
        if (!history || history.length === 0) return null;
        const categoryCounts = history.reduce((acc, result) => {
            const category = result.quiz?.category;
            if (category) { acc[category] = (acc[category] || 0) + 1; }
            return acc;
        }, {});
        const mostFrequent = Object.entries(categoryCounts).sort(([, a], [, b]) => b - a)[0];
        return mostFrequent ? mostFrequent[0] : null;
    }, [history]);

    const recommendedQuizzes = useMemo(() => {
        if (!recommendedCategory || !quizzes) return [];
        return quizzes.filter(quiz => quiz.category === recommendedCategory).slice(0, 3);
    }, [recommendedCategory, quizzes]);

    const handleBrowseClick = (e) => {
        e.preventDefault();
        const quizSection = document.getElementById('quizzes');
        if (quizSection) {
            quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setInstantSearchTerm(searchTerm);
    };

    const handleHideApkButton = () => {
        setShowApkButton(false);
    };

    // --- SEO: JSON-LD Structured Data Schema (UPDATED) ---
    const schemaMarkup = {
        "@context": "https://schema.org",
        "@graph": [
            // 1. WebSite Schema
            {
                "@type": "WebSite",
                "name": SITE_NAME_SHORT,  
                "alternateName": SITE_NAME_FULL, // Added to suggest the full title
                "url": SITE_URL,
                "description": MAIN_DESCRIPTION,
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": `${SITE_URL}search?q={search_term_string}`,
                    "query-input": "required name=search_term_string"
                }
            },
            
            // 2. WebApplication Schema (Good for rich results)
            {
                "@type": "WebApplication",
                "name": SITE_NAME_SHORT,
                "url": SITE_URL,
                "applicationCategory": "EducationalApplication",
                "operatingSystem": "All",
                // Assuming this is the core team for the application
                "author": {
                    "@type": "Group",
                    "name": "Aditya Choudhary, Suraj Mishra, Amrita Yadav, Sachin Maurya"  
                },
                "description": "A modern MERN stack quiz platform for creating and taking interactive quizzes.",
                "offers": { // Added to prevent Google Search Console warnings for free apps
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD",
                    "description": "The base application is free to use."
                }
            },
            
            // 3. Organization Schema
            {
                "@type": "Organization",
                "name": SITE_NAME_SHORT,
                "url": SITE_URL,
                "logo": LOGO_URL,
                "sameAs": [
                    "https://github.com/AdityaChoudhary01/ParikshaNode",  
                    "https://www.instagram.com/aditya_choudhary__021/",
                    "https://www.linkedin.com/in/aditya-kumar-38093a304/"
                ]
            }
        ]
    };
    
    // **FIX 1: REMOVED GLOBAL LOADING BLOCK**
    // The component now renders the structure immediately.

    return (
        <>
            <Helmet>
                {/* SEO Tags (Updated Title) */}
                <title>{SITE_NAME_FULL}</title>
                <meta name="description" content={MAIN_DESCRIPTION} />
                <link rel="canonical" href={SITE_URL} />
                <meta property="og:title" content={SITE_NAME_FULL} />
                <meta property="og:image" content={LOGO_URL} />
                <meta name="twitter:image" content={LOGO_URL} /> 
                <script type="application/ld+json">
                    {JSON.stringify(schemaMarkup)}
                </script>
            </Helmet>
            
            {/* Background Enhancement for Depth */}
            {/* FIX: Removed px-0 from container for better mobile padding consistency with standard container use */}
            <div className="space-y-24 md:space-y-32 container px-0 py-4 md:py-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-color-background)_60%,_var(--tw-color-primary)/10)] min-h-screen">
                
                {/* 🚀 Ultra-Modern Hero Section - (STATIC) */}
                <section
                    className="relative overflow-hidden flex flex-col items-center justify-center text-center py-32 md:py-56
                            rounded-[3rem] bg-gradient-to-br from-background/80 via-background/60 to-background/80
                            border border-primary/40 backdrop-blur-[60px]
                            shadow-[0_0_120px_-30px_rgba(var(--primary-rgb),0.6)]
                            transition-all duration-700 hover:shadow-[0_0_180px_-40px_rgba(var(--primary-rgb),0.8)]"
                >
                    {/* 🌌 Ambient Layers */}
                    <div className="absolute inset-0 -z-10">
                        {/* Dynamic radial light */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(var(--primary-rgb),0.25),transparent_60%)] animate-pulse-slow"></div>
                        
                        {/* Animated gradient swirl */}
                        <div className="absolute w-[180%] h-[180%] -top-[40%] -left-[40%]
                                        bg-[conic-gradient(from_90deg,rgba(var(--primary-rgb),0.15),transparent_40%,rgba(var(--destructive-rgb),0.25)_80%)]
                                        animate-spin-slower opacity-70"></div>

                        {/* Noise overlay for texture */}
                        <div className="absolute inset-0 bg-[url('/path-to-subtle-noise-texture.svg')] opacity-10"></div>
                    </div>

                    {/* ✨ Content */}
                    <div className="relative z-10 max-w-6xl px-6 animate-in fade-in-100 duration-1000 ease-out">
                        
                        {/* Brand line */}
                        <p className="uppercase tracking-[0.9rem] sm:tracking-[1.2rem] font-extrabold mb-8 
                                    text-[clamp(1.25rem,2vw,2rem)] bg-gradient-to-r from-primary/90 to-destructive/80 
                                    bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(var(--primary-rgb),0.9)]">
                            PARIKSHANODE
                        </p>

                        {/* Main Heading */}
                        <h1 className="text-[clamp(4rem,9vw,11rem)] font-black leading-none 
                                    text-transparent bg-clip-text bg-gradient-to-r from-primary via-foreground to-destructive
                                    [text-shadow:0_0_70px_rgba(var(--primary-rgb),1.1)]
                                    animate-in fade-in slide-in-from-top-6 duration-700">
                            MASTERY
                        </h1>

                        {/* Subheading */}
                        <h2 className="mt-2 text-[clamp(2.25rem,5vw,6rem)] font-extrabold bg-gradient-to-r from-destructive to-primary
                                    bg-clip-text text-transparent opacity-90 animate-in fade-in slide-in-from-bottom-4 delay-150">
                            UNLOCKED
                        </h2>

                        {/* Supporting Text */}
                        <p className="mt-10 text-[clamp(1.1rem,1.6vw,1.6rem)] text-foreground/90 max-w-3xl mx-auto font-medium leading-relaxed 
                                    [text-shadow:0_0_10px_rgba(0,0,0,0.6)] animate-in fade-in delay-300">
                            Experience the next era of learning — live multiplayer quizzes, real-time analytics, and AI-assisted mastery tracking.
                        </p>

                        {/* 🧭 Call To Action */}
                        <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-10 animate-in fade-in delay-500">
                            <UltraButton
                                size="xl"
                                onClick={handleBrowseClick}
                                className="group relative overflow-hidden px-10 py-5 text-lg font-semibold
                                            hover:scale-[1.08] transition-transform duration-300
                                            shadow-[0_0_25px_rgba(var(--primary-rgb),0.7)]
                                            hover:shadow-[0_0_45px_rgba(var(--primary-rgb),1)]
                                            before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/50 before:to-destructive/50 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-500 rounded-2xl"
                            >
                                <Zap className="w-6 h-6 mr-2 animate-wiggle text-primary" />
                                Challenge Yourself
                            </UltraButton>

                            {user ? (
                                user.role === 'admin' ? (
                                    <Link to="/admin">
                                        <UltraButton
                                            size="xl"
                                            variant="outline"
                                            className="hover:scale-[1.08] transition-all duration-300 shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]"
                                        >
                                            <LayoutDashboard className="w-6 h-6 mr-2 text-primary" />
                                            Admin Dashboard
                                        </UltraButton>
                                    </Link>
                                ) : (
                                    <Link to="/history">
                                        <UltraButton
                                            size="xl"
                                            variant="outline"
                                            className="hover:scale-[1.08] transition-all duration-300 shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]"
                                        >
                                            <Clock className="w-6 h-6 mr-2 text-primary" />
                                            My History Hub
                                        </UltraButton>
                                    </Link>
                                )
                            ) : (
                                <Link to="/register">
                                    <UltraButton
                                        size="xl"
                                        variant="destructive"
                                        className="hover:scale-[1.08] transition-transform duration-300 shadow-[0_0_25px_rgba(var(--destructive-rgb),0.7)] hover:shadow-[0_0_45px_rgba(var(--destructive-rgb),1)]"
                                    >
                                        <HeartHandshake className="w-6 h-6 mr-2" />
                                        Join the Network
                                    </UltraButton>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Floating glow orbs */}
                    <div className="absolute -top-20 left-10 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-0 right-20 w-72 h-72 bg-destructive/25 rounded-full blur-3xl animate-bounce-slow"></div>
                </section>



                <hr className="border-t-4 border-primary/40 opacity-50 shadow-[0_0_15px_var(--tw-color-primary)]" />

                {/* --- 🌟 Recommended for You Section (Modular Tiles - LOCALIZED LOADING) --- */}
                {user && (
                    historyLoading ? (
                        <section className="text-center py-10 px-4">
                            <Loader />
                            <p className='mt-4 text-primary/70'>Analyzing history for recommendations...</p>
                        </section>
                    ) : recommendedCategory && recommendedQuizzes.length > 0 && (
                        <section className="text-center animate-in fade-in duration-1000 px-4">
                            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-destructive to-primary inline-block drop-shadow-md">
                                <Lightbulb className="w-6 h-6 md:w-8 md:h-8 mr-3 inline-block animate-pulse text-destructive [filter:drop-shadow(0_0_10px_var(--tw-color-destructive))]"/>
                                Personalized Flow: <span className='text-primary/90'>{recommendedCategory}</span>
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground font-medium">Jump back into your mastery category.</p>
                            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                                {recommendedQuizzes.map((quiz, index) => (
                                    <QuizCard key={quiz._id} quiz={quiz} hasAttempted={Boolean(attemptedQuizzesMap[quiz._id])} resultId={attemptedQuizzesMap[quiz._id]} user={user} index={index} isRecommended={true} />
                                ))}
                            </div>
                        </section>
                    )
                )}
                
                <hr className="border-t-4 border-primary/40 opacity-50 shadow-[0_0_15px_var(--tw-color-primary)]" />

                {/* Quiz List Section */}
                <section id="quizzes">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-10 md:mb-16 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary/80 inline-block">
                        <TrendingUp className="w-6 h-6 md:w-8 md:h-8 mr-2 inline-block text-primary/80 [filter:drop-shadow(0_0_10px_var(--tw-color-primary))]"/>
                        Network Pulse: Discover Quizzes
                    </h2>

                    {/* Search and Filter UI - GLASS/NEON EFFECT */}
                    <form onSubmit={handleSearchSubmit} className="max-w-5xl mx-auto mt-6 px-4">
                        <div className="flex flex-col md:flex-row gap-4 p-4 md:p-6 rounded-3xl bg-card/70 border-2 border-primary/40 
                                            shadow-3xl shadow-primary/50 backdrop-blur-xl transition-all duration-300">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-primary [filter:drop-shadow(0_0_5px_var(--tw-color-primary))]" />
                                <Input
                                    type="text"
                                    placeholder="Search by quiz title, topic, or unique tag..."
                                    className="pl-14 h-14 md:h-16 text-lg border-2 border-input/30 rounded-xl bg-background/95 
                                                focus-visible:ring-4 focus-visible:ring-primary/70 focus-visible:ring-offset-0 
                                                transition-shadow duration-300 shadow-inner shadow-primary/30"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                />
                            </div>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-full md:w-[250px] flex-shrink-0 h-14 md:h-16 text-lg rounded-xl border-2 border-input/30
                                                            focus:ring-4 focus:ring-primary/70 focus-visible:ring-offset-0 transition-shadow duration-300 
                                                            bg-background/95 shadow-inner shadow-primary/30">
                                    <SelectValue placeholder="Filter by Category" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-primary/50 shadow-2xl shadow-primary/40">
                                    <SelectItem value="All">All Categories ({quizzes.length})</SelectItem>
                                    {Array.from(allCategories).sort().map(category => (
                                        <SelectItem key={category} value={category}>{category}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <button type="submit" style={{ display: 'none' }} aria-hidden="true" />
                        </div>
                    </form>

                    {/* Quiz Cards Grid (LOCALIZED LOADING) */}
                    <div className="mt-12 md:mt-16 px-4"> 
                        {quizzesLoading ? (
                            <div className="mt-10 p-12 text-center border-4 border-dashed border-primary/40 rounded-2xl bg-card/50 shadow-inner shadow-primary/10">
                                <Loader /> 
                                <p className='mt-4 text-xl font-medium text-primary'>Fetching Quizzes...</p>
                            </div>
                        ) : quizzesError ? (
                            <div className="text-center text-destructive mt-10 p-12 border-4 border-dashed border-destructive/50 rounded-2xl bg-card/50 shadow-inner shadow-destructive/10">
                                <FileText className="w-12 h-12 mx-auto mb-4 text-destructive/70"/>
                                <p className='text-xl font-bold'>Error Loading Quizzes</p>
                                <p className='text-lg'>An issue occurred while fetching quizzes: {quizzesError.message || 'Unknown Error'}</p>
                            </div>
                        ) : quizzes && quizzes.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                                {quizzes.map((quiz, index) => {
                                    const hasAttempted = user && attemptedQuizzesMap[quiz._id];
                                    const resultId = hasAttempted ? attemptedQuizzesMap[quiz._id] : null;

                                    return (
                                        <QuizCard 
                                            key={quiz._id} 
                                            quiz={quiz} 
                                            hasAttempted={hasAttempted} 
                                            resultId={resultId} 
                                            user={user} 
                                            index={index} 
                                            isRecommended={false}
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground mt-10 p-12 border-4 border-dashed border-input/50 rounded-2xl bg-card/50 shadow-inner shadow-primary/10 animate-in fade-in zoom-in duration-700">
                                <FileText className="w-12 h-12 mx-auto mb-4 text-destructive/70"/>
                                <p className='text-xl font-bold'>No Quizzes Found</p>
                                <p className='text-lg'>We couldn't find any quizzes matching your search or filter. Try a different query.</p>
                            </div>
                        )}

                        {/* Pagination Controls - UltraButton Implemented */}
                        {totalPages > 1 && !quizzesLoading && (
                            <div className="flex justify-center items-center gap-6 md:gap-8 mt-16 md:mt-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
                                <UltraButton
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    variant="outline" 
                                    size="icon"
                                    className="w-14 h-14 text-primary/80 shadow-lg hover:shadow-xl rounded-full"
                                >
                                    <ArrowLeft className="w-6 h-6" />
                                </UltraButton>
                                <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-destructive drop-shadow-lg [text-shadow:0_0_10px_var(--tw-color-primary)]">
                                    {currentPage} / {totalPages}
                                </span>
                                <UltraButton
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    variant="outline"
                                    size="icon"
                                    className="w-14 h-14 text-primary/80 shadow-lg hover:shadow-xl rounded-full"
                                >
                                    <ArrowRight className="w-6 h-6" />
                                </UltraButton>
                            </div>
                        )}
                    </div>
                </section>

                <hr className="border-t-4 border-primary/40 opacity-50 shadow-[0_0_15px_var(--tw-color-primary)]" />

                {/* 🌟 WHY CHOOSE PARIKSHANODE — Next-Gen Modular Layout (STATIC) */}
                <section className="relative py-24 px-6 text-center overflow-hidden">
                    {/* Ambient gradient layer */}
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.12),transparent_70%)]" />
                    
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-foreground to-destructive drop-shadow-[0_0_25px_rgba(var(--primary-rgb),0.5)]">
                            Why ParikshaNode?
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Built for learners who crave depth, connection, and measurable growth.
                        </p>

                        {/* Floating grid of core feature cards */}
                        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                            {/* 🔹 Smart Library */}
                            <Card className="group relative p-10 rounded-[2rem] bg-card/60 border border-primary/30 backdrop-blur-xl
                                            shadow-[0_0_40px_rgba(var(--primary-rgb),0.25)] hover:shadow-[0_0_60px_rgba(var(--primary-rgb),0.4)]
                                            transition-all duration-500 hover:-translate-y-2">
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br from-primary to-destructive transition-opacity duration-700 rounded-[2rem]" />
                                <div className="p-6 rounded-full bg-primary/20 ring-2 ring-primary/30">
                                    <BookOpen className="w-12 h-12 text-primary drop-shadow-md" />
                                </div>
                                <CardTitle className="text-2xl font-bold mt-6 text-foreground">Smart Library</CardTitle>
                                <CardContent className="mt-3 text-muted-foreground text-base leading-relaxed">
                                    <p>Access expertly curated quizzes, tailored by AI for every skill level and subject domain.</p>
                                </CardContent>
                            </Card>

                            {/* 🔹 Create, Share, Compete */}
                            <Card className="group relative p-10 rounded-[2rem] bg-card/60 border border-destructive/30 backdrop-blur-xl
                                            shadow-[0_0_40px_rgba(var(--destructive-rgb),0.25)] hover:shadow-[0_0_60px_rgba(var(--destructive-rgb),0.4)]
                                            transition-all duration-500 hover:-translate-y-2">
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br from-destructive to-primary transition-opacity duration-700 rounded-[2rem]" />
                                <div className="p-6 rounded-full bg-destructive/20 ring-2 ring-destructive/30">
                                    <LayoutDashboard className="w-12 h-12 text-destructive drop-shadow-md" />
                                </div>
                                <CardTitle className="text-2xl font-bold mt-6 text-foreground">Create, Share & Compete</CardTitle>
                                <CardContent className="mt-3 text-muted-foreground text-base leading-relaxed">
                                    <p>Host live multiplayer quizzes, share instant challenge links, and collaborate with your peers effortlessly.</p>
                                </CardContent>
                            </Card>

                            {/* 🔹 Deep Insights */}
                            <Card className="group relative p-10 rounded-[2rem] bg-card/60 border border-primary/30 backdrop-blur-xl
                                            shadow-[0_0_40px_rgba(var(--primary-rgb),0.25)] hover:shadow-[0_0_60px_rgba(var(--primary-rgb),0.4)]
                                            transition-all duration-500 hover:-translate-y-2">
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br from-primary to-destructive transition-opacity duration-700 rounded-[2rem]" />
                                <div className="p-6 rounded-full bg-primary/20 ring-2 ring-primary/30">
                                    <BarChart className="w-12 h-12 text-primary drop-shadow-md" />
                                </div>
                                <CardTitle className="text-2xl font-bold mt-6 text-foreground">Deep Analytics</CardTitle>
                                <CardContent className="mt-3 text-muted-foreground text-base leading-relaxed">
                                    <p>Track growth with precision — progress graphs, achievement heatmaps, and trend predictions.</p>
                                </CardContent>
                            </Card>
                        </div>
                        
                        {/* 🌐 Internal Navigation Links (NEW) */}
                        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10">
                            {/* ℹ️ About Page Link */}
                            <Link to="/about" className='block'>
                                <Card className="group p-8 rounded-[2rem] bg-card/60 border border-primary/20 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-left">
                                    <div className="p-4 rounded-full bg-primary/10 ring-2 ring-primary/20 inline-block">
                                        <Info className="w-8 h-8 text-primary drop-shadow-md" />
                                    </div>
                                    <CardTitle className="text-xl font-bold mt-4 text-foreground">About Us</CardTitle>
                                    <CardDescription className="mt-1 text-sm text-muted-foreground">
                                        Learn about our mission, technology, and the team behind ParikshaNode.
                                    </CardDescription>
                                </Card>
                            </Link>

                            {/* 🤝 Donate Link */}
                            <Link to="/donate" className='block'>
                                <Card className="group p-8 rounded-[2rem] bg-card/60 border border-destructive/20 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-left">
                                    <div className="p-4 rounded-full bg-destructive/10 ring-2 ring-destructive/20 inline-block">
                                        <DollarSign className="w-8 h-8 text-destructive drop-shadow-md" />
                                    </div>
                                    <CardTitle className="text-xl font-bold mt-4 text-foreground">Support Us</CardTitle>
                                    <CardDescription className="mt-1 text-sm text-muted-foreground">
                                        Help keep the platform ad-free and open-source by making a small donation.
                                    </CardDescription>
                                </Card>
                            </Link>
                            
                            {/* 📧 Contact Link */}
                            <Link to="/contact" className='block'>
                                <Card className="group p-8 rounded-[2rem] bg-card/60 border border-primary/20 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-left">
                                    <div className="p-4 rounded-full bg-primary/10 ring-2 ring-primary/20 inline-block">
                                        <Mail className="w-8 h-8 text-primary drop-shadow-md" />
                                    </div>
                                    <CardTitle className="text-xl font-bold mt-4 text-foreground">Contact Team</CardTitle>
                                    <CardDescription className="mt-1 text-sm text-muted-foreground">
                                        Got feedback, questions, or need assistance? Get in touch with our support team.
                                    </CardDescription>
                                </Card>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Divider with glow */}
                <hr className="my-20 border-t border-primary/40 opacity-50 shadow-[0_0_25px_rgba(var(--primary-rgb),0.4)]" />

                {/* ⚙️ HOW IT WORKS - Streamlined Flow (STATIC) */}
                <section className="relative py-24 px-6 text-center overflow-hidden">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_100%,rgba(var(--destructive-rgb),0.12),transparent_70%)]" />

                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-destructive to-primary drop-shadow-[0_0_25px_rgba(var(--primary-rgb),0.4)]">
                            Mastery in <span className="text-6xl font-black">3</span> Simple Steps
                        </h2>

                        <div className="mt-16 grid md:grid-cols-3 gap-10 md:gap-12">
                            {/* Step 1 */}
                            <div className="relative flex flex-col items-center p-10 rounded-[2rem] bg-card/60 border border-primary/30 backdrop-blur-xl
                                            hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_0_50px_rgba(var(--primary-rgb),0.4)]">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 flex items-center justify-center rounded-full 
                                                bg-gradient-to-br from-primary to-destructive text-white text-3xl font-black shadow-xl">
                                    1
                                </div>
                                <h3 className="mt-12 text-2xl font-bold text-foreground">Browse & Discover</h3>
                                <p className="mt-3 text-base text-muted-foreground max-w-xs">
                                    Search across adaptive quizzes powered by intelligent tagging and recommendation systems.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="relative flex flex-col items-center p-10 rounded-[2rem] bg-card/60 border border-primary/30 backdrop-blur-xl
                                            hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_0_50px_rgba(var(--primary-rgb),0.4)]">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 flex items-center justify-center rounded-full 
                                                bg-gradient-to-br from-primary to-destructive text-white text-3xl font-black shadow-xl">
                                    2
                                </div>
                                <h3 className="mt-12 text-2xl font-bold text-foreground">Play & Engage</h3>
                                <p className="mt-3 text-base text-muted-foreground max-w-xs">
                                    Jump into interactive quiz sessions — solo or multiplayer — with live feedback and streaks.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="relative flex flex-col items-center p-10 rounded-[2rem] bg-card/60 border border-primary/30 backdrop-blur-xl
                                            hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_0_50px_rgba(var(--primary-rgb),0.4)]">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 flex items-center justify-center rounded-full 
                                                bg-gradient-to-br from-primary to-destructive text-white text-3xl font-black shadow-xl">
                                    3
                                </div>
                                <h3 className="mt-12 text-2xl font-bold text-foreground">Analyze & Grow</h3>
                                <p className="mt-3 text-base text-muted-foreground max-w-xs">
                                    Visualize learning patterns, gain insights from analytics, and celebrate mastery milestones.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                
            </div>

            {/* Sticky APK Download Button - MAX DRAMA (STATIC) */}
            {showApkButton && (
                <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 animate-in fade-in zoom-in duration-700">
                    <div className="relative group">
                        {/* Close Button - Extreme Style */}
                        <UltraButton
                            onClick={handleHideApkButton}
                            size="icon"
                            variant="destructive"
                            className="absolute -top-4 -right-4 h-12 w-12 rounded-full shadow-3xl z-50 transition-transform duration-300 bg-destructive/90 hover:bg-destructive ring-4 ring-background/80 hover:scale-125 border-4 border-destructive/10"
                            aria-label="Hide APK Download Button"
                        >
                            <X className="h-6 w-6" />
                        </UltraButton>

                        {/* APK Download Button - Final High Impact */}
                        <a
                            href="https://github.com/AdityaChoudhary01/ParikshaNode/releases/download/v1.0.0/parikshanode.apk"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <UltraButton
                                variant="destructive"
                                size="sm"
                                className="h-16 px-8 text-xl rounded-full bg-gradient-to-r from-destructive/90 to-red-600/90 shadow-2xl shadow-destructive/80 hover:shadow-destructive/90 transition-all duration-500 hover:scale-[1.05] ring-4 ring-destructive/30"
                            >
                                <Download className="h-6 w-6 mr-3 animate-bounce" />
                                APK
                            </UltraButton>
                        </a>
                    </div>
                </div>
            )}
        </>
    );
};


// Extracted the quiz card with Modular/Layered Styling (ULTRA-POP) - UNCHANGED
const QuizCard = ({ quiz, hasAttempted, resultId, user, index, isRecommended }) => {
    const delay = `${index * 75}ms`;

    return (
        <Card
            className={cn(
                "flex flex-col transition-all transform duration-500 rounded-[2.5rem] p-0 overflow-visible bg-card/80 backdrop-blur-sm", 
                "shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)] border-2 border-primary/30", 
                "hover:shadow-[0_25px_50px_-10px_rgba(var(--primary-rgb),0.8)] hover:scale-[1.03] group", 
                "animate-in fade-in slide-in-from-bottom-8 ease-out",
                isRecommended ? "border-destructive/60 ring-4 ring-destructive/30" : "", 
            )}
            style={{ animationDelay: delay, animationDuration: '600ms' }}
        >
            <div className={cn(
                "p-6 pb-4 flex-grow relative overflow-hidden",
                "bg-card/70 rounded-t-[2.5rem] border-b-2 border-primary/20", 
            )}>
                {isRecommended && (
                    <div className="absolute top-0 right-0 bg-gradient-to-br from-destructive to-red-400 text-white text-sm font-bold py-2 px-6 rounded-bl-[1.5rem] shadow-xl z-10 animate-pulse [filter:drop-shadow(0_0_10px_var(--tw-color-destructive))]">
                        TRENDING 🔥
                    </div>
                )}
                <CardTitle className="text-2xl font-black line-clamp-2 text-transparent bg-clip-text 
                                    bg-gradient-to-r from-primary to-destructive mb-2 
                                    [text-shadow:0_3px_10px_rgba(var(--primary-rgb),0.6)]">
                    {quiz.title}
                </CardTitle>
                <CardDescription className="line-clamp-3 min-h-[4.5rem] text-foreground/70 text-base tracking-wide">
                    {quiz.description}
                </CardDescription>
            </div>

            <CardContent className="space-y-4 pt-4 px-6">
                {/* Info Pills (Deeper Inner Shadow) */}
                <div className="flex items-center text-sm font-semibold text-foreground/90 p-3 rounded-xl bg-background/90 border border-input/50 shadow-inner shadow-primary/40">
                    <Tag className="w-5 h-5 mr-3 text-destructive shrink-0 [filter:drop-shadow(0_0_5px_var(--tw-color-destructive))]" />
                    <span className='truncate'>{quiz.category}</span>
                </div>
                <div className="flex items-center text-sm font-semibold text-foreground/90 p-3 rounded-xl bg-background/90 border border-input/50 shadow-inner shadow-primary/40">
                    <HelpCircle className="w-5 h-5 mr-3 text-primary shrink-0 [filter:drop-shadow(0_0_5px_var(--tw-color-primary))]" />
                    <span>{quiz.questions.length} Questions</span>
                </div>
            </CardContent>

            <CardFooter className="flex-col gap-4 p-6 pt-5 border-t-2 border-primary/20 bg-background/90 rounded-b-[2.5rem]">
                {hasAttempted ? (
                    <div className="w-full flex gap-4">
                        <Link to={`/results/${resultId}`} className="flex-1 min-w-0">
                            <UltraButton 
                                variant="secondary" 
                                className="w-full text-base font-bold rounded-xl shadow-lg shadow-input/50"
                                size="lg"
                            >
                                <FileText className="w-5 h-5 mr-2"/>
                                View Score
                            </UltraButton>
                        </Link>
                        <Link to={`/leaderboard/${quiz._id}`} className="flex-1 min-w-0">
                            <UltraButton 
                                variant="outline" 
                                size="lg"
                                className="w-full text-base font-bold"
                            >
                                <Trophy className="w-5 h-5 mr-2 fill-primary/40"/>
                                Rank Board
                            </UltraButton>
                        </Link>
                    </div>
                ) : (
                    <Link to={`/quiz/${quiz._id}`} className="w-full">
                        <UltraButton
                            size="lg"
                            className={cn(
                                "w-full text-lg font-black rounded-xl shadow-2xl transition-all duration-300 hover:scale-[1.01]",
                                !user ? "bg-destructive hover:bg-destructive/90 shadow-destructive/60" 
                                            : "bg-primary hover:bg-primary/90 shadow-primary/60",
                            )}
                            disabled={!user}
                        >
                            {user ? 'Initiate Quiz Protocol' : 'Login to Access'}
                        </UltraButton>
                    </Link>
                )}
                
                {user && (
                    <Link to={`/live-quiz/${quiz._id}`} className="w-full">
                        <UltraButton variant="link" className="w-full text-base text-primary/80 hover:text-primary font-bold">
                            <Zap className="w-5 h-5 mr-2 fill-destructive/50"/>
                            Host Live Battle
                        </UltraButton>
                    </Link>
                )}
            </CardFooter>
        </Card>
    );
};

export default HomePage;
