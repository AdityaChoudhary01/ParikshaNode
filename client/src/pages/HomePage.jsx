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
import { Clock, HelpCircle, Tag, BookOpen, LayoutDashboard, BarChart, Trophy, FileText, Search, Zap } from 'lucide-react'; 
import { Helmet } from 'react-helmet-async';
import { cn } from '@/lib/utils'; // Utility for complex class names

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


const HomePage = () => {
    const { user } = useSelector((state) => state.auth);
    
    // State 1: Instant value in the input field (updates on every keystroke)
    const [searchTerm, setSearchTerm] = useState('');
    // State 2: Override value for immediate search (only updates on Enter key)
    const [instantSearchTerm, setInstantSearchTerm] = useState(''); 
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    // Debounced value (updates 5000ms after the user stops typing)
    const debouncedSearchTerm = useDebounce(searchTerm, 5000); 
    
    // Active search term: prioritize instantSearchTerm, then fall back to debounced term
    const activeSearchTerm = useMemo(() => {
        return instantSearchTerm || debouncedSearchTerm;
    }, [instantSearchTerm, debouncedSearchTerm]);

    // Construct the query string for fetching quizzes
    const quizFetchUrl = useMemo(() => {
        let url = '/quizzes?';
        // Use the activeSearchTerm, which ensures immediate fetch on Enter
        if (activeSearchTerm) url += `keyword=${encodeURIComponent(activeSearchTerm)}&`;
        if (selectedCategory && selectedCategory !== 'All') url += `category=${encodeURIComponent(selectedCategory)}&`;
        return url;
    }, [activeSearchTerm, selectedCategory]); 

    // Added quizFetchUrl as a dependency for refetching
    const { data: quizzes, isLoading: quizzesLoading, error } = useFetch(quizFetchUrl, [quizFetchUrl]); 
    
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
        if (!quizzes) return new Set();
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

    if (quizzesLoading || historyLoading) return <Loader />;
    if (error) return <p className="text-center text-destructive">Error: {error}</p>;

    return (
        <>
            <Helmet>
                <title>ParikshaNode | Master Any Subject, One Quiz at a Time</title>
                <meta name="description" content="An advanced MERN stack quiz platform to create, share, and take quizzes. Perfect for students and professionals to test and enhance their knowledge." />
            </Helmet>
            <div className="space-y-20">
                {/* Hero Section - Ultra Modern Design */}
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

                {/* Feature 5: Recommended for You Section */}
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
                                    onKeyDown={handleSearchKeyDown} // Attached handler for instant search
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
                                            index={index} // Pass index for delay animation
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground mt-10 p-8 border rounded-lg bg-card/50">
                                No quizzes found matching your criteria. Try broadening your search or filter.
                            </p>
                        )}
                    </div>
                </section>
                
                {/* --- RESTORED & ULTRA-MODERN FEATURES SECTION --- */}
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

                {/* --- RESTORED & ULTRA-MODERN HOW IT WORKS SECTION --- */}
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
