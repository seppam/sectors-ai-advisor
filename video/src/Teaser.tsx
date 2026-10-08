import React from "react";
import { Sequence } from "remotion";
import { FPS } from "./theme";
import { M, Seg, segsFrames } from "./data";
import { Shell } from "./components/Shell";
import { ClosingScene, PhoneScene, ProblemScene, TitleScene } from "./scenes/Scenes";

const T_GLOSSARY: Seg[] = [
  { src: M, from: 21.0, to: 31.0 },
  { src: M, from: 55.0, to: 58.5 },
];
const T_GUARD: Seg[] = [
  { src: M, from: 100.0, to: 104.5 },
  { src: M, from: 107.5, to: 111.5 },
];
const T_BRIEF: Seg[] = [{ src: M, from: 151.0, to: 158.0 }];

const secs = (s: number) => Math.round(s * FPS);

type Scene = { id: string; frames: number; node: (frames: number) => React.ReactNode };
export const teaserScenes = (): Scene[] => [
  { id: "t1", frames: secs(4), node: () => <ProblemScene headline="Saham IDX itu rumit." /> },
  { id: "t2", frames: secs(5), node: () => <ProblemScene headline="PER · PBV · ROE · DER" sub="Apa artinya?" /> },
  { id: "t3", frames: secs(9), node: () => <TitleScene still="shots/01-welcome.png" /> },
  { id: "t4", frames: secs(14), node: (f) => <PhoneScene kicker="ISTILAH & SUMBER" title="Ketuk. Paham." sub="Penjelasan, rumus, dan sumber data di setiap jawaban." segs={T_GLOSSARY} totalFrames={f} /> },
  { id: "t5", frames: secs(9), node: (f) => <PhoneScene kicker="GUARDRAIL" title="Hanya analisis." sub="Tanpa eksekusi transaksi. Tanpa prediksi harga." segs={T_GUARD} totalFrames={f} accent="#ffcf96" /> },
  { id: "t6", frames: secs(8), node: (f) => <PhoneScene kicker="RINGKASAN HARIAN" title="Otomatis." sub="Gainers, losers, arus asing, dan berita." segs={T_BRIEF} totalFrames={f} /> },
  { id: "t7", frames: secs(11), node: () => <ClosingScene /> },
];
export const teaserDuration = () => teaserScenes().reduce((a, s) => a + s.frames, 0);
void segsFrames;

export const Teaser: React.FC = () => {
  let at = 0;
  return (
    <>
      {teaserScenes().map((s) => {
        const from = at;
        at += s.frames;
        return (
          <Sequence key={s.id} from={from} durationInFrames={s.frames}>
            <Shell audio={s.id} durationFrames={s.frames}>
              {s.node(s.frames)}
            </Shell>
          </Sequence>
        );
      })}
    </>
  );
};
