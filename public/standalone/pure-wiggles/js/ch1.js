import { $, $$, RM, tickFns, onResize } from './nav.js';
import { PI, TAU, S, X, synth, presetCoef } from './math.js';
import { fit, clearPanel, plot } from './canvas.js';

const IDX = 0;

/* ---- hero wiggle ---- */
(function () {
  const cv = $('#heroWiggle');
  function draw(t) {
    const [ctx, w, h] = fit(cv);
    ctx.clearRect(0, 0, w, h);
    const cols = ['#FF7A45', '#54C8EC', '#9D7BFF'];
    [[1.5, 0.5, 0.4], [3, 0.28, -0.7], [5, 0.16, 1.1]].forEach((m, k) => {
      ctx.strokeStyle = cols[k]; ctx.lineWidth = 2.4; ctx.globalAlpha = 0.9;
      ctx.beginPath();
      for (let i = 0; i <= w; i += 2) {
        const y = h / 2 + Math.sin(i / w * TAU * m[0] + t * m[2] + k) * m[1] * h * 0.8;
        i ? ctx.lineTo(i, y) : ctx.moveTo(i, y);
      }
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
  }
  if (RM) { draw(1.3); }
  else { (function anim(ts) { draw(ts / 1000); requestAnimationFrame(anim); })(0); }
})();

/* ---- eigenfunction gallery: one candidate shape at a time ---- */
(function () {
  // Each widget is locked to one shape. White = f (peak 0.92).
  // Violet = f″, the real finite-difference second derivative, sign-preserving
  // normalized to peak 0.70 so the *shape & sign* compare cleanly against white.
  const shapes = {
    tri(y) { const a = 0.27; for (let i = 0; i < S; i++) { const x = X(i); y[i] = x < a ? x / a : (1 - x) / (1 - a); } },
    arch(y) { for (let i = 0; i < S; i++) { const x = X(i); y[i] = 4 * x * (1 - x); } },
    exp(y) { for (let i = 0; i < S; i++) y[i] = Math.exp(1.4 * X(i)); },
    sinew(y) { for (let i = 0; i < S; i++) y[i] = Math.sin(2.5 * PI * X(i)); },
    siner(y) { for (let i = 0; i < S; i++) y[i] = Math.sin(PI * X(i)); },
  };

  function d2(y) {
    const d = new Float64Array(S), dx = 1 / (S - 1);
    for (let i = 1; i < S - 1; i++) d[i] = (y[i + 1] - 2 * y[i] + y[i - 1]) / (dx * dx);
    d[0] = d[1]; d[S - 1] = d[S - 2];
    return d;
  }

  function normPeak(y, target) {
    let m = 0;
    for (let i = 0; i < S; i++) m = Math.max(m, Math.abs(y[i]));
    const out = new Float64Array(S);
    if (m < 1e-9) return out;
    const s = target / m;
    for (let i = 0; i < S; i++) out[i] = y[i] * s;
    return out;
  }

  $$('.panel.eig').forEach((panel) => {
    const gen = shapes[panel.dataset.eig];
    if (!gen) return;
    const cv = panel.querySelector('canvas');
    const btn = panel.querySelector('.plot');
    const raw = new Float64Array(S); gen(raw);
    const white = normPeak(raw, 0.92);
    const violet = normPeak(d2(raw), 0.70);
    let shown = false;

    function draw() {
      const [ctx, w, h] = fit(cv);
      clearPanel(ctx, w, h);
      if (shown) plot(ctx, w, h, violet, '#9D7BFF', 2, 1.45, 0.95);
      plot(ctx, w, h, white, '#F4F5F8', 2.2);
    }

    btn.addEventListener('click', () => {
      if (shown) return;
      shown = true;
      panel.classList.add('plotted');
      btn.classList.add('done');
      btn.textContent = '✓ bendiness plotted';
      draw();
    });

    onResize(IDX, draw);
    draw();
  });
})();

/* ---- slow-motion specimen ---- */
(function () {
  const cvP = $('#c1pluck'), cvM = $('#c1mode');
  const N = 40, b = presetCoef('pluck', N);
  let t = 0;

  function drawStrips() {
    let [ctx, w, h] = fit(cvP);
    clearPanel(ctx, w, h);
    const bb = new Float64Array(N + 1);
    for (let n = 1; n <= N; n++) bb[n] = b[n] * Math.cos(n * PI * t);
    plot(ctx, w, h, synth(bb, N), '#F4F5F8', 2.2, 1.25);

    [ctx, w, h] = fit(cvM);
    clearPanel(ctx, w, h);
    const y = new Float64Array(S), a = 0.85 * Math.cos(2 * PI * t);
    for (let i = 0; i < S; i++) y[i] = a * Math.sin(2 * PI * X(i));
    const env = new Float64Array(S), env2 = new Float64Array(S);
    for (let i = 0; i < S; i++) { env[i] = 0.85 * Math.sin(2 * PI * X(i)); env2[i] = -env[i]; }
    plot(ctx, w, h, env, '#6B7080', 1, 1.25, 0.3, [3, 5]);
    plot(ctx, w, h, env2, '#6B7080', 1, 1.25, 0.3, [3, 5]);
    plot(ctx, w, h, y, '#54C8EC', 2.2, 1.25);
  }

  if (RM) { t = 0.31; drawStrips(); }
  else {
    const base = tickFns[IDX];
    tickFns[IDX] = (dt) => { if (base) base(dt); t += dt * 0.16; drawStrips(); };
  }
  onResize(IDX, drawStrips);
  drawStrips();
})();
