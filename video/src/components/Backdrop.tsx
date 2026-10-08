import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { C, fontFamily } from "../theme";

const PARTICLES = Array.from({ length: 46 }, (_, i) => ({
  x: random(`px${i}`) * 100,
  y: random(`py${i}`) * 100,
  r: 2 + random(`pr${i}`) * 5,
  v: 0.04 + random(`pv${i}`) * 0.12,
  o: 0.12 + random(`po${i}`) * 0.3,
  ph: random(`pp${i}`) * 6.28,
}));

/** Animated brand backdrop: drifting glow orbs, perspective-ish grid, rising particles. */
export const Backdrop: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const gx = (f * 0.35) % 80;
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily, color: C.text, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 620px at ${22 + Math.sin(f / 90) * 8}% ${12 + Math.cos(f / 110) * 6}%, rgba(70,241,197,0.15), transparent 62%), radial-gradient(820px 700px at ${88 + Math.cos(f / 100) * 5}% 100%, rgba(79,219,200,0.10), transparent 62%), radial-gradient(600px 500px at 60% 40%, rgba(40,90,200,0.07), transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.line}55 1px, transparent 1px), linear-gradient(90deg, ${C.line}55 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          backgroundPosition: `${gx}px ${gx}px`,
          opacity: 0.22,
          maskImage: "radial-gradient(ellipse at 50% 40%, black 10%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 10%, transparent 75%)",
        }}
      />
      {PARTICLES.map((p, i) => {
        const y = (p.y - f * p.v + 400) % 110;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x + Math.sin(f / 50 + p.ph) * 1.2}%`,
              top: `${y - 5}%`,
              width: p.r,
              height: p.r,
              borderRadius: "50%",
              background: i % 3 === 0 ? C.teal : C.text,
              opacity: p.o * interpolate(Math.sin(f / 40 + p.ph), [-1, 1], [0.5, 1]),
              filter: p.r > 5 ? "blur(1px)" : undefined,
            }}
          />
        );
      })}
      {children}
    </AbsoluteFill>
  );
};
