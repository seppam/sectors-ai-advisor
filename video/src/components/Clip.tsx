import React from "react";
import { Freeze, OffthreadVideo, Sequence, staticFile } from "remotion";
import { FPS } from "../theme";
import { Seg, segFrames, segsFrames } from "../data";

/** Plays consecutive slices of a recording; freezes the last frame if the scene outlasts them. */
export const Clip: React.FC<{ segs: Seg[]; totalFrames: number }> = ({ segs, totalFrames }) => {
  let at = 0;
  const nodes = segs.map((s, i) => {
    const dur = segFrames(s);
    const node = (
      <Sequence key={i} from={at} durationInFrames={dur} layout="none">
        <OffthreadVideo
          src={staticFile(s.src)}
          startFrom={Math.round(s.from * FPS)}
          endAt={Math.round(s.to * FPS)}
          playbackRate={s.rate ?? 1}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Sequence>
    );
    at += dur;
    return node;
  });
  const used = segsFrames(segs);
  const last = segs[segs.length - 1];
  if (totalFrames > used) {
    nodes.push(
      <Sequence key="tail" from={used} durationInFrames={totalFrames - used} layout="none">
        <Freeze frame={0}>
          <OffthreadVideo
            src={staticFile(last.src)}
            startFrom={Math.round(last.to * FPS) - 1}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Freeze>
      </Sequence>
    );
  }
  return <>{nodes}</>;
};
