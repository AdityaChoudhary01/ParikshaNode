import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Coffee, Globe, Lightbulb, ShieldBan } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
const DonatePage = () => {
  const upiQRCodeUrl = 'https://res.cloudinary.com/dmtnonxtt/image/upload/v1752488580/GooglePay_QR_xtgkh4.png';

  return (
    <>
      <Helmet>
        <title>Support Us | ParikshaNode</title>
        <meta name="description" content="Help keep ParikshaNode ad-free and running. Your support helps us cover server costs and develop new features." />
      </Helmet>

    <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Become a Supporter</h1>
            <p className="mt-4 text-lg text-muted-foreground">ParikshaNode is a passion project. Your contribution, no matter the size, makes a huge difference!</p>
        </div>

        <Card className="mb-8">
            <CardHeader><CardTitle>How Your Support Helps</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4">
                    <Globe className="w-10 h-10 mb-2 text-primary" />
                    <h3 className="font-semibold">Server Costs</h3>
                    <p className="text-sm text-muted-foreground">Keeps the website online, fast, and accessible 24/7.</p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                    <Lightbulb className="w-10 h-10 mb-2 text-primary" />
                    <h3 className="font-semibold">New Features</h3>
                    <p className="text-sm text-muted-foreground">Allows for development of new tools and improvements.</p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                    <ShieldBan className="w-10 h-10 mb-2 text-primary" />
                    <h3 className="font-semibold">Ad-Free Experience</h3>
                    <p className="text-sm text-muted-foreground">Ensures the platform remains clean and focused.</p>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Ways to Contribute</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader><CardTitle>UPI (for users in India)</CardTitle></CardHeader>
                    <CardContent className="text-center">
                        <p className="text-sm text-muted-foreground mb-4">Scan the QR code with any UPI app like Google Pay, PhonePe, or Paytm.</p>
                        <div className="p-2 bg-white rounded-lg inline-block">
                            <img src={upiQRCodeUrl} alt="UPI QR Code" className="w-48 h-48" />
                        </div>
                        <p className="mt-4 font-mono">adityanain55@oksbi</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Buy Me a Coffee</CardTitle></CardHeader>
                    <CardContent className="text-center flex flex-col items-center">
                        <img src="https://cdn.buymeacoffee.com/uploads/profile_pictures/2025/07/ZzlkIXLPpwCOJfAo.jpg@300w_0e.webp" alt="Aditya Choudhary" className="w-20 h-20 rounded-full mb-2 border-2 border-primary" />
                        <p className="font-semibold">Aditya Choudhary</p>
                        <p className="text-sm text-muted-foreground mb-4">A simple and secure way to show your support.</p>
                        <a href="https://coff.ee/adityachoudhary" target="_blank" rel="noopener noreferrer">
                            <Button><Coffee className="w-4 h-4 mr-2" /> Buy Me a Coffee</Button>
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

