// ============================================================
// LLM Provider Abstraction — Anthropic / OpenAI / DeepSeek / Custom
// ============================================================

import type { LLMProvider } from "./types";
import { buildOptimizedPrompts, buildOriginalSystemPrompt, buildLegacyUserPrompt } from "./optimizedPrompts";
import { recordLLMCall } from "./usageTracker";

// ============================================================
// Prompt Template Builder
// ============================================================

export interface ChatContext {
  userMessage: string;
  language: "id" | "en";
  sectorsApiData?: string;
  glossaryTerms?: string;   // legacy — still accepted but optimized builder ignores this
  recentHistory?: string;      // legacy — still accepted but optimized builder compresses this
  /** Set to true to use original verbose prompts (for comparison/debugging) */
  useLegacyPrompts?: boolean;
}

// ============================================================
// Provider Implementations
// ============================================================

async function callAnthropic(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  model = "claude-sonnet-4-20250514"
): Promise<{ text: string; usage: { input_tokens: number; output_tokens: number } | null }> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
      "anthropic-dangerous-direct-browser-access": "true", // Required for browser-side calls
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${err}`);
  }
  const data = await res.json() as {
    content: Array<{ type: string; text: string }>;
    usage?: { input_tokens: number; output_tokens: number };
  };
  return {
    text: data.content.find((c) => c.type === "text")?.text ?? "",
    usage: data.usage ?? null,
  };
}

// OpenAI-compatible format (used by OpenAI, OpenRouter, DeepSeek direct, nexotao, etc.)
async function callOpenAICompatible(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  baseUrl: string,
  model: string
): Promise<{ text: string; usage: { prompt_tokens: number; completion_tokens: number } | null }> {
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 1024,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }
  const data = await res.json() as {
    choices: Array<{ message: { content: string } }>;
    usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  };
  return {
    text: data.choices[0]?.message?.content ?? "",
    usage: data.usage ?? null,
  };
}

// Re-export for external use
export { callOpenAICompatible };

// ============================================================
// Model Resolution Helper
// ============================================================

/**
 * Resolve the actual model name to send to the API.
 * Uses `||` (not `??`) to also skip empty strings — the customModel
 * store default is "" (empty string), which is truthy for `??`.
 */
export function resolveModel(
  provider: LLMProvider,
  modelName: string | undefined,
  customModel: string | undefined
): string {
  // Explicit model name takes priority
  if (modelName && modelName.trim()) return modelName.trim();

  // Custom provider with custom model
  if (provider === "custom" && customModel && customModel.trim()) return customModel.trim();

  // Custom provider fallback
  if (provider === "custom") return "gpt-4o"; // sensible default for OpenRouter etc.

  // Known providers: use their default model
  return getModelForProvider(provider);
}

// ============================================================
// Guardrail Checker
// ============================================================

export interface GuardrailResult {
  triggered: boolean;
  response?: string;
  lang: "id" | "en";
}

export function checkGuardrail(
  message: string,
  lang: "id" | "en"
): GuardrailResult {
  const q = message.trim();
  const isID = lang === "id";

  // Word-boundary regexes — no substring false positives
  // (prevents "beli" matching "pembelian", "buy" matching "buyback").
  const TRANSACTION_PATTERNS: RegExp[] = [
    /\b(jual|beli|buy|sell|purchase)\b/i,
    /\b(rekomendasi\s+(beli|jual|hold|netral|buy|sell))\b/i,
    /\b(worth\s+(to\s+)?(buy|jual))\b/i,
    /\b(mending\s+(beli|jual))\b/i,
    /\b(layak\s+(beli|jual))\b/i,
    /\b(target\s+harga|price\s+target)\b/i,
    /\b(stop\s*loss|take\s*profit)\b/i,
  ];

  const PREDICTION_PATTERNS: RegExp[] = [
    /\b(next\s*(week|month|quarter|year))\b/i,
    /\b(minggu|bulan|tahun)\s+depan\b/i,
    /\b(besok|tomorrow)\b/i,
    /\b(akan\s+(naik|turun)|will\s+(rise|fall|go\s+up|go\s+down))\b/i,
    /\b(prediksi|forecast|ramalan)\s+harga\b/i,
    /\b(price\s+(prediction|forecast))\b/i,
  ];

  if (PREDICTION_PATTERNS.some((re) => re.test(q))) {
    return {
      triggered: true,
      response: isID
        ? "⚠️ Di Luar Cakupan\n\nSaya tidak bisa memprediksi harga saham di masa depan. Yang bisa saya bantu: menganalisis data historis dan fundamental (PER, PBV, ROE, DER) dari Sectors API."
        : "⚠️ Out of Scope\n\nI cannot predict future stock prices. I can help analyse historical data and fundamentals (P/E, PBV, ROE, DER) from the Sectors API.",
      lang,
    };
  }

  if (TRANSACTION_PATTERNS.some((re) => re.test(q))) {
    return {
      triggered: true,
      response: isID
        ? "⚠️ Di Luar Cakupan\n\nSaya tidak dapat membantu transaksi atau memberi rekomendasi beli/jual. Saya hanya membantu analisis dan penjelasan data. Untuk berinvestasi, silakan gunakan platform broker yang terdaftar di OJK."
        : "⚠️ Out of Scope\n\nI cannot help with transactions or buy/sell recommendations. I only assist with analysis and data explanations. To invest, please use a broker registered with OJK.",
      lang,
    };
  }

  // Non-IDX markets (substring is fine — these are clear intent signals)
  const cryptoKeywords = ["crypto", "bitcoin", "ethereum", "forex", "valas", "saham usa", "us stock"];
  const lower = q.toLowerCase();
  if (cryptoKeywords.some((kw) => lower.includes(kw))) {
    return {
      triggered: true,
      response: isID
        ? "⚠️ Di Luar Cakupan\n\nSectors AI Advisor fokus pada saham perusahaan yang tercatat di Bursa Efek Indonesia (IDX). Untuk cryptocurrency atau pasar lain, saya tidak dapat memberikan analisis."
        : "⚠️ Out of Scope\n\nSectors AI Advisor focuses on stocks listed on the Indonesia Stock Exchange (IDX). I cannot provide analysis for cryptocurrency or other markets.",
      lang,
    };
  }

  return { triggered: false, lang };
}

// ============================================================
// Main Unified Function
// ============================================================

export interface LLMResponse {
  text: string;
  raw?: string;
}

/**
 * Options for callLLM — groups all parameters into one object for flexibility.
 * The apiKeys map lets server-side routes pass env keys; if no env key is set,
 * the callLLM function will use the provided apiKey (BYOK/localStorage mode).
 */
export interface CallLLMOptions {
  provider: LLMProvider;
  apiKey: string;  // user-provided key (localStorage / BYOK)
  ctx: ChatContext;
  customBaseUrl?: string;
  customModel?: string;
  modelName?: string;
  /** Server-side env keys. If set and provider key exists here, it overrides apiKey. */
  apiKeys?: Record<string, string>;
}

/**
 * LLM call with optional custom base URL.
 *
 * Client-side call (via /api/chat route — recommended):
 *   callLLM({ provider, apiKey: userKey, ctx, apiKeys: envKeys })
 *   where apiKeys = server-side env keys; if set, the function uses them
 *   and the browser never stores/transmits them.
 *
 * Direct call (fallback / BYOK mode):
 *   callLLM({ provider, apiKey, ctx, customBaseUrl, customModel })
 *
 * Example customBaseUrl values:
 *   OpenRouter:  "https://openrouter.ai/api/v1"
 *   nexotao:     "https://api.nexotao.com/v1"
 *   LM Studio:   "http://localhost:1234/v1"
 *   Azure OpenAI: "https://<your-resource>.openai.azure.com/v1"
 */
export async function callLLM(options: CallLLMOptions): Promise<LLMResponse> {
  const { provider, apiKey: userKey, ctx, customBaseUrl, customModel, modelName } = options;
  // Server-side env keys take priority over user key (keys never leave the server)
  const effectiveKey = (options.apiKeys?.[provider] || options.apiKeys?.custom) || userKey;
  // Use optimized prompts by default (saves ~40-60% tokens)
  const prompts = ctx.useLegacyPrompts
    ? { systemPrompt: buildOriginalSystemPrompt(ctx.language), userPrompt: buildLegacyUserPrompt(ctx), estimatedInputTokens: 0, optimizationNotes: [] }
    : buildOptimizedPrompts(ctx);

  const systemPrompt = prompts.systemPrompt;
  const userPrompt = prompts.userPrompt;

  // Log optimization info in development
  if (process.env.NODE_ENV !== "production" && prompts.optimizationNotes.length > 0) {
    console.log("[TokenOpt]", prompts.optimizationNotes.join(" | "), `| Est input: ~${prompts.estimatedInputTokens} tokens`);
  }

  // Determine the actual model name for usage tracking
  const actualModel = resolveModel(provider, modelName, customModel ?? "");

  // P3-5: Extract real token usage from provider responses for accurate cost tracking
  let usage: { inputTokens: number; outputTokens: number } | null = null;

  if (provider === "anthropic") {
    const result = await callAnthropic(effectiveKey, systemPrompt, userPrompt, actualModel);
    if (result.usage) {
      usage = { inputTokens: result.usage.input_tokens, outputTokens: result.usage.output_tokens };
    }
    recordLLMCall({ model: actualModel, systemPrompt, userPrompt, responseText: result.text, userQuery: ctx.userMessage, usage });
    return { text: result.text };
  }

  if (provider === "openai") {
    const result = await callOpenAICompatible(effectiveKey, systemPrompt, userPrompt, "https://api.openai.com/v1", actualModel);
    if (result.usage) {
      usage = { inputTokens: result.usage.prompt_tokens, outputTokens: result.usage.completion_tokens };
    }
    recordLLMCall({ model: actualModel, systemPrompt, userPrompt, responseText: result.text, userQuery: ctx.userMessage, usage });
    return { text: result.text };
  }

  if (provider === "deepseek") {
    const result = await callOpenAICompatible(effectiveKey, systemPrompt, userPrompt, "https://api.deepseek.com/v1", actualModel);
    if (result.usage) {
      usage = { inputTokens: result.usage.prompt_tokens, outputTokens: result.usage.completion_tokens };
    }
    recordLLMCall({ model: actualModel, systemPrompt, userPrompt, responseText: result.text, userQuery: ctx.userMessage, usage });
    return { text: result.text };
  }

  if (provider === "custom") {
    if (!customBaseUrl) {
      throw new Error("Custom LLM provider requires a base URL. Please enter it in Settings.");
    }
    const result = await callOpenAICompatible(effectiveKey, systemPrompt, userPrompt, customBaseUrl, actualModel);
    if (result.usage) {
      usage = { inputTokens: result.usage.prompt_tokens, outputTokens: result.usage.completion_tokens };
    }
    recordLLMCall({ model: actualModel, systemPrompt, userPrompt, responseText: result.text, userQuery: ctx.userMessage, usage });
    return { text: result.text };
  }

  throw new Error(`Unknown LLM provider: ${provider}`);
}

// ============================================================
// Helpers
// ============================================================

function getModelForProvider(provider: LLMProvider): string {
  switch (provider) {
    case "anthropic": return "claude-sonnet-4-20250514";
    case "openai": return "gpt-4o";
    case "deepseek": return "deepseek-chat";
    case "custom": return "unknown";
  }
}
