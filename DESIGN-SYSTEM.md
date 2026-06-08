# ZopNight V3 · Design system

Single source of truth for the ZopNight reskin. Drop-in CSS classes built on tokens — existing markup keeps working via backward-compat aliases.

> **The governing rule:** the OG ZopNight app is being **reskinned**, not restructured. Structure and flow don't change — only the visual treatment. When in doubt, defer to the existing markup and apply classes.

---

## Live handoff

Open `ds/index.html` for the live, browsable handoff. Every component has a dedicated page with variants, copy-pasteable code, and a props/modifiers table. Every pattern shows full composition.

```
ds/
├── index.html                    ← start here
├── principles.html               ← the eight rules
├── _ds.css                       ← docs chrome
├── _ds.js                        ← sidebar nav + copy buttons
├── components/                   ← 24 component pages
│   ├── color-tokens.html
│   ├── typography.html
│   ├── motion.html
│   ├── buttons.html
│   ├── status-dots.html
│   ├── inputs.html
│   ├── kbd.html
│   ├── mono-id.html
│   ├── tags-chips.html
│   ├── provider-marks.html
│   ├── filter-pills.html
│   ├── severity.html
│   ├── method-status.html
│   ├── alerts.html
│   ├── empty-states.html
│   ├── pagination.html
│   ├── tabs.html
│   ├── countdown.html
│   ├── cards.html
│   ├── stat-strip.html
│   ├── table.html
│   ├── drawer.html
│   ├── suggestion.html
│   ├── tree.html
│   └── charts.html
└── patterns/                     ← 8 pattern pages
    ├── page-header.html
    ├── filter-table.html
    ├── drawer-form.html
    ├── empty-state.html
    ├── recommendations.html
    ├── settings-form.html
    ├── tabs-pane.html
    └── kpi-charts.html
```

---

## What devs need to ship

| File | Purpose |
|------|---------|
| `design.css` | All component CSS · tokens · ApexCharts override · responsive |
| Inter + Space Grotesk | Two web fonts via Google Fonts |
| `apexcharts` (CDN) | Chart library — `<script src="https://cdn.jsdelivr.net/npm/apexcharts@3.49.1/dist/apexcharts.min.js"></script>` |

That's it. **No build pipeline. No React. No bundler.** Drop the CSS, link the fonts, link ApexCharts when you render charts.

---

## The eight principles

1. **Reskin, never restructure.** Apply classes to existing markup. Don't rearrange information.
2. **The character IS the brand.** Nimbus is the ZopCloud product symbol with a face. Cycles emotion every 7–14s.
3. **3% color budget.** State color covers ≤3% of any view. Cream + ink + greys carry 97%.
4. **Sentence case, no shouty caps.** Tabs, buttons, headings — sentence case. Only eyebrow labels are uppercase.
5. **Soft hover, hard active.** Hover = `surface-2` lift. Active = ink fill or orange left stripe.
6. **Pulse only for now.** Pulses signal "happening now", not "new". Critical state pulses; new state uses orange stripe.
7. **Tabular numerals everywhere.** Stats, table number columns, mono IDs — always `font-variant-numeric: tabular-nums`.
8. **No JetBrains Mono.** Two fonts only: Space Grotesk + Inter. `--font-mono` is aliased to Inter for backward-compat.

---

## Component matrix

### Foundation
| | Reference |
|---|---|
| Color tokens | `ds/components/color-tokens.html` |
| Typography (Space Grotesk + Inter) | `ds/components/typography.html` |
| Motion · 3% rule · reduced-motion | `ds/components/motion.html` |

### Atoms
| Class | Variants | Reference |
|---|---|---|
| `.btn` | primary · secondary · ghost · upgrade · destructive · sm/lg | `ds/components/buttons.html` |
| `.status-dot` | ok · info · warn · crit · ghost · paused · pill · sm | `ds/components/status-dots.html` |
| `.form-input` · `.zn-check` · `.zn-radio` | sm/lg · is-error · disabled | `ds/components/inputs.html` |
| `.kbd` | sm/lg · group · variant-aware | `ds/components/kbd.html` |
| `.mono-id` | sm/lg · chip · has-label · copy flash | `ds/components/mono-id.html` |
| `.tag-pill` · `.tag-pair` · `.tag-chip` | ok/warn/error/info · drillable | `ds/components/tags-chips.html` |
| `.provider-mark` | aws · gcp · azure · k8s · sm/lg · muted | `ds/components/provider-marks.html` |

### Molecules
| Class | Variants | Reference |
|---|---|---|
| `.fp` · `.filter-pill` | is-active · count · x · sm · disabled · `.fp-clear` | `ds/components/filter-pills.html` |
| `.sb` · `.sev-badge` | critical (pulse) · high · medium · low · solid · sm · count | `ds/components/severity.html` |
| `.mp` · `.method-pill` | get · post · put · patch · delete · options · head · solid · sm | `ds/components/method-status.html` |
| `.sc` · `.status-code` | ok · info · warn · err (pulse) | `ds/components/method-status.html` |
| `.alert` | success · warn · error · info · solid · sm · close · actions | `ds/components/alerts.html` |
| `.empty-v3` | poses: wave · search · sleep · cheer | `ds/components/empty-states.html` |
| `.pg` · `.pagination` | arrows · ellipsis · ipp-select · sm | `ds/components/pagination.html` |
| `.tb` · `.tabs` | badge · icon · sm · card-wrap | `ds/components/tabs.html` |
| `.cd` · `.countdown` · `.next-run-chip` | soon · critical (pulse) · expired · sm · ico | `ds/components/countdown.html` |

### Organisms
| Class | Variants | Reference |
|---|---|---|
| `.card` | sm/lg · callout · hoverable (bento) · active | `ds/components/cards.html` |
| `.ss` · `.stat-strip` | delta · sub · ico · sm · clickable · savings/warn/err | `ds/components/stat-strip.html` |
| `table.resources` | `.sortable` · `.cell-actions` · `.cell-name-stack` · `.compact` | `ds/components/table.html` |
| `.drawer-overlay` + `.drawer-panel` | sm/lg · drawer-foot · borderless close | `ds/components/drawer.html` |
| `.sg` · `.rec-card` | hoverable · is-new · critical · reviewed · applied | `ds/components/suggestion.html` |
| `.tr` · `.tree` + `.tr-row` | `--depth: N` · selected · twist.leaf | `ds/components/tree.html` |
| ApexCharts (CDN) | 30 product-ready examples · brand tooltips via design.css | `ds/components/charts.html` |

### More (13 OG-app patterns)
| Class | Variants | Reference |
|---|---|---|
| `.breadcrumb` | sep · current | `ds/components/more.html` |
| `.bulk-banner` | bulk-count · bulk-label · bulk-spacer | `ds/components/more.html` |
| `.avatar` · `.user-pill` | c1–c5 · sm/lg · name+role | `ds/components/more.html` |
| `.switch` | checked · disabled | `ds/components/more.html` |
| `.dropdown` + `.dropdown-menu` | label · destructive item · separator | `ds/components/more.html` |
| `.progress` + `.progress-row` | savings · warn · over · sm/lg | `ds/components/more.html` |
| `.date-input` · `.date-range` | native + range | `ds/components/more.html` |
| `.stepper` | inline numeric +/− | `ds/components/more.html` |
| `.diff` + `.diff-row` | add · rem · meta | `ds/components/more.html` |
| `.budget-chip` | warn · over · 3-state bar | `ds/components/more.html` |
| `.action-queue-row` | aq-body · aq-meta · aq-actions | `ds/components/more.html` |
| `.snackbar` | ok · warn · err · close | `ds/components/more.html` |
| `.cal` + `.cal-cell` | today · muted · has-event | `ds/components/more.html` |

### Brand
| Class | Variants | Reference |
|---|---|---|
| Nimbus mascot (v3) | 10 poses · cursor-tracking eyes · breath · blink · easter eggs | `ds/components/nimbus.html` · `nimbus.js` |

---

## Patterns

| Pattern | When to use | Reference |
|---|---|---|
| Page header | Top of every page | `ds/patterns/page-header.html` |
| Filter row + table | Default data list | `ds/patterns/filter-table.html` |
| Drawer with form | Edit flows | `ds/patterns/drawer-form.html` |
| Empty state flow | No data · filtered out · paused · success | `ds/patterns/empty-state.html` |
| Recommendations list | Suggestion queues | `ds/patterns/recommendations.html` |
| Settings form | Two-column settings | `ds/patterns/settings-form.html` |
| Tabs + content | Sub-sections | `ds/patterns/tabs-pane.html` |
| KPI strip + charts | Dashboard | `ds/patterns/kpi-charts.html` |
| Loading · skeletons | Async data placeholders | `ds/patterns/skeleton.html` |
| Toast notifications | Non-blocking feedback | `ds/patterns/toast.html` |
| Inline edit | Edit values in place | `ds/patterns/inline-edit.html` |
| Multi-step wizard | Onboarding · complex flows | `ds/patterns/wizard.html` |
| Confirmation modal | Destructive · irreversible | `ds/patterns/modal.html` |
| Interaction states | System-wide state matrix | `ds/patterns/interaction-states.html` |

---

## Tokens cheat sheet

```css
/* Brand */
--zop-orange:   #F58549   /* brand primary */
--zop-blue:     #2A4494   /* ZopCloud body */
--ink:          /* text & ink fills · auto-flips for dark theme */
--paper:        /* surface · auto-flips */
--bg-app:       /* app background · auto-flips */

/* State (always paired with -bg tints) */
--state-success / --state-success-bg
--state-warn    / --state-warn-bg
--state-error   / --state-error-bg
--state-info    / --state-info-bg

/* Neutrals */
--g-300 → --g-700   (lightest to darkest)
--line              (default border)
--row-line          (row divider · lighter than --line)
--surface-1 → --surface-3  (subtle to strongest lift)

/* Fonts */
--font-display: 'Space Grotesk', sans-serif;
--font-body:    'Inter', sans-serif;
--font-mono:    'Inter', sans-serif;  /* alias — no separate mono */
```

---

## Theme switching

Set `data-theme="dark"` on `<html>` — every token flips automatically. Components have zero theme branching of their own.

```js
document.documentElement.setAttribute('data-theme', 'dark');
```

---

## Backward compatibility

Every new class has a legacy alias so existing markup keeps working:

| Legacy | New | Why |
|---|---|---|
| `.tag-soft` | `.tag-pill` | clearer name |
| `.tag` | `.tag-pair` | clearer name |
| `.chip` | `.tag-chip` | clearer name |
| `.filter-pill` | `.fp` | shorter |
| `.sev-badge` | `.sb` | shorter |
| `.method-pill` | `.mp` | shorter |
| `.status-code` | `.sc` | shorter |
| `.next-run-chip` · `.countdown` | `.cd` | unified |
| `.tabs` · `.feat-tabs` | `.tb` | unified |
| `.pagination` | `.pg` | shorter |
| `.rec-card` | `.sg` | unified |
| `.tree-row` | `.tr-row` | unified |
| `.stat-strip > .stat-cell` | `.ss > .cell` | unified |

---

## License & ownership

Internal · ZopNight team. Not for public distribution.
