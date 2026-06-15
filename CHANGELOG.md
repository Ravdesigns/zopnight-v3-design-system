# Changelog · ZopNight V3 Design System

All notable changes to `design.css`, `nimbus.js`, `charts.js`, and the docs site.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the system uses semantic-ish versioning:

- **Major** (1.0.0 → 2.0.0) — breaking changes to public class names · token removals · component API changes that require markup edits
- **Minor** (1.0.0 → 1.1.0) — additive: new components · new tokens · new patterns · new variants
- **Patch** (1.0.0 → 1.0.1) — visual polish · bug fixes · doc updates · no markup changes required

Pull `design.css` + `nimbus.js` together — they're versioned in lockstep.

---

## [1.2.0] · 2026-06-12

### Added

- **Filter popover pattern** (`ds/patterns/filter-popover.html`) — collapses a wide filter row behind a single `Filters` trigger (with an active-count badge) + popover; the search field stays inline and active filters surface below as removable `.fp` pills. Use at 4+ filters; the inline `filter-table` row stays the choice for 1–3. Composes existing `.fp` / `.form-input` / `.btn` — no new `design.css` classes.

### Notes — variants the app adopted (already covered by the system)

- Compact page header (tighter heading→content spacing) — a spacing variant of the existing **Page header** pattern.
- Copy-on-hover identifier (copy button reveals on row hover) — the hover-reveal variant of the existing **Mono ID + copy** component.

---

## [1.1.0] · 2026-06-05

### Added — handoff polish pass

- **Accessibility doc** (`ds/components/accessibility.html`) — keyboard nav matrix · ARIA patterns · focus ring spec · WCAG contrast table · don't-rely-on-colour examples.
- **Breakpoints doc** (`ds/components/breakpoints.html`) + tokens `--bp-sm/md/lg/xl/2xl` — canonical 640 / 768 / 1024 / 1280 / 1536. Component collapse matrix.
- **Iconography doc** (`ds/components/icons.html`) — inline SVG recipe · 5 canonical sizes · 1.5px stroke · standard set + copy-paste examples.
- **Composition rules** (`ds/components/composition.html`) — what nests in what · z-index scale · focus trap inheritance · stacking context gotchas.
- **Form validation patterns** (`ds/patterns/form-validation.html`) — timing matrix · placement rules · async patterns · error copy guide.
- **Loading state decision tree** (`ds/patterns/loading-states.html`) — skeleton vs spinner vs progress · result-state matrix · optimistic UI rules · slow-connection handling.
- **Microcopy library** (`ds/patterns/microcopy.html`) — voice rules · button labels · destructive language tiers · empty state / error / toast copy libraries.
- **Animation orchestration** (`ds/patterns/animation-orchestration.html`) + tokens `--stagger-step` `--page-fade-in` etc — page transitions · staggered reveals · modal/drawer choreography.
- **Print stylesheet** in `design.css` — strips chrome · forces light · expands collapses · adds `[href]` after links · A4 margins.
- **Whitelabel theming hook** in `design.css` — `html[data-brand="x"]` selector for partner skin overrides.
- **`tokens.js`** — JS export of all design tokens for React/Recharts theming · `readCssToken(name)` helper.
- **`MIGRATION.md`** — codemod-style search-and-replace path from V2 → V3 class names · backward-compat alias table · deprecation timeline.

### Changed

- Sidebar nav (`ds/_ds.js`) gained an "Extras" group with the new docs.
- `ds/index.html` tile grid now includes accessibility, breakpoints, icons, composition + Figma link slot.

### No breaking changes
Every V1.0 class still works. Aliases remain in place.

---

## [1.0.0] · 2026-06-03

### Added — design system handoff

- **24 core components** documented in `ds/components/` (atoms · molecules · organisms).
- **14 patterns** documented in `ds/patterns/` (page header through interaction states).
- **14 OG-app patterns** in `more.html` (breadcrumb · bulk banner · avatar · switch · dropdown · progress · date input · stepper · diff · budget chip · action queue · snackbar · calendar · role matrix).
- **70 gap-fill items** in `gap-fill.html` covering tooltip · combobox · grouped multi-select · slider · dropzone · spinner · error state · KPI card · kanban · activity timeline · resource picker · Recharts contract · terminal log · 3 stepper variants · deploy stepper · segmented control · composite filter bar · health indicator · cron dropdown · 20+ marketing status pills · and more.
- **Nimbus v3 mascot** (`nimbus.js`) — 11 poses · cursor-tracking eyes · natural blink · walking legs · easter eggs.
- **Dark mode** — 197 overrides via `html[data-theme="dark"]` · WCAG AA+ contrast verified · localStorage persistence.
- **ApexCharts integration** — brand tooltip overrides · 10-color series palette · Recharts theming contract documented.
- **Token system** — color · type · spacing · motion · z-index · provider colors · 10-color series.
- **Docs site** at `ds/index.html` — 46 HTML pages · ⌘K search · section anchors · syntax highlight · light/dark toggle.

---

## How to read this file going forward

- New release → top of file with date.
- "Breaking changes" section gets its own callout — devs grep for it.
- "Migration notes" link to `MIGRATION.md` when a class rename or removal happens.
- Patch releases (visual polish) batch up — don't spam a release per token nudge.

## Filing a release

1. Bump version in `design.css` header comment.
2. Add entry here with date and category.
3. If breaking: update `MIGRATION.md` with the codemod path.
4. Update `DEV-HANDOFF.md` version reference.
5. Tag the commit.
