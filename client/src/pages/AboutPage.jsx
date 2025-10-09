import React from 'react';
import { Link } from 'react-router-dom'; // 👈 IMPORT Link for internal linking
import { Card, CardContent } from '@/components/ui/Card';
import { Users, Code, Database, Palette, Github, Linkedin } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { cn } from '@/lib/utils';

// --- SEO CONSTANTS ---
const SITE_NAME = "ParikshaNode";
const SITE_URL = "https://parikshanode.netlify.app/"; // IMPORTANT: This is now correctly set to your site URL
const ABOUT_URL = `${SITE_URL}about`;

// ---- START: Updated Team Information with Social Links (KEEP THESE UP-TO-DATE) ----
const teamMembers = [
    {
        name: 'Aditya Choudhary',
        role: 'Project Lead & Full-Stack Developer',
        bio: 'Aditya spearheaded the project, architecting the full-stack MERN application and ensuring seamless integration between the frontend and backend. He is a final year B.Tech CSE student at GNIOT, from the 2022-2026 batch.',
        imagePlaceholder: <Code className="w-16 h-16 text-primary drop-shadow-md" />,
        github: 'https://github.com/AdityaChoudhary01',
        linkedin: 'https://www.linkedin.com/in/aditya-kumar-38093a304/',
    },
    {
        name: 'Suraj Mishra',
        role: 'Backend Developer',
        bio: 'Suraj was instrumental in building the robust backend, focusing on the Express API, MongoDB database schemas, and server-side logic. He is a final year B.Tech CSE student at GNIOT, from the 2022-2026 batch.',
        imagePlaceholder: <Database className="w-16 h-16 text-primary drop-shadow-md" />,
        github: 'https://github.com/', 
        linkedin: 'https://www.linkedin.com/in/suraj-mishra-a1b161258',
    },
    {
        name: 'Amrita Yadav',
        role: 'Frontend Developer',
        bio: 'Amrita brought the application to life with her expertise in React and state management, building the interactive quiz and user dashboard components. She is a final year B.Tech CSE student at GNIOT, from the 2022-2026 batch.',
        imagePlaceholder: <Users className="w-16 h-16 text-primary drop-shadow-md" />,
        github: 'https://github.com/amritalearns',
        linkedin: 'https://www.linkedin.com/in/amrita-yadav-a28192292/',
    },
    {
        name: 'Sachin Mourya',
        role: 'UI/UX Designer',
        bio: 'Sachin is the creative force behind the visually appealing and intuitive design, responsible for the theme, dark mode, and overall user experience. He is a final year B.Tech CSE student at GNIOT, from the 2022-2026 batch.',
        imagePlaceholder: <Palette className="w-16 h-16 text-primary drop-shadow-md" />,
        github: 'https://github.com/sachn2k4',
        linkedin: 'https://www.linkedin.com/in/sachin-mourya-905148247',
    },
];
// ---- END: Updated Team Information ----

// --- SEO: JSON-LD Structured Data Schema (Person & Organization) ---
const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
        {
            // Organization Schema for the project context
            "@type": "Organization",
            "name": SITE_NAME,
            "url": SITE_URL,
            "description": "Final year B.Tech CSE project team from GNIOT.",
            "member": teamMembers.map(member => ({ "@type": "Person", "name": member.name }))
        },
        // Individual Person Schemas to establish E-E-A-T
        ...teamMembers.map(member => ({
            "@type": "Person",
            "name": member.name,
            "jobTitle": member.role,
            "alumniOf": "GNIOT, Greater Noida",
            "description": member.bio,
            "url": member.linkedin, // Use the most professional link as the main URL
            "sameAs": [
                member.linkedin,
                member.github,
            ]
        }))
    ]
};
// ----------------------------------------------------------------

const AboutPage = () => {
    return (
        <>
            <Helmet>
                {/* Primary SEO Tags for About Page (E-E-A-T Focus) */}
                <title>Meet the Team | ParikshaNode - MERN Stack Quiz Project</title>
                <meta 
                    name="description" 
                    content="Learn about the four final year B.Tech CSE students (Aditya, Suraj, Amrita, Sachin) from GNIOT who developed ParikshaNode, a full-stack MERN quiz platform project." 
                />
                <link rel="canonical" href={ABOUT_URL} />
                
                {/* Open Graph Tags */}
                <meta property="og:title" content="Meet the ParikshaNode MERN Stack Project Team" />
                <meta property="og:description" content="Read the story of how four GNIOT CSE students built ParikshaNode for live quizzing and deep analytics, highlighting their expertise in React, Node.js, and MongoDB." />
                <meta property="og:url" content={ABOUT_URL} />
                <meta property="og:site_name" content={SITE_NAME} />

                {/* Structured Data (Schema.org) for People */}
                <script type="application/ld+json">
                    {JSON.stringify(schemaMarkup)}
                </script>
            </Helmet>
            <div className="max-w-5xl mx-auto space-y-20 p-4 sm:p-6 lg:p-8">
                
                {/* Hero Section - Animated and Gradient */}
                <section className="text-center py-16 animate-in fade-in slide-in-from-top-10 duration-700">
                    <h1 className="text-5xl font-extrabold tracking-tight lg:text-7xl text-transparent bg-clip-text 
                                 bg-gradient-to-r from-primary to-destructive drop-shadow-xl">
                        Building the Future of Quizzing
                    </h1>
                    {/* H2 for SEO - Main descriptive subheading */}
                    <h2 className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                        We're on a mission to make knowledge accessible and engaging for everyone. Have a technical question? <Link to="/contact" className="font-semibold text-primary hover:underline">Contact the Team</Link>.
                    </h2>
                </section>

                {/* Our Story Section - Internal Links added here */}
                <section className="grid md:grid-cols-2 gap-12 items-center animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
                    <div className="space-y-6">
                        <h3 className="text-4xl font-bold tracking-tight text-foreground/90">Our Story: From Project to Platform</h3>
                        <p className="text-lg text-muted-foreground">
                            ParikshaNode started as a **final year project at GNIOT, Greater Noida**. As Computer Science students, we wanted to build a practical, real-world application that could be genuinely useful. We saw an opportunity to create a modern, ad-free <Link to="/" className="font-semibold text-primary hover:underline">quiz platform</Link> that we and our peers would actually want to use.
                        </p>
                        <p className="text-lg text-muted-foreground font-semibold border-l-4 border-primary pl-4 py-1 bg-secondary/50">
                            This app is the culmination of our collective skills in **full-stack MERN development** and UI/UX design, representing countless hours of coding and collaboration from our 2022-2026 batch. You can support our continuous hosting effort on our <Link to="/donate" className="font-semibold text-primary hover:underline">Support Page</Link>.
                        </p>
                    </div>
                    <div className="w-full rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/30 
                                 transform hover:scale-[1.02] transition-transform duration-500">
                        {/* Improved Alt Text for Image SEO */}
                        <img
                            src="https://img.jagranjosh.com/images/2022/July/1572022/GNIOT.jpg"
                            alt="GNIOT Campus, Greater Noida - Home of the ParikshaNode Development Team"
                            className="w-full h-auto object-cover opacity-90"
                            style={{ minHeight: '200px' }}
                        />
                    </div>
                </section>

                <hr className="border-t-2 border-primary/20 opacity-30" />

                {/* Meet the Team Section - Card Animations */}
                <section className="text-center">
                    <h3 className="text-4xl font-bold tracking-tight text-foreground/90 animate-in fade-in duration-700 delay-300">Meet the Core Team</h3>
                    <p className="mt-2 text-lg text-muted-foreground animate-in fade-in duration-700 delay-400">The final year CSE students who built ParikshaNode.</p>
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <Card 
                                key={member.name} 
                                className={cn(
                                    "text-center transition-all duration-500 border-primary/20 hover:border-primary hover:shadow-xl hover:shadow-primary/30",
                                    "hover:scale-[1.03] animate-in fade-in zoom-in-75"
                                )}
                                style={{ animationDelay: `${400 + index * 100}ms` }}
                            >
                                <CardContent className="pt-6 flex flex-col items-center">
                                    <div className="w-24 h-24 bg-secondary/70 rounded-full mx-auto flex items-center justify-center mb-4 border-4 border-primary/20 shadow-inner shadow-primary/20">
                                        {member.imagePlaceholder}
                                    </div>
                                    <h4 className="text-xl font-bold text-foreground">{member.name}</h4> {/* H4 for content hierarchy */}
                                    <p className="text-lg text-primary font-medium mb-3">{member.role}</p>
                                    <p className="text-sm text-muted-foreground h-16 overflow-hidden">{member.bio}</p>
                                    <div className="flex justify-center space-x-5 mt-4">
                                        <a href={member.github} target="_blank" rel="noopener noreferrer" 
                                           className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 duration-200"
                                           aria-label={`Visit ${member.name}'s GitHub profile`}>
                                            <Github className="w-6 h-6" />
                                        </a>
                                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" 
                                           className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 duration-200"
                                           aria-label={`Visit ${member.name}'s LinkedIn profile`}>
                                            <Linkedin className="w-6 h-6" />
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <hr className="border-t-2 border-primary/20 opacity-30" />

                {/* Our Technology Section - Internal Link added here */}
                <section className="text-center pb-12">
                    <h3 className="text-4xl font-bold tracking-tight text-foreground/90 animate-in fade-in duration-700 delay-500">Built with Modern Technology</h3>
                    <p className="mt-2 text-lg text-muted-foreground animate-in fade-in duration-700 delay-600">Our powerful MERN stack is designed for a seamless, <Link to="/" className="font-semibold text-primary hover:underline">high-performance quizzing experience</Link>.</p>
                    <div className="max-w-3xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                        
                        {/* MongoDB */}
                        <div className="flex flex-col items-center space-y-3 animate-in zoom-in-75 duration-700 delay-700">
                            <Database className="w-16 h-16 text-primary drop-shadow-lg" />
                            <p className="font-extrabold text-lg text-foreground/90">MongoDB</p>
                        </div>
                        
                        {/* Express.js */}
                        <div className="flex flex-col items-center space-y-3 animate-in zoom-in-75 duration-700 delay-800">
                            <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-destructive">Ex</p>
                            <p className="font-extrabold text-lg text-foreground/90">Express.js</p>
                        </div>
                        
                        {/* React */}
                        <div className="flex flex-col items-center space-y-3 animate-in zoom-in-75 duration-700 delay-900">
                            <Code className="w-16 h-16 text-primary drop-shadow-lg" />
                            <p className="font-extrabold text-lg text-foreground/90">React</p>
                        </div>
                        
                        {/* Node.js */}
                        <div className="flex flex-col items-center space-y-3 animate-in zoom-in-75 duration-700 delay-1000">
                            <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-destructive">N</p>
                            <p className="font-extrabold text-lg text-foreground/90">Node.js</p>
                        </div>

                    </div>
                </section>
            </div>
        </>
    );
};

export default AboutPage;
