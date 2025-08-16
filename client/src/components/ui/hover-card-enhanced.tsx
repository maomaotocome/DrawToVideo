import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface HoverCardEnhancedProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  shadowIntensity?: "sm" | "md" | "lg" | "xl";
  glowColor?: string;
}

export const HoverCardEnhanced: React.FC<HoverCardEnhancedProps> = ({
  children,
  className,
  hoverScale = 1.02,
  shadowIntensity = "lg",
  glowColor = "purple",
}) => {
  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-300 ease-out transform-gpu",
        "hover:shadow-2xl",
        shadowIntensity === "sm" && "hover:shadow-sm",
        shadowIntensity === "md" && "hover:shadow-md", 
        shadowIntensity === "lg" && "hover:shadow-lg hover:shadow-purple-500/10",
        shadowIntensity === "xl" && "hover:shadow-xl hover:shadow-purple-500/20",
        "border-transparent hover:border-purple-200/50",
        "backdrop-blur-sm bg-white/80 hover:bg-white/90",
        "dark:bg-gray-900/80 dark:hover:bg-gray-900/90",
        className
      )}
      style={{
        transform: `scale(1)`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `scale(${hoverScale})`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {children}
    </Card>
  );
};