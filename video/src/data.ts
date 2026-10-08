import narration from "../scripts/narration.json";
import meta from "./audio-meta.json";
import { FPS } from "./theme";

export const NARRATION = narration as { judging: Record<string, string>; teaser: Record<string, string> };
export const AUDIO_SECONDS = meta as Record<string, number>;

export const audioFrames = (id: string) => Math.ceil(AUDIO_SECONDS[id] * FPS);
/** On-screen subtitle text: the narration uses TTS-friendly spellings, subtitles use the normal ones. */
export const textOf = (id: string) =>
  (NARRATION.judging[id] ?? NARRATION.teaser[id])
    .replace(/\b([A-Z])-([A-Z])-([A-Z])\b/g, "$1$2$3") // P-E-R -> PER (letters are spelled out for TTS)
    .replace(/I-D-X/g, "IDX")
    .replace(/Klod/g, "Claude")
    .replace(/sep pam/g, "seppam")
    .replace(/Track satu/g, "Track 1")
    .replace(/dua ribu dua puluh enam/g, "2026")
    .replace(/\bBCA\b/g, "BBCA")
    .replace(/\bBRI\b/g, "BBRI");

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
  watchlist: [
    { src: W, from: 7.7, to: 9.6, rate: 1.2 },
    { src: W, from: 9.6, to: 13.9, rate: 4 }, // Sectors lookup latency, sped up
    { src: W, from: 13.9, to: 20.4 },
  ],
} satisfies Record<string, Seg[]>;

import type { SfxEvent } from "./components/Sfx";

/** Sound-effect cues in seconds from scene start (derived from the clip timestamps above). */
export const SCENE_SFX: Record<string, SfxEvent[]> = {
  j3: [{ t: 0.1, name: "tap" }, { t: 3.5, name: "pop" }, { t: 9.0, name: "tap" }, { t: 10.2, name: "ding", vol: 0.55 }],
  j4: [{ t: 0.6, name: "ticks", vol: 0.45 }, { t: 2.4, name: "tap" }, { t: 6.4, name: "pop" }, { t: 13.0, name: "tap" }, { t: 13.9, name: "pop" }],
  j5: [{ t: 0.3, name: "ticks", vol: 0.45 }, { t: 1.25, name: "tap" }, { t: 3.1, name: "pop" }, { t: 7.17, name: "tap" }, { t: 8.0, name: "pop" }],
  j6: [{ t: 0.55, name: "ticks", vol: 0.45 }, { t: 1.8, name: "tap" }, { t: 1.95, name: "block", vol: 0.6 }, { t: 6.86, name: "ticks", vol: 0.45 }, { t: 8.7, name: "tap" }, { t: 8.85, name: "block", vol: 0.6 }],
  j7: [{ t: 1.1, name: "tap" }, { t: 3.42, name: "chime", vol: 0.5 }],
  j8: [{ t: 0.9, name: "ticks", vol: 0.4 }, { t: 1.4, name: "tap" }, { t: 2.65, name: "chime", vol: 0.5 }, { t: 3.75, name: "block", vol: 0.5 }, { t: 4.75, name: "block", vol: 0.5 }, { t: 5.75, name: "tap" }, { t: 6.65, name: "block", vol: 0.5 }],
  t4: [{ t: 0.6, name: "tap" }, { t: 4.2, name: "tap" }, { t: 5.3, name: "ding", vol: 0.55 }, { t: 10.2, name: "tap" }, { t: 11.0, name: "pop" }],
  t5: [{ t: 1.8, name: "tap" }, { t: 1.95, name: "block", vol: 0.6 }, { t: 6.2, name: "tap" }, { t: 6.35, name: "block", vol: 0.6 }],
  t6: [{ t: 1.0, name: "pop" }, { t: 3.0, name: "pop" }],
};
