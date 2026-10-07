"use client";

import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export default function StatCard({ label, value, trend, className }: StatCardProps) {
  const trendColor = trend === "up"
    ? "text-success"
    : trend === "down"
    ? "text-danger"
    : "text-on-surface-variant";

  return (
    <div className={cn("bg-surface-container-high rounded-md px-3 py-2 text-center", className)}>
      <p className="font-label-caps text-on-surface-variant">{label}</p>
      <p className={cn("font-body-sm font-semibold text-on-surface mt-0.5", trendColor)}>
        {value}
      </p>
    </div>
  );
}
