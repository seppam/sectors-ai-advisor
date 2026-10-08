import React from "react";
import { C } from "../theme";

/** 390x844 CSS-px device mockup scaled to `height`. */
export const Phone: React.FC<{ height?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  height = 940,
  children,
  style,
}) => {
  const scale = height / 844;
  const w = 390 * scale;
  return (
    <div
      style={{
        width: w + 24,
        height: height + 24,
        borderRadius: 64,
        padding: 12,
        background: `linear-gradient(145deg, ${C.cardHi}, #0a1623)`,
        boxShadow: "0 40px 120px rgba(0,0,0,0.55), 0 0 0 2px #2a3b4d, 0 0 90px rgba(70,241,197,0.10)",
        ...style,
      }}
    >
      <div style={{ width: w, height, borderRadius: 52, overflow: "hidden", background: C.bg, position: "relative" }}>{children}</div>
    </div>
  );
};
