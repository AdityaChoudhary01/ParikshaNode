import React from 'react';
import { Link } from 'react-router-dom'; // 👈 Import Link for internal linking
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Coffee, Globe, Lightbulb, ShieldBan, Tag } from 'lucide-react'; 
import { Helmet } from 'react-helmet-async';
import { cn } from '@/lib/utils'; 

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
    // Preserve original source for UPI QR Code
    const upiQRCodeUrl = 'https://res.cloudinary.com/dmtnonxtt/image/upload/v1752488580/GooglePay_QR_xtgkh4.png';

    return (
        <>
            <Helmet>
                {/* Primary SEO Tags: Focus on "Support" and "Ad-Free" */}
                <title>Support ParikshaNode | Fund Ad-Free Quizzing & Development</title>
                <meta 
                    name="description" 
                    content="Help keep ParikshaNode ad-free and running. Your support helps us cover high server costs, maintain the MERN stack architecture, and develop critical new features like Live Quiz and AI tools. Donate via UPI or Buy Me a Coffee." 
                />
                <link rel="canonical" href={DONATE_URL} />

                {/* Structured Data (JSON-LD) for Project Funding */}
                <script type="application/ld+json">
                    {JSON.stringify(schemaMarkup)}
                </script>
            </Helmet>

            <div className="max-w-4xl mx-auto py-8 space-y-16 p-4 sm:p-6 lg:p-8">
                {/* Hero Section - Animated Title */}
                <div className="text-center mb-12 animate-in fade-in slide-in-from-top-10 duration-700">
                    {/* H1 for primary page focus */}
                    <h1 className="text-5xl font-extrabold tracking-tight lg:text-7xl text-transparent bg-clip-text 
                                     bg-gradient-to-r from-primary to-destructive drop-shadow-lg">
                        Become a ParikshaNode Supporter
                    </h1>
                    {/* H2 for secondary descriptive heading - Internal Links added here */}
                    <h2 className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                        ParikshaNode is a community-driven project dedicated to <Link to="/" className="font-semibold text-primary hover:underline">ad-free education</Link>. Your contribution, no matter the size, fuels our growth and commitment. Learn more <Link to="/about" className="font-semibold text-primary hover:underline">about the development team</Link> or <Link to="/contact" className="font-semibold text-primary hover:underline">contact us</Link> with questions.
                    </h2>
                </div>

                {/* How Your Support Helps Section */}
                <Card className="mb-8 p-6 shadow-2xl shadow-secondary/30 border-secondary/50 animate-in fade-in duration-700 delay-200">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-3xl font-bold text-foreground/90 text-center">How Your Support Helps</CardTitle>
                        <CardDescription className="text-center text-lg">Every coffee donation directly impacts these core pillars:</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-8 pt-4">
                        
                        {/* 1. Server Costs */}
                        <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card/70 border border-primary/20 shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:scale-[1.03]">
                            <Globe className="w-12 h-12 mb-3 text-primary" />
                            <h3 className="font-bold text-xl">Server Costs</h3>
                            <p className="text-sm text-muted-foreground mt-1">Keeps the website online, fast, and accessible 24/7 across the globe.</p>
                        </div>

                        {/* 2. New Features */}
                        <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card/70 border border-primary/20 shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:scale-[1.03] delay-100">
                            <Lightbulb className="w-12 h-12 mb-3 text-primary" />
                            <h3 className="font-bold text-xl">New Features</h3>
                            <p className="text-sm text-muted-foreground mt-1">Funds development time for new tools like Live Quiz, AI Generation, and analytics.</p>
                        </div>

                        {/* 3. Ad-Free Experience */}
                        <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card/70 border border-primary/20 shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:scale-[1.03] delay-200">
                            <ShieldBan className="w-12 h-12 mb-3 text-primary" />
                            <h3 className="font-bold text-xl">Ad-Free Experience</h3>
                            <p className="text-sm text-muted-foreground mt-1">Ensures the platform remains clean, focused, and free from distractions for all users.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Ways to Contribute Section */}
                <Card className="p-6 shadow-2xl shadow-primary/30 border-primary/20 animate-in fade-in duration-700 delay-400">
                    <CardHeader><CardTitle className="text-3xl text-center font-bold">Ways to Contribute</CardTitle></CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-8">
                        
                        {/* UPI Card (India) */}
                        <Card className="border-l-4 border-primary shadow-xl hover:shadow-2xl hover:shadow-primary/40 transition-shadow duration-300">
                            <CardHeader><CardTitle className="text-xl flex items-center gap-2">UPI (for users in India) <Tag className="w-4 h-4 text-destructive" /></CardTitle></CardHeader>
                            <CardContent className="text-center">
                                <p className="text-sm text-muted-foreground mb-4">Scan the high-quality QR code with any UPI app like Google Pay, PhonePe, or Paytm.</p>
                                <div className="p-4 bg-white rounded-xl inline-block shadow-lg">
                                    <img src={upiQRCodeUrl} alt="UPI QR Code for ParikshaNode Donations via Google Pay" className="w-48 h-48 rounded-lg" />
                                </div>
                                <p className="mt-4 text-lg font-mono font-semibold text-foreground bg-secondary/50 p-2 rounded-md">adityanain55@oksbi</p>
                            </CardContent>
                        </Card>
                        
                        {/* Buy Me a Coffee Card */}
                        <Card className="border-l-4 border-destructive shadow-xl hover:shadow-2xl hover:shadow-destructive/40 transition-shadow duration-300">
                            <CardHeader><CardTitle className="text-xl flex items-center gap-2">Buy Me a Coffee</CardTitle></CardHeader>
                            <CardContent className="text-center flex flex-col items-center">
                                <img 
                                    src="https://cdn.buymeacoffee.com/uploads/profile_pictures/2025/07/ZzlkIXLPpwCOJfAo.jpg@300w_0e.webp" 
                                    alt={`Profile picture of ${DEVELOPER_NAME}`} 
                                    className="w-24 h-24 rounded-full mb-3 border-4 border-primary shadow-lg" 
                                />
                                <p className="text-xl font-bold">{DEVELOPER_NAME}</p>
                                <p className="text-md text-muted-foreground mb-6">A simple and secure way to show your support.</p>
                                <a href="https://coff.ee/adityachoudhary" target="_blank" rel="noopener noreferrer" className="w-full">
                                    <Button className="w-full h-11 text-lg bg-yellow-600 hover:bg-yellow-700 shadow-lg shadow-yellow-600/50">
                                        <Coffee className="w-5 h-5 mr-2" /> Buy Me a Coffee
                                    </Button>
                                </a>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};


export default DonatePage;
