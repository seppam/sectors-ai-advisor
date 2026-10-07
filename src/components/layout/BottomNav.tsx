"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  id: string;
  labelId: string;
  labelEn: string;
  icon: string; // Material Symbol name
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "chat",
    labelId: "Obrolan",
    labelEn: "Chat",
    icon: "forum",
    href: "/",
  },
  {
    id: "brief",
    labelId: "Ringkasan",
    labelEn: "Summary",
    icon: "analytics",
    href: "/daily-brief",
  },
  {
    id: "watchlist",
    labelId: "Pantau",
    labelEn: "Watchlist",
    icon: "candlestick_chart",
    href: "/watchlist",
  },
  {
    id: "settings",
    labelId: "Pengaturan",
    labelEn: "Settings",
    icon: "settings",
    href: "/settings",
  },
];

interface BottomNavProps {
  language?: "id" | "en";
}

export default function BottomNav({ language = "id" }: BottomNavProps) {
  const pathname = usePathname();

  function isActive(item: NavItem): boolean {
    if (item.href === "/") return pathname === "/" || pathname === "/chat";
    return pathname.startsWith(item.href);
  }

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe glass-bar shadow-[0_-2px_12px_rgba(0,0,0,0.12)]">
      <div className="flex justify-around items-center h-16 px-space-xs">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          const label = language === "id" ? item.labelId : item.labelEn;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-12 transition-colors ${
                active
                  ? "text-primary font-semibold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              <span className="font-label-caps text-label-caps">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
