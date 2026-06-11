import { $, $$, RM, tickFns, onResize } from './nav.js';
import { PI, TAU, S, X, project, synth, presetCoef } from './math.js';
import { fit, clearPanel, plot } from './canvas.js';
import { AudioEngine } from './audio.js';

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

/* ---- eigenfunction demo ---- */
(function () {
  const cv = $('#c1');
  let func = 'sine', k = 2;
  const norm = $('#c1norm');

  function sample() {
    const y = new Float64Array(S);
    for (let i = 0; i < S; i++) {
      const x = X(i);
      if (func === 'sine') y[i] = Math.sin(PI * k * x);
      else if (func === 'exp') y[i] = Math.exp(3.2 * (x - 0.5)) * 0.27;
      else if (func === 'tri') { const p = (x * k) % 1; y[i] = p < 0.5 ? 4 * p - 1 : 3 - 4 * p; }
      else if (func === 'arch') y[i] = 4 * x * (1 - x) * 2 - 1;
      else if (func === 'bump') y[i] = Math.exp(-Math.pow((x - 0.5) / 0.13, 2)) * 1.6 - 0.3;
    }
    return y;
  }

  function d2(y) {
    const d = new Float64Array(S), dx = 1 / (S - 1);
    for (let i = 1; i < S - 1; i++) d[i] = (y[i + 1] - 2 * y[i] + y[i - 1]) / (dx * dx);
    d[0] = d[1]; d[S - 1] = d[S - 2];
    return d;
  }

  function corr(a, b) {
    let ab = 0, aa = 0, bb = 0;
    for (let i = 2; i < S - 2; i++) { ab += a[i] * b[i]; aa += a[i] * a[i]; bb += b[i] * b[i]; }
    return Math.abs(ab) / Math.sqrt(aa * bb + 1e-12);
  }

  function draw() {
    const [ctx, w, h] = fit(cv);
    clearPanel(ctx, w, h);
    const y = sample(), dd = d2(y);
    let m = 0;
    for (let i = 2; i < S - 2; i++) m = Math.max(m, Math.abs(dd[i]));
    const scale = norm.checked ? (m > 1e-9 ? 1 / m : 1) : 1 / 60;
    const dshow = new Float64Array(S);
    for (let i = 0; i < S; i++) dshow[i] = Math.max(-1.4, Math.min(1.4, dd[i] * scale));
    plot(ctx, w, h, dshow, '#9D7BFF', 2, 1.45, 0.95);
    plot(ctx, w, h, y, '#F4F5F8', 2.2);
    const c = corr(y, dd);
    const r = $('#c1read');
    if (c > 0.9995) {
      let num = 0, den = 0;
      for (let i = 2; i < S - 2; i++) { num += y[i] * dd[i]; den += y[i] * y[i]; }
      const lam = num / den;
      // These readout strings contain computed numbers only—no user input.
      if (lam < 0)
        r.textContent = `shape preserved ✓ eigenfunction · f″ = ${lam.toFixed(1)}·f — turned down and flipped`;
      else
        r.textContent = `shape preserved ✓ eigenfunction · f″ = +${lam.toFixed(1)}·f — amplified. The machine feeds it — this is the exponential's disqualification`;
    } else {
      r.textContent = `shape correlation ${(c * 100).toFixed(0)}% ✗ not an eigenfunction — the machine deformed it`;
    }
  }

  $$('#c1funcs [data-f]').forEach((b) =>
    b.addEventListener('click', () => {
      $$('#c1funcs [data-f]').forEach((x) => x.classList.remove('on'));
      b.classList.add('on'); func = b.dataset.f;
      $('#c1krow').style.opacity = func === 'sine' || func === 'tri' ? '1' : '0.35';
      draw();
    })
  );
  $('#c1k').addEventListener('input', (e) => { k = +e.target.value; $('#c1kv').textContent = k; draw(); });
  norm.addEventListener('change', draw);
  $('#c1hear').addEventListener('click', () => AudioEngine.shapeTone(project(sample(), 24), 24, 130, 1.3));
  onResize(IDX, draw);
  draw();
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
