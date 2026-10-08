import narration from "../scripts/narration.json";
import meta from "./audio-meta.json";
import { FPS } from "./theme";

export const NARRATION = narration as { judging: Record<string, string>; teaser: Record<string, string> };
export const AUDIO_SECONDS = meta as Record<string, number>;

export const audioFrames = (id: string) => Math.ceil(AUDIO_SECONDS[id] * FPS);
export const textOf = (id: string) => NARRATION.judging[id] ?? NARRATION.teaser[id];

/** A slice of a recorded screen capture. `rate` > 1 speeds up waiting time (LLM latency). */
export type Seg = { src: "demo/main.mp4" | "demo/watchlist.mp4"; from: number; to: number; rate?: number };
export const segFrames = (s: Seg) => Math.round(((s.to - s.from) / (s.rate ?? 1)) * FPS);
export const segsFrames = (segs: Seg[]) => segs.reduce((a, s) => a + segFrames(s), 0);

// Timestamps (seconds) into public/demo/main.mp4 — see video/qa-timeline-main.json
export const M = "demo/main.mp4" as const;
export const W = "demo/watchlist.mp4" as const;
export const SEGS = {
  glossary: [
    { src: M, from: 13.6, to: 19.2, rate: 1.6 },
    { src: M, from: 19.2, to: 31.0 },
  ],
  bbca: [
    { src: M, from: 30.9, to: 33.3 },
    { src: M, from: 33.3, to: 49.4, rate: 4 },
    { src: M, from: 49.4, to: 60.4 },
  ],
  compare: [
    { src: M, from: 60.4, to: 62.4, rate: 1.6 },
    { src: M, from: 62.4, to: 73.5, rate: 6 },
    { src: M, from: 73.5, to: 79.0, rate: 1.5 },
    { src: M, from: 80.0, to: 82.4 },
  ],
  guardrails: [{ src: M, from: 99.4, to: 112.6 }],
  brief: [
    { src: M, from: 138.3, to: 139.4 },
    { src: M, from: 139.4, to: 151.0, rate: 5 },
    { src: M, from: 151.0, to: 158.0, rate: 1.2 },
  ],
  watchlist: [{ src: W, from: 7.7, to: 20.4, rate: 1.4 }],
} satisfies Record<string, Seg[]>;
