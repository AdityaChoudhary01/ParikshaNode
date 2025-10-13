import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

// 🚀 DropdownMenuContent: The Glassy, Floating Panel 🚀
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 10, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      // Increased offset to enhance the "floating" effect
      sideOffset={sideOffset} 
      className={cn(
        // 🌌 ULTRA MODERN PRO MAX DROPDOWN STYLES 🌌
        "z-50 min-w-[10rem] overflow-hidden",
        
        // Glassmorphism: Opaque background with strong blur
        "bg-card/[0.6] text-popover-foreground backdrop-blur-3xl", 
        
        // Shape & Border: Extreme roundness and subtle white border
        "rounded-2xl border border-white/10",
        
        // Shadow & Depth: Deep shadow with a subtle neon glow (like the Card)
        "shadow-[0_10px_20px_rgba(0,0,0,0.5),0_0_8px_rgba(var(--primary-rgb),0.1)]",
        
        // Padding: Minimal padding for edge-to-edge content (p-0)
        "p-0", 
        
        // Animation: Smooth entrance animation (requires tailwind-variants or custom keyframes for full effect)
        // Using Radix built-in data-state for simple animations:
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        
        // Custom style for glow color (as established in the Card component)
        '--primary-rgb', 'var(--card-glow-rgb, 59, 130, 246)', 
        
        className
      )}
      {...props} />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

// 🚀 DropdownMenuItem: Dynamic Hover Interaction 🚀
const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      // Standard item layout (flex, select-none, text-sm, outline-none)
      "relative flex cursor-pointer select-none items-center px-4 py-2 text-sm outline-none", 
      
      // Shape: Slight roundness for internal items
      "rounded-lg mx-1 my-[2px]", 
      
      // Pro Max Hover Effect: Gradient background, slight scale, primary color text
      "transition-all duration-200 ease-out", 
      "focus:bg-primary/10 focus:text-primary focus:scale-[1.02]", 
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
      
      inset && "pl-12", // Increased inset padding to match new layout
      className
    )}
    {...props} />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

// 🚀 DropdownMenuLabel: Enhanced Visual Hierarchy 🚀
const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      // Larger text, bold, slightly muted, with more horizontal padding
      "px-4 py-2 text-md font-bold text-foreground/80", 
      inset && "pl-12",
      className
    )}
    {...props} />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

// 🚀 DropdownMenuSeparator: Sleek, Thin Divider 🚀
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    // Thin, slightly transparent separator line
    className={cn("mx-2 my-1 h-px bg-border/50", className)}
    {...props} />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({ className, ...props }) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props} />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"


export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator, 
  DropdownMenuShortcut, // Added for completeness, often used in premium menus
}
