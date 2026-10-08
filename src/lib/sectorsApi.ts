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

/**
 * Sectors v2 has no balance endpoint. Validate the key with one cheap call
 * (1 daily row for BBCA) so Settings can tell the user whether it works.
 */
export async function validateApiKey(apiKey: string): Promise<{ ok: boolean; status: number }> {
  const day = getLastTradingDay();
  const res = await fetch(`${BASE_URL}/daily/BBCA/?start=${day}&end=${day}`, {
    headers: headers(apiKey),
  });
  return { ok: res.ok, status: res.status };
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
  return get(`/company/report/${symbol}/`, apiKey, params);
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
  void limit;
  return get(`/daily/${symbol}/`, apiKey, {
    ...(start && { start }),
    ...(end && { end }),
  });
}

/** Quarterly financials */
export async function getQuarterlyFinancials(
  apiKey: string,
  symbol: string
) {
  return get(`/report/quarterly-financials/${symbol}/`, apiKey, {});
}

/** A mover row normalised for the UI / LLM (change_percent is in %, not a fraction). */
export interface MoverRow {
  symbol: string;
  name: string;
  last_close: number;
  change_percent: number;
  date?: string;
}

/** Top movers (gainers / losers). Costs 1 credit per classification x period. */
export async function getTopMovers(
  apiKey: string,
  type: "top_gainers" | "top_losers" = "top_gainers",
  period: "1d" | "7d" | "14d" | "30d" | "365d" = "1d",
  limit = 10
) {
  const res = await get<Record<string, Record<string, Array<{
    symbol: string; name: string; price_change: number; last_close_price: number; latest_close_date?: string;
  }>>>>("/companies/top-changes/", apiKey, { classifications: type, periods: period });
  const rows = (res.data[type]?.[period] ?? []).slice(0, limit).map<MoverRow>((r) => ({
    symbol: r.symbol.replace(".JK", ""),
    name: r.name,
    last_close: r.last_close_price,
    change_percent: Math.round(r.price_change * 10000) / 100,
    date: r.latest_close_date,
  }));
  return { data: { results: rows }, refs: res.refs };
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
  return get("/foreign-flow/", apiKey, { date, limit: String(limit) });
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
  return get("/subsectors/", apiKey, {});
}

/** Sector report */
export async function getSectorReport(
  apiKey: string,
  subSectorSlug: string
) {
  return get(`/report/sector-report/${subSectorSlug}/`, apiKey, {});
}

// ============================================================
// Compact company summary (token-optimised)
// ============================================================

interface RawReport {
  symbol?: string;
  company_name?: string;
  overview?: {
    sector?: string; sub_sector?: string; market_cap?: number; last_close_price?: number;
    latest_close_date?: string; daily_close_change?: number;
    all_time_price?: Record<string, Record<string, number>>;
  };
  valuation?: {
    forward_pe?: number; intrinsic_value?: number;
    historical_valuation?: Array<{ year?: number; pb?: number; pe?: number; pb_peer_avg?: number; pe_peer_avg?: number }>;
  };
  financials?: {
    eps?: number;
    historical_eps?: Record<string, { eps?: number; eps_growth?: number }>;
    historical_financial_ratio?: Array<{
      year?: number;
      leverage?: { debt_to_equity_ratio?: number };
      profitability?: { roe?: number; roa?: number; net_profit_margin?: number };
    }>;
    yoy_ttm_earnings_growth?: number; yoy_ttm_revenue_growth?: number;
  };
  dividend?: unknown;
}

const round = (n: number | undefined, d = 2) =>
  typeof n === "number" && !Number.isNaN(n) ? Math.round(n * 10 ** d) / 10 ** d : undefined;

/** Collapse the (very large) v2 company report into the few ratios the advisor explains. */
export function summarizeCompany(report: unknown) {
  const r = report as RawReport;
  const val = r.valuation?.historical_valuation?.at(-1);
  const ratio = r.financials?.historical_financial_ratio?.at(-1);
  const hi52 = Object.values(r.overview?.all_time_price?.["52_w_high"] ?? {})[0];
  const lo52 = Object.values(r.overview?.all_time_price?.["52_w_low"] ?? {})[0];
  return {
    symbol: r.symbol?.replace(".JK", ""),
    company_name: r.company_name,
    sector: r.overview?.sector,
    sub_sector: r.overview?.sub_sector,
    last_close: r.overview?.last_close_price ?? undefined,
    last_close_date: r.overview?.latest_close_date,
    daily_change_pct: round((r.overview?.daily_close_change ?? NaN) * 100),
    market_cap_idr: r.overview?.market_cap,
    high_52w: hi52, low_52w: lo52,
    forward_pe: round(r.valuation?.forward_pe),
    pe_latest_year: round(val?.pe), pe_peer_avg: round(val?.pe_peer_avg),
    pbv_latest_year: round(val?.pb), pbv_peer_avg: round(val?.pb_peer_avg),
    intrinsic_value: round(r.valuation?.intrinsic_value, 0),
    eps: round(r.financials?.eps),
    roe_pct: round((ratio?.profitability?.roe ?? NaN) * 100),
    roa_pct: round((ratio?.profitability?.roa ?? NaN) * 100),
    net_margin_pct: round((ratio?.profitability?.net_profit_margin ?? NaN) * 100),
    der: round(ratio?.leverage?.debt_to_equity_ratio),
    ratio_year: ratio?.year,
    earnings_growth_ttm_pct: round((r.financials?.yoy_ttm_earnings_growth ?? NaN) * 100),
    revenue_growth_ttm_pct: round((r.financials?.yoy_ttm_revenue_growth ?? NaN) * 100),
    ...(r.dividend ? { dividend: r.dividend } : {}),
  };
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
