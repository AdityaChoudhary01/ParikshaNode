// ParikshaNode-main/client/src/pages/TermsOfServicePage.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Link } from 'react-router-dom';
import { BookOpen, Scale, Shield, Users } from 'lucide-react';
import { cn } from '@/lib/utils'; 

// --- SEO CONSTANTS ---
const SITE_URL = "https://parikshanode.netlify.app/"; 
const TERMS_URL = `${SITE_URL}terms`;

// --- JSON-LD Schema Markup ---
const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Service and User Agreement",
    "description": "ParikshaNode's binding Terms of Service, covering user-generated content (UGC), liability limits, and the Repeat Infringer Policy.",
    "url": TERMS_URL,
    "dateModified": "2025-10-16",
};
// -----------------------------

const TermsOfServicePage = () => {
    return (
        <>
            <Helmet>
                <title>Terms of Service | User Agreement & Platform Rules</title>
                <meta 
                    name="description" 
                    content="The official Terms of Service for ParikshaNode. This legally binding agreement covers user responsibilities, platform usage, intellectual property (UGC), and limitation of liability." 
                />
                <meta name="keywords" content="Terms of Service, User Agreement, UGC liability, ParikshaNode rules, acceptable use policy" />
                <link rel="canonical" href={TERMS_URL} />
                <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
            </Helmet>

            <div className="max-w-4xl mx-auto space-y-10 py-8 p-4 sm:p-6 lg:p-8">
                
                {/* Header */}
                <header className="text-center animate-in fade-in slide-in-from-top-10 duration-700">
                    <Scale className="w-12 h-12 mx-auto mb-4 text-primary drop-shadow-md" />
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-transparent bg-clip-text 
                                     bg-gradient-to-r from-primary to-destructive">
                        Terms of Service & User Agreement
                    </h1>
                    <h2 className="mt-2 text-xl text-muted-foreground max-w-3xl mx-auto border-none p-0 m-0">
                        Effective Date: October 16, 2025. This document is a binding contract.
                    </h2>
                </header>

                {/* Section 1: Acceptance & Governing Law */}
                <Card className={cn("border-l-4 border-primary/50 shadow-xl border-primary/20 animate-in fade-in duration-700 delay-100")}>
                    <CardHeader><CardTitle className="text-2xl flex items-center gap-2"><BookOpen className="w-6 h-6 text-primary"/> General Terms</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-lg font-semibold text-foreground/90">
                            By clicking "Sign Up" or accessing ParikshaNode, you confirm you have read and agree to these Terms, the <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, and the <Link to="/dmca" className="text-primary hover:underline">DMCA Policy</Link>.
                        </p>
                        <div className="p-3 bg-secondary/50 rounded-lg shadow-inner">
                            <p className="font-bold text-foreground">Governing Law</p>
                            <p className="text-sm text-muted-foreground">This agreement is governed by the laws of India, without regard to conflict of law principles.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 2: User-Generated Content (UGC) & IP */}
                <Card className={cn("border-l-4 border-destructive/50 shadow-xl border-destructive/20 animate-in fade-in duration-700 delay-200")}>
                    <CardHeader><CardTitle className="text-2xl flex items-center gap-2"><Users className="w-6 h-6 text-destructive"/> User Content & Copyright Liability</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-lg text-muted-foreground">
                            You are solely responsible for all quizzes, questions, and content you submit.
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-foreground/90 pl-4">
                            <li className="font-semibold text-green-500">You warrant that you own all rights or have a valid license for the content you upload.</li>
                            <li className="font-semibold text-destructive/90">**Prohibited Content:** Uploading copyrighted material, proprietary test bank questions, or content that violates our <Link to="/dmca" className="text-destructive hover:underline">Copyright Policy</Link> is strictly forbidden.</li>
                        </ul>
                        <div className="p-3 bg-destructive/10 border border-destructive/50 rounded-lg shadow-inner">
                            <p className="font-bold text-destructive">Indemnification:</p>
                            <p className="text-sm text-muted-foreground">You agree to defend and hold ParikshaNode harmless from any legal fees, claims, or damages resulting from your uploaded content.</p>
                        </div>
                    </CardContent>
                </Card>
                
                {/* Section 3: Termination & Account Rules */}
                <Card className={cn("border-l-4 border-primary/50 shadow-xl border-primary/20 animate-in fade-in duration-700 delay-300")}>
                    <CardHeader><CardTitle className="text-2xl flex items-center gap-2"><Shield className="w-6 h-6 text-primary"/> Termination & Repeat Infringement</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="list-disc list-inside space-y-2 text-foreground/90 pl-4">
                            <li className="font-semibold">ParikshaNode reserves the right to suspend or terminate your account at any time for any material breach of these Terms.</li>
                            <li className="font-semibold text-destructive/90">**Repeat Infringers:** Accounts found to repeatedly violate copyright laws will be permanently banned from the Service.</li>
                            <li className="font-semibold">You may terminate your account at any time by contacting our support channel.</li>
                        </ul>
                    </CardContent>
                </Card>

            </div>
        </>
    );
};

export default TermsOfServicePage;