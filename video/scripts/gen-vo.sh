#!/bin/bash
# Generate one VO segment with VoiceStudio's local API (fixed seed => same voice across segments).
# usage: gen-vo.sh <id> "<text>"
set -e
OUT="$(dirname "$0")/../public/audio"
mkdir -p "$OUT"
curl -sf -X POST http://127.0.0.1:3900/generate \
  -F "text=$2" -F "language=Indonesian" -F "instruct=middle-aged, low pitch" \
  -F "seed=2026" -F "num_step=24" -F "speed=0.97" -o "$OUT/$1.raw"
file "$OUT/$1.raw" | cut -c1-120
