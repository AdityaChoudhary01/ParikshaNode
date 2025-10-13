// FILE: '@/components/ui/Avatar.jsx' (or .tsx)

import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react'; 
import { cn } from "@/lib/utils";

const getInitials = (name) => {
  if (!name || typeof name !== 'string') return "U"; 
  const parts = name.split(' ');
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return parts.map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const Avatar = ({ src, alt, size = 'md', className }) => {
  // 💡 State to track if the image failed to load
  const [imgError, setImgError] = useState(false);
  
  // Reset error state if the src URL changes (e.g., user logs in or updates profile)
  useEffect(() => {
    setImgError(false);
  }, [src]);

  const sizeClasses = {
    sm: 'w-10 h-10 text-lg',
    md: 'w-14 h-14 text-xl',
    lg: 'w-28 h-28 text-2xl',
    xl: 'w-40 h-40 text-3xl',
  };

  const baseClasses = cn(
    // Pro Max Avatar Styles
    'relative inline-flex items-center justify-center overflow-hidden', 
    sizeClasses[size], 
    'rounded-full bg-secondary/80 ring-2 ring-primary/40', 
    'shadow-lg shadow-black/30 transition-all duration-300 ease-out',
    'hover:ring-primary hover:shadow-xl hover:shadow-primary/20',
    className
  );

  const initials = getInitials(alt);

  // 1. TRY IMAGE: If src is provided and no error has occurred
  if (src && !imgError) {
    return (
      <div className={baseClasses}>
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover rounded-full" 
          // 🛑 CRITICAL LINE: If image loading fails, set state to true, triggering fallback
          onError={() => setImgError(true)} 
        />
      </div>
    );
  }

  // 2. FALLBACK to Initials (if alt/username exists)
  if (initials && initials !== "U") {
    return (
      <div className={baseClasses}>
        <span className="font-extrabold text-foreground/90 select-none">
          {initials}
        </span>
      </div>
    );
  }

  // 3. FALLBACK to Generic Icon
  return (
    <div className={baseClasses}>
      <User className={cn(`w-3/5 h-3/5`, 'text-foreground/80')} />
    </div>
  );
};

export default Avatar;
