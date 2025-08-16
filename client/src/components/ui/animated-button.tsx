import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  pulseOnHover?: boolean;
  scaleOnHover?: boolean;
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, children, isLoading, loadingText, pulseOnHover = false, scaleOnHover = true, disabled, ...props }, ref) => {
    return (
      <Button
        className={cn(
          "relative overflow-hidden",
          "transition-all duration-300 ease-out",
          scaleOnHover && "hover:scale-105 active:scale-95",
          pulseOnHover && "hover:animate-pulse",
          "transform-gpu", // Use GPU acceleration
          isLoading && "cursor-not-allowed",
          className
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        <span className={cn(
          "transition-opacity duration-200",
          isLoading && "opacity-0"
        )}>
          {children}
        </span>
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              {loadingText && <span className="text-sm">{loadingText}</span>}
            </div>
          </div>
        )}
        
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      </Button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";