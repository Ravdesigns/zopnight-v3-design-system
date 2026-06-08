# ZopNight V3 · Design System Handoff

**Status:** Ready for development
**Version:** 1.1.0 · 2026-06-05
**Owner:** Design
**Type:** Design system delivery (no app-structure changes)
**Estimated dev time:** 1 sprint for adoption · ongoing per-page reskin

---

## Summary

The ZopNight V3 design system is locked in. This ticket ships **52 components (24 atoms/molecules/organisms + 14 OG patterns + 14 system layouts), 18 application patterns, 70 gap-fill items, 30 chart examples, and Nimbus v3 mascot** as a single CSS file + 2 JS modules + 2 web fonts + 1 CDN dependency.

The 1.1 polish pass adds **8 new doc pages** (accessibility · breakpoints · icons · composition rules · form validation · loading states · microcopy · animation orchestration), **3 root files** (`CHANGELOG.md` · `MIGRATION.md` · `tokens.js`), and CSS tokens for **breakpoints**, **print**, **whitelabel theming**, and **animation orchestration** — see `CHANGELOG.md`.

> **Governing rule:** This is a **reskin only** — no changes to information architecture, navigation, or page flow. Apply classes to existing markup.

---

## What devs need to ship

### Files to include in every page

| Order | File | Purpose | Size |
|-------|------|---------|------|
| 1 | `design.css` | All component CSS + tokens + ApexCharts overrides + print + whitelabel hooks | ~310 KB |
| 2 | `https://cdn.jsdelivr.net/npm/apexcharts@3.49.1/dist/apexcharts.min.js` | Chart library · CDN | external |
| 3 | `nimbus.js` | Mascot character + behaviour | ~14 KB |
| 4 | `charts.js` | Legacy inline-SVG charts (kept for backward compat) | ~32 KB |
| 5 | `tokens.js` (optional) | JS export of tokens for React/Recharts/ApexCharts theming | ~6 KB |

### Web fonts (Google Fonts)

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```

### Drop-in head template

```html
<head>
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

  <!-- Design system -->
  <link rel="stylesheet" href="/design.css" />

  <!-- Optional: charts -->
  <script src="https://cdn.jsdelivr.net/npm/apexcharts@3.49.1/dist/apexcharts.min.js" defer></script>

  <!-- Optional: mascot -->
  <script src="/nimbus.js" defer></script>
</head>
```

**That's it.** No build pipeline. No React. No bundler. Drop the files, link them, you're done.

---

## Repository layout

```
.
├── design.css                          ← ✅ ship this
├── nimbus.js                           ← ✅ ship this
├── charts.js                           ← ✅ ship this (legacy chart helpers)
├── DESIGN-SYSTEM.md                    ← read-me for the system
├── DEV-HANDOFF.md                      ← (this file)
│
├── charts-gallery.html                 ← reference · 30 chart examples
├── nimbus-showcase.html                ← reference · Nimbus iteration history
│
├── ds/                                 ← 📖 design-system documentation (browse with devs)
│   ├── index.html                      ← START HERE · overview tile grid
│   ├── principles.html                 ← the 8 rules
│   ├── _ds.css                         ← docs chrome
│   ├── _ds.js                          ← sidebar nav · ⌘K search · syntax highlighter
│   ├── components/                     (24 component pages)
│   │   ├── color-tokens.html
│   │   ├── typography.html
│   │   ├── motion.html
│   │   ├── nimbus.html
│   │   ├── buttons.html
│   │   ├── status-dots.html
│   │   ├── inputs.html
│   │   ├── kbd.html
│   │   ├── mono-id.html
│   │   ├── tags-chips.html
│   │   ├── provider-marks.html
│   │   ├── filter-pills.html
│   │   ├── severity.html
│   │   ├── method-status.html
│   │   ├── alerts.html
│   │   ├── empty-states.html
│   │   ├── pagination.html
│   │   ├── tabs.html
│   │   ├── countdown.html
│   │   ├── cards.html
│   │   ├── stat-strip.html
│   │   ├── table.html
│   │   ├── drawer.html
│   │   ├── suggestion.html
│   │   ├── tree.html
│   │   ├── charts.html
│   │   └── more.html                   ← 13 new OG-app components
│   └── patterns/                       (14 pattern pages)
│       ├── page-header.html
│       ├── filter-table.html
│       ├── drawer-form.html
│       ├── empty-state.html
│       ├── recommendations.html
│       ├── settings-form.html
│       ├── tabs-pane.html
│       ├── kpi-charts.html
│       ├── skeleton.html
│       ├── toast.html
│       ├── inline-edit.html
│       ├── wizard.html
│       ├── modal.html
│       └── interaction-states.html
│
└── *.html                              ← prototype pages (reference only · DO NOT ship as-is)
```

---

## What's included

### Foundation
- **Tokens** · `design.css` `:root` block · brand · state · greys · surfaces · fonts · motion · z-index · breakpoints. Light + dark themes via `html[data-theme="dark"]` · whitelabel via `html[data-brand="x"]`.
- **Typography** · 2 fonts: Space Grotesk (display + big numerals) + Inter (everything else).
- **Motion** · `--dur-fast/med/slow` · `--ease-out/in-out` + orchestration tokens (`--stagger-step`, `--page-fade-in`, `--page-slide-in`) · pulse only for critical state · respects `prefers-reduced-motion`.
- **Breakpoints** · `--bp-sm/md/lg/xl/2xl` (640 / 768 / 1024 / 1280 / 1536) · component collapse matrix documented.
- **Accessibility** · WCAG AA verified · keyboard nav matrix · focus ring spec · ARIA patterns per component · don't-rely-on-colour rules.
- **Print** · `@media print` strips chrome · forces light theme · A4-safe margins · `[href]` appended after links.

### Atoms · Molecules · Organisms (24 components)
Buttons · Status dots · Inputs · Kbd · Mono ID · Tags/chips · Provider marks · Filter pills · Severity · Method/HTTP status · Alerts · Empty states · Pagination · Tabs · Countdown · Cards · Stat strip · Table · Drawer · Suggestion row · Tree · Charts (ApexCharts) · Nimbus mascot.

### More components (14 OG patterns)
Breadcrumb · Bulk-banner · Avatar + user pill · Switch · Dropdown · Progress · Date input · Stepper · Diff view · Budget chip · Action queue · Snackbar · Calendar · Role/permission matrix.

### System patterns (14 styled in design.css, surfaced in ds/components/more.html)
Search input (⌘K hint) · Command palette modal · Kebab menu · Theme toggle · View toggle · Metric card / widget grid · Timeline / activity stream · Override badge · Auth shell (sign-in / onboarding) · Settings shell · Keyboard shortcuts help · Path crumbs · plus all existing `.search` / `.detail-drawer` / `.cmdk-*` / `.kbd-help-*` classes.

### Patterns (18)
Page header · Filter row + table · Drawer with form · Empty state flow · Recommendations list · Settings form · Tabs + content · KPI strip + charts · Loading skeletons · Toast notifications · Inline edit · Multi-step wizard · Confirmation modal · Interaction states matrix · **Form validation** · **Loading states · decision tree** · **Microcopy library** · **Animation orchestration**.

### Engineering reference (new in 1.1)
- **`MIGRATION.md`** — V2 → V3 codemod patterns · alias removal timeline · per-page checklist.
- **`CHANGELOG.md`** — versioning policy · entries by date · breaking-change callouts.
- **`tokens.js`** — JS export of all tokens · `readCssToken()` · `apexBrandDefaults()` · `rechartsTheme()` · `onThemeChange()` subscriber.

### Brand
- **Nimbus v3** mascot (`nimbus.js`)
  - 11 poses (idle, wave, search, sleep, cheer, build, win, money, walk, wink, peek)
  - Cursor-tracking eyes · breathing · natural blink · easter-egg appearances
  - Refined hands (3 fingers + thumb) + walking legs
  - Money pose features the **₹ rupee glyph**

### Charts
- **30 product-ready ApexCharts examples** wired with brand colours, Inter font, ink-pill tooltips.
- See `charts-gallery.html` for the full set.

---

## Acceptance criteria

- [ ] `design.css` is the single CSS source. No per-page CSS that duplicates these components.
- [ ] Web fonts are loaded once at the document root (not per-component).
- [ ] ApexCharts is the chart library for any new charts. Existing `charts.js` (ZopCharts) usages remain working but should be migrated per-page over time (tracked separately).
- [ ] All existing class names continue working via backward-compat aliases (see "Backward compatibility" below).
- [ ] Theme switching (`html[data-theme="dark"]`) works on every page without per-component dark-mode CSS.
- [ ] Light/dark contrast meets WCAG AA on body text + interactive elements.
- [ ] `prefers-reduced-motion` halts all pulses, bobs, slides, scales.
- [ ] `⌘ K` search in `/ds/index.html` lists every component and pattern.

---

## Backward compatibility

The handoff is non-breaking. Every renamed class has a legacy alias still in `design.css`:

| Legacy | New (preferred) |
|---|---|
| `.tag-soft` | `.tag-pill` |
| `.tag` | `.tag-pair` |
| `.chip` | `.tag-chip` |
| `.filter-pill` | `.fp` |
| `.sev-badge` | `.sb` |
| `.method-pill` | `.mp` |
| `.status-code` | `.sc` |
| `.next-run-chip` · `.countdown` | `.cd` |
| `.tabs` · `.feat-tabs` | `.tb` |
| `.pagination` | `.pg` |
| `.rec-card` | `.sg` |
| `.tree` + `.tree-row` | `.tr` + `.tr-row` |
| `.stat-strip` + `.stat-cell` | `.ss` + `.cell` |
| `.btn-danger` | `.btn-destructive` |

---

## Phased adoption plan

### Phase 1 · Foundation (week 1)
1. Vendor `design.css` + `nimbus.js` + `charts.js` into the app.
2. Load Google Fonts in root layout.
3. Add ApexCharts CDN tag.
4. Verify existing pages still render — backward-compat aliases mean no markup changes needed yet.

### Phase 2 · Highest-traffic pages (week 2)
5. Reskin `dashboard.html` using locked components.
6. Reskin `resources.html`.
7. Reskin `recommendations.html`.
8. Reskin `cost-reports.html`.

### Phase 3 · Long-tail pages (weeks 3–4)
9. All other pages reskinned per the patterns in `ds/patterns/`.

### Phase 4 · Migration cleanup
10. Remove legacy class aliases (only after every page is migrated).
11. Migrate remaining `ZopCharts` calls to ApexCharts.

---

## Reference URLs

- **Live design system:** `ds/index.html`
- **Markdown reference:** `DESIGN-SYSTEM.md`
- **Chart gallery (30 examples):** `charts-gallery.html`
- **Nimbus showcase:** `nimbus-showcase.html`

---

## Out of scope (tracked separately)

- App-architecture changes (we are reskinning, not restructuring)
- Backend changes
- New features beyond what already exists in the OG app
- Per-page reskin work (this ticket only delivers the system; reskinning each page is separate)

---

## Files to attach to this ticket on GitHub

```
design.css
nimbus.js
charts.js
DESIGN-SYSTEM.md
DEV-HANDOFF.md
ds/index.html
ds/principles.html
ds/_ds.css
ds/_ds.js
ds/components/*.html      (25 files)
ds/patterns/*.html        (14 files)
charts-gallery.html
nimbus-showcase.html
```

Total: **3 source files** + **41 documentation files** + **1 chart gallery** + **1 mascot showcase** = **46 files**.

---

*Questions? See `ds/principles.html` for the 8 governing rules, or run `⌘ K` on the live handoff to find any component by name.*
