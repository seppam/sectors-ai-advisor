# Sectors AI Advisor — UI Sitemap & Prototype Spec

> For Google Stitch (Figma) prototyping. All screens, components, and interactions documented.
> **Project:** Sectors AI Advisor — Indonesian Stock Market AI Chat App
> **Platform:** Mobile-first web app (390px base width, dark theme)
> **Theme:** Dark navy (`#0B1120` bg), Teal accent (`#00D4AA`), System font stack

---

## Navigation Architecture

```
┌─────────────────────────────────────────────┐
│                  APP FLOW                    │
│                                             │
│  Landing (/)                                │
│    └─► Onboarding (/onboarding) [4 steps]   │
│          ├─ Step 1: Language (ID/EN)         │
│          ├─ Step 2: Sector Interests         │
│          ├─ Step 3: Preferences              │
│          └─ Step 4: Disclaimer + Start       │
│               ├─► Settings (/settings)      │
│               │     (if no API key)         │
│               └─► Main Shell (/)            │
│                     ├─ Chat (/) [default]   │
│                     ├─ Daily Brief          │
│                     ├─ Watchlist            │
│                     └─ Settings             │
└─────────────────────────────────────────────┘

Bottom Nav Tabs:  Chat | Daily Brief | Watchlist | Settings
```

---

## Screen 1: Landing Page (`/`)

**When:** User visits the app for the first time (not onboarded yet)
**Layout:** Full-page scroll, no bottom nav

### Sections (top to bottom):

#### 1.1 Navbar (sticky)
- **Left:** Logo "S" icon (teal gradient rounded-square) + "Sectors AI Advisor" text (bold)
- **Right:** 
  - Language toggle button (globe icon + "EN"/"ID" text)
  - "Buka App" / "Open App" primary button → links to `/onboarding`

#### 1.2 Hero Section
- **Badge:** "Powered by Sectors API" (teal pill with pulsing dot)
- **H1:** "Asisten Investasi AI **untuk Pasar Indonesia**" / "AI Investment Assistant **for Indonesian Markets**"
- **Subtitle:** Paragraph about asking in Bahasa Indonesia, understanding ratios, daily monitoring
- **CTA Buttons (row):**
  - Primary: "Mulai Sekarang" / "Get Started Free" (with lightning icon) → `/onboarding`
  - Secondary: "Lihat Dokumentasi API" / "API Docs" (with doc icon) → external link
- **Micro-copy:** "Gratis · Tidak perlu kartu kredit · Setup dalam 2 menit"

#### 1.3 Example Questions Grid (2x2 cards)
4 example question cards, each with:
- Number badge (1-4, teal circle)
- Question text in quotes, e.g. *"BBCA harganya udah mahal belum?"*

#### 1.4 Features Grid (3 columns, 2 rows = 6 cards)
Each feature card:
- Icon in teal rounded square
- Title (ID/EN)
- Description paragraph

| # | Feature (ID) | Feature (EN) |
|---|---|---|
| 1 | Chat dalam Bahasa Indonesia | Chat in Bahasa Indonesia |
| 2 | Klik Istilah untuk Belajar | Tap Terms to Learn |
| 3 | Data Langsung dari Sectors API | Live Data from Sectors API |
| 4 | Aman & Patuh Regulasi | Safe & Compliant |
| 5 | Ringkasan Pasar Harian | Daily Market Brief |
| 6 | Pakai LLM Apapun | Use Any LLM |

#### 1.5 How It Works (3 steps, vertical timeline)
- Step circle (01, 02, 03) connected by vertical line
- Title + description per step
- Steps: Enter API Keys → Ask in Indonesian → Get Answers + Data

#### 1.6 Tech Stack (4-column grid)
Next.js | Tailwind CSS | Sectors API | LLM Gateway

#### 1.7 CTA Section (full-width, darker bg)
- Large app icon
- H2: "Siap Memulai?" / "Ready to Start?"
- Subtitle about free/no credit card
- Primary CTA button: "Buka Sectors AI Advisor"
- Footer: "Powered by Sectors API"

#### 1.8 Footer
- Left: Logo + © 2026
- Right: Links (Sectors API, Documentation, GitHub)

---

## Screen 2: Onboarding (`/onboarding`) — 4 Steps

**When:** First-time user clicks "Buka App" from landing
**Layout:** Full page, step indicator at top, back/continue buttons at bottom
**No bottom nav**

### Shared Elements (all steps):
- **Header:** "Selamat Datang!" / "Welcome!" 
- **Subtitle:** "Mari kita atur Sectors AI Advisor untukmu dalam 3 langkah."
- **Step dots:** 4 dots (● ● ○ ○ pattern, active=wide+teal, completed=teal dot, pending=gray dot)

---

### Step 1: Language Selection
**Title:** "Pilih Bahasa" / "Choose Your Language"
**Subtitle:** "Pilih bahasa utama untuk aplikasi."

**Content:** 2 large selectable cards:
- 🇮🇩 Bahasa Indonesia (selected = teal border + filled radio)
- 🇬🇧 English

**Action:** "Lanjut" / "Continue" primary button (full-width)

---

### Step 2: Market Interest (Sector Selection)
**Title:** "Minat Pasar" / "Market Interest"
**Subtitle:** "Pilih sektor yang kamu ikuti. Bisa dipilih lebih dari satu."

**Content:** 8 sector options (checkbox-style cards):
| Slug | Label (ID) | Label (EN) |
|------|-----------|------------|
| financials | Keuangan (Bank, Asuransi) | Financials (Banks, Insurance) |
| technology | Teknologi | Technology |
| basic-materials | Bahan Dasar (Mining) | Basic Materials (Mining) |
| energy | Energi | Energy |
| healthcare | Kesehatan | Healthcare |
| consumer-goods | Barang Konsumen | Consumer Goods |
| infrastructure | Infrastruktur & Properti | Infrastructure & Property |
| industrial | Industri | Industrial |

Each item: checkbox (teal when checked) + label text
**Hint:** "Pilih satu atau lebih. Biarkan kosong untuk semua sektor."

**Actions:** "Kembali" (secondary) + "Lanjut" (primary)

---

### Step 3: Preferences
**Title:** "Preferensi" / "Preferences"
**Subtitle:** "Atur bagaimana kamu ingin menggunakan aplikasi."

**Content:** 1 toggle card:
- 📋 "Ringkasan Pasar Harian" / "Daily Market Brief"
  - Subtitle about top movers, foreign flow, news summary
  - Toggle switch (ON/OFF, teal when on)

**Actions:** "Kembali" + "Lanjut"

---

### Step 4: Disclaimer Agreement
**Title:** "Persetujuan" / "Agreement"
**Subtitle:** "Baca dan ketahui sebelum melanjutkan."

**Content:**
1. **Warning Card** (yellow/warning tone):
   - ⚠️ Icon
   - "Bukan Rekomendasi Investasi" / "Not Investment Advice"
   - Full disclaimer text about AI not being financial advice

2. **Agreement Checkbox** (large tappable card):
   - Checkbox (teal when checked)
   - "Saya memahami dan setuju" / "I understand and agree"

3. **Error message** (if submitted without checking): Red alert box

**Actions:** "Kembali" + **"Mulai Menggunakan" / "Start Using"** (primary, full-width)

**After click:** → Redirects to `/settings` (if no API key) or `/` (Chat, if API key exists)

---

## Screen 3: Main Shell (App Container)

**When:** After onboarding is complete
**Layout:** Fixed structure with 3 zones

```
┌──────────────────────────┐
│     TOP BAR (h-14)       │  ← Logo/Language/AppName
├──────────────────────────┤
│                          │
│    CONTENT AREA          │  ← Active tab content
│    (flex-1, scrollable)  │     (Chat / DailyBrief / Watchlist / Settings)
│                          │
├──────────────────────────┤
│   BOTTOM NAV (auto h)    │  ← 4 tabs: Chat | Brief | Watchlist | Settings
└──────────────────────────┘
```

### Top Bar
- **Left:** App name "Sectors AI Advisor" (bold)
- **Right:** Language toggle (ID ↔ EN globe button)

### Bottom Navigation (4 tabs, fixed bottom)
| Tab | Icon (ID label) | Icon (EN label) |
|-----|-----------------|------------------|
| Chat | 💬 Obrolan | Chat |
| Daily Brief | 📊 Ringkasan | Summary |
| Watchlist | 🔖 Daftar Pantau | Watchlist |
| Settings | ⚙️ Pengaturan | Settings |

- Active tab: teal icon + label
- Inactive: gray
- Each tab fills equal width

---

## Screen 4: Chat Page (`/`) — Default Tab

**When:** User is on the main Chat tab
**Layout:** Fills content area between TopBar and BottomNav

### 4.1 Empty State (WelcomeState) — shown when no messages
- **App icon:** Large teal gradient rounded-square with chat bubble icon
- **H2:** "Sectors AI Advisor"
- **Subtitle:** "Tanyakan tentang saham, rasio keuangan, atau sektor Indonesia."
- **Example questions** (4 clickable cards):
  1. *"BBCA harganya udah mahal belum?"*
  2. *"Bandingkan BBCA dan BBRI"*
  3. *"Saham bank mana yang ROE-nya di atas 15%?"*
  4. *"Top gainers hari ini"*
- **Hint:** "Klik pertanyaan di atas atau ketik sendiri di bawah"

### 4.2 Chat Message List (when messages exist)
**Layout:** Scrollable area, messages stacked vertically

**User Message Bubble:**
- Right-aligned, max 85% width
- Teal background (`bg-accent`), white text
- Rounded-lg with rounded-tr-sm (tail pointing right)

**Assistant Message Bubble:**
- Left-aligned, max 85% width
- Dark secondary background (`bg-bg-secondary`), border
- White/gray text
- **Clickable term chips:** Financial terms rendered as small teal-bordered pills. Clicking opens GlossaryPanel.
- **Citation tags:** Small source reference badges

### 4.3 Usage Panel (collapsible bar, above input)
**Collapsed state (one line):**
```
● $0.0037 · 1.2k tokens · 3 credits  ▼
```
**Expanded state (full panel):**
- **LLM Cost Card:** Total $ spent, total tokens, query count
- **Sectors Credits Card:** Credits used, API calls, remaining balance
- **Budget Estimate:** Remaining queries on $5 budget, avg cost/query
- **Event Log:** Expandable list of each call (timestamp, type, query preview, tokens, cost)
- **Reset Session** button

### 4.4 Chat Input Bar (fixed bottom, above BottomNav)
- **Input field:** Placeholder "Tanyakan sesuatu..." / "Ask something..."
- **Send button:** Paper plane icon (teal, disabled when empty)
- **Attachment:** None (text-only for now)

### 4.5 Glossary Panel (overlay/bottom sheet)
**Triggered by:** Clicking a term chip in assistant message
**Content:**
- Term name (ID + EN)
- Definition (ID + EN)
- Formula (if applicable)
- Close button / tap outside to dismiss

### 4.6 Citation Panel (overlay/bottom sheet)
**Triggered by:** Clicking a citation badge
**Content:**
- Source name + endpoint
- Timestamp
- Data preview
- Link to full data

---

## Screen 5: Daily Brief Page (`/daily-brief`)

**When:** User taps "Daily Brief" tab
**Layout:** Scrollable content area

### 5.1 Header Row
- **Left:** H2 "Ringkasan Pasar Harian" / "Daily Market Brief"
- **Sub:** Current date (e.g., "Senin, 5 Oktober 2026")
- **Right:** "Buat Ringkasan" / "Generate Brief" primary button (with loading spinner)

### 5.2 Empty State (before generation)
- 📋 Icon
- "Tekan 'Buat Ringkasan' untuk memulai"
- Description about one-click summary

### 5.3 Generated Content (after clicking generate)

#### Top Gainers Card
- Green header bar: 📈 "Top Gainers"
- List of 5 stocks: Rank # | Symbol + Company Name | Price | Change %
- Each row: border-bottom separator

#### Top Losers Card
- Red header bar: 📉 "Top Losers"
- Same layout as gainers but red-themed

#### Foreign Flow Card
- 🌍 Header
- Two sub-cards side by side:
  - Net Foreign Buy (green, formatted IDR amount)
  - Net Foreign Sell (red, formatted IDR amount)

#### Recent News Card
- 📰 Header
- List of 5 news items: Title (2-line clamp) + Source · Date

#### AI Analysis Card (teal border, special styling)
- 🤖 Header: "Analisis AI" / "AI Analysis"
- Full markdown-rendered brief text (headings, lists, tables)
- Footer: "🤖 AI-generated · [disclaimer]"

---

## Screen 6: Watchlist Page (`/watchlist`)

**When:** User taps "Watchlist" tab
**Layout:** Scrollable content area

### 6.1 Header
- H2: "Daftar Pantau" / "Watchlist"
- Subtitle: "Pantau saham yang kamu minati"

### 6.2 Add Symbol Form
- **Text input:** Placeholder "Contoh: BBCA" (auto-uppercase, max 6 chars)
- **Add button:** "+" icon + "Tambah" / "Add"
- **Error validation:** Shows below input if invalid symbol or duplicate

### 6.3 Empty State
- 📋 Icon
- "Daftar pantau masih kosong" / "Watchlist is empty"
- Hint about adding symbols

### 6.4 Watchlist Items (card list)
Each stock card:
- **Main row:**
  - Symbol (bold, large) + Company name (caption, muted)
  - Right side: Last close price (IDR formatted) + Daily change % (green/red)
  - Delete button (trash icon, red tint)
- **Metrics row** (border-top, 4-column grid):
  - P/E value
  - PBV value
  - ROE value (%)
  - DER value
  - Each in a StatCard micro-component

---

## Screen 7: Settings Page (`/settings`)

**When:** User taps "Settings" tab (or redirected here after onboarding without API key)
**Layout:** Scrollable content area

### 7.1 Header
- H1: "Pengaturan" / "Settings"
- Caption: "Kelola API key dan preferensi"

### 7.2 Saved Toast (temporary)
- Green card with checkmark: "Disimpan!" / "Saved!"
- Auto-disappears after 2 seconds

### 7.3 Sectors API Card
- **Header:** Chart icon + "Sectors API"
- **API Key Input:** Password field, placeholder "sk-..."
- **Link:** "Dapatkan API Key di sectors.app/api" → external
- **Check Balance Button:** Shows credit balance as green badge (e.g., "500 credits")

### 7.4 LLM Provider Card
- **Header:** Bot icon + "Penyedia LLM" / "LLM Provider"

#### Provider Selector (2x2 grid):
| Option | Label |
|--------|-------|
| anthropic | Anthropic Claude |
| openai | OpenAI GPT-4o |
| deepseek | DeepSeek V3 ⭐ |
| custom | Other (OpenAI-compat) |

Selected = teal border + subtle bg

#### API Key Input
- Password field
- Provider-specific docs link below (Anthropic console / OpenAI platform / DeepSeek docs / OpenRouter docs)

#### Custom Provider Fields (only shown when "custom" selected)
- **Base URL** text input (placeholder: `https://openrouter.ai/api/v1`)
- **Model Name** text input (placeholder: `deepseek/deepseek-chat-v3-0324`)
- **Quick-fill presets** (2x2 grid of buttons):
  - OpenRouter + DeepSeek V3
  - OpenRouter + Claude Sonnet 4
  - LM Studio (local)
  - nexotao + DeepSeek

### 7.5 Language Card
- Globe icon + "Bahasa" / "Language"
- Toggle: 🇮🇩 Bahasa Indonesia | 🇬🇧 English

### 7.6 Save Button (full-width, primary)
- "Simpan Pengaturan" / "Save Settings"
- With save icon

### 7.7 Danger Zone Card (red-tinted)
- Warning icon + "Zona Berbahaya" / "Danger Zone"
- Description about deleting all data
- "Reset Semua" / "Reset All" danger button → confirms with "Ya, hapus semua" / "Cancel"

### 7.8 Footer
- "Sectors AI Advisor · Sectors Hackathon 2026 · Track: AI Agents & Assistants"

---

## Component Library Reference

### UI Components (reuse across screens)

| Component | Variants | Used In |
|-----------|----------|---------|
| **Button** | primary / secondary / ghost / danger; sm / md / lg / xl; fullWidth; isLoading (spinner) | All screens |
| **Card** | none / sm / md / lg padding; any border color | All screens |
| **Input** | text / password; with error state; placeholder | Settings, Watchlist |
| **Toggle** | 2-option segmented control | Settings, Onboarding Step 3 |
| **Badge** | accent / subtle / success / danger / warning | Usage Panel, Settings (credits) |
| **StatCard** | label + value (small metric display) | Watchlist, Daily Brief |
| **EmptyState** | icon + title + description | Chat, Daily Brief, Watchlist |
| **Spinner** | loading animation | Chat send, Daily Brief gen, Watchlist add |
| **Divider** | horizontal line | — |
| **Chip** | term chip (clickable) | Chat bubbles |

### Layout Components

| Component | Purpose |
|-----------|---------|
| **PageContainer** | Max-width wrapper with responsive padding |
| **TopBar** | Sticky top navigation bar (in MainShell) |
| **BottomNav** | Fixed bottom tab bar (4 tabs) |

### Specialized Components

| Component | Purpose |
|-----------|---------|
| **ChatBubble** | User/assistant message rendering with term chips |
| **ChatInput** | Text input + send button |
| **WelcomeState** | Chat empty state with example questions |
| **UsagePanel** | Collapsible token/cost/credit tracking dashboard |
| **GlossaryPanel** | Bottom sheet showing term definition on tap |
| **CitationPanel** | Bottom sheet showing data source on tap |

---

## Design Tokens (for Figma/Stitch)

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0B1120` | Main background |
| `--bg-secondary` | `#151f2e` | Cards, secondary surfaces |
| `--bg-tertiary` | `#1a2739` | Inputs, tertiary surfaces |
| `--bg-elevated` | `#212d40` | Hover states |
| `--accent` | `#00D4AA` | Primary accent (teal) |
| `--accent-hover` | `#00f0c0` | Accent hover state |
| `--accent-subtle` | `rgba(0,212,170,0.10)` | Accent backgrounds |
| `--accent-border` | `rgba(0,212,170,0.30)` | Accent borders |
| `--success` | `#34d399` | Positive values (gains, buy) |
| `--danger` | `#f87171` | Negative values (losses, delete) |
| `--warning` | `#fbbf24` | Warnings |
| `--info` | `#60a5fa` | Informational |
| `--text-primary` | `#f1f5f9` | Headings, important text |
| `--text-secondary` | `#94a3b8` | Body text |
| `--text-tertiary` | `#64748b` | Captions, hints |
| `--text-muted` | `#475569` | Disabled, very subtle |
| `--border-default` | `rgba(255,255,255,0.08)` | Default borders |
| `--border-strong` | `rgba(255,255,255,0.14)` | Hover/focus borders |
| `--border-subtle` | `rgba(255,255,255,0.05)` | Subtle dividers |

### Typography Scale
| Class | Size | Weight | Usage |
|-------|------|--------|-------|
| `.text-display` | 28-32px | Bold | Hero headlines |
| `.text-h1` | 22-24px | Bold | Page titles |
| `.text-h2` | 18-20px | Semibold | Section headings |
| `.text-h3` | 16px | Semibold | Card headers |
| `.text-body` | 14-15px | Regular | Body text |
| `.text-body-sm` | 13px | Regular | Secondary body |
| `.text-caption` | 11-12px | Regular | Labels, hints |
| `.text-overline` | 10px | Medium | Badges, tags |

### Spacing
- Base unit: 4px
- Card padding: sm=12px, md=16px, lg=20px
- Gap between sections: 16px
- Gap between elements: 8-12px
- Border radius: sm=6px, md=8px, lg=12px, xl=16px

### Icons
- All icons are **inline SVG** (no emoji in UI except content/examples)
- Stroke width: 1.5 or 2
- Size: 16-24px depending on context
- Color: inherit or `currentColor`

---

## Interaction Flows

### Flow A: First-Time User (Cold Start)
```
Landing → Click "Buka App" → Onboarding Step 1 (Language)
  → Step 2 (Sectors) → Step 3 (Preferences) → Step 4 (Disclaimer)
  → Check agreement → Click "Mulai Menggunakan"
  → Redirect to /settings (no API key yet)
  → Enter Sectors API key → Enter LLM API key → Click Save
  → Navigate to Chat → Start asking questions
```

### Flow B: Returning User (Onboarded + Has Keys)
```
Landing (auto-redirects if onboarded) → Main Shell → Chat tab
  → Type question → See loading → Get AI response with data
  → Click term chip → See glossary definition → Close
  → Check usage panel → See token/cost stats
```

### Flow C: Generate Daily Brief
```
Main Shell → Daily Brief tab → Click "Generate Brief"
  → Loading spinner → Data cards appear (Gainers, Losers, Foreign Flow, News)
  → AI Analysis card renders at bottom with markdown summary
```

### Flow D: Manage Watchlist
```
Main Shell → Watchlist tab → Type "BBCA" → Click Add
  → Card appears with company data (price, change %, P/E, PBV, ROE, DER)
  → Add more stocks → Click delete to remove
```

### Flow E: Change Settings
```
Main Shell → Settings tab → Change LLM provider → Enter new API key
  → Click Save → Toast appears → Switch language → Save again
  → (Optional) Reset all → Confirm → Back to landing/onboarding
```

---

## Notes for Prototyping

1. **Mobile-first:** Design at 390px width first. This is a mobile web app.
2. **Dark mode only:** No light mode. All screens use dark theme.
3. **Bahasa Indonesia default:** Most copy should be in ID. EN is alternative.
4. **Real data mockups:** Use real IDX stock data (BBCA, BBRI, TLKM, etc.) for realistic prototypes.
5. **Term chips are unique:** The clickable financial term chips in AI responses are a key differentiator — prototype them prominently.
6. **Usage panel is new:** This was recently added. Make it a prominent collapsible section in the chat screen.
7. **Onboarding flow matters:** It's 4 distinct steps with clear progression. Show the step dots clearly.
