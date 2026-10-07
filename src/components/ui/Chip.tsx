"use client";

import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  onClick?: () => void;
  className?: string;
}

export default function Chip({ label, onClick, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-0.5",
        "bg-primary/10 border border-primary/25 rounded-lg",
        "font-label-caps font-semibold text-primary",
        "hover:bg-primary/18 active:bg-primary/25",
        "cursor-pointer transition-colors duration-150",
        className
      )}
    >
      <span>{label}</span>
      <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
  );
}
