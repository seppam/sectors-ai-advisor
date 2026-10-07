// ============================================================
// Design Tokens — Sectors AI Advisor
// These constants are for reference; Tailwind config uses the values.
// ============================================================

export const COLORS = {
  // Base (Dark Theme)
  bgPrimary: "#0B1120",
  bgSecondary: "#111827",
  bgTertiary: "#1F2937",
  bgElevated: "#1E293B",

  // Text
  textPrimary: "#F8FAFC",
  textSecondary: "#CBD5E1",
  textTertiary: "#64748B",
  textMuted: "#475569",

  // Accent (Teal)
  accent: "#14B8A6",
  accentHover: "#0D9488",
  accentSubtle: "rgba(20,184,166,0.10)",
  accentBorder: "rgba(20,184,166,0.25)",

  // Semantic
  success: "#22C55E",
  danger: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",

  // Border
  borderDefault: "rgba(148,163,184,0.10)",
  borderStrong: "rgba(148,163,184,0.18)",
  borderSubtle: "rgba(148,163,184,0.06)",
} as const;

export const SPACING = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
} as const;

export const RADIUS = {
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "18px",
  full: "9999px",
} as const;

export const FONT_SIZE = {
  display: "1.75rem",   // 28px, weight 800
  h1: "1.375rem",       // 22px, weight 700
  h2: "1.0625rem",      // 17px, weight 600
  h3: "0.875rem",       // 14px, weight 600
  body: "0.875rem",     // 14px, weight 400
  bodySm: "0.8125rem",  // 13px, weight 400
  caption: "0.75rem",   // 12px, weight 400
  overline: "0.6875rem",// 11px, weight 500
} as const;

export const SHADOWS = {
  sm: "0 1px 2px rgba(0,0,0,0.3)",
  md: "0 4px 12px rgba(0,0,0,0.25)",
  lg: "0 8px 24px rgba(0,0,0,0.3)",
} as const;

// Helper: build a CSS variable name
export function varName(name: string): string {
  return `--ds-${name}`;
}
