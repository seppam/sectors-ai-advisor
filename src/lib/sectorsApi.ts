// ============================================================
// Sectors API Client — v2 REST API
// ============================================================

import type {
  SectorsDataRef,
} from "./types";
import { withCache } from "./apiCache";

// ============================================================
// Jakarta Timezone Helpers (P1-4 fix)
// WIB = UTC+7, so no DST complications
// ============================================================

/** Get today's date in Asia/Jakarta timezone (WIB = UTC+7). */
export function getJakartaDate(): string {
  const now = new Date();
  const wibOffset = 7 * 60; // minutes ahead of UTC
  const localOffset = now.getTimezoneOffset(); // minutes behind UTC (negative when east of UTC)
  const wibTime = new Date(now.getTime() + (localOffset + wibOffset) * 60 * 1000);
  return wibTime.toISOString().split("T")[0];
}

/** Get the last trading day (Mon–Fri) in Asia/Jakarta. */
export function getLastTradingDay(): string {
  const date = new Date(getJakartaDate() + "T00:00:00");
  const day = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  if (day === 0) date.setDate(date.getDate() - 2); // Sunday → Friday
  else if (day === 6) date.setDate(date.getDate() - 1); // Saturday → Friday
  return date.toISOString().split("T")[0];
}

const BASE_URL = "https://api.sectors.app/v2";

function headers(apiKey: string) {
  return {
    Authorization: apiKey, // Sectors uses no "Bearer" prefix
    "Content-Type": "application/json",
  };
}

async function get<T>(
  path: string,
  apiKey: string,
  params: Record<string, string> = {}
): Promise<{ data: T; refs: SectorsDataRef }> {
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v) url.searchParams.set(k, v);
  });

  const res = await fetch(url.toString(), { headers: headers(apiKey) });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Sectors API error ${res.status}: ${err}`);
  }

  const data = (await res.json()) as T;
  return {
    data,
    refs: {
      endpoint: path,
      params,
      label: path.replace("/v2/", "").replace(/\//g, " / ").replace(/-/g, " "),
    } as SectorsDataRef,
  };
}

// ============================================================
// Public API Functions
// ============================================================

/** Check API credit balance */
export async function getAccountBalance(apiKey: string): Promise<number> {
  const res = await fetch(`${BASE_URL}/account/balance`, {
    headers: headers(apiKey),
  });
  if (!res.ok) return 0;
  const data = (await res.json()) as { balance?: number; credits?: number };
  return data.balance ?? data.credits ?? 0;
}

/** Natural language company screener */
export async function screenCompanies(
  apiKey: string,
  query: string,
  limit = 10
) {
  return get("/companies/", apiKey, { q: query, limit: String(limit) });
}

/** Structured company screener */
export async function screenCompaniesStructured(
  apiKey: string,
  where: string,
  orderBy: string,
  limit = 10
) {
  return get("/companies/", apiKey, { where, order_by: orderBy, limit: String(limit) });
}

/** Single company full report */
export async function getCompanyReport(
  apiKey: string,
  symbol: string,
  includeSections?: string[]
) {
  const params: Record<string, string> = {};
  if (includeSections) params["sections"] = includeSections.join(",");
  return get(`/company/${symbol}/`, apiKey, params);
}

/**
 * Cached version of getCompanyReport — deduplicates redundant calls.
 * Same signature, transparently caches for 5 minutes.
 */
export async function getCompanyReportCached(
  apiKey: string,
  symbol: string,
  includeSections?: string[]
) {
  return withCache("getCompanyReport", [symbol, includeSections], () =>
    getCompanyReport(apiKey, symbol, includeSections)
  );
}

/** Single company — daily transaction data */
export async function getStockDaily(
  apiKey: string,
  symbol: string,
  start?: string,
  end?: string,
  limit = 30
) {
  return get(`/stock/daily/${symbol}/`, apiKey, {
    ...(start && { start }),
    ...(end && { end }),
    limit: String(limit),
  });
}

/** Quarterly financials */
export async function getQuarterlyFinancials(
  apiKey: string,
  symbol: string
) {
  return get(`/report/quarterly/${symbol}/`, apiKey, {});
}

/** Top movers (gainers / losers) */
export async function getTopMovers(
  apiKey: string,
  type: "top_gainers" | "top_losers" = "top_gainers",
  period: "1d" | "7d" | "14d" | "30d" | "365d" = "1d",
  limit = 10
) {
  return get("/ranking/top-changes/", apiKey, {
    type,
    period,
    limit: String(limit),
  });
}

/**
 * Cached version of getTopMovers — deduplicates redundant calls.
 */
export async function getTopMoversCached(
  apiKey: string,
  type: "top_gainers" | "top_losers" = "top_gainers",
  period: "1d" | "7d" | "14d" | "30d" | "365d" = "1d",
  limit = 10
) {
  return withCache("getTopMovers", [type, period, limit], () =>
    getTopMovers(apiKey, type, period, limit)
  );
}

/**
 * Cached version of screenCompanies — deduplicates redundant calls.
 */
export async function screenCompaniesCached(
  apiKey: string,
  query: string,
  limit = 10
) {
  return withCache("screenCompanies", [query, limit], () =>
    screenCompanies(apiKey, query, limit)
  );
}

/** News articles */
export async function getNews(
  apiKey: string,
  options: {
    symbols?: string[];
    sector?: string;
    tags?: string[];
    keyword?: string;
    limit?: number;
    extension?: "idx" | "mining";
  } = {}
) {
  const params: Record<string, string> = {
    extension: options.extension ?? "idx",
  };
  if (options.symbols?.length) params["symbols"] = options.symbols.join(",");
  if (options.sector) params["sector"] = options.sector;
  if (options.tags?.length) params["tags"] = options.tags.join(",");
  if (options.keyword) params["keyword"] = options.keyword;
  if (options.limit) params["limit"] = String(options.limit);
  return get("/news/", apiKey, params);
}

/** Foreign investor net flow */
export async function getForeignFlow(
  apiKey: string,
  date: string, // YYYY-MM-DD
  limit = 10
) {
  return get("/broker/foreign-flow/", apiKey, { date, limit: String(limit) });
}

/**
 * Cached version of getForeignFlow — deduplicates redundant calls.
 */
export async function getForeignFlowCached(
  apiKey: string,
  date: string,
  limit = 10
) {
  return withCache("getForeignFlow", [date, limit], () =>
    getForeignFlow(apiKey, date, limit)
  );
}

/** All sectors / subsectors taxonomy */
export async function getSubsectors(apiKey: string) {
  return get("/helper-list/subsectors/", apiKey, {});
}

/** Sector report */
export async function getSectorReport(
  apiKey: string,
  subSectorSlug: string
) {
  return get(`/report/sector-report/${subSectorSlug}/`, apiKey, {});
}

// ============================================================
// Data Fetchers for Daily Brief
// ============================================================

export async function fetchDailyBriefData(apiKey: string, sectors: string[]) {
  const [gainers, losers] = await Promise.all([
    getTopMoversCached(apiKey, "top_gainers", "1d", 5).catch(() => ({ data: { results: [] } })),
    getTopMoversCached(apiKey, "top_losers", "1d", 5).catch(() => ({ data: { results: [] } })),
  ]);

  const today = getLastTradingDay(); // P1-4: use WIB-aware trading day
  const [foreignFlow, news] = await Promise.all([
    getForeignFlowCached(apiKey, today, 5).catch(() => ({ data: { results: [] } })),
    getNews(apiKey, { sector: sectors[0], limit: 5 }).catch(() => ({ data: { results: [] } })),
  ]);

  return {
    gainers: (gainers.data as SectorsListResponse)?.results ?? [],
    losers: (losers.data as SectorsListResponse)?.results ?? [],
    foreignFlow: foreignFlow.data,
    news: (news.data as SectorsNewsResponse)?.articles ?? (news.data as SectorsNewsResponse)?.results ?? [],
  };
}

// Inline response types to avoid @typescript-eslint/no-explicit-any
interface SectorsListResponse { results?: unknown[] }
interface SectorsNewsResponse { articles?: unknown[]; results?: unknown[] }
