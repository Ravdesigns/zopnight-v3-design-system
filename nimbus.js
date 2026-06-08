/* ═════════════════════════════════════════════════════════════════
 * NIMBUS v4 · the ZopNight mascot
 *
 * USAGE
 *   <div data-nimbus="wave"></div>        // any pose
 *   Nimbus.mount(el, { pose: 'idle' });   // explicit mount
 *
 *   Poses: idle · wave · search · sleep · cheer · build · win · peek
 *   Each pose ships its own accessories + animation rhythm.
 *
 * BEHAVIOURS
 *   - Eyes track the mouse cursor (with friction)
 *   - Body breathes (1.5px Y bob, 4.2s)
 *   - Eyes blink on a natural irregular cadence (~7s avg)
 *   - prefers-reduced-motion halts cursor tracking + breath + blink
 *   - Easter-egg moments fire randomly 1-in-100 per render
 *
 * ZERO DEPS · pure SVG + CSS + a tiny script.
 * ═════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  const PIXEL = 'shape-rendering="crispEdges"';
  // Base cloud body — used by every pose, never changes.
  const BODY = `
    <rect x="12" y="0"  width="20" height="4"  fill="#FCFAF2"/>
    <rect x="40" y="0"  width="8"  height="4"  fill="#FCFAF2"/>
    <rect x="8"  y="4"  width="40" height="4"  fill="#FCFAF2"/>
    <rect x="4"  y="8"  width="48" height="4"  fill="#FCFAF2"/>
    <rect x="0"  y="12" width="56" height="4"  fill="#FCFAF2"/>
    <rect x="0"  y="16" width="56" height="4"  fill="#FCFAF2"/>
    <rect x="0"  y="20" width="52" height="4"  fill="#FCFAF2"/>
    <rect x="4"  y="24" width="44" height="4"  fill="#FCFAF2"/>
  `;
  // Eyes — drawn dynamically so they can track the cursor (anchor points used by JS)
  // Default position: left eye at (16,14) · right eye at (36,14) · 4x6 ink + 2x2 cream pupil
  function eyes(pupilOffsetX, pupilOffsetY, closed) {
    if (closed) {
      return `<rect x="14" y="17" width="6" height="2" fill="#0A0A0A"/>
              <rect x="34" y="17" width="6" height="2" fill="#0A0A0A"/>`;
    }
    const px = Math.max(-1, Math.min(1, pupilOffsetX));
    const py = Math.max(-1, Math.min(1, pupilOffsetY));
    // Eye whites (ink) at 16,14 and 36,14
    return `
      <rect x="16" y="14" width="4" height="6" fill="#0A0A0A"/>
      <rect x="36" y="14" width="4" height="6" fill="#0A0A0A"/>
      <rect x="${16 + 1 + px}" y="${14 + 2 + py}" width="2" height="2" fill="#FFFCEF"/>
      <rect x="${36 + 1 + px}" y="${14 + 2 + py}" width="2" height="2" fill="#FFFCEF"/>
    `;
  }
  // Happy curved eyes (^_^) — no pupil, no tracking
  const EYES_HAPPY = `
    <rect x="14" y="18" width="2" height="2" fill="#0A0A0A"/>
    <rect x="16" y="16" width="2" height="2" fill="#0A0A0A"/>
    <rect x="18" y="18" width="2" height="2" fill="#0A0A0A"/>
    <rect x="36" y="18" width="2" height="2" fill="#0A0A0A"/>
    <rect x="38" y="16" width="2" height="2" fill="#0A0A0A"/>
    <rect x="40" y="18" width="2" height="2" fill="#0A0A0A"/>
  `;
  // Wink — left open, right closed
  const EYES_WINK = `
    <rect x="16" y="14" width="4" height="6" fill="#0A0A0A"/>
    <rect x="17" y="16" width="2" height="2" fill="#FFFCEF"/>
    <rect x="34" y="18" width="6" height="2" fill="#0A0A0A"/>
  `;
  // Mouth variants
  const MOUTHS = {
    flat:   '<rect x="22" y="24" width="12" height="2" fill="#0A0A0A"/>',
    small:  '<rect x="26" y="24" width="4"  height="2" fill="#0A0A0A"/>',
    smile:  '<rect x="22" y="23" width="12" height="2" fill="#0A0A0A"/><rect x="22" y="25" width="12" height="2" fill="#0A0A0A"/>',
    o:      '<rect x="24" y="23" width="8" height="2" fill="#0A0A0A"/><rect x="22" y="24" width="2" height="2" fill="#0A0A0A"/><rect x="32" y="24" width="2" height="2" fill="#0A0A0A"/><rect x="24" y="25" width="8" height="2" fill="#0A0A0A"/>',
  };
  // Optional blush
  const BLUSH = `
    <rect x="10" y="22" width="2" height="2" fill="#F58549" opacity="0.55"/>
    <rect x="44" y="22" width="2" height="2" fill="#F58549" opacity="0.55"/>
  `;
  // Sparkles (for cheer)
  const SPARKLES = `
    <g fill="#F58549">
      <rect x="-8"  y="6"  width="2" height="2"/><rect x="-10" y="8"  width="2" height="2"/><rect x="-6"  y="8"  width="2" height="2"/><rect x="-8"  y="10" width="2" height="2"/>
      <rect x="58"  y="2"  width="2" height="2"/><rect x="56"  y="4"  width="2" height="2"/><rect x="60"  y="4"  width="2" height="2"/><rect x="58"  y="6"  width="2" height="2"/>
      <rect x="60"  y="26" width="2" height="2"/><rect x="58"  y="28" width="2" height="2"/><rect x="62"  y="28" width="2" height="2"/><rect x="60"  y="30" width="2" height="2"/>
    </g>
  `;
  // Wave arm · shoulder → forearm → palm with finger bumps.
  // Lowered 4px so the hand doesn't shoot off the top — sits roughly at
  // shoulder height when raised.
  const ARM_WAVE = `
    <g class="n-arm">
      <!-- Shoulder (tucked into body) -->
      <rect x="46" y="14" width="4" height="4" fill="#FCFAF2"/>
      <!-- Upper arm -->
      <rect x="50" y="10" width="4" height="4" fill="#FCFAF2"/>
      <!-- Forearm angling up -->
      <rect x="54" y="6"  width="4" height="4" fill="#FCFAF2"/>
      <!-- Wrist -->
      <rect x="58" y="2"  width="4" height="4" fill="#FCFAF2"/>
      <!-- Palm -->
      <rect x="56" y="-4" width="8" height="6" fill="#FCFAF2"/>
      <!-- Thumb (left side of palm) -->
      <rect x="54" y="-2" width="2" height="3" fill="#FCFAF2"/>
      <!-- Three little finger bumps along the top of the palm -->
      <rect x="56" y="-6" width="2" height="2" fill="#FCFAF2"/>
      <rect x="59" y="-7" width="2" height="3" fill="#FCFAF2"/>
      <rect x="62" y="-6" width="2" height="2" fill="#FCFAF2"/>
      <!-- Motion lines (waving · stay at hand level) -->
      <rect x="68" y="-4" width="6" height="2" fill="#F58549"/>
      <rect x="70" y="0"  width="6" height="2" fill="#F58549"/>
      <rect x="68" y="4"  width="6" height="2" fill="#F58549"/>
    </g>
  `;

  // Legs · slim 2-wide leg + 4-wide ink foot pointing outward.
  // Cleaner silhouette than the previous chunky version.
  const LEGS_STILL = `
    <g class="n-legs n-legs-still">
      <!-- Left leg -->
      <rect x="16" y="28" width="2" height="4" fill="#FCFAF2"/>
      <rect x="14" y="32" width="4" height="2" fill="#0A0A0A"/>
      <!-- Right leg -->
      <rect x="38" y="28" width="2" height="4" fill="#FCFAF2"/>
      <rect x="38" y="32" width="4" height="2" fill="#0A0A0A"/>
    </g>
  `;

  // Walking legs · same slim shape · animated alternately
  const LEGS_WALK = `
    <g class="n-legs n-legs-walk">
      <g class="n-leg-left">
        <rect x="16" y="28" width="2" height="4" fill="#FCFAF2"/>
        <rect x="14" y="32" width="4" height="2" fill="#0A0A0A"/>
      </g>
      <g class="n-leg-right">
        <rect x="38" y="28" width="2" height="4" fill="#FCFAF2"/>
        <rect x="38" y="32" width="4" height="2" fill="#0A0A0A"/>
      </g>
    </g>
  `;

  // Mitten hands at the side · slightly tucked, peek out from cloud body
  const HANDS_AT_SIDE = `
    <g class="n-hands">
      <!-- Left hand · little mitten peeks out from body's left edge -->
      <rect x="-2" y="22" width="4" height="3" fill="#FCFAF2"/>
      <rect x="-4" y="22" width="2" height="2" fill="#FCFAF2"/>
      <!-- Right hand · mitten peeks from body's right edge -->
      <rect x="54" y="22" width="4" height="3" fill="#FCFAF2"/>
      <rect x="58" y="22" width="2" height="2" fill="#FCFAF2"/>
    </g>
  `;
  // Magnifying glass (for search)
  const MAG = `
    <rect x="58" y="10" width="2" height="6" fill="#0A0A0A"/>
    <rect x="66" y="10" width="2" height="6" fill="#0A0A0A"/>
    <rect x="60" y="8"  width="6" height="2" fill="#0A0A0A"/>
    <rect x="60" y="16" width="6" height="2" fill="#0A0A0A"/>
    <rect x="62" y="10" width="2" height="2" fill="#7FB236" opacity="0.85"/>
    <rect x="64" y="10" width="2" height="2" fill="#7FB236" opacity="0.85"/>
    <rect x="66" y="18" width="2" height="2" fill="#0A0A0A"/>
    <rect x="68" y="20" width="2" height="2" fill="#0A0A0A"/>
    <rect x="70" y="22" width="2" height="2" fill="#0A0A0A"/>
  `;
  // Zs (for sleep — animates via CSS class)
  const ZS = `
    <g class="n-z1" fill="#2A4494">
      <rect x="48" y="-14" width="6" height="2"/>
      <rect x="52" y="-12" width="2" height="2"/>
      <rect x="50" y="-10" width="2" height="2"/>
      <rect x="48" y="-8"  width="2" height="2"/>
      <rect x="48" y="-6"  width="6" height="2"/>
    </g>
    <g class="n-z2" fill="#2A4494" opacity="0.65">
      <rect x="58" y="-4" width="4" height="2"/>
      <rect x="60" y="-2" width="2" height="2"/>
      <rect x="58" y="0"  width="2" height="2"/>
      <rect x="58" y="2"  width="4" height="2"/>
    </g>
  `;
  // Wrench (for build)
  const WRENCH = `
    <g fill="#525252">
      <rect x="56" y="12" width="2" height="8"/>
      <rect x="58" y="14" width="2" height="4"/>
      <rect x="60" y="12" width="2" height="2"/>
      <rect x="60" y="18" width="2" height="2"/>
      <rect x="62" y="10" width="2" height="2"/>
      <rect x="62" y="20" width="2" height="2"/>
      <rect x="64" y="10" width="4" height="2"/>
      <rect x="64" y="20" width="4" height="2"/>
      <rect x="68" y="12" width="2" height="8"/>
    </g>
  `;
  // Trophy (for win)
  const TROPHY = `
    <g fill="#F58549">
      <rect x="58" y="0"  width="10" height="2"/>
      <rect x="58" y="2"  width="2" height="6"/>
      <rect x="66" y="2"  width="2" height="6"/>
      <rect x="60" y="8"  width="6" height="2"/>
      <rect x="62" y="10" width="2" height="2"/>
      <rect x="58" y="12" width="10" height="2"/>
    </g>
  `;
  // Coin · circular orange disc with darker inner rim · reads as "money"
  // without needing a specific currency glyph.
  const COIN = `
    <g class="n-coin">
      <!-- Outer disc · orange -->
      <rect x="60" y="-6" width="6" height="2"  fill="#F58549"/>
      <rect x="58" y="-4" width="10" height="2" fill="#F58549"/>
      <rect x="56" y="-2" width="14" height="2" fill="#F58549"/>
      <rect x="56" y="0"  width="14" height="2" fill="#F58549"/>
      <rect x="58" y="2"  width="10" height="2" fill="#F58549"/>
      <rect x="60" y="4"  width="6" height="2"  fill="#F58549"/>
      <!-- Inner darker rim · gives it depth -->
      <rect x="60" y="-4" width="6" height="1"  fill="#C75A2C"/>
      <rect x="58" y="-2" width="2" height="3"  fill="#C75A2C"/>
      <rect x="66" y="-2" width="2" height="3"  fill="#C75A2C"/>
      <rect x="60" y="3"  width="6" height="1"  fill="#C75A2C"/>
      <!-- Highlight (top-left, cream) for that struck-coin glint -->
      <rect x="62" y="-4" width="2" height="1"  fill="#FFFCEF"/>
      <rect x="60" y="-2" width="2" height="1"  fill="#FFFCEF"/>
    </g>
  `;

  /* ── pose registry ──────────────────────────────────────────── */
  const POSES = {
    idle:   { viewBox: '-6 -2 68 38',   mouth: 'flat',  trackEyes: true,  bobMs: 4200, accessory: HANDS_AT_SIDE + LEGS_STILL },
    wave:   { viewBox: '-6 -12 88 50',  mouth: 'smile', trackEyes: true,  bobMs: 2800, accessory: ARM_WAVE + LEGS_STILL },
    search: { viewBox: '-6 -2 86 38',   mouth: 'flat',  trackEyes: true,  bobMs: 3600, accessory: MAG + HANDS_AT_SIDE + LEGS_STILL, eyesRight: true },
    sleep:  { viewBox: '-6 -16 88 54',  mouth: 'small', closed: true,     bobMs: 4400, accessory: ZS + HANDS_AT_SIDE + LEGS_STILL },
    cheer:  { viewBox: '-16 -8 88 50',  happy: true,    blush: true, mouth: 'smile', bobMs: 2400, accessory: SPARKLES + HANDS_AT_SIDE + LEGS_STILL },
    build:  { viewBox: '-6 -2 84 38',   mouth: 'flat',  trackEyes: true,  bobMs: 3800, accessory: WRENCH + HANDS_AT_SIDE + LEGS_STILL },
    win:    { viewBox: '-6 -10 84 48',  happy: true,    blush: true, mouth: 'o', bobMs: 2600, accessory: TROPHY + HANDS_AT_SIDE + LEGS_STILL },
    money:  { viewBox: '-6 -10 84 48',  happy: true,    blush: true, mouth: 'smile', bobMs: 2400, accessory: COIN + HANDS_AT_SIDE + LEGS_STILL },
    wink:   { viewBox: '-6 -2 68 38',   wink: true,     mouth: 'smile', bobMs: 3200, accessory: HANDS_AT_SIDE + LEGS_STILL },
    walk:   { viewBox: '-6 -2 68 40',   mouth: 'smile', trackEyes: true, bobMs: 1600, accessory: HANDS_AT_SIDE + LEGS_WALK },
    peek:   { viewBox: '-34 -2 98 38',  mouth: 'small', trackEyes: true, bobMs: 4000, accessory: HANDS_AT_SIDE + LEGS_STILL, peek: true },
  };

  // Easter eggs · rare pose swaps
  const EASTER_EGGS = ['wink', 'money'];

  /* ── instances ──────────────────────────────────────────────── */
  const instances = new Set();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cursorX = 0, cursorY = 0;
  if (!reduced) {
    document.addEventListener('mousemove', (e) => { cursorX = e.clientX; cursorY = e.clientY; });
  }

  function makeSVG(pose, eyesSVG) {
    const p = POSES[pose] || POSES.idle;
    let mouth = MOUTHS[p.mouth] || MOUTHS.flat;
    let eyesContent;
    if (p.closed)        eyesContent = eyes(0, 0, true);
    else if (p.happy)    eyesContent = EYES_HAPPY;
    else if (p.wink)     eyesContent = EYES_WINK;
    else                 eyesContent = eyesSVG;
    return `<svg viewBox="${p.viewBox}" ${PIXEL} aria-hidden="true" overflow="visible" style="overflow:visible;">
      <g class="n-body" style="transform-origin: 28px 16px;">
        ${BODY}
        ${eyesContent}
        ${mouth}
        ${p.blush ? BLUSH : ''}
      </g>
      ${p.accessory}
    </svg>`;
  }

  function mount(el, opts) {
    opts = opts || {};
    const pose = opts.pose || el.getAttribute('data-nimbus') || 'idle';
    const size = opts.size || el.getAttribute('data-nimbus-size') || '120';
    el.classList.add('nimbus-host');
    el.style.display = 'inline-block';
    el.style.width = size + 'px';
    el.innerHTML = makeSVG(pose, eyes(0, 0));
    instances.add({ el, pose, blinking: false, lastBlink: Date.now() + Math.random() * 4000 });
    if (!root._nimbusLoop) root._nimbusLoop = startLoop();
  }

  function startLoop() {
    let lastT = performance.now();
    function frame(t) {
      const dt = t - lastT; lastT = t;
      instances.forEach((inst) => {
        const p = POSES[inst.pose] || POSES.idle;
        let pupilX = 0, pupilY = 0;
        // Cursor tracking
        if (p.trackEyes && !reduced) {
          const rect = inst.el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = cursorX - cx, dy = cursorY - cy;
          const dist = Math.hypot(dx, dy);
          if (dist > 0) {
            pupilX = Math.round((dx / dist) * 1.2);
            pupilY = Math.round((dy / dist) * 0.8);
          }
        }
        if (p.eyesRight) pupilX = 1;
        // Blink
        const now = Date.now();
        if (!reduced && !p.happy && !p.wink && !p.closed && now - inst.lastBlink > (5000 + Math.random() * 4000)) {
          inst.blinking = true;
          inst.lastBlink = now;
          setTimeout(() => { inst.blinking = false; }, 110 + Math.random() * 40);
        }
        // Easter egg · rare random pose swap (~1 in 8000 frames at 60fps = ~2min)
        if (!reduced && Math.random() < 0.00012 && !inst.eggUntil) {
          const origPose = inst.pose;
          inst.pose = EASTER_EGGS[Math.floor(Math.random() * EASTER_EGGS.length)];
          inst.eggUntil = now + 1800;
          setTimeout(() => { inst.pose = origPose; inst.eggUntil = null; }, 1800);
        }
        // Render
        const eyesContent = inst.blinking ? eyes(0, 0, true) : eyes(pupilX, pupilY);
        const svg = makeSVG(inst.pose, eyesContent);
        // Only update DOM if content changed (cheap diff via cached attribute)
        if (inst._lastSvg !== svg) {
          inst.el.innerHTML = svg;
          inst._lastSvg = svg;
        }
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return true;
  }

  // CSS keyframes are injected once so the breathing animation runs
  if (!document.getElementById('nimbus-style')) {
    const style = document.createElement('style');
    style.id = 'nimbus-style';
    style.textContent = `
      .nimbus-host svg { display: block; width: 100%; height: auto; }
      .nimbus-host svg .n-body { animation: nimbus-breath 4.2s ease-in-out infinite; transform-origin: 28px 16px; transform-box: fill-box; }
      .nimbus-host[data-pose="wave"] svg .n-body  { animation-duration: 2.8s; }
      .nimbus-host[data-pose="search"] svg .n-body{ animation-duration: 3.6s; }
      .nimbus-host[data-pose="sleep"] svg .n-body { animation-duration: 4.4s; }
      .nimbus-host[data-pose="cheer"] svg .n-body { animation-duration: 2.4s; }
      .nimbus-host svg .n-z1 { animation: nimbus-z1 2.8s ease-in-out infinite; }
      .nimbus-host svg .n-z2 { animation: nimbus-z2 2.8s ease-in-out infinite; animation-delay: 1.4s; }

      /* Waving arm · smooth pendulum from the shoulder.
         Sine-like easing reads as a real wave gesture. */
      .nimbus-host[data-pose="wave"] svg .n-arm {
        transform-origin: 48px 16px;
        transform-box: fill-box;
        animation: nimbus-wave 1.4s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        will-change: transform;
      }
      @keyframes nimbus-wave {
        0%   { transform: rotate(-12deg); }
        25%  { transform: rotate(0deg); }
        50%  { transform: rotate(12deg); }
        75%  { transform: rotate(0deg); }
        100% { transform: rotate(-12deg); }
      }

      /* Walking legs · shared keyframes, right offset half-cycle.
         Pivot at hip (y=28) so the foot swings naturally. */
      .nimbus-host[data-pose="walk"] svg .n-leg-left,
      .nimbus-host[data-pose="walk"] svg .n-leg-right {
        transform-box: fill-box;
        animation: nimbus-step 0.9s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        will-change: transform;
      }
      .nimbus-host[data-pose="walk"] svg .n-leg-left  { transform-origin: 16px 28px; }
      .nimbus-host[data-pose="walk"] svg .n-leg-right { transform-origin: 40px 28px; animation-delay: -0.45s; }
      @keyframes nimbus-step {
        0%   { transform: rotate(-15deg) translateY(0); }
        50%  { transform: rotate(15deg)  translateY(-2px); }
        100% { transform: rotate(-15deg) translateY(0); }
      }
      /* Walking body · gentle bounce synced with steps */
      .nimbus-host[data-pose="walk"] svg .n-body {
        animation: nimbus-walk-bob 0.9s cubic-bezier(0.45, 0, 0.55, 1) infinite;
      }
      @keyframes nimbus-walk-bob {
        0%, 100% { transform: translateY(0); }
        25%      { transform: translateY(-1.5px); }
        75%      { transform: translateY(-1.5px); }
      }

      @keyframes nimbus-breath { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1.5px); } }
      @keyframes nimbus-z1 { 0%, 100% { opacity: 0.5; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-2px); } }
      @keyframes nimbus-z2 { 0%, 100% { opacity: 0.3; transform: translateY(0); } 50% { opacity: 0.8; transform: translateY(-2px); } }
      @media (prefers-reduced-motion: reduce) {
        .nimbus-host svg .n-body,
        .nimbus-host svg .n-z1, .nimbus-host svg .n-z2,
        .nimbus-host svg .n-arm,
        .nimbus-host svg .n-leg-left,
        .nimbus-host svg .n-leg-right { animation: none !important; }
      }
    `;
    document.head.appendChild(style);
  }

  // Auto-mount on DOM ready
  function autoMount() {
    document.querySelectorAll('[data-nimbus]').forEach((el) => {
      if (!el._mounted) {
        mount(el);
        el.setAttribute('data-pose', el.getAttribute('data-nimbus'));
        el._mounted = true;
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoMount);
  } else {
    autoMount();
  }

  // Public API
  root.Nimbus = {
    mount,
    setPose: (el, pose) => {
      const inst = [...instances].find((i) => i.el === el);
      if (inst) inst.pose = pose;
      el.setAttribute('data-pose', pose);
    },
    poses: Object.keys(POSES),
  };
})(window);
