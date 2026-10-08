import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Backdrop } from "./components/Backdrop";
import { Phone } from "./components/Phone";
import { C } from "./theme";

export type ThumbProps = { badge: string; title: string; subtitle: string; screenshot: string };
export const thumbDefaults: ThumbProps = {
  badge: "Sectors Hackathon 2026 · Track 1",
  title: "Sectors AI Advisor",
  subtitle: "Data saham IDX, dijelaskan sederhana",
  screenshot: "shots/02a-answer.png",
};

const Badge: React.FC<{ children: string; size: number; align?: "flex-start" | "center" }> = ({ children, size, align = "flex-start" }) => (
  <div style={{ display: "inline-block", alignSelf: align, padding: `${size * 0.35}px ${size * 0.8}px`, borderRadius: 999, background: `${C.teal}22`, border: `2px solid ${C.teal}66`, color: C.teal, fontSize: size, fontWeight: 700 }}>
    {children}
  </div>
);

/** 1280x720 YouTube thumbnail */
export const Thumbnail: React.FC<ThumbProps> = ({ badge, title, subtitle, screenshot }) => {
  const [first, ...rest] = title.split(" ");
  return (
    <Backdrop>
      <AbsoluteFill style={{ padding: "70px 0 0 72px" }}>
        <Badge size={26}>{badge}</Badge>
        <div style={{ fontSize: 132, fontWeight: 800, lineHeight: 0.98, letterSpacing: -4, marginTop: 44, width: 700 }}>
          {first} <span style={{ color: C.teal }}>{rest.slice(0, 1)}</span>
          <br />
          {rest.slice(1).join(" ") || ""}
        </div>
        <div style={{ fontSize: 42, color: C.muted, fontWeight: 500, marginTop: 36, width: 620, lineHeight: 1.25 }}>{subtitle}</div>
      </AbsoluteFill>
      <div style={{ position: "absolute", right: 70, top: 56, transform: "rotate(4deg)" }}>
        <Phone height={780}>
          <Img src={staticFile(screenshot)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
        </Phone>
      </div>
    </Backdrop>
  );
};

/** 1080x1350 LinkedIn variant */
export const ThumbnailLinkedIn: React.FC<ThumbProps> = ({ badge, title, subtitle, screenshot }) => (
  <Backdrop>
    <AbsoluteFill style={{ padding: "80px 70px 0", alignItems: "center", textAlign: "center" }}>
      <Badge size={30} align="center">{badge}</Badge>
      <div style={{ fontSize: 120, fontWeight: 800, lineHeight: 1, letterSpacing: -4, marginTop: 40 }}>
        {title.split(" ").slice(0, 2).join(" ")}
        <br />
        <span style={{ color: C.teal }}>{title.split(" ").slice(2).join(" ")}</span>
      </div>
      <div style={{ fontSize: 44, color: C.muted, marginTop: 24, fontWeight: 500 }}>{subtitle}</div>
    </AbsoluteFill>
    <div style={{ position: "absolute", left: "50%", bottom: -150, transform: "translateX(-50%)" }}>
      <Phone height={900}>
        <Img src={staticFile(screenshot)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
      </Phone>
    </div>
  </Backdrop>
);
