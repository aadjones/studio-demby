// Heat equation + law-as-arrows specimen — chapter 4 in reading order, index 3 in DOM.
import { $, $$, RM, tickFns, onResize } from './nav.js';
import { PI, S, X, synth, presetCoef, project } from './math.js';
import { fit, clearPanel, plot, drawRod } from './canvas.js';
import { AudioEngine } from './audio.js';
import { evolutionRig } from './rig.js';

const IDX = 3;
const D = 0.55; // decay pacing constant

/* ---- main heat rig ---- */
const overlay = { on: false, color: '#54C8EC', amp: (n, b, t) => b * Math.cos(n * PI * t * 0.75) };

const heatRig = evolutionRig({
  idx: IDX,
  cv: '#c3', bars: '#c3bars', rod: '#c3rod', color: '#FF7A45',
  startPreset: 'square',
  presetSel: '#ch3 [data-p]',
  playBtn: '#c3play', resetBtn: '#c3reset', drawBtn: '#c3draw', slider: '#c3t',
  amp: (n, b, t) => b * Math.exp(-n * n * t * D),
  tauMax: 8, speed: 0.6, signedBars: false, loop: false, overlay,
  read: (t) => {
    const h1 = Math.exp(-t * D), h10 = Math.exp(-100 * t * D);
    $('#c3read').textContent =
      `t = ${t.toFixed(2)} · mode 1 at ${(h1 * 100).toFixed(1)}% of its start · mode 10 at ${h10 < 1e-4 ? '~0' : (h10 * 100).toFixed(2)}%`;
  },
});

const heatParts = () => {
  const b = heatRig.getB0(), parts = [];
  for (let n = 1; n <= 10; n++) parts.push({ ratio: n, amp: b[n], tau: 1.15 / (n * n) });
  return parts;
};
$('#c3hear').addEventListener('click', () => AudioEngine.partials(150, heatParts(), 3.4));
$('#c3rev').addEventListener('click', () => AudioEngine.reversePartials(150, heatParts(), 2.4));
$('#c3cmp').addEventListener('click', (e) => {
  overlay.on = !overlay.on;
  e.target.classList.toggle('on', overlay.on);
  heatRig.redraw();
});

/* ---- law-as-arrows specimen ---- */
(function () {
  const cv = $('#c3law'), N = 48;
  let c = null, t = 0, paused = false, cur = 'lumpy';

  function makeProfile(kind) {
    const y = new Float64Array(S);
    for (let i = 0; i < S; i++) {
      const x = X(i);
      if (kind === 'lumpy')
        y[i] = Math.exp(-Math.pow((x - 0.45) / 0.16, 2)) * 0.95 - 0.05 + 0.20 * Math.sin(14 * PI * x);
      else if (kind === 'pair')
        y[i] = 0.55 * Math.sin(2 * PI * x) + 0.45 * Math.sin(9 * PI * x);
      else if (kind === 'step')
        y[i] = x < 0.5 ? 0.8 : -0.2;
    }
    const E = Math.floor(S * 0.05);
    for (let i = 0; i < E; i++) { y[i] *= i / E; y[S - 1 - i] *= i / E; }
    return project(y, N);
  }

  function reset() { c = makeProfile(cur); t = 0; draw(); }

  function draw() {
    const [ctx, w, h] = fit(cv);
    clearPanel(ctx, w, h);
    const y = synth(c, N);
    plot(ctx, w, h, y, '#FF7A45', 2.2, 1.35);
    drawRod($('#c3lawrod'), y, 1.35);
    const d = new Float64Array(S);
    for (let n = 1; n <= N; n++) {
      const a = -c[n] * (n * PI) * (n * PI);
      if (Math.abs(a) < 1e-6) continue;
      for (let i = 0; i < S; i++) d[i] += a * Math.sin(n * PI * X(i));
    }
    ctx.strokeStyle = '#9D7BFF'; ctx.fillStyle = '#9D7BFF'; ctx.lineWidth = 1.5;
    for (let i = 10; i < S - 10; i += 12) {
      const px = i / (S - 1) * w;
      const py = h / 2 - Math.max(-1.35, Math.min(1.35, y[i])) / 1.35 * (h / 2 - 10);
      let len = Math.sign(d[i]) * Math.sqrt(Math.abs(d[i])) * 2.0;
      len = Math.max(-34, Math.min(34, len));
      if (Math.abs(len) < 1.6) continue;
      const py2 = py - len, s = Math.sign(len);
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, py2); ctx.lineTo(px - 3, py2 + s * 5); ctx.lineTo(px + 3, py2 + s * 5); ctx.closePath(); ctx.fill();
    }
  }

  $$('#ch3 [data-hp]').forEach((b) =>
    b.addEventListener('click', () => {
      $$('#ch3 [data-hp]').forEach((x) => x.classList.remove('on'));
      b.classList.add('on'); cur = b.dataset.hp; reset();
    })
  );
  $('#c3lawpause').addEventListener('click', (e) => {
    paused = !paused; e.target.textContent = paused ? '▶ resume' : '⏸ pause';
  });
  $('#c3lawreset').addEventListener('click', reset);
  reset();

  if (!RM) {
    // Wrap the tick set by the heat rig so both run in the same slot.
    const base = tickFns[IDX];
    tickFns[IDX] = (dt) => {
      if (base) base(dt);
      if (paused) return;
      t += dt;
      if (t > 10) { reset(); return; }
      for (let n = 1; n <= N; n++) c[n] *= Math.exp(-n * n * dt * 0.012);
      draw();
    };
  }
  onResize(IDX, draw);
})();
