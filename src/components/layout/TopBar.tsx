"use client";

import Link from "next/link";
import { useSettingsStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import type { Language } from "@/lib/types";

const LOGO_URL =
  "https://lh3.googleusercontent.com/aida/AEtjO1XMcbmErg4ga-uXn8KSetpPBHOOxH_uEbjJWVYtbfUYdGWy-O948w9qp8hAX6_KIT2bRQKgvlbIzyVg89YdvssTjflccLyeUuNxoA3EWSrAiK5IaIiGZSbYZa6mtjXKo4XH5NsqjFUU9iBLtUar12T7nS4gjoJER5IlYo5FfloBFcnkSk1QDQM-8Zd0g6Rdb33UixW_-KQXb2efSFNyuCh2ftW4hKamJt1H99LktJpg";

export default function TopBar() {
  const language = useSettingsStore((s) => s.settings.language);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const strings = t(language);

  function handleLanguageChange(lang: Language) {
    updateSettings({ language: lang });
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 glass-bar pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-14 px-margin flex items-center justify-between">
        {/* Left: Logo + App name + subtitle */}
        <Link href="/" className="flex items-center gap-space-sm group">
          <img
            alt="Sectors AI Logo"
            className="h-8 w-auto object-contain"
            src={LOGO_URL}
          />
          <div className="flex flex-col">
            <span className="font-title-sm text-title-sm text-on-surface tracking-tight leading-none">
              Sectors AI
            </span>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              {language === "id" ? "Obrolan" : "Chat"}
            </span>
          </div>
        </Link>

        {/* Right: Language toggle + profile avatar */}
        <div className="flex items-center gap-space-sm">
          {/* Language switcher */}
          <div
            aria-label="Language switch"
            className="inline-flex items-center p-0.5 bg-surface-container-high rounded-full"
            role="group"
          >
            <button
              type="button"
              onClick={() => handleLanguageChange("id")}
              className={`min-w-[28px] h-7 px-1.5 rounded-full font-mono-metric-sm text-mono-metric-sm font-semibold flex items-center justify-center transition-colors ${
                language === "id"
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              ID
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange("en")}
              className={`min-w-[28px] h-7 px-1.5 rounded-full font-mono-metric-sm text-mono-metric-sm font-semibold flex items-center justify-center transition-colors ${
                language === "en"
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              EN
            </button>
          </div>

          {/* Profile avatar */}
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
