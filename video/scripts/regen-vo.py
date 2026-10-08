"""Generate VO segments with VoiceStudio and verify each with Whisper; retry with tweaked sampling until >= 0.9 match.
usage: WHISPER_MODEL=<ct2 dir> python scripts/regen-vo.py j5 t2 ...   (VoiceStudio running on :3900)"""
import json, re, sys, os, difflib, pathlib, subprocess
import numpy as np
from faster_whisper import WhisperModel

root = pathlib.Path(__file__).parent.parent
narr = json.load(open(root / "scripts/narration.json")); texts = {**narr["judging"], **narr["teaser"]}
model = WhisperModel(os.environ["WHISPER_MODEL"], device="cpu", compute_type="int8")
ALIASES = {"klod": "claude", "cloud": "claude", "clod": "claude", "sep": "seppam", "pam": "", "spam": "seppam", "sepam": "seppam", "sektor": "sectors", "sektors": "sectors", "sector": "sectors", "roi": "roe"}

def norm(s):
    s = re.sub(r"\b([A-Za-z])-(?=[A-Za-z]\b)", r"\1", s.lower().replace("i-d-x", "idx"))
    return [x for x in (ALIASES.get(w, w) for w in re.findall(r"[a-z0-9]+", s)) if x]

def transcribe(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "1", "-ar", "16000", "-"], capture_output=True).stdout
    segs, _ = model.transcribe(np.frombuffer(raw, dtype=np.float32), language="id", beam_size=5)
    return " ".join(s.text.strip() for s in segs)

# Every segment is cloned from one verified reference take (public/audio/ref.wav = j7) so the voice is identical across scenes.
REF = root / "public/audio/ref.wav"
REF_TEXT = texts["j7"]
VARIANTS = [dict(num_step=32, speed=0.97, seed=2026), dict(num_step=32, speed=0.97, seed=7), dict(num_step=32, speed=1.0, seed=99),
            dict(num_step=40, speed=0.95, seed=2026), dict(num_step=40, speed=0.97, seed=11), dict(num_step=32, speed=0.93, seed=5)]
for i in sys.argv[1:]:
    best = (-1, None)
    for k, v in enumerate(VARIANTS):
        out = root / f"public/audio/{i}.raw"
        subprocess.run(["curl", "-sf", "-X", "POST", "http://127.0.0.1:3900/generate", "-F", f"text={texts[i]}", "-F", "language=Indonesian",
                        "-F", f"ref_audio=@{REF}", "-F", f"ref_text={REF_TEXT}", "-F", f"seed={v['seed']}", "-F", f"num_step={v['num_step']}", "-F", f"speed={v['speed']}", "-o", str(out)], check=True)
        mp3 = root / f"public/audio/{i}.mp3"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(out), "-ar", "44100", "-ac", "1", "-b:a", "160k", str(mp3)], check=True)
        heard = transcribe(mp3)
        r = difflib.SequenceMatcher(None, norm(texts[i]), norm(heard)).ratio()
        print(f"{i} try{k} {v} match={r:.2f} | {heard}", flush=True)
        if r > best[0]:
            best = (r, mp3.read_bytes())
        if r >= 0.9: break
    else:
        (root / f"public/audio/{i}.mp3").write_bytes(best[1]); print(f"{i}: kept best match {best[0]:.2f}")
