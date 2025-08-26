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
import { Mail, Phone } from 'lucide-react'; // Removed MapPin import

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
          <title>Contact Us | ParikshaNode</title>
          <meta name="description" content="Have a question or feedback? Get in touch with the ParikshaNode team through our contact form or find answers in our FAQ." />
        </Helmet>
        <div className="max-w-6xl mx-auto space-y-12">
            {/* Hero Section */}
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Get in Touch</h1>
                <p className="mt-4 text-lg text-muted-foreground">We're here to help and answer any question you might have.</p>
            </div>

            {/* Main Content Grid */}
            <div className="grid md:grid-cols-2 gap-12">
                {/* Left Column: Info & FAQ */}
                <div className="space-y-8">
                    {/* Contact Information */}
                    <Card>
                        <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            {/* The address line has been removed */}
                            <div className="flex items-center"><Mail className="w-5 h-5 mr-3 text-primary" /><a href="mailto:aadiwrld01@gmail.com" className="hover:underline">aadiwrld01@gmail.com</a></div>
                            <div className="flex items-center"><Phone className="w-5 h-5 mr-3 text-primary" /><span>+91 12345 67890</span></div>
                        </CardContent>
                    </Card>
                    
                    {/* FAQ Section */}
                    <Card>
                        <CardHeader><CardTitle>Frequently Asked Questions</CardTitle></CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>How do I create a quiz?</AccordionTrigger>
                                    <AccordionContent>To create a quiz, you must have an admin account. Once logged in as an admin, navigate to the Admin Dashboard and select "Manage Quizzes" to find the "Create New Quiz" button.</AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>Is  ParikshaNode free to use?</AccordionTrigger>
                                    <AccordionContent>Yes,  ParikshaNode is completely free for all users. We are supported by donations from our community, which you can make on our "Donate" page.</AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>How is my score calculated?</AccordionTrigger>
                                    <AccordionContent>Your score is calculated based on the number of questions you answer correctly. The results page provides a detailed breakdown of your performance after each quiz.</AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Contact Form */}
                <Card>
                    <CardHeader><CardTitle>Send us a Message</CardTitle><CardDescription>Fill out the form below and we'll get back to you.</CardDescription></CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" value={formData.name} onChange={handleChange} required /></div>
                                <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={formData.email} onChange={handleChange} required /></div>
                            </div>
                            <div className="space-y-2"><Label htmlFor="message">Message</Label><Textarea id="message" value={formData.message} onChange={handleChange} required rows={8} /></div>
                            <Button type="submit" disabled={isLoading} className="w-full">{isLoading ? 'Sending...' : 'Send Message'}</Button>
                        </CardContent>
                    </form>
                </Card>
            </div>

            {/* The Embedded Map Section has been removed */}
        </div>
        </>
    );
};


export default ContactPage;


