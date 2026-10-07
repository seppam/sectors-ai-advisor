"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  getSessionUsage,
  getUsageSummary,
  formatTokenCount,
  formatCost,
  resetUsageSession,
  type UsageEvent,
} from "@/lib/usageTracker";

interface UsagePanelProps {
  modelName?: string;
  sectorsBalance?: number;
  language?: "id" | "en";
}

export default function UsagePanel({
  modelName,
  language = "id",
}: UsagePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const usage = getSessionUsage();
  const summary = getUsageSummary(modelName);
  const events = usage.events;

  // Don't render if no usage yet
  if (events.length === 0) return null;

  const apiCostLabel = language === "id" ? "Biaya API" : "API Cost";
  const tokensLabel = language === "id" ? "Tokens In/Out" : "Tokens In/Out";
  const quotaLabel = language === "id" ? "Sisa Kuota" : "Remaining Quota";
  const sessionLabel = language === "id" ? "Estimasi Sesi Komputasi" : "Session Compute Estimate";
  const detailsLabel = language === "id" ? "Detail" : "Details";
  const _resetLabel = language === "id" ? "Reset" : "Reset";
  const hideLabel = language === "id" ? "Sembunyikan" : "Hide";

  return (
    <>
      {/* Toggle Button — collapsed one-liner */}
      <div className="px-margin pt-space-xs pb-space-sm flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",
            "bg-surface-container-high text-on-surface shadow-sm",
            "active:scale-95 transition-all"
          )}
        >
          {/* Pulsing dot */}
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />

          {/* Cost */}
          {summary.totalCostUsd > 0 && (
            <span className="font-mono-metric-sm font-mono-metric-sm text-primary tracking-tight">
              {formatCost(summary.totalCostUsd)}
            </span>
          )}

          {/* Token count */}
          {summary.totalTokens > 0 && (
            <span className="font-mono-metric-sm font-mono-metric-sm text-on-surface-variant">
              · {formatTokenCount(summary.totalTokens)} tok
            </span>
          )}

          {/* Credits */}
          {summary.totalCredits > 0 && (
            <span className="font-mono-metric-sm font-mono-metric-sm text-tertiary">
              · {summary.totalCredits} kr
            </span>
          )}

          {/* Expand icon */}
          <span
            className={cn(
              "material-symbols-outlined text-[14px] text-on-surface-variant transition-transform duration-300"
            )}
            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            expand_more
          </span>
        </button>

        {/* Right-side action buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              resetUsageSession();
            }}
            className={cn(
              "min-w-[36px] h-9 px-2 rounded-lg",
              "bg-surface-container flex items-center justify-center",
              "text-on-surface-variant hover:text-primary active:scale-95 transition-colors"
            )}
            title={language === "id" ? "Reset Sesi Obrolan" : "Reset Chat Session"}
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
          </button>
        </div>
      </div>

      {/* Expanded detail panel */}
      {isOpen && (
        <div className="px-margin mb-space-sm transition-all duration-300 animate-fade-in">
          <div className="p-space-md rounded-xl bg-surface-container-high shadow-lg flex flex-col gap-2">
            {/* Header row */}
            <div className="flex justify-between items-center">
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">
                {sessionLabel}
              </span>
              {modelName && (
                <span className="font-mono-metric-sm font-mono-metric-sm text-primary">
                  {modelName}
                </span>
              )}
            </div>

            {/* 3-column stat grid */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2 rounded bg-surface-container-lowest flex flex-col gap-1">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">{apiCostLabel}</span>
                <span className="font-mono-metric font-mono-metric text-on-surface">
                  {formatCost(summary.totalCostUsd)}
                </span>
              </div>
              <div className="p-2 rounded bg-surface-container-lowest flex flex-col gap-1">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">{tokensLabel}</span>
                <span className="font-mono-metric font-mono-metric text-on-surface">
                  {formatTokenCount(summary.totalTokens)}
                </span>
              </div>
              <div className="p-2 rounded bg-surface-container-lowest flex flex-col gap-1">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">{quotaLabel}</span>
                <span className="font-mono-metric font-mono-metric text-secondary">
                  {summary.totalCredits} kr
                </span>
              </div>
            </div>

            {/* Detail toggle */}
            {events.length > 0 && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="inline-flex items-center gap-1 text-on-surface-variant hover:text-on-surface transition-colors font-label-caps text-label-caps"
                >
                  <span className="material-symbols-outlined text-[14px] transition-transform" style={{ transform: showDetails ? "rotate(90deg)" : "rotate(0deg)" }}>
                    chevron_right
                  </span>
                  {showDetails ? hideLabel : `${detailsLabel} (${events.length})`}
                </button>
              </div>
            )}

            {/* Detailed event log */}
            {showDetails && (
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto no-scrollbar">
                {events.map((event) => (
                  <EventRow key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ──────────────────────────────────────────────────────────
   Single event row
   ────────────────────────────────────────────────────────── */

function EventRow({ event }: { event: UsageEvent }) {
  const time = new Date(event.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Jakarta",
  });

  if (event.type === "llm_call") {
    return (
      <div className="flex items-start gap-2 p-2 rounded-lg bg-surface-container flex-wrap">
        <span className="font-mono-metric-sm font-mono-metric-sm text-on-surface-variant shrink-0">{time}</span>
        <span className="font-mono-metric-sm font-mono-metric-sm text-primary shrink-0">LLM</span>
        <span className="font-mono-metric-sm font-mono-metric-sm text-on-surface-variant truncate flex-1 min-w-0">
          {event.userQuery || "(no query)"}
        </span>
        <span className="font-mono-metric-sm font-mono-metric-sm text-on-surface-variant shrink-0">
          {formatTokenCount(event.inputTokens ?? 0)}→{formatTokenCount(event.outputTokens ?? 0)}
        </span>
        <span className="font-mono-metric-sm font-mono-metric-sm text-on-surface shrink-0">
          {formatCost(event.totalCostUsd ?? 0)}
        </span>
      </div>
    );
  }

  // Sectors API event
  return (
    <div className="flex items-start gap-2 p-2 rounded-lg bg-surface-container flex-wrap">
      <span className="font-mono-metric-sm font-mono-metric-sm text-on-surface-variant shrink-0">{time}</span>
      <span className="font-mono-metric-sm font-mono-metric-sm text-secondary shrink-0">API</span>
      <span className="font-mono-metric-sm font-mono-metric-sm text-on-surface-variant truncate flex-1 min-w-0">
        {event.endpoint?.replace("/v2", "") || "unknown"}
      </span>
      <span className="font-mono-metric-sm font-mono-metric-sm text-tertiary shrink-0">
        {event.creditsUsed ?? 1} kr
      </span>
    </div>
  );
}
