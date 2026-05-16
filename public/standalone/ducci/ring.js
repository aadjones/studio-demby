/**
 * ring.js — shared Ducci ring renderer
 *
 * Static usage (auto-initialized on DOMContentLoaded):
 *
 *   <div class="ring-solo"     data-ring="6,2,1,5"></div>
 *   <div class="ring-sequence" data-rings="4,1,4,1 | 3,3,3,3 | 0,0,0,0" data-ellipsis></div>
 *
 * data-size="N" overrides the default px size for a ring or sequence.
 *
 * Programmatic usage (e.g. from widgets):
 *   const svg = DucciRing.makeSVG(['6','2','1','5'], { sizePx: 160 });
 *   container.appendChild(svg);
 */

(function (root) {
  'use strict';

  const NS  = 'http://www.w3.org/2000/svg';
  const VB  = 100;   // SVG viewBox dimension
  const CX  = 50, CY = 50, R = 35;
  const CW  = 28, CH = 28, CRX = 4;  // cell width, height, corner radius

  // Defaults — overridden at init time by CSS custom properties if present.
  const PALETTE = {
    ring:   '#3a3050',
    fill:   '#0f0c1a',
    stroke: '#5a4878',
    text:   '#d0c8e8',
  };

  function cssVar(name, fallback) {
    var val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return val || fallback;
  }

  function themepalette() {
    return {
      ring:   cssVar('--ring-arc',    PALETTE.ring),
      fill:   cssVar('--ring-fill',   PALETTE.fill),
      stroke: cssVar('--ring-stroke', PALETTE.stroke),
      text:   cssVar('--ring-text',   PALETTE.text),
    };
  }

  /** Position of cell i in an n-cell ring (SVG coords, viewBox 100x100). */
  function nodePos(i, n) {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    return {
      x: CX + R * Math.cos(angle),
      y: CY + R * Math.sin(angle),
    };
  }

  /**
   * Choose a font size that fits all labels in the ring uniformly.
   * Single-digit: 13, two-char: 10, three+: 8.
   */
  function ringFontSize(values) {
    const maxLen = Math.max(...values.map(v => String(v).length));
    if (maxLen >= 3) return 8;
    if (maxLen >= 2) return 10;
    return 13;
  }

  function svgEl(tag, attrs) {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
  }

  /**
   * Build an SVG ring element.
   * @param {string[]} values  - cell labels (strings or numbers)
   * @param {object}   opts
   *   sizePx  {number}  rendered px size (default 82)
   *   palette {object}  override any PALETTE keys
   */
  function makeSVG(values, opts) {
    opts = opts || {};
    const sizePx  = opts.sizePx  || 82;
    const pal     = Object.assign({}, PALETTE, opts.palette || {});
    const n       = values.length;
    const fs      = ringFontSize(values);

    const svg = svgEl('svg', {
      width: sizePx, height: sizePx,
      viewBox: '0 0 ' + VB + ' ' + VB,
      class: 'ring',
    });

    // Ring arc
    svg.appendChild(svgEl('circle', {
      cx: CX, cy: CY, r: R,
      fill: 'none',
      stroke: pal.ring,
      'stroke-width': '1.2',
      opacity: '0.6',
    }));

    // Cells
    for (let i = 0; i < n; i++) {
      const pos = nodePos(i, n);

      svg.appendChild(svgEl('rect', {
        x: pos.x - CW / 2, y: pos.y - CH / 2,
        width: CW, height: CH, rx: CRX,
        fill: pal.fill,
        stroke: pal.stroke,
        'stroke-width': '1.5',
      }));

      const text = svgEl('text', {
        x: pos.x, y: pos.y,
        'text-anchor': 'middle',
        'dominant-baseline': 'central',
        fill: pal.text,
        'font-family': 'JetBrains Mono, monospace',
        'font-size': fs,
      });
      text.textContent = String(values[i]);
      svg.appendChild(text);
    }

    return svg;
  }

  // -- Auto-initialization --------------------------------------------------

  function parseValues(str) {
    return str.split(',').map(function(s) { return s.trim(); });
  }

  function makeArrow(label) {
    const span = document.createElement('span');
    span.className = 'seq-arrow';
    span.textContent = label;
    return span;
  }

  function clearAndAppend(el, children) {
    while (el.firstChild) el.removeChild(el.firstChild);
    children.forEach(function(child) { el.appendChild(child); });
  }

  function initSoloRings() {
    var pal = themepalette();
    document.querySelectorAll('[data-ring]').forEach(function(el) {
      const values = parseValues(el.getAttribute('data-ring'));
      const sizePx = parseInt(el.getAttribute('data-size') || '110', 10);
      clearAndAppend(el, [makeSVG(values, { sizePx: sizePx, palette: pal })]);
    });
  }

  function initSequences() {
    var pal = themepalette();
    document.querySelectorAll('[data-rings]').forEach(function(el) {
      const rings    = el.getAttribute('data-rings').split('|').map(function(r) {
        return parseValues(r);
      });
      const sizePx   = parseInt(el.getAttribute('data-size') || '82', 10);
      const ellipsis = el.hasAttribute('data-ellipsis');

      const children = [];
      rings.forEach(function(values, i) {
        if (i > 0) children.push(makeArrow('→'));
        children.push(makeSVG(values, { sizePx: sizePx, palette: pal }));
      });
      if (ellipsis) children.push(makeArrow('→ …'));

      clearAndAppend(el, children);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initSoloRings();
    initSequences();
  });

  // -- Public API (for widgets) ---------------------------------------------

  root.DucciRing = { makeSVG: makeSVG, nodePos: nodePos, PALETTE: PALETTE };

}(window));
