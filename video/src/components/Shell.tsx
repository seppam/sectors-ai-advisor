import React from "react";
import { Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { AUDIO_SECONDS, textOf } from "../data";
import { FPS } from "../theme";
import { Backdrop } from "./Backdrop";
import { Subtitle } from "./Subtitle";

export const AUDIO_DELAY = Math.round(0.5 * FPS);

/** One narrated scene: backdrop, fades, voice-over and subtitles. */
export const Shell: React.FC<{ audio: string; durationFrames: number; children: React.ReactNode; subtitles?: boolean }> = ({
  audio,
  durationFrames,
  children,
  subtitles = true,
}) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 8, durationFrames - 8, durationFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const audioFrames = Math.ceil(AUDIO_SECONDS[audio] * FPS);
  return (
    <Backdrop>
      <div style={{ position: "absolute", inset: 0, opacity: op }}>
        {children}
        {subtitles && <Subtitle text={textOf(audio)} startFrame={AUDIO_DELAY} durationFrames={audioFrames} />}
      </div>
      <Sequence from={AUDIO_DELAY} durationInFrames={audioFrames + 2}>
        <Audio src={staticFile(`audio/${audio}.mp3`)} />
      </Sequence>
    </Backdrop>
  );
};

export const sceneFrames = (audio: string, clipFrames = 0, tail = 1.0) =>
  Math.max(clipFrames, AUDIO_DELAY + Math.ceil(AUDIO_SECONDS[audio] * FPS) + Math.round(tail * FPS));
