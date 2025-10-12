import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card'; // Assuming '@/components/ui/Card' is a shadcn/ui Card
import { Users, Code, Database, Palette, Github, Linkedin, Zap } from 'lucide-react'; // Added Zap for flair
import { Helmet } from 'react-helmet-async';
import { cn } from '@/lib/utils'; // Utility for combining classes

// --- SEO CONSTANTS (Kept as is) ---
const SITE_NAME = "ParikshaNode";
const SITE_URL = "https://parikshanode.netlify.app/";
const ABOUT_URL = `${SITE_URL}about`;

// ---- START: Updated Team Information (Kept as is) ----
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
        github: 'https://github.com/', // NOTE: Add Suraj's full GitHub URL
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

// --- SEO: JSON-LD Structured Data Schema (Kept as is) ---
const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "name": SITE_NAME,
            "url": SITE_URL,
            "description": "Final year B.Tech CSE project team from GNIOT.",
            "member": teamMembers.map(member => ({ "@type": "Person", "name": member.name }))
        },
        ...teamMembers.map(member => ({
            "@type": "Person",
            "name": member.name,
            "jobTitle": member.role,
            "alumniOf": "GNIOT, Greater Noida",
            "description": member.bio,
            "url": member.linkedin,
            "sameAs": [
                member.linkedin,
                member.github,
            ]
        }))
    ]
};
// ----------------------------------------------------------------

// Component for a more stylish divider
const ModernDivider = () => (
    <div className="flex items-center justify-center my-20">
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent transition-all duration-700" />
        <Zap className="w-8 h-8 text-primary/80 mx-4 shrink-0 animate-pulse" />
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent transition-all duration-700" />
    </div>
);

const AboutPage = () => {
    return (
        <>
            <Helmet>
                {/* SEO tags remain the same */}
                <title>Meet the Team | ParikshaNode - MERN Stack Quiz Project</title>
                <meta 
                    name="description" 
                    content="Learn about the four final year B.Tech CSE students (Aditya, Suraj, Amrita, Sachin) from GNIOT who developed ParikshaNode, a full-stack MERN quiz platform project." 
                />
                <link rel="canonical" href={ABOUT_URL} />
                <script type="application/ld+json">
                    {JSON.stringify(schemaMarkup)}
                </script>
            </Helmet>
            
            {/* Global Container with Background Flair */}
            <div className="relative overflow-hidden">
                {/* Subtle Background Blob/Element (Ultra Modern Effect) */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob-one z-0" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-destructive/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob-two z-0" />

                <div className="max-w-6xl mx-auto space-y-20 p-4 sm:p-6 lg:p-8 relative z-10">
                    
                    {/* Hero Section - Elevated and Vibrant */}
                    <section className="text-center py-20 lg:py-32 animate-in fade-in slide-in-from-top-10 duration-700">
                        {/* Dramatic Title with Shadow and Gradient */}
                        <h1 className="text-6xl font-black tracking-tighter lg:text-8xl text-transparent bg-clip-text 
                                     bg-gradient-to-br from-primary via-blue-500 to-destructive 
                                     shadow-primary/50 drop-shadow-2xl [text-shadow:0_0_20px_var(--tw-color-primary),0_0_40px_var(--tw-color-destructive)] transition-all">
                            Building the Future of Quizzing
                        </h1>
                        
                        <h2 className="mt-6 text-xl lg:text-2xl text-foreground/80 font-medium max-w-4xl mx-auto border-t border-b border-primary/20 py-4">
                            We're on a mission to make knowledge **accessible and engaging** for everyone. 
                            Have a technical question? <Link to="/contact" className="font-extrabold text-destructive hover:text-primary transition-colors">Contact the Team</Link>.
                        </h2>
                    </section>

                    {/* Our Story Section - Elevated Image */}
                    <section className="grid md:grid-cols-2 gap-16 items-center animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
                        <div className="space-y-6">
                            <h3 className="text-5xl font-extrabold tracking-tight text-foreground/90 leading-tight">
                                Our Story: <span className="text-primary">From Project</span> to Platform
                            </h3>
                            <p className="text-lg text-muted-foreground">
                                ParikshaNode started as a **final year project at GNIOT, Greater Noida**. As Computer Science students, we wanted to build a practical, real-world application that could be genuinely useful. We saw an opportunity to create a modern, ad-free <Link to="/" className="font-bold text-primary hover:underline hover:text-destructive transition-colors">quiz platform</Link> that we and our peers would actually want to use.
                            </p>
                            <div className="text-lg font-bold border-l-4 border-destructive pl-4 py-2 bg-secondary/70 rounded-r-lg shadow-lg">
                                This app is the culmination of our collective skills in **full-stack MERN development** and UI/UX design, representing countless hours of coding and collaboration. Support our continuous hosting on our <Link to="/donate" className="font-extrabold text-destructive hover:underline transition-colors">Support Page</Link> ✨.
                            </div>
                        </div>
                        <div className="w-full rounded-3xl overflow-hidden border-4 border-primary/30 shadow-2xl shadow-primary/50 
                                     transform hover:scale-[1.02] transition-all duration-700 ease-out 
                                     hover:shadow-3xl hover:shadow-destructive/50">
                            {/* Improved Alt Text for Image SEO */}
                            <img
                                src="https://img.jagranjosh.com/images/2022/July/1572022/GNIOT.jpg"
                                alt="GNIOT Campus, Greater Noida - Home of the ParikshaNode Development Team"
                                className="w-full h-auto object-cover opacity-90 transition-opacity duration-500"
                                style={{ minHeight: '250px' }}
                            />
                        </div>
                    </section>

                    {/* Modern, Animated Divider */}
                    <ModernDivider />

                    {/* Meet the Team Section - Advanced Card Effects */}
                    <section className="text-center">
                        <h3 className="text-5xl font-black tracking-tight text-foreground/90 animate-in fade-in duration-700 delay-300">Meet the Core <span className="text-destructive">Developers</span></h3>
                        <p className="mt-4 text-xl text-muted-foreground animate-in fade-in duration-700 delay-400 max-w-2xl mx-auto">The final year CSE students from GNIOT who turned an ambitious idea into a powerful MERN stack platform.</p>
                        
                        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {teamMembers.map((member, index) => (
                                <Card 
                                    key={member.name} 
                                    className={cn(
                                        "text-center p-2 transition-all duration-700 ease-in-out bg-card/80 backdrop-blur-sm", // Backdrop blur for a modern look
                                        "border-2 border-primary/20 hover:border-destructive hover:shadow-2xl hover:shadow-destructive/50",
                                        "hover:scale-[1.05] hover:rotate-z-1 hover:translate-y-[-5px] animate-in fade-in zoom-in-75"
                                    )}
                                    style={{ animationDelay: `${400 + index * 100}ms` }}
                                >
                                    <CardContent className="pt-6 flex flex-col items-center">
                                        {/* Icon Container with a vibrant ring and glow */}
                                        <div className="w-28 h-28 bg-secondary rounded-full mx-auto flex items-center justify-center mb-5 
                                                        border-4 border-primary/50 shadow-lg shadow-primary/50 
                                                        transition-all duration-500 hover:border-destructive hover:shadow-destructive/70">
                                            {member.imagePlaceholder}
                                        </div>
                                        <h4 className="text-2xl font-black text-foreground">{member.name}</h4> 
                                        <p className="text-lg text-destructive font-extrabold mb-4">{member.role}</p>
                                        <p className="text-sm text-muted-foreground h-16 overflow-hidden leading-relaxed">{member.bio}</p>
                                        
                                        <div className="flex justify-center space-x-6 mt-6">
                                            {/* Social Links with hover scale and glow effect */}
                                            <a href={member.github} target="_blank" rel="noopener noreferrer" 
                                               className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-125 hover:drop-shadow-lg"
                                               aria-label={`Visit ${member.name}'s GitHub profile`}>
                                                <Github className="w-7 h-7" />
                                            </a>
                                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" 
                                               className="text-muted-foreground hover:text-blue-600 transition-all duration-300 hover:scale-125 hover:drop-shadow-lg"
                                               aria-label={`Visit ${member.name}'s LinkedIn profile`}>
                                                <Linkedin className="w-7 h-7" />
                                            </a>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* Modern, Animated Divider */}
                    <ModernDivider />

                    {/* Our Technology Section - Focus on MERN with high contrast */}
                    <section className="text-center pb-16">
                        <h3 className="text-5xl font-black tracking-tight text-foreground/90 animate-in fade-in duration-700 delay-500">Built with the <span className="text-primary">MERN Stack</span> Power</h3>
                        <p className="mt-4 text-xl text-muted-foreground animate-in fade-in duration-700 delay-600 max-w-2xl mx-auto">Our powerful, open-source stack is designed for a seamless, <Link to="/" className="font-extrabold text-primary hover:underline">high-performance quizzing experience</Link>.</p>
                        
                        <div className="max-w-4xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-12">
                            
                            {/* MongoDB */}
                            <div className="flex flex-col items-center space-y-4 p-4 transition-transform duration-500 hover:scale-110 group animate-in zoom-in-75 duration-700 delay-700">
                                <Database className="w-16 h-16 text-green-500 drop-shadow-lg group-hover:text-green-400 transition-colors" />
                                <p className="font-black text-xl text-foreground/90 group-hover:text-primary transition-colors">MongoDB</p>
                            </div>
                            
                            {/* Express.js */}
                            <div className="flex flex-col items-center space-y-4 p-4 transition-transform duration-500 hover:scale-110 group animate-in zoom-in-75 duration-700 delay-800">
                                <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 dark:from-white dark:to-gray-400 group-hover:text-primary transition-colors">Ex</p>
                                <p className="font-black text-xl text-foreground/90 group-hover:text-primary transition-colors">Express.js</p>
                            </div>
                            
                            {/* React */}
                            <div className="flex flex-col items-center space-y-4 p-4 transition-transform duration-500 hover:scale-110 group animate-in zoom-in-75 duration-700 delay-900">
                                <Code className="w-16 h-16 text-blue-500 drop-shadow-lg group-hover:animate-spin-slow group-hover:text-blue-400 transition-colors" />
                                <p className="font-black text-xl text-foreground/90 group-hover:text-primary transition-colors">React</p>
                            </div>
                            
                            {/* Node.js */}
                            <div className="flex flex-col items-center space-y-4 p-4 transition-transform duration-500 hover:scale-110 group animate-in zoom-in-75 duration-700 delay-1000">
                                <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-lime-500 group-hover:text-destructive transition-colors">N</p>
                                <p className="font-black text-xl text-foreground/90 group-hover:text-primary transition-colors">Node.js</p>
                            </div>

                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default AboutPage;
