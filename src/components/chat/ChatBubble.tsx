"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────
   Types
   ────────────────────────────────────────────────────────── */

export interface MetricCard {
  label: string;
  value: string;
  reference?: string;
  termSlug?: string;
}

export interface StockSnapshot {
  ticker: string;
  companyName: string;
  price: string;
  change?: string;
  changeValue?: string;
  isPositive?: boolean;
  metrics: MetricCard[];
  range52wLow?: string;
  range52wHigh?: string;
  range52wPercent?: number;
}

export interface TermPill {
  label: string;
  slug: string;
  color?: "primary" | "secondary" | "on-surface";
}

export interface ChatBubbleProps {
  role: "user" | "assistant";
  /** Primary content — plain text or LLM response */
  content: string;
  timestamp: number;
  /** Assistant-only: AI model identifier */
  modelLabel?: string;
  /** Assistant-only: latency (e.g. "380ms") */
  latency?: string;
  /** Assistant-only: Konsensus Valuasi badge text */
  valuationBadge?: string;
  /** Assistant-only: parsed stock snapshot */
  stockSnapshot?: StockSnapshot;
  /** Assistant-only: interactive term pills */
  termPills?: TermPill[];
  onTermClick?: (slug: string) => void;
  onWatchlistClick?: (ticker: string) => void;
  onAction?: (action: "like" | "dislike" | "copy", content: string) => void;
  language?: "id" | "en";
}

/* ──────────────────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────────────────── */

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });
}

/**
 * Renders markdown with inline [TERM:slug:label] chips.
 * Two-pass approach:
 *  1. Escape [TERM:...] markers so ReactMarkdown ignores them
 *  2. Render markdown to HTML string
 *  3. Restore markers and convert to clickable buttons
 */
function ReactMarkdownWithChips({
  content,
  onTermClick,
}: {
  content: string;
  onTermClick?: (slug: string) => void;
}) {
  // Escape [TERM:slug:label] so ReactMarkdown doesn't parse them
  const escaped = content.replace(/\[TERM:([^:]+):([^\]]+)\]/g, "__TERM_$1_$2__");
  // Then restore and convert to React elements
  const finalParts: React.ReactNode[] = [];
  const regex = /__TERM_([^_]+)_([^_]+)__/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null = null;

  while ((match = regex.exec(escaped)) !== null) {
    const before = escaped.slice(lastIndex, match.index);
    if (before) finalParts.push(<ReactMarkdown key={`md_${lastIndex}`} remarkPlugins={[remarkGfm]}>{before}</ReactMarkdown>);
    finalParts.push(
      <button
        key={`chip_${match!.index}`}
        type="button"
        onClick={() => onTermClick?.(match![1])}
        className="inline-flex items-center gap-0.5 mx-0.5 bg-surface-container-high hover:bg-surface-bright text-primary rounded px-1.5 py-0.5 font-mono-metric-sm font-semibold cursor-pointer transition-all active:scale-95"
      >
        <span>{match![2]}</span>
        <span className="material-symbols-outlined text-[13px]">help_outline</span>
      </button>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < escaped.length) {
    finalParts.push(<ReactMarkdown key={`md_${lastIndex}`} remarkPlugins={[remarkGfm]}>{escaped.slice(lastIndex)}</ReactMarkdown>);
  }

  return <>{finalParts}</>;
}

/** Render plain text content, converting [TERM:slug:label] tokens to clickable pills */
function renderContentWithTerms(
  content: string,
  onTermClick?: (slug: string) => void
): React.ReactNode[] {
  const regex = /\[TERM:([^:]+):([^\]]+)\]/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const m = match;
    if (m.index > lastIndex) {
      parts.push(
        <span key={key++} className="whitespace-pre-wrap">
          {content.slice(lastIndex, m.index)}
        </span>
      );
    }
    parts.push(
      <button
        key={key++}
        type="button"
        onClick={() => onTermClick?.(m[1])}
        className="inline-flex items-center gap-0.5 mx-0.5 bg-surface-container-high hover:bg-surface-bright text-primary rounded px-1.5 py-0.5 font-mono-metric-sm font-semibold cursor-pointer transition-all active:scale-95"
      >
        <span>{m[2]}</span>
        <span className="material-symbols-outlined text-[13px]">help_outline</span>
      </button>
    );
    lastIndex = m.index + m[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(
      <span key={key++} className="whitespace-pre-wrap">
        {content.slice(lastIndex)}
      </span>
    );
  }

  return parts.length > 0 ? parts : [<span key={0} className="whitespace-pre-wrap">{content}</span>];
}

/* ──────────────────────────────────────────────────────────
   User Bubble
   ────────────────────────────────────────────────────────── */

function UserBubble({ content, timestamp }: { content: string; timestamp: number }) {
  return (
    <div className="flex flex-col items-end gap-1.5 self-end max-w-[85%]">
      <div
        className="p-space-md bg-primary-container text-on-primary-container rounded-2xl rounded-tr-none shadow-md"
        style={{ boxShadow: "0 4px 12px rgba(0,212,170,0.10)" }}
      >
        <p className="font-body-md text-[#00382b] font-medium whitespace-pre-wrap">{content}</p>
      </div>
      <div className="flex items-center gap-1.5 px-1">
        <span className="font-label-caps text-label-caps text-on-surface-variant">
          {formatTime(timestamp)} WIB
        </span>
        <span className="material-symbols-outlined text-[13px] text-primary">done_all</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Assistant Bubble
   ────────────────────────────────────────────────────────── */

function AssistantBubble({
  content,
  timestamp,
  modelLabel = "Sectors Equity Intelligence",
  latency,
  valuationBadge,
  stockSnapshot,
  termPills,
  onTermClick,
  onWatchlistClick,
  onAction,
  language = "id",
}: {
  content: string;
  timestamp: number;
  modelLabel?: string;
  latency?: string;
  valuationBadge?: string;
  stockSnapshot?: StockSnapshot;
  termPills?: TermPill[];
  onTermClick?: (slug: string) => void;
  onWatchlistClick?: (ticker: string) => void;
  onAction?: (action: "like" | "dislike" | "copy", content: string) => void;
  language?: "id" | "en";
}) {
  const hasStructuredData = !!stockSnapshot || !!valuationBadge || (termPills && termPills.length > 0);

  return (
    <div className="flex flex-col items-start gap-space-sm max-w-full w-full">
      {/* AI Identifier strip */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-surface-container-high flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[14px]">auto_awesome</span>
        </div>
        <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">
          {modelLabel}
        </span>
        <span className="w-1 h-1 rounded-full bg-on-surface-variant" />
        {latency && (
          <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface-variant">
            ⚡ {latency}
          </span>
        )}
      </div>

      {/* Main bubble — either structured (Stitch design) or plain text (backward compat) */}
      {hasStructuredData ? (
        <StructuredBubble
          content={content}
          valuationBadge={valuationBadge}
          stockSnapshot={stockSnapshot}
          termPills={termPills}
          onTermClick={onTermClick}
          onWatchlistClick={onWatchlistClick}
          onAction={onAction}
          language={language}
        />
      ) : (
        <PlainTextBubble content={content} onTermClick={onTermClick} onAction={onAction} language={language} />
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Structured Bubble (Stitch design for AI responses with data)
   ────────────────────────────────────────────────────────── */

function StructuredBubble({
  content,
  valuationBadge,
  stockSnapshot,
  termPills,
  onTermClick,
  onWatchlistClick,
  onAction,
  language = "id",
}: {
  content: string;
  valuationBadge?: string;
  stockSnapshot?: StockSnapshot;
  termPills?: TermPill[];
  onTermClick?: (slug: string) => void;
  onWatchlistClick?: (ticker: string) => void;
  onAction?: (action: "like" | "dislike" | "copy", content: string) => void;
  language?: "id" | "en";
}) {
  return (
    <div className="w-full p-space-md rounded-2xl rounded-tl-none bg-surface-container shadow-md flex flex-col gap-space-md relative overflow-hidden">
      {/* Glow edge */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80 pointer-events-none" />

      {/* Konsensus Valuasi Badge */}
      {valuationBadge && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-high">
          <span className="material-symbols-outlined text-tertiary text-[20px]">balance</span>
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              {language === "id" ? "Konsensus Valuasi" : "Valuation Consensus"}
            </span>
            <span className="font-title-sm text-title-sm text-tertiary">{valuationBadge}</span>
          </div>
        </div>
      )}

      {/* Conversational text */}
      {content && (
        <p className="font-body-md text-body-md text-on-surface leading-relaxed">
          {renderContentWithTerms(content, onTermClick)}
        </p>
      )}

      {/* Stock Snapshot */}
      {stockSnapshot && (
        <StockSnapshotCard
          snapshot={stockSnapshot}
          onTermClick={onTermClick}
          language={language}
        />
      )}

      {/* Term Pills */}
      {termPills && termPills.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">
            {language === "id" ? "Metrik Finansial Relevan (Klik untuk Penjelasan)" : "Relevant Financial Metrics (Tap to Learn)"}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {termPills.map((pill) => (
              <button
                key={pill.slug}
                type="button"
                onClick={() => onTermClick?.(pill.slug)}
                className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high hover:bg-surface-bright active:scale-95 transition-all",
                  pill.color === "secondary" && "text-secondary",
                  pill.color === "on-surface" && "text-on-surface",
                  (!pill.color || pill.color === "primary") && "text-primary"
                )}
              >
                <span className="font-mono-metric-sm text-mono-metric-sm font-semibold">{pill.label}</span>
                <span className="material-symbols-outlined text-[13px]">help_outline</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="pt-2 flex items-start gap-1.5 opacity-75">
        <span className="material-symbols-outlined text-[14px] text-on-surface-variant shrink-0 mt-0.5">verified_user</span>
        <p className="font-label-caps text-label-caps text-on-surface-variant leading-relaxed">
          {language === "id"
            ? "Data dikalkulasi real-time via IDX API. Analisis ini bersifat riset algoritmik murni dan bukan merupakan ajakan maupun anjuran mutlak jual/beli instrumen investasi."
            : "Data calculated in real-time via IDX API. This analysis is purely algorithmic research and does not constitute a recommendation to buy or sell any investment instrument."}
        </p>
      </div>

      {/* Action row */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onAction?.("like", content)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-primary active:scale-90 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">thumb_up</span>
          </button>
          <button
            type="button"
            onClick={() => onAction?.("dislike", content)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-primary active:scale-90 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">thumb_down</span>
          </button>
          <button
            type="button"
            onClick={() => onAction?.("copy", content)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-primary active:scale-90 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
          </button>
        </div>
        {stockSnapshot && (
          <button
            type="button"
            onClick={() => onWatchlistClick?.(stockSnapshot.ticker)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-high text-on-surface hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">bookmark_add</span>
            <span className="font-label-caps text-label-caps font-semibold">
              {language === "id" ? "Pantau" : "Watch"} {stockSnapshot.ticker}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Plain text bubble (backward compatible with existing page.tsx)
   ────────────────────────────────────────────────────────── */

function PlainTextBubble({
  content,
  onTermClick,
  onAction,
  language = "id",
}: {
  content: string;
  onTermClick?: (slug: string) => void;
  onAction?: (action: "like" | "dislike" | "copy", content: string) => void;
  language?: "id" | "en";
}) {
  return (
    <div className="max-w-[85%] bg-surface-container rounded-2xl rounded-tl-none px-space-md py-space-md shadow-md">
      {/* Render text with inline term chips, then pass through markdown */}
      <div className="font-body-md text-body-md text-on-surface leading-relaxed">
        {/* Two-pass: 1) Render markdown to HTML string, 2) substitute [TERM:slug:label] chips */}
        <ReactMarkdownWithChips content={content} onTermClick={onTermClick} />
      </div>

      {/* Action row */}
      <div className="flex items-center gap-1 mt-space-sm pt-space-sm border-t border-outline-variant">
        <button
          type="button"
          onClick={() => onAction?.("like", content)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-primary active:scale-90 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">thumb_up</span>
        </button>
        <button
          type="button"
          onClick={() => onAction?.("dislike", content)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-primary active:scale-90 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">thumb_down</span>
        </button>
        <button
          type="button"
          onClick={() => onAction?.("copy", content)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-primary active:scale-90 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">content_copy</span>
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Stock Snapshot Card
   ────────────────────────────────────────────────────────── */

function StockSnapshotCard({
  snapshot,
  onTermClick,
  language = "id",
}: {
  snapshot: StockSnapshot;
  onTermClick?: (slug: string) => void;
  language?: "id" | "en";
}) {
  const { ticker, companyName, price, change, isPositive = true, metrics, range52wLow, range52wHigh, range52wPercent } = snapshot;

  return (
    <div className="w-full rounded-xl bg-surface-container-low p-space-md flex flex-col gap-space-sm shadow-inner">
      {/* Header row */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono-metric font-bold">
            {ticker}
          </span>
          <span className="font-body-sm font-body-sm text-on-surface-variant">{companyName}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-mono-metric font-mono-metric text-on-surface font-bold">{price}</span>
          {change && (
            <div className={cn("flex items-center gap-0.5", isPositive ? "text-primary" : "text-danger")}>
              <span className="material-symbols-outlined text-[13px]">
                {isPositive ? "arrow_drop_up" : "arrow_drop_down"}
              </span>
              <span className="font-mono-metric-sm font-mono-metric-sm font-semibold">{change}</span>
            </div>
          )}
        </div>
      </div>

      {/* Metric grid */}
      {metrics.length > 0 && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          {metrics.map((metric, i) => (
            <div key={i} className="p-2 rounded-lg bg-surface-container flex flex-col">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-on-surface-variant">{metric.label}</span>
                {metric.termSlug && (
                  <button
                    type="button"
                    onClick={() => onTermClick?.(metric.termSlug!)}
                    className="flex items-center text-primary hover:text-secondary"
                  >
                    <span className="material-symbols-outlined text-[14px]">info</span>
                  </button>
                )}
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-mono-metric text-mono-metric text-tertiary font-bold">{metric.value}</span>
                {metric.reference && (
                  <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface-variant">
                    {metric.reference}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 52-week range */}
      {(range52wLow || range52wHigh) && range52wPercent !== undefined && (
        <div className="pt-1 flex items-center justify-between">
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            {language === "id" ? "Rentang 52 Minggu" : "52-Week Range"}
          </span>
          <div className="flex items-center gap-2 flex-1 max-w-[190px]">
            {range52wLow && (
              <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface-variant">{range52wLow}</span>
            )}
            <div className="relative flex-1 h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
              <div
                className="absolute left-0 top-0 bottom-0 bg-primary rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, range52wPercent))}%` }}
              />
            </div>
            {range52wHigh && (
              <span className="font-mono-metric-sm text-mono-metric-sm text-on-surface">{range52wHigh}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Default export — ChatBubble
   ────────────────────────────────────────────────────────── */

export default function ChatBubble({ role, content, timestamp, ...rest }: ChatBubbleProps) {
  if (role === "user") {
    return <UserBubble content={content} timestamp={timestamp} />;
  }
  return <AssistantBubble content={content} timestamp={timestamp} {...rest} />;
}
