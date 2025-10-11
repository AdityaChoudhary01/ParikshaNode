import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
// Added icons for a richer UI
import { Coffee, Globe, Lightbulb, ShieldBan, Heart, Code, Users } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { cn } from '@/lib/utils'; // Keep utility imports for modern styling

// --- SEO CONSTANTS ---
const SITE_NAME = "ParikshaNode";
const SITE_URL = "https://parikshanode.netlify.app/"; // IMPORTANT: Replace with your live domain
const DONATE_URL = `${SITE_URL}donate`;
const DEVELOPER_NAME = "Aditya Choudhary";

// --- Project Funding Schema for Structured Data ---
const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Support ParikshaNode - Keep the Quiz Platform Ad-Free",
    "description": "Donate to cover server costs and fund new feature development for the ParikshaNode MERN stack quiz project.",
    "url": DONATE_URL,
    "mainEntity": {
        "@type": "FundingAgency",
        "name": "Community Supporters",
        "description": "ParikshaNode is a non-profit, ad-free educational platform sustained entirely by community donations.",
        "url": DONATE_URL
    },
    // Optional: Add Developer as a Person entity related to the page
    "author": {
        "@type": "Person",
        "name": DEVELOPER_NAME,
        "url": "https://www.linkedin.com/in/aditya-kumar-38093a304/" // Developer's primary profile
    }
};
// ----------------------------------------------------------------

const DonatePage = () => {
    // ❌ UPI details REMOVED:
    // const upiQRCodeUrl = '...'; 

    return (
        <>
            <Helmet>
                {/* Primary SEO Tags: Focus on "Support" and "Ad-Free" */}
                <title>Support ParikshaNode | Fund Ad-Free Quizzing & Development</title>
                <meta 
                    name="description" 
                    content="Help keep ParikshaNode ad-free and running. Your support helps us cover high server costs, maintain the MERN stack architecture, and develop critical new features. Donate via Buy Me a Coffee or explore other ways to contribute." 
                />
                <link rel="canonical" href={DONATE_URL} />

                {/* Structured Data (JSON-LD) for Project Funding */}
                <script type="application/ld+json">
                    {JSON.stringify(schemaMarkup)}
                </script>
            </Helmet>

            <div className="max-w-5xl mx-auto py-12 space-y-20 p-4 sm:p-6 lg:p-10">
                {/* Hero Section - Animated Title (ULTRA MODERN) */}
                <div className="text-center animate-in fade-in slide-in-from-top-10 duration-700">
                    {/* H1 for primary page focus */}
                    <h1 className="text-6xl font-extrabold tracking-tighter lg:text-8xl text-transparent bg-clip-text
                                         bg-gradient-to-r from-primary via-indigo-500 to-destructive drop-shadow-2xl shadow-indigo-500/50">
                        Fuel Our Mission. Stay Ad-Free.
                    </h1>
                    {/* H2 for secondary descriptive heading - Internal Links added here */}
                    <h2 className="mt-6 text-2xl text-muted-foreground max-w-4xl mx-auto font-medium">
                        ParikshaNode is a community-driven project dedicated to <Link to="/" className="font-semibold text-primary hover:underline transition-colors">ad-free education</Link>. Your contribution directly powers server infrastructure and feature development.
                    </h2>
                    <div className="mt-8 flex justify-center space-x-4">
                        <a href="#contribute-methods">
                            <Button size="lg" className="text-lg h-12 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/40 transition-all duration-300 transform hover:scale-105">
                                <Heart className="w-5 h-5 mr-2" /> Donate Now
                            </Button>
                        </a>
                        <Link to="/about">
                            <Button size="lg" variant="outline" className="text-lg h-12 border-secondary hover:bg-secondary/20 transition-all duration-300">
                                <Code className="w-5 h-5 mr-2" /> Learn About the Project
                            </Button>
                        </Link>
                    </div>
                </div>

                <hr />

                {/* How Your Support Helps Section (Enhanced Layout) */}
                <Card className="p-8 shadow-3xl shadow-secondary/30 border-secondary/50 animate-in fade-in duration-700 delay-200">
                    <CardHeader className="pb-6">
                        <CardTitle className="text-4xl font-bold text-center">Where Does the Funding Go? 💸</CardTitle>
                        <CardDescription className="text-center text-xl mt-2">Every contribution fuels these critical areas, ensuring quality and growth:</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-10 pt-6">
                        
                        {/* 1. Server Costs */}
                        <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-card/70 border border-indigo-500/30 shadow-2xl shadow-indigo-500/20 transition-all duration-500 transform hover:scale-[1.03] hover:shadow-indigo-500/50">
                            <Globe className="w-14 h-14 mb-4 text-indigo-500" />
                            <h3 className="font-extrabold text-2xl">High Server Costs</h3>
                            <p className="text-base text-muted-foreground mt-2">Covers MongoDB, Node.js hosting, and optimized CDN to keep the platform fast and responsive globally, even under heavy load.</p>
                        </div>

                        {/* 2. New Features */}
                        <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-card/70 border border-pink-500/30 shadow-2xl shadow-pink-500/20 transition-all duration-500 transform hover:scale-[1.03] hover:shadow-pink-500/50 delay-100">
                            <Lightbulb className="w-14 h-14 mb-4 text-pink-500" />
                            <h3 className="font-extrabold text-2xl">New Feature Development</h3>
                            <p className="text-base text-muted-foreground mt-2">Funds the dedicated development time needed to build exciting new tools like **Live Quiz**, advanced **AI Question Generation**, and enhanced analytics.</p>
                        </div>

                        {/* 3. Ad-Free Experience */}
                        <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-card/70 border border-green-500/30 shadow-2xl shadow-green-500/20 transition-all duration-500 transform hover:scale-[1.03] hover:shadow-green-500/50 delay-200">
                            <ShieldBan className="w-14 h-14 mb-4 text-green-500" />
                            <h3 className="font-extrabold text-2xl">Clean, Focused Education</h3>
                            <p className="text-base text-muted-foreground mt-2">This is our promise. Your support ensures the platform remains 100% **Ad-Free**, free from trackers, and dedicated purely to learning.</p>
                        </div>
                    </CardContent>
                </Card>

                <hr />

                {/* Ways to Contribute Section (Simplified and Modern) */}
                <div id="contribute-methods" className="space-y-8 animate-in fade-in duration-700 delay-400">
                    <h2 className="text-4xl text-center font-bold tracking-tight">Our Primary Contribution Method</h2>
                    
                    <Card className="max-w-2xl mx-auto p-8 shadow-3xl shadow-destructive/30 border-l-8 border-destructive/80 transition-shadow duration-500 hover:shadow-destructive/50">
                        <CardHeader className="text-center pb-6">
                            <CardTitle className="text-3xl flex items-center justify-center gap-3 text-destructive">
                                <Coffee className="w-7 h-7" /> Buy Me a Coffee (Global Support)
                            </CardTitle>
                            <CardDescription className="text-lg mt-2">The simplest and most secure way to show your appreciation and provide non-recurring funding.</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center flex flex-col items-center">
                            {/* Developer Profile Image */}
                            <img 
                                src="https://cdn.buymeacoffee.com/uploads/profile_pictures/2025/07/ZzlkIXLPpwCOJfAo.jpg@300w_0e.webp" 
                                alt={`Profile picture of ${DEVELOPER_NAME}`} 
                                className="w-32 h-32 rounded-full mb-4 border-6 border-destructive ring-4 ring-destructive/50 shadow-xl" 
                            />
                            <p className="text-2xl font-extrabold">{DEVELOPER_NAME}</p>
                            <p className="text-md text-muted-foreground mb-8">Developer & Maintainer of ParikshaNode</p>
                            
                            <a href="https://coff.ee/adityachoudhary" target="_blank" rel="noopener noreferrer" className="w-full">
                                <Button className="w-full h-14 text-xl font-bold bg-yellow-600 hover:bg-yellow-700 shadow-2xl shadow-yellow-600/50 transition-all duration-300 transform hover:scale-[1.01]">
                                    <Coffee className="w-6 h-6 mr-3" /> Support with a Coffee
                                </Button>
                            </a>
                        </CardContent>
                    </Card>
                </div>

                <hr />

                {/* Other Ways to Help (Community Focus) */}
                <div className="text-center space-y-6 animate-in fade-in duration-700 delay-600">
                    <h2 className="text-4xl font-bold tracking-tight text-primary">No Money? No Problem! ❤️</h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Financial support is fantastic, but there are many other high-impact ways you can contribute to the ParikshaNode community:</p>
                    
                    <div className="grid md:grid-cols-3 gap-8 pt-4 max-w-4xl mx-auto">
                        
                        <div className="p-6 rounded-xl bg-secondary/50 border border-secondary transition-all hover:bg-secondary/80">
                            <Users className="w-10 h-10 mb-2 text-secondary-foreground mx-auto" />
                            <p className="font-semibold text-lg">Spread the Word</p>
                            <p className="text-sm text-muted-foreground">Share the link on social media and with classmates. Growth is our biggest asset!</p>
                        </div>
                        
                        <div className="p-6 rounded-xl bg-secondary/50 border border-secondary transition-all hover:bg-secondary/80">
                            <Code className="w-10 h-10 mb-2 text-secondary-foreground mx-auto" />
                            <p className="font-semibold text-lg">Contribute to Code</p>
                            <p className="text-sm text-muted-foreground">Check out our **GitHub repository** for open issues, bug fixes, or feature ideas.</p>
                        </div>

                        <div className="p-6 rounded-xl bg-secondary/50 border border-secondary transition-all hover:bg-secondary/80">
                            <Lightbulb className="w-10 h-10 mb-2 text-secondary-foreground mx-auto" />
                            <p className="font-semibold text-lg">Provide Feedback</p>
                            <p className="text-sm text-muted-foreground">Report bugs or suggest new features via the <Link to="/contact" className="text-primary hover:underline">Contact page</Link>.</p>
                        </div>
                    </div>
                </div>

                <hr />

                {/* Final Thank You Message */}
                <div className="text-center py-10 bg-primary/10 rounded-3xl animate-in fade-in duration-700 delay-800">
                    <h3 className="text-5xl font-extrabold tracking-tighter text-primary">THANK YOU! 🙏</h3>
                    <p className="mt-4 text-2xl text-foreground max-w-3xl mx-auto">
                        Whether through a donation, a share, or a piece of feedback, your involvement is what keeps this community project alive and thriving. We are building the future of ad-free education together.
                    </p>
                </div>
            </div>
        </>
    );
};

export default DonatePage;
