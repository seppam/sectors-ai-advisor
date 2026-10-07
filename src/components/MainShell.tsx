"use client";

import { useSettingsStore } from "@/lib/store";
import { TopBar, BottomNav } from "@/components/layout";

// P3-2: MainShell now receives children from the (app) route group layout.
// Previously it imported and rendered page components directly based on pathname,
// which caused /chat, /settings, etc. to render without TopBar/BottomNav when visited directly.
export default function MainShell({ children }: { children: React.ReactNode }) {
  const language = useSettingsStore((s) => s.settings.language);

  return (
    <div className="flex flex-col h-screen bg-surface text-on-surface">
      <TopBar />
      <div className="flex-1 overflow-hidden">{children}</div>
      <BottomNav language={language} />
    </div>
  );
}
