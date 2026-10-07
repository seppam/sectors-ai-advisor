# Test Scenarios — Sectors AI Advisor

Manual QA checklist to run **before recording the demo**. Estimated time: 25–30 minutes.
Mark each row ✅ / ❌ and note anything odd. Automated checks are at the bottom.

---

## 0. Pre-flight

| # | Check | Expected |
|---|---|---|
| 0.1 | `npm install && npm run build` | Build succeeds with no errors |
| 0.2 | `npm run dev` → open `http://localhost:3000` | Redirects to `/chat` (or onboarding on first run) |
| 0.3 | Use a **fresh browser profile / incognito** | Clean localStorage, as a judge would see it |
| 0.4 | Sectors API key has credits | Settings → check balance > 0 |
| 0.5 | Chrome DevTools → device toolbar → 390×844 | App is designed mobile-first; record at this size |

---

## 1. Onboarding (first launch)

| # | Steps | Expected |
|---|---|---|
| 1.1 | Open the app with empty localStorage | 4-step onboarding appears |
| 1.2 | Step 1: pick Bahasa Indonesia, then Next | UI strings are Indonesian |
| 1.3 | Step 2: select 2–3 sectors | Selections highlight; Next enabled |
| 1.4 | Step 3: toggle Daily Brief | Toggle state changes |
| 1.5 | Step 4: try to finish **without** agreeing to the disclaimer | Cannot proceed |
| 1.6 | Agree + finish | Lands in the app (chat, or Settings if no key) |
| 1.7 | Reload the page | Onboarding does **not** reappear |

## 2. Settings

| # | Steps | Expected |
|---|---|---|
| 2.1 | Paste Sectors API key | Saved; survives reload |
| 2.2 | Check credit balance | Shows a number (or a clear error for a bad key) |
| 2.3 | Choose LLM provider, paste key | Saved; survives reload |
| 2.4 | Choose "Other (OpenAI-compat)" | Base URL + Model Name fields appear |
| 2.5 | Tap a quick-fill preset (e.g. OpenRouter + DeepSeek V3) | Base URL and model are filled |
| 2.6 | Switch language ID ↔ EN | Whole UI (nav, placeholders, empty states) switches |
| 2.7 | Enter a **wrong** LLM key, then ask a question in chat | Readable error in the chat bubble, app does not crash |
| 2.8 | Reset All Data | Keys, chat, watchlist cleared |

## 3. Chat — happy path (needs both keys)

| # | Message | Expected |
|---|---|---|
| 3.1 | *(empty state)* | Logo, 3 feature pills, 4 example questions |
| 3.2 | Tap **"Apa itu PBV dan ROE?"** | Your message appears as a **user bubble**, then a **separate assistant bubble** with the explanation |
| 3.3 | In that answer, tap a highlighted term chip (e.g. PBV) | Glossary panel slides up with definition; closes cleanly |
| 3.4 | `BBCA harganya udah mahal belum?` | Answer cites BBCA fundamentals; no recommendation to buy/sell; disclaimer present |
| 3.5 | Tap "view source" under 3.4 | Citation list shows the Sectors endpoint(s) used (e.g. company report for BBCA) |
| 3.6 | `Bandingkan BBCA dan BBRI` | Side-by-side comparison of both tickers; 2 citations |
| 3.7 | `Top gainers hari ini` | List of top movers from Sectors API |
| 3.8 | `Saham bank mana yang ROE-nya di atas 15%?` | Screener-based answer (several banks) |
| 3.9 | `bbca vs bbri` (lowercase) | Still recognised as tickers and compared |
| 3.10 | Follow-up: `Mana yang lebih murah?` | Uses the previous turn as context |
| 3.11 | Switch to English → `What does DER mean?` | English answer with glossary chip |
| 3.12 | Reload the page | Chat history is kept; user and assistant bubbles in the right order |
| 3.13 | Open the usage panel (appears after the first answer) | Shows token + Sectors credit counters, increasing after each question |

## 4. Guardrails

Guardrails run **before** any network call and **work even without API keys**.

| # | Message | Expected |
|---|---|---|
| 4.1 | `Beli BBCA sekarang?` | "Di Luar Cakupan" — no transactions; mentions OJK-registered broker |
| 4.2 | `Should I sell my TLKM?` | English variant of the same block |
| 4.3 | `Prediksi harga BBRI minggu depan` | "Tidak bisa memprediksi…" block |
| 4.4 | `Will BBCA go up tomorrow?` | Prediction block (English) |
| 4.5 | `Berapa target harga BBCA?` | Blocked (price target) |
| 4.6 | `Analisis bitcoin` / `forex hari ini` | IDX-only scope message |
| 4.7 | `Apa itu pembelian kembali saham (buyback)?` | **Not** blocked — normal answer (no false positive on "beli"/"buy") |
| 4.8 | `Laporan keuangan BBCA bulan ini` | **Not** blocked |
| 4.9 | Clear all keys (Settings → Reset), then send `Beli BBCA` | Still shows the guardrail message (not the "API key not set" message) |
| 4.10 | Check Network tab during 4.1–4.6 | **Zero** requests to Sectors or any LLM provider |

## 5. Daily Brief

| # | Steps | Expected |
|---|---|---|
| 5.1 | Open the Summary tab with no keys | Empty state / clear message to set keys |
| 5.2 | With keys, tap **Buat Ringkasan** | Loading spinner, then top gainers, top losers, foreign flow, news and an AI summary |
| 5.3 | Run it on a weekend / holiday | Falls back to the last trading day; no crash if some endpoints return empty |
| 5.4 | Language EN | Brief is generated in English |
| 5.5 | Tap generate twice quickly | No duplicate requests / UI stays consistent |

## 6. Watchlist

| # | Steps | Expected |
|---|---|---|
| 6.1 | Add `BBCA` | Card appears with P/E, PBV, ROE, DER, yield |
| 6.2 | Add `bbri` (lowercase) | Normalised to BBRI |
| 6.3 | Add `BBCA` again | "Already in watchlist" error |
| 6.4 | Add `BC` or `BBCAA` | "Invalid symbol format" error |
| 6.5 | Add `ZZZZ` (non-existent) | Rejected with an error — not added |
| 6.6 | Remove an item | Disappears |
| 6.7 | Reload | Items persist and metrics refresh |

## 7. Robustness & polish

| # | Check | Expected |
|---|---|---|
| 7.1 | Turn off Wi-Fi, ask a question | Readable error bubble; app still usable |
| 7.2 | Send a 1,000-character message | No layout break |
| 7.3 | Rapid double-send | Second send ignored while loading |
| 7.4 | Mobile viewport 390px and desktop 1440px | No horizontal scroll; bottom nav always visible |
| 7.5 | Keyboard: Enter sends, Shift+Enter newline | Works |
| 7.6 | Console during a full run | No red errors |
| 7.7 | Open `/api/debug/guardrail?msg=beli+bbca` in `npm run dev` | JSON with `triggered: true` |
| 7.8 | Share the link in Slack/WhatsApp (after deploy) | Preview shows `og-image.png` |

---

## Automated checks

```bash
npx tsc --noEmit                 # type check
npx eslint src                   # 0 errors expected
npx playwright test              # e2e: chat, guardrails, settings, watchlist
npx playwright test e2e/guardrails.spec.ts   # guardrails only
```

> Playwright needs the dev server (it starts `npm run dev` automatically) and a one-time `npx playwright install chromium`.

## Known limitations (be honest in the video / Q&A)

- Not financial advice; no trade execution by design.
- Answers depend on the Sectors API data available for the account's plan and on the chosen LLM.
- API keys entered in Settings live in browser localStorage (BYOK model); use the `/api/*` proxy routes + `.env.local` for server-side keys when deploying.
- Ticker detection looks for 4-letter tickers (uppercase, or a list of common lowercase ones); unusual lowercase tickers fall back to the screener.
