import { S, X } from './math.js';

export function fit(cv) {
  const dpr = window.devicePixelRatio || 1;
  const w = cv.clientWidth,
    h = cv.clientHeight;
  if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
  }
  const ctx = cv.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return [ctx, w, h];
}

export function clearPanel(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = '#252A35';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();
}

export function plot(ctx, w, h, y, color, lw = 2, range = 1.45, alpha = 1, dash = null) {
  ctx.save();
  ctx.globalAlpha = alpha;
  if (dash) ctx.setLineDash(dash);
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  for (let i = 0; i < S; i++) {
    const px = (i / (S - 1)) * w;
    const py = h / 2 - Math.max(-range, Math.min(range, y[i])) / range * (h / 2 - 10);
    i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
  }
  ctx.stroke();
  ctx.restore();
}

export function drawRod(cv, y, range = 1.4) {
  const [ctx, w, h] = fit(cv);
  ctx.clearRect(0, 0, w, h);
  const base = [36, 40, 51],
    hot = [255, 122, 69],
    hot2 = [255, 216, 150],
    cold = [84, 200, 236];
  const bw = w / S;
  for (let i = 0; i < S; i++) {
    const v = Math.max(-range, Math.min(range, y[i])) / range;
    let r, g, b;
    if (v >= 0) {
      if (v < 0.75) {
        const a = v / 0.75;
        r = base[0] + (hot[0] - base[0]) * a;
        g = base[1] + (hot[1] - base[1]) * a;
        b = base[2] + (hot[2] - base[2]) * a;
      } else {
        const a = (v - 0.75) / 0.25;
        r = hot[0] + (hot2[0] - hot[0]) * a;
        g = hot[1] + (hot2[1] - hot[1]) * a;
        b = hot[2] + (hot2[2] - hot[2]) * a;
      }
    } else {
      const a = -v;
      r = base[0] + (cold[0] - base[0]) * a;
      g = base[1] + (cold[1] - base[1]) * a;
      b = base[2] + (cold[2] - base[2]) * a;
    }
    ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
    ctx.fillRect(i * bw, 0, bw + 1, h);
  }
  ctx.fillStyle = '#2B303C';
  ctx.fillRect(0, 0, 3, h);
  ctx.fillRect(w - 3, 0, 3, h);
}

export function modeColor(n, a = 1) {
  return `hsla(${268 - (n - 1) * 22},72%,64%,${a})`;
}

export function makeDrawer(cv, onDone, onMove, setUserShape) {
  let drawing = false,
    ys = null;
  const pos = e => {
    const r = cv.getBoundingClientRect();
    return [
      Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
      Math.max(-1.4, Math.min(1.4, -((e.clientY - r.top) / r.height * 2 - 1) * 1.45)),
    ];
  };
  let lastI = null;
  cv.addEventListener('pointerdown', e => {
    if (!cv.dataset.drawmode) return;
    drawing = true;
    ys = new Float64Array(S).fill(NaN);
    lastI = null;
    try {
      cv.setPointerCapture(e.pointerId);
    } catch (_) {}
    add(e);
    e.preventDefault();
  });
  cv.addEventListener('pointermove', e => {
    if (drawing) {
      add(e);
      e.preventDefault();
    }
  });
  const finish = () => {
    if (!drawing) return;
    drawing = false;
    // fill gaps by interpolation, taper to 0 at edges
    let first = -1,
      last = -1;
    for (let i = 0; i < S; i++) {
      if (!isNaN(ys[i])) {
        if (first < 0) first = i;
        last = i;
      }
    }
    if (first < 0) return;
    for (let i = 0; i < first; i++) ys[i] = ys[first] * (i / Math.max(first, 1));
    for (let i = last + 1; i < S; i++) {
      ys[i] = ys[last] * ((S - 1 - i) / Math.max(S - 1 - last, 1));
    }
    let prev = first;
    for (let i = first + 1; i <= last; i++) {
      if (isNaN(ys[i])) continue;
      for (let j = prev + 1; j < i; j++) {
        ys[j] = ys[prev] + (ys[i] - ys[prev]) * (j - prev) / (i - prev);
      }
      prev = i;
    }
    const E = Math.floor(S * 0.06); // edge taper
    for (let i = 0; i < E; i++) {
      ys[i] *= i / E;
      ys[S - 1 - i] *= i / E;
    }
    if (setUserShape) setUserShape(ys);
    onDone(ys);
  };
  cv.addEventListener('pointerup', finish);
  cv.addEventListener('pointercancel', finish);
  function add(e) {
    const [x, y] = pos(e);
    const i = Math.round(x * (S - 1));
    if (lastI !== null && Math.abs(i - lastI) > 1) {
      const a = Math.min(i, lastI),
        bb = Math.max(i, lastI);
      for (let j = a; j <= bb; j++) {
        if (isNaN(ys[j])) ys[j] = y;
      }
    }
    ys[i] = y;
    lastI = i;
    if (onMove) onMove(ys);
  }
}
