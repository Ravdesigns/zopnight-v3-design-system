# Migration · V2 → V3

This is the codemod path. Most V2 class names still work via aliases, but for new pages — and for the eventual cleanup pass — use the V3 names directly.

## How to use this file

1. Run the search-and-replace patterns below across your codebase. Each is safe to apply in bulk — they don't collide with each other.
2. Smoke-test by loading the page and tabbing through interactive elements.
3. Once a sub-tree is fully migrated, remove the alias from `design.css` for that section (see "Removing aliases" below).

## Quick rename table

| V2 (old) | V3 (new) | Notes |
|---|---|---|
| `.tag-soft` | `.tag-pill` | Drillable variant uses `.tag-pill.drillable` |
| `.filter-pill` | `.fp` | Compound names: `.fp-active`, `.fp-count` |
| `.status-badge` | `.status-dot` | Pair with text label · don't rely on colour alone |
| `.btn-danger` | `.btn-destructive` | Alias kept · prefer destructive for clarity |
| `.card-elevated` | `.card.elevated` | Modifier · not separate class |
| `.modal-lg` | `.modal.lg` | Same |
| `.drawer-full` | `.drawer.full-width` | Wider name · self-explanatory |
| `.pill-warning` | `.alert.warn` | Banner → use `.alert`. Status pill → use `.status-dot.warn` |
| `.text-muted` | `color: var(--g-500)` | Inline · we don't ship utility classes |
| `.text-success` | `color: var(--state-success)` | Same |
| `.bg-paper` | `background: var(--paper)` | Same |

## Codemod commands

Sed (macOS / Linux):

```bash
# tag-soft → tag-pill
find . -name "*.html" -o -name "*.jsx" -o -name "*.tsx" -o -name "*.vue" \
  | xargs sed -i '' 's/\btag-soft\b/tag-pill/g'

# filter-pill → fp
find . -name "*.html" -o -name "*.jsx" -o -name "*.tsx" -o -name "*.vue" \
  | xargs sed -i '' 's/\bfilter-pill\b/fp/g'

# status-badge → status-dot
find . -name "*.html" -o -name "*.jsx" -o -name "*.tsx" -o -name "*.vue" \
  | xargs sed -i '' 's/\bstatus-badge\b/status-dot/g'

# btn-danger → btn-destructive (only inside class= attributes to avoid noise)
find . -name "*.html" -o -name "*.jsx" -o -name "*.tsx" -o -name "*.vue" \
  | xargs sed -i '' 's/btn-danger/btn-destructive/g'
```

Run them one at a time, commit between, verify visually.

## Things that aren't 1:1 renames

These need actual code changes, not search-and-replace:

### `<div class="badge badge-warning">` → status dot + text

```html
<!-- V2 -->
<div class="badge badge-warning">Warning</div>

<!-- V3 · status dot pairs with text so meaning survives greyscale -->
<span class="status-dot warn"></span>
<span>Action required</span>
```

### Buttons with two ink fills next to each other

V2 sometimes had `btn-primary` next to `btn-secondary-strong` (both ink-filled). V3 enforces **one ink fill per surface**. Convert the second to `btn-ghost`:

```html
<!-- V2 -->
<button class="btn-primary">Save</button>
<button class="btn-primary-alt">Cancel</button>

<!-- V3 -->
<button class="btn btn-primary">Save</button>
<button class="btn btn-ghost">Cancel</button>
```

### Inline hex codes

V2 had inline hex in component CSS. V3 requires tokens. Use the helper:

```bash
# Find leaking hex codes outside :root and the design-tokens file
grep -rn "#[A-Fa-f0-9]\{3,6\}" src/ --include="*.css" \
  | grep -v "design.css" \
  | grep -v ":root"
```

Replace each with the closest token from `ds/components/color-tokens.html`.

### Charts

V2 used custom inline SVG charts via `charts.js`. V3 uses **ApexCharts** (CDN). The migration is per-chart — see `ds/components/charts.html` for the wiring contract. The old `charts.js` helpers remain for backward compat but new charts must use ApexCharts.

```html
<!-- V2 -->
<div data-zopchart="bar" data-series='[1,2,3]'></div>

<!-- V3 · ApexCharts -->
<div id="my-chart"></div>
<script>
  new ApexCharts(document.querySelector('#my-chart'), {
    chart: { type: 'bar', toolbar: { show: false } },
    series: [{ data: [1,2,3] }],
    colors: [getComputedStyle(document.documentElement).getPropertyValue('--series-1').trim()],
    // ... see charts.html for the full theming contract
  }).render();
</script>
```

## Removing aliases

Aliases keep V2 markup alive while migration is in progress. Once a sub-tree is fully migrated, you can drop the alias from `design.css`:

1. Search the codebase for the V2 class.
2. If 0 matches: open `design.css` and delete the alias block.
3. Tag a commit: `chore(ds): drop .tag-soft alias`.

The alias blocks live near the bottom of `design.css`, search for `/* aliases · backward compat */`.

## Deprecation timeline

| Version | What happens |
|---|---|
| 1.0.x (current) | All V2 aliases shipped. Either class works. |
| 1.1.x | Console warning logged when V2 class detected (dev mode only). |
| 1.2.x | V2 aliases ship empty (no styles) — fail loudly. |
| 2.0.0 | V2 aliases removed entirely. |

The plan is roughly 2 quarters per step — enough time for any in-flight feature work to absorb the rename without blocking.

## Per-page migration checklist

When you migrate a page, run through this list:

- [ ] No literal hex codes outside `:root`
- [ ] No literal `z-index: 999` — pull from `--z-*` tokens
- [ ] No `outline: none` without a replacement focus ring
- [ ] All status indicators pair colour with text or icon
- [ ] All form fields have `<label>` (visible or `aria-label`)
- [ ] All modals have `aria-modal="true" aria-labelledby="…"`
- [ ] All animations honour `prefers-reduced-motion`
- [ ] Tab order makes sense unplugged-mouse
- [ ] Tested in light + dark mode
- [ ] Tested at `--bp-md` (768px) breakpoint
- [ ] No `console.warn` from the alias detector

## Need help?

- Component docs: `ds/index.html`
- Token reference: `ds/components/color-tokens.html`
- A11y rulebook: `ds/components/accessibility.html`
- Composition rules: `ds/components/composition.html`
