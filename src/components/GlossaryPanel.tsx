"use client";

import { useEffect } from "react";
import type { GlossaryTerm } from "@/lib/types";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

interface Props {
  term: GlossaryTerm | null;
  onClose: () => void;
  language: Locale;
}

export default function GlossaryPanel({ term, onClose, language }: Props) {
  const strings = t(language);

  useEffect(() => {
    if (term) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [term]);

  if (!term) return null;

  const label = language === "id" ? term.label_id : term.label_en;
  const definition = language === "id" ? term.definition_id : term.definition_en;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        <div className="bg-slate-900 border-t border-slate-700 rounded-t-2xl shadow-2xl max-h-[70vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-slate-900 border-b border-slate-700/50 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-teal-400/15 border border-teal-400/40 rounded px-2 py-0.5 text-xs font-semibold text-teal-300">
                {label}
              </div>
              <span className="text-xs text-slate-500">{strings.glossary}</span>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Definition */}
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                {language === "id" ? "Penjelasan" : "Definition"}
              </p>
              <p className="text-sm text-slate-200 leading-relaxed">{definition}</p>
            </div>

            {/* Formula */}
            {term.formula && (
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                  {language === "id" ? "Rumus" : "Formula"}
                </p>
                <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 font-mono text-xs text-teal-300">
                  {term.formula}
                </div>
              </div>
            )}

            {/* Good/Bad thresholds */}
            {(term.goodThreshold || term.badThreshold) && (
              <div className="grid grid-cols-1 gap-2">
                {term.goodThreshold && (
                  <div className="bg-green-400/5 border border-green-400/20 rounded-lg px-3 py-2">
                    <p className="text-xs text-green-400 font-medium mb-0.5">
                      ✅ {language === "id" ? "Tanda Bagus" : "Good Sign"}
                    </p>
                    <p className="text-xs text-slate-300">{term.goodThreshold}</p>
                  </div>
                )}
                {term.badThreshold && (
                  <div className="bg-red-400/5 border border-red-400/20 rounded-lg px-3 py-2">
                    <p className="text-xs text-red-400 font-medium mb-0.5">
                      ⚠️ {language === "id" ? "Perlu Perhatian" : "Caution"}
                    </p>
                    <p className="text-xs text-slate-300">{term.badThreshold}</p>
                  </div>
                )}
              </div>
            )}

            {/* Source */}
            <div className="pt-2 border-t border-slate-800">
              <p className="text-[10px] text-slate-600">
                {language === "id"
                  ? "📊 Data dari Sectors API · Bukan rekomendasi investasi"
                  : "📊 Data from Sectors API · Not investment advice"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
