import React from "react";
import { Sequence } from "remotion";
import { SEGS, segsFrames } from "./data";
import { Shell, sceneFrames } from "./components/Shell";
import { ClosingScene, DiagramScene, PhoneScene, ProblemScene, QAScene, TitleScene } from "./scenes/Scenes";

type Scene = { id: string; frames: number; node: (frames: number) => React.ReactNode };

const phone = (audio: string, segs: (typeof SEGS)[keyof typeof SEGS], p: { kicker: string; title: string; sub: string }): Scene => ({
  id: audio,
  frames: sceneFrames(audio, segsFrames(segs)),
  node: (frames) => <PhoneScene {...p} segs={segs} totalFrames={frames} />,
});

export const judgingScenes = (): Scene[] => [
  { id: "j1", frames: sceneFrames("j1", 0, 1.5), node: () => <ProblemScene headline="Data ada. Pemahaman belum." sub="PER · PBV · ROE · DER — apa artinya?" /> },
  { id: "j2", frames: sceneFrames("j2"), node: () => <TitleScene still="shots/01-welcome.png" /> },
  phone("j3", SEGS.glossary, { kicker: "CHAT + GLOSSARY", title: "Istilah keuangan jadi chip", sub: "Ketuk PBV, ROE, PER… definisi, rumus, dan tanda bagus / perlu perhatian langsung muncul." }),
  phone("j4", SEGS.bbca, { kicker: "DATA LIVE + SUMBER", title: "Jawaban dari Sectors API", sub: "Laporan perusahaan live dibandingkan rata-rata sektor. Tiap jawaban menampilkan endpoint yang dipakai." }),
  phone("j5", SEGS.compare, { kicker: "PERBANDINGAN", title: "BBCA vs BBRI", sub: "Dua laporan live, dua sitasi, satu jawaban." }),
  phone("j6", SEGS.guardrails, { kicker: "GUARDRAIL", title: "Tolak transaksi & prediksi harga", sub: "Diblokir sebelum API apa pun dipanggil: 0 kredit Sectors, 0 token." }),
  phone("j7", SEGS.brief, { kicker: "RINGKASAN HARIAN", title: "Pasar hari ini, versi pemula", sub: "Top gainers & losers · arus dana asing · berita pasar." }),
  phone("j8", SEGS.watchlist, { kicker: "DAFTAR PANTAU", title: "PER · PBV · ROE · DER", sub: "Simbol dengan format salah atau tidak ditemukan ditolak dengan pesan jelas." }),
  { id: "j9", frames: sceneFrames("j9", 0, 1.5), node: (f) => <DiagramScene durationFrames={f} /> },
  { id: "j11", frames: sceneFrames("j11", 0, 1.5), node: (f) => <QAScene durationFrames={f} /> },
  { id: "j10", frames: sceneFrames("j10", 0, 2.5), node: () => <ClosingScene /> },
];

export const judgingDuration = () => judgingScenes().reduce((a, s) => a + s.frames, 0);

export const JudgingVideo: React.FC = () => {
  let at = 0;
  return (
    <>
      {judgingScenes().map((s) => {
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
