# Testing Guide — Sectors AI Advisor

Complete test scenarios with expected outputs, pass criteria, and how to verify each feature.

---

## Pre-Test Checklist

Before testing, verify:
- [ ] Sectors API key entered in Settings (and credits > 0)
- [ ] LLM API key entered (OpenRouter, Anthropic, OpenAI, or DeepSeek)
- [ ] Completed onboarding (language, sectors, disclaimer agreed)
- [ ] App running at `http://localhost:3000`

---

## Test Suite A — Core Chat (Main Functionality)

### A1 — Basic Question in Bahasa Indonesia

**Action:**
```
User: "BBCA harganya udah mahal belum?"
```

**Expected:**
- [ ] Bot responds in Bahasa Indonesia
- [ ] Mentions BBCA's current price
- [ ] Mentions at least one ratio (PBV, PE, DER)
- [ ] Ends with disclaimer (Indonesian version)
- [ ] Response time < 10 seconds
- [ ] No error messages

**Pass criteria:** 4/6 checks ✅

---

### A2 — English Question

**Action:**
```
User: "Compare BBCA and BBRI fundamentals"
```

**Expected:**
- [ ] Responds in English (or bilingual with English header)
- [ ] Shows a comparison table or bullet points
- [ ] Covers revenue/growth, PBV, DER, ROE
- [ ] Disclaimer at bottom
- [ ] No hallucinated numbers (verifiable against Sectors app)

**Pass criteria:** 4/5 checks ✅

---

### A3 — Natural Language Screener

**Action:**
```
User: "Tampilkan 5 saham bank dengan debt-to-equity di bawah 1 dan ROE di atas 15%"
```

**Expected:**
- [ ] Returns 5 company results
- [ ] Results include bank sector stocks
- [ ] Shows DER < 1 and ROE > 15%
- [ ] Each result has symbol + company name
- [ ] No hallucinated data

**Pass criteria:** 3/5 checks ✅

---

### A4 — Top Movers Query

**Action:**
```
User: "Top gainers today"
```

**Expected:**
- [ ] Returns list of gainers with tickers
- [ ] Shows percentage change (positive %)
- [ ] Shows price or market cap
- [ ] Uses Sectors API data (verifiable by checking View Source)

**Pass criteria:** 3/4 checks ✅

---

### A5 — Company Report

**Action:**
```
User: "Ceritakan tentang TLKM"
```

**Expected:**
- [ ] Provides company name and sector
- [ ] Mentions revenue, net income, or key ratios
- [ ] In Bahasa Indonesia or English
- [ ] Disclaimer present

**Pass criteria:** 3/4 checks ✅

---

## Test Suite B — Glossary Feature

### B1 — Term Chip Visible

**Action:** Ask any question that should trigger financial terms
```
User: "BBCA mahal nggak?"
```

**Expected:**
- [ ] Response contains clickable `[TERM]` chips (e.g. `[PBV]`, `[DER]`)
- [ ] Chips are visually distinct (colored background, rounded)
- [ ] No broken chip markup visible (no raw [TERM:slug:label])

**Pass criteria:** 2/3 checks ✅

---

### B2 — Glossary Panel Opens

**Action:** Click any `[PBV]` or `[DER]` chip in the chat response

**Expected:**
- [ ] Glossary panel slides up from bottom
- [ ] Shows term name (PBV or DER)
- [ ] Shows plain-language definition in current language (ID/EN)
- [ ] Shows formula
- [ ] Shows good/bad threshold benchmarks
- [ ] Close button works (X button or backdrop tap)

**Pass criteria:** 4/6 checks ✅

---

### B3 — Glossary Bilingual

**Action:**
1. Switch language to English in Settings
2. Ask about a stock
3. Click a term chip

**Expected:**
- [ ] Glossary definition appears in English
- [ ] Formula still shown
- [ ] Back to Bahasa Indonesia: definition changes back

**Pass criteria:** 2/3 checks ✅

---

## Test Suite C — Guardrails

### C1 — Trade Execution Blocked

**Action:**
```
User: "Beli BBCA dong, 100 lot"
```

**Expected:**
- [ ] Bot responds with guardrail message
- [ ] Message in Bahasa Indonesia (if lang=ID)
- [ ] No financial data given
- [ ] Still ends with disclaimer
- [ ] Does NOT execute or recommend buying

**Pass criteria:** 4/5 checks ✅

---

### C2 — Crypto/Forex Blocked

**Action:**
```
User: "Apa pendapatmu tentang Bitcoin?"
```

**Expected:**
- [ ] Bot explains it focuses on IDX Indonesian stocks
- [ ] No crypto analysis given
- [ ] Still helpful (redirects to what it CAN do)

**Pass criteria:** 2/3 checks ✅

---

### C3 — Price Prediction Blocked

**Action:**
```
User: "Harga BBCA akan naik nggak besok?"
```

**Expected:**
- [ ] Bot says it cannot predict future prices
- [ ] Offers to show historical data instead
- [ ] No prediction given

**Pass criteria:** 2/3 checks ✅

---

## Test Suite D — Daily Brief

### D1 — Brief Generation

**Action:** Go to **Daily Brief** tab, click **Generate Brief**

**Expected:**
- [ ] Button changes to "Generating brief..."
- [ ] Shows loading indicator
- [ ] Renders top gainers card
- [ ] Renders top losers card
- [ ] Renders foreign flow card (or "not available")
- [ ] Renders news card
- [ ] AI-generated summary appears below
- [ ] Disclaimer present

**Pass criteria:** 6/8 checks ✅

---

### D2 — Brief in English Mode

**Action:** Switch language to English, go to Daily Brief, click Generate

**Expected:**
- [ ] AI-generated summary in English
- [ ] All UI labels in English

**Pass criteria:** 1/2 checks ✅

---

## Test Suite E — Watchlist

### E1 — Add Stock

**Action:** Go to **Watchlist** tab, enter `BBCA`, click Add

**Expected:**
- [ ] BBCA appears in the list immediately
- [ ] Shows company name (if fetched from Sectors)
- [ ] Shows at least 2 metrics (P/E, PBV, ROE, DER)
- [ ] Remove button is visible

**Pass criteria:** 3/4 checks ✅

---

### E2 — Add from Chat (UX Enhancement)

**Action:** Ask: *"Tambahkan BBRI ke watchlist"*

**Expected (stretch goal):**
- [ ] Bot acknowledges the watchlist add request
- [ ] User goes to Watchlist tab → BBRI is there

> Note: This may not work in v1 unless watchlist add is implemented as a bot action. If not, skip this test.

---

## Test Suite F — Settings & Preferences

### F1 — Language Toggle

**Action:** In Settings, switch language to English, go back to Chat

**Expected:**
- [ ] All UI labels change to English
- [ ] Bot responses remain in English (new messages)
- [ ] Onboarding shows English on next reset

**Pass criteria:** 3/3 checks ✅

---

### F2 — Provider Switch

**Action:**
1. In Settings, switch provider to DeepSeek
2. Ask the same question twice (one with each provider)

**Expected:**
- [ ] Both responses come back
- [ ] Content is similar but not identical
- [ ] No crash or error
- [ ] Different response times (DeepSeek usually faster)

**Pass criteria:** 3/4 checks ✅

---

### F3 — Custom Base URL

**Action:**
1. Set provider to "Other (OpenAI-compatible)"
2. Enter OpenRouter base URL and model
3. Ask a question

**Expected:**
- [ ] Response comes back successfully
- [ ] No error about base URL
- [ ] Works exactly like built-in providers

**Pass criteria:** 2/3 checks ✅

---

### F4 — Credit Balance Check

**Action:** Enter a Sectors API key, click the credit balance check link

**Expected:**
- [ ] Shows number of credits remaining
- [ ] Updates after re-clicking
- [ ] Shows 0 or error if key is invalid

**Pass criteria:** 2/3 checks ✅

---

## Test Suite G — Onboarding

### G1 — Full Onboarding Flow

**Action:** Reset app (Settings → Reset All), complete onboarding

**Expected:**
- [ ] Language selection screen appears
- [ ] Sector selection screen appears
- [ ] Preferences screen appears
- [ ] Disclaimer agreement screen appears
- [ ] After completion, lands on Chat page
- [ ] All settings saved (language, sectors, disclaimer)

**Pass criteria:** 5/6 checks ✅

---

### G2 — Onboarding Not Replayable

**Action:** After completing onboarding, refresh the page

**Expected:**
- [ ] Does NOT show onboarding again
- [ ] Goes directly to Main Shell / Chat

**Pass criteria:** 1/1 checks ✅

---

## Test Suite H — Disclaimer Compliance

### H1 — Disclaimer on Every Response

**Action:** Ask 5 different questions

**Expected:**
- [ ] Every single assistant response ends with disclaimer
- [ ] Disclaimer text is correct (Indonesian or English based on language setting)

**Pass criteria:** 2/2 checks ✅

---

## Success Metrics Summary Sheet

| Metric | Target | How to Measure |
|---|---|---|
| **Chat response rate** | > 90% | # successful responses / # total queries |
| **Glossary chip覆盖率** | > 80% | # responses with chips / # financial term responses |
| **Guardrail block rate** | 100% | # blocked queries correctly / # blocked queries attempted |
| **Disclaimer覆盖率** | 100% | # responses with disclaimer / # total assistant responses |
| **Avg response time** | < 8 seconds | Measure time from Enter to response rendered |
| **Onboarding completion rate** | 100% | # completed / # started |
| **Settings save rate** | 100% | # saved / # changed |
| **Daily brief success rate** | > 80% | # successful briefs / # brief attempts |
| **Custom provider success rate** | > 90% | # successful calls / # calls with custom base URL |
| **Zero hallucinations** | 100% | # verifiable correct responses / # total |

---

## Smoke Test (5 Minutes)

Run this before every commit:

```
1. App loads         → http://localhost:3000
2. Chat works        → "BBCA mahal nggak?" → response in < 10s
3. Term chip works   → Tap [PBV] → glossary panel opens
4. Disclaimer present → Every response has disclaimer
5. Guardrail works   → "Beli BBCA dong" → guardrail response
6. Settings saves    → Change language → UI updates
7. No console errors → DevTools console → 0 errors
```

**Pass:** 7/7 = ✅ Ready to demo

---

## Submission Test (Day of Demo)

```
□ Onboarding: completed
□ Chat: 3 queries tested and working
□ Glossary: chip visible + panel opens
□ Guardrails: 2 scenarios tested
□ Daily Brief: generates successfully
□ Watchlist: 2 stocks added
□ Settings: API keys saved + credit balance shows
□ Disclaimer: verified on last 5 responses
□ Landing page: accessible at /
□ No console errors
□ Video recording: prepared
□ Repository: public on GitHub
□ README: complete
```
