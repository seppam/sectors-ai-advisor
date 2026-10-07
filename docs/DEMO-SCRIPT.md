# Demo Script — Sectors AI Advisor

Two cuts from the same recording session: a **3-minute judging video** and a **1-minute teaser**.
Record the app at **390×844** (DevTools device mode) or on a phone; record voice-over separately if you can.

---

## Before you hit record

1. Fresh browser profile, language **Bahasa Indonesia**, keys set, onboarding already finished.
2. Run the whole Test Scenarios list once (sections 3–6) so the Sectors cache is warm and you know the answers load.
3. Chat history empty (Settings → Reset, then re-enter keys) so the welcome screen shows.
4. Watchlist **empty** (you will add BBCA live).
5. Close notifications, hide bookmarks bar, zoom 100%.
6. Do one dry run. Keep the questions below **exactly** — they are the ones verified to route correctly.

---

## 3-minute judging video — problem → demo → technical

| Time | Screen | Say (EN — translate/adapt to ID) |
|---|---|---|
| 0:00–0:20 | Title card (use `docs/assets/thumbnail-1280x672.png`) | "Millions of Indonesian retail investors see terms like PER, PBV and ROE and don't know what they mean. Data exists — understanding doesn't." |
| 0:20–0:40 | Landing / welcome screen | "Sectors AI Advisor is a chat assistant that explains IDX stocks in plain language, using live Sectors API data. Track 1: AI Agents & Assistants." |
| 0:40–1:05 | Tap **"Apa itu PBV dan ROE?"** → tap the PBV chip | "Every financial term is a chip. One tap opens a glossary — no googling." |
| 1:05–1:35 | Type `BBCA harganya udah mahal belum?` → open **view source** | "It pulls BBCA's fundamentals from Sectors API and explains them. And it shows exactly which endpoints it used — every answer is traceable." |
| 1:35–1:55 | `Bandingkan BBCA dan BBRI` | "Comparisons work the same way: two live reports, one clear answer." |
| 1:55–2:15 | Type `Beli BBCA sekarang?` then `Prediksi harga BBRI minggu depan` | "Guardrails: no trade execution, no price predictions. These are blocked before any API call, so they cost zero credits." |
| 2:15–2:30 | Summary tab → **Buat Ringkasan** | "The daily brief combines top gainers and losers, foreign flow and news into a beginner-friendly summary." |
| 2:30–2:40 | Watchlist → add BBCA | "And a watchlist with P/E, PBV, ROE and DER at a glance." |
| 2:40–2:55 | Architecture slide / README diagram | "Flow: query → guardrail → Sectors API → LLM (Claude, GPT-4o, DeepSeek or any OpenAI-compatible gateway) → answer with glossary chips and disclaimer. API responses are cached and prompts are token-optimised to save credits." |
| 2:55–3:00 | End card: repo URL + `@Sectors` | "Sectors AI Advisor — understand the market before you invest. Thank you." |

## 1-minute teaser

| Time | Screen | Line |
|---|---|---|
| 0:00–0:08 | Close-up of "PBV? ROE? DER?" text or welcome screen | "Saham IDX itu rumit." |
| 0:08–0:18 | Title card | "Sectors AI Advisor: tanya saham, dapat jawaban yang bisa dipahami." |
| 0:18–0:30 | `BBCA harganya udah mahal belum?` answer + chip tap | Fast cuts, no voice or one short line |
| 0:30–0:40 | Guardrail block on `Beli BBCA sekarang?` | "Tidak ada eksekusi transaksi. Hanya analisis." |
| 0:40–0:50 | Daily brief | "Ringkasan pasar harian otomatis." |
| 0:50–1:00 | End card with repo + hackathon tag | — |

---

## Recovery plan (if something fails on camera)

- **API slow/timeout:** cut and re-take; answers typically take a few seconds.
- **Unexpected answer wording:** LLM output varies — re-ask; the data/citations are what matter.
- **Rate-limited or out of credits:** keep one recorded good take of each flow and splice.
- **Fallback if live data is unavailable:** show the screenshots in `docs/screenshots/` and say the video uses recorded runs.

## Submission pack (fill in after upload)

| Item | Value |
|---|---|
| Project | Sectors AI Advisor |
| Track | 1 · AI Agents & Assistants |
| Repo | https://github.com/seppam/sectors-ai-advisor |
| Teaser (1 min) | _YouTube URL_ |
| Judging video (3 min) | _YouTube URL_ |
| Social post | _LinkedIn / IG URL — tag @Sectors_ |
| Thumbnail | `docs/assets/thumbnail-1280x672.png` (YouTube/Canva), `docs/assets/og-image.png` (social) |

### Social post (Indonesian)

```
Saya sudah submit project untuk Sectors Hackathon 2026! 🚀

Project : Sectors AI Advisor
Track   : 1 · AI Agents & Assistants
Problem : Dirancang untuk investor ritel Indonesia yang kesulitan memahami data pasar IDX (PER, PBV, ROE, DER), Sectors AI Advisor adalah asisten AI berbahasa Indonesia yang mengambil data live dari Sectors API, menjelaskan istilah keuangan secara in-line, dan menolak permintaan transaksi maupun prediksi harga.

Highlight:
• Data live Sectors API + panel sumber di setiap jawaban
• Chip istilah keuangan interaktif (glossary)
• Daily Market Brief & Watchlist
• Guardrail: tanpa eksekusi transaksi, tanpa prediksi harga

Links:
• Repo: https://github.com/seppam/sectors-ai-advisor
• Teaser: <URL>
• Judging video: <URL>

Terima kasih @Sectors atas hackathon-nya! #SectorsHackathon2026
```
