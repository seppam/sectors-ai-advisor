import React from "react";
import { Audio, interpolate, Sequence, staticFile } from "remotion";
import { FPS } from "./theme";
import { SCENE_SFX, SEGS, segsFrames } from "./data";
import type { SfxEvent } from "./components/Sfx";
import { Shell, sceneFrames } from "./components/Shell";
import { Hud } from "./components/Hud";
import { ClosingScene, DiagramScene, PhoneScene, ProblemScene, QAScene, StingScene, TitleScene, diagramSfx, problemSfx, qaSfx } from "./scenes/Scenes";

type Scene = { id: string; audio?: string; label: string; frames: number; sfx: (frames: number) => SfxEvent[]; node: (frames: number) => React.ReactNode };

const phone = (audio: string, segs: (typeof SEGS)[keyof typeof SEGS], label: string, p: { kicker: string; title: string; sub: string; callouts: { t: number; icon: string; text: string; tone?: "teal" | "amber" }[] }): Scene => ({
  id: audio, audio, label,
  frames: sceneFrames(audio, segsFrames(segs)),
  sfx: () => SCENE_SFX[audio] ?? [],
  node: (frames) => <PhoneScene {...p} segs={segs} totalFrames={frames} />,
});

export const judgingScenes = (): Scene[] => [
  { id: "sting", label: "", frames: Math.round(5 * FPS), sfx: () => [{ t: 0, name: "riser", vol: 0.5 }, { t: 0.27, name: "thud", vol: 0.8 }, { t: 0.5, name: "sparkle", vol: 0.5 }], node: () => <StingScene subtitle="Demo & Penjelasan Teknis" /> },
  { id: "j1", audio: "j1", label: "MASALAH", frames: sceneFrames("j1", 0, 1.5), sfx: () => problemSfx, node: () => <ProblemScene headline="Data ada. Pemahaman belum." sub="PER · PBV · ROE · DER — apa artinya?" /> },
  { id: "j2", audio: "j2", label: "SOLUSI", frames: sceneFrames("j2"), sfx: () => [{ t: 0.4, name: "thud", vol: 0.5 }, { t: 1.4, name: "sparkle", vol: 0.4 }], node: () => <TitleScene still="shots/01-welcome.png" /> },
  phone("j3", SEGS.glossary, "CHAT & GLOSSARY", { kicker: "CHAT + GLOSSARY", title: "Istilah keuangan jadi chip", sub: "Ketuk PBV, ROE, PER… definisi, rumus, dan tanda bagus / perlu perhatian langsung muncul.", callouts: [{ t: 3.5, icon: "✨", text: "Jawaban dengan chip istilah" }, { t: 9.0, icon: "👆", text: "Ketuk chip → definisi, rumus, indikator" }] }),
  phone("j4", SEGS.bbca, "DATA LIVE", { kicker: "DATA LIVE + SUMBER", title: "Jawaban dari Sectors API", sub: "Laporan perusahaan live dibandingkan rata-rata sektor. Tiap jawaban menampilkan endpoint yang dipakai.", callouts: [{ t: 2.4, icon: "📡", text: "Menarik laporan BBCA live" }, { t: 6.4, icon: "⚖️", text: "Valuasi vs rata-rata sektor" }, { t: 13.0, icon: "🔎", text: "Sumber: /company/report/BBCA/" }] }),
  phone("j5", SEGS.compare, "PERBANDINGAN", { kicker: "PERBANDINGAN", title: "BBCA vs BBRI", sub: "Dua laporan live, dua sitasi, satu jawaban.", callouts: [{ t: 1.25, icon: "📡", text: "2 laporan live sekaligus" }, { t: 7.17, icon: "🔎", text: "2 sitasi: BBCA + BBRI" }] }),
  phone("j6", SEGS.guardrails, "GUARDRAIL", { kicker: "GUARDRAIL", title: "Tolak transaksi & prediksi harga", sub: "Diblokir sebelum API apa pun dipanggil: 0 kredit Sectors, 0 token.", callouts: [{ t: 1.8, icon: "⛔", text: "Transaksi → ditolak, 0 panggilan", tone: "amber" }, { t: 8.7, icon: "⛔", text: "Prediksi harga → ditolak, 0 panggilan", tone: "amber" }] }),
  phone("j7", SEGS.brief, "RINGKASAN", { kicker: "RINGKASAN HARIAN", title: "Pasar hari ini, versi pemula", sub: "Top gainers & losers · arus dana asing · berita pasar.", callouts: [{ t: 1.1, icon: "📡", text: "Menarik data pasar live" }, { t: 3.42, icon: "📰", text: "Ringkasan siap dibaca pemula" }] }),
  phone("j8", SEGS.watchlist, "WATCHLIST", { kicker: "DAFTAR PANTAU", title: "PER · PBV · ROE · DER", sub: "Simbol dengan format salah atau tidak ditemukan ditolak dengan pesan jelas.", callouts: [{ t: 1.4, icon: "✔️", text: "Validasi lewat Sectors API" }, { t: 3.75, icon: "⛔", text: "Duplikat ditolak", tone: "amber" }, { t: 4.75, icon: "⛔", text: "Format salah ditolak", tone: "amber" }, { t: 6.65, icon: "⛔", text: "Simbol tak ada ditolak", tone: "amber" }] }),
  { id: "j9", audio: "j9", label: "ARSITEKTUR", frames: sceneFrames("j9", 0, 1.5), sfx: (f) => diagramSfx(f), node: (f) => <DiagramScene durationFrames={f} /> },
  { id: "j11", audio: "j11", label: "PENGUJIAN", frames: sceneFrames("j11", 0, 1.5), sfx: (f) => qaSfx(f), node: (f) => <QAScene durationFrames={f} /> },
  { id: "j10", audio: "j10", label: "PENUTUP", frames: sceneFrames("j10", 0, 2.5), sfx: () => [{ t: 0.15, name: "thud", vol: 0.6 }, { t: 0.7, name: "sparkle", vol: 0.5 }], node: () => <ClosingScene /> },
];

export const judgingDuration = () => judgingScenes().reduce((a, s) => a + s.frames, 0);

export const JudgingVideo: React.FC = () => {
  const scenes = judgingScenes();
  const total = judgingDuration();
  let at = 0;
  const chapters = scenes.map((s) => {
    const c = { label: s.label, from: at, frames: s.frames };
    at += s.frames;
    return c;
  });
  return (
    <>
      <Audio
        src={staticFile("audio/music.mp3")}
        volume={(f) => 0.17 * interpolate(f, [0, 45, total - 150, total], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {scenes.map((s, i) => (
        <Sequence key={s.id} from={chapters[i].from} durationInFrames={s.frames}>
          <Shell audio={s.audio} durationFrames={s.frames} sfx={s.sfx(s.frames)} first={i === 0}>
            {s.node(s.frames)}
          </Shell>
        </Sequence>
      ))}
      <Hud chapters={chapters} total={total} />
    </>
  );
};
