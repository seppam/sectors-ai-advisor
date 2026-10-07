import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      colors: {
        // Base
        "bg-primary": "#0B1120",
        "bg-secondary": "#111827",
        "bg-tertiary": "#1F2937",
        "bg-elevated": "#1E293B",
        // Text
        "text-primary": "#F8FAFC",
        "text-secondary": "#CBD5E1",
        "text-tertiary": "#64748B",
        "text-muted": "#475569",
        // Accent (Teal)
        accent: "#14B8A6",
        "accent-hover": "#0D9488",
        "accent-subtle": "rgba(20,184,166,0.10)",
        "accent-border": "rgba(20,184,166,0.25)",
        // Semantic
        success: "#22C55E",
        danger: "#EF4444",
        warning: "#F59E0B",
        info: "#3B82F6",
        // Border
        "border-default": "rgba(148,163,184,0.10)",
        "border-strong": "rgba(148,163,184,0.18)",
        "border-subtle": "rgba(148,163,184,0.06)",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "18px",
      },
      spacing: {
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
      },
      fontSize: {
        display: ["1.75rem", { lineHeight: "1.2", fontWeight: "800" }],
        h1: ["1.375rem", { lineHeight: "1.3", fontWeight: "700" }],
        h2: ["1.0625rem", { lineHeight: "1.35", fontWeight: "600" }],
        h3: ["0.875rem", { lineHeight: "1.4", fontWeight: "600" }],
        body: ["0.875rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["0.8125rem", { lineHeight: "1.5", fontWeight: "400" }],
        caption: ["0.75rem", { lineHeight: "1.4", fontWeight: "400" }],
        overline: ["0.6875rem", { lineHeight: "1.3", fontWeight: "500" }],
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.3)",
        md: "0 4px 12px rgba(0,0,0,0.25)",
        lg: "0 8px 24px rgba(0,0,0,0.3)",
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fade-in 0.4s ease both",
        "slide-up": "slide-up 0.35s cubic-bezier(0.16,1,0.3,1) both",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      maxWidth: {
        container: "1024px",
        "landing-container": "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
