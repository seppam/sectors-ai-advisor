"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import type { GlossaryTerm } from "@/lib/types";

interface GlossaryPanelProps {
  term: GlossaryTerm | null;
  onClose: () => void;
  language?: "id" | "en";
}

/* ──────────────────────────────────────────────────────────
   Glossary data (inline fallback — same as page.tsx GLOSSARY)
   ────────────────────────────────────────────────────────── */

const GLOSSARY_FALLBACK: Record<string, { formula: string; benchmark: string }> = {
  pbv: {
    formula: "Harga Saham ÷ Nilai Buku per Saham (BVPS)",
    benchmark: "IDX Banking Average: 1.8x – 2.5x | Premium: >4.0x",
  },
  roe: {
    formula: "(Laba Bersih ÷ Total Ekuitas) × 100%",
    benchmark: "IDX Standard: >10% | Top Tier Banking: >18%",
  },
  npl: {
    formula: "(Total Kredit Macet ÷ Total Penyaluran Kredit) × 100%",
    benchmark: "Batas Aman Regulator OJK: <5.0% | Unggulan: <2.0%",
  },
};

/* ──────────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────────── */

export default function GlossaryPanel({ term, onClose, language = "id" }: GlossaryPanelProps) {
  useEffect(() => {
    if (term) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [term]);

  if (!term) return null;

  const label = language === "id" ? term.label_id : term.label_en;
  const definition = language === "id" ? term.definition_id : term.definition_en;
  const glossaryTitle = language === "id" ? "Glosarium Finansial" : "Financial Glossary";
  const formulaLabel = language === "id" ? "Rumus Kalkulasi" : "Calculation Formula";
  const benchmarkLabel = language === "id" ? "Tolok Ukur (Benchmark)" : "Benchmark Reference";
  const understandLabel = language === "id" ? "Mengerti & Lanjutkan Obrolan" : "Got it, Continue Chat";

  const fallback = GLOSSARY_FALLBACK[term.slug] ?? { formula: term.formula, benchmark: term.goodThreshold ?? "" };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: 1 }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed bottom-0 inset-x-0 z-50",
          "bg-surface-container rounded-t-3xl p-margin shadow-2xl",
          "flex flex-col gap-space-md max-w-lg mx-auto",
          "transition-transform duration-300",
          "translate-y-0"
        )}
      >
        {/* Drag handle */}
        <div className="w-12 h-1.5 bg-outline-variant rounded-full mx-auto self-center" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">menu_book</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">
                {glossaryTitle}
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface">{label}</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={cn(
              "w-9 h-9 rounded-full bg-surface-container-high",
              "text-on-surface-variant hover:text-on-surface",
              "flex items-center justify-center active:scale-90 transition-all"
            )}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-space-sm">
          {/* Definition */}
          <p className="font-body-md font-body-md text-on-surface-variant leading-relaxed">
            {definition}
          </p>

          {/* Formula box */}
          <div className="p-space-sm rounded-lg bg-surface-container-lowest flex flex-col gap-1">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              {formulaLabel}
            </span>
            <code className="font-mono-metric font-mono-metric text-secondary font-medium">
              {fallback.formula || term.formula}
            </code>
          </div>

          {/* Benchmark box */}
          {fallback.benchmark && (
            <div className="p-space-sm rounded-lg bg-surface-container-high flex flex-col gap-1">
              <span className="font-label-caps text-label-caps text-tertiary uppercase font-semibold">
                {benchmarkLabel}
              </span>
              <p className="font-body-sm font-body-sm text-on-surface">
                {fallback.benchmark}
              </p>
            </div>
          )}

          {/* Good/Bad thresholds from the term itself */}
          {term.goodThreshold && (
            <div className="p-space-sm rounded-lg bg-surface-container flex flex-col gap-1">
              <span className="font-label-caps text-label-caps text-primary uppercase">
                {language === "id" ? "✓ Indikator Positif" : "✓ Positive Indicator"}
              </span>
              <p className="font-body-sm font-body-sm text-on-surface">{term.goodThreshold}</p>
            </div>
          )}
          {term.badThreshold && (
            <div className="p-space-sm rounded-lg bg-surface-container flex flex-col gap-1">
              <span className="font-label-caps text-label-caps text-tertiary uppercase">
                {language === "id" ? "⚠ Perhatian" : "⚠ Caution"}
              </span>
              <p className="font-body-sm font-body-sm text-on-surface">{term.badThreshold}</p>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "w-full py-3 rounded-xl bg-primary text-on-primary",
            "font-title-sm font-title-sm font-semibold",
            "active:scale-[0.98] transition-transform"
          )}
        >
          {understandLabel}
        </button>
      </div>
    </>
  );
}
