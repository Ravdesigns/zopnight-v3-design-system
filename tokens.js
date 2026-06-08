/* ZopNight V3 · design tokens · JS export
 *
 * What this is: the source of truth for design tokens, mirrored in JS so
 * Recharts, ApexCharts, vis-libs, and any imperative styling code can read
 * the same values that drive the CSS.
 *
 * What this isn't: a replacement for CSS variables. The CSS is authoritative
 * at runtime — this file just makes the same values available to JS at build
 * time (for Recharts theming) and runtime (for chart libraries that need
 * literal hex strings, not var() refs).
 *
 * Theme switching: at runtime, prefer reading from the live CSS — see
 * readCssToken() below. That way the JS view always matches the user's
 * current theme (light/dark) without re-importing this file.
 *
 * Usage in React:
 *
 *   import { tokens, readCssToken } from './tokens.js';
 *
 *   // Static · build time (light theme defaults)
 *   <Bar fill={tokens.zopOrange} />
 *
 *   // Live · runtime · respects dark mode
 *   <Bar fill={readCssToken('--zop-orange')} />
 */

// ── Light theme defaults (matches :root in design.css) ──────────────
export const tokens = {
  // Brand
  zopOrange:   '#E8602C',
  zopOrange2:  '#C44E20',

  // Surface
  paper:       '#F5F1E9',
  ink:         '#0A0A0A',
  surface1:    '#FAF7F1',
  surface2:    '#EDE9DE',
  line:        '#D9D5C8',
  rowLine:     '#E5E1D5',

  // Grey scale
  g300:        '#C1BDB1',
  g500:        '#7A7669',
  g700:        '#3A3833',

  // State colours
  stateSuccess: '#5F8A1A',
  stateWarn:    '#D97706',
  stateError:   '#C0392B',
  stateInfo:    '#1E5FA8',

  // 10-color categorical series palette
  series: [
    '#E8602C', // 1 · brand orange
    '#1E5FA8', // 2 · blue
    '#5F8A1A', // 3 · green
    '#7A4FC0', // 4 · purple
    '#D97706', // 5 · amber
    '#C0392B', // 6 · red
    '#0E7B7B', // 7 · teal
    '#B4317F', // 8 · magenta
    '#5C6970', // 9 · slate
    '#A2895B', // 10 · sand
  ],

  // Provider colours
  provider: {
    aws:    '#FF9900',
    gcp:    '#4285F4',
    azure:  '#0078D4',
    k8s:    '#326CE5',
    oracle: '#F80000',
    do:     '#0080FF',
  },

  // Typography
  fontDisplay: '"Space Grotesk", system-ui, sans-serif',
  fontBody:    'Inter, system-ui, sans-serif',
  fontMono:    '"JetBrains Mono", ui-monospace, monospace',

  // Spacing scale (in px)
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },

  // Z-index scale
  z: {
    base:     0,
    sticky:   10,
    dropdown: 50,
    drawer:   100,
    modal:    200,
    toast:    300,
    tooltip:  400,
  },

  // Breakpoints (in px · match --bp-* tokens)
  bp: { sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 },

  // Motion
  motion: {
    fast:     '120ms',
    base:     '180ms',
    slow:     '240ms',
    easeOut:  'cubic-bezier(0.16, 1, 0.3, 1)',
    easePend: 'cubic-bezier(0.45, 0, 0.55, 1)',
  },
};

// ── Dark theme overrides ────────────────────────────────────────────
// Mirrors the html[data-theme="dark"] block in design.css.
// Use when you can't read the live CSS (e.g. server-side render with theme cookie).
export const darkTokens = {
  ...tokens,
  paper:        '#0F0F14',
  ink:          '#F5F1E9',
  surface1:     '#16161E',
  surface2:     '#1E1E28',
  line:         '#757584',
  rowLine:      '#2A2A36',
  g300:         '#4A4A56',
  g500:         '#9A9AA8',
  g700:         '#D5D5DC',
  stateSuccess: '#7FB236',
  stateWarn:    '#F4A460',
  stateError:   '#E66B5C',
  stateInfo:    '#7BA8DD',
};

// ── Live readers · prefer these at runtime ──────────────────────────
/**
 * Read a CSS custom property from the document root.
 * Returns the trimmed string value, or '' if not set.
 * Respects the current theme (data-theme attribute).
 *
 * @param {string} name - e.g. '--zop-orange'
 * @returns {string} - e.g. '#E8602C'
 */
export function readCssToken(name) {
  if (typeof document === 'undefined') {
    // SSR fallback · pick from static tokens
    const key = name.replace(/^--/, '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    return tokens[key] || '';
  }
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Read the full series palette (--series-1 through --series-10) as an array.
 * Useful for chart libraries that expect a colors[] array.
 */
export function readSeriesPalette() {
  if (typeof document === 'undefined') return tokens.series;
  const root = getComputedStyle(document.documentElement);
  return Array.from({ length: 10 }, (_, i) =>
    root.getPropertyValue(`--series-${i + 1}`).trim() || tokens.series[i]
  );
}

/**
 * Read the current theme. Returns 'light' or 'dark'.
 */
export function currentTheme() {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') || 'light';
}

/**
 * Subscribe to theme changes. Returns an unsubscribe function.
 * Useful for chart libraries that need to re-render on theme toggle.
 */
export function onThemeChange(callback) {
  if (typeof document === 'undefined') return () => {};
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.attributeName === 'data-theme') {
        callback(currentTheme());
      }
    }
  });
  observer.observe(document.documentElement, { attributes: true });
  return () => observer.disconnect();
}

// ── ApexCharts shortcut ─────────────────────────────────────────────
/**
 * Returns a partial ApexCharts options object pre-configured with brand
 * tokens. Spread it into your chart options.
 *
 * Usage:
 *   const chart = new ApexCharts(el, {
 *     ...apexBrandDefaults(),
 *     chart: { type: 'bar' },
 *     series: [...],
 *   });
 */
export function apexBrandDefaults() {
  return {
    colors: readSeriesPalette(),
    chart: {
      fontFamily: tokens.fontBody,
      foreColor: readCssToken('--g-500'),
      toolbar: { show: false },
    },
    grid: { borderColor: readCssToken('--row-line'), strokeDashArray: 2 },
    tooltip: {
      theme: currentTheme(),
      style: { fontFamily: tokens.fontBody, fontSize: '11.5px' },
    },
    legend: {
      fontFamily: tokens.fontBody,
      fontSize: '11.5px',
      markers: { width: 8, height: 8, radius: 4 },
    },
  };
}

// ── Recharts shortcut ───────────────────────────────────────────────
/**
 * Returns common Recharts theming props. Pass to <CartesianGrid>, <XAxis>,
 * <YAxis>, <Tooltip> via the spread operator.
 */
export function rechartsTheme() {
  return {
    grid:    { stroke: readCssToken('--row-line'), strokeDasharray: '2 2' },
    axis:    { stroke: readCssToken('--g-500'), fontSize: 11, fontFamily: tokens.fontBody },
    tooltip: {
      contentStyle: {
        background: readCssToken('--surface-1'),
        border:     `1px solid ${readCssToken('--line')}`,
        borderRadius: 6,
        fontFamily: tokens.fontBody,
        fontSize:   11.5,
      },
      cursor: { fill: readCssToken('--surface-2'), opacity: 0.5 },
    },
    colors:  readSeriesPalette(),
  };
}

// Default export · for `import tokens from './tokens.js'` style
export default tokens;
