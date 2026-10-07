"use client";

import { cn } from "@/lib/utils";
import Button from "./Button";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
  };
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 gap-3 text-center", className)}>
      {icon && <div className="text-4xl">{icon}</div>}
      <h3 className="font-title-sm font-semibold text-on-surface-variant">{title}</h3>
      {description && (
        <p className="font-body-sm text-on-surface-variant max-w-xs opacity-80">{description}</p>
      )}
      {action && (
        <Button
          variant={action.variant ?? "primary"}
          size="md"
          onClick={action.onClick}
          className="mt-1"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
