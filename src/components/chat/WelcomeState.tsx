"use client";

import { cn } from "@/lib/utils";

interface WelcomeStateProps {
  language?: "id" | "en";
  onExampleClick?: (question: string) => void;
}

const EXAMPLES_ID = [
  "Apa itu PBV dan ROE?",
  "BBCA harganya udah mahal belum?",
  "Bandingkan BBCA dan BBRI",
  "Top gainers hari ini",
];

const EXAMPLES_EN = [
  "What are PBV and ROE?",
  "Is BBCA overpriced right now?",
  "Compare BBCA vs BBRI fundamentals",
  "Today's top gainers",
];

export default function WelcomeState({ language = "id", onExampleClick }: WelcomeStateProps) {
  const examples = language === "id" ? EXAMPLES_ID : EXAMPLES_EN;

  return (
    <div className="flex flex-col items-center justify-center py-10 gap-5 text-center px-margin">
      {/* Icon */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="" width={64} height={64} className="w-16 h-16 rounded-2xl shadow-elevated" />

      {/* Title */}
      <div>
        <h2 className="font-headline-xl-mobile text-on-surface mb-1">
          {language === "id" ? "Sectors AI Advisor" : "Sectors AI Advisor"}
        </h2>
        <p className="font-body-sm font-body-sm text-on-surface-variant max-w-sm">
          {language === "id"
            ? "Tanyakan tentang saham, rasio keuangan, atau sektor Indonesia."
            : "Ask about stocks, financial ratios, or Indonesian sectors."}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {[
            language === "id" ? "Data live Sectors API" : "Live Sectors API data",
            language === "id" ? "Istilah dijelaskan" : "Terms explained",
            language === "id" ? "Tanpa eksekusi transaksi" : "No trade execution",
          ].map((label) => (
            <span
              key={label}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-primary bg-primary/10 border border-primary/25"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Example question cards */}
      <div className="w-full max-w-lg flex flex-col gap-space-sm">
        <p className="font-label-caps text-label-caps text-on-surface-variant text-left uppercase tracking-wider">
          {language === "id" ? "Contoh pertanyaan" : "Example questions"}
        </p>
        {examples.map((q, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onExampleClick?.(q)}
            className="w-full text-left group"
          >
            <div
              className={cn(
                "flex items-start gap-3 p-space-md rounded-xl",
                "bg-surface-container border border-outline-variant",
                "hover:border-primary/40 hover:bg-surface-container-high",
                "transition-all duration-150 active:scale-[0.98]"
              )}
            >
              {/* Number badge */}
              <span
                className={cn(
                  "flex-shrink-0 w-6 h-6 rounded-full",
                  "bg-primary/15 border border-primary/30",
                  "flex items-center justify-center",
                  "mt-0.5"
                )}
              >
                <span className="font-mono-metric-sm font-mono-metric-sm font-bold text-primary">
                  {i + 1}
                </span>
              </span>
              <span className="font-body-sm font-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors leading-relaxed">
                &ldquo;{q}&rdquo;
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Hint */}
      <p className="font-label-caps text-label-caps text-on-surface-variant">
        {language === "id"
          ? "Klik pertanyaan di atas atau ketik sendiri di bawah"
          : "Tap a question above or type your own below"}
      </p>
    </div>
  );
}
