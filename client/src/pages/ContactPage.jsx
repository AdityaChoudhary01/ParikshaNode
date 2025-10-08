import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import api from '@/api/axiosConfig';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion"
import { Mail, Phone } from 'lucide-react'; 

// --- SEO CONSTANTS ---
const SITE_NAME = "ParikshaNode";
const SITE_URL = "https://parikshanode.netlify.app/"; // IMPORTANT: Replace with your live domain
const CONTACT_URL = `${SITE_URL}contact`;
const SUPPORT_EMAIL = "aadiwrld01@gmail.com";
const SUPPORT_PHONE = "+91 12345 67890"; // Use E.164 format if possible, but keeping your format for now.

// --- FAQ Data for Schema Markup ---
const faqData = [
    {
        question: "How do I create a quiz?",
        answer: "To create a quiz, you must have an admin account. Once logged in as an admin, navigate to the Admin Dashboard and select \"Manage Quizzes\" to find the \"Create New Quiz\" button. (Note: Non-admin users can use the 'Generate with AI' feature on the New Quiz page.)"
    },
    {
        question: "Is ParikshaNode free to use?",
        answer: "Yes, ParikshaNode is completely free for all users. We are supported by donations from our community, which you can make on our \"Donate\" page."
    },
    {
        question: "How is my score calculated?",
        answer: "Your score is calculated based on the number of questions you answer correctly. The results page provides a detailed breakdown of your performance after each quiz."
    }
];

// --- SEO: JSON-LD Structured Data Schema (Organization and FAQPage) ---
const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
        {
            // Organization Schema with ContactPoint for Search Snippets
            "@type": "Organization",
            "name": SITE_NAME,
            "url": SITE_URL,
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": SUPPORT_PHONE,
                "contactType": "customer service",
                "email": SUPPORT_EMAIL,
                "areaServed": "IN" // Set this to your primary area of service or use "World"
            }
        },
        {
            // FAQPage Schema for Rich Snippets (to show questions directly in Google results)
            "@type": "FAQPage",
            "mainEntity": faqData.map(item => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.answer
                }
            }))
        }
    ]
};
// ----------------------------------------------------------------

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.post('/contact', formData);
            toast.success(response.data.message);
            setFormData({ name: '', email: '', message: '' }); // Clear form
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send message.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
        <Helmet>
            {/* Primary SEO Tags */}
            <title>Contact ParikshaNode | Support, Feedback & Project Inquiries</title>
            <meta 
                name="description" 
                content="Contact the ParikshaNode MERN quiz project team directly. Send feedback, technical questions, or business inquiries via our form, or find instant answers in our detailed FAQ section." 
            />
            <link rel="canonical" href={CONTACT_URL} />

            {/* Structured Data (JSON-LD) for Contact and FAQ Rich Snippets */}
            <script type="application/ld+json">
                {JSON.stringify(schemaMarkup)}
            </script>
        </Helmet>
        <div className="max-w-6xl mx-auto space-y-16 py-8 p-4 sm:p-6 lg:p-8">
            {/* Hero Section - Ultra Modern Title */}
            <div className="text-center animate-in fade-in slide-in-from-top-10 duration-700">
                {/* H1 for primary page focus */}
                <h1 className="text-5xl font-extrabold tracking-tight lg:text-7xl text-transparent bg-clip-text 
                                 bg-gradient-to-r from-primary to-destructive drop-shadow-lg">
                    Have a Question? Let's Connect
                </h1>
                {/* H2 for secondary descriptive heading */}
                <h2 className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                    We're here to help and answer any question you might have about our platform or project.
                </h2>
            </div>

            {/* Main Content Grid - Staggered Animation */}
            <div className="grid md:grid-cols-2 gap-12">
                {/* Left Column: Info & FAQ (Animated entrance delay 200ms) */}
                <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
                    
                    {/* Contact Information - Highlighted Card */}
                    <Card className="shadow-xl border-primary/30 hover:border-primary transition-all duration-300">
                        <CardHeader><CardTitle className="text-2xl text-primary/90">Contact Information</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center p-3 rounded-lg bg-secondary/50 border-l-4 border-primary shadow-inner">
                                <Mail className="w-6 h-6 mr-4 text-primary animate-pulse" />
                                <a 
                                    href={`mailto:${SUPPORT_EMAIL}`} 
                                    className="hover:underline text-lg font-medium text-foreground"
                                    aria-label="Email the ParikshaNode team"
                                >
                                    {SUPPORT_EMAIL}
                                </a>
                            </div>
                            <div className="flex items-center p-3 rounded-lg bg-secondary/50 border-l-4 border-primary shadow-inner">
                                <Phone className="w-6 h-6 mr-4 text-primary" />
                                <a 
                                    href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`} 
                                    className="text-lg font-medium text-foreground hover:underline"
                                    aria-label="Call the support number"
                                >
                                    {SUPPORT_PHONE}
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                    
                    {/* FAQ Section - Enhanced Accordion */}
                    <Card className="shadow-xl border-primary/30 hover:border-primary transition-all duration-300">
                        <CardHeader><CardTitle className="text-2xl text-primary/90">Frequently Asked Questions</CardTitle></CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full space-y-2">
                                {faqData.map((item, index) => (
                                    <AccordionItem key={index} value={`item-${index}`} className="border-b-2 border-primary/20">
                                        <AccordionTrigger className="font-bold hover:text-primary transition-colors">{item.question}</AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Contact Form (Animated entrance delay 400ms) */}
                <Card className="shadow-2xl shadow-primary/30 animate-in fade-in slide-in-from-right-8 duration-700 delay-400">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">Send us a Message</CardTitle>
                        <CardDescription className="text-lg">Fill out the form below and we'll get back to you promptly.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" value={formData.name} onChange={handleChange} required className="h-11" /></div>
                                <div className="space-y-2"><Label htmlFor="email">Email Address</Label><Input id="email" type="email" value={formData.email} onChange={handleChange} required className="h-11" /></div>
                            </div>
                            <div className="space-y-2"><Label htmlFor="message">Your Message</Label><Textarea id="message" value={formData.message} onChange={handleChange} required rows={8} className="min-h-[150px]" /></div>
                            <Button 
                                type="submit" 
                                disabled={isLoading} 
                                className="w-full h-12 text-lg shadow-primary/40 hover:shadow-primary/60 transition-all duration-300"
                            >
                                {isLoading ? 'Sending...' : 'Send Message'}
                            </Button>
                        </CardContent>
                    </form>
                </Card>
            </div>
        </div>
        </>
    );
};

export default ContactPage;
