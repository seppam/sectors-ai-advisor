"use client";

import { cn } from "@/lib/utils";

type BadgeVariant = "accent" | "subtle" | "success" | "danger" | "warning";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  accent: "bg-primary-container/15 text-primary border-primary/25",
  subtle: "bg-surface-container-high text-on-surface-variant border-outline-variant",
  success: "bg-success/10 text-success border-success/20",
  danger: "bg-danger/10 text-danger border-danger/20",
  warning: "bg-warning/10 text-warning border-warning/20",
};

export default function Badge({ variant = "subtle", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-[10px] py-[3px]",
        "font-label-caps rounded-full border",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
