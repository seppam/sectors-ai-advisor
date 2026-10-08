"""Transcribe every VO segment with Whisper and report how much of the script was actually spoken.
usage: python check-vo.py [ids...]   (needs: pip install faster-whisper)"""
import json, re, sys, difflib, pathlib
from faster_whisper import WhisperModel

import glob, os, subprocess
import numpy as np
MODEL = os.environ.get("WHISPER_MODEL") or "small"  # path to a faster-whisper (CT2) model dir, or a size name
root = pathlib.Path(__file__).parent.parent
narr = json.load(open(root / "scripts/narration.json"))
texts = {**narr["judging"], **narr["teaser"]}
ids = sys.argv[1:] or list(texts)
model = WhisperModel(MODEL, device="cpu", compute_type="int8")

def norm(s):
    s = s.lower().replace("i-d-x", "idx")
    return re.findall(r"[a-z0-9]+", s)

worst = []
for i in ids:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(root / f"public/audio/{i}.mp3"), "-f", "f32le", "-ac", "1", "-ar", "16000", "-"], capture_output=True).stdout
    audio = np.frombuffer(raw, dtype=np.float32)
    segs, _ = model.transcribe(audio, language="id", beam_size=5)
    heard = " ".join(s.text.strip() for s in segs)
    exp, got = norm(texts[i]), norm(heard)
    r = difflib.SequenceMatcher(None, exp, got).ratio()
    missing = [w for op, a0, a1, b0, b1 in difflib.SequenceMatcher(None, exp, got).get_opcodes() if op in ("delete", "replace") for w in exp[a0:a1]]
    print(f"{i:4s} match={r:.2f} missing={missing}")
    print(f"     heard: {heard}")
    worst.append((r, i))
print("lowest:", sorted(worst)[:5])
