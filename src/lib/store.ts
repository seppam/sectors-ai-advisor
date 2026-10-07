// ============================================================
// Global State Store — Zustand + localStorage persistence
// ====================================================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Settings, ChatMessage, WatchlistItem } from "./types";

// ============================================================
// Utilities
// ============================================================

/** P2-4: Generate a stable UUID, with fallback for non-secure contexts (HTTP).
 *  crypto.randomUUID() throws on non-secure origins (no TLS).
 */
export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    try {
      return crypto.randomUUID();
    } catch {
      // Fall through to fallback
    }
  }
  // Fallback: timestamp + random string
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ============================================================
// Settings Store
// ============================================================

interface SettingsState {
  settings: Settings;
  isOnboarded: boolean;
  // Actions
  updateSettings: (partial: Partial<Settings>) => void;
  completeOnboarding: () => void;
  resetAll: () => void;
}

const DEFAULT_SETTINGS: Settings = {
  sectorsApiKey: "",
  llm: { provider: "deepseek", apiKey: "", customBaseUrl: "", customModel: "" },
  language: "id",
  disclaimerAgreed: false,
  sectors: [],
  dailyBriefEnabled: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      isOnboarded: false,

      updateSettings: (partial) =>
        set((state) => ({
          settings: { ...state.settings, ...partial },
        })),

      completeOnboarding: () => set({ isOnboarded: true }),

      resetAll: () =>
        set({
          settings: DEFAULT_SETTINGS,
          isOnboarded: false,
        }),
    }),
    { name: "sectors-advisor-settings" }
  )
);

// ============================================================
// Chat Store
// ============================================================

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  // Actions
  addMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  updateLastMessage: (content: string, citations?: ChatMessage['citations']) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      isLoading: false,

      addMessage: (msg) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...msg,
              id: generateId(),
              timestamp: Date.now(),
            },
          ],
        })),

      updateLastMessage: (content, citations) =>
        set((state) => {
          const msgs = [...state.messages];
          if (msgs.length > 0) {
            msgs[msgs.length - 1] = {
              ...msgs[msgs.length - 1],
              content,
              ...(citations !== undefined ? { citations } : {}),
            };
          }
          return { messages: msgs };
        }),

      clearMessages: () => set({ messages: [] }),
    }),
    { name: "sectors-advisor-chat" }
  )
);

// ============================================================
// Watchlist Store
// ============================================================

interface WatchlistState {
  items: WatchlistItem[];
  // Actions
  addItem: (item: WatchlistItem) => void;
  removeItem: (symbol: string) => void;
  clearItems: () => void;
  updateAlertThreshold: (symbol: string, threshold: number) => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          if (state.items.find((i) => i.symbol === item.symbol)) return state;
          return { items: [...state.items, item] };
        }),

      removeItem: (symbol) =>
        set((state) => ({
          items: state.items.filter((i) => i.symbol !== symbol),
        })),

      clearItems: () => set({ items: [] }),

      updateAlertThreshold: (symbol, threshold) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.symbol === symbol ? { ...i, alertThreshold: threshold } : i
          ),
        })),
    }),
    { name: "sectors-advisor-watchlist" }
  )
);
