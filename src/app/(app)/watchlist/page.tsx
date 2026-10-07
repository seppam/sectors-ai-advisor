"use client";

import { useState, useEffect } from "react";
import { useSettingsStore } from "@/lib/store";
import { useWatchlistStore } from "@/lib/store";
import type { CompanyData } from "@/lib/types";
import { t } from "@/lib/i18n";
import { getCompanyReport } from "@/lib/sectorsApi";
import { Button, Input, Card, StatCard, EmptyState } from "@/components/ui";
import { PageContainer } from "@/components/layout";
import { cn } from "@/lib/utils";

function changeColor(pct: number) {
  if (pct > 0) return "text-success";
  if (pct < 0) return "text-danger";
  return "text-on-surface-variant";
}

export default function WatchlistPage() {
  const language = useSettingsStore((s) => s.settings.language);
  const sectorsApiKey = useSettingsStore((s) => s.settings.sectorsApiKey);
  const { items, addItem, removeItem } = useWatchlistStore();
  const strings = t(language);

  const [addInput, setAddInput] = useState("");
  const [addError, setAddError] = useState("");
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [stockData, setStockData] = useState<Record<string, CompanyData>>({});

  // P1-5: Auto-refresh prices on mount (stockData is local state, lost on reload)
  useEffect(() => {
    if (sectorsApiKey && items.length > 0) {
      items.forEach((item) => {
        if (!stockData[item.symbol]) {
          setLoading((prev) => ({ ...prev, [item.symbol]: true }));
          getCompanyReport(sectorsApiKey, item.symbol, ["summary"])
            .then((res) => {
              if (res?.data) setStockData((prev) => ({ ...prev, [item.symbol]: res.data as CompanyData }));
            })
            .catch(() => null)
            .finally(() => setLoading((prev) => ({ ...prev, [item.symbol]: false })));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectorsApiKey, items.length]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const symbol = addInput.trim().toUpperCase().replace(".JK", "");
    if (!symbol) return;
    if (!/^[A-Z]{4}$/.test(symbol)) {
      setAddError(language === "id" ? "Format simbol tidak valid. Contoh: BBCA" : "Invalid symbol format. Example: BBCA");
      return;
    }
    if (items.find((i) => i.symbol === symbol)) {
      setAddError(language === "id" ? "Sudah ada di daftar pantau" : "Already in watchlist");
      return;
    }

    if (sectorsApiKey) {
      setLoading((prev) => ({ ...prev, [symbol]: true }));
      try {
        const res = await getCompanyReport(sectorsApiKey, symbol, ["summary"]).catch(() => null);
        // P1-5: Only add to watchlist if API lookup actually succeeded with data
        if (res?.data && (res.data as { summary?: unknown }).summary) {
          setStockData((prev) => ({ ...prev, [symbol]: res.data as CompanyData }));
          addItem({ symbol, addedAt: Date.now() });
        } else {
          setAddError(
            language === "id"
              ? `Simbol "${symbol}" tidak ditemukan atau tidak memiliki data fundamental.`
              : `Symbol "${symbol}" not found or has no fundamental data.`
          );
        }
      } finally {
        setLoading((prev) => ({ ...prev, [symbol]: false }));
      }
    } else {
      // No API key — add without price data
      addItem({ symbol, addedAt: Date.now() });
    }

    setAddInput("");
    setAddError("");
  }

  return (
    <div className="h-full overflow-y-auto">
      <PageContainer className="py-4 space-y-4 pb-8">
        {/* Header */}
        <div>
          <h2 className="font-headline-md font-bold text-on-surface">{strings.watchlistTitle}</h2>
          <p className="font-label-caps text-on-surface-variant mt-0.5">
            {language === "id" ? "Pantau saham yang kamu minati" : "Track stocks you're interested in"}
          </p>
        </div>

        {/* Add form */}
        <form onSubmit={handleAdd} className="flex gap-2">
          <Input
            value={addInput}
            onChange={(v) => { setAddInput(v.toUpperCase()); setAddError(""); }}
            placeholder={strings.symbolPlaceholder}
            error={addError}
            maxLength={6}
            className="flex-1"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {strings.addSymbol}
          </Button>
        </form>

        {/* Empty state */}
        {items.length === 0 && (
          <EmptyState
            icon="📋"
            title={strings.watchlistEmpty}
            description={strings.watchlistEmptyHint}
          />
        )}

        {/* Watchlist items */}
        {items.length > 0 && (
          <div className="space-y-2">
            {items.map((item) => {
              const data = stockData[item.symbol];
              const loadingThis = loading[item.symbol];

              return (
                <Card key={item.symbol} padding="none">
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div>
                        <span className="font-body-md font-bold text-on-surface">{item.symbol}</span>
                        {data?.company_name && (
                          <span className="block font-label-caps text-on-surface-variant truncate max-w-[140px]">
                            {data.company_name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {loadingThis ? (
                        <div className="w-4 h-4 border-2 border-outline border-t-primary rounded-full animate-spin" />
                      ) : data ? (
                        <div className="text-right">
                          <p className="font-body-sm font-medium text-on-surface">
                            {data.summary?.last_close
                              ? `IDR ${data.summary.last_close.toLocaleString("id-ID")}`
                              : "—"}
                          </p>
                          {data.summary?.daily_close_change !== undefined && (
                            <p className={cn("font-label-caps font-semibold", changeColor(data.summary.daily_close_change * 100))}>
                              {data.summary.daily_close_change > 0 ? "+" : ""}
                              {(data.summary.daily_close_change * 100).toFixed(2)}%
                            </p>
                          )}
                        </div>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => removeItem(item.symbol)}
                        className={cn(
                          "w-7 h-7 flex items-center justify-center rounded-lg",
                          "bg-danger/10 hover:bg-danger/20 text-danger",
                          "transition-colors duration-150"
                        )}
                        title={strings.remove}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Key metrics */}
                  {data?.summary && (
                    <div className="border-t border-outline-variant px-3 py-2 grid grid-cols-4 gap-2">
                      {[
                        { label: "P/E", value: data.summary.forward_pe ? data.summary.forward_pe.toFixed(1) : "—" },
                        { label: "PBV", value: data.summary.pb_mrq ? data.summary.pb_mrq.toFixed(2) : "—" },
                        { label: "ROE", value: data.summary.roe_ttm ? `${(data.summary.roe_ttm * 100).toFixed(1)}%` : "—" },
                        { label: "DER", value: data.summary.der_mrq ? data.summary.der_mrq.toFixed(2) : "—" },
                      ].map((metric) => (
                        <StatCard key={metric.label} label={metric.label} value={metric.value} />
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </PageContainer>
    </div>
  );
}
