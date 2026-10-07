"use client";

import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "landing";
  padding?: boolean;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-container",
  xl: "max-w-landing-container",
  landing: "max-w-landing",
};

export default function PageContainer({
  children,
  className,
  maxWidth = "lg",
  padding = true,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        maxWidthClasses[maxWidth],
        padding && "px-4",
        className
      )}
    >
      {children}
    </div>
  );
}
