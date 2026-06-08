# ZopNight V3 Design System

A complete, self-contained design system for the ZopNight FinOps + scheduling product. Cream paper, ink, and a single orange accent. 52+ components. Light + dark mode. No build step, no React, no bundler.

## Quick start

Drop this into the `<head>` of any page:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<link rel="stylesheet" href="design.css">
<script src="https://cdn.jsdelivr.net/npm/apexcharts@3.49.1/dist/apexcharts.min.js" defer></script>
<script src="nimbus.js" defer></script>
```

Open `ds/index.html` for the full documentation site.

## What's in the box

| File | Purpose |
|---|---|
| `design.css` | The complete stylesheet · 8,600+ lines · tokens, light/dark mode, all components |
| `nimbus.js` | The Nimbus mascot · 11 poses, cursor tracking, blink cycles, easter eggs |
| `charts.js` | Legacy inline-SVG chart helpers (new charts use ApexCharts via CDN) |
| `tokens.js` | JS export of all design tokens for runtime theming |
| `ds/index.html` | START HERE · documentation portal with sidebar nav + ⌘K search |
| `DESIGN-SYSTEM.md` | Component matrix · token cheat sheet · principles |
| `DEV-HANDOFF.md` | Full spec with acceptance criteria and 4-phase adoption plan |
| `CHANGELOG.md` | Versioning + release notes |
| `MIGRATION.md` | Class migration guide (legacy → V3) |
| `charts-gallery.html` | 30 ApexCharts examples |
| `nimbus-showcase.html` | Nimbus character iteration history |

## Documentation

The `ds/` folder is a static documentation site. Open `ds/index.html` in any browser. No server required.

- **Foundation** · color tokens · typography · motion · breakpoints · icons · accessibility · composition rules · Nimbus
- **Atoms** · buttons · status dots · inputs · kbd · mono ID · tags + chips · provider marks
- **Molecules** · filter pills · severity · method/HTTP status · alerts · empty states · pagination · tabs · countdown
- **Organisms** · cards · stat strip · table · drawer · suggestion · tree · charts · gap-fill (70 patterns)
- **Patterns** · 18 page-level patterns covering filter-table, drawer-form, wizard, modal, toast, form validation, loading states, microcopy, animation orchestration, and more

## Governing rules

1. Reskin only · do not change information architecture or page flow.
2. Cream paper, ink, one orange accent. Never `#000` or `#fff`.
3. State color ≤ 3% of any view. Orange ≤ 10%. The brand is rationed.
4. Square corners everywhere except pills (`9999px`) and small status dots (`50%`, ≤ 8px).
5. Em-dashes banned in user copy. Periods, colons, mid-dots preferred.
6. Motion conveys state. `prefers-reduced-motion` always respected.
7. One ink-filled button per surface. Never two primaries side-by-side.
8. Density wins over whitespace for dense data UIs.

## License

Internal use · ZopNight / Zop.Dev.

## Credits

Design system by Ravindra · built for ZopNight V3 reskin · 2026.
