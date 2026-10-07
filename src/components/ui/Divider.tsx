"use client";

import { cn } from "@/lib/utils";

interface DividerProps {
  className?: string;
}

export default function Divider({ className }: DividerProps) {
  return (
    <div
      className={cn("border-t border-outline-variant my-4", className)}
    />
  );
}
