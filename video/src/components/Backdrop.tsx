import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, fontFamily } from "../theme";

export const Backdrop: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const drift = interpolate(f, [0, 900], [0, 60], { extrapolateRight: "extend" });
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily, color: C.text }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 600px at ${20 + drift / 6}% 10%, rgba(70,241,197,0.13), transparent 60%), radial-gradient(800px 700px at 90% 100%, rgba(79,219,200,0.08), transparent 60%)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};
