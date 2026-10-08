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

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

interface ChatState {
  /** Messages of the active conversation */
  messages: ChatMessage[];
  conversations: Conversation[];
  activeId: string | null;
  isLoading: boolean;
  // Actions
  addMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  updateLastMessage: (content: string, citations?: ChatMessage['citations']) => void;
  clearMessages: () => void;
  newConversation: () => void;
  switchConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
}

/** Auto-title: first user message, trimmed to a short single line. */
export function makeTitle(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > 42 ? clean.slice(0, 40).trimEnd() + "…" : clean || "Obrolan baru";
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      conversations: [],
      activeId: null,
      isLoading: false,

      addMessage: (msg) =>
        set((state) => {
          const full: ChatMessage = { ...msg, id: generateId(), timestamp: Date.now() };
          const messages = [...state.messages, full];
          const now = Date.now();
          let activeId = state.activeId;
          let conversations = state.conversations;
          if (!activeId || !conversations.some((c) => c.id === activeId)) {
            activeId = generateId();
            const firstUser = messages.find((m) => m.role === "user");
            conversations = [
              {
                id: activeId,
                title: makeTitle(firstUser?.content ?? ""),
                messages,
                createdAt: now,
                updatedAt: now,
              },
              ...conversations,
            ];
          } else {
            conversations = conversations.map((c) =>
              c.id === activeId
                ? {
                    ...c,
                    messages,
                    updatedAt: now,
                    title:
                      c.messages.length === 0 && msg.role === "user"
                        ? makeTitle(msg.content)
                        : c.title,
                  }
                : c
            );
          }
          return { messages, activeId, conversations };
        }),

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
          return {
            messages: msgs,
            conversations: state.conversations.map((c) =>
              c.id === state.activeId ? { ...c, messages: msgs } : c
            ),
          };
        }),

      clearMessages: () => set({ messages: [], conversations: [], activeId: null }),

      newConversation: () => set({ messages: [], activeId: null }),

      switchConversation: (id) =>
        set((state) => {
          const c = state.conversations.find((x) => x.id === id);
          return c ? { activeId: id, messages: c.messages } : state;
        }),

      deleteConversation: (id) =>
        set((state) => {
          const conversations = state.conversations.filter((c) => c.id !== id);
          return state.activeId === id
            ? { conversations, activeId: null, messages: [] }
            : { conversations };
        }),
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
