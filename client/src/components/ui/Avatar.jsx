import React from 'react';
import { User } from 'lucide-react'; // Fallback icon
import { cn } from "@/lib/utils" // Assuming cn is available for cleaner utility composition

const Avatar = ({ src, alt, size = 'md', className }) => {
  const sizeClasses = {
    // Increased sizes for a bolder presence
    sm: 'w-10 h-10 text-lg', // Slightly larger sm
    md: 'w-14 h-14 text-xl', // Larger md
    lg: 'w-28 h-28 text-2xl', // Larger lg
    xl: 'w-40 h-40 text-3xl', // Larger xl
  };

  // 🚀 ULTRA MODERN PRO MAX AVATAR STYLES 🚀
  const baseClasses = cn(
    // Base shape and size
    'relative inline-flex items-center justify-center', 
    sizeClasses[size], 
    
    // Pro Max Shape: Perfect circle
    'rounded-full', 

    // Background: Darker, subtle background for depth
    'bg-secondary/80',
    
    // Ring/Border: Primary color accent ring for high visibility
    'ring-2 ring-primary/40', 
    
    // Depth: Inner and outer shadow for a floating, neomorphic effect
    'shadow-lg shadow-black/30',
    'transition-all duration-300 ease-out',
    
    // Hover Effect: Slight lift and increased glow
    'hover:ring-primary hover:shadow-xl hover:shadow-primary/20',

    className
  );

  return (
    <div className={baseClasses}>
      {src ? (
        // Image: Ensure the image itself is rounded and object-fit cover
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover rounded-full" 
        />
      ) : (
        // Fallback Icon: Bolder and uses foreground color
        <User className={cn(
          `w-3/5 h-3/5`, 
          'text-foreground/80' // Use foreground for better contrast
        )} />
      )}
    </div>
  );
};

export default Avatar;
