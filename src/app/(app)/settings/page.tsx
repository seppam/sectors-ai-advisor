"use client";

import { useState } from "react";
import { useSettingsStore } from "@/lib/store";
import { useChatStore } from "@/lib/store";
import { useWatchlistStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { validateApiKey } from "@/lib/sectorsApi";
import { Button, Input, Card, Toggle, Badge } from "@/components/ui";
import { PageContainer } from "@/components/layout";
import { cn } from "@/lib/utils";
import type { LLMProvider } from "@/lib/types";

const LLM_PROVIDERS: Array<{ value: LLMProvider; label: string; docs: string; hint?: string }> = [
  { value: "anthropic", label: "Anthropic Claude", docs: "https://console.anthropic.com/settings/keys" },
  { value: "openai", label: "OpenAI GPT-4o", docs: "https://platform.openai.com/api-keys" },
  { value: "deepseek", label: "DeepSeek V3", docs: "https://platform.deepseek.com/api-docs/api" },
  { value: "custom", label: "Other (OpenAI-compat)", docs: "https://openrouter.ai/docs", hint: "Supports OpenRouter, nexotao, LM Studio, Azure OpenAI, and any OpenAI-compatible gateway" },
];

/* SVG Icons — no emoji dependencies */
const IconChart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
    <path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
  </svg>
);

const IconBot = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
    <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16.01" /><line x1="16" y1="16" x2="16" y2="16.01" />
  </svg>
);

const IconGlobe = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const IconWarning = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-danger">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-3 h-3 inline-block ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export default function SettingsPage() {
  const language = useSettingsStore((s) => s.settings.language);
  const settings = useSettingsStore((s) => s.settings);
  const { updateSettings, resetAll } = useSettingsStore();
  const strings = t(language);

  const [sectorsApiKey, setSectorsApiKey] = useState(settings.sectorsApiKey);
  const [llmProvider, setLlmProvider] = useState<LLMProvider>(settings.llm.provider);
  const [llmApiKey, setLlmApiKey] = useState(settings.llm.apiKey);
  const [customBaseUrl, setCustomBaseUrl] = useState(settings.llm.customBaseUrl ?? "");
  const [customModel, setCustomModel] = useState(settings.llm.customModel ?? "");
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [keyValid, setKeyValid] = useState<boolean | null>(null);
  const [checkingCredits, setCheckingCredits] = useState(false);

  async function checkCredits() {
    if (!sectorsApiKey) return;
    setCheckingCredits(true);
    try {
      const { ok } = await validateApiKey(sectorsApiKey);
      setKeyValid(ok);
    } catch {
      setKeyValid(false);
    } finally {
      setCheckingCredits(false);
    }
  }

  function handleSave() {
    // P2-3: Validate custom base URL uses HTTPS (except localhost)
    if (customBaseUrl && customBaseUrl.trim()) {
      let url = customBaseUrl.trim();
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }
      try {
        const parsed = new URL(url);
        const isLocalhost = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
        if (parsed.protocol !== "https:" && !isLocalhost) {
          setSaveError(language === "id"
            ? "URL harus menggunakan HTTPS (kecuali localhost)"
            : "URL must use HTTPS (localhost is allowed)");
          return;
        }
        if (!isLocalhost) {
          console.warn(`[Security] LLM key will be sent to: ${parsed.origin}`);
        }
        setCustomBaseUrl(url);
      } catch {
        setSaveError(language === "id" ? "URL tidak valid" : "Invalid URL");
        return;
      }
    }

    setSaveError("");
    updateSettings({
      sectorsApiKey,
      llm: { provider: llmProvider, apiKey: llmApiKey, customBaseUrl, customModel },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    if (sectorsApiKey) checkCredits();
  }

  // P1-6: Reset actually clears all stores + localStorage + page reload
  function handleReset() {
    // Clear chat and watchlist stores (clearMessages/clearItems already exist in store.ts)
    useChatStore.getState().clearMessages();
    useWatchlistStore.getState().clearItems();
    // Clear all localStorage stores
    localStorage.removeItem('sectors-advisor-chat');
    localStorage.removeItem('sectors-advisor-watchlist');
    // Reset settings store
    resetAll();
    // Reload to re-initialize stores from defaults
    window.location.reload();
  }

  function handleProviderChange(p: LLMProvider) {
    setLlmProvider(p);
    if (p !== "custom") {
      setCustomBaseUrl("");
      setCustomModel("");
    }
  }

  const inputClass = cn(
    "w-full bg-surface-container-high border border-outline-variant rounded-md",
    "px-3 py-[10px] font-body-md text-on-surface placeholder:text-on-surface-variant",
    "focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30",
    "disabled:opacity-40 disabled:cursor-not-allowed",
    "transition-colors duration-150"
  );

  return (
    <div className="h-full overflow-y-auto">
      <PageContainer className="py-4 space-y-4 pb-12">
        {/* Header */}
        <div>
          <h2 className="font-headline-xl font-bold text-on-surface">{strings.settingsTitle}</h2>
          <p className="font-label-caps text-on-surface-variant mt-1">
            {language === "id" ? "Kelola API key dan preferensi" : "Manage API keys and preferences"}
          </p>
        </div>

        {/* Security warning */}
        <Card padding="sm" className="border-warning/20 bg-warning/5">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.918-.931 1.918-2 0-1.385-1.343-2.5-3-2.5s-3 1.115-3 2.5c0 .563.232 1.075.624 1.449M12 3v1m0 16v1m9-11h-1a2 2 0 00-2 2v6a2 2 0 002 2h1a2 2 0 002-2V9.83a2 2 0 00-.59-1.42L18 6" />
            </svg>
            <div>
              <p className="font-body-sm font-semibold text-warning">
                {language === "id" ? "Peringatan Keamanan" : "Security Notice"}
              </p>
              <p className="font-label-caps text-on-surface-variant mt-0.5 leading-relaxed">
                {language === "id"
                  ? "API key disimpan di localStorage browser. Ini aman untuk penggunaan pribadi, tetapi dapat diakses oleh JavaScript di halaman ini. Jangan gunakan di komputer bersama."
                  : "API keys are stored in browser localStorage. This is safe for personal use, but keys can be accessed by JavaScript on this page. Do not use on shared computers."}
              </p>
            </div>
          </div>
        </Card>

        {/* Saved toast */}
        {saved && (
          <Card padding="sm" className="border-success/20 bg-success/5">
            <div className="flex items-center gap-2 text-success">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-body-sm font-medium">{strings.saved}</span>
            </div>
          </Card>
        )}

        {/* Save error toast */}
        {saveError && (
          <Card padding="sm" className="border-danger/20 bg-danger/5">
            <div className="flex items-center gap-2 text-danger">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-body-sm font-medium">{saveError}</span>
            </div>
          </Card>
        )}

        {/* Sectors API */}
        <Card padding="lg">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
              <IconChart />
            </div>
            <h3 className="text-[1.125rem] font-bold text-on-surface">{strings.sectorsApiSection}</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[0.875rem] font-semibold text-on-surface mb-1.5">{strings.sectorsApiKey}</label>
              <Input
                type="password"
                value={sectorsApiKey}
                onChange={setSectorsApiKey}
                placeholder={strings.sectorsApiKeyPlaceholder}
                className="w-full"
              />
              <a
                href="https://sectors.app/api"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-label-caps text-primary hover:text-primary-fixed mt-1.5 transition-colors"
              >
                {strings.sectorsApiLink}
                <ExternalLinkIcon />
              </a>
            </div>

            {sectorsApiKey && (
              <div className="flex items-center gap-2 pt-1">
                <Button variant="ghost" size="sm" onClick={checkCredits} isLoading={checkingCredits}>
                  {strings.sectorsApiBalance}
                </Button>
                {keyValid !== null && (
                  <Badge variant={keyValid ? "success" : "danger"}>{keyValid ? (language === "id" ? "Key valid" : "Key valid") : (language === "id" ? "Key tidak valid" : "Key invalid")}</Badge>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* LLM Provider */}
        <Card padding="lg">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
              <IconBot />
            </div>
            <h3 className="text-[1.125rem] font-bold text-on-surface">{strings.llmSection}</h3>
          </div>

          {/* Provider selector */}
          <div className="mb-4">
            <label className="block text-[0.875rem] font-semibold text-on-surface mb-2">{strings.llmProvider}</label>
            <div className="grid grid-cols-2 gap-2">
              {LLM_PROVIDERS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => handleProviderChange(p.value)}
                  className={cn(
                    "px-3 py-2.5 rounded-lg border text-left transition-all duration-150",
                    llmProvider === p.value
                      ? "border-primary/25 bg-primary-container/15 shadow-sm"
                      : "border-outline-variant bg-surface-container-high hover:border-outline hover:bg-surface-bright"
                  )}
                >
                  <span className={cn(
                    "font-body-sm font-medium block",
                    llmProvider === p.value ? "text-primary" : "text-on-surface-variant"
                  )}>
                    {p.label}
                  </span>
                  {llmProvider === p.value && p.hint && (
                    <span className="font-label-caps text-on-surface-variant block mt-0.5">{p.hint}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* API Key */}
          <div className="mb-2">
            <label className="block text-[0.875rem] font-semibold text-on-surface mb-1.5">{strings.llmApiKey}</label>
            <Input
              type="password"
              value={llmApiKey}
              onChange={setLlmApiKey}
              placeholder={strings.llmApiKeyPlaceholder}
              className="w-full"
            />
            <a
              href={LLM_PROVIDERS.find((p) => p.value === llmProvider)?.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-label-caps text-primary hover:text-primary-fixed mt-1.5 transition-colors"
            >
              {llmProvider === "anthropic" && strings.llmLinkAnthropic}
              {llmProvider === "openai" && strings.llmLinkOpenAI}
              {llmProvider === "deepseek" && strings.llmLinkDeepSeek}
              {llmProvider === "custom" && "Browse docs at openrouter.ai/docs"}
              <ExternalLinkIcon />
            </a>
          </div>

          {/* Custom provider fields */}
          {llmProvider === "custom" && (
            <div className="space-y-3 border border-outline-variant rounded-lg p-4 bg-surface/50 mt-3">
              <div>
                <label className="block text-[0.875rem] font-semibold text-on-surface mb-1.5">Base URL</label>
                <input
                  type="text"
                  value={customBaseUrl}
                  onChange={(e) => setCustomBaseUrl(e.target.value)}
                  placeholder="https://openrouter.ai/api/v1"
                  className={inputClass}
                />
                <p className="font-label-caps text-on-surface-variant mt-1">OpenAI-compatible base URL. No trailing slash.</p>
              </div>
              <div>
                <label className="block text-[0.875rem] font-semibold text-on-surface mb-1.5">Model Name</label>
                <input
                  type="text"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  placeholder="deepseek/deepseek-chat-v3-0324"
                  className={inputClass}
                />
                <p className="font-label-caps text-on-surface-variant mt-1">
                  For OpenRouter, use <code className="text-on-surface-variant bg-surface-container-high px-1 py-0.5 rounded text-[11px]">author/model</code> format.
                </p>
              </div>

              {/* Quick-fill examples */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {[
                  { label: "OpenRouter + DeepSeek V3", url: "https://openrouter.ai/api/v1", model: "deepseek/deepseek-chat-v3-0324" },
                  { label: "OpenRouter + Claude Sonnet 4", url: "https://openrouter.ai/api/v1", model: "anthropic/claude-sonnet-4-20250514" },
                  { label: "LM Studio (local)", url: "http://localhost:1234/v1", model: "llama3" },
                  { label: "nexotao + DeepSeek", url: "https://api.nexotao.com/v1", model: "deepseek-chat" },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => { setCustomBaseUrl(preset.url); setCustomModel(preset.model); }}
                    className="font-label-caps text-on-surface-variant hover:text-primary hover:border-primary/40 border border-outline-variant hover:bg-surface-container-high rounded-md px-3 py-2 transition-all text-left"
                  >
                    📡 {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Language */}
        <Card padding="lg">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
              <IconGlobe />
            </div>
            <h3 className="text-[1.125rem] font-bold text-on-surface">{strings.languageSection}</h3>
          </div>
          <Toggle
            options={[
              { value: "id", label: "🇮🇩 Bahasa Indonesia" },
              { value: "en", label: "🇬🇧 English" },
            ]}
            value={language}
            onChange={(v) => updateSettings({ language: v as "id" | "en" })}
          />
        </Card>

        {/* Save button */}
        <Button variant="primary" size="md" fullWidth onClick={handleSave}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          {language === "id" ? "Simpan Pengaturan" : "Save Settings"}
        </Button>

        {/* Danger zone */}
        <div className="pt-2">
          <Card padding="lg" className="border-danger/20 bg-danger/[0.02]">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-danger/10 border border-danger/20 flex items-center justify-center">
                <IconWarning />
              </div>
              <h3 className="font-title-sm font-semibold text-danger">{strings.dangerZone}</h3>
            </div>
            <p className="font-body-sm text-on-surface-variant mb-4 leading-relaxed">
              {language === "id"
                ? "Menghapus semua data termasuk chat history, watchlist, dan pengaturan."
                : "This will delete all data including chat history, watchlist, and settings."}
            </p>
            {!showResetConfirm ? (
              <Button variant="danger" size="sm" onClick={() => setShowResetConfirm(true)}>
                {strings.resetAll}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="danger" size="sm" onClick={handleReset}>
                  {language === "id" ? "Ya, hapus semua data" : "Yes, delete all data"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowResetConfirm(false)}>
                  {language === "id" ? "Batal" : "Cancel"}
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Footer credits */}
        <p className="text-center font-label-caps text-on-surface-variant pt-2">
          Sectors AI Advisor · Sectors Hackathon 2026 · Track: AI Agents &amp; Assistants
        </p>
      </PageContainer>
    </div>
  );
}
