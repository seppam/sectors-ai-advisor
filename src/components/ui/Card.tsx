"use client";

import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-space-sm",
  md: "p-space-md",
  lg: "p-space-lg",
};

export default function Card({
  children,
  className,
  onClick,
  padding = "md",
}: CardProps) {
  const isInteractive = !!onClick;
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-surface-container-low border border-outline-variant rounded-xl",
        "transition-colors duration-150",
        isInteractive && "hover:border-outline hover:bg-surface-container-high cursor-pointer",
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
