import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { FPS } from "../theme";

export type SfxEvent = { t: number; name: "whoosh" | "whoosh_down" | "tap" | "pop" | "ding" | "chime" | "block" | "thud" | "riser" | "sparkle" | "ticks" | "swish"; vol?: number };

/** Sound effects placed at `t` seconds from the start of the enclosing Sequence. */
export const Sfx: React.FC<{ events: SfxEvent[] }> = ({ events }) => (
  <>
    {events.map((e, i) => (
      <Sequence key={i} from={Math.max(0, Math.round(e.t * FPS))} layout="none">
        <Audio src={staticFile(`sfx/${e.name}.mp3`)} volume={e.vol ?? 0.5} />
      </Sequence>
    ))}
  </>
);
