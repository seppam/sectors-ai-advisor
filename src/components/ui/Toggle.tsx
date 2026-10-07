"use client";

import { cn } from "@/lib/utils";

interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function Toggle({ options, value, onChange, className }: ToggleProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex-1 py-2 rounded-lg border font-body-sm font-medium text-center transition-all duration-150",
              isActive
                ? "border-primary/25 bg-primary-container/15 text-primary"
                : "border-outline-variant bg-surface-container-high text-on-surface-variant hover:border-outline hover:text-on-surface"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
