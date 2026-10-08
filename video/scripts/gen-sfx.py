"""Procedural sound design (no licensed assets): SFX + a subtle music bed.
usage: python scripts/gen-sfx.py   (needs numpy; ffmpeg on PATH)  -> public/sfx/*.mp3, public/audio/music.mp3"""
import numpy as np, subprocess, wave, pathlib, tempfile

SR = 44100
root = pathlib.Path(__file__).parent.parent
rng = np.random.default_rng(2026)
t_ = lambda d: np.arange(int(d * SR)) / SR

def env(n, a=0.005, d=0.2, curve=4):
    e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    nd = max(1, int(d * SR)); e[-nd:] *= np.linspace(1, 0, nd) ** curve if curve else 1
    return e

def lp(x, cutoff):  # time-varying one-pole lowpass; cutoff scalar or array (Hz)
    c = np.broadcast_to(cutoff, x.shape); y = np.zeros_like(x); s = 0.0
    a = 1 - np.exp(-2 * np.pi * c / SR)
    for i in range(len(x)): s += a[i] * (x[i] - s); y[i] = s
    return y

def hp(x, cutoff): return x - lp(x, cutoff)
def norm(x, peak=0.9): return x / (np.max(np.abs(x)) + 1e-9) * peak

def save(name, x, folder="public/sfx"):
    p = root / folder; p.mkdir(parents=True, exist_ok=True)
    x16 = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    with tempfile.NamedTemporaryFile(suffix=".wav") as f:
        with wave.open(f.name, "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(x16.tobytes())
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f.name, "-b:a", "160k", str(p / f"{name}.mp3")], check=True)

# ── SFX ──────────────────────────────────────────────
def whoosh(d=0.7, up=True):
    n = int(d * SR); x = rng.standard_normal(n); sw = np.linspace(0, 1, n) if up else np.linspace(1, 0, n)
    y = lp(x, 250 + 5500 * sw ** 2); y = hp(y, 120)
    e = np.sin(np.linspace(0, np.pi, n)) ** 1.6
    return norm(y * e, 0.8)

def tap():
    x = t_(0.09); y = np.sin(2 * np.pi * 1900 * x) * np.exp(-x * 70) + 0.4 * np.sin(2 * np.pi * 760 * x) * np.exp(-x * 50)
    return norm(y, 0.7)

def pop():
    x = t_(0.16); f = 520 + 700 * (1 - np.exp(-x * 30)); y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 22)
    return norm(y, 0.75)

def ding(freqs=(1318, 1976), d=0.9):
    x = t_(d); y = sum(np.sin(2 * np.pi * f * x) * np.exp(-x * (4 + i * 3)) * (0.6 ** i) for i, f in enumerate(freqs))
    y += 0.25 * np.sin(2 * np.pi * freqs[0] * 2.01 * x) * np.exp(-x * 9)
    return norm(y, 0.7)

def chime_up():  # success: two rising notes
    a, b = ding((880, 1320), 0.7), ding((1175, 1760), 1.0)
    out = np.zeros(int(1.2 * SR)); out[:len(a)] += a * 0.8; out[int(0.14 * SR):int(0.14 * SR) + len(b)] += b
    return norm(out, 0.75)

def block():  # guardrail: soft low double-buzz
    x = t_(0.55); out = np.zeros_like(x)
    for s in (0.0, 0.22):
        i = int(s * SR); n = int(0.17 * SR); tt = np.arange(n) / SR
        sq = np.sign(np.sin(2 * np.pi * 138 * tt)) * 0.5 + np.sin(2 * np.pi * 276 * tt) * 0.3
        out[i:i + n] += lp(sq, 900) * np.exp(-tt * 14)
    return norm(out, 0.7)

def thud():
    x = t_(1.0); f = 48 + 70 * np.exp(-x * 14); y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 4.5)
    n = lp(rng.standard_normal(len(x)), 1800) * np.exp(-x * 18) * 0.35
    return norm(y + n, 0.95)

def riser(d=1.6):
    n = int(d * SR); x = rng.standard_normal(n); sw = np.linspace(0, 1, n)
    y = hp(lp(x, 400 + 7000 * sw ** 2), 200) * sw ** 1.5
    tone = np.sin(2 * np.pi * np.cumsum(180 + 900 * sw ** 2) / SR) * 0.15 * sw
    return norm((y + tone) * env(n, 0.02, 0.05, 1), 0.7)

def sparkle():
    out = np.zeros(int(1.4 * SR))
    for k in range(9):
        f = rng.choice([1568, 1760, 2093, 2349, 2637, 3136]); s = int(k * 0.07 * SR); x = t_(0.5)
        out[s:s + len(x)] += np.sin(2 * np.pi * f * x) * np.exp(-x * 9) * 0.4
    return norm(out, 0.6)

def ticks(n=12, gap=0.065):  # typing burst
    out = np.zeros(int((n * gap + 0.1) * SR))
    for k in range(n):
        s = int((k * gap + rng.uniform(-0.012, 0.012)) * SR); m = int(0.018 * SR)
        c = hp(rng.standard_normal(m), 1500) * np.exp(-np.arange(m) / SR * 220) * rng.uniform(0.5, 1)
        out[max(s, 0):max(s, 0) + m] += c[: len(out) - max(s, 0)]
    return norm(out, 0.5)

def swish_small():
    return norm(whoosh(0.28, True), 0.45)

for name, fn in dict(whoosh=whoosh, whoosh_down=lambda: whoosh(0.7, False), tap=tap, pop=pop, ding=ding, chime=chime_up,
                     block=block, thud=thud, riser=riser, sparkle=sparkle, ticks=ticks, swish=swish_small).items():
    save(name, fn())

# ── Music bed (A minor, 92 BPM): warm pad + soft pluck arpeggio + light pulse ──
def music(total=175.0, bpm=92):
    beat = 60 / bpm; bar = 4 * beat; n = int(total * SR); out = np.zeros(n)
    chords = [(110.0, [220.0, 261.63, 329.63]), (87.31, [174.61, 261.63, 349.23]), (130.81, [196.0, 261.63, 329.63]), (98.0, [196.0, 246.94, 293.66])]
    midi = lambda f: f
    for b in range(int(total / bar) + 1):
        root_f, tones = chords[(b // 2) % 4]; s = int(b * bar * SR); L = int(bar * 1.15 * SR)
        if s >= n: break
        tt = np.arange(min(L, n - s)) / SR
        e = np.minimum(tt / 0.9, 1) * np.exp(-np.maximum(tt - bar, 0) * 3.2)
        pad = sum(np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(2 * np.pi * f * 2.003 * tt) + 0.25 * np.sin(2 * np.pi * f * 3.01 * tt) for f in tones)
        pad += 1.6 * np.sin(2 * np.pi * root_f * tt)
        out[s:s + len(tt)] += pad * e * 0.05
        # arpeggio (8ths), alternating octave
        seq = [tones[0], tones[1], tones[2], tones[1] * 2, tones[2], tones[1], tones[0] * 2, tones[1]]
        for k, f in enumerate(seq):
            ps = s + int(k * beat / 2 * SR); m = int(0.9 * SR)
            if ps + m > n: continue
            x = np.arange(m) / SR
            pl = (np.sin(2 * np.pi * f * 2 * x) + 0.35 * np.sin(2 * np.pi * f * 4 * x)) * np.exp(-x * 5.5)
            out[ps:ps + m] += pl * 0.035 * (1.0 if k % 2 == 0 else 0.7)
        # soft kick on beats 1 & 3
        for kb in (0, 2):
            ps = s + int(kb * beat * SR); m = int(0.35 * SR)
            if ps + m > n: continue
            x = np.arange(m) / SR; out[ps:ps + m] += np.sin(2 * np.pi * np.cumsum(46 + 60 * np.exp(-x * 30)) / SR) * np.exp(-x * 11) * 0.10
    out = lp(out, 3800)
    fade = np.ones(n); fi = int(3 * SR); fo = int(5 * SR); fade[:fi] = np.linspace(0, 1, fi); fade[-fo:] = np.linspace(1, 0, fo)
    return norm(out * fade, 0.9)

save("music", music(), folder="public/audio")
print("sfx + music written")
