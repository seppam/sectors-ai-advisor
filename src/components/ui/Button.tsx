"use client";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary hover:bg-primary-fixed text-on-primary font-semibold border border-transparent",
  secondary: "bg-surface-container-high hover:bg-surface-bright text-on-surface border border-outline-variant hover:border-outline",
  ghost: "bg-transparent hover:bg-surface-container-high text-on-surface-variant border border-transparent",
  danger: "bg-danger/10 hover:bg-danger/15 text-danger border border-danger/20",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 font-body-sm",
  md: "px-5 py-2.5 font-body-md",
  lg: "px-6 py-3 font-title-sm",
  xl: "px-8 py-4 font-headline-md",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  onClick,
  disabled,
  isLoading,
  fullWidth,
  className,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all duration-150 rounded-full",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface",
        "active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
    >
      {isLoading && (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
