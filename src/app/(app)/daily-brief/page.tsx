"use client";

import { useState } from "react";
import { useSettingsStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { getTopMoversCached, getForeignFlowCached, getNews, getLastTradingDay } from "@/lib/sectorsApi";
import { callLLM, resolveModel } from "@/lib/llmProviders";
import { Button, Card, EmptyState } from "@/components/ui";
import { PageContainer } from "@/components/layout";
import { cn } from "@/lib/utils";

// Inline types to avoid @typescript-eslint/no-explicit-any
interface SectorsListItem {
  symbol?: string;
  name?: string;
  company_name?: string;
  last_close?: number | string;
  price?: number | string;
  change_percent?: number;
  changePercent?: number;
}
interface ForeignFlowData { net_buy_foreign?: number; value_bought?: number; value_sold?: number; net_buy?: number; net_sell?: number }
interface NewsArticle { title?: string; sector?: string; published_at?: string; source?: string; date?: string }

function fmtMoney(amount: number): string {
  if (Math.abs(amount) >= 1e12) return `IDR ${(amount / 1e12).toFixed(2)}T`;
  if (Math.abs(amount) >= 1e9) return `IDR ${(amount / 1e9).toFixed(2)}B`;
  return `IDR ${amount?.toLocaleString() ?? 0}`;
}

function changeColor(pct: number) {
  if (pct > 0) return "text-success";
  if (pct < 0) return "text-danger";
  return "text-on-surface-variant";
}

function changePrefix(pct: number) {
  if (pct > 0) return "+";
  return "";
}

export default function DailyBriefPage() {
  const language = useSettingsStore((s) => s.settings.language);
  const sectorsApiKey = useSettingsStore((s) => s.settings.sectorsApiKey);
  const llm = useSettingsStore((s) => s.settings.llm);
  const strings = t(language);

  const [isLoading, setIsLoading] = useState(false);
  const [brief, setBrief] = useState<string | null>(null);
  const [gainers, setGainers] = useState<SectorsListItem[]>([]);
  const [losers, setLosers] = useState<SectorsListItem[]>([]);
  const [foreignFlow, setForeignFlow] = useState<ForeignFlowData | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [error, setError] = useState("");

  const hasData = gainers.length > 0 || losers.length > 0 || !!brief;

  async function generateBrief() {
    if (!sectorsApiKey || !llm.apiKey) {
      setError(language === "id"
        ? "Sectors API Key atau LLM API Key belum diset. Buka Pengaturan."
        : "Sectors API key or LLM API key not set. Go to Settings.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const today = getLastTradingDay(); // P1-4: use WIB-aware trading day

      const [gainerRes, loserRes, ffRes, newsRes] = await Promise.all([
        getTopMoversCached(sectorsApiKey, "top_gainers", "1d", 5).catch(() => null),
        getTopMoversCached(sectorsApiKey, "top_losers", "1d", 5).catch(() => null),
        getForeignFlowCached(sectorsApiKey, today, 5).catch(() => null),
        getNews(sectorsApiKey, { limit: 5 }).catch(() => null),
      ]);

      const gainersData = (gainerRes?.data as { results?: SectorsListItem[] })?.results ?? [];
      const losersData = (loserRes?.data as { results?: SectorsListItem[] })?.results ?? [];
      const ffData = ffRes?.data as ForeignFlowData ?? {};
      const newsData = (newsRes?.data as { articles?: NewsArticle[]; results?: NewsArticle[] })?.articles ?? (newsRes?.data as { articles?: NewsArticle[]; results?: NewsArticle[] })?.results ?? [];

      setGainers(gainerRes ? gainersData : []);
      setLosers(loserRes ? losersData : []);
      setForeignFlow(ffData);
      setNews(newsData);

      const dataSummary = `
TOP GAINERS TODAY:
${JSON.stringify(gainersData, null, 2)}

TOP LOSERS TODAY:
${JSON.stringify(losersData, null, 2)}

FOREIGN FLOW:
${JSON.stringify(ffData, null, 2)}

RECENT NEWS:
${JSON.stringify(newsData.slice(0, 5), null, 2)}
`.trim();

      const llmResponse = await callLLM({
        provider: llm.provider,
        apiKey: llm.apiKey,
        ctx: {
          userMessage: language === "id"
            ? "Buat ringkasan pasar harian dalam Bahasa Indonesia untuk investor pemula."
            : "Generate a daily market summary in English for a beginner investor.",
          language,
          sectorsApiData: dataSummary,
        },
        customBaseUrl: llm.customBaseUrl,
        customModel: llm.customModel,
        modelName: resolveModel(llm.provider, undefined, llm.customModel),
      });

      setBrief(llmResponse.text);
    } catch (err: unknown) {
      setError(`${language === "id" ? "Gagal mengambil data" : "Failed to fetch data"}\n\n${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <PageContainer className="py-4 space-y-4 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-md font-bold text-on-surface">{strings.dailyBriefTitle}</h2>
            <p className="font-label-caps text-on-surface-variant mt-0.5">
              {new Date().toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={generateBrief}
            isLoading={isLoading}
          >
            {isLoading ? strings.generating : strings.generateBrief}
          </Button>
        </div>

        {error && (
          <Card padding="sm">
            <p className="font-body-sm text-danger">{error}</p>
          </Card>
        )}

        {/* Data cards */}
        {gainers.length > 0 && (
          <div className="space-y-3">
            {/* Top Gainers */}
            <Card padding="none">
              <div className="px-3 py-2 bg-success/10 border-b border-outline-variant flex items-center gap-2">
                <span className="text-sm">📈</span>
                <span className="font-body-sm font-semibold text-success">{strings.topGainers}</span>
              </div>
              <div>
                {gainers.map((g, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 border-b border-outline-variant last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="font-label-caps text-on-surface-variant font-mono w-3">{i + 1}</span>
                      <div>
                        <p className="font-body-sm font-semibold text-on-surface">{g.symbol}</p>
                        <p className="font-label-caps text-on-surface-variant truncate max-w-[150px]">{g.company_name ?? g.name ?? ""}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-body-sm font-medium text-on-surface">{g.last_close ?? g.price ?? "—"}</p>
                      <p className={cn("font-label-caps font-semibold", changeColor(g.change_percent ?? g.changePercent ?? 0))}>
                        {changePrefix(g.change_percent ?? g.changePercent ?? 0)}
                        {(g.change_percent ?? g.changePercent ?? 0).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top Losers */}
            <Card padding="none">
              <div className="px-3 py-2 bg-danger/10 border-b border-outline-variant flex items-center gap-2">
                <span className="text-sm">📉</span>
                <span className="font-body-sm font-semibold text-danger">{strings.topLosers}</span>
              </div>
              <div>
                {losers.map((l, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 border-b border-outline-variant last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="font-label-caps text-on-surface-variant font-mono w-3">{i + 1}</span>
                      <div>
                        <p className="font-body-sm font-semibold text-on-surface">{l.symbol}</p>
                        <p className="font-label-caps text-on-surface-variant truncate max-w-[150px]">{l.company_name ?? l.name ?? ""}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-body-sm font-medium text-on-surface">{l.last_close ?? l.price ?? "—"}</p>
                      <p className={cn("font-label-caps font-semibold", changeColor(l.change_percent ?? l.changePercent ?? 0))}>
                        {changePrefix(l.change_percent ?? l.changePercent ?? 0)}
                        {(l.change_percent ?? l.changePercent ?? 0).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Foreign Flow */}
            {foreignFlow && (
              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">🌍</span>
                  <span className="font-body-sm font-semibold text-on-surface">{strings.foreignFlow}</span>
                </div>
                {foreignFlow.net_buy !== undefined || foreignFlow.net_sell !== undefined ? (
                  <div className="flex gap-3">
                    <Card padding="sm" className="flex-1 border-success/20">
                      <p className="font-label-caps text-success mb-0.5">{strings.netForeignBuy}</p>
                      <p className="font-body-md font-semibold text-success">
                        {fmtMoney(foreignFlow.net_buy ?? 0)}
                      </p>
                    </Card>
                    <Card padding="sm" className="flex-1 border-danger/20">
                      <p className="font-label-caps text-danger mb-0.5">{strings.netForeignSell}</p>
                      <p className="font-body-md font-semibold text-danger">
                        {fmtMoney(foreignFlow.net_sell ?? 0)}
                      </p>
                    </Card>
                  </div>
                ) : (
                  <p className="font-body-sm text-on-surface-variant">
                    {language === "id" ? "Data tidak tersedia" : "Data not available"}
                  </p>
                )}
              </Card>
            )}

            {/* Recent News */}
            {news.length > 0 && (
              <Card padding="none">
                <div className="px-3 py-2 border-b border-outline-variant flex items-center gap-2">
                  <span className="text-sm">📰</span>
                  <span className="font-body-sm font-semibold text-on-surface">{strings.recentNews}</span>
                </div>
                <div>
                  {news.slice(0, 5).map((n, i) => (
                    <div key={i} className="px-3 py-2.5 border-b border-outline-variant last:border-0">
                      <p className="font-body-sm text-on-surface-variant line-clamp-2 leading-snug">{n.title}</p>
                      <p className="font-label-caps text-on-surface-variant mt-0.5">{n.source} · {n.date ?? n.published_at ?? ""}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* LLM Brief */}
        {brief && (
          <Card className="border-primary/25">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🤖</span>
              <p className="font-body-md font-semibold text-primary">
                {language === "id" ? "Analisis AI" : "AI Analysis"}
              </p>
            </div>
            <div className="font-body-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">
              {brief.split("\n").map((line, i) => {
                if (line.startsWith("# ")) return <h3 key={i} className="font-headline-md font-bold text-on-surface mt-2">{line.slice(2)}</h3>;
                if (line.startsWith("## ")) return <h4 key={i} className="font-title-sm font-semibold text-primary mt-1">{line.slice(3)}</h4>;
                if (line.startsWith("- ")) return <li key={i} className="ml-4">{line.slice(2)}</li>;
                if (line.startsWith("|")) return <pre key={i} className="font-label-caps bg-surface-container-high p-2 rounded overflow-x-auto my-1">{line}</pre>;
                return <p key={i}>{line}</p>;
              })}
            </div>
            <p className="font-label-caps text-on-surface-variant border-t border-outline-variant pt-2 mt-3">
              🤖 AI-generated · {strings.briefDisclaimer}
            </p>
          </Card>
        )}

        {/* Empty state */}
        {!isLoading && !hasData && (
          <EmptyState
            icon="📋"
            title={language === "id" ? "Tekan 'Buat Ringkasan' untuk memulai" : "Press 'Generate Brief' to get started"}
            description={language === "id"
              ? "Ringkasan top movers, arus asing, dan berita harian dalam satu klik."
              : "Summary of top movers, foreign flow, and daily news in one click."}
          />
        )}
      </PageContainer>
    </div>
  );
}
