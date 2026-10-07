"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSettingsStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Button, Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

const SECTOR_OPTIONS = [
  { slug: "financials", label_id: "Keuangan (Bank, Asuransi)", label_en: "Financials (Banks, Insurance)" },
  { slug: "technology", label_id: "Teknologi", label_en: "Technology" },
  { slug: "basic-materials", label_id: "Bahan Dasar (Mining)", label_en: "Basic Materials (Mining)" },
  { slug: "energy", label_id: "Energi", label_en: "Energy" },
  { slug: "healthcare", label_id: "Kesehatan", label_en: "Healthcare" },
  { slug: "consumer-goods", label_id: "Barang Konsumen", label_en: "Consumer Goods" },
  { slug: "infrastructure", label_id: "Infrastruktur & Properti", label_en: "Infrastructure & Property" },
  { slug: "industrial", label_id: "Industri", label_en: "Industrial" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState<Locale>("id");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [dailyBrief, setDailyBrief] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const { updateSettings, completeOnboarding } = useSettingsStore();
  const router = useRouter();
  const llmApiKey = useSettingsStore((s) => s.settings.llm.apiKey);

  const strings = t(lang);

  function toggleSector(slug: string) {
    setSelectedSectors((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function handleFinish() {
    if (!agreed) {
      setError(lang === "id" ? "Anda harus menyetujui disclaimer." : "You must agree to the disclaimer.");
      return;
    }
    updateSettings({
      language: lang,
      sectors: selectedSectors,
      dailyBriefEnabled: dailyBrief,
      disclaimerAgreed: true,
    });
    completeOnboarding();
    // Redirect to Settings if no API key configured, otherwise go to Chat
    router.push(llmApiKey ? "/" : "/settings");
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">
      <div className="p-6 pb-0">
        <h1 className="font-headline-xl font-bold text-on-surface">{strings.onboardingTitle}</h1>
        <p className="font-body-md text-on-surface-variant mt-1">{strings.onboardingSubtitle}</p>

        {/* Step dots */}
        <div className="flex gap-2 mt-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                s === step ? "w-8 bg-primary" : s < step ? "w-1.5 bg-primary" : "w-1.5 bg-surface-container-high"
              )}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Language */}
      {step === 1 && (
        <div className="flex-1 p-6 space-y-4">
          <div>
            <h2 className="font-headline-md font-semibold">{strings.step1Title}</h2>
            <p className="font-body-sm text-on-surface-variant">{strings.step1Subtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 mt-4">
            {(["id", "en"] as Locale[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all",
                  lang === l
                    ? "border-primary/25 bg-primary-container/15"
                    : "border-outline-variant bg-surface-container-high hover:border-outline"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    lang === l ? "border-primary bg-primary" : "border-outline"
                  )}>
                    {lang === l && <div className="w-2 h-2 rounded-full bg-on-primary" />}
                  </div>
                  <div>
                    <p className="font-body-md font-medium">{l === "id" ? "🇮🇩 Bahasa Indonesia" : "🇬🇧 English"}</p>
                    <p className="font-label-caps text-on-surface-variant">{l === "id" ? "Bahasa Indonesia" : "English"}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <Button variant="primary" size="md" fullWidth onClick={() => setStep(2)} className="mt-6">
            {strings.continue}
          </Button>
        </div>
      )}

      {/* Step 2: Market Interest */}
      {step === 2 && (
        <div className="flex-1 p-6 space-y-4">
          <div>
            <h2 className="font-headline-md font-semibold">{strings.step2Title}</h2>
            <p className="font-body-sm text-on-surface-variant">{strings.step2Subtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-2 mt-4">
            {SECTOR_OPTIONS.map((s) => (
              <button
                key={s.slug}
                type="button"
                onClick={() => toggleSector(s.slug)}
                className={cn(
                  "p-3 rounded-lg border text-left transition-all",
                  selectedSectors.includes(s.slug)
                    ? "border-primary/25 bg-primary-container/15"
                    : "border-outline-variant bg-surface-container-high hover:border-outline"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center",
                    selectedSectors.includes(s.slug) ? "border-primary bg-primary" : "border-outline"
                  )}>
                    {selectedSectors.includes(s.slug) && (
                      <svg className="w-3 h-3 text-on-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="font-body-sm">{lang === "id" ? s.label_id : s.label_en}</span>
                </div>
              </button>
            ))}
          </div>

          <p className="font-label-caps text-on-surface-variant">
            {lang === "id"
              ? "Pilih satu atau lebih. Biarkan kosong untuk semua sektor."
              : "Select one or more. Leave empty for all sectors."}
          </p>

          <div className="flex gap-3 mt-4">
            <Button variant="secondary" size="md" onClick={() => setStep(1)}>
              {strings.back}
            </Button>
            <Button variant="primary" size="md" fullWidth onClick={() => setStep(3)}>
              {strings.continue}
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Preferences */}
      {step === 3 && (
        <div className="flex-1 p-6 space-y-4">
          <div>
            <h2 className="font-headline-md font-semibold">{strings.step3Title}</h2>
            <p className="font-body-sm text-on-surface-variant">{strings.step3Subtitle}</p>
          </div>

          <div className="space-y-3 mt-4">
            <button
              type="button"
              onClick={() => setDailyBrief(!dailyBrief)}
              className={cn(
                "w-full p-4 rounded-xl border text-left transition-all",
                dailyBrief
                  ? "border-primary/25 bg-primary-container/15"
                  : "border-outline-variant bg-surface-container-high"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body-md font-medium">
                    {lang === "id" ? "📋 Ringkasan Pasar Harian" : "📋 Daily Market Brief"}
                  </p>
                  <p className="font-label-caps text-on-surface-variant mt-0.5">
                    {lang === "id"
                      ? "Ringkasan top movers, arus asing, dan berita harian"
                      : "Summary of top movers, foreign flow, and daily news"}
                  </p>
                </div>
                <div className={cn(
                  "w-5 h-5 rounded flex items-center justify-center flex-shrink-0",
                  dailyBrief ? "bg-primary" : "border border-outline"
                )}>
                  {dailyBrief && <div className="w-2 h-2 rounded-full bg-on-primary" />}
                </div>
              </div>
            </button>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="secondary" size="md" onClick={() => setStep(2)}>
              {strings.back}
            </Button>
            <Button variant="primary" size="md" fullWidth onClick={() => setStep(4)}>
              {strings.continue}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Disclaimer Agreement */}
      {step === 4 && (
        <div className="flex-1 p-6 space-y-4">
          <div>
            <h2 className="font-headline-md font-semibold">{strings.step4Title}</h2>
            <p className="font-body-sm text-on-surface-variant">{strings.step4Subtitle}</p>
          </div>

          <Card padding="md">
            <div className="flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <div>
                <p className="font-body-md font-semibold text-on-surface">{strings.disclaimerTitle}</p>
                <p className="font-body-sm text-on-surface-variant mt-1 leading-relaxed">
                  {strings.disclaimerBody}
                </p>
              </div>
            </div>
          </Card>

          <button
            type="button"
            onClick={() => { setAgreed(!agreed); setError(""); }}
            className={cn(
              "w-full p-4 rounded-xl border text-left transition-all",
              agreed ? "border-primary/25 bg-primary-container/15" : "border-outline-variant bg-surface-container-high"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                agreed ? "border-primary bg-primary" : "border-outline"
              )}>
                {agreed && (
                  <svg className="w-3 h-3 text-on-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <p className="font-body-md">{strings.disclaimerAgree}</p>
            </div>
          </button>

          {error && (
            <p className="font-body-sm text-danger bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 mt-4">
            <Button variant="secondary" size="md" onClick={() => setStep(3)}>
              {strings.back}
            </Button>
            <Button variant="primary" size="md" fullWidth onClick={handleFinish}>
              {strings.startUsing}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
