# Component Architecture — Sectors AI Advisor

## 1. Directory Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (font, metadata)
│   ├── page.tsx                  # Landing page (new users) / redirect
│   ├── globals.css               # Tailwind + design tokens only (no components)
│   │
│   ├── landing/
│   │   └── page.tsx              # Landing page (uses ui/ components)
│   │
│   ├── onboarding/
│   │   └── page.tsx              # 4-step onboarding flow
│   │
│   ├── chat/
│   │   └── page.tsx              # Chat page (uses ui/ components)
│   │
│   ├── daily-brief/
│   │   └── page.tsx              # Daily brief page
│   │
│   ├── watchlist/
│   │   └── page.tsx              # Watchlist page
│   │
│   └── settings/
│       └── page.tsx              # Settings page
│
├── components/
│   │
│   ├── ui/                      # ← REUSABLE UI PRIMITIVES (no business logic)
│   │   ├── Button.tsx           # Button (primary/secondary/ghost/danger, sm/md/lg/xl)
│   │   ├── Input.tsx            # Text input / text field
│   │   ├── Card.tsx             # Container card
│   │   ├── Badge.tsx            # Pill / tag badge
│   │   ├── Chip.tsx             # Term chip (clickable glossary trigger)
│   │   ├── Divider.tsx          # Horizontal divider line
│   │   ├── Spinner.tsx          # Loading spinner / dots
│   │   ├── EmptyState.tsx       # Empty state placeholder
│   │   ├── StatCard.tsx         # Small metric display
│   │   ├── Toggle.tsx           # Language toggle, switch
│   │   └── index.ts            # Barrel export
│   │
│   ├── layout/                  # Layout components
│   │   ├── TopBar.tsx           # Top navigation bar
│   │   ├── BottomNav.tsx        # Bottom tab navigation
│   │   ├── PageContainer.tsx    # Page wrapper with consistent padding
│   │   └── index.ts
│   │
│   ├── chat/                    # Chat-specific components
│   │   ├── ChatBubble.tsx       # Message bubble (user or assistant)
│   │   ├── ChatInput.tsx        # Input bar with send button
│   │   ├── WelcomeState.tsx     # Empty chat welcome message
│   │   ├── CitationPanel.tsx    # Collapsible data source citation
│   │   └── index.ts
│   │
│   ├── glossary/                # Glossary components
│   │   ├── GlossaryPanel.tsx    # Slide-up bottom sheet
│   │   ├── GlossaryTermCard.tsx # Single term definition card
│   │   └── index.ts
│   │
│   └── landing/                 # Landing page sections
│       ├── HeroSection.tsx
│       ├── StatsBar.tsx
│       ├── FeaturesGrid.tsx
│       ├── HowItWorks.tsx
│       ├── HackathonInfo.tsx
│       ├── TestimonialsSection.tsx
│       ├── CTASection.tsx
│       └── index.ts
│
├── lib/
│   ├── types.ts                 # TypeScript types
│   ├── i18n.ts                  # Translations (ID/EN)
│   ├── store.ts                 # Zustand stores
│   ├── sectorsApi.ts           # Sectors API client
│   ├── llmProviders.ts          # LLM abstraction
│   └── constants.ts             # Design tokens as JS constants (NEW)
│
└── docs/
    ├── DESIGN-SYSTEM.md         # This file
    └── COMPONENT-SPEC.md        # This file
```

---

## 2. Component Hierarchy

```
RootLayout
├── LandingPage
│   ├── TopBar
│   ├── HeroSection
│   │   ├── Badge
│   │   ├── Heading (display)
│   │   ├── Subtitle (body)
│   │   └── CTAButtons (Button primary + secondary)
│   ├── StatsBar
│   │   └── StatCard × 4
│   ├── FeaturesGrid
│   │   └── Card × 6
│   ├── HowItWorks
│   │   └── StepItem × 4
│   ├── HackathonInfo (Card)
│   ├── TestimonialsSection
│   │   └── Card × 3
│   ├── CTASection
│   │   └── Button (xl, primary)
│   └── Footer
│
├── MainShell (app shell after onboarding)
│   ├── TopBar
│   ├── [Active Page]
│   │   ├── ChatPage
│   │   │   ├── WelcomeState (when empty)
│   │   │   ├── ChatBubble (user) × N
│   │   │   ├── ChatBubble (assistant) × N
│   │   │   │   ├── Chip × M (inside assistant bubble)
│   │   │   │   └── CitationPanel (collapsible)
│   │   │   ├── Spinner (when loading)
│   │   │   └── ChatInput
│   │   │
│   │   ├── DailyBriefPage
│   │   │   ├── Button (generate)
│   │   │   ├── Card (gainers)
│   │   │   ├── Card (losers)
│   │   │   ├── Card (foreign flow)
│   │   │   ├── Card (news)
│   │   │   └── Card (AI summary)
│   │   │
│   │   ├── WatchlistPage
│   │   │   ├── Input (add symbol)
│   │   │   ├── Card (stock item) × N
│   │   │   │   └── StatCard × 4 (per stock)
│   │   │   └── EmptyState (when empty)
│   │   │
│   │   └── SettingsPage
│   │       ├── Card (Sectors API section)
│   │       ├── Card (LLM section)
│   │       ├── Card (Language section)
│   │       ├── Card (Danger zone)
│   │       └── Button (save)
│   │
│   └── BottomNav
│
└── GlossaryPanel (overlay, triggered by Chip click)
    └── GlossaryTermCard
```

---

## 3. Component Contract Rules

### Rule 1 — UI Primitives Are Pure Presentational

`components/ui/*` components:
- **NO** state management (no useState for business logic)
- **NO** API calls
- **NO** i18n strings hardcoded (accept props)
- **NO** routing logic
- Accept all visual behavior via props
- Exported with clear PropTypes-like prop definitions

Example:
```tsx
// ✅ Good — pure presentational
function Button({ variant, size, children, onClick, disabled }: ButtonProps) {
  return (
    <button
      className={cn(styles.base, styles.variants[variant], styles.sizes[size])}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

### Rule 2 — Layout Components Wrap Structure

`components/layout/*` components:
- Handle responsive container widths
- Provide consistent padding/margins
- May include navigation elements
- Do NOT contain business logic

### Rule 3 — Feature Components Own Their Domain

`components/chat/*`, `components/glossary/*`, etc.:
- CAN contain domain-specific state
- CAN call lib functions (API, store, i18n)
- MUST use ui/ primitives for rendering
- MUST be self-contained and reusable within their domain

### Rule 4 — Pages Compose Features

`app/*/page.tsx` files:
- ONLY compose feature + layout components
- Minimal inline styles — extract to component if used > once
- Handle page-level state (loading, error boundaries)

---

## 4. Prop Conventions

```tsx
// Boolean props use "is" prefix or verb
<Button isLoading isDisabled isFullWidth>

// Event handlers use "on" prefix
<Button onClick onSubmit onChange>

// Content uses direct prop or children
<Badge label="Hackathon">
<Chip term="PBV" onClick={...}>

// Visual variants use "variant" prop
<Button variant="primary" size="md">
<Card variant="elevated">
```

---

## 5. CSS Class Organization

In `globals.css`, ONLY include:
1. `@tailwind` directives
2. Custom utility classes that are truly global (scrollbar, selection)
3. Animation `@keyframes` definitions

NO component-specific styles in globals.css.
NO page-specific styles in globals.css.

Component styles go IN the component file using:
- Tailwind classes (preferred)
- `cn()` utility for conditional merging
- Inline style object only for dynamic values (colors from API, etc.)

---

## 6. Implementation Order

Build in this sequence so each step is testable:

1. **Design tokens** (`lib/constants.ts`) — colors, spacing, radii as exported constants
2. **UI primitives** (`components/ui/`) — Button, Input, Card, Badge, Chip, etc.
3. **Layout components** (`components/layout/`) — TopBar, BottomNav, PageContainer
4. **Glossary components** (`components/glossary/`) — Panel, TermCard
5. **Chat components** (`components/chat/`) — Bubble, Input, Welcome, Citation
6. **Landing sections** (`components/landing/`) — Hero, Stats, Features, etc.
7. **Pages** — Wire everything together, page by page
8. **Polish** — Animations, transitions, responsive tweaks
