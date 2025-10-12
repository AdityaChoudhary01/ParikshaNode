import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFetch } from '@/hooks/useFetch';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import Loader from '@/components/Loader';
import { Clock, HelpCircle, Tag, BookOpen, LayoutDashboard, BarChart, Trophy, FileText, Search, Zap, ArrowLeft, ArrowRight, Download, X, Lightbulb, TrendingUp, Users, HeartHandshake } from 'lucide-react'; 
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

// SEO CONSTANTS (PRESERVED)
const SITE_NAME = "ParikshaNode";
const SITE_URL = "https://parikshanode.netlify.app/";
const LOGO_URL = "https://parikshanode.netlify.app/logo.png";
const MAIN_TITLE = `${SITE_NAME} | Master Any Subject, One Quiz at a Time`;
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

    const { data: fetchResult, isLoading: quizzesLoading, error } = useFetch(quizFetchUrl, [quizFetchUrl]);
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

    // --- SEO: JSON-LD Structured Data Schema (Preserved) ---
    const schemaMarkup = {
        "@context": "https://schema.org",
        "@graph": [
           {
                "@type": "WebSite",
                "name": SITE_NAME,
                "url": SITE_URL,
                "description": MAIN_DESCRIPTION
            },
            {
                "@type": "Organization",
                "name": SITE_NAME,
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
    if (quizzesLoading || historyLoading) return <Loader />;
    if (error) return <p className="text-center text-destructive">Error: {error}</p>;

    return (
        <>
            <Helmet>
                {/* SEO Tags (Preserved) */}
                <title>{MAIN_TITLE}</title>
                <meta name="description" content={MAIN_DESCRIPTION} />
                <link rel="canonical" href={SITE_URL} />
                <meta property="og:title" content={MAIN_TITLE} />
                <meta property="og:image" content={LOGO_URL} />
                <meta name="twitter:image" content={LOGO_URL} /> 
                <script type="application/ld+json">
                    {JSON.stringify(schemaMarkup)}
                </script>
            </Helmet>
            
            {/* Background Enhancement for Depth */}
            <div className="space-y-24 md:space-y-32 container py-4 md:py-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-color-background)_60%,_var(--tw-color-primary)/10)] min-h-screen">
                {/* 🚀 Hero Section - MAX VISUAL DRAMA */}
              <section
  className="relative overflow-hidden text-center py-24 md:py-48 
             rounded-[2.5rem] sm:rounded-[4rem] bg-card/70 backdrop-blur-[30px]
             border-4 border-primary/60 shadow-[0_40px_150px_-30px_rgba(var(--primary-rgb),0.9),_0_0_200px_rgba(var(--primary-rgb),0.3)]
             transition-all duration-700"
>
  {/* 🌌 Animated Ambient Background */}
  <div className="absolute inset-0 z-0">
    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_30%,_rgba(var(--primary-rgb),0.6),_transparent_60%)] animate-pulse-slow"></div>
    <div className="absolute w-[150%] h-[150%] -top-[25%] -left-[25%] bg-[conic-gradient(from_0deg,_rgba(var(--primary-rgb),0.1),_transparent_50%,_rgba(var(--destructive-rgb),0.15)_90%)] animate-spin-slow"></div>
  </div>

  {/* 🌠 Foreground Content */}
  <div className="relative z-10 px-6 animate-in fade-in slide-in-from-top-10 duration-900">

    {/* 🪶 Intro Text */}
    <p
      className="text-[clamp(1.25rem,2vw,2rem)] md:text-[clamp(2rem,3vw,3rem)] 
                 font-extrabold uppercase tracking-[0.75rem] sm:tracking-[1rem] mb-10
                 bg-gradient-to-r from-primary via-destructive to-primary bg-clip-text text-transparent
                 drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]"
    >
      P A R I K S H A N O D E
    </p>

    {/* 🏆 Hero Title */}
    <h1
      className="text-[clamp(3.5rem,8vw,10rem)] font-black tracking-tighter leading-none mb-4
                 text-white bg-clip-text 
                 [text-shadow:0_0_60px_rgba(255,255,255,0.7),_0_10px_150px_rgba(var(--primary-rgb),0.9)]"
    >
      MASTERY
    </h1>

    {/* ✨ Subtitle */}
    <h2
      className="text-[clamp(2rem,4vw,5rem)] font-black tracking-tight 
                 text-transparent bg-clip-text bg-gradient-to-r from-primary to-destructive 
                 [text-shadow:0_0_25px_rgba(var(--destructive-rgb),0.6)]"
    >
      UNLOCKED.
    </h2>

    {/* 💬 Description */}
    <p
      className="mt-10 sm:mt-14 text-[clamp(1.125rem,1.6vw,1.75rem)] text-foreground/90 
                 font-medium max-w-5xl mx-auto tracking-wide opacity-95
                 animate-in fade-in duration-1000 delay-300
                 [text-shadow:0_0_5px_rgba(0,0,0,0.4)]"
    >
      The next generation quiz platform: <strong>Sculpt your learning path</strong> with live multiplayer,
      deep analytics, and instant content creation.
    </p>

    {/* 🚀 CTA Buttons */}
    <div className="mt-16 flex flex-col sm:flex-row justify-center gap-6 sm:gap-10 max-w-xl mx-auto">
      <UltraButton
        size="xl"
        onClick={handleBrowseClick}
        className="w-full sm:w-auto hover:scale-105 transition-transform duration-300"
      >
        <Zap className="w-6 h-6 mr-3 animate-pulse" />
        Challenge Yourself
      </UltraButton>

      {user ? (
        user.role === 'admin' ? (
          <Link to="/admin" className="w-full sm:w-auto">
            <UltraButton
              size="xl"
              variant="outline"
              className="w-full text-base sm:text-xl hover:scale-105 transition-transform duration-300"
            >
              <LayoutDashboard className="w-6 h-6 mr-2 text-primary" />
              Admin Dashboard
            </UltraButton>
          </Link>
        ) : (
          <Link to="/history" className="w-full sm:w-auto">
            <UltraButton
              size="xl"
              variant="outline"
              className="w-full text-base sm:text-xl hover:scale-105 transition-transform duration-300"
            >
              <Clock className="w-6 h-6 mr-2 text-primary" />
              My History Hub
            </UltraButton>
          </Link>
        )
      ) : (
        <Link to="/register" className="w-full sm:w-auto">
          <UltraButton
            size="xl"
            variant="destructive"
            className="w-full text-base sm:text-xl hover:scale-105 transition-transform duration-300"
          >
            <HeartHandshake className="w-6 h-6 mr-2" />
            Join the Network
          </UltraButton>
        </Link>
      )}
    </div>
  </div>
</section>


                {/* --- 🌟 Recommended for You Section (Modular Tiles - ENHANCED) --- */}
                {user && recommendedCategory && recommendedQuizzes.length > 0 && (
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
                    
                    {/* Quiz Cards Grid */}
                    <div className="mt-12 md:mt-16 px-4">
                        {quizzes && quizzes.length > 0 ? (
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
                        {totalPages > 1 && (
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

                {/* --- Why Choose Section (Modular Floating Cards - ENHANCED) --- */}
                <section className="text-center py-10 animate-in fade-in duration-1000 px-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-destructive inline-block drop-shadow-md">
                        Why Choose ParikshaNode?
                    </h2>
                    <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">Layered features for serious knowledge enhancement.</p>
                    <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {/* Feature 1: Curated Library (Holographic Card) */}
                        <Card className="flex flex-col items-center p-8 rounded-[2.5rem] bg-card/70 border-2 border-primary/40 backdrop-blur-md
                                     shadow-[0_20px_40px_rgba(var(--primary-rgb),0.5)] hover:shadow-[0_30px_60px_rgba(var(--primary-rgb),0.8)]
                                     transition-all duration-300 hover:scale-[1.03] animate-in slide-in-from-bottom-8 delay-100">
                            <div className="p-6 rounded-full bg-primary/30 shadow-2xl ring-4 ring-primary/20 [filter:drop-shadow(0_0_15px_var(--tw-color-primary))]">
                                <BookOpen className="w-12 h-12 text-primary drop-shadow-lg" />
                            </div>
                            <CardTitle className="text-2xl font-black mt-6 text-foreground/95">Curated Library</CardTitle>
                            <CardContent className="mt-3 text-muted-foreground text-base">
                                <p>Access thousands of expert-vetted quizzes across all major disciplines.</p>
                            </CardContent>
                        </Card>
                        {/* Feature 2: Create & Share (Holographic Card) */}
                        <Card className="flex flex-col items-center p-8 rounded-[2.5rem] bg-card/70 border-2 border-destructive/40 backdrop-blur-md
                                     shadow-[0_20px_40px_rgba(var(--destructive-rgb),0.5)] hover:shadow-[0_30px_60px_rgba(var(--destructive-rgb),0.8)]
                                     transition-all duration-300 hover:scale-[1.03] animate-in slide-in-from-bottom-8 delay-200">
                            <CardHeader className="p-0 items-center">
                                <div className="p-6 rounded-full bg-destructive/30 shadow-2xl ring-4 ring-destructive/20 [filter:drop-shadow(0_0_15px_var(--tw-color-destructive))]">
                                    <LayoutDashboard className="w-12 h-12 text-destructive drop-shadow-lg" />
                                </div>
                                <CardTitle className="text-2xl font-black mt-6 text-foreground/95">Create & Share</CardTitle>
                            </CardHeader>
                            <CardContent className="mt-3 text-muted-foreground text-base">
                                <p>Any user can easily create and share quizzes with a unique link, including live sessions.</p>
                            </CardContent>
                        </Card>
                        {/* Feature 3: Real-time Analytics (Holographic Card) */}
                        <Card className="flex flex-col items-center p-8 rounded-[2.5rem] bg-card/70 border-2 border-primary/40 backdrop-blur-md
                                     shadow-[0_20px_40px_rgba(var(--primary-rgb),0.5)] hover:shadow-[0_30px_60px_rgba(var(--primary-rgb),0.8)]
                                     transition-all duration-300 hover:scale-[1.03] animate-in slide-in-from-bottom-8 delay-300">
                            <div className="p-6 rounded-full bg-primary/30 shadow-2xl ring-4 ring-primary/20 [filter:drop-shadow(0_0_15px_var(--tw-color-primary))]">
                                <BarChart className="w-12 h-12 text-primary drop-shadow-lg" />
                            </div>
                            <CardTitle className="text-2xl font-black mt-6 text-foreground/95">Deep Metrics</CardTitle>
                            <CardContent className="mt-3 text-muted-foreground text-base">
                                <p>Visualize your progress, identify weaknesses, earn achievements, and review answers in detail.</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <hr className="border-t-4 border-primary/40 opacity-50 shadow-[0_0_15px_var(--tw-color-primary)]" />
                
                {/* --- How It Works Section (ENHANCED) --- */}
                <section className="text-center py-10 animate-in fade-in duration-1000 px-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-12 bg-clip-text text-transparent bg-gradient-to-r from-destructive to-primary inline-block drop-shadow-md">
                        Mastery in <span className='text-5xl md:text-6xl'>3</span> Rapid Steps
                    </h2>
                    <div className="mt-12 grid md:grid-cols-3 gap-8 md:gap-12">
                        {/* Step 1 (Glowing Numbers) */}
                        <div className="flex flex-col items-center animate-in zoom-in duration-700 delay-100 p-8 rounded-[2rem] bg-card/80 border-2 border-primary/20 shadow-3xl shadow-primary/40 hover:shadow-primary/60 transition-all duration-300">
                            <div className="text-6xl font-black text-white bg-clip-text bg-gradient-to-br from-primary to-destructive w-24 h-24 flex items-center justify-center rounded-full mb-6 border-4 border-primary/70 shadow-2xl shadow-primary/60 ring-4 ring-primary/20 [text-shadow:0_0_15px_var(--tw-color-primary)]">1</div>
                            <h3 className="text-2xl font-bold mt-4 text-foreground/95">Browse & Discover</h3>
                            <p className="text-muted-foreground mt-2 max-w-xs text-base">Explore our massive, dynamic library of quizzes using advanced filtering.</p>
                        </div>
                        {/* Step 2 */}
                        <div className="flex flex-col items-center animate-in zoom-in duration-700 delay-200 p-8 rounded-[2rem] bg-card/80 border-2 border-primary/20 shadow-3xl shadow-primary/40 hover:shadow-primary/60 transition-all duration-300">
                            <div className="text-6xl font-black text-white bg-clip-text bg-gradient-to-br from-primary to-destructive w-24 h-24 flex items-center justify-center rounded-full mb-6 border-4 border-primary/70 shadow-2xl shadow-primary/60 ring-4 ring-primary/20 [text-shadow:0_0_15px_var(--tw-color-primary)]">2</div>
                            <h3 className="text-2xl font-bold mt-4 text-foreground/95">Engage in Quizzes</h3>
                            <p className="text-muted-foreground mt-2 max-w-xs text-base">Take the challenge with timed, responsive single-player or real-time multiplayer modes.</p>
                        </div>
                        {/* Step 3 */}
                        <div className="flex flex-col items-center animate-in zoom-in duration-700 delay-300 p-8 rounded-[2rem] bg-card/80 border-2 border-primary/20 shadow-3xl shadow-primary/40 hover:shadow-primary/60 transition-all duration-300">
                            <div className="text-6xl font-black text-white bg-clip-text bg-gradient-to-br from-primary to-destructive w-24 h-24 flex items-center justify-center rounded-full mb-6 border-4 border-primary/70 shadow-2xl shadow-primary/60 ring-4 ring-primary/20 [text-shadow:0_0_15px_var(--tw-color-primary)]">3</div>
                            <h3 className="text-2xl font-bold mt-4 text-foreground/95">Achieve & Track</h3>
                            <p className="text-muted-foreground mt-2 max-w-xs text-base">Review answers, earn exclusive achievements, and climb the global leaderboards.</p>
                        </div>
                    </div>
                </section>
                
            </div>

            {/* Sticky APK Download Button - MAX DRAMA */}
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
                                size="lg"
                                className="h-16 px-8 text-xl rounded-full bg-gradient-to-r from-destructive/90 to-red-600/90 shadow-2xl shadow-destructive/80 hover:shadow-destructive/90 transition-all duration-500 hover:scale-[1.05] ring-4 ring-destructive/30"
                            >
                                <Download className="h-6 w-6 mr-3 animate-bounce" />
                                GET THE APP
                            </UltraButton>
                        </a>
                    </div>
                </div>
            )}
        </>
    );
};


// Extracted the quiz card with Modular/Layered Styling (ULTRA-POP)
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
