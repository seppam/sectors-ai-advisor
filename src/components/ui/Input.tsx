"use client";

import { cn } from "@/lib/utils";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number";
  disabled?: boolean;
  error?: string;
  className?: string;
  maxLength?: number;
  autoComplete?: string;
}

export default function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
  error,
  className,
  maxLength,
  autoComplete,
}: InputProps) {
  return (
    <div className={cn("w-full", className)}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className={cn(
          "w-full bg-surface-container-high border rounded-md px-3 py-[10px] font-body-md text-on-surface",
          "placeholder:text-on-surface-variant",
          "focus:outline-none focus:border-primary/50",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          "transition-colors duration-150",
          error ? "border-danger" : "border-outline-variant",
        )}
        style={{ minHeight: "44px" }}
      />
      {error && (
        <p className="font-label-caps text-danger mt-1 pl-1">{error}</p>
      )}
    </div>
  );
}
