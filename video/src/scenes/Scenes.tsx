import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, REPO_URL } from "../theme";
import { Phone } from "../components/Phone";
import { Clip } from "../components/Clip";
import { Rise } from "../components/Anim";
import { Burst, Callout, ChartLine, Words } from "../components/Motion";
import { Seg } from "../data";

export const TEAM = { name: "cobacobaberhadiah", member: "Muhamad Septian Pamungkas" };

const TeamTag: React.FC<{ size?: number }> = ({ size = 30 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.5, fontSize: size, fontWeight: 600, whiteSpace: "nowrap" }}>
    <span style={{ color: C.teal, fontWeight: 800, letterSpacing: 2, fontSize: size * 0.78 }}>TIM</span>
    <span style={{ fontWeight: 800 }}>{TEAM.name}</span>
    <span style={{ color: C.line }}>|</span>
    <span style={{ color: C.muted }}>{TEAM.member}</span>
  </div>
);

/* ───────────── Problem: floating jargon ───────────── */
const TERMS = [
  { t: "PER", x: 14, y: 20, s: 150, d: 0 },
  { t: "PBV", x: 56, y: 12, s: 190, d: 6 },
  { t: "ROE", x: 30, y: 52, s: 210, d: 12 },
  { t: "DER", x: 68, y: 50, s: 160, d: 18 },
  { t: "EPS", x: 8, y: 74, s: 110, d: 24 },
  { t: "Dividend Yield", x: 48, y: 78, s: 84, d: 30 },
];
export const problemSfx = [0, 0.2, 0.4, 0.6, 0.8, 1.0].map((t) => ({ t, name: "pop" as const, vol: 0.35 })).concat([{ t: 0.45, name: "thud" as never, vol: 0.5 }]);

export const ProblemScene: React.FC<{ headline: string; sub?: string }> = ({ headline, sub }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      {TERMS.map((x, i) => {
        const s = spring({ frame: f - x.d, fps, config: { damping: 18 } });
        const glitch = f % 90 < 3 && i % 2 === 0 ? (i - 2) * 7 : 0;
        return (
          <div
            key={x.t}
            style={{
              position: "absolute", left: `${x.x}%`, top: `${x.y}%`, fontSize: x.s, fontWeight: 800,
              color: i % 2 ? C.teal : C.text, opacity: s * 0.24, letterSpacing: -2,
              transform: `translate(${glitch}px,0) scale(${0.8 + s * 0.2}) translateY(${Math.sin((f + i * 20) / 30) * 12}px) rotate(${Math.sin((f + i * 9) / 70) * 2}deg)`,
              textShadow: i % 2 ? `0 0 40px ${C.teal}66` : undefined,
            }}
          >
            {x.t}?
          </div>
        );
      })}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", paddingBottom: 120 }}>
        <div style={{ fontSize: 108, fontWeight: 800, letterSpacing: -3, lineHeight: 1.05 }}>
          <Words text={headline} delay={14} stagger={4} />
        </div>
        <div style={{ width: interpolate(f, [30, 60], [0, 520], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), height: 6, borderRadius: 3, background: C.teal, marginTop: 26, boxShadow: `0 0 30px ${C.teal}` }} />
        {sub && (
          <Rise delay={36}>
            <div style={{ fontSize: 48, color: C.teal, fontWeight: 600, marginTop: 24 }}>{sub}</div>
          </Rise>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────────── Sting: opening title with team ───────────── */
export const StingScene: React.FC<{ subtitle: string }> = ({ subtitle }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame: f - 8, fps, config: { damping: 11, stiffness: 120 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <Burst delay={8} />
      <ChartLine width={1500} height={260} progressFrames={80} seed="sting" style={{ position: "absolute", bottom: 130, left: 210, opacity: 0.55 }} />
      <div style={{ transform: `scale(${0.3 + logo * 0.7}) rotate(${(1 - logo) * -25}deg)`, opacity: logo }}>
        <Img src={staticFile("logo.svg")} style={{ width: 170, height: 170, borderRadius: 38, boxShadow: `0 0 80px ${C.teal}66` }} />
      </div>
      <div style={{ fontSize: 118, fontWeight: 800, letterSpacing: -3, marginTop: 26 }}>
        <Words text="Sectors AI Advisor" delay={18} stagger={5} />
      </div>
      <Rise delay={40}>
        <div style={{ fontSize: 46, color: C.teal, fontWeight: 600, marginTop: 8 }}>{subtitle}</div>
      </Rise>
      <Rise delay={52}>
        <div style={{ marginTop: 40 }}>
          <TeamTag size={34} />
        </div>
      </Rise>
      <Rise delay={62}>
        <div style={{ fontSize: 28, color: C.muted, marginTop: 18, letterSpacing: 3, fontWeight: 600 }}>SECTORS HACKATHON 2026 · TRACK 1: AI AGENTS &amp; ASSISTANTS</div>
      </Rise>
    </AbsoluteFill>
  );
};

/* ───────────── Title / solution ───────────── */
const Pill: React.FC<{ children: React.ReactNode; delay: number }> = ({ children, delay }) => (
  <Rise delay={delay}>
    <div style={{ padding: "10px 22px", borderRadius: 999, border: `1.5px solid ${C.teal}66`, background: `${C.teal}14`, color: C.teal, fontSize: 28, fontWeight: 600 }}>{children}</div>
  </Rise>
);
export const TitleScene: React.FC<{ still: string }> = ({ still }) => (
  <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 150px 150px", gap: 90 }}>
    <ChartLine width={1100} height={300} progressFrames={110} seed="title" style={{ position: "absolute", left: 120, bottom: 150, opacity: 0.35 }} />
    <div style={{ flex: 1, position: "relative" }}>
      <Rise>
        <div style={{ display: "inline-block", padding: "10px 22px", borderRadius: 999, background: `${C.teal}1f`, color: C.teal, fontSize: 28, fontWeight: 700, letterSpacing: 1 }}>
          Sectors Hackathon 2026 · Track 1
        </div>
      </Rise>
      <Rise delay={8}>
        <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 36 }}>
          <Img src={staticFile("logo.svg")} style={{ width: 120, height: 120, borderRadius: 28, boxShadow: `0 0 60px ${C.teal}55` }} />
          <div style={{ fontSize: 112, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }}>
            <Words text="Sectors AI Advisor" delay={10} stagger={5} />
          </div>
        </div>
      </Rise>
      <Rise delay={30}>
        <div style={{ fontSize: 50, color: C.muted, marginTop: 30, fontWeight: 500, lineHeight: 1.25 }}>
          Data saham IDX, <span style={{ color: C.text }}>dijelaskan sederhana.</span>
        </div>
      </Rise>
      <div style={{ display: "flex", gap: 14, marginTop: 40, flexWrap: "wrap" }}>
        <Pill delay={42}>Data live Sectors API</Pill>
        <Pill delay={48}>Istilah dijelaskan</Pill>
        <Pill delay={54}>Tanpa eksekusi transaksi</Pill>
      </div>
    </div>
    <Phone height={820}>
      <Img src={staticFile(still)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Phone>
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
  callouts?: { t: number; icon: string; text: string; tone?: "teal" | "amber" }[];
}> = ({ kicker, title, sub, segs, still, totalFrames, accent = C.teal, callouts = [] }) => (
  <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 170px 150px", gap: 110 }}>
    <div style={{ flex: 1 }}>
      <Rise>
        <div style={{ display: "flex", alignItems: "center", gap: 18, color: accent, fontSize: 30, fontWeight: 800, letterSpacing: 4 }}>
          <span style={{ width: 54, height: 5, borderRadius: 3, background: accent, boxShadow: `0 0 18px ${accent}` }} />
          {kicker}
        </div>
      </Rise>
      <div style={{ fontSize: 88, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, marginTop: 22 }}>
        <Words text={title} delay={6} stagger={4} />
      </div>
      <Rise delay={20}>
        <div style={{ fontSize: 40, color: C.muted, marginTop: 28, lineHeight: 1.35, maxWidth: 760 }}>{sub}</div>
      </Rise>
      <Callout items={callouts} />
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
export const diagramStep = (durationFrames: number) => (durationFrames - 150) / 7;
export const diagramSfx = (durationFrames: number) =>
  Array.from({ length: 8 }, (_, i) => ({ t: (24 + i * diagramStep(durationFrames)) / 30, name: (i === 1 ? "tap" : "pop") as "tap" | "pop", vol: 0.45 }));

export const DiagramScene: React.FC<{ durationFrames: number }> = ({ durationFrames }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const step = diagramStep(durationFrames);
  const at = (i: number) => 24 + i * step;
  const cards = [
    { t: "Cache 5 menit", d: "Panggilan API yang sama tidak mengulang kredit", i: 5, icon: "⚡" },
    { t: "Prompt hemat token", d: "Hanya istilah & data relevan yang dikirim", i: 6, icon: "🪙" },
    { t: "Bebas provider", d: "Ganti model di Settings, tanpa ubah kode", i: 7, icon: "🔁" },
  ];
  // data packet travelling along the pipeline once all nodes are in
  const packet = interpolate(f, [at(4) + 20, at(4) + 20 + 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ padding: "110px 110px 230px" }}>
      <Rise>
        <div style={{ color: C.teal, fontSize: 30, fontWeight: 800, letterSpacing: 4 }}>ALUR TEKNIS</div>
        <div style={{ fontSize: 66, fontWeight: 800, letterSpacing: -2, marginTop: 12 }}>
          <Words text="Dari pertanyaan ke jawaban yang bisa ditelusuri" delay={4} stagger={3} />
        </div>
      </Rise>
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 56 }}>
        {NODES.map((n, i) => {
          const s = spring({ frame: f - at(i), fps, config: { damping: 16 } });
          const arrow = interpolate(f, [at(i) + 8, at(i) + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const pulse = packet > 0 && Math.abs(packet * 4 - i) < 0.5 ? 1 : 0;
          return (
            <React.Fragment key={n.label}>
              <div
                style={{
                  width: 285, minHeight: 250, borderRadius: 28, padding: "28px 24px", background: C.card,
                  border: `2px solid ${i === 1 ? C.amber + "99" : C.teal + "66"}`,
                  boxShadow: `0 0 ${40 * s + pulse * 50}px ${i === 1 ? C.amber : C.teal}${pulse ? "55" : "22"}`,
                  opacity: s, transform: `scale(${(0.85 + 0.15 * s) * (1 + pulse * 0.04)})`, textAlign: "center",
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
        {packet > 0 && packet < 1 && (
          <div style={{ position: "absolute", left: `${6 + packet * 88}%`, top: "50%", width: 26, height: 26, marginTop: -13, borderRadius: "50%", background: "#fff", boxShadow: `0 0 28px 8px ${C.teal}` }} />
        )}
      </div>
      <Rise delay={at(1) + 18} style={{ marginLeft: 268, marginTop: 22 }}>
        <div style={{ display: "inline-block", padding: "10px 20px", borderRadius: 14, background: `${C.amber}18`, border: `1.5px solid ${C.amber}66`, color: C.amber, fontSize: 28, fontWeight: 600 }}>
          ⛔ Beli/jual & prediksi harga → diblokir di sini · 0 kredit, 0 token
        </div>
      </Rise>
      <div style={{ display: "flex", gap: 28, marginTop: 34 }}>
        {cards.map((c) => {
          const s = spring({ frame: f - at(c.i), fps, config: { damping: 200 } });
          return (
            <div key={c.t} style={{ flex: 1, borderRadius: 24, padding: "26px 30px", background: C.bg2, border: `1.5px solid ${C.line}`, opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>
              <div style={{ fontSize: 38, fontWeight: 800, color: C.teal }}>{c.icon} {c.t}</div>
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
export const qaStep = (durationFrames: number) => (durationFrames - 200) / CHECKS.length;
export const qaSfx = (durationFrames: number) => [
  ...CHECKS.map((_, i) => ({ t: (20 + i * qaStep(durationFrames)) / 30, name: "pop" as const, vol: 0.3 })),
  { t: (20 + CHECKS.length * qaStep(durationFrames)) / 30, name: "chime" as const, vol: 0.5 },
];
export const QAScene: React.FC<{ durationFrames: number }> = ({ durationFrames }) => {
  const f = useCurrentFrame();
  const step = qaStep(durationFrames);
  const done = Math.min(CHECKS.length, Math.max(0, Math.floor((f - 20) / step) + 1));
  return (
    <AbsoluteFill style={{ padding: "100px 160px 200px", flexDirection: "row", gap: 110, alignItems: "center" }}>
      <div style={{ flex: 1.15 }}>
        <Rise>
          <div style={{ color: C.teal, fontSize: 30, fontWeight: 800, letterSpacing: 4 }}>DIUJI DENGAN DATA LIVE</div>
          <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -2, marginTop: 12, marginBottom: 20, display: "flex", alignItems: "baseline", gap: 18 }}>
            <span style={{ color: C.teal, fontVariantNumeric: "tabular-nums" }}>{done} / 10</span>
            <span>skenario lulus</span>
          </div>
          <div style={{ height: 10, width: 640, borderRadius: 5, background: `${C.teal}22`, marginBottom: 28 }}>
            <div style={{ height: "100%", width: `${(done / 10) * 100}%`, borderRadius: 5, background: C.teal, boxShadow: `0 0 20px ${C.teal}`, transition: "none" }} />
          </div>
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
        <div style={{ borderRadius: 32, padding: "40px 44px", background: C.card, border: `2px solid ${C.teal}55`, boxShadow: `0 0 70px ${C.teal}18` }}>
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
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", paddingBottom: 150 }}>
    <Burst delay={4} />
    <Rise>
      <Img src={staticFile("logo.svg")} style={{ width: 150, height: 150, borderRadius: 34, boxShadow: `0 0 80px ${C.teal}66` }} />
    </Rise>
    <div style={{ fontSize: 124, fontWeight: 800, letterSpacing: -3, marginTop: 28 }}>
      <Words text="Sectors AI Advisor" delay={8} stagger={5} />
    </div>
    <Rise delay={22}>
      <div style={{ fontSize: 54, color: C.teal, fontWeight: 600, marginTop: 14 }}>Pahami pasar sebelum berinvestasi.</div>
    </Rise>
    <Rise delay={32}>
      <div style={{ marginTop: 40, padding: "16px 38px", borderRadius: 18, background: C.card, border: `1.5px solid ${C.line}`, fontSize: 40, fontWeight: 600, fontFamily: "monospace" }}>{REPO_URL}</div>
    </Rise>
    <Rise delay={42}>
      <div style={{ marginTop: 26 }}>
        <TeamTag size={32} />
      </div>
    </Rise>
    <Rise delay={50}>
      <div style={{ fontSize: 34, color: C.muted, marginTop: 20 }}>@Sectors · #SectorsHackathon2026 · Track 1: AI Agents &amp; Assistants</div>
    </Rise>
  </AbsoluteFill>
);
