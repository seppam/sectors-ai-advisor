import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../theme";

/** Staggered word-by-word reveal with blur and rise. */
export const Words: React.FC<{ text: string; delay?: number; stagger?: number; style?: React.CSSProperties }> = ({ text, delay = 0, stagger = 3, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <span style={style}>
      {text.split(" ").map((w, i) => {
        const s = spring({ frame: f - delay - i * stagger, fps, config: { damping: 20, stiffness: 140 } });
        return (
          <span key={i} style={{ display: "inline-block", opacity: s, transform: `translateY(${(1 - s) * 34}px)`, filter: `blur(${(1 - s) * 10}px)`, marginRight: "0.28em" }}>
            {w}
          </span>
        );
      })}
    </span>
  );
};

/** Wipe overlay used at every scene start. */
export const Wipe: React.FC<{ frames?: number }> = ({ frames = 18 }) => {
  const f = useCurrentFrame();
  if (f > frames) return null;
  const p = interpolate(f, [0, frames], [0, 1], { extrapolateRight: "clamp" });
  const x = interpolate(p, [0, 1], [-110, 110]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 50 }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${x - 40}%`, width: "80%", transform: "skewX(-14deg)", background: `linear-gradient(90deg, transparent, ${C.teal}cc 45%, #0d2a3a 55%, transparent)`, filter: "blur(2px)" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${x - 22}%`, width: "44%", transform: "skewX(-14deg)", background: C.bg, opacity: 0.92 }} />
    </AbsoluteFill>
  );
};

/** Draw-on stock-style line chart (decorative). */
export const ChartLine: React.FC<{ width: number; height: number; progressFrames?: number; seed?: string; color?: string; style?: React.CSSProperties }> = ({
  width, height, progressFrames = 70, seed = "c", color = C.teal, style,
}) => {
  const f = useCurrentFrame();
  const pts = Array.from({ length: 28 }, (_, i) => {
    const trend = i / 27;
    const y = 0.75 - trend * 0.5 + (random(`${seed}${i}`) - 0.5) * 0.22;
    return [(i / 27) * width, Math.max(0.05, Math.min(0.95, y)) * height] as const;
  });
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const p = interpolate(f, [0, progressFrames], [0, 1], { extrapolateRight: "clamp" });
  const last = pts[Math.min(pts.length - 1, Math.floor(p * (pts.length - 1)))];
  return (
    <svg width={width} height={height} style={{ overflow: "visible", ...style }}>
      <defs>
        <linearGradient id={`g-${seed}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.28" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <clipPath id={`cp-${seed}`}><rect x="0" y="0" width={width * p} height={height} /></clipPath>
      </defs>
      <path d={`${d} L${width},${height} L0,${height} Z`} fill={`url(#g-${seed})`} clipPath={`url(#cp-${seed})`} />
      <path d={d} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      <circle cx={last[0]} cy={last[1]} r={9} fill={color} />
      <circle cx={last[0]} cy={last[1]} r={9 + (f % 40) * 0.8} fill="none" stroke={color} strokeWidth={2} opacity={1 - (f % 40) / 40} />
    </svg>
  );
};

/** Pop-in info pill that appears at `at` frames (used as animated callouts). */
export const Callout: React.FC<{ items: { t: number; icon: string; text: string; tone?: "teal" | "amber" }[] }> = ({ items }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const active = [...items].reverse().find((i) => f >= i.t * fps);
  if (!active) return null;
  const s = spring({ frame: f - active.t * fps, fps, config: { damping: 14, stiffness: 180 } });
  const col = active.tone === "amber" ? C.amber : C.teal;
  return (
    <div
      key={active.t}
      style={{
        display: "inline-flex", alignItems: "center", gap: 18, marginTop: 44, padding: "18px 30px", borderRadius: 22,
        background: `${col}14`, border: `2px solid ${col}88`, boxShadow: `0 0 ${50 * s}px ${col}33`,
        opacity: s, transform: `translateY(${(1 - s) * 30}px) scale(${0.9 + 0.1 * s})`, fontSize: 36, fontWeight: 700, color: C.text,
      }}
    >
      <span style={{ fontSize: 44 }}>{active.icon}</span>
      <span>{active.text}</span>
    </div>
  );
};

/** Expanding rings, used for logo reveals. */
export const Burst: React.FC<{ delay?: number; color?: string }> = ({ delay = 0, color = C.teal }) => {
  const f = useCurrentFrame() - delay;
  return (
    <>
      {[0, 8, 16].map((o) => {
        const p = interpolate(f - o, [0, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <div key={o} style={{ position: "absolute", left: "50%", top: "50%", width: 200 + p * 900, height: 200 + p * 900, marginLeft: -(100 + p * 450), marginTop: -(100 + p * 450), borderRadius: "50%", border: `3px solid ${color}`, opacity: (1 - p) * 0.55 }} />;
      })}
    </>
  );
};
