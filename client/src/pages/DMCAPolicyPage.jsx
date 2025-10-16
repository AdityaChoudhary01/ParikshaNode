// ParikshaNode-main/client/src/pages/DMCAPolicyPage.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { FileText, Mail, Trash2, Shield, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils'; 

// --- SEO CONSTANTS ---
const SITE_NAME = "ParikshaNode";
const SITE_URL = "https://parikshanode.netlify.app/"; 
const DMCA_URL = `${SITE_URL}dmca`;
// Use a specific email for legal notices
const DMCA_AGENT_EMAIL = "aadiwrld01@gmail.com.com"; 

// --- JSON-LD Schema Markup ---
const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "DMCA & Copyright Takedown Policy",
    "description": "Official policy for reporting copyright infringement on ParikshaNode. We comply with DMCA and India's IT Act 2000 for content removal.",
    "url": DMCA_URL,
};
// -----------------------------

const DMCAPolicyPage = () => {
    return (
        <>
            <Helmet>
                <title>Official DMCA Takedown Policy | Copyright Infringement Report</title>
                <meta 
                    name="description" 
                    content="Report copyright infringement and submit a DMCA Takedown Notice to ParikshaNode's designated agent. We ensure swift removal of unauthorized content to comply with global laws." 
                />
                <meta name="keywords" content="DMCA Takedown Notice, copyright infringement, IT Act 2000, safe harbor, quiz copyright removal" />
                <link rel="canonical" href={DMCA_URL} />
                <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
            </Helmet>

            <div className="max-w-4xl mx-auto space-y-10 px-0 py-8 p-4 sm:p-6 lg:p-8">
                
                {/* Header */}
                <header className="text-center animate-in fade-in slide-in-from-top-10 duration-700">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-primary drop-shadow-md" />
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-transparent bg-clip-text 
                                     bg-gradient-to-r from-primary to-destructive">
                        DMCA & Copyright Takedown Policy
                    </h1>
                    <h2 className="mt-2 text-xl text-muted-foreground max-w-3xl mx-auto border-none p-0 m-0">
                        We respect intellectual property and act immediately on valid infringement claims.
                    </h2>
                </header>

                {/* Section 1: Designated Agent */}
                <Card className={cn("border-l-4 border-primary/50 shadow-xl border-primary/20 animate-in fade-in duration-700 delay-100")}>
                    <CardHeader><CardTitle className="text-2xl flex items-center gap-2"><Mail className="w-6 h-6 text-primary"/> Designated Copyright Agent</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-lg text-muted-foreground">
                            As an Online Service Provider (OSP), ParikshaNode operates under **Safe Harbor** provisions of the US **Digital Millennium Copyright Act (DMCA)** and the **Indian IT Act, 2000 (Section 79)**. Our compliance ensures we are not liable for user-uploaded infringement, provided we remove the content upon notification.
                        </p>
                        <div className="p-4 rounded-xl bg-secondary/50 border border-primary/30 shadow-inner">
                            <p className="text-lg font-bold text-foreground">To submit a formal Takedown Notice, email:</p>
                            <a href={`mailto:${DMCA_AGENT_EMAIL}`} className="text-2xl font-extrabold text-destructive hover:underline transition-colors block mt-2 break-all">
                                {DMCA_AGENT_EMAIL}
                            </a>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 2: Takedown Requirements */}
                <Card className={cn("border-l-4 border-destructive/50 shadow-xl border-destructive/20 animate-in fade-in duration-700 delay-200")}>
                    <CardHeader><CardTitle className="text-2xl flex items-center gap-2"><Trash2 className="w-6 h-6 text-destructive"/> Requirements for a Valid Notice</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-lg text-muted-foreground">
                            For a request to be legally valid and trigger our content removal process (within **36 hours** as per Indian IT Rules), your notice *must* include:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-foreground/90 pl-4">
                            <li className="font-semibold">Identification of the copyrighted work (e.g., Title and Author of the original textbook/test bank).</li>
                            <li className="font-semibold">Identification of the infringing material: The exact URL on ParikshaNode (e.g., `{SITE_URL}quiz/some-quiz-id`).</li>
                            <li className="font-semibold">Sufficient contact information (name, address, telephone number, email).</li>
                            <li className="font-semibold">A statement that the complaining party has a **good faith belief** the use is unauthorized.</li>
                            <li className="font-semibold text-destructive/90">A statement that the information is accurate, made **under penalty of perjury**.</li>
                        </ul>
                    </CardContent>
                </Card>
                
                {/* Section 3: Repeat Infringer Policy */}
                <Card className={cn("border-l-4 border-destructive shadow-xl border-destructive/20 animate-in fade-in duration-700 delay-300")}>
                    <CardHeader><CardTitle className="text-2xl flex items-center gap-2"><Shield className="w-6 h-6 text-destructive"/> Repeat Infringer Policy</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-lg text-muted-foreground">
                            ParikshaNode strictly adheres to a **Zero Tolerance / Three Strikes** policy for copyright infringement.
                        </p>
                        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/50 shadow-inner">
                            <p className="font-bold text-foreground">Any user who is deemed a **repeat infringer** (receives multiple valid DMCA/Copyright claims) will have their account permanently terminated and banned from the platform.</p>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </>
    );
};

export default DMCAPolicyPage;