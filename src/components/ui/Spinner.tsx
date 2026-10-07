"use client";

import { cn } from "@/lib/utils";

type SpinnerSize = "sm" | "md";

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

export default function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeMap = {
    sm: "w-4 h-4 border-[1.5px]",
    md: "w-5 h-5 border-2",
  };
  return (
    <div
      className={cn(
        "rounded-full border-outline-variant border-t-primary animate-spin",
        sizeMap[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
