"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Badge, Card } from "@/components/ui";
import { PageContainer } from "@/components/layout";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/types";

/* ============================================================
   DATA — Product-focused content (NO hackathon info)
   ============================================================ */

const FEATURES = [
  {
    iconName: "chat_bubble",
    iconColor: "text-primary bg-primary/15",
    iconBorder: "border-primary/25",
    title: "Chat dalam Bahasa Indonesia",
    titleEn: "Chat in Bahasa Indonesia",
    desc: "Tanyakan tentang saham pakai bahasa sehari-hari. AI memahami konteks pasar modal Indonesia.",
    descEn: "Ask about stocks in everyday language. AI understands Indonesian capital market context.",
  },
  {
    iconName: "menu_book",
    iconColor: "text-secondary bg-secondary/15",
    iconBorder: "border-secondary/25",
    title: "Klik Istilah untuk Belajar",
    titleEn: "Tap Terms to Learn",
    desc: "Setiap istilah keuangan bisa diklik. Lihat rumus, contoh perhitungan, dan benchmark.",
    descEn: "Every financial term is tappable. See formulas, calculation examples, and benchmarks.",
  },
  {
    iconName: "cloud_sync",
    iconColor: "text-tertiary bg-tertiary/15",
    iconBorder: "border-tertiary/25",
    title: "Data Langsung dari Sectors API",
    titleEn: "Live Data from Sectors API",
    desc: "Fundamental, rasio keuangan, dan berita diambil real-time dari Sectors — bukan tebakan AI.",
    descEn: "Fundamentals, financial ratios, and news fetched real-time from Sectors — not AI guesses.",
  },
  {
    iconName: "shield",
    iconColor: "text-success bg-success/15",
    iconBorder: "border-success/25",
    title: "Aman & Patuh Regulasi",
    titleEn: "Safe & Compliant",
    desc: "Tidak ada rekomendasi beli/jual. Tidak ada prediksi harga. Disclaimer di setiap jawaban.",
    descEn: "No buy/sell recommendations. No price predictions. Disclaimer on every response.",
  },
  {
    iconName: "today",
    iconColor: "text-primary bg-primary/15",
    iconBorder: "border-primary/25",
    title: "Ringkasan Pasar Harian",
    titleEn: "Daily Market Brief",
    desc: "Satu klik untuk dapatkan ringkasan top movers, arus asing, dan berita penting hari ini.",
    descEn: "One click for a summary of today's top movers, foreign flow, and key news.",
  },
  {
    iconName: "psychology",
    iconColor: "text-on-surface-variant bg-surface-container-highest",
    iconBorder: "border-outline-variant",
    title: "Pakai LLM Apapun",
    titleEn: "Use Any LLM",
    desc: "Anthropic, OpenAI, DeepSeek, atau gateway OpenAI-compatible mana saja. Pilih sendiri.",
    descEn: "Anthropic, OpenAI, DeepSeek, or any OpenAI-compatible gateway. Your choice.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Masukkan API Key",
    titleEn: "Enter API Keys",
    desc: "Daftarkan API key Sectors dan LLM pilihanmu. Tidak perlu server.",
    descEn: "Register your Sectors API key and preferred LLM. No server needed.",
  },
  {
    step: "02",
    title: "Tanya dalam Bahasa Indonesia",
    titleEn: "Ask in Indonesian",
    desc: 'Ketik pertanyaan seperti "BBCA mahal nggak?" atau "Bandingkan bank dengan DER rendah".',
    descEn: 'Type questions like "Is BBCA expensive?" or "Compare banks with low DER".',
  },
  {
    step: "03",
    title: "Dapatkan Jawaban + Data",
    titleEn: "Get Answers + Data",
    desc: "AI menjawab berdasarkan data fundamental dari Sectors. Klik istilah untuk penjelasan.",
    descEn: "AI answers based on fundamental data from Sectors. Tap terms for explanations.",
  },
];

const EXAMPLE_QUESTIONS_ID = [
  '"BBCA harganya udah mahal belum?"',
  '"Bandingkan BBCA dan BBRI"',
  '"Saham bank mana yang ROE-nya di atas 15%?"',
  '"Top gainers hari ini"',
];

const EXAMPLE_QUESTIONS_EN = [
  '"Is BBCA overpriced right now?"',
  '"Compare BBCA vs BBRI fundamentals"',
  '"Which banks have ROE above 15%?"',
  '"Today\'s top gainers"',
];

const TECH_STACK = [
  { name: "Next.js", desc: "React Framework" },
  { name: "Tailwind CSS v4", desc: "Utility-first CSS" },
  { name: "Sectors API", desc: "Data Provider" },
  { name: "LLM Gateway", desc: "AI Engine" },
];

function FeatureIcon({ name, color, border }: { name: string; color: string; border: string }) {
  return (
    <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center border", color, border)}>
      <span className="material-symbols-outlined text-xl">{name}</span>
    </div>
  );
}

/* ============================================================
   COMPONENT
   ============================================================ */

export default function LandingPage() {
  const [lang, setLang] = useState<Language>("id");
  const isId = lang === "id";

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans">
      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 h-14 flex items-center glass-bar border-b border-outline-variant">
        <PageContainer className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Logo */}
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm shadow-md">
              S
            </div>
            <span className="font-title-sm font-bold text-on-surface">Sectors AI Advisor</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLang((l) => (l === "id" ? "en" : "id"))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label-caps font-medium
                bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high
                border border-transparent hover:border-outline-variant
                transition-colors duration-150 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">language</span>
              {isId ? "EN" : "ID"}
            </button>

            <Link href="/onboarding">
              <Button variant="primary" size="sm">
                {isId ? "Buka App" : "Open App"}
              </Button>
            </Link>
          </div>
        </PageContainer>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-20 pb-16 px-4">
        <PageContainer maxWidth="landing" className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-container/15 border border-primary/25 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce-dot" />
            <span className="font-label-caps font-medium text-primary">
              {isId ? "Powered by Sectors API" : "Powered by Sectors API"}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-headline-xl-mobile md:font-headline-xl text-on-surface mb-5 leading-tight">
            {isId ? "Asisten Investasi AI" : "AI Investment Assistant"}{" "}
            <span className="text-primary">{isId ? "untuk Pasar Indonesia" : "for Indonesian Markets"}</span>
          </h1>

          {/* Subtitle */}
          <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
            {isId
              ? "Tanyakan tentang saham dalam Bahasa Indonesia. Pahami rasio keuangan. Pantau pasar setiap hari. Semua ditenagai oleh AI dengan data langsung dari Sectors."
              : "Ask about stocks in plain language. Understand financial ratios. Monitor the market daily. All powered by AI with live data from Sectors."}
          </p>

          {/* ONE CTA Button */}
          <div className="flex items-center justify-center mb-4">
            <Link href="/onboarding">
              <Button variant="primary" size="lg">
                <span className="material-symbols-outlined text-lg">bolt</span>
                {isId ? "Mulai Sekarang" : "Get Started Free"}
              </Button>
            </Link>
          </div>

          <p className="font-label-caps text-on-surface-variant">
            {isId ? "Gratis · Tidak perlu kartu kredit · Setup dalam 2 menit" : "Free · No credit card · 2-minute setup"}
          </p>
        </PageContainer>
      </section>

      {/* ── EXAMPLE QUESTIONS ── */}
      <section className="py-12 px-4 border-y border-outline-variant">
        <PageContainer maxWidth="landing" className="max-w-2xl mx-auto">
          <p className="text-center font-body-sm text-on-surface-variant mb-6">
            {isId ? "Contoh pertanyaan yang bisa kamu tanyakan:" : "Example questions you can ask:"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(isId ? EXAMPLE_QUESTIONS_ID : EXAMPLE_QUESTIONS_EN).map((q, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-xl",
                  "bg-surface-container-low border border-outline-variant",
                  "hover:border-primary/40 hover:bg-surface-container-high",
                  "transition-colors duration-150 cursor-default"
                )}
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center mt-0.5">
                  <span className="font-label-caps font-bold text-primary">{i + 1}</span>
                </div>
                <p className="font-body-sm text-on-surface-variant leading-relaxed">{q}</p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* ── FEATURES GRID ── */}
      <section id="features" className="py-20 px-4">
        <PageContainer maxWidth="landing" className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-14">
            <Badge variant="accent">{isId ? "Fitur Utama" : "Key Features"}</Badge>
            <h2 className="font-headline-xl text-on-surface mt-4 mb-3">
              {isId ? "Semua yang kamu butuhkan" : "Everything you need"}{" "}
              <span className="text-primary">{isId ? "untuk mulai investasi" : "to start investing"}</span>
            </h2>
            <p className="font-body-md text-on-surface-variant max-w-xl mx-auto">
              {isId
                ? "Dibuat khusus untuk investor pemula Indonesia yang ingin belajar sambil berinvestasi."
                : "Built specifically for beginner investors in Indonesia who want to learn while investing."}
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <Card key={f.title} padding="lg" className="group">
                <FeatureIcon name={f.iconName} color={f.iconColor} border={f.iconBorder} />
                <h3 className="font-title-sm font-semibold text-on-surface mb-2 mt-4">
                  {isId ? f.title : f.titleEn}
                </h3>
                <p className="font-body-sm text-on-surface-variant leading-relaxed">
                  {isId ? f.desc : f.descEn}
                </p>
              </Card>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* ── HOW IT WORKS — Vertical Timeline ── */}
      <section className="py-20 px-4 bg-surface-container-lowest border-y border-outline-variant">
        <PageContainer maxWidth="md" className="max-w-xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline-xl text-on-surface mb-2">
              {isId ? "Cara Kerjanya" : "How It Works"}
            </h2>
            <p className="font-body-sm text-on-surface-variant">
              {isId ? "Mulai dalam 3 langkah mudah" : "Get started in 3 easy steps"}
            </p>
          </div>

          <div className="relative">
            {/* Vertical connecting line */}
            <div className="absolute left-[20px] top-10 bottom-10 w-px bg-outline-variant" />

            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="flex gap-5 pb-10 last:pb-0">
                {/* Step number circle */}
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-body-sm font-bold z-10 relative">
                    {step.step}
                  </div>
                </div>

                {/* Content */}
                <div className="pt-1.5">
                  <h3 className="font-title-sm font-semibold text-on-surface mb-1.5">
                    {isId ? step.title : step.titleEn}
                  </h3>
                  <p className="font-body-sm text-on-surface-variant leading-relaxed">
                    {isId ? step.desc : step.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* ── TECH STACK ── */}
      <section className="py-20 px-4">
        <PageContainer maxWidth="landing" className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline-xl text-on-surface mb-2">
              {isId ? "Teknologi" : "Tech Stack"}
            </h2>
            <p className="font-body-sm text-on-surface-variant">
              {isId ? "Dibangun dengan teknologi modern" : "Built with modern technology"}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TECH_STACK.map((tech) => (
              <div
                key={tech.name}
                className="text-center p-5 rounded-xl bg-surface-container-low border border-outline-variant"
              >
                <div className="font-title-sm font-bold text-primary mb-1">{tech.name}</div>
                <div className="font-label-caps text-on-surface-variant">{tech.desc}</div>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-24 px-4 bg-surface-container-lowest border-t border-outline-variant">
        <PageContainer maxWidth="sm" className="text-center max-w-lg mx-auto">
          {/* Gradient icon box */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="material-symbols-outlined text-2xl text-on-primary">bolt</span>
          </div>

          <h2 className="font-headline-xl text-on-surface mb-3">
            {isId ? "Siap Memulai?" : "Ready to Start?"}
          </h2>

          <p className="font-body-md text-on-surface-variant mb-8 leading-relaxed">
            {isId
              ? "Tidak perlu kartu kredit. Tidak ada biaya tersembunyi. Coba gratis sekarang."
              : "No credit card needed. No hidden costs. Try it free now."}
          </p>

          <Link href="/onboarding">
            <Button variant="primary" size="xl">
              <span className="material-symbols-outlined text-lg">bolt</span>
              {isId ? "Buka Sectors AI Advisor" : "Open Sectors AI Advisor"}
            </Button>
          </Link>

          <p className="font-label-caps text-on-surface-variant mt-6">
            {isId ? "Powered by Sectors API" : "Powered by Sectors API"}
          </p>
        </PageContainer>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-outline-variant py-8 px-4">
        <PageContainer maxWidth="landing" className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary-container font-bold text-[10px]">
              S
            </div>
            <span className="font-label-caps text-on-surface-variant">
              © 2026 Sectors AI Advisor
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://sectors.app/api" target="_blank" rel="noopener noreferrer" className="font-label-caps text-on-surface-variant hover:text-on-surface transition-colors">
              Sectors API
            </a>
            <a href="https://docs.sectors.app" target="_blank" rel="noopener noreferrer" className="font-label-caps text-on-surface-variant hover:text-on-surface transition-colors">
              Documentation
            </a>
            <a href="https://github.com/seppam/sectors-ai-advisor" target="_blank" rel="noopener noreferrer" className="font-label-caps text-on-surface-variant hover:text-on-surface transition-colors">
              GitHub
            </a>
          </div>
        </PageContainer>
      </footer>
    </div>
  );
}
