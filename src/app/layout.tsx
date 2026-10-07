import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sectors AI Advisor — Hackathon 2026",
  description:
    "AI-powered investment assistant for Indonesian retail investors. Built on Sectors API + LLM. Sectors Hackathon 2026 Track 01: AI Agents & Assistants.",
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Sectors AI Advisor",
    description: "AI investment assistant for Indonesian markets — plain-language IDX insights powered by Sectors API.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Sectors AI Advisor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sectors AI Advisor",
    description: "Plain-language IDX insights powered by Sectors API.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        {/* Google Fonts: Inter + JetBrains Mono + Material Symbols Outlined */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
