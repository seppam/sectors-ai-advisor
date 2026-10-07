// ============================================================
// Usage Tracker — Token & Credit Consumption Estimation
// ============================================================
//
// Tracks estimated LLM token usage and Sectors API credits per session.
// All estimates are conservative (over-estimate to avoid surprises).
//
// LLM Token Pricing (per 1M tokens, approximate):
//   DeepSeek V3:     $0.27 input / $1.10 output  (cheapest, recommended)
//   DeepSeek V3.2:   $0.55 input / $0.28 output
//   GPT-4o-mini:     $0.15 input / $0.60 output
//   Claude Sonnet 4: $3.00 input / $15.00 output
//   GPT-4o:          $2.50 input / $10.00 output
//
// Sectors API Credits:
//   Most endpoints: 1 credit per request
//   Company report: ~2 credits (includes sub-requests)
//   Screener query: 1 credit
//   Top movers: 1 credit
//   News: 1 credit
//   Foreign flow: 1 credit
// ============================================================

export interface LLMPriceInfo {
  name: string;
  inputPer1M: number;   // USD
  outputPer1M: number;  // USD
}

export const LLM_PRICES: Record<string, LLMPriceInfo> = {
  "deepseek-chat":           { name: "DeepSeek V3",       inputPer1M: 0.27,  outputPer1M: 1.10 },
  "deepseek-chat-v3-0324":   { name: "DeepSeek V3",       inputPer1M: 0.27,  outputPer1M: 1.10 },
  "deepseek-reasoner":       { name: "DeepSeek Reasoner", inputPer1M: 0.55,  outputPer1M: 2.19 },
  "gpt-4o":                  { name: "GPT-4o",            inputPer1M: 2.50,  outputPer1M: 10.00 },
  "gpt-4o-mini":             { name: "GPT-4o-mini",       inputPer1M: 0.15,  outputPer1M: 0.60 },
  "claude-sonnet-4-20250514": { name: "Claude Sonnet 4",  inputPer1M: 3.00,  outputPer1M: 15.00 },
  "claude-3-5-haiku-20241022": { name: "Claude Haiku",    inputPer1M: 0.80,  outputPer1M: 4.00 },
  "llama3":                  { name: "Llama 3 (local)",   inputPer1M: 0,     outputPer1M: 0 },
  // OpenRouter model aliases
  "anthropic/sonnet-4-20250514":  { name: "Claude Sonnet 4 (OR)", inputPer1M: 3.00, outputPer1M: 15.00 },
  "openai/gpt-4o":               { name: "GPT-4o (OR)",        inputPer1M: 2.50, outputPer1M: 10.00 },
  "deepseek/deepseek-chat-v3-0324": { name: "DeepSeek V3 (OR)", inputPer1M: 0.27, outputPer1M: 1.10 },
};

/** Default price info for unknown models */
const DEFAULT_PRICE: LLMPriceInfo = {
  name: "Unknown Model",
  inputPer1M: 2.00,
  outputPer1M: 8.00,
};

// ============================================================
// Token Counting (approximate)
// ============================================================

/**
 * Rough token count estimation.
 * For English: ~4 characters per token on average.
 * For Indonesian: ~3.5 characters per token (more multi-byte chars).
 * This overestimates by ~10-20% which is safe for budgeting.
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  // Count words and chars, take the more conservative estimate
  const charCount = text.length;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  // Tokens ≈ max(chars/3.5, words*1.3) — conservative
  return Math.ceil(Math.max(charCount / 3.5, wordCount * 1.3));
}

// ============================================================
// Sectors API Credit Cost
// ============================================================

export const SECTORS_CREDIT_COST: Record<string, number> = {
  "/companies/": 1,
  "/company/": 2,        // company report is heavier
  "/stock/daily/": 1,
  "/ranking/top-changes/": 1,
  "/news/": 1,
  "/broker/foreign-flow/": 1,
  "/report/quarterly/": 2,
  "/report/sector-report/": 2,
  "/helper-list/subsectors/": 1,
  "/account/balance": 0, // free
};

export function estimateSectorsCredits(endpoint: string): number {
  // Find the most specific matching endpoint
  const keys = Object.keys(SECTORS_CREDIT_COST).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (endpoint.includes(key)) return SECTORS_CREDIT_COST[key];
  }
  return 1; // default: 1 credit per unknown endpoint
}

// ============================================================
// Session Usage Tracking
// ============================================================

export interface UsageEvent {
  id: string;
  timestamp: number;
  type: "llm_call" | "sectors_api";
  // LLM fields
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
  inputCostUsd?: number;
  outputCostUsd?: number;
  totalCostUsd?: number;
  // Sectors fields
  endpoint?: string;
  creditsUsed?: number;
  // Common
  userQuery?: string;      // what the user asked (for context)
}

export interface SessionUsage {
  events: UsageEvent[];
  totalInputTokens: number;
  totalOutputTokens: number;
  totalLLMCostUsd: number;
  totalSectorsCredits: number;
  totalQueries: number;
  sessionStart: number;
}

// In-memory store with optional localStorage persistence.
// Persists across page refreshes within the same browser session.
const STORAGE_KEY = "sectors-advisor-usage";

function loadSession(): SessionUsage {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as SessionUsage;
  } catch {
    // localStorage unavailable — fall through to default
  }
  return freshSession();
}

function persistSession(session: SessionUsage): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // localStorage unavailable — silently ignore
  }
}

function freshSession(): SessionUsage {
  return {
    events: [],
    totalInputTokens: 0,
    totalOutputTokens: 0,
    totalLLMCostUsd: 0,
    totalSectorsCredits: 0,
    totalQueries: 0,
    sessionStart: Date.now(),
  };
}

/** P2-4: UUID generator with fallback for non-secure contexts */
function safeUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    try { return crypto.randomUUID(); } catch { /* fall through */ }
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

let currentSession: SessionUsage = loadSession();

/**
 * Record an LLM call in the usage tracker.
 * Call this AFTER a successful LLM API response.
 *
 * P3-5: If `usage` is provided (real token counts from the provider),
 * those are used instead of char-based estimation.
 */
export function recordLLMCall(params: {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  responseText: string;
  userQuery?: string;
  /** Real token counts from the LLM provider response (P3-5) */
  usage?: { inputTokens: number; outputTokens: number } | null;
}): UsageEvent {
  // Use real tokens if available; fall back to char-based estimation
  const inputTokens = params.usage?.inputTokens ?? estimateTokens(params.systemPrompt) + estimateTokens(params.userPrompt);
  const outputTokens = params.usage?.outputTokens ?? estimateTokens(params.responseText);

  const priceInfo = LLM_PRICES[params.model] ?? DEFAULT_PRICE;
  const inputCost = (inputTokens / 1_000_000) * priceInfo.inputPer1M;
  const outputCost = (outputTokens / 1_000_000) * priceInfo.outputPer1M;
  const totalCost = inputCost + outputCost;

  const event: UsageEvent = {
    id: safeUUID(),
    timestamp: Date.now(),
    type: "llm_call",
    model: params.model,
    inputTokens,
    outputTokens,
    inputCostUsd: Math.round(inputCost * 10000) / 10000,
    outputCostUsd: Math.round(outputCost * 10000) / 10000,
    totalCostUsd: Math.round(totalCost * 10000) / 10000,
    userQuery: params.userQuery,
  };

  currentSession.events.push(event);
  currentSession.totalInputTokens += inputTokens;
  currentSession.totalOutputTokens += outputTokens;
  currentSession.totalLLMCostUsd += totalCost;
  currentSession.totalQueries += 1;

  persistSession(currentSession);
  return event;
}

/**
 * Record a Sectors API call in the usage tracker.
 */
export function recordSectorsCall(params: {
  endpoint: string;
  userQuery?: string;
}): UsageEvent {
  const credits = estimateSectorsCredits(params.endpoint);

  const event: UsageEvent = {
    id: safeUUID(),
    timestamp: Date.now(),
    type: "sectors_api",
    endpoint: params.endpoint,
    creditsUsed: credits,
    userQuery: params.userQuery,
  };

  currentSession.events.push(event);
  currentSession.totalSectorsCredits += credits;

  persistSession(currentSession);
  return event;
}

/** Get the full current session usage */
export function getSessionUsage(): SessionUsage {
  return { ...currentSession };
}

/** Reset the session (e.g., after clearing chat) */
export function resetUsageSession(): void {
  currentSession = freshSession();
  persistSession(currentSession);
}

/** Get a human-readable cost summary */
export function getUsageSummary(model?: string): {
  llmCalls: number;
  sectorsCalls: number;
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  totalCostUsd: number;
  totalCredits: number;
  estimatedRemainingQueries: number;  // rough estimate based on $5 budget
  avgCostPerQuery: number;
} {
  const llmEvents = currentSession.events.filter((e) => e.type === "llm_call");
  const sectorsEvents = currentSession.events.filter((e) => e.type === "sectors_api");
  const totalTokens = currentSession.totalInputTokens + currentSession.totalOutputTokens;
  const avgCost = currentSession.totalQueries > 0
    ? currentSession.totalLLMCostUsd / currentSession.totalQueries
    : 0;

  // Estimate how many more queries with $5 budget
  const remainingBudget = 5.0 - currentSession.totalLLMCostUsd;
  const estimatedRemaining = avgCost > 0 ? Math.floor(remainingBudget / avgCost) : 999;

  return {
    llmCalls: llmEvents.length,
    sectorsCalls: sectorsEvents.length,
    totalTokens,
    inputTokens: currentSession.totalInputTokens,
    outputTokens: currentSession.totalOutputTokens,
    totalCostUsd: Math.round(currentSession.totalLLMCostUsd * 10000) / 10000,
    totalCredits: currentSession.totalSectorsCredits,
    estimatedRemainingQueries: Math.max(0, estimatedRemaining),
    avgCostPerQuery: Math.round(avgCost * 10000) / 10000,
  };
}

/** Format token count for display */
export function formatTokenCount(tokens: number): string {
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}k`;
  return String(tokens);
}

/** Format USD cost for display */
export function formatCost(usd: number): string {
  if (usd < 0.01) return `<$0.01`;
  return `$${usd.toFixed(4)}`;
}
