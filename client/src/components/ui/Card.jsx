import * as React from "react"
import { cn } from "@/lib/utils"

// Update the className for the Card component
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // --- ULTRA MODERN BASE CARD STYLES ---
      // Rounded edges slightly larger (xl), border with primary accent
      "rounded-xl border border-primary/20", 
      // Background is slightly opaque card color with strong blur for glass effect
      "bg-card/90 text-card-foreground backdrop-blur-xl", 
      // Stronger shadow effect using the primary color
      "shadow-2xl shadow-primary/20", 
      // Add subtle hover transition for animation/interactivity
      "transition-all duration-300 hover:shadow-primary/40 hover:border-primary/50", 
      // ------------------------------------
      className
    )}
    {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    // Increased padding and border-b for clean separation
    className={cn("flex flex-col space-y-1.5 p-6 border-b border-border/70", className)} 
    {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  // Bolder, larger title with a subtle primary color accent
  <h3 ref={ref} className={cn("text-2xl font-extrabold leading-none tracking-tight text-foreground/90", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-md text-muted-foreground", className)} {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  // Standard padding, ensuring pt-0 after the header
  <div ref={ref} className={cn("p-6 pt-6", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  // Border-t for clean separation from content
  <div ref={ref} className={cn("flex items-center p-6 pt-0 border-t border-border/70", className)} {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
