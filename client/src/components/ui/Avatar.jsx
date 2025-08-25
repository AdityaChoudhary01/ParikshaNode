import React from 'react';
import { User } from 'lucide-react'; // Fallback icon

const Avatar = ({ src, alt, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeClasses[size]} overflow-hidden bg-secondary rounded-full`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <User className={`w-3/5 h-3/5 text-muted-foreground`} />
      )}
    </div>
  );
};

export default Avatar;