import React, { useMemo, useState, useEffect, useCallback } from 'react'; // Added useEffect, useCallback
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFetch } from '@/hooks/useFetch';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import Loader from '@/components/Loader';
// PRESERVED: All icons are imported as requested
// ADDED: Download and X icon for the APK button
import { Clock, HelpCircle, Tag, BookOpen, LayoutDashboard, BarChart, Trophy, FileText, Search, Zap, ArrowLeft, ArrowRight, Download, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { cn } from '@/lib/utils'; // Utility for complex class names


// SEO CONSTANTS
const SITE_NAME = "ParikshaNode";
const SITE_URL = "https://parikshanode.netlify.app/";
const LOGO_URL = "https://parikshanode.netlify.app/logo.png";
const MAIN_TITLE = `${SITE_NAME} | Master Any Subject, One Quiz at a Time`;
const MAIN_DESCRIPTION = "ParikshaNode is the next generation MERN stack quiz platform. Create, share, and challenge yourself with thousands of expert-curated quizzes. Perfect for students and professionals to track progress with deep analytics, join live battles, and enhance knowledge across science, history, programming, and more.";

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
    
    // State 1: Instant value in the input field (updates on every keystroke)
    const [searchTerm, setSearchTerm] = useState('');
    // State 2: Override value for immediate search (only updates on Enter key)
    const [instantSearchTerm, setInstantSearchTerm] = useState(''); 
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    // NEW STATE: For controlling the visibility of the APK button
    const [showApkButton, setShowApkButton] = useState(true);

    // Debounced value (updates 5000ms after the user stops typing)
    const debouncedSearchTerm = useDebounce(searchTerm, 5000); 
    
    // Active search term: prioritize instantSearchTerm, then fall back to debounced term
    const activeSearchTerm = useMemo(() => {
        return instantSearchTerm || debouncedSearchTerm;
    }, [instantSearchTerm, debouncedSearchTerm]);

    // Reset page to 1 when search term or category changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeSearchTerm, selectedCategory]);

    // Construct the query string for fetching quizzes
    const quizFetchUrl = useMemo(() => {
        let url = `/quizzes?page=${currentPage}&limit=${PAGE_LIMIT}&`; // ADDED PAGINATION PARAMS
        // Use the activeSearchTerm, which ensures immediate fetch on Enter
        if (activeSearchTerm) url += `keyword=${encodeURIComponent(activeSearchTerm)}&`;
        if (selectedCategory && selectedCategory !== 'All') url += `category=${encodeURIComponent(selectedCategory)}&`;
        return url;
    }, [activeSearchTerm, selectedCategory, currentPage]); 

    // Destructure paginated data
    const { data: fetchResult, isLoading: quizzesLoading, error } = useFetch(quizFetchUrl, [quizFetchUrl]); 
    
    const quizzes = fetchResult?.quizzes || [];
    const totalPages = fetchResult?.pages || 1; // Total pages for controls
    
    const { data: history, isLoading: historyLoading } = useFetch(user ? '/results/my-history' : null);

    // --- NEW: Handle Enter Key Press for Immediate Search (Preserved) ---
    const handleSearchKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevents form submission/page reload
            
            // Set the instantSearchTerm state to force an immediate fetch
            setInstantSearchTerm(searchTerm);
        } else {
            // Clear the instant search state on any other key press 
            // to ensure we default back to the debounced term logic.
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
        if (!fetchResult) return new Set(); // Use fetchResult to get all available categories 
        // Note: This needs refactoring if you want ALL categories regardless of search/page.
        return new Set(quizzes.map(q => q.category));
    }, [quizzes]);
    
    const recommendedCategory = useMemo(() => {
        if (!history || history.length === 0) return null;
        
        const categoryCounts = history.reduce((acc, result) => {
            const category = result.quiz?.category;
            if (category) {
                acc[category] = (acc[category] || 0) + 1;
            }
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
    
    // Inline form submit handler for search prevention
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setInstantSearchTerm(searchTerm); // Force immediate search on click/explicit submit
    };

     // --- SEO: JSON-LD Structured Data Schema ---
    const schemaMarkup = {
        "@context": "https://schema.org",
        "@graph": [
           {
                // WebSite Schema for Search Box Sitelinks and overall site context
                "@type": "WebSite",
                "name": SITE_NAME,
                "url": SITE_URL,
                "description": MAIN_DESCRIPTION
            },
            {
                // Organization Schema for brand recognition
                "@type": "Organization",
                "name": SITE_NAME,
                "url": SITE_URL,
                "logo": LOGO_URL,
                "sameAs": [
                    // Add your social media links here
                    "https://github.com/AdityaChoudhary01/ParikshaNode", 
                     "https://www.instagram.com/aditya_choudhary__021/",
                    "https://www.linkedin.com/in/aditya-kumar-38093a304/"
                    // "https://www.linkedin.com/company/yourcompany/" 
                ]
            }
        ]
    };

    if (quizzesLoading || historyLoading) return <Loader />;
    if (error) return <p className="text-center text-destructive">Error: {error}</p>;

    // NEW: Handler to hide the button
    const handleHideApkButton = () => {
        setShowApkButton(false);
    };

    return (
        <>
            <Helmet>
                {/* Primary SEO Tags */}
                <title>{MAIN_TITLE}</title>
                <meta name="description" content={MAIN_DESCRIPTION} />
                <link rel="canonical" href={SITE_URL} />
                
                {/* Open Graph Tags (for social media sharing) */}
                <meta property="og:title" content={MAIN_TITLE} />
                <meta property="og:description" content={MAIN_DESCRIPTION} />
                <meta property="og:url" content={SITE_URL} />
                <meta property="og:site_name" content={SITE_NAME} />
                <meta property="og:type" content="website" />
                <meta property="og:image" content={LOGO_URL} />

                {/* Structured Data (Schema.org) for Rich Snippets */}
                <script type="application/ld+json">
                    {JSON.stringify(schemaMarkup)}
                </script>
            </Helmet>
            <div className="space-y-20">
                {/* Hero Section - Ultra Modern Design (omitted for brevity, assume unchanged) */}
                <section className="text-center py-20 md:py-32 relative overflow-hidden rounded-3xl border border-primary/20 shadow-2xl shadow-primary/30 
                                 bg-gradient-to-br from-card/80 via-background to-card/80 
                                 before:content-[''] before:absolute before:inset-0 before:opacity-20 before:bg-primary/20 before:dark:opacity-10 
                                 before:[mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)]">
                    
                    <div className="relative z-10 animate-in fade-in slide-in-from-top-10 duration-700">
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl text-transparent bg-clip-text 
                                     bg-gradient-to-r from-primary to-destructive drop-shadow-xl">
                            Master Any Subject, One Quiz at a Time
                        </h1>
                        <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto opacity-90">
                            ParikshaNode offers a modern, engaging platform to create, share, and take quizzes. Sharpen your skills, challenge friends, and track your progress with our intuitive tools.
                        </p>
                        <div className="mt-10 flex justify-center gap-4">
                            <Button 
                                size="lg" 
                                onClick={handleBrowseClick} 
                                className="shadow-lg shadow-primary/40 hover:shadow-xl hover:shadow-primary/50 transition-all duration-300 animate-pulse hover:animate-none"
                            >
                                Browse Quizzes
                            </Button>
                            {user ? (
                                user.role === 'admin' ? (
                                    <Link to="/admin"><Button size="lg" variant="outline" className="shadow-md">Admin Dashboard</Button></Link>
                                ) : (
                                    <Link to="/history"><Button size="lg" variant="outline" className="shadow-md">My History</Button></Link>
                                )
                            ) : (
                                <Link to="/register"><Button size="lg" variant="outline" className="shadow-md">Get Started</Button></Link>
                            )}
                        </div>
                    </div>
                </section>

                {/* Feature 5: Recommended for You Section (omitted for brevity, assume unchanged) */}
                {user && recommendedCategory && recommendedQuizzes.length > 0 && (
                    <section className="text-center animate-in fade-in duration-1000">
                        <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary/80 to-destructive/80 inline-block">
                                Recommended for You ✨
                        </h2>
                        <p className="mt-2 text-muted-foreground">Based on your past interest in **{recommendedCategory}**</p>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {recommendedQuizzes.map(quiz => (
                                <QuizCard key={quiz._id} quiz={quiz} hasAttempted={Boolean(attemptedQuizzesMap[quiz._id])} resultId={attemptedQuizzesMap[quiz._id]} user={user} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Quiz List Section */}
                <section id="quizzes">
                    <h2 className="text-4xl font-extrabold tracking-tight text-center mb-10">Explore Our Quizzes</h2>
                    
                    {/* Feature 5: Search and Filter UI - Improved appearance */}
                    <form onSubmit={handleSearchSubmit} className="max-w-4xl mx-auto mt-6">
                        <div className="flex flex-col sm:flex-row gap-4 shadow-xl rounded-xl p-2 bg-card/70 border border-input/50">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                                <Input 
                                    type="text"
                                    placeholder="Search quizzes by title, description, or tags..."
                                    className="pl-11 h-12 text-md border-none focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-0 transition-shadow duration-300 bg-transparent"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                />
                            </div>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-full sm:w-[200px] flex-shrink-0 h-12 text-md border-input/70 focus:ring-primary focus:ring-2 focus-visible:ring-offset-0 transition-shadow duration-300">
                                    <SelectValue placeholder="Filter by Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Categories</SelectItem>
                                    {Array.from(allCategories).sort().map(category => (
                                        <SelectItem key={category} value={category}>{category}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {/* Hidden submit button to allow Enter key functionality */}
                            <button type="submit" style={{ display: 'none' }} aria-hidden="true" />
                        </div>
                    </form>
                    {/* End Feature 5: Search and Filter UI */}
                    
                    <div className="mt-12">
                        {quizzes && quizzes.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground mt-10 p-8 border rounded-lg bg-card/50">
                                No quizzes found matching your criteria. Try broadening your search or filter.
                            </p>
                        )}
                        
                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-12">
                                <Button 
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    variant="outline"
                                    size="icon"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                                <span className="text-lg font-semibold text-foreground/90">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button 
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    variant="outline"
                                    size="icon"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </div>
                        )}
                    </div>
                </section>
                
                {/* --- RESTORED & ULTRA-MODERN FEATURES SECTION (Preserved) --- */}
                <section className="text-center py-10 animate-in fade-in duration-1000">
                    <h2 className="text-4xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-destructive inline-block drop-shadow-md">
                        Why Choose ParikshaNode?
                    </h2>
                    <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">Everything you need in a modern, fast, and feature-rich quiz platform.</p>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1: Diverse Categories */}
                        <Card className="hover:scale-[1.05] transition-transform duration-300 shadow-2xl shadow-primary/20 hover:shadow-primary/40 border-primary/20 animate-in slide-in-from-bottom-6 duration-700 delay-100">
                            <CardHeader className="items-center space-y-4">
                                <div className="p-4 bg-primary/20 rounded-xl shadow-lg shadow-primary/30 transform hover:scale-110 transition-transform duration-300">
                                    <BookOpen className="w-10 h-10 text-primary drop-shadow-lg" />
                                </div>
                                <CardTitle className="text-2xl">Diverse Categories</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">From programming to history, find quizzes on a wide range of subjects. New quizzes generated instantly with Gemini AI.</p>
                            </CardContent>
                        </Card>
                        {/* Feature 2: Create & Share */}
                        <Card className="hover:scale-[1.05] transition-transform duration-300 shadow-2xl shadow-primary/20 hover:shadow-primary/40 border-primary/20 animate-in slide-in-from-bottom-6 duration-700 delay-200">
                            <CardHeader className="items-center space-y-4">
                                <div className="p-4 bg-primary/20 rounded-xl shadow-lg shadow-primary/30 transform hover:scale-110 transition-transform duration-300">
                                    <LayoutDashboard className="w-10 h-10 text-primary drop-shadow-lg" />
                                </div>
                                <CardTitle className="text-2xl">Create & Share</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Any user can create and share their own quizzes with a unique link, including live multiplayer sessions.</p>
                            </CardContent>
                        </Card>
                        {/* Feature 3: Real-time Analytics (BarChart) */}
                        <Card className="hover:scale-[1.05] transition-transform duration-300 shadow-2xl shadow-primary/20 hover:shadow-primary/40 border-primary/20 animate-in slide-in-from-bottom-6 duration-700 delay-300">
                            <CardHeader className="items-center space-y-4">
                                <div className="p-4 bg-primary/20 rounded-xl shadow-lg shadow-primary/30 transform hover:scale-110 transition-transform duration-300">
                                    <BarChart className="w-10 h-10 text-primary drop-shadow-lg" />
                                </div>
                                <CardTitle className="text-2xl">Real-time Analytics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Get immediate feedback, detailed answer reviews, earn achievements, and track your performance against others.</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* --- RESTORED & ULTRA-MODERN HOW IT WORKS SECTION (Preserved) --- */}
                <section className="text-center py-10 animate-in fade-in duration-1000">
                    <h2 className="text-4xl font-extrabold tracking-tight mb-12 bg-clip-text text-transparent bg-gradient-to-r from-destructive to-primary inline-block drop-shadow-md">
                        Get Started in 3 Easy Steps
                    </h2>
                    <div className="mt-12 grid md:grid-cols-3 gap-12">
                        <div className="flex flex-col items-center animate-in zoom-in duration-700 delay-100">
                            <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-destructive w-20 h-20 flex items-center justify-center rounded-full mb-4 border-4 border-primary/50 shadow-xl shadow-primary/20">1</div>
                            <h3 className="text-2xl font-bold mt-4 text-foreground/90">Browse</h3>
                            <p className="text-muted-foreground mt-2 max-w-xs">Explore our growing library of quizzes on various topics using the search and filter tools.</p>
                        </div>
                        <div className="flex flex-col items-center animate-in zoom-in duration-700 delay-200">
                            <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-destructive w-20 h-20 flex items-center justify-center rounded-full mb-4 border-4 border-primary/50 shadow-xl shadow-primary/20">2</div>
                            <h3 className="text-2xl font-bold mt-4 text-foreground/90">Take the Quiz</h3>
                            <p className="text-muted-foreground mt-2 max-w-xs">Challenge yourself with our timed, interactive quiz interface in single-player or live multiplayer mode.</p>
                        </div>
                        <div className="flex flex-col items-center animate-in zoom-in duration-700 delay-300">
                            <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-destructive w-20 h-20 flex items-center justify-center rounded-full mb-4 border-4 border-primary/50 shadow-xl shadow-primary/20">3</div>
                            <h3 className="text-2xl font-bold mt-4 text-foreground/90">Achieve</h3>
                            <p className="text-muted-foreground mt-2 max-w-xs">Get your score, review answers, earn achievements, and climb the global leaderboards.</p>
                        </div>
                    </div>
                </section>
                
            </div>

            {/* NEW: Sticky APK Download Button in Bottom Right Corner */}
            {showApkButton && (
                <div className="fixed bottom-4 right-4 z-50">
                    <div className="relative group">
                        {/* Cross/Close Button */}
                        <Button
                            onClick={handleHideApkButton}
                            size="icon"
                            variant="destructive"
                            className="absolute -top-3 -right-3 h-8 w-8 rounded-full shadow-lg z-50 transition-transform duration-200 hover:scale-110"
                            aria-label="Hide APK Download Button"
                        >
                            <X className="h-4 w-4" />
                        </Button>

                        {/* APK Download Button */}
                        <a 
                            href="https://github.com/AdityaChoudhary01/ParikshaNode/releases/download/v1.0.0/parikshanode.apk"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <Button
                                className="h-14 px-6 rounded-xl text-lg font-bold shadow-2xl shadow-primary/50 transition-all duration-300 bg-primary hover:bg-primary/90 hover:scale-[1.02] flex items-center gap-2"
                            >
                                <Download className="h-6 w-6" />
                                Get App (APK)
                            </Button>
                        </a>
                    </div>
                </div>
            )}
        </>
    );
};


// Extracted the quiz card into a component for reusability with modern styling
const QuizCard = ({ quiz, hasAttempted, resultId, user, index }) => {
    // Calculate animation delay for staggered effect
    const delay = `${index * 50}ms`;

    return (
        <Card 
            className={cn(
                "flex flex-col transition-all transform duration-300 border-primary/10 hover:border-primary/50 bg-card/70",
                "hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.03] animate-in fade-in slide-in-from-bottom-4",
                "ease-out"
            )}
            style={{ animationDelay: delay, animationDuration: '500ms' }}
        >
            <CardHeader className="pb-4">
                <CardTitle className="text-xl line-clamp-2 text-primary drop-shadow-sm">{quiz.title}</CardTitle>
                <CardDescription className="line-clamp-3 min-h-[4.5rem]">{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-2 pt-0">
                {/* Updated Icon Colors */}
                <div className="flex items-center text-sm text-muted-foreground"><Tag className="w-4 h-4 mr-2 text-destructive" /><span>{quiz.category}</span></div>
                <div className="flex items-center text-sm text-muted-foreground"><HelpCircle className="w-4 h-4 mr-2 text-destructive" /><span>{quiz.questions.length} Questions</span></div>
            </CardContent>
            <CardFooter className="flex-col gap-2 pt-4 border-t border-border/50">
                {hasAttempted ? (
                    <div className="w-full flex gap-2">
                        <Link to={`/results/${resultId}`} className="flex-1">
                            <Button variant="outline" className="w-full text-sm hover:border-primary/80"><FileText className="w-4 h-4 mr-2"/>View Results</Button>
                        </Link>
                        <Link to={`/leaderboard/${quiz._id}`} className="flex-1">
                            <Button variant="secondary" className="w-full text-sm"><Trophy className="w-4 h-4 mr-2"/>Leaderboard</Button>
                        </Link>
                    </div>
                ) : (
                    <Link to={`/quiz/${quiz._id}`} className="w-full">
                        <Button className="w-full" disabled={!user}>
                            {user ? 'Start Quiz' : 'Login to Start'}
                        </Button>
                    </Link>
                )}
                {/* Feature 3: Live Quiz Link */}
                {user && (
                    <Link to={`/live-quiz/${quiz._id}`} className="w-full">
                        <Button variant="link" className="w-full text-sm text-primary hover:text-primary/80 hover:scale-[0.98] transition-transform">
                            <Zap className="w-4 h-4 mr-1 fill-primary/50"/> Start Live Quiz
                        </Button>
                    </Link>
                )}
            </CardFooter>
        </Card>
    );
};

export default HomePage;

