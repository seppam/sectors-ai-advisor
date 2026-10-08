# Video source — Sectors AI Advisor

Remotion project for the Sectors Hackathon 2026 teaser, judging video and thumbnails. Generated media is gitignored; rebuild it with the steps below.

```
video/
├── src/                 compositions (Teaser, JudgingVideo, Thumbnail, ThumbnailLinkedIn)
├── scripts/
│   ├── narration.json   Indonesian narration (TTS-friendly spellings; subtitles are normalised in src/data.ts)
│   └── gen-vo.sh        one VO segment via the local VoiceStudio API (fixed seed = same voice)
├── qa-timeline-*.json   timestamps of each flow inside the screen recordings
└── public/              (ignored) audio/, demo/, shots/ — generated, see below
```

## Rebuild

1. Record the app (production build, 390×844) — also runs the 10 QA flows:
   `npx next build && npx next start -p 3100` then `QA_BASE_URL=http://localhost:3100 node ../scripts/qa-live.mjs`
2. Convert recordings: `npx remotion ffmpeg -i raw/<file>.webm -c:v libx264 -crf 17 -pix_fmt yuv420p -r 30 -an public/demo/main.mp4` (watchlist take → `public/demo/watchlist.mp4`).
3. Copy screenshots: `cp ../docs/screenshots/qa/*.png public/shots/`; `cp ../public/logo.svg public/logo.svg`.
4. Voice-over (VoiceStudio running locally): for every key in `narration.json` run `./scripts/gen-vo.sh <id> "<text>"`, convert to mp3 (`ffmpeg -i x.raw -ar 44100 -ac 1 -b:a 160k x.mp3`) and refresh `src/audio-meta.json` with the durations.
5. Render: `npm run render:teaser`, `npm run render:judging`, `npm run still:thumbnail`, `npm run still:linkedin`
   (if Remotion cannot download its Chrome, add `--browser-executable=<chrome-headless-shell path>`).
