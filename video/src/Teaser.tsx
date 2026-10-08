import React from "react";
import { Audio, interpolate, Sequence, staticFile } from "remotion";
import { FPS } from "./theme";
import { M, SCENE_SFX, Seg } from "./data";
import type { SfxEvent } from "./components/Sfx";
import { Shell } from "./components/Shell";
import { Hud } from "./components/Hud";
import { ClosingScene, PhoneScene, ProblemScene, TitleScene, problemSfx } from "./scenes/Scenes";

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

type Scene = { id: string; frames: number; sfx: SfxEvent[]; node: (frames: number) => React.ReactNode };
export const teaserScenes = (): Scene[] => [
  { id: "t1", frames: secs(4), sfx: [...problemSfx, { t: 0.1, name: "riser", vol: 0.35 }], node: () => <ProblemScene headline="Saham IDX itu rumit." /> },
  { id: "t2", frames: secs(5), sfx: problemSfx, node: () => <ProblemScene headline="PER · PBV · ROE · DER" sub="Apa artinya?" /> },
  { id: "t3", frames: secs(9), sfx: [{ t: 0.4, name: "thud", vol: 0.55 }, { t: 1.5, name: "sparkle", vol: 0.4 }], node: () => <TitleScene still="shots/01-welcome.png" /> },
  { id: "t4", frames: secs(14), sfx: SCENE_SFX.t4, node: (f) => <PhoneScene kicker="ISTILAH & SUMBER" title="Ketuk. Paham." sub="Penjelasan, rumus, dan sumber data di setiap jawaban." segs={T_GLOSSARY} totalFrames={f} callouts={[{ t: 4.2, icon: "👆", text: "Ketuk chip istilah" }, { t: 10.5, icon: "🔎", text: "Sumber data di tiap jawaban" }]} /> },
  { id: "t5", frames: secs(9), sfx: SCENE_SFX.t5, node: (f) => <PhoneScene kicker="GUARDRAIL" title="Hanya analisis." sub="Tanpa eksekusi transaksi. Tanpa prediksi harga." segs={T_GUARD} totalFrames={f} accent="#ffcf96" callouts={[{ t: 1.9, icon: "⛔", text: "Transaksi → ditolak", tone: "amber" }, { t: 6.3, icon: "⛔", text: "Prediksi harga → ditolak", tone: "amber" }]} /> },
  { id: "t6", frames: secs(8), sfx: SCENE_SFX.t6, node: (f) => <PhoneScene kicker="RINGKASAN HARIAN" title="Otomatis." sub="Gainers, losers, arus asing, dan berita." segs={T_BRIEF} totalFrames={f} callouts={[{ t: 1.0, icon: "📰", text: "Ringkasan pasar harian" }]} /> },
  { id: "t7", frames: secs(10), sfx: [{ t: 0.15, name: "thud", vol: 0.6 }, { t: 0.8, name: "sparkle", vol: 0.5 }], node: () => <ClosingScene /> },
];
export const teaserDuration = () => teaserScenes().reduce((a, s) => a + s.frames, 0);

export const Teaser: React.FC = () => {
  const scenes = teaserScenes();
  const total = teaserDuration();
  let at = 0;
  const chapters = scenes.map((s) => {
    const c = { label: "", from: at, frames: s.frames };
    at += s.frames;
    return c;
  });
  return (
    <>
      <Audio
        src={staticFile("audio/music.mp3")}
        volume={(f) => 0.2 * interpolate(f, [0, 30, total - 120, total], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {scenes.map((s, i) => (
        <Sequence key={s.id} from={chapters[i].from} durationInFrames={s.frames}>
          <Shell audio={s.id} durationFrames={s.frames} sfx={s.sfx} first={i === 0}>
            {s.node(s.frames)}
          </Shell>
        </Sequence>
      ))}
      <Hud chapters={chapters} total={total} chip={false} />
    </>
  );
};
