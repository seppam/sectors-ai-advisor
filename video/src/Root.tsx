import React from "react";
import { Composition, Still } from "remotion";
import { FPS } from "./theme";
import { JudgingVideo, judgingDuration } from "./Judging";
import { Teaser, teaserDuration } from "./Teaser";
import { Thumbnail, ThumbnailLinkedIn, thumbDefaults } from "./Thumbnail";

export const Root: React.FC = () => (
  <>
    <Composition id="Teaser" component={Teaser} durationInFrames={teaserDuration()} fps={FPS} width={1920} height={1080} />
    <Composition id="JudgingVideo" component={JudgingVideo} durationInFrames={judgingDuration()} fps={FPS} width={1920} height={1080} />
    <Still id="Thumbnail" component={Thumbnail} width={1280} height={720} defaultProps={thumbDefaults} />
    <Still id="ThumbnailLinkedIn" component={ThumbnailLinkedIn} width={1080} height={1350} defaultProps={thumbDefaults} />
  </>
);
