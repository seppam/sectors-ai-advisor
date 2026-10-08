import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";

/** Splits narration into sentence chunks and spreads them over the audio, weighted by character count. */
export function chunk(text: string): string[] {
  const sentences = text.match(/[^.!?:]+[.!?:]?/g)?.map((s) => s.trim()).filter(Boolean) ?? [text];
  const out: string[] = [];
  for (const s of sentences) {
    if (s.length <= 70) out.push(s);
    else {
      const words = s.split(" ");
      const n = Math.ceil(s.length / 62);
      const size = Math.ceil(words.length / n);
      for (let i = 0; i < words.length; i += size) out.push(words.slice(i, i + size).join(" "));
    }
  }
  return out;
}

export const Subtitle: React.FC<{ text: string; startFrame: number; durationFrames: number; bottom?: number; width?: number }> = ({
  text,
  startFrame,
  durationFrames,
  bottom = 56,
  width = 1500,
}) => {
  const f = useCurrentFrame() - startFrame;
  const parts = chunk(text);
  const total = parts.reduce((a, p) => a + p.length, 0);
  let acc = 0;
  let idx = -1;
  let s0 = 0;
  let s1 = 0;
  for (let i = 0; i < parts.length; i++) {
    const a = (acc / total) * durationFrames;
    const b = ((acc + parts[i].length) / total) * durationFrames;
    if (f >= a && f < b) {
      idx = i;
      s0 = a;
      s1 = b;
    }
    acc += parts[i].length;
  }
  if (idx < 0) return null;
  const op = interpolate(f, [s0, s0 + 4, s1 - 4, s1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom, display: "flex", justifyContent: "center", opacity: op }}>
      <div
        style={{
          maxWidth: width,
          padding: "16px 34px",
          borderRadius: 18,
          background: "rgba(5,20,36,0.82)",
          border: `1px solid ${C.line}`,
          fontSize: 40,
          lineHeight: 1.3,
          fontWeight: 600,
          textAlign: "center",
          color: "#fff",
          backdropFilter: "blur(8px)",
        }}
      >
        {parts[idx]}
      </div>
    </div>
  );
};
