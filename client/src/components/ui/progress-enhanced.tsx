import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressEnhancedProps {
  value: number;
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
  color?: "default" | "purple" | "blue" | "green" | "orange";
  size?: "sm" | "md" | "lg";
  glowEffect?: boolean;
}

export const ProgressEnhanced: React.FC<ProgressEnhancedProps> = ({
  value,
  className,
  showPercentage = false,
  animated = true,
  color = "purple",
  size = "md",
  glowEffect = false,
}) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(value);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated]);

  const getColorClasses = () => {
    switch (color) {
      case "purple":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "blue":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      case "green":
        return "bg-gradient-to-r from-green-500 to-emerald-500";
      case "orange":
        return "bg-gradient-to-r from-orange-500 to-red-500";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-1";
      case "lg":
        return "h-4";
      default:
        return "h-2";
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Progress
          value={displayValue}
          className={cn(
            "transition-all duration-700 ease-out",
            getSizeClasses(),
            glowEffect && "shadow-lg shadow-purple-500/30",
            className
          )}
        />
        
        {/* Enhanced progress bar fill */}
        <div
          className={cn(
            "absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out",
            getColorClasses(),
            animated && "animate-pulse",
            glowEffect && `shadow-lg shadow-${color}-500/50`
          )}
          style={{ width: `${displayValue}%` }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>
      
      {showPercentage && (
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Progress</span>
          <span className="font-mono">{Math.round(displayValue)}%</span>
        </div>
      )}
    </div>
  );
};