import * as React from "react"
import { cn } from "@/lib/utils"

// 🚀 Card: The 'Out of the World' Container 🚀
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // 🌌 ULTRA MODERN PRO MAX CARD STYLES 🌌
      // Extreme roundness for a soft, premium feel
      "rounded-[32px] overflow-hidden", 
      // Background: Highly opaque glass with a strong blur
      "bg-card/[0.6] text-card-foreground backdrop-blur-3xl", 
      
      // Border: Subtle, dynamic gradient border (simulated via shadow and ring)
      "border border-white/10 ring-1 ring-primary/20", 

      // Shadow: Deep, layered shadow for z-axis effect, plus a neon glow 
      "shadow-[0_15px_30px_rgba(0,0,0,0.5),0_0_15px_rgba(var(--primary-rgb),0.2)]", 
      
      // Interactivity: Extreme hover effect (scale, deeper glow, higher elevation)
      "transition-all duration-500 ease-out", 
      "hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(var(--primary-rgb),0.5)]", 
      "hover:border-primary/50",
      
      // Pseudo-element for a subtle internal gradient sheen (requires custom CSS setup or utility)
      // We'll skip the pseudo-element for pure utility class usage but keep the deep glow.
      // ----------------------------------------------------
      className
    )}
    style={{ 
      // Custom style to use a CSS variable for the neon glow color calculation
      // Assuming --primary-rgb is set in your CSS/globals (e.g., 59, 130, 246)
      '--primary-rgb': 'var(--card-glow-rgb, 59, 130, 246)', 
    }}
    {...props} />
))
Card.displayName = "Card"

// 🚀 CardHeader: Floating Separation 🚀
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      // Increased padding
      "flex flex-col space-y-2 p-8", 
      // Subtle bottom shadow instead of a harsh border for "floating" separation
      "shadow-sm shadow-primary/10",
      className
    )} 
    {...props} />
))
CardHeader.displayName = "CardHeader"

// 🚀 CardTitle: High-Contrast and Energetic 🚀
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 
    ref={ref} 
    className={cn(
      // Bigger, bolder, and adding a subtle text shadow for lift
      "text-3xl font-extrabold leading-tight tracking-tighter text-foreground", 
      "drop-shadow-lg drop-shadow-primary/50", // Text-shadow/lift
      className
    )} 
    {...props} />
))
CardTitle.displayName = "CardTitle"

// 🚀 CardDescription: Subdued Clarity 🚀
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p 
    ref={ref} 
    className={cn(
      // Slightly larger description for readability
      "text-lg text-muted-foreground/90", 
      className
    )} 
    {...props} />
))
CardDescription.displayName = "CardDescription"

// 🚀 CardContent: Inner Core 🚀
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  // More generous padding to give the content room to breathe
  <div ref={ref} className={cn("p-8 pt-4", className)} {...props} />
))
CardContent.displayName = "CardContent"

// 🚀 CardFooter: Separated Action Area 🚀
const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      // Generous padding, shadow on top for separation
      "flex items-center p-8 pt-4", 
      "shadow-inner shadow-primary/10", // Inner shadow for separation
      className
    )} 
    {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
