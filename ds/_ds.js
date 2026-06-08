/* Shared sidebar nav for ds/ docs pages.
   Each page: <aside class="ds-sidebar" data-current="buttons"></aside>
   This script populates it with the full TOC and marks the current. */
(function () {
  // ── Theme toggle · light/dark · runs as early as possible to prevent FOUC ──
  const THEME_KEY = 'zopnight-v3-theme';
  const stored = (function () { try { return localStorage.getItem(THEME_KEY); } catch { return null; } })();
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initialTheme);
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem(THEME_KEY, t); } catch {}
    document.querySelectorAll('[data-ds-theme-btn]').forEach((b) => {
      b.setAttribute('aria-pressed', b.dataset.dsThemeBtn === t ? 'true' : 'false');
    });
  }

  const NAV = [
    { label: 'Overview', items: [
      { id: 'index',          name: 'Home',           href: '../index.html' },
      { id: 'principles',     name: 'Principles',     href: '../principles.html' },
    ]},
    { label: 'Foundation', items: [
      { id: 'color-tokens',   name: 'Color tokens',   href: 'color-tokens.html' },
      { id: 'typography',     name: 'Typography',     href: 'typography.html' },
      { id: 'motion',         name: 'Motion · 3% rule', href: 'motion.html' },
      { id: 'breakpoints',    name: 'Breakpoints',    href: 'breakpoints.html' },
      { id: 'icons',          name: 'Icons',          href: 'icons.html' },
      { id: 'accessibility',  name: 'Accessibility',  href: 'accessibility.html' },
      { id: 'composition',    name: 'Composition rules', href: 'composition.html' },
      { id: 'nimbus',         name: 'Nimbus mascot',  href: 'nimbus.html' },
    ]},
    { label: 'Atoms', items: [
      { id: 'buttons',        name: 'Buttons',        href: 'buttons.html' },
      { id: 'status-dots',    name: 'Status dots',    href: 'status-dots.html' },
      { id: 'inputs',         name: 'Inputs',         href: 'inputs.html' },
      { id: 'kbd',            name: 'Kbd',            href: 'kbd.html' },
      { id: 'mono-id',        name: 'Mono ID · copy', href: 'mono-id.html' },
      { id: 'tags-chips',     name: 'Tags · chips',   href: 'tags-chips.html' },
      { id: 'switch',         name: 'Switch · toggle', href: 'switch.html' },
      { id: 'provider-marks', name: 'Provider marks', href: 'provider-marks.html' },
    ]},
    { label: 'Molecules', items: [
      { id: 'filter-pills',   name: 'Filter pills',   href: 'filter-pills.html' },
      { id: 'severity',       name: 'Severity badges', href: 'severity.html' },
      { id: 'method-status',  name: 'Method · HTTP status', href: 'method-status.html' },
      { id: 'alerts',         name: 'Alerts · banners', href: 'alerts.html' },
      { id: 'empty-states',   name: 'Empty states · Nimbus', href: 'empty-states.html' },
      { id: 'pagination',     name: 'Pagination',     href: 'pagination.html' },
      { id: 'tabs',           name: 'Tabs',           href: 'tabs.html' },
      { id: 'countdown',      name: 'Countdown chip', href: 'countdown.html' },
    ]},
    { label: 'Organisms', items: [
      { id: 'cards',          name: 'Cards',          href: 'cards.html' },
      { id: 'stat-strip',     name: 'Stat strip',     href: 'stat-strip.html' },
      { id: 'table',          name: 'Table',          href: 'table.html' },
      { id: 'drawer',         name: 'Drawer',         href: 'drawer.html' },
      { id: 'suggestion',     name: 'Suggestion row', href: 'suggestion.html' },
      { id: 'tree',           name: 'Tree explorer',  href: 'tree.html' },
      { id: 'charts',         name: 'Charts (ApexCharts)', href: 'charts.html' },
      { id: 'more',           name: 'More components (14)', href: 'more.html' },
      { id: 'gap-fill',       name: 'Gap-fill (70 items)', href: 'gap-fill.html' },
    ]},
    { label: 'Patterns', items: [
      { id: 'p-header',       name: 'Page header',           href: '../patterns/page-header.html' },
      { id: 'p-filter-table', name: 'Filter row + table',    href: '../patterns/filter-table.html' },
      { id: 'p-drawer-form',  name: 'Drawer with form',      href: '../patterns/drawer-form.html' },
      { id: 'p-empty',        name: 'Empty state flow',      href: '../patterns/empty-state.html' },
      { id: 'p-recs',         name: 'Recommendations list',  href: '../patterns/recommendations.html' },
      { id: 'p-settings',     name: 'Settings form',         href: '../patterns/settings-form.html' },
      { id: 'p-tabs-pane',    name: 'Tabs + content',        href: '../patterns/tabs-pane.html' },
      { id: 'p-kpi-charts',   name: 'KPI strip + charts',    href: '../patterns/kpi-charts.html' },
      { id: 'p-skeleton',     name: 'Loading · skeletons',   href: '../patterns/skeleton.html' },
      { id: 'p-toast',        name: 'Toast notifications',   href: '../patterns/toast.html' },
      { id: 'p-inline-edit',  name: 'Inline edit',           href: '../patterns/inline-edit.html' },
      { id: 'p-wizard',       name: 'Multi-step wizard',     href: '../patterns/wizard.html' },
      { id: 'p-modal',        name: 'Confirmation modal',    href: '../patterns/modal.html' },
      { id: 'p-states',       name: 'Interaction states',    href: '../patterns/interaction-states.html' },
      { id: 'p-form-validation',       name: 'Form validation',       href: '../patterns/form-validation.html' },
      { id: 'p-loading-states',        name: 'Loading states',        href: '../patterns/loading-states.html' },
      { id: 'p-microcopy',             name: 'Microcopy',             href: '../patterns/microcopy.html' },
      { id: 'p-animation-orchestration', name: 'Animation orchestration', href: '../patterns/animation-orchestration.html' },
    ]},
    { label: 'Engineering', items: [
      { id: 'e-migration',    name: 'Migration · V2 → V3', href: '../../MIGRATION.md' },
      { id: 'e-changelog',    name: 'Changelog',           href: '../../CHANGELOG.md' },
      { id: 'e-tokens-js',    name: 'tokens.js',           href: '../../tokens.js' },
    ]},
  ];

  // Detect which folder this page lives in.
  // NAV paths are written for the ds/components/ context (bare filenames =
  // component pages · ../patterns/foo = pattern · ../index.html = ds root).
  // From patterns/ we need an extra hop. From ds/ root we need to drop the ../
  // and add a components/ prefix for component pages.
  const path = location.pathname;
  const inPatterns   = path.includes('/ds/patterns/')   || path.endsWith('/patterns/');
  const inComponents = path.includes('/ds/components/') || path.endsWith('/components/');
  const inDsRoot     = !inPatterns && !inComponents;

  function resolveHref(href) {
    if (inDsRoot) {
      // index.html / principles.html sit at ds/
      // · ../index.html → index.html
      // · ../principles.html → principles.html
      // · ../patterns/foo.html → patterns/foo.html
      // · color-tokens.html → components/color-tokens.html
      if (href.startsWith('../')) return href.replace(/^\.\.\//, '');
      return 'components/' + href;
    }
    if (inPatterns) {
      // ds/patterns/foo.html
      // · ../index.html → ../index.html (already correct)
      // · ../patterns/bar.html → ./bar.html or just stay
      // · color-tokens.html → ../components/color-tokens.html
      if (href.startsWith('../')) return href;
      return '../components/' + href;
    }
    // ds/components/ — paths are already correct as written
    return href;
  }

  document.querySelectorAll('aside.ds-sidebar').forEach((el) => {
    const current = el.getAttribute('data-current') || '';
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    let html = '<h1>ZopNight V3</h1><div class="sub">Design system · handoff</div>';
    // Search trigger
    html += '<button class="ds-search-trigger" data-search-open><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="5" cy="5" r="3.5"/><path d="m7.5 7.5 3 3"/></svg>Search components<span class="kbd">⌘ K</span></button>';
    // Theme toggle
    html += `<div class="ds-theme-toggle" role="group" aria-label="Theme">
      <button data-ds-theme-btn="light" aria-pressed="${currentTheme === 'light' ? 'true' : 'false'}"><svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="7" cy="7" r="2.5"/><path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.6 2.6l1 1M10.4 10.4l1 1M2.6 11.4l1-1M10.4 3.6l1-1"/></svg>Light</button>
      <button data-ds-theme-btn="dark" aria-pressed="${currentTheme === 'dark' ? 'true' : 'false'}"><svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11.5 8a4.5 4.5 0 0 1-5.5-5.5 5 5 0 1 0 5.5 5.5z"/></svg>Dark</button>
    </div>`;
    NAV.forEach((g) => {
      html += `<div class="group"><div class="group-label">${g.label}</div><nav>`;
      g.items.forEach((it) => {
        const href = resolveHref(it.href);
        const aria = (current === it.id) ? ' aria-current="page"' : '';
        html += `<a href="${href}"${aria}>${it.name}</a>`;
      });
      html += '</nav></div>';
    });
    el.innerHTML = html;
  });

  // ── ⌘K Search ────────────────────────────────────────────────────
  const allItems = NAV.flatMap((g) => g.items.map((it) => ({ ...it, group: g.label })));

  let searchOverlay = null;
  function openSearch() {
    if (!searchOverlay) {
      searchOverlay = document.createElement('div');
      searchOverlay.className = 'ds-search-overlay';
      searchOverlay.innerHTML = `
        <div class="ds-search">
          <input type="text" placeholder="Search components, patterns, tokens..." autocomplete="off" />
          <div class="ds-search-results"></div>
          <div class="ds-search-hint">
            <span><span class="kbd">↑↓</span> navigate</span>
            <span><span class="kbd">⏎</span> open</span>
            <span><span class="kbd">Esc</span> close</span>
          </div>
        </div>`;
      document.body.appendChild(searchOverlay);
      const input = searchOverlay.querySelector('input');
      const results = searchOverlay.querySelector('.ds-search-results');
      let activeIdx = 0;
      const render = (q) => {
        q = q.trim().toLowerCase();
        const matched = q ? allItems.filter((it) =>
          it.name.toLowerCase().includes(q) || it.group.toLowerCase().includes(q)
        ) : allItems;
        if (!matched.length) {
          results.innerHTML = '<div class="empty">No matches for "' + q + '"</div>';
          return;
        }
        activeIdx = 0;
        results.innerHTML = matched.map((it, i) =>
          `<a href="${resolveHref(it.href)}" data-i="${i}" class="${i === 0 ? 'active' : ''}">
            <span>${it.name}</span><span></span><span class="group">${it.group}</span>
          </a>`
        ).join('');
      };
      input.addEventListener('input', (e) => render(e.target.value));
      input.addEventListener('keydown', (e) => {
        const items = results.querySelectorAll('a');
        if (!items.length) return;
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          items[activeIdx]?.classList.remove('active');
          activeIdx = (activeIdx + 1) % items.length;
          items[activeIdx].classList.add('active');
          items[activeIdx].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          items[activeIdx]?.classList.remove('active');
          activeIdx = (activeIdx - 1 + items.length) % items.length;
          items[activeIdx].classList.add('active');
          items[activeIdx].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
          e.preventDefault();
          items[activeIdx]?.click();
        }
      });
      searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) closeSearch();
      });
      render('');
    }
    searchOverlay.setAttribute('open', '');
    setTimeout(() => searchOverlay.querySelector('input').focus(), 50);
  }
  function closeSearch() {
    searchOverlay?.removeAttribute('open');
  }
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-search-open]')) { e.preventDefault(); openSearch(); }
    const themeBtn = e.target.closest('[data-ds-theme-btn]');
    if (themeBtn) { e.preventDefault(); setTheme(themeBtn.dataset.dsThemeBtn); }
  });
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
    if (e.key === 'Escape' && searchOverlay?.hasAttribute('open')) closeSearch();
  });

  // ── Section anchors ──────────────────────────────────────────────
  document.querySelectorAll('.ds-section h2, .ds-section h3').forEach((h) => {
    if (h.querySelector('.anchor')) return;
    const slug = h.textContent.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    h.id = slug;
    const a = document.createElement('a');
    a.className = 'anchor'; a.href = '#' + slug; a.textContent = '#';
    a.setAttribute('aria-label', 'Anchor');
    h.insertBefore(a, h.firstChild);
  });

  // ── HTML / CSS syntax highlighting for .ds-code blocks ───────────
  // Token-based approach: build a list of (text, class) spans, then emit once.
  // Avoids the regex-cascade trap where later replacements eat earlier wrappers.
  function escape(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function highlightHTML(src) {
    let out = '';
    let i = 0;
    while (i < src.length) {
      // Comment
      if (src.startsWith('<!--', i)) {
        const end = src.indexOf('-->', i);
        const block = src.slice(i, end === -1 ? src.length : end + 3);
        out += '<span class="tok-com">' + escape(block) + '</span>';
        i = end === -1 ? src.length : end + 3;
        continue;
      }
      // Tag
      if (src[i] === '<') {
        const end = src.indexOf('>', i);
        if (end === -1) { out += escape(src.slice(i)); break; }
        const tag = src.slice(i + 1, end);
        // tagname (with optional /)
        const tagMatch = tag.match(/^(\/?)([a-zA-Z][a-zA-Z0-9-]*)([\s\S]*)$/);
        out += '<span class="tok-punct">&lt;</span>';
        if (tagMatch) {
          if (tagMatch[1]) out += '<span class="tok-punct">/</span>';
          out += '<span class="tok-tag">' + escape(tagMatch[2]) + '</span>';
          // attrs
          let rest = tagMatch[3];
          rest = rest.replace(/([a-zA-Z-]+)(=)("[^"]*"|'[^']*')?/g, function (_m, name, eq, val) {
            let s = ' <span class="tok-attr">' + escape(name) + '</span>';
            if (eq) {
              s += '<span class="tok-punct">=</span>';
              if (val) s += '<span class="tok-str">' + escape(val) + '</span>';
            }
            return s;
          });
          // any leading whitespace was consumed; remove leading space if present
          if (rest.startsWith(' ')) rest = rest.slice(0);
          // self-closing slash
          rest = rest.replace(/\/$/, '<span class="tok-punct">/</span>');
          out += rest;
        } else {
          out += escape(tag);
        }
        out += '<span class="tok-punct">&gt;</span>';
        i = end + 1;
        continue;
      }
      // Text content
      const next = src.indexOf('<', i);
      const chunk = src.slice(i, next === -1 ? src.length : next);
      out += escape(chunk);
      i = next === -1 ? src.length : next;
    }
    return out;
  }
  function highlightCSS(src) {
    let out = escape(src);
    // comments
    out = out.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok-com">$1</span>');
    // property: value;
    out = out.replace(/^(\s*)([a-zA-Z-]+)(\s*):\s*([^;{}\n]+?)(;?)$/gm,
      (_m, indent, prop, _ws, val, semi) =>
        indent + '<span class="tok-prop">' + prop + '</span><span class="tok-punct">:</span> <span class="tok-val">' + val.trim() + '</span><span class="tok-punct">' + semi + '</span>');
    // braces
    out = out.replace(/([{}])/g, '<span class="tok-punct">$1</span>');
    return out;
  }
  document.querySelectorAll('.ds-code pre').forEach((pre) => {
    if (pre.dataset.highlighted) return;
    const src = pre.textContent;
    const looksLikeCss = /\{[\s\S]*?\}/.test(src) && /[\w-]+\s*:[^/]/.test(src) && !/<[a-zA-Z]/.test(src);
    pre.innerHTML = looksLikeCss ? highlightCSS(src) : highlightHTML(src);
    pre.dataset.highlighted = '1';
  });

  // Copy-button wiring for .ds-code blocks
  document.querySelectorAll('.ds-code').forEach((el) => {
    if (el.querySelector('.copy')) return;
    const btn = document.createElement('button');
    btn.className = 'copy';
    btn.type = 'button';
    btn.textContent = 'Copy';
    btn.addEventListener('click', () => {
      const code = el.querySelector('pre')?.textContent || '';
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 1400);
      });
    });
    el.appendChild(btn);
  });
})();
