/* ═══════════════════════════════════════════════════════════════════
   ZopNight · charts.js
   ───────────────────────────────────────────────────────────────────
   Hand-rolled inline SVG chart helpers with hover, tooltips, crosshair
   guides, and mount animations. Zero deps. Theme-aware via CSS vars.

   USAGE — render
       el.innerHTML = ZopCharts.lineChart([12,18,22,28,34], {
         stroke: 'var(--zop-orange)',
         labels: ['Mon','Tue','Wed','Thu','Fri'],
         values: ['$12K','$18K','$22K','$28K','$34K'],  // tooltip text
       });
       ZopCharts.activate(el);   // wires hover · tooltips · animations

       // OR auto-activate the entire document:
       ZopCharts.activate();

   AVAILABLE
       lineChart, sparkline, barChart, areaChart, donut,
       heatmap, leaderboard, radar, timeline, worldMap, legend
   ─────────────────────────────────────────────────────────────────── */
(function (global) {
  'use strict';

  /* ── shared tokens (re-resolved at SVG render time via CSS vars) ── */
  const T = {
    ink:    'var(--ink)',
    paper:  'var(--paper)',
    line:   'var(--line)',
    row:    'var(--row-line)',
    g400:   'var(--g-400)',
    g500:   'var(--g-500)',
    g600:   'var(--g-600)',
    g700:   'var(--g-700)',
    orange: 'var(--zop-orange)',
    green:  'var(--zop-green-aa)',
    blue:   'var(--zop-blue)',
    mono:   'Inter, system-ui, sans-serif',
    sans:   'Space Grotesk, system-ui, sans-serif',
  };

  const escape = (s) => String(s == null ? '' : s).replace(/[<>&"]/g, (c) =>
    ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;' }[c] || c));
  const map = (v, iMin, iMax, oMin, oMax) =>
    oMin + ((v - iMin) / (iMax - iMin || 1)) * (oMax - oMin);
  const path = (pts) =>
    pts.length ? 'M' + pts.map((p) => p.join(',')).join(' L') : '';

  let uidCounter = 0;
  const uid = () => 'zc-' + (++uidCounter);

  /* ═══════════════════════════════════════════════════════════════
     1 · lineChart(data, opts) — with hover + crosshair + animation
     ─────────────────────────────────────────────────────────────── */
  function lineChart(data, opts = {}) {
    const o = Object.assign({
      w: 600, h: 200, pad: 30,
      stroke: T.ink, strokeWidth: 1.5,
      dashed: false, fillArea: false, showAxis: true, showDots: false,
      target: null, mark: null, label: null,
      series: null,            // [{data, stroke, dashed, label, name}]
      labels: null,            // x-axis labels for tooltips
      values: null,            // pre-formatted values for tooltips
      animate: true,
    }, opts);
    const id = uid();
    const all = o.series ? o.series.flatMap((s) => s.data) : data;
    const maxY = (o.maxY != null ? o.maxY : Math.max(...all) * 1.1) || 1;
    const minY = o.minY != null ? o.minY : Math.min(0, Math.min(...all));
    const seriesArr = o.series || [{ data, stroke: o.stroke, dashed: o.dashed, label: o.label, name: 'value' }];
    const len = seriesArr[0].data.length - 1 || 1;
    const xFor = (i) => o.pad + (i / len) * (o.w - o.pad - 10);
    const yFor = (v) => o.h - o.pad - map(v, minY, maxY, 0, o.h - o.pad - 14);

    let svg = '';
    if (o.showAxis) {
      svg += `<line x1="${o.pad}" y1="${o.h - o.pad}" x2="${o.w - 10}" y2="${o.h - o.pad}" stroke="${T.line}" stroke-width="0.5"/>`;
    }

    if (o.target != null) {
      const tv = o.target.value;
      const tc = o.target.color || T.orange;
      svg += `<line x1="${o.pad}" y1="${yFor(tv)}" x2="${o.w - 10}" y2="${yFor(tv)}" stroke="${tc}" stroke-width="1.25" stroke-dasharray="3 4"/>`;
      if (o.target.label) {
        svg += `<text x="${o.w - 14}" y="${yFor(tv) - 4}" text-anchor="end" font-family="${T.mono}" font-size="10" fill="${tc}" font-weight="600">${escape(o.target.label)}</text>`;
      }
    }

    seriesArr.forEach((series, sidx) => {
      const pts = series.data.map((v, i) => [xFor(i), yFor(v)]);
      const stroke = series.stroke || o.stroke;
      const dash = series.dashed ? ' stroke-dasharray="3 3"' : '';
      if (o.fillArea && !series.skipFill && sidx === 0) {
        const areaPts = pts.concat([[xFor(series.data.length - 1), o.h - o.pad], [xFor(0), o.h - o.pad]]);
        svg += `<path d="${path(areaPts)} Z" fill="${stroke}" opacity="0.10" data-zc-area/>`;
      }
      svg += `<path d="${path(pts)}" fill="none" stroke="${stroke}" stroke-width="${o.strokeWidth}"${dash} class="${o.animate ? 'zc-line-anim' : ''}" data-zc-path/>`;
      if (o.showDots) {
        pts.forEach(([x, y]) => { svg += `<circle cx="${x}" cy="${y}" r="2.5" fill="${stroke}"/>`; });
      }
      if (series.label && !o.series) {
        // Single-series top-right label
        svg += `<text x="${o.w - 14}" y="14" text-anchor="end" font-family="${T.mono}" font-size="10" fill="${stroke}" font-weight="600">${escape(series.label)}</text>`;
      }
    });

    // Multi-series legend labels (one per row top-right)
    if (o.series && o.series.length > 1) {
      o.series.forEach((s, i) => {
        if (s.label) {
          svg += `<text x="${o.w - 12}" y="${14 + i * 14}" text-anchor="end" font-family="${T.mono}" font-size="10" fill="${s.stroke || T.ink}" font-weight="600">${escape(s.label)}</text>`;
        }
      });
    }

    if (o.mark != null) {
      const m = o.mark;
      const series = seriesArr[0].data;
      svg += `<circle cx="${xFor(m.index)}" cy="${yFor(series[m.index])}" r="4" fill="${m.color || T.orange}"/>`;
    }

    // Hover crosshair + dot
    svg += `<line data-zc-crosshair x1="0" y1="${o.pad}" x2="0" y2="${o.h - o.pad}" stroke="${T.ink}" stroke-width="0.8" stroke-dasharray="2 3" opacity="0" style="pointer-events:none;"/>`;
    seriesArr.forEach((s, i) => {
      svg += `<circle data-zc-hover-dot="${i}" cx="0" cy="0" r="4" fill="${s.stroke || o.stroke}" opacity="0" style="pointer-events:none;"/>`;
    });

    // Hit zones — one per index, transparent overlay
    const dataLen = seriesArr[0].data.length;
    for (let i = 0; i < dataLen; i++) {
      const x = xFor(i);
      const halfStep = (i === 0 || i === dataLen - 1) ? (o.w - o.pad * 2) / (dataLen - 1) / 2 : (o.w - o.pad * 2) / (dataLen - 1);
      const seriesPayload = seriesArr.map((s) => ({
        name: s.name || s.label || 'value',
        value: o.values && o.values[i] != null ? o.values[i] : s.data[i],
        color: s.stroke || o.stroke,
      }));
      const label = o.labels && o.labels[i] != null ? o.labels[i] : ('Point ' + (i + 1));
      svg += `<rect data-zc-hit data-zc-i="${i}" data-zc-x="${x}" data-zc-label="${escape(label)}" data-zc-series='${JSON.stringify(seriesPayload).replace(/'/g, '&#39;')}'
                    x="${x - halfStep / 2}" y="${o.pad - 6}" width="${halfStep}" height="${o.h - o.pad * 2 + 12}"
                    fill="transparent" style="cursor:crosshair;"/>`;
      if (seriesArr.length === 1) {
        // store y for the single-series dot
        const y = yFor(seriesArr[0].data[i]);
        svg = svg.replace(/data-zc-i="(\d+)"\s/, `data-zc-i="$1" data-zc-y="${y}" `);
      }
    }
    // Add data-zc-y values for each hit zone (single-series)
    if (seriesArr.length === 1) {
      svg = svg.replace(/data-zc-hit data-zc-i="(\d+)"/g, (m, i) => {
        const y = yFor(seriesArr[0].data[parseInt(i)]);
        return `data-zc-hit data-zc-i="${i}" data-zc-y="${y}"`;
      });
    }

    return wrap(svg, o, id);
  }

  /* ═══════════════════════════════════════════════════════════════
     2 · sparkline(arr, opts) — interactive minified version
     ─────────────────────────────────────────────────────────────── */
  function sparkline(arr, opts = {}) {
    return lineChart(arr, Object.assign({
      w: 220, h: 80, pad: 10,
      stroke: T.ink,
      mark: { index: arr.length - 1, color: opts.accent || T.orange },
    }, opts));
  }

  /* ═══════════════════════════════════════════════════════════════
     3 · barChart(arr, opts) — with hover highlight
     ─────────────────────────────────────────────────────────────── */
  function barChart(arr, opts = {}) {
    const o = Object.assign({
      w: 600, h: 200, pad: 30,
      fill: T.ink,
      horizontal: false,
      labels: null, values: null,
      maxY: null,
      threshold: null,
      animate: true,
    }, opts);
    const id = uid();
    const max = (o.maxY != null ? o.maxY : Math.max(...arr) * 1.1) || 1;

    let svg = `<line x1="${o.pad}" y1="${o.h - o.pad}" x2="${o.w - 10}" y2="${o.h - o.pad}" stroke="${T.line}" stroke-width="0.5"/>`;
    const innerW = o.w - o.pad - 10;
    const innerH = o.h - o.pad - 10;

    if (o.horizontal) {
      const rowH = innerH / arr.length;
      arr.forEach((v, i) => {
        const isOver = o.threshold && v > o.threshold.value;
        const color = isOver ? T.orange : (o.fill === 'pos-neg' ? (v > 0 ? T.green : T.orange) : o.fill);
        const bw = (Math.abs(v) / max) * innerW;
        const x = o.pad;
        const y = 14 + i * rowH;
        const labelStr = o.labels ? o.labels[i] : '';
        const valStr = o.values && o.values[i] != null ? o.values[i] : v;
        svg += `<rect data-zc-bar data-zc-i="${i}" data-zc-label="${escape(labelStr)}" data-zc-value="${escape(valStr)}" data-zc-color="${color}"
                  x="${x}" y="${y}" width="${o.animate ? 0 : bw}" height="${rowH * 0.6}" fill="${color}" opacity="0.85"
                  ${o.animate ? `class="zc-bar-anim-h" style="--zc-bar-w:${bw}px;"` : ''}/>`;
        if (o.labels) {
          svg += `<text x="${x - 8}" y="${y + rowH * 0.4}" text-anchor="end" font-family="${T.mono}" font-size="11" fill="${T.ink}">${escape(o.labels[i] || '')}</text>`;
        }
        if (o.values) {
          svg += `<text x="${x + bw + 6}" y="${y + rowH * 0.4}" font-family="${T.mono}" font-size="10" fill="${T.g600}">${escape(o.values[i] || '')}</text>`;
        }
      });
    } else {
      const colW = innerW / arr.length;
      arr.forEach((v, i) => {
        const isOver = o.threshold && v > o.threshold.value;
        const color = isOver ? T.orange : o.fill;
        const bh = (v / max) * innerH;
        const x = o.pad + i * colW + colW * 0.18;
        const w = colW * 0.64;
        const y = o.h - o.pad - bh;
        const labelStr = o.labels ? o.labels[i] : '';
        const valStr = o.values && o.values[i] != null ? o.values[i] : v;
        svg += `<rect data-zc-bar data-zc-i="${i}" data-zc-label="${escape(labelStr)}" data-zc-value="${escape(valStr)}" data-zc-color="${color}"
                  x="${x}" y="${o.animate ? o.h - o.pad : y}" width="${w}" height="${o.animate ? 0 : bh}" fill="${color}" opacity="0.85"
                  ${o.animate ? `class="zc-bar-anim-v" style="--zc-bar-h:${bh}px;--zc-bar-y:${y}px;"` : ''}/>`;
        if (o.labels) {
          svg += `<text x="${x + w / 2}" y="${o.h - 10}" text-anchor="middle" font-family="${T.mono}" font-size="9" fill="${T.g500}">${escape(o.labels[i] || '')}</text>`;
        }
      });
    }

    if (o.threshold) {
      const tv = o.threshold.value;
      const tc = o.threshold.color || T.orange;
      if (o.horizontal) {
        const tx = o.pad + (tv / max) * innerW;
        svg += `<line x1="${tx}" y1="0" x2="${tx}" y2="${o.h - o.pad}" stroke="${tc}" stroke-width="0.6" stroke-dasharray="3 3"/>`;
        if (o.threshold.label) svg += `<text x="${tx + 6}" y="12" font-family="${T.mono}" font-size="10" fill="${tc}">${escape(o.threshold.label)}</text>`;
      } else {
        const ty = o.h - o.pad - (tv / max) * innerH;
        svg += `<line x1="${o.pad}" y1="${ty}" x2="${o.w - 10}" y2="${ty}" stroke="${tc}" stroke-width="0.6" stroke-dasharray="3 3"/>`;
        if (o.threshold.label) svg += `<text x="${o.w - 14}" y="${ty - 4}" text-anchor="end" font-family="${T.mono}" font-size="10" fill="${tc}">${escape(o.threshold.label)}</text>`;
      }
    }

    return wrap(svg, o, id);
  }

  /* ═══════════════════════════════════════════════════════════════
     4 · areaChart — convenience wrapper
     ─────────────────────────────────────────────────────────────── */
  function areaChart(arr, opts = {}) {
    return lineChart(arr, Object.assign({ fillArea: true }, opts));
  }

  /* ═══════════════════════════════════════════════════════════════
     5 · donut(value, max, opts) — with sweep animation
     ─────────────────────────────────────────────────────────────── */
  function donut(value, max, opts = {}) {
    const o = Object.assign({
      size: 130, stroke: 8,
      color: T.green, track: T.line,
      label: null,
      animate: true,
    }, opts);
    const id = uid();
    const r = o.size / 2 - o.stroke / 2 - 2;
    const C = 2 * Math.PI * r;
    const pct = Math.min(1, Math.max(0, value / max));
    const off = C - pct * C;
    const cx = o.size / 2;
    const labelHTML = o.label != null
      ? `<text x="${cx}" y="${cx + 7}" text-anchor="middle" font-family="${T.sans}" font-size="22" font-weight="600" fill="${T.ink}">${escape(o.label)}</text>`
      : `<text x="${cx}" y="${cx + 7}" text-anchor="middle" font-family="${T.sans}" font-size="22" font-weight="600" fill="${T.ink}">${Math.round(pct * 100)}%</text>`;
    const svg = `
      <circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${o.track}" stroke-width="${o.stroke}"/>
      <circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${o.color}" stroke-width="${o.stroke}"
              stroke-dasharray="${C}" stroke-dashoffset="${o.animate ? C : off}"
              transform="rotate(-90 ${cx} ${cx})"
              class="${o.animate ? 'zc-donut-anim' : ''}"
              data-zc-donut-target="${off}"
              style="transition: stroke-dashoffset 800ms cubic-bezier(0.22,1,0.36,1);"/>
      ${labelHTML}
    `;
    return wrap(svg, Object.assign({}, o, { w: o.size, h: o.size }), id);
  }

  /* ═══════════════════════════════════════════════════════════════
     6 · heatmap(state, opts) — CSS-Grid based; no SVG
     ─────────────────────────────────────────────────────────────── */
  function heatmap(state, opts = {}) {
    const o = Object.assign({
      days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      cellHeight: 22,
      colors: { on: T.ink, warm: T.orange, off: 'var(--surface-2)' },
      onCellClick: 'data-st-cell',
    }, opts);
    let html = '<div></div>';
    for (let h = 0; h < 24; h++) {
      html += `<div style="text-align:center;color:${T.g500};font-size:9px;padding:2px 0;">${String(h).padStart(2, '0')}</div>`;
    }
    o.days.forEach((d, di) => {
      html += `<div style="display:flex;align-items:center;justify-content:flex-end;color:${T.g600};padding-right:6px;font-weight:500;">${d}</div>`;
      for (let h = 0; h < 24; h++) {
        const key = di + '-' + h;
        const mode = state[key] || 'off';
        const color = o.colors[mode] || o.colors.off;
        html += `<div ${o.onCellClick}="${key}" style="background:${color};height:${o.cellHeight}px;cursor:pointer;border:1px solid var(--paper);transition:background 80ms ease;"></div>`;
      }
    });
    return html;
  }

  /* ═══════════════════════════════════════════════════════════════
     7 · leaderboard(rows, opts)
     ─────────────────────────────────────────────────────────────── */
  function leaderboard(rows, opts = {}) {
    const o = Object.assign({ w: 220, h: 80, valueFormat: (v) => '$' + v, animate: true }, opts);
    const id = uid();
    const max = Math.max(...rows.map((r) => r[1]));
    let svg = rows.map((r, i) => {
      const color = r[2] || T.ink;
      const w = (r[1] / max) * 100;
      const y = 17 + i * 14;
      const animAttr = o.animate
        ? `class="zc-bar-anim-h" style="--zc-bar-w:${w}px;" width="0"`
        : `width="${w}"`;
      return `
        <text x="14" y="${y}" font-family="${T.mono}" font-size="7.5" fill="${T.ink}" font-weight="600">${i + 1}. ${escape(r[0])}</text>
        <rect ${animAttr} x="90" y="${y - 5}" height="6" fill="${color}" opacity="0.85"/>
        <text x="200" y="${y}" text-anchor="end" font-family="${T.mono}" font-size="6.5" fill="${T.g500}">${escape(o.valueFormat(r[1]))}</text>`;
    }).join('');
    return wrap(svg, o, id);
  }

  /* ═══════════════════════════════════════════════════════════════
     8 · radar(values, opts)
     ─────────────────────────────────────────────────────────────── */
  function radar(values, opts = {}) {
    const o = Object.assign({
      w: 220, h: 80, cx: 110, cy: 40, r: 28,
      fill: T.orange, axisColor: T.g400, animate: true,
    }, opts);
    const id = uid();
    const n = values.length;
    let svg = '';
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i / n) - Math.PI / 2;
      svg += `<line x1="${o.cx}" y1="${o.cy}" x2="${o.cx + Math.cos(a) * o.r}" y2="${o.cy + Math.sin(a) * o.r}" stroke="${o.axisColor}" stroke-width="0.4"/>`;
    }
    const pts = values.map((v, i) => {
      const a = (Math.PI * 2 * i / n) - Math.PI / 2;
      return [o.cx + Math.cos(a) * o.r * v, o.cy + Math.sin(a) * o.r * v];
    });
    svg += `<polygon points="${pts.map((p) => p.join(',')).join(' ')}" fill="${o.fill}" opacity="0.25" stroke="${o.fill}" stroke-width="1.25" class="${o.animate ? 'zc-fade-in' : ''}"/>`;
    return wrap(svg, o, id);
  }

  /* ═══════════════════════════════════════════════════════════════
     9 · timeline(milestones, activeIdx, opts)
     ─────────────────────────────────────────────────────────────── */
  function timeline(milestones, activeIdx = -1, opts = {}) {
    const o = Object.assign({
      w: 220, h: 80, y: 50, padL: 14, padR: 14,
      axis: T.g500, dot: T.ink, active: T.orange,
    }, opts);
    const id = uid();
    let svg = `<line x1="${o.padL}" y1="${o.y}" x2="${o.w - o.padR}" y2="${o.y}" stroke="${o.axis}" stroke-width="0.6"/>`;
    const ms = milestones.length;
    milestones.forEach((m, i) => {
      const x = o.padL + (i / (ms - 1 || 1)) * (o.w - o.padL - o.padR);
      const r = i === activeIdx ? 5 : 3;
      const fill = i === activeIdx ? o.active : o.dot;
      svg += `<circle cx="${x}" cy="${o.y}" r="${r}" fill="${fill}" class="${i === activeIdx ? 'zc-fade-in' : ''}"/>`;
      if (typeof m === 'string') {
        svg += `<text x="${x}" y="${o.y + 16}" text-anchor="middle" font-family="${T.mono}" font-size="6.5" fill="${T.g500}">${escape(m)}</text>`;
      }
    });
    return wrap(svg, o, id);
  }

  /* ═══════════════════════════════════════════════════════════════
     10 · worldMap(dots, opts)
     ─────────────────────────────────────────────────────────────── */
  function worldMap(dots = [], opts = {}) {
    const o = Object.assign({
      w: 600, h: 220,
      continentFill: 'var(--surface-2)',
      continentStroke: T.g400,
      arrow: null,
    }, opts);
    const id = uid();
    let svg = `<rect x="0" y="0" width="${o.w}" height="${o.h}" fill="${T.paper}"/>`;
    svg += `<path d="M 20 70 Q 80 50 160 60 Q 230 50 280 80 Q 240 110 180 120 Q 100 130 40 110 Z" fill="${o.continentFill}" stroke="${o.continentStroke}" stroke-width="0.4" opacity="0.6"/>`;
    svg += `<path d="M 270 70 Q 330 60 400 80 Q 460 70 530 100 Q 510 130 440 130 Q 360 140 290 110 Z" fill="${o.continentFill}" stroke="${o.continentStroke}" stroke-width="0.4" opacity="0.6"/>`;
    svg += `<path d="M 200 140 Q 240 150 240 180 Q 200 195 180 175 Z" fill="${o.continentFill}" stroke="${o.continentStroke}" stroke-width="0.4" opacity="0.6"/>`;
    svg += `<path d="M 510 160 Q 560 170 555 200 Q 510 200 490 185 Z" fill="${o.continentFill}" stroke="${o.continentStroke}" stroke-width="0.4" opacity="0.6"/>`;
    if (o.arrow) {
      const a = o.arrow;
      svg += `<line x1="${a.from[0]}" y1="${a.from[1]}" x2="${a.to[0]}" y2="${a.to[1]}" stroke="${a.color || T.green}" stroke-width="1.5" stroke-dasharray="3 4"/>`;
      if (a.label) {
        const mx = (a.from[0] + a.to[0]) / 2;
        const my = (a.from[1] + a.to[1]) / 2 - 6;
        svg += `<text x="${mx}" y="${my}" text-anchor="middle" font-family="${T.mono}" font-size="10" fill="${a.color || T.green}" font-weight="600">${escape(a.label)}</text>`;
      }
    }
    dots.forEach((d, i) => {
      const color = d.color || T.ink;
      const r = d.r || 4;
      const ring = d.ring != null ? d.ring : Math.min(20, r * 2);
      svg += `<circle cx="${d.x}" cy="${d.y}" r="${ring}" fill="${color}" opacity="0.15"/>`;
      svg += `<circle data-zc-map-dot="${i}" data-zc-label="${escape(d.label || '')}" data-zc-value="${escape(d.sub || '')}"
                cx="${d.x}" cy="${d.y}" r="${r}" fill="${color}" style="cursor:pointer;transition:r 160ms ease;"/>`;
      if (d.label) {
        svg += `<text x="${d.x}" y="${d.y - r - 6}" text-anchor="middle" font-family="${T.mono}" font-size="10" fill="${color}" font-weight="600">${escape(d.label)}</text>`;
      }
      if (d.sub) {
        svg += `<text x="${d.x}" y="${d.y + r + 12}" text-anchor="middle" font-family="${T.mono}" font-size="8.5" fill="${T.g500}">${escape(d.sub)}</text>`;
      }
    });
    return wrap(svg, o, id);
  }

  /* ═══════════════════════════════════════════════════════════════
     11 · legend(items)
     ─────────────────────────────────────────────────────────────── */
  function legend(items) {
    return `<div style="display:flex;align-items:center;gap:14px;font-family:${T.mono};font-size:11px;color:${T.g600};flex-wrap:wrap;">${
      items.map((it) => {
        const k = it.kind || 'square';
        const c = it.color || T.ink;
        let swatch = '';
        if (k === 'dot') swatch = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${c};"></span>`;
        else if (k === 'dash') swatch = `<span style="display:inline-block;width:14px;height:0;border-top:1.5px dashed ${c};"></span>`;
        else swatch = `<span style="display:inline-block;width:10px;height:10px;background:${c};"></span>`;
        return `<span style="display:inline-flex;align-items:center;gap:6px;">${swatch}${escape(it.label)}</span>`;
      }).join('')
    }</div>`;
  }

  /* ── internal wrapper · adds chart container with data-zc-chart ─ */
  function wrap(inner, o, id) {
    return `<svg viewBox="0 0 ${o.w} ${o.h}" preserveAspectRatio="xMidYMid meet"
                 style="width:100%;height:auto;display:block;overflow:visible;"
                 data-zc-chart="${id}" class="zc-chart">${inner}</svg>`;
  }

  /* ═══════════════════════════════════════════════════════════════
     ACTIVATE — wire up hover, tooltips, animations
     Call ZopCharts.activate(scope) after rendering charts.
     ─────────────────────────────────────────────────────────────── */
  let tooltipEl = null;
  function ensureTooltip() {
    if (tooltipEl) return tooltipEl;
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'zc-tooltip';
    tooltipEl.setAttribute('role', 'tooltip');
    document.body.appendChild(tooltipEl);
    return tooltipEl;
  }
  function positionTooltip(e) {
    if (!tooltipEl || !tooltipEl.classList.contains('visible')) return;
    const r = tooltipEl.getBoundingClientRect();
    let x = e.clientX + 12, y = e.clientY + 14;
    if (x + r.width > window.innerWidth - 8) x = e.clientX - r.width - 12;
    if (y + r.height > window.innerHeight - 8) y = e.clientY - r.height - 14;
    tooltipEl.style.transform = `translate(${x}px, ${y}px)`;
  }
  function showTooltip(html) {
    ensureTooltip();
    tooltipEl.innerHTML = html;
    tooltipEl.classList.add('visible');
  }
  function hideTooltip() {
    if (tooltipEl) tooltipEl.classList.remove('visible');
  }

  function activate(scope) {
    scope = scope || document;
    document.addEventListener('mousemove', positionTooltip, { passive: true });

    // Donut: run its animation by setting dashoffset to target on mount
    scope.querySelectorAll('.zc-donut-anim').forEach((c) => {
      requestAnimationFrame(() => {
        c.style.strokeDashoffset = c.getAttribute('data-zc-donut-target') || 0;
      });
    });

    // Line: animate stroke dash-draw on mount
    scope.querySelectorAll('.zc-line-anim').forEach((p) => {
      try {
        const len = p.getTotalLength();
        p.style.strokeDasharray = String(len);
        p.style.strokeDashoffset = String(len);
        p.getBoundingClientRect(); // force reflow
        p.style.transition = 'stroke-dashoffset 800ms cubic-bezier(0.22,1,0.36,1)';
        requestAnimationFrame(() => { p.style.strokeDashoffset = '0'; });
      } catch (e) { /* SVG path may be detached */ }
    });

    // Bar: animate to target height
    scope.querySelectorAll('.zc-bar-anim-v').forEach((r) => {
      const targetH = parseFloat(getComputedStyle(r).getPropertyValue('--zc-bar-h')) || 0;
      const targetY = parseFloat(getComputedStyle(r).getPropertyValue('--zc-bar-y')) || 0;
      r.style.transition = 'height 600ms cubic-bezier(0.22,1,0.36,1), y 600ms cubic-bezier(0.22,1,0.36,1)';
      requestAnimationFrame(() => {
        r.setAttribute('height', targetH);
        r.setAttribute('y', targetY);
      });
    });
    scope.querySelectorAll('.zc-bar-anim-h').forEach((r) => {
      const targetW = parseFloat(getComputedStyle(r).getPropertyValue('--zc-bar-w')) || 0;
      r.style.transition = 'width 600ms cubic-bezier(0.22,1,0.36,1)';
      requestAnimationFrame(() => { r.setAttribute('width', targetW); });
    });

    // Line chart hit zones — crosshair + tooltip
    scope.querySelectorAll('svg.zc-chart').forEach((svg) => {
      const hits = svg.querySelectorAll('[data-zc-hit]');
      const cross = svg.querySelector('[data-zc-crosshair]');
      const dots = svg.querySelectorAll('[data-zc-hover-dot]');
      hits.forEach((hit) => {
        hit.addEventListener('mouseenter', (e) => {
          const x = parseFloat(hit.getAttribute('data-zc-x'));
          const y = parseFloat(hit.getAttribute('data-zc-y') || '0');
          if (cross) {
            cross.setAttribute('x1', x); cross.setAttribute('x2', x);
            cross.style.opacity = '0.5';
          }
          dots.forEach((d) => {
            d.setAttribute('cx', x); d.setAttribute('cy', y); d.style.opacity = '1';
          });
          const label = hit.getAttribute('data-zc-label') || '';
          let seriesPayload = [];
          try { seriesPayload = JSON.parse(hit.getAttribute('data-zc-series').replace(/&#39;/g, "'")); } catch (e) {}
          const rows = seriesPayload.map((s) => `<span class="zc-tt-row"><span class="zc-tt-dot" style="background:${s.color};"></span><span>${escape(s.name)}</span><strong>${escape(s.value)}</strong></span>`).join('');
          showTooltip(`<div class="zc-tt-label">${escape(label)}</div>${rows}`);
        });
        hit.addEventListener('mousemove', positionTooltip);
        hit.addEventListener('mouseleave', () => {
          if (cross) cross.style.opacity = '0';
          dots.forEach((d) => { d.style.opacity = '0'; });
          hideTooltip();
        });
      });

      // Bar hover
      svg.querySelectorAll('[data-zc-bar]').forEach((bar) => {
        bar.addEventListener('mouseenter', (e) => {
          bar.setAttribute('opacity', '1');
          const label = bar.getAttribute('data-zc-label') || '';
          const value = bar.getAttribute('data-zc-value') || '';
          const color = bar.getAttribute('data-zc-color') || T.ink;
          showTooltip(`<div class="zc-tt-label">${escape(label)}</div><span class="zc-tt-row"><span class="zc-tt-dot" style="background:${color};"></span><strong>${escape(value)}</strong></span>`);
        });
        bar.addEventListener('mousemove', positionTooltip);
        bar.addEventListener('mouseleave', () => {
          bar.setAttribute('opacity', '0.85');
          hideTooltip();
        });
      });

      // Map dots
      svg.querySelectorAll('[data-zc-map-dot]').forEach((dot) => {
        const baseR = parseFloat(dot.getAttribute('r'));
        dot.addEventListener('mouseenter', (e) => {
          dot.setAttribute('r', baseR + 2);
          const label = dot.getAttribute('data-zc-label') || '';
          const value = dot.getAttribute('data-zc-value') || '';
          showTooltip(`<div class="zc-tt-label">${escape(label)}</div>${value ? `<span class="zc-tt-row"><strong>${escape(value)}</strong></span>` : ''}`);
        });
        dot.addEventListener('mousemove', positionTooltip);
        dot.addEventListener('mouseleave', () => {
          dot.setAttribute('r', baseR);
          hideTooltip();
        });
      });
    });
  }

  /* ── export ─────────────────────────────────────────────────── */
  global.ZopCharts = {
    lineChart, sparkline, barChart, areaChart, donut,
    heatmap, leaderboard, radar, timeline, worldMap, legend,
    activate,
    _t: T, _map: map, _path: path,
  };

  // Auto-activate on DOMContentLoaded for charts present at page load
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => activate());
    } else {
      // already loaded — defer once so we don't collide with body parse
      setTimeout(() => activate(), 0);
    }
  }
}(typeof window !== 'undefined' ? window : globalThis));
