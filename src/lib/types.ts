// ============================================================
// Core Types
// ============================================================

export type Language = "id" | "en";

export type LLMProvider = "anthropic" | "openai" | "deepseek" | "custom";

export interface LLMConfig {
  provider: LLMProvider;
  apiKey: string;
  customBaseUrl?: string;   // used when provider = "custom"
  customModel?: string;      // model name when provider = "custom"
}

export interface Settings {
  sectorsApiKey: string;
  llm: LLMConfig;
  language: Language;
  disclaimerAgreed: boolean;
  // Onboarding preferences
  sectors: string[];   // selected sectors e.g. ['financials','technology']
  dailyBriefEnabled: boolean;
}

// ============================================================
// Chat
// ============================================================

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: SectorsDataRef[];
  timestamp: number;
}

export interface SectorsDataRef {
  endpoint: string;
  params: Record<string, string>;
  label: string;  // human-readable: "BBCA Company Report", "Top Gainers Today"
}

// ============================================================
// Glossary
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
}

// ============================================================
// Daily Brief
// ============================================================

export interface DailyBriefData {
  topGainers: CompanySnapshot[];
  topLosers: CompanySnapshot[];
  foreignFlow: ForeignFlowSummary;
  recentNews: NewsItem[];
  sectorOverview: SectorSnapshot[];
}

export interface CompanySnapshot {
  symbol: string;
  companyName: string;
  lastClose: number;
  changePercent: number;
  sector: string;
}

export interface ForeignFlowSummary {
  netBuy: number;       // in IDR
  netSell: number;
  topBuyers: string[];  // broker names
  topSellers: string[];
}

export interface NewsItem {
  title: string;
  source: string;
  date: string;
  url?: string;
  summary?: string;
}

export interface SectorSnapshot {
  name: string;
  slug: string;
  changePercent: number;
}

// ============================================================
// Watchlist
// ============================================================

export interface WatchlistItem {
  symbol: string;
  addedAt: number;
  alertThreshold?: number; // price change % to alert on
}

export interface WatchlistEntry extends WatchlistItem {
  companyName: string;
  lastClose: number;
  changePercent: number;
  pe: number;
  pb: number;
  roe: number;
  der: number;
}

// ============================================================
// Company Report Data (from Sectors API /company/{symbol}/)
// ============================================================

export interface CompanyData {
  company_name?: string;
  summary?: {
    last_close?: number;
    daily_close_change?: number;
    forward_pe?: number;
    pb_mrq?: number;
    roe_ttm?: number;
    der_mrq?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
