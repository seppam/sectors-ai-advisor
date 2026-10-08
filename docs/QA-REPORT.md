# QA Report — Sectors AI Advisor

Run: 8 Oct 2026, production build (`next build && next start`), Chromium 390×844 @2x, **live** Sectors API v2 + OpenRouter (`deepseek/deepseek-chat-v3-0324`).
Driver: [`scripts/qa-live.mjs`](../scripts/qa-live.mjs). Screenshots: [`docs/screenshots/qa/`](screenshots/qa). Unit/e2e: `npx playwright test` (28 tests).

| # | Flow | Result | Notes |
|---|---|---|---|
| 1 | Welcome screen: logo, 3 pills, 4 example questions | PASS | Logo loads (was a dead external URL). |
| 2 | "Apa itu PBV dan ROE?" → separate user + assistant bubbles → tap term chip → glossary panel | PASS | No Sectors call for concept questions (was HTTP 400 `NON_TRANSLATABLE_QUERY`). 1 LLM call. |
| 3 | "BBCA harganya udah mahal belum?" → view source | PASS | Source panel lists `/company/report/BBCA/`. |
| 4 | "Bandingkan BBCA dan BBRI" | PASS | Two citations (BBCA + BBRI company reports). |
| 5 | "Top gainers hari ini" | PASS | Real movers from `/companies/top-changes/` (FORU, VICI, BELI, …). |
| 6 | "Beli BBCA sekarang?" | PASS | Guardrail block; **0 network calls** (no LLM, no Sectors). |
| 7 | "Prediksi harga BBRI minggu depan" | PASS | "Di Luar Cakupan" block; 0 network calls. |
| 8 | "Apa itu buyback?" / "Laporan keuangan BBCA bulan ini" | PASS | Neither is blocked; both answered. |
| 9 | Daily Brief → Buat Ringkasan | PASS | Top gainers/losers, foreign flow, news + AI summary. |
| 10 | Watchlist: add BBCA, duplicate BBCA, "BC", "ZZZZ" | PASS | Duplicate → "sudah ada"; BC → invalid format; ZZZZ → "tidak ditemukan". |

LLM calls in the full run: 7 (each < US$0.01).

## Bugs found and fixed during QA
1. **Sectors client used non-existent endpoints** (`/company/{sym}/`, `/ranking/top-changes/`, `/broker/foreign-flow/`, `/stock/daily/`) → 404 = the "error connecting to Sectors API". Migrated to v2 paths (`/company/report/{sym}/`, `/companies/top-changes/`, `/foreign-flow/`, `/daily/{sym}/`) and fixed section names (`overview`, `valuation`, `financials`, `dividend`).
2. **CORS**: `api.sectors.app` rejects browser calls from origins other than `localhost:3000`; any deployed build would have failed. All browser calls now go through the stateless `/api/sectors` proxy.
3. **Concept questions hit the screener** → 400 `NON_TRANSLATABLE_QUERY` surfaced as a Next.js error overlay. Now skipped / treated as "no data".
4. **Watchlist**: the "symbol not found" error was cleared immediately after being set, so invalid tickers looked silently ignored.
5. **Citation toggle** state was keyed by array index and leaked across conversations; now keyed by message id.
6. Layout: fixed TopBar/BottomNav overlapped content; broken logo URL; raw `**markdown**` shown in answers; no chat history. All fixed (history drawer with auto titles added).
7. Outdated e2e selectors (`textarea`) updated; no-network guardrail tests now also cover the Sectors proxy.

## Known limitations
- Sectors v2 has no credit-balance endpoint; Settings now validates the key instead of showing credits.
- Foreign-flow card aggregates the top 20 returned tickers (not the whole market).
- LLM wording varies between runs; the verified signals are routing, citations and guardrails, not exact text.
