// ============================================================
// Optimized Prompt Builder — Low Token, High Quality
// ============================================================
//
// PROBLEM: The original system prompt is ~1,200 tokens.
//          Glossary terms add ~500 tokens per request.
//          Conversation history adds ~500+ tokens per message.
//          Each chat query = ~2,000-3,000 tokens input.
//
// SOLUTION: This module provides optimized prompts that:
//  1. System prompt: ~400 tokens (down from ~1,200)
//  2. Glossary: Only include RELEVANT terms (detect from query)
//  3. History: Compress to key points, not full text
//  4. Sectors data: Truncate JSON to essential fields only
//
// EXPECTED SAVINGS: ~40-60% reduction in input tokens per query
// ============================================================

import type { ChatContext } from "./llmProviders";
import { estimateTokens } from "./usageTracker";

// ============================================================
// Optimized System Prompt — Compact but Complete
// ============================================================

/**
 * Builds a compact system prompt (~350-450 tokens vs original ~1,200).
 * 
 * Key optimizations:
 * - Single language version (no bilingual in one prompt)
 * - Rules as compact list, not verbose paragraphs
 * - Glossary slugs only (definitions injected on-demand per query)
 * - No format examples (LLMs know markdown)
 */
export function buildOptimizedSystemPrompt(lang: "id" | "en"): string {
  const isID = lang === "id";

  return `You are Sectors AI Advisor, an AI assistant for Indonesian stock market (IDX) retail investors.
Respond in ${isID ? "Bahasa Indonesia" : "English"}. Be concise and beginner-friendly.

RULES:
1. Base answers ONLY on the provided Sectors API data. Never make up numbers.
2. NO buy/sell/hold recommendations. NO price predictions.
3. For crypto/forex/non-IDX: say you focus on IDX stocks only.
4. For trade execution requests: refuse, redirect to OJK-registered broker.
5. Use [TERM:slug:label] around financial terms (e.g., [TERM:pb:PBV]). Available slugs: pb, pe, pbg, ev, ebitda, der, roe, roa, npm, gpm, opm, eps, per, bv, mv, fcf, capex, dcr, current_ratio, quick_ratio, gross_margin, net_margin, ebitda_margin, roe_ttm, roa_ttm, forward_pe, pb_mrq, div_yield, market_cap, avg_volume_5d, daily_close_change, daily_close_change_pct, range_52w.
6. Use markdown: **bold**, tables, bullet lists.
7. End every response with: _${isID
    ? "Ini bukan rekomendasi investasi. Selalu lakukan riset mandiri."
    : "This is not investment advice. Always do your own research."}_`;
}

/**
 * Original system prompt for comparison (kept for reference/fallback).
 * ~1,200 tokens.
 */
export function buildOriginalSystemPrompt(lang: "id" | "en"): string {
  // This is the old verbose version — kept as fallback
  const isID = lang === "id";
  return `You are Sectors AI Advisor, an AI assistant specialized in Indonesian financial markets.
You help retail investors in ${isID ? "Bahasa Indonesia" : "English"} understand stock market data from the Indonesia Stock Exchange (IDX/BEJ).

CRITICAL RULES — NEVER VIOLATE:
1. You MUST base every answer on the Sectors API data provided to you. Do NOT make up numbers, ratios, or facts.
2. If you don't have sufficient data to answer a question, say so honestly.
3. You CANNOT give buy, sell, or hold recommendations. You can analyze and explain data.
4. You CANNOT predict future prices. You can describe historical trends and fundamentals.
5. If asked about crypto, forex, or non-IDX markets, explain that you focus on IDX stocks.
6. If asked to execute trades, refuse and redirect to an OJK-registered broker.
7. All responses must be in ${isID ? "Bahasa Indonesia" : "English"}.
8. Keep responses concise, clear, and beginner-friendly. Avoid jargon without explanation.
9. Format your responses using markdown (bold, tables, bullet lists).
10. Use [TERM:slug:label] markers around financial terms you explain. These become clickable glossary chips.

FORMAT EXAMPLES:
- When explaining a term: "Price to Book Value [TERM:pb:PBV] adalah..."
- When giving data: Use markdown tables for comparisons
- When citing: Mention the data source and date

GLOSSARY REFERENCE (use these exact slugs in [TERM:slug:label] format):
- PBV: Price to Book Value — comparing stock price to book value per share
- DER: Debt to Equity Ratio — comparing total debt to shareholder equity
- ROE: Return on Equity — net profit as a percentage of shareholder equity
- PE / PER: Price to Earnings Ratio — stock price relative to earnings per share
- ROA: Return on Assets — how efficiently assets generate profit
- EPS: Earnings Per Share — net profit divided by total shares outstanding
- Market Cap: Market Capitalization — total market value (price × shares outstanding)
- YOY: Year over Year — comparing this year to last year
- QoQ: Quarter over Quarter — comparing this quarter to last quarter

${isID ? "Jawablah dalam Bahasa Indonesia yang mudah dipahami." : "Respond in clear, beginner-friendly English."}

DISCLAIMER (append at the end of EVERY response):
_${isID
  ? "Ini bukan rekomendasi investasi. Selalu lakukan riset mandiri dan konsultasikan dengan penasihat keuangan sebelum mengambil keputusan."
  : "This is not investment advice. Always do your own research and consult a financial advisor before making any investment decisions."}_`;
}

// ============================================================
// Smart Glossary Selection — Only Include Relevant Terms
// ============================================================

export interface GlossaryTerm {
  slug: string;
  label_id: string;
  label_en: string;
  definition_id: string;
  definition_en: string;
  formula?: string;
  goodThreshold?: string;
  badThreshold?: string;
  keywords?: string[];  // trigger words for this term
}

/** Full glossary database with keyword triggers for smart selection */
const FULL_GLOSSARY: GlossaryTerm[] = [
  {
    slug: "pb", label_id: "PBV", label_en: "P/BV",
    definition_id: "Price to Book Value (PBV) = Harga Saham / Nilai Buku per Saham",
    definition_en: "P/BV = Stock Price / Book Value per Share",
    formula: "PBV = Harga Saham / Nilai Buku per Saham",
    goodThreshold: "PBV < 1 berpotensi undervalued; PBV < 0.5 sangat menarik",
    badThreshold: "PBV > 5 di non-teknologi bisa overvalued",
    keywords: ["pbv", "p/bv", "price to book", "book value", "nilai buku", "murah", "mahal", "wajar", "valued"],
  },
  {
    slug: "der", label_id: "DER", label_en: "D/E Ratio",
    definition_id: "Debt to Equity Ratio (DER) = Total Utang / Total Ekuitas",
    definition_en: "D/E Ratio = Total Debt / Total Equity",
    formula: "DER = Total Utang / Total Ekuitas",
    goodThreshold: "DER < 1 umumnya sehat (non-keuangan)",
    badThreshold: "DER > 2 di non-keuangan perlu hati-hati",
    keywords: ["der", "d/e", "debt", "utang", "leverage", "gearing", "solvabilitas"],
  },
  {
    slug: "roe", label_id: "ROE", label_en: "ROE",
    definition_id: "Return on Equity (ROE) = Laba Bersih / Ekuitas × 100%",
    definition_en: "ROE = Net Profit / Equity × 100%",
    formula: "ROE = Laba Bersih / Ekuitas × 100%",
    goodThreshold: "ROE > 15% baik; ROE > 20% excellent",
    badThreshold: "ROE < 5% konsisten bisa tidak efisien",
    keywords: ["roe", "return on equity", "profitabilitas", "laba", "return", "efisiensi modal"],
  },
  {
    slug: "pe", label_id: "PE / PER", label_en: "P/E Ratio",
    definition_id: "Price to Earnings (PER) = Harga Saham / Laba per Saham (EPS)",
    definition_en: "P/E = Stock Price / Earnings per Share (EPS)",
    formula: "PER = Harga Saham / EPS",
    goodThreshold: "PER < 15 bisa undervalued; PER < 10 menarik",
    badThreshold: "PER > 30 di non-tech growth bisa overvalued",
    keywords: ["pe", "per", "p/e", "price to earnings", "eps", "earning", "laba", "valuation"],
  },
  {
    slug: "roa", label_id: "ROA", label_en: "ROA",
    definition_id: "Return on Assets (ROA) = Laba Bersih / Total Aset × 100%",
    definition_en: "ROA = Net Profit / Total Assets × 100%",
    formula: "ROA = Laba Bersih / Total Aset × 100%",
    goodThreshold: "ROA > 5% baik; ROA > 10% excellent",
    badThreshold: "ROA < 2% atau negatif = tidak efisien",
    keywords: ["roa", "return on assets", "aset", "efisiensi aset"],
  },
  {
    slug: "eps", label_id: "EPS", label_en: "EPS",
    definition_id: "Earnings Per Share (EPS) = Laba Bersih / Jumlah Lembar Saham Beredar",
    definition_en: "EPS = Net Profit / Outstanding Shares",
    formula: "EPS = Laba Bersih / Jumlah Saham Beredar",
    goodThreshold: "EPS tumbuh konsisten YoY = fundamental baik",
    badThreshold: "EPS negatif = perusahaan rugi",
    keywords: ["eps", "earnings per share", "laba per saham", "earning"],
  },
  {
    slug: "marketcap", label_id: "Market Cap", label_en: "Market Cap",
    definition_id: "Market Cap = Harga Saham × Jumlah Saham Beredar",
    definition_en: "Market Cap = Stock Price × Shares Outstanding",
    formula: "Market Cap = Harga × Jumlah Saham",
    goodThreshold: "> IDR 10T = Large Cap; > IDR 1T = Mid Cap",
    badThreshold: "< IDR 1T = Small Cap, likuiditas lebih rendah",
    keywords: ["market cap", "kapitalisasi", "ukuran", "large cap", "mid cap", "small cap", "blue chip"],
  },
  {
    slug: "yoy", label_id: "YoY", label_en: "YoY",
    definition_id: "Year over Year (YoY) = (Nilai Sekarang - Tahun Lalu) / Tahun Lalu × 100%",
    definition_en: "YoY Growth = (Current - Last Year) / Last Year × 100%",
    formula: "YoY = (Sekarang - Tahun Lalu) / Tahun Lalu × 100%",
    goodThreshold: "YoY growth > 10% konsisten = positif",
    badThreshold: "YoY turun perlu diselidiki",
    keywords: ["yoy", "year over year", "tahun lalu", "growth", "pertumbuhan"],
  },
];

/**
 * Selects ONLY relevant glossary terms based on the user's query.
 * Instead of sending all 8 terms (~500 tokens), send only 2-4 relevant ones (~150-300 tokens).
 *
 * Savings: ~200-350 tokens per query
 */
export function selectRelevantGlossary(query: string, lang: "id" | "en"): string {
  const lowerQuery = query.toLowerCase();

  const relevantTerms = FULL_GLOSSARY.filter((term) => {
    if (!term.keywords) return false;
    return term.keywords.some((kw) => lowerQuery.includes(kw.toLowerCase()));
  });

  // If no terms match, include the top 4 most common ones as fallback
  const termsToUse = relevantTerms.length > 0
    ? relevantTerms
    : FULL_GLOSSARY.slice(0, 4);

  return termsToUse.map((g) => {
    const def = lang === "id" ? g.definition_id : g.definition_en;
    const formulaPart = g.formula ? `\n  Formula: ${g.formula}` : "";
    return `[${g.label_id} / ${g.label_en}]\n  ${def}${formulaPart}`;
  }).join("\n\n");
}

/** Export full glossary for the glossary panel UI */
export { FULL_GLOSSARY as GLOSSARY };

// ============================================================
// History Compression — Reduce History Token Usage
// ============================================================

/**
 * Compresses conversation history to save tokens.
 * Instead of sending full message text, sends compressed summaries.
 *
 * Strategy:
 * - Keep last 2 messages verbatim (for immediate context)
 * - Summarize older messages into one-line summaries
 * - Max history: ~200 tokens (vs ~500+ for uncompressed)
 *
 * Savings: ~300+ tokens per query (after 3+ messages in conversation)
 */
export function buildCompressedHistory(
  messages: Array<{ role: string; content: string }>,
  maxTokens: number = 200
): string {
  if (messages.length === 0) return "";

  // Keep last 2 messages verbatim, summarize the rest
  const recentMessages = messages.slice(-2);
  const olderMessages = messages.slice(0, -2);

  const parts: string[] = [];

  // Summarize older messages
  if (olderMessages.length > 0) {
    const summaries = olderMessages.map((m) => {
      // Extract first ~40 chars as summary
      const preview = m.content
        .replace(/\[TERM:[^\]]+\]/g, "")  // strip term markers
        .replace(/[_*`#]/g, "")            // strip markdown
        .trim()
        .slice(0, 50);
      return `${m.role}: ${preview}${m.content.length > 50 ? "..." : ""}`;
    });
    parts.push(`[Earlier conversation]:\n${summaries.join("\n")}`);
  }

  // Add recent messages verbatim
  for (const m of recentMessages) {
    parts.push(`${m.role}: ${m.content}`);
  }

  let result = parts.join("\n\n");

  // Truncate if still too long (measured in estimated tokens)
  while (estimateTokens(result) > maxTokens && result.length > 100) {
    // Remove the oldest summarized part
    const firstNewline = result.indexOf("\n\n");
    if (firstNewline === -1) break;
    result = result.slice(firstNewline + 2);
  }

  return result;
}

// ============================================================
// Sectors Data Optimization — Trim JSON Payload
// ============================================================

/**
 * Trims Sectors API JSON data to reduce token usage.
 * Removes null fields, limits array lengths, rounds numbers.
 *
 * Expected savings: 20-40% on large API responses
 */
export function optimizeSectorsData(jsonString: string, maxChars: number = 4000): string {
  try {
    const data = JSON.parse(jsonString);

    // If it's an array, limit items
    if (Array.isArray(data)) {
      const trimmed = data.slice(0, 5).map(trimObject);
      return JSON.stringify(trimmed);
    }

    // If it's a Record<string, any> (compare data keyed by symbol),
    // trim each company's data separately within the per-company budget.
    if (data && typeof data === "object") {
      const keys = Object.keys(data);
      const perCompanyBudget = Math.floor(maxChars / Math.max(keys.length, 1));
      const trimmedRecord: Record<string, unknown> = {};
      for (const key of keys) {
        const val = data[key];
        if (typeof val === "string") {
          // Already a string — trim directly
          trimmedRecord[key] = val.length > perCompanyBudget
            ? val.slice(0, perCompanyBudget) + "\n... [truncated]"
            : val;
        } else {
          // Object — trim then stringify
          const trimmedObj = trimObject(val);
          const str = JSON.stringify(trimmedObj);
          trimmedRecord[key] = str.length > perCompanyBudget
            ? str.slice(0, perCompanyBudget) + "\n... [truncated]"
            : str;
        }
      }
      return JSON.stringify(trimmedRecord);
    }

    // Fallback: trim as a plain object
    return JSON.stringify(trimObject(data));
  } catch {
    // If not valid JSON, truncate raw string
    if (jsonString.length <= maxChars) return jsonString;
    return jsonString.slice(0, maxChars) + "\n... [truncated]";
  }
}

/** Recursively trim an object: remove nulls, round numbers, limit strings */
// P1-7: Depth-aware trimming — top-level arrays get more items, financial series stay at 5
function trimObject<T extends object>(obj: T, depth: number = 0): T {
  if (depth > 3) return obj;  // max nesting depth

  if (Array.isArray(obj)) {
    // depth 0 = top-level (e.g. news/results arrays) → allow 15 items
    // depth 1 = nested arrays → allow 10 items
    // depth 2+ = financial series → stick at 5
    const maxItems = depth === 0 ? 15 : depth === 1 ? 10 : 5;
    if (obj.length <= maxItems) return (obj as unknown[]).map((item: unknown) => trimObject(item as object, depth + 1) as T) as T;
    return obj.slice(0, maxItems).map((item: T) => trimObject(item as object, depth + 1) as T) as T;
  }

  if (obj && typeof obj === "object") {
    const trimmed: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined || value === "") continue;
      // P1-7: Be generous with summary/news keys — don't aggressively trim top-level data
      const noTrimKeys = ['summary', 'news', 'articles', 'top_gainers', 'top_losers', 'company_name', 'symbol', 'name'];
      if (noTrimKeys.includes(key) && depth <= 1) {
        trimmed[key] = Array.isArray(value) ? value.slice(0, 10) : value;
        continue;
      }
      if (typeof value === "number") {
        trimmed[key] = Math.round(value * 100) / 100;  // round to 2 decimal places
      } else if (typeof value === "string") {
        // Truncate long strings (descriptions, etc.)
        trimmed[key] = value.length > 200 ? value.slice(0, 200) + "..." : value;
      } else if (typeof value === "object") {
        trimmed[key] = trimObject(value, depth + 1);
      } else {
        trimmed[key] = value;
      }
    }
    return trimmed as T;
  }

  return obj;
}

// ============================================================
// Main Optimized Prompt Builder
// ============================================================

/**
 * Builds an optimized set of prompts with minimal token usage.
 * Returns both prompts AND token estimates for transparency.
 */
export interface OptimizedPrompts {
  systemPrompt: string;
  userPrompt: string;
  estimatedInputTokens: number;
  optimizationNotes: string[];
}

export function buildOptimizedPrompts(ctx: ChatContext): OptimizedPrompts {
  const notes: string[] = [];

  // 1. System prompt (optimized)
  const systemPrompt = buildOptimizedSystemPrompt(ctx.language);
  notes.push(`System prompt: ~${estimateTokens(systemPrompt)} tokens`);

  // 2. Smart glossary selection (only relevant terms)
  const glossaryStr = selectRelevantGlossary(ctx.userMessage, ctx.language);
  notes.push(`Glossary: ${glossaryStr ? "~" + estimateTokens(glossaryStr) + " tokens (" + (glossaryStr.split("\n\n").length) + " terms)" : "none"}`);

  // 3. Compressed history
  const historyStr = ctx.recentHistory
    ? buildCompressedHistory(
        ctx.recentHistory.split("\n").map((line) => {
          const match = line.match(/^(user|assistant):\s*([\s\S]*)/);
          return match ? { role: match[1], content: match[2] } : { role: "unknown", content: line };
        })
      )
    : "";
  if (historyStr) notes.push(`History: ~${estimateTokens(historyStr)} tokens (compressed)`);

  // 4. Optimized sectors data
  let sectorsData = ctx.sectorsApiData;
  if (sectorsData) {
    const originalSize = sectorsData.length;
    sectorsData = optimizeSectorsData(sectorsData);
    notes.push(`Sectors data: ${sectorsData.length} chars (from ${originalSize}, -${Math.round((1 - sectorsData.length / originalSize) * 100)}%)`);
  }

  // Build final user prompt
  let userPrompt = ctx.userMessage;
  if (sectorsData) {
    userPrompt += `\n\n[DATA FROM SECTORS API]\n${sectorsData}`;
  }
  if (glossaryStr) {
    userPrompt += `\n\n[GLOSSARY REFERENCE]\n${glossaryStr}`;
  }
  if (historyStr) {
    userPrompt += `\n\n[CONVERSATION HISTORY]\n${historyStr}`;
  }

  const totalInput = estimateTokens(systemPrompt) + estimateTokens(userPrompt);

  return {
    systemPrompt,
    userPrompt,
    estimatedInputTokens: totalInput,
    optimizationNotes: notes,
  };
}

/** Legacy user prompt builder (for fallback when useLegacyPrompts=true) */
export function buildLegacyUserPrompt(ctx: ChatContext): string {
  let prompt = ctx.userMessage;
  if (ctx.sectorsApiData) {
    prompt += `\n\n[DATA FROM SECTORS API — USE THIS DATA TO ANSWER]\n${ctx.sectorsApiData}`;
  }
  if (ctx.glossaryTerms) {
    prompt += `\n\n[GLOSSARY REFERENCE]\n${ctx.glossaryTerms}`;
  }
  if (ctx.recentHistory) {
    prompt += `\n\n[CONVERSATION HISTORY]\n${ctx.recentHistory}`;
  }
  return prompt;
}
