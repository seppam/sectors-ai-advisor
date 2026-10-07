# OpenRouter Setup Guide — Sectors AI Advisor

This guide walks you through getting an OpenRouter API key and choosing the right model for testing the Sectors AI Advisor.

---

## Why OpenRouter?

- **No monthly subscription** — pure pay-as-you-go, 5.5% platform fee only
- **500+ models** from 80+ providers in one account
- **OpenAI-compatible** — same code works with any provider
- **Credit card + crypto** accepted
- **Spend controls** — set a monthly cap so you can't overspend

---

## Step 1 — Create an OpenRouter Account

1. Go to **https://openrouter.ai/sign-up**
2. Sign up with email + password, or continue with Google/GitHub
3. Verify your email if prompted

---

## Step 2 — Add Credits ($5 is More Than Enough)

1. Go to **https://openrouter.ai/settings/credits**
2. Click **"Add Credits"**
3. Choose an amount:
   - **$5** → ~500–1000 DeepSeek V3 conversations (enough for the whole hackathon)
   - **$10** → same + budget for Claude Sonnet 4 testing
4. Pay with credit/debit card (Visa, Mastercard)

> **Hackathon tip:** DeepSeek V3 costs ~$0.001–0.01 per full conversation. $5 covers 500–1000+ queries.

---

## Step 3 — Generate an API Key

1. Go to **https://openrouter.ai/keys**
2. Click **"Create Key"**
3. Give it a name: `sectors-ai-advisor`
4. Set an optional **spend limit** (e.g. $5/month) to cap spending
5. Copy the key — it looks like: `sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## Step 4 — Choose a Model

### Recommended Models for This Hackathon

| Model | Best For | Cost per 1M tokens | Conversation cost |
|---|---|---|---|
| **DeepSeek V3** (fastest, cheapest) | Hackathon demo/testing | $0.27 in / $1.10 out | ~$0.001–0.005 |
| **Claude Sonnet 4** (highest quality) | Submission demo/finals | $3.00 in / $15.00 out | ~$0.05–0.20 |
| **GPT-4o** (balanced) | All-around | $2.50 in / $10.00 out | ~$0.03–0.15 |

### Model Names on OpenRouter

Use the `author/model` format:

```
deepseek/deepseek-chat-v3-0324        ← DeepSeek V3 (recommended for testing)
anthropic/sonnet-4-20250514           ← Claude Sonnet 4
openai/gpt-4o-2024-08-06             ← GPT-4o
google/gemini-2.5-flash              ← Gemini 2.5 Flash (cheapest GPT-4o competitor)
```

Browse all models: **https://openrouter.ai/models**

### Recommended Testing Setup

**For daily testing (cheapest):**
```
Base URL:     https://openrouter.ai/api/v1
API Key:      sk-or-v1-xxxxxxxxxxxxxxxxxxxxx
Model:        deepseek/deepseek-chat-v3-0324
```

**For submission demo (best quality):**
```
Base URL:     https://openrouter.ai/api/v1
API Key:      sk-or-v1-xxxxxxxxxxxxxxxxxxxxx
Model:        anthropic/sonnet-4-20250514
```

---

## Step 5 — Enter in Sectors AI Advisor

1. Open **Settings** tab
2. Set **Provider** to `Other (OpenAI-compatible)`
3. Paste your API key
4. Enter:
   - **Base URL:** `https://openrouter.ai/api/v1`
   - **Model:** `deepseek/deepseek-chat-v3-0324` (for testing)
5. Click **Save Settings**
6. Go to **Chat** and try: *"BBCA mahal nggak sih?"*

---

## Quick-Fill Buttons

The Settings page has quick-fill buttons for common setups:

| Button | Base URL | Model |
|---|---|---|
| 📡 OpenRouter + DeepSeek V3 | `https://openrouter.ai/api/v1` | `deepseek/deepseek-chat-v3-0324` |
| 🤖 OpenRouter + Claude Sonnet 4 | `https://openrouter.ai/api/v1` | `anthropic/sonnet-4-20250514` |
| 🏠 LM Studio (local) | `http://localhost:11434/v1` | `llama3` |
| 🇮🇩 nexotao + DeepSeek | `https://api.nexotao.com/v1` | `deepseek-chat` |

---

## Budget Controls

To prevent accidental overspending:

1. Go to **https://openrouter.ai/settings/limits**
2. Set a **monthly spend limit** (e.g. $5)
3. OpenRouter will stop accepting requests once the limit is hit

---

## Other OpenAI-Compatible Providers

The "Other" provider option works with any gateway that follows the OpenAI `/v1/chat/completions` format:

| Provider | Base URL | Notes |
|---|---|---|
| OpenRouter | `https://openrouter.ai/api/v1` | 500+ models |
| nexotao | `https://api.nexotao.com/v1` | IDR pricing, QRIS support |
| LM Studio | `http://localhost:11434/v1` | Local models (free, offline) |
| Ollama | `http://localhost:11434/v1` | Local open-weight models |
| Azure OpenAI | `https://<resource>.openai.azure.com/v1` | Enterprise, Microsoft SSO |

---

## Troubleshooting

**"API error 401"**
→ Your API key is wrong or expired. Check https://openrouter.ai/keys

**"API error 429"**
→ Rate limited or out of credits. Check your balance at openrouter.ai/settings/credits

**"API error 400"**
→ Model name is wrong. Use exact format: `author/model` (e.g. `deepseek/deepseek-chat-v3-0324`)

**"Credit card declined"**
→ OpenRouter requires a verified card. Try adding $2 first as a test.

**Slow responses**
→ DeepSeek V3 is the fastest. Claude/GPT-4o are slower but higher quality.
