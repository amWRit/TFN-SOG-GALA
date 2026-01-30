import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "gold" | "outline" | "ghost" | "red";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = "default", size = "default", ...props }, ref) => {
    // Remove focus ring for adminButtonSmall and adminButtonSmallRed
    const isAdminButton =
      typeof className === 'string' &&
      (className.includes('adminButtonSmall') || className.includes('adminButtonSmallRed'));
    const baseClasses = [
      "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50",
      !isAdminButton && "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
    ];
    return (
      <button
        className={cn(
          baseClasses,
          {
            "bg-[#D4AF37] text-[#1a1a1a] hover:bg-[#B8941F] hover:scale-105 glow-gold-hover":
              variant === "default" || variant === "gold",
            "border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1a1a1a]":
              variant === "outline",
            "hover:bg-white/10": variant === "ghost",
            // New red variant for plain reddish button
            "bg-red-600 text-white hover:bg-red-700": variant === "red",
            "h-10 px-4 py-2": size === "default",
            "h-9 px-3 text-sm": size === "sm",
            "h-12 px-8 text-lg": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
