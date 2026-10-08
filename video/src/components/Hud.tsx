import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, fontFamily } from "../theme";

export type Chapter = { label: string; from: number; frames: number };

/** Thin progress bar + chapter chip, overlaid on the whole video. */
export const Hud: React.FC<{ chapters: Chapter[]; total: number; chip?: boolean }> = ({ chapters, total, chip = true }) => {
  const f = useCurrentFrame();
  const idx = Math.max(0, chapters.findIndex((c) => f >= c.from && f < c.from + c.frames));
  const ch = chapters[idx];
  const local = f - ch.from;
  const op = interpolate(local, [10, 22, ch.frames - 14, ch.frames - 4], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "rgba(255,255,255,0.06)", zIndex: 60 }}>
        <div style={{ height: "100%", width: `${(f / total) * 100}%`, background: `linear-gradient(90deg, ${C.tealDim}, ${C.teal})`, boxShadow: `0 0 14px ${C.teal}` }} />
      </div>
      {chip && ch.label && (
        <div style={{ position: "absolute", top: 34, left: 56, zIndex: 60, fontFamily, opacity: op, display: "flex", alignItems: "center", gap: 12, padding: "10px 22px", borderRadius: 999, background: "rgba(5,20,36,0.7)", border: `1.5px solid ${C.teal}55`, fontSize: 24, fontWeight: 700, letterSpacing: 2, color: C.teal }}>
          <span style={{ color: C.muted }}>{String(chapters[0].label ? idx + 1 : idx).padStart(2, "0")}</span>
          {ch.label}
        </div>
      )}
    </>
  );
};
