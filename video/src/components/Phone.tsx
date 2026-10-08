import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../theme";

/** 390x844 CSS-px device mockup scaled to `height`, with 3D entrance, idle float and glow. */
export const Phone: React.FC<{ height?: number; children: React.ReactNode; delay?: number; push?: number }> = ({ height = 820, children, delay = 6, push = 0.04 }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const scale = height / 844;
  const w = 390 * scale;
  const s = spring({ frame: f - delay, fps, config: { damping: 16, stiffness: 90 } });
  const bob = Math.sin(f / 38) * 7;
  const tilt = Math.sin(f / 61) * 0.7;
  const pushIn = 1 + interpolate(f, [0, durationInFrames], [0, push]);
  return (
    <div style={{ position: "relative", perspective: 1800 }}>
      <div
        style={{
          position: "absolute", inset: -70, borderRadius: 120,
          background: `radial-gradient(closest-side, ${C.teal}33, transparent 72%)`,
          opacity: 0.55 + Math.sin(f / 30) * 0.15, filter: "blur(18px)",
        }}
      />
      <div
        style={{
          width: w + 24, height: height + 24, borderRadius: 64, padding: 12, position: "relative",
          background: `linear-gradient(145deg, ${C.cardHi}, #0a1623)`,
          boxShadow: "0 40px 120px rgba(0,0,0,0.55), 0 0 0 2px #2a3b4d",
          opacity: s,
          transform: `translateY(${(1 - s) * 90 + bob}px) rotateY(${(1 - s) * -38 + tilt}deg) rotateZ(${tilt * 0.4}deg) scale(${(0.9 + 0.1 * s) * pushIn})`,
        }}
      >
        <div style={{ width: w, height, borderRadius: 52, overflow: "hidden", background: C.bg, position: "relative" }}>
          {children}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,0.06), transparent 35%)", pointerEvents: "none" }} />
        </div>
      </div>
    </div>
  );
};
