import React from "react";
import { Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { AUDIO_SECONDS, textOf } from "../data";
import { FPS } from "../theme";
import { Backdrop } from "./Backdrop";
import { Sfx, SfxEvent } from "./Sfx";
import { Wipe } from "./Motion";
import { Subtitle } from "./Subtitle";

export const AUDIO_DELAY = Math.round(0.5 * FPS);

/** One narrated scene: animated backdrop, wipe-in, fades, voice-over, SFX and subtitles. */
export const Shell: React.FC<{
  audio?: string;
  durationFrames: number;
  children: React.ReactNode;
  sfx?: SfxEvent[];
  first?: boolean;
}> = ({ audio, durationFrames, children, sfx = [], first }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 6, durationFrames - 6, durationFrames], [first ? 1 : 0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const audioFrames = audio ? Math.ceil(AUDIO_SECONDS[audio] * FPS) : 0;
  return (
    <Backdrop>
      <div style={{ position: "absolute", inset: 0, opacity: op }}>
        {children}
        {audio && <Subtitle text={textOf(audio)} startFrame={AUDIO_DELAY} durationFrames={audioFrames} />}
      </div>
      {!first && <Wipe />}
      {!first && <Sfx events={[{ t: 0, name: "whoosh", vol: 0.32 }]} />}
      <Sfx events={sfx} />
      {audio && (
        <Sequence from={AUDIO_DELAY} durationInFrames={audioFrames + 2}>
          <Audio src={staticFile(`audio/${audio}.mp3`)} volume={1} />
        </Sequence>
      )}
    </Backdrop>
  );
};

export const sceneFrames = (audio: string, clipFrames = 0, tail = 1.0) =>
  Math.max(clipFrames, AUDIO_DELAY + Math.ceil(AUDIO_SECONDS[audio] * FPS) + Math.round(tail * FPS));
