// ============================================================
// Financial Terms Glossary — Central Source of Truth
// Imported by: chat/page.tsx, GlossaryPanel.tsx, optimizedPrompts.ts
// ============================================================

import type { GlossaryTerm } from "./types";

export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: "pb",
    label_id: "PBV",
    label_en: "P/BV",
    definition_id:
      "Price to Book Value (PBV) membandingkan harga saham dengan nilai buku (book value) per saham. Rumus: Harga Saham / Nilai Buku per Saham.",
    definition_en:
      "Price to Book Value (P/BV) compares a stock's price to its book value per share. Formula: Stock Price / Book Value per Share.",
    formula: "PBV = Harga Saham / Nilai Buku per Saham",
    goodThreshold: "PBV < 1 bisa menandakan undervalued; PBV < 0.5 menarik tapi perlu dicek fundamental",
    badThreshold: "PBV > 5 di sektor non-teknologi bisa menandakan overvalued",
  },
  {
    slug: "der",
    label_id: "DER",
    label_en: "D/E Ratio",
    definition_id:
      "Debt to Equity Ratio (DER) mengukur seberapa besar utang perusahaan dibandingkan modal sendiri. Rumus: Total Utang / Total Ekuitas.",
    definition_en:
      "Debt to Equity Ratio (D/E) measures how much debt a company has relative to its equity. Formula: Total Debt / Total Equity.",
    formula: "DER = Total Utang / Total Ekuitas",
    goodThreshold: "DER < 1 umumnya dianggap sehat. Bank biasanya DER tinggi karena model bisnisnya.",
    badThreshold: "DER > 2 di luar sektor keuangan perlu perhatian khusus",
  },
  {
    slug: "roe",
    label_id: "ROE",
    label_en: "ROE",
    definition_id:
      "Return on Equity (ROE) mengukur seberapa besar keuntungan yang dihasilkan dari modal sendiri. Rumus: Laba Bersih / Total Ekuitas × 100%.",
    definition_en:
      "Return on Equity (ROE) measures how much profit a company generates from its equity. Formula: Net Profit / Total Equity × 100%.",
    formula: "ROE = Laba Bersih / Total Ekuitas × 100%",
    goodThreshold: "ROE > 15% umumnya dianggap baik; > 20% excellent",
    badThreshold: "ROE < 5% secara konsisten bisa menandakan inefisiensi",
  },
  {
    slug: "pe",
    label_id: "PE / PER",
    label_en: "P/E Ratio",
    definition_id:
      "Price to Earnings Ratio (PER) membandingkan harga saham dengan laba per saham. Rumus: Harga Saham / Laba per Saham (EPS).",
    definition_en:
      "Price to Earnings Ratio (P/E) compares a stock's price to its earnings per share. Formula: Stock Price / Earnings per Share (EPS).",
    formula: "P/E = Harga Saham / EPS",
    goodThreshold: "P/E < 15 bisa menandakan undervalued (bergantung sektor); P/E < 10 menarik",
    badThreshold: "P/E > 30 di luar sektor teknologi growth bisa menandakan overvalued",
  },
  {
    slug: "roa",
    label_id: "ROA",
    label_en: "ROA",
    definition_id:
      "Return on Assets (ROA) mengukur seberapa efisien perusahaan menggunakan seluruh asetnya untuk menghasilkan keuntungan.",
    definition_en:
      "Return on Assets (ROA) measures how efficiently a company uses all its assets to generate profit.",
    formula: "ROA = Laba Bersih / Total Aset × 100%",
    goodThreshold: "ROA > 5% generally considered good; > 10% excellent",
    badThreshold: "ROA < 2% or negative ROA indicates inefficiency",
  },
  {
    slug: "eps",
    label_id: "EPS",
    label_en: "EPS",
    definition_id:
      "Earnings Per Share (EPS) adalah laba bersih per lembar saham. Rumus: Laba Bersih / Jumlah Lembar Saham Beredar.",
    definition_en:
      "Earnings Per Share (EPS) is net profit divided by outstanding shares. Formula: Net Profit / Outstanding Shares.",
    formula: "EPS = Laba Bersih / Jumlah Lembar Saham",
    goodThreshold: "EPS yang tumbuh konsisten YoY adalah tanda fundamental yang baik",
    badThreshold: "EPS negatif berarti perusahaan rugi",
  },
  {
    slug: "marketcap",
    label_id: "Market Cap",
    label_en: "Market Cap",
    definition_id:
      "Market Capitalization adalah total nilai pasar perusahaan (harga saham × jumlah lembar saham). Digunakan untuk mengklasifikasikan ukuran perusahaan.",
    definition_en:
      "Market Capitalization is the total market value of a company (stock price × shares outstanding). Used to classify company size.",
    formula: "Market Cap = Harga Saham × Jumlah Lembar Saham",
    goodThreshold: "> IDR 10T = Large Cap (blue chip); > IDR 1T = Mid Cap",
    badThreshold: "< IDR 1T umumnya Small Cap dengan likuiditas lebih rendah",
  },
  {
    slug: "yoy",
    label_id: "YoY",
    label_en: "YoY",
    definition_id:
      "Year over Year (YoY) membandingkan kinerja di periode yang sama tahun sebelumnya. Contoh: revenue YoY = revenue tahun ini vs tahun lalu.",
    definition_en:
      "Year over Year (YoY) compares performance to the same period last year. Example: YoY revenue = this year vs last year.",
    formula: "YoY Growth = (Nilai Sekarang - Nilai Tahun Lalu) / Nilai Tahun Lalu × 100%",
    goodThreshold: "YoY growth > 10% consistently is a positive sign",
    badThreshold: "YoY decline requires investigation into the cause",
  },
];

// ============================================================
// Term Chip Parser — finds [TERM:slug:label] in response text
// ============================================================

export interface TermChipPart {
  type: "text" | "chip";
  content: string;
  slug?: string;
}

export function parseTermChips(
  text: string
): TermChipPart[] {
  const parts: TermChipPart[] = [];
  const regex = /\[TERM:([^:]+):([^\]]+)\]/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: "chip", content: match[2], slug: match[1] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.slice(lastIndex) });
  }
  return parts;
}
