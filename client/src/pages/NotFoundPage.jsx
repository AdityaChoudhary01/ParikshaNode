import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Frown } from 'lucide-react'; // Added icon
import { cn } from '@/lib/utils'; // Added cn utility

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-20">
      
      {/* 404 Code - Animated and Gradient */}
      <h1 className={cn(
        "text-9xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary to-destructive drop-shadow-lg",
        "animate-in zoom-in duration-500"
      )}>
        404
      </h1>
      
      {/* Icon and Message */}
      <div className={cn(
        "flex flex-col items-center mt-6 p-4 rounded-xl bg-card/70 border border-border/50 shadow-xl",
        "animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200" // Staggered animation
      )}>
        <Frown className="w-12 h-12 mb-3 text-primary" />
        <p className="text-3xl font-semibold text-foreground/90">Page Not Found</p>
        <p className="mt-2 text-lg text-muted-foreground">Sorry, the address you typed does not exist.</p>
      </div>

      {/* Button */}
      <Link to="/" className="mt-10 animate-in fade-in duration-700 delay-300">
        <Button 
            className="h-12 px-6 text-lg shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-all duration-300"
        >
            Go Back Home
        </Button>
      </Link>
    </div>
  );
};


export default NotFoundPage;
