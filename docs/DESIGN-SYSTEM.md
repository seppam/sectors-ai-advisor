# Design System — Sectors AI Advisor

## 1. Design Principles

1. **Content-first** — Every pixel serves information, not decoration
2. **Breathing room** — Generous whitespace; nothing feels cramped
3. **Visual hierarchy** — One clear action per screen, one clear message per section
4. **Consistent** — Same button looks the same everywhere. Same spacing, same radius, same behavior.
5. **Mobile-first** — Designed for phone screens first (375px), then scales up
6. **Accessible** — Minimum touch target 44px, contrast ratio > 4.5:1

---

## 2. Color Palette

### Base (Dark Theme)
| Token | Value | Usage |
|---|---|---|
| `bg-primary` | `#0B1120` | Page background |
| `bg-secondary` | `#111827` | Card backgrounds |
| `bg-tertiary` | `#1F2937` | Input fields, nested panels |
| `bg-elevated` | `#1E293B` | Hover states, active cards |

### Text
| Token | Value | Usage |
|---|---|---|
| `text-primary` | `#F8FAFC` | Headings, important text |
| `text-secondary` | `#CBD5E1` | Body text, descriptions |
| `text-tertiary` | `#64748B` | Captions, hints, placeholders |
| `text-muted` | `#475569` | Disabled, timestamps |

### Accent (Teal)
| Token | Value | Usage |
|---|---|---|
| `accent` | `#14B8A6` | Primary actions, links, active states |
| `accent-hover` | `#0D9488` | Button hover |
| `accent-subtle` | `rgba(20,184,166,0.10)` | Badge backgrounds, subtle highlights |
| `accent-border` | `rgba(20,184,166,0.25)` | Active borders, focus rings |

### Semantic
| Token | Value | Usage |
|---|---|---|
| `success` | `#22C55E` | Positive numbers, gains, "good" indicators |
| `danger` | `#EF4444` | Negative numbers, losses, errors, "bad" indicators |
| `warning` | `#F59E0B` | Warnings, cautions |
| `info` | `#3B82F6` | Informational, foreign flow, neutral data |

### Border
| Token | Value | Usage |
|---|---|---|
| `border-default` | `rgba(148,163,184,0.10)` | Default card borders |
| `border-strong` | `rgba(148,163,184,0.18)` | Dividers, input focus |
| `border-subtle` | `rgba(148,163,184,0.06)` | Very light separators |

---

## 3. Typography

### Font Stack
```
Font Family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```
(Use system Inter — no Google Fonts import needed, faster load)

### Scale
| Level | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| Display | 28px / 1.75rem | 800 | 1.2 | Hero headline only |
| H1 | 22px / 1.375rem | 700 | 1.3 | Section headings |
| H2 | 17px / 1.0625rem | 600 | 1.35 | Card titles, sub-sections |
| H3 | 14px / 0.875rem | 600 | 1.4 | Small headings, labels |
| Body | 14px / 0.875rem | 400 | 1.6 | Paragraphs, chat messages |
| Body-sm | 13px / 0.8125rem | 400 | 1.5 | Secondary text |
| Caption | 12px / 0.75rem | 400 | 1.4 | Metadata, timestamps, hints |
| Overline | 11px / 0.6875rem | 500 | 1.3 | Badges, tags, overline labels |

---

## 4. Spacing System

Based on 4px grid:

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Tight internal gaps (icon + text) |
| `space-2` | 8px | Small gaps (inline elements) |
| `space-3` | 12px | Compact gaps (list items) |
| `space-4` | 16px | Standard gaps (card padding) |
| `space-5` | 20px | Section internal spacing |
| `space-6` | 24px | Between related sections |
| `space-8` | 32px | Major section spacing |
| `space-10` | 40px | Page section spacing |
| `space-12` | 48px | Hero-to-content gap |
| `space-16` | 64px | Major page sections |

### Component Padding
| Component | Padding |
|---|---|
| Card | 16px (mobile) / 24px (desktop) |
| Button | 12px horizontal, 10px vertical (sm) / 16px h, 12px v (md) |
| Input | 12px horizontal, 10px vertical |
| Page edge | 16px (mobile) / 24px (tablet) / 32px (desktop) |

---

## 5. Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 6px | Tags, badges, small buttons |
| `radius-md` | 10px | Inputs, small cards |
| `radius-lg` | 14px | Cards, modals, panels |
| `radius-xl` | 18px | Large cards, hero elements |
| `radius-full` | 9999px | Avatars, pills, circular buttons |

---

## 6. Shadows (Subtle — Dark Theme Friendly)

| Token | Value | Usage |
|---|---|---|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | Elevated elements |
| `shadow-md` | `0 4px 12px rgba(0,0,0,0.25)` | Cards, dropdowns |
| `shadow-lg` | `0 8px 24px rgba(0,0,0,0.3)` | Modals, popovers |

> Note: In dark themes, shadows should be very subtle. Use border-color differences for elevation instead.

---

## 7. Component Specifications

### 7.1 Button

```
Variants:
  primary   — bg-accent, text-bg-primary, hover:bg-accent-hover
  secondary — bg-bg-tertiary, text-text-secondary, border-border-default
  ghost     — transparent, text-text-secondary, hover:bg-bg-tertiary
  danger    — bg-danger/10, text-danger, border-danger/20

Sizes:
  sm  — px-3 py-1.5, text-caption, radius-sm
  md  — px-4 py-2.5, text-body, radius-md
  lg  — px-6 py-3, text-h3, radius-lg
  xl  — px-8 py-4, text-h2, radius-xl

States:
  default → hover → active(press) → disabled(opacity-40, pointer-events-none)
  Focus ring: 2px solid accent-border, offset 2px
```

### 7.2 Input / TextField

```
Container: bg-bg-tertiary, border border-default, radius-md
Focus: border accent-border
Padding: 12px horizontal, 10px vertical
Placeholder: text-text-muted
Height: 44px minimum (touch target)
```

### 7.3 Card

```
Container: bg-bg-secondary, border border-default, radius-lg
Padding: 16px mobile / 24px desktop
Hover (interactive): border border-strong, slight bg brighten
No shadow by default (dark theme)
```

### 7.4 Chat Bubble

```
User bubble:
  bg-accent/15, border accent/20, radius-lg (br-tr rounded to sm)
  text-text-primary, padding 10px 14px

Assistant bubble:
  bg-bg-secondary, border border-default, radius-lg (bl-bl rounded to sm)
  text-text-primary, padding 10px 14px
  max-width 85%
```

### 7.5 Term Chip (Glossary)

```
Container: inline-flex, bg-accent/10, border accent/25, radius-sm
Text: text-accent, font-size caption, font-weight 600
Icon: info icon (i) 12px, margin-left 2px
Hover: bg-accent/18, cursor pointer
Active/pressed: bg-accent/25
```

### 7.6 Badge / Pill

```
Container: inline-flex, items-center, gap space-1, radius-full
Padding: 3px 10px, font-size overline, font-weight 500
Variants:
  accent — bg-accent-subtle, text-accent, border accent-border
  subtle — bg-bg-tertiary, text-text-tertiary, border border-subtle
  success — bg-success/10, text-success, border success/20
  danger  — bg-danger/10, text-danger, border danger/20
```

### 7.7 Nav Bar (Bottom)

```
Height: 64px + safe-area-inset-bottom
Background: bg-primary, border-top border-default
Items: 4 equal-width tabs, icon (24px) + label (caption)
Active: text-accent, icon filled
Inactive: text-text-tertiary, icon outline
Touch target: 48px height per item
```

### 7.8 Top Bar (Header)

```
Height: 56px
Background: bg-primary/95 backdrop-blur-md, border-bottom border-default
Left: Logo/icon + app name
Right: Language toggle, other actions
Sticky, z-index 50
```

### 7.9 Glossary Panel (Bottom Sheet)

```
Position: fixed bottom-0, full width
Max height: 70vh, scrollable
Background: bg-secondary, border-top border-strong, radius-xl (top corners)
Header: sticky, padding 16px, title + close button
Body: padding 16px, definition + formula + thresholds
Backdrop: fixed inset-0, bg-black/50 backdrop-blur-sm
Animation: slide-up from bottom, 300ms ease-out
```

### 7.10 Stat/Metric Card

```
Small (watchlist metric):
  bg-bg-tertiary, radius-sm, padding 8px
  Label: caption, text-text-tertiary
  Value: body-sm, font-weight 600, text-text-primary

Large (brief stat):
  bg-bg-tertiary, radius-md, padding 12px
  Label: body-sm, text-text-secondary
  Value: h2, gradient or accent color
```

---

## 8. Page Layouts

### Landing Page
```
┌─────────────────────────────┐
│  TopBar (logo + lang + CTA) │  ← sticky, 56px
├─────────────────────────────┤
│                             │
│  HERO SECTION               │  ← min-height 80vh
│  · Badge pill               │
│  · Headline (display)       │
│  · Subtitle (body)          │
│  · CTA buttons              │
│  · (No mockup — keep clean) │
│                             │
├─────────────────────────────┤
│  STATS BAR                  │  ← 4 cols, py-6, border-y
├─────────────────────────────┤
│  FEATURES GRID              │  ← 2-col mobile, 3-col desktop
│  · 6 feature cards          │
├─────────────────────────────┤
│  HOW IT WORKS               │  ← vertical timeline, max-w 3xl
│  · 4 steps with icons       │
├─────────────────────────────┤
│  HACKATHON INFO             │  ← glass card, centered
├─────────────────────────────┤
│  FOOTER                     │  ← simple, minimal
└─────────────────────────────┘
```

### App Shell (Post-Onboarding)
```
┌──────────────────────────┐
│  TopBar (56px, sticky)   │
├──────────────────────────┤
│                          │
│  PAGE CONTENT            │  ← flex-1, overflow-y auto
│  (Chat / Brief /        │
│   Watchlist / Settings)  │
│                          │
├──────────────────────────┤
│  BottomNav (64px)        │
└──────────────────────────┘
```

### Chat Page
```
┌──────────────────────────┐
│  Messages area           │  ← flex-1, overflow-y auto
│  (scrollable)            │     padding-x 16, padding-y 12
│  · Welcome state         │
│  · Chat bubbles          │
│  · Loading indicator     │
│                          │
├──────────────────────────┤
│  Input bar               │  ← sticky bottom
│  [textarea] [send btn]   │     padding 12, border-t
│  hint text               │
└──────────────────────────┘
```

---

## 9. Animation Rules

| Property | Duration | Easing | When |
|---|---|---|---|
| Color/opacity change | 150ms | ease | Hover, focus |
| Transform (scale) | 150ms | ease | Button press |
| Slide up (panel) | 300ms | ease-out | Glossary panel |
| Fade in | 200ms | ease-out | Page load, appear |
| Fade up | 300ms | cubic-bezier(0.16,1,0.3,1) | Staggered content |
| Loading dots | 1.4s | ease-in-out | Bouncing dots, infinite |

> Rule: No animation on scroll. No parallax. No floating orbs. Keep it professional.

---

## 10. Responsive Breakpoints

| Name | Width | Layout Changes |
|---|---|---|
| Mobile | < 640px | Single column, bottom nav, compact padding |
| Tablet | 640–1024px | 2-col grids, slightly larger padding |
| Desktop | > 1024px | 3-col grids, max-width container (1024px), centered |

> Max content width: 1024px for all pages (except landing which can go to 1200px).
