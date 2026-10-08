"use client";

import { cn } from "@/lib/utils";
import type { Conversation } from "@/lib/store";

interface HistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeId: string | null;
  language: "id" | "en";
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

function relativeDay(ts: number, language: "id" | "en"): string {
  const days = Math.floor((Date.now() - ts) / 86_400_000);
  if (days <= 0) return language === "id" ? "Hari ini" : "Today";
  if (days === 1) return language === "id" ? "Kemarin" : "Yesterday";
  return language === "id" ? `${days} hari lalu` : `${days} days ago`;
}

export default function HistoryDrawer({
  open, onClose, conversations, activeId, language, onSelect, onDelete, onNew,
}: HistoryDrawerProps) {
  const sorted = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden
      />
      <aside
        data-testid="history-drawer"
        aria-label={language === "id" ? "Riwayat obrolan" : "Chat history"}
        className={cn(
          "fixed top-0 bottom-0 left-0 z-[61] w-[82%] max-w-sm flex flex-col",
          "bg-surface-container-low border-r border-outline-variant/50 transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-4 h-14 shrink-0 border-b border-outline-variant/40">
          <span className="font-semibold text-on-surface">
            {language === "id" ? "Riwayat obrolan" : "Chat history"}
          </span>
          <button type="button" onClick={onClose} aria-label="Close" className="text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-3 shrink-0">
          <button
            type="button"
            data-testid="new-chat"
            onClick={() => { onNew(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-primary text-on-primary py-2.5 font-semibold active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            {language === "id" ? "Obrolan baru" : "New chat"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
          {sorted.length === 0 && (
            <p className="text-center text-on-surface-variant text-body-sm px-4 py-8">
              {language === "id" ? "Belum ada riwayat. Mulai bertanya!" : "No history yet. Start asking!"}
            </p>
          )}
          {sorted.map((c) => (
            <div
              key={c.id}
              className={cn(
                "group flex items-center gap-2 rounded-xl px-3 py-2.5",
                c.id === activeId ? "bg-primary/15" : "hover:bg-surface-container-high"
              )}
            >
              <button
                type="button"
                onClick={() => { onSelect(c.id); onClose(); }}
                className="flex-1 min-w-0 text-left"
              >
                <div className="truncate text-on-surface text-body-md">{c.title}</div>
                <div className="text-label-caps text-on-surface-variant">{relativeDay(c.updatedAt, language)}</div>
              </button>
              <button
                type="button"
                onClick={() => onDelete(c.id)}
                aria-label={language === "id" ? "Hapus obrolan" : "Delete chat"}
                className="text-on-surface-variant hover:text-error shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
