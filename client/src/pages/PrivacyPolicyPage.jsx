// ParikshaNode-main/client/src/pages/PrivacyPolicyPage.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Lock, UserCheck, Globe, Trash2, Mail, Clock } from 'lucide-react';
import { cn } from '@/lib/utils'; 

// --- SEO CONSTANTS ---
const SITE_URL = "https://parikshanode.netlify.app/"; 
const PRIVACY_URL = `${SITE_URL}privacy`;
const CONTACT_EMAIL = "aadiwrld01@gmail.com"; 

// --- JSON-LD Schema Markup ---
const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy & Data Protection",
    "description": "ParikshaNode's official Privacy Policy. We detail how we collect, use, and secure your digital personal data in compliance with the DPDP Act.",
    "url": PRIVACY_URL,
};
// -----------------------------

const PrivacyPolicyPage = () => {
    return (
        <>
            <Helmet>
                <title>Privacy Policy | Data Protection & DPDP Act Compliance</title>
                <meta 
                    name="description" 
                    content="Read ParikshaNode's commitment to user privacy and data protection. We outline data collection purposes, security measures, and your rights under the Indian Digital Personal Data Protection Act (DPDP Act)." 
                />
                <meta name="keywords" content="Privacy Policy, Data Protection, DPDP Act, GDPR, user rights, quiz data security" />
                <link rel="canonical" href={PRIVACY_URL} />
                <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
            </Helmet>

            <div className="max-w-4xl mx-auto space-y-10 py-8 p-4 sm:p-6 lg:p-8">
                
                {/* Header */}
                <header className="text-center animate-in fade-in slide-in-from-top-10 duration-700">
                    <Lock className="w-12 h-12 mx-auto mb-4 text-green-500 drop-shadow-md" />
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-transparent bg-clip-text 
                                     bg-gradient-to-r from-primary to-green-500">
                        Digital Personal Data Protection Policy
                    </h1>
                    <h2 className="mt-2 text-xl text-muted-foreground max-w-3xl mx-auto border-none p-0 m-0">
                        In full compliance with the Indian DPDP Act, 2023.
                    </h2>
                </header>

                {/* Section 1: Data Collected & Purpose */}
                <Card className={cn("border-l-4 border-primary/50 shadow-xl border-primary/20 animate-in fade-in duration-700 delay-100")}>
                    <CardHeader><CardTitle className="text-2xl flex items-center gap-2"><UserCheck className="w-6 h-6 text-primary"/> What Data We Process</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-lg font-semibold text-foreground/90">We, the Data Fiduciary, collect data only for the specified lawful purpose of providing the quiz service.</p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                            <li>**Account Data:** Username, Email, Hashed Password. **Purpose:** Authentication and Communication.</li>
                            <li>**Service Data:** Quiz answers, scores, total time taken. **Purpose:** Grading, history tracking, and leaderboards.</li>
                            <li>**Technical Data:** IP address, Device ID, Browser type. **Purpose:** Security, logging, and performance analysis.</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Section 2: Data Principal Rights (Your Rights) */}
                <Card className={cn("border-l-4 border-destructive/50 shadow-xl border-destructive/20 animate-in fade-in duration-700 delay-200")}>
                    <CardHeader><CardTitle className="text-2xl flex items-center gap-2"><Trash2 className="w-6 h-6 text-destructive"/> Your Rights (Data Principal)</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-lg text-muted-foreground">
                            As a user, you are the Data Principal and retain the following rights under the DPDP Act:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-secondary/50 rounded-lg shadow-inner"><p className="font-bold text-foreground">Right to Access:</p><p className="text-sm text-muted-foreground">Request a summary of your processed personal data.</p></div>
                            <div className="p-3 bg-secondary/50 rounded-lg shadow-inner"><p className="font-bold text-foreground">Right to Rectification:</p><p className="text-sm text-muted-foreground">Update or correct inaccurate or incomplete profile data.</p></div>
                            <div className="p-3 bg-secondary/50 rounded-lg shadow-inner"><p className="font-bold text-foreground">Right to Erasure:</p><p className="text-sm text-muted-foreground">Request the deletion of your account and all associated data.</p></div>
                            <div className="p-3 bg-secondary/50 rounded-lg shadow-inner"><p className="font-bold text-foreground">Right to Grievance Redressal:</p><p className="text-sm text-muted-foreground">Lodge a complaint via the contact information below.</p></div>
                        </div>
                    </CardContent>
                </Card>
                
                {/* Section 3: Security and Contact */}
                <Card className={cn("border-l-4 border-green-500/50 shadow-xl border-green-500/20 animate-in fade-in duration-700 delay-300")}>
                    <CardHeader><CardTitle className="text-2xl flex items-center gap-2"><Globe className="w-6 h-6 text-green-500"/> Security & Contact</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-lg text-muted-foreground font-semibold">Security Measures:</p>
                        <ul className="list-disc list-inside space-y-2 text-foreground/90 pl-4">
                            <li>User passwords are protected with **bcrypt.js** hashing.</li>
                            <li>Data transmission uses SSL/TLS encryption.</li>
                            <li>AI generation data is processed via Google's Vertex AI/Gemini API under their security protocols.</li>
                        </ul>
                        <div className="p-4 rounded-xl bg-secondary/50 border border-primary/30 shadow-inner">
                            <p className="text-lg font-bold text-foreground flex items-center gap-2"><Mail className="w-5 h-5 text-primary"/> Data Protection Contact</p>
                            <p className="text-lg text-primary hover:underline transition-colors mt-1">
                                <a href={`mailto:${CONTACT_EMAIL}`} aria-label="Email the support team">{CONTACT_EMAIL}</a>
                            </p>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </>
    );
};

export default PrivacyPolicyPage;