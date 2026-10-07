"use client";

import { useState, useRef, useEffect } from "react";
import { resolveModel } from "@/lib/llmProviders";
import { useSettingsStore } from "@/lib/store";
import { useChatStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { callLLM, checkGuardrail } from "@/lib/llmProviders";
import {
  screenCompaniesCached,
  getCompanyReportCached,
  getTopMoversCached,
} from "@/lib/sectorsApi";
import { ChatInput, WelcomeState, UsagePanel } from "@/components/chat";
import GlossaryPanel from "@/components/GlossaryPanel";
import { cn } from "@/lib/utils";
import { recordSectorsCall } from "@/lib/usageTracker";
import { GLOSSARY, parseTermChips } from "@/lib/glossary";
import type { GlossaryTerm, SectorsDataRef } from "@/lib/types";

// Inline type to avoid @typescript-eslint/no-explicit-any
interface CompanyReportData {
  summary?: unknown;
  financials?: unknown;
  data?: unknown;
}

// Common IDX tickers so lowercase input ("bbca") is still recognised.
const KNOWN_TICKERS = new Set([
  "BBCA", "BBRI", "BMRI", "BBNI", "BRIS", "BTPN", "TLKM", "ASII", "UNVR", "ICBP",
  "INDF", "GOTO", "BUKA", "ANTM", "ADRO", "PTBA", "MDKA", "AMRT", "KLBF", "CPIN",
  "EXCL", "ISAT", "SMGR", "INTP", "PGAS", "MAPI", "ACES", "HMSP", "GGRM", "BYAN",
]);

// ============================================================
// Main Chat Page
// ============================================================

export default function ChatPage() {
  const language = useSettingsStore((s) => s.settings.language);
  const sectorsApiKey = useSettingsStore((s) => s.settings.sectorsApiKey);
  const llm = useSettingsStore((s) => s.settings.llm);
  const customBaseUrl = useSettingsStore((s) => s.settings.llm.customBaseUrl ?? "");
  const customModel = useSettingsStore((s) => s.settings.llm.customModel ?? "");
  const strings = t(language);

  const { messages, addMessage } = useChatStore();

  const [isLoading, setIsLoading] = useState(false);
  const [glossaryTerm, setGlossaryTerm] = useState<GlossaryTerm | null>(null);
  const [showCitation, setShowCitation] = useState<Record<number, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ============================================================
  // Sectors API query router
  // ============================================================
  async function fetchSectorsData(query: string): Promise<{ data: string; citations: SectorsDataRef[]; endpoints?: string[] }> {
    const citations: SectorsDataRef[] = [];
    const q = query.toLowerCase();

    try {
      // ── P1-1: Single-ticker intent detection (BEFORE screener fallback) ──
      const potentialTickers = extractSymbols(query);
      if (potentialTickers.length === 1) {
        const ticker = potentialTickers[0];
        const report = await getCompanyReportCached(sectorsApiKey, ticker, ["summary", "financials"]).catch(() => null);
        if (report?.data && (report.data as CompanyReportData).summary) {
          citations.push(report.refs);
          const data = report.data as CompanyReportData;
          return {
            data: JSON.stringify({ [ticker]: { summary: data.summary, financials: data.financials } }),
            citations,
            endpoints: [report.refs.endpoint],
          };
        }
      }

      if (q.includes("bandingkan") || q.includes("compare") || q.includes("vs")) {
        const symbols = extractSymbols(query);
        if (symbols.length >= 2) {
          const reports = await Promise.all(
            symbols.map((s) => getCompanyReportCached(sectorsApiKey, s, ["summary", "financials"]).catch(() => null))
          );
          const valid = reports.filter((r): r is NonNullable<typeof reports[number]> => r !== null);
          if (valid.length > 0) {
            // Build a proper JSON object keyed by symbol (not string concatenation)
            const compareData: Record<string, CompanyReportData> = {};
            for (let i = 0; i < symbols.length; i++) {
              const sym = symbols[i];
              const report = reports[i];
              if (report?.data) {
                compareData[sym] = report.data as CompanyReportData;
              }
            }
            const formatted = JSON.stringify(compareData);
            citations.push(...valid.map((r) => r.refs));
            return { data: formatted, citations, endpoints: valid.map((r) => r.refs.endpoint) };
          }
        }
      }

      if (q.includes("top gainer") || q.includes("top loser") || q.includes("penguat") || q.includes("pelemahan")) {
        const type = q.includes("loser") || q.includes("pelemahan") ? "top_losers" : "top_gainers";
        const res = await getTopMoversCached(sectorsApiKey, type, "1d", 10);
        citations.push(res.refs);
        return { data: JSON.stringify(res.data, null, 2), citations };
      }

      // Screener fallback — natural language company search
      const res = await screenCompaniesCached(sectorsApiKey, query, 10);
      citations.push(res.refs);
      return { data: JSON.stringify(res.data, null, 2), citations };
    } catch (err: unknown) {
      console.error("Sectors API error:", err);
      // P1-2: Return structured error so the chat UI can show a visible warning
      return {
        data: JSON.stringify({
          _error: true,
          message: "Gagal mengambil data untuk intent \"" + q + "\". Error: " + ((err as Error)?.message || "Unknown"),
          intent: q,
        }),
        citations,
        endpoints: [],
      };
    }
  }

  function extractSymbols(query: string): string[] {
    const NOT_TICKERS = new Set(["SAHAM", "BURSA", "INDO", "GLOBAL", "ASIA", "EROPA", "IDX", "IHSG", "LQ45", "ROE", "PBV", "DER", "ROA", "EPS", "TOP", "APA", "ITU", "DAN", "YANG"]);
    const upper = (query.match(/\b[A-Z]{4}\b/g) ?? []).filter((x) => !NOT_TICKERS.has(x));
    const lower = (query.toLowerCase().match(/\b[a-z]{4}\b/g) ?? [])
      .map((x) => x.toUpperCase())
      .filter((x) => KNOWN_TICKERS.has(x));
    return [...new Set([...upper, ...lower])];
  }

  // ============================================================
  // Submit Handler
  // ============================================================
  async function handleSend(message: string) {
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;

    addMessage({ role: "user", content: trimmed });

    // Guardrails run FIRST — blocked requests never need an API key or any network call.
    const guardrail = checkGuardrail(trimmed, language);
    if (guardrail.triggered) {
      addMessage({ role: "assistant", content: guardrail.response! });
      return;
    }

    if (!llm.apiKey) {
      const msg = language === "id"
        ? "[!] LLM API Key belum diset.\n\nBuka Pengaturan untuk menambahkan API key."
        : "[!] LLM API Key not set.\n\nGo to Settings to add your API key.";
      addMessage({ role: "assistant", content: msg });
      return;
    }

    setIsLoading(true);
    // P3-4: Don't store placeholder message — inline spinner shows loading state.
    // Storing "⏳" caused it to persist in history after reload.

    try {
      const { data: apiData, citations, endpoints } = await fetchSectorsData(trimmed);
      
      // Track Sectors API credit usage for all branches
      if (endpoints && endpoints.length > 0) {
        endpoints.forEach((ep) => recordSectorsCall({ endpoint: ep, userQuery: trimmed }));
      } else {
        // Top-movers and screener also consume API credits
        recordSectorsCall({ endpoint: "/companies/", userQuery: trimmed });
      }
      const recentMessages = messages.slice(-6);
      const historyStr = recentMessages.map((m) => m.role + ": " + m.content).join("\n");

      // Use optimized prompts (smart glossary selection, compressed history, trimmed data)
      // The optimized prompt builder selects only relevant glossary terms based on query keywords
      const response = await callLLM({
        provider: llm.provider,
        apiKey: llm.apiKey,
        ctx: {
          userMessage: trimmed,
          language,
          sectorsApiData: apiData || undefined,
          recentHistory: historyStr || undefined,
        },
        customBaseUrl,
        customModel,
        modelName: resolveModel(llm.provider, undefined, llm.customModel),
      });

      // P1-8: Disclaimer is already in the system prompt — do NOT append programmatically
      const finalText = response.text || "Gagal mendapatkan respons dari AI.";

      addMessage({
        role: "assistant",
        content: finalText,
        citations: citations?.flat() as SectorsDataRef[],
      });
    } catch (err: unknown) {
      const errMsg = (err as Error).message;
      addMessage({
        role: "assistant",
        content: "❌ Gagal mendapatkan respons dari AI.\n\n```\n" + errMsg + "\n```\n",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {/* Welcome */}
        {messages.length === 0 && (
          <WelcomeState
            language={language}
            onExampleClick={handleSend}
          />
        )}

        {/* Chat messages */}
        {messages.map((msg, idx) => (
          <div key={msg.id} className="space-y-2">
            {/* User bubble */}
            {msg.role === "user" && (
              <div className="flex justify-end">
                <div className={cn(
                  "max-w-[80%] rounded-lg rounded-br-sm",
                  "px-4 py-2.5 text-body text-text-primary",
                  "bg-accent/15 border border-accent/20"
                )}>
                  {msg.content}
                </div>
              </div>
            )}

            {/* Assistant bubble */}
            {msg.role === "assistant" && (
              <div className="max-w-[85%]">
                <div className={cn(
                  "bg-bg-secondary border border-border-default",
                  "rounded-lg rounded-bl-sm px-4 py-3",
                  "text-body text-text-primary leading-relaxed",
                  "whitespace-pre-wrap"
                )}>
                  {/* Render term chips */}
                  {parseTermChips(msg.content).map((part, i) =>
                    part.type === "chip" ? (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setGlossaryTerm(GLOSSARY.find((g) => g.slug === part.slug) ?? null)}
                        className={cn(
                          "inline-flex items-center gap-0.5 mx-0.5",
                          "bg-accent/15 hover:bg-accent/25 border border-accent/40",
                          "text-accent rounded px-1.5 py-0.5 text-caption font-semibold",
                          "cursor-pointer transition-colors duration-150"
                        )}
                        title={strings.tapToLearn}
                      >
                        <span>{part.content}</span>
                        <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    ) : (
                      <span key={i}>{part.content}</span>
                    )
                  )}
                </div>

                {/* Citation toggle */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-1">
                    <button
                      type="button"
                      onClick={() => setShowCitation((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                      className="text-caption text-text-muted hover:text-accent transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {showCitation[idx] ? strings.hideSource : strings.viewSource}
                    </button>
                    {showCitation[idx] && (
                      <div className="mt-1 bg-bg-tertiary border border-border-default rounded-lg p-2">
                        {msg.citations.map((c: import("@/lib/types").SectorsDataRef, i: number) => (
                          <div key={i} className="text-caption text-text-muted font-mono truncate">
                            • {c.endpoint} — {c.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-text-tertiary text-body pl-2">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span>{strings.chatThinking}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        disabled={false}
        placeholder={language === "id" ? strings.chatPlaceholder : strings.chatPlaceholderEn}
        isLoading={isLoading}
      />

      {/* Usage Panel — Token & Credit Tracking */}
      <UsagePanel
        modelName={customModel || (llm.provider === "deepseek" ? "deepseek-chat" : llm.provider === "custom" ? "custom" : undefined)}
        sectorsBalance={undefined}  // could be fetched from store
      />

      {/* Glossary Panel */}
      <GlossaryPanel term={glossaryTerm} onClose={() => setGlossaryTerm(null)} language={language} />
    </div>
  );
}
