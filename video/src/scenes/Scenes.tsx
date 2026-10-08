import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, REPO_URL } from "../theme";
import { Phone } from "../components/Phone";
import { Clip } from "../components/Clip";
import { Rise } from "../components/Anim";
import { Seg } from "../data";

/* ───────────── Problem: floating jargon ───────────── */
const TERMS = [
  { t: "PER", x: 14, y: 20, s: 150, d: 0 },
  { t: "PBV", x: 56, y: 12, s: 190, d: 6 },
  { t: "ROE", x: 30, y: 52, s: 210, d: 12 },
  { t: "DER", x: 68, y: 50, s: 160, d: 18 },
  { t: "EPS", x: 8, y: 74, s: 110, d: 24 },
  { t: "Dividend Yield", x: 48, y: 78, s: 84, d: 30 },
];
export const ProblemScene: React.FC<{ headline: string; sub?: string }> = ({ headline, sub }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      {TERMS.map((x, i) => {
        const s = spring({ frame: f - x.d, fps, config: { damping: 18 } });
        return (
          <div
            key={x.t}
            style={{
              position: "absolute",
              left: `${x.x}%`,
              top: `${x.y}%`,
              fontSize: x.s,
              fontWeight: 800,
              color: i % 2 ? C.teal : C.text,
              opacity: s * 0.22,
              transform: `scale(${0.8 + s * 0.2}) translateY(${Math.sin((f + i * 20) / 30) * 10}px)`,
              letterSpacing: -2,
            }}
          >
            {x.t}?
          </div>
        );
      })}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", paddingBottom: 120 }}>
        <Rise delay={14}>
          <div style={{ fontSize: 108, fontWeight: 800, letterSpacing: -3, lineHeight: 1.05 }}>{headline}</div>
        </Rise>
        {sub && (
          <Rise delay={30}>
            <div style={{ fontSize: 48, color: C.teal, fontWeight: 600, marginTop: 24 }}>{sub}</div>
          </Rise>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────────── Title / solution ───────────── */
const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ padding: "10px 22px", borderRadius: 999, border: `1.5px solid ${C.teal}66`, background: `${C.teal}14`, color: C.teal, fontSize: 28, fontWeight: 600 }}>
    {children}
  </div>
);
export const TitleScene: React.FC<{ still: string }> = ({ still }) => (
  <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 150px 150px", gap: 90 }}>
    <div style={{ flex: 1 }}>
      <Rise>
        <div style={{ display: "inline-block", padding: "10px 22px", borderRadius: 999, background: `${C.teal}1f`, color: C.teal, fontSize: 28, fontWeight: 700, letterSpacing: 1 }}>
          Sectors Hackathon 2026 · Track 1
        </div>
      </Rise>
      <Rise delay={8}>
        <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 36 }}>
          <Img src={staticFile("logo.svg")} style={{ width: 120, height: 120, borderRadius: 28 }} />
          <div style={{ fontSize: 112, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }}>Sectors AI Advisor</div>
        </div>
      </Rise>
      <Rise delay={18}>
        <div style={{ fontSize: 50, color: C.muted, marginTop: 30, fontWeight: 500, lineHeight: 1.25 }}>
          Data saham IDX, <span style={{ color: C.text }}>dijelaskan sederhana.</span>
        </div>
      </Rise>
      <Rise delay={30} style={{ display: "flex", gap: 14, marginTop: 40, flexWrap: "wrap" }}>
        <Pill>Data live Sectors API</Pill>
        <Pill>Istilah dijelaskan</Pill>
        <Pill>Tanpa eksekusi transaksi</Pill>
      </Rise>
    </div>
    <Rise delay={10}>
      <Phone height={820}>
        <Img src={staticFile(still)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Phone>
    </Rise>
  </AbsoluteFill>
);

/* ───────────── Phone + caption ───────────── */
export const PhoneScene: React.FC<{
  kicker: string;
  title: string;
  sub: string;
  segs?: Seg[];
  still?: string;
  totalFrames: number;
  accent?: string;
}> = ({ kicker, title, sub, segs, still, totalFrames, accent = C.teal }) => (
  <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 170px 150px", gap: 110 }}>
    <div style={{ flex: 1 }}>
      <Rise>
        <div style={{ color: accent, fontSize: 30, fontWeight: 800, letterSpacing: 4 }}>{kicker}</div>
      </Rise>
      <Rise delay={6}>
        <div style={{ fontSize: 88, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, marginTop: 22 }}>{title}</div>
      </Rise>
      <Rise delay={14}>
        <div style={{ fontSize: 40, color: C.muted, marginTop: 28, lineHeight: 1.35, maxWidth: 760 }}>{sub}</div>
      </Rise>
    </div>
    <Phone height={820}>
      {segs ? <Clip segs={segs} totalFrames={totalFrames} /> : <Img src={staticFile(still!)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
    </Phone>
  </AbsoluteFill>
);

/* ───────────── Technical flow diagram ───────────── */
const NODES = [
  { label: "Pertanyaan", sub: "ID / EN", icon: "💬" },
  { label: "Guardrail", sub: "regex, tanpa jaringan", icon: "🛡️" },
  { label: "Sectors API", sub: "v2 · via proxy", icon: "📡" },
  { label: "LLM", sub: "Claude · GPT · DeepSeek · OpenAI-compat", icon: "🧠" },
  { label: "Jawaban", sub: "chip istilah + sumber + disclaimer", icon: "✅" },
];
export const DiagramScene: React.FC<{ durationFrames: number }> = ({ durationFrames }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const step = (durationFrames - 150) / 7;
  const at = (i: number) => 24 + i * step;
  const cards = [
    { t: "Cache 5 menit", d: "Panggilan API yang sama tidak mengulang kredit", i: 5 },
    { t: "Prompt hemat token", d: "Hanya istilah & data relevan yang dikirim", i: 6 },
    { t: "Bebas provider", d: "Ganti model di Settings, tanpa ubah kode", i: 7 },
  ];
  return (
    <AbsoluteFill style={{ padding: "90px 110px 200px" }}>
      <Rise>
        <div style={{ color: C.teal, fontSize: 30, fontWeight: 800, letterSpacing: 4 }}>ALUR TEKNIS</div>
        <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: -2, marginTop: 12 }}>Dari pertanyaan ke jawaban yang bisa ditelusuri</div>
      </Rise>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 90 }}>
        {NODES.map((n, i) => {
          const s = spring({ frame: f - at(i), fps, config: { damping: 16 } });
          const arrow = interpolate(f, [at(i) + 8, at(i) + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <React.Fragment key={n.label}>
              <div
                style={{
                  width: 285,
                  minHeight: 250,
                  borderRadius: 28,
                  padding: "28px 24px",
                  background: C.card,
                  border: `2px solid ${i === 1 ? C.amber + "99" : C.teal + "66"}`,
                  boxShadow: `0 0 ${40 * s}px ${i === 1 ? C.amber : C.teal}22`,
                  opacity: s,
                  transform: `scale(${0.85 + 0.15 * s})`,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 64 }}>{n.icon}</div>
                <div style={{ fontSize: 40, fontWeight: 800, marginTop: 8 }}>{n.label}</div>
                <div style={{ fontSize: 24, color: C.muted, marginTop: 8, lineHeight: 1.3 }}>{n.sub}</div>
              </div>
              {i < NODES.length - 1 && (
                <div style={{ flex: 1, height: 6, margin: "0 10px", background: `${C.teal}22`, borderRadius: 3, position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, width: `${arrow * 100}%`, background: C.teal, borderRadius: 3 }} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <Rise delay={at(1) + 18} style={{ marginLeft: 268, marginTop: 22 }}>
        <div style={{ display: "inline-block", padding: "10px 20px", borderRadius: 14, background: `${C.amber}18`, border: `1.5px solid ${C.amber}66`, color: C.amber, fontSize: 28, fontWeight: 600 }}>
          ⛔ Beli/jual & prediksi harga → diblokir di sini · 0 kredit, 0 token
        </div>
      </Rise>
      <div style={{ display: "flex", gap: 28, marginTop: 56 }}>
        {cards.map((c) => {
          const s = spring({ frame: f - at(c.i), fps, config: { damping: 200 } });
          return (
            <div key={c.t} style={{ flex: 1, borderRadius: 24, padding: "26px 30px", background: C.bg2, border: `1.5px solid ${C.line}`, opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>
              <div style={{ fontSize: 38, fontWeight: 800, color: C.teal }}>{c.t}</div>
              <div style={{ fontSize: 28, color: C.muted, marginTop: 8, lineHeight: 1.3 }}>{c.d}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── QA checklist ───────────── */
const CHECKS = [
  "Welcome screen & contoh pertanyaan",
  "Istilah → chip glossary",
  "Jawaban BBCA + sumber data",
  "Bandingkan BBCA vs BBRI",
  "Top gainers hari ini",
  "Guardrail: beli saham (0 panggilan)",
  "Guardrail: prediksi harga (0 panggilan)",
  "Pertanyaan sah tidak salah diblokir",
  "Ringkasan harian",
  "Watchlist: tambah, duplikat, validasi",
];
export const QAScene: React.FC<{ durationFrames: number }> = ({ durationFrames }) => {
  const f = useCurrentFrame();
  const step = (durationFrames - 200) / CHECKS.length;
  return (
    <AbsoluteFill style={{ padding: "100px 160px 200px", flexDirection: "row", gap: 110, alignItems: "center" }}>
      <div style={{ flex: 1.15 }}>
        <Rise>
          <div style={{ color: C.teal, fontSize: 30, fontWeight: 800, letterSpacing: 4 }}>DIUJI DENGAN DATA LIVE</div>
          <div style={{ fontSize: 80, fontWeight: 800, letterSpacing: -2, marginTop: 12, marginBottom: 36 }}>10 / 10 skenario lulus</div>
        </Rise>
        {CHECKS.map((c, i) => {
          const o = interpolate(f, [20 + i * step, 32 + i * step], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={c} style={{ display: "flex", gap: 18, alignItems: "center", fontSize: 34, padding: "7px 0", opacity: o, transform: `translateX(${(1 - o) * -24}px)` }}>
              <span style={{ color: C.teal, fontWeight: 800 }}>✓</span>
              <span>{c}</span>
            </div>
          );
        })}
      </div>
      <Rise delay={24} style={{ flex: 0.85 }}>
        <div style={{ borderRadius: 32, padding: "40px 44px", background: C.card, border: `2px solid ${C.teal}55` }}>
          <div style={{ fontSize: 50, fontWeight: 800 }}>🔒 Privasi</div>
          <ul style={{ fontSize: 33, color: C.muted, lineHeight: 1.5, paddingLeft: 34, marginTop: 14 }}>
            <li>API key hanya di browser pengguna</li>
            <li>Proxy server stateless, tidak menyimpan data</li>
            <li>Disclaimer di setiap jawaban</li>
          </ul>
        </div>
      </Rise>
    </AbsoluteFill>
  );
};

/* ───────────── Closing ───────────── */
export const ClosingScene: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", paddingBottom: 90 }}>
    <Rise>
      <Img src={staticFile("logo.svg")} style={{ width: 150, height: 150, borderRadius: 34 }} />
    </Rise>
    <Rise delay={8}>
      <div style={{ fontSize: 124, fontWeight: 800, letterSpacing: -3, marginTop: 28 }}>Sectors AI Advisor</div>
    </Rise>
    <Rise delay={18}>
      <div style={{ fontSize: 54, color: C.teal, fontWeight: 600, marginTop: 14 }}>Pahami pasar sebelum berinvestasi.</div>
    </Rise>
    <Rise delay={30}>
      <div style={{ marginTop: 46, padding: "16px 38px", borderRadius: 18, background: C.card, border: `1.5px solid ${C.line}`, fontSize: 40, fontWeight: 600, fontFamily: "monospace" }}>
        {REPO_URL}
      </div>
    </Rise>
    <Rise delay={40}>
      <div style={{ fontSize: 38, color: C.muted, marginTop: 30 }}>@Sectors · #SectorsHackathon2026 · Track 1: AI Agents &amp; Assistants</div>
    </Rise>
  </AbsoluteFill>
);
