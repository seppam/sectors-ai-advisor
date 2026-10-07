# Sectors AI Advisor

**Sectors Hackathon 2026 · Track 1: AI Agents & Assistants**

AI-powered investment assistant for Indonesian retail investors. Translates complex IDX market data into plain-language insights with in-line glossary chips, daily market briefs, and watchlist tracking.

---

## 🚀 Quick Start

```bash
# 1. Clone & install
npm install

# 2. Start dev server
npm run dev
# Open http://localhost:3000

# 3. Build for production
npm run build
npm start
```

---

## ⚙️ Setup

### 1. Get API Keys

| Service | Where to get it |
|---|---|
| **Sectors API** | https://sectors.app/api *(requires Sectors Insider plan)* |
| **Anthropic Claude** | https://console.anthropic.com/settings/keys |
| **OpenAI GPT-4o** | https://platform.openai.com/api-keys |
| **DeepSeek V3** | https://platform.deepseek.com/api-docs/api |
| **OpenRouter** | https://openrouter.ai/sign-up *(gateway for 500+ models)* |
| **nexotao** | https://nexotao.com *(Indonesian gateway, IDR pricing)* |

> Hackathon participants receive **500 free Sectors API credits** upon completing onboarding.

### 2. Enter Keys in the App

Open **Settings** tab (bottom nav) and fill in:
- `Sectors API Key`
- Choose LLM provider: **Anthropic Claude**, **OpenAI GPT-4o**, **DeepSeek V3**, or **Other (OpenAI-compatible)**

#### Custom LLM Gateway (OpenRouter, nexotao, etc.)

Select **Other (OpenAI-compatible)** and fill in:
- **API Key** — from your gateway provider
- **Base URL** — e.g. `https://openrouter.ai/api/v1`
- **Model Name** — e.g. `deepseek/deepseek-chat-v3-0324`

Quick-fill buttons are provided for common setups:
- 📡 OpenRouter + DeepSeek V3
- 🤖 OpenRouter + Claude Sonnet 4
- 🏠 LM Studio (local)
- 🇮🇩 nexotao + DeepSeek

**Supports any OpenAI-compatible gateway** including OpenRouter, nexotao, Azure OpenAI, LM Studio, Ollama, and more.

### 3. Complete Onboarding

On first launch the app shows a 4-step onboarding:
1. Choose language (Bahasa Indonesia / English)
2. Select market sectors of interest
3. Enable Daily Market Brief
4. Agree to the financial disclaimer

---

## ✨ Features

### 💬 Chat Interface
- Ask questions in Bahasa Indonesia or English
- Sectors API data fetched live as context for the LLM
- In-line **[TERM] chips** — click any financial term to see it explained in a slide-up glossary panel
- Guardrails: blocks trade execution requests, crypto/forex queries, price predictions
- Financial disclaimer on every response
- Data citation panel (shows which Sectors API endpoints were used)

### 📊 Daily Market Brief
- Generates a plain-language daily market summary
- Pulls: top gainers, top losers, foreign investor net flow, latest news
- Rendered as a formatted card with AI-generated analysis
- No backend needed — works entirely client-side

### 📋 Watchlist
- Add stocks by ticker symbol (e.g. BBCA, BBRI, TLKM)
- Shows key metrics: P/E, PBV, ROE, DER
- Add from chat using the watchlist feature

### ⚙️ Settings
- API key management with credit balance checker
- LLM provider switcher (Claude / GPT-4o / DeepSeek)
- Language toggle (ID / EN)
- Reset all data

---

## 🛡️ Guardrails

The bot enforces these rules on every query:

| Keyword Pattern | Response |
|---|---|
| `beli`, `jual`, `order`, `buy`, `sell` | "I cannot help with transactions. Please use an OJK-registered broker." |
| `crypto`, `bitcoin`, `forex` | "I focus on IDX-listed Indonesian stocks only." |
| `prediksi`, `forecast`, `akan naik` | "I cannot predict future prices. I can analyze historical data." |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Root — routes to onboarding or MainShell
│   ├── onboarding/page.tsx   # 4-step onboarding flow
│   ├── chat/page.tsx         # Main chat interface
│   ├── daily-brief/page.tsx  # Daily market brief
│   ├── watchlist/page.tsx    # Watchlist tracker
│   ├── settings/page.tsx     # API key & preferences
│   └── globals.css
├── components/
│   ├── MainShell.tsx         # Bottom nav + tab routing
│   └── GlossaryPanel.tsx     # Slide-up glossary panel
└── lib/
    ├── types.ts              # TypeScript types
    ├── i18n.ts               # ID/EN string translations
    ├── store.ts              # Zustand + localStorage state
    ├── sectorsApi.ts         # Sectors REST API client
    └── llmProviders.ts       # Anthropic / OpenAI / DeepSeek abstraction
```

---

## 🏗️ Architecture

```
User query (Bahasa / English)
    ↓
Guardrail check (keyword blocklist)
    ↓
Sectors API → fetches relevant data (screener, company report, top movers, news)
    ↓
LLM (Claude / GPT-4o / DeepSeek)
  System prompt: role + glossary + guardrails + disclaimer rules
  User prompt: query + Sectors data + glossary terms + conversation history
    ↓
Response rendered with [TERM:slug:label] chips → interactive glossary
    ↓
Disclaimer appended automatically
```

---

## 🎯 Submission Requirements

- [x] Public GitHub repository
- [ ] 1-minute teaser video
- [ ] 3-minute judging video (problem → demo → technical)
- [ ] One-sentence problem statement
- [ ] Social media post (Instagram/LinkedIn/Threads/TikTok) tagging @Sectors

**Deadline:** 8 October 2026 at 23:59 WIB

---

## 📝 Notes

- API keys are stored in **browser localStorage** (pure frontend, no backend)
- Sectors API credits: most endpoints cost **1 credit** per call
- The LLM is abstracted behind a provider interface — swap providers in Settings with no code changes
- **No automated trade execution** — the app analyzes and explains data only
