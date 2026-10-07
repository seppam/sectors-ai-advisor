"use client";

import type { SectorsDataRef } from "@/lib/types";

interface CitationPanelProps {
  citations: SectorsDataRef[];
  isOpen: boolean;
  onToggle: () => void;
}

export default function CitationPanel({ citations, isOpen, onToggle }: CitationPanelProps) {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={onToggle}
        className="text-caption text-text-muted hover:text-accent transition-colors flex items-center gap-1"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {isOpen ? "Hide" : "View Data Source"}
      </button>

      {isOpen && (
        <div className="mt-1 bg-bg-tertiary border border-border-default rounded-lg p-2">
          {citations.map((c, i) => (
            <div key={i} className="text-caption text-text-muted font-mono truncate">
              • {c.endpoint} — {c.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
