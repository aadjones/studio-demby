import { $, $$, onResize, setUserShape } from './nav.js';
import { PI, S, X, project, synth, presetCoef } from './math.js';
import { fit, clearPanel, plot, makeDrawer, modeColor } from './canvas.js';
import { AudioEngine } from './audio.js';

const IDX = 1;
const SUB = '₁₂₃₄₅₆₇₈₉';

(function () {
  const N = 10, cv = $('#c2');
  let coef = presetCoef('pluck', N), ghost = null;
  const box = $('#c2faders'), sliders = [];

  for (let n = 1; n <= N; n++) {
    const sub = n > 9 ? '₁₀' : SUB[n - 1];
    const row = document.createElement('div'); row.className = 'fader';

    const sw = document.createElement('span'); sw.className = 'sw';
    sw.style.background = modeColor(n);
    const lbl = document.createElement('span'); lbl.className = 'n'; lbl.textContent = `b${sub}`;
    const inp = document.createElement('input'); inp.type = 'range';
    inp.min = '-100'; inp.max = '100'; inp.value = '0';
    const val = document.createElement('span'); val.className = 'v'; val.textContent = '0.00';

    row.append(sw, lbl, inp, val);
    box.appendChild(row);

    inp.addEventListener('input', () => {
      coef[n] = inp.value / 100; ghost = null; syncVals(); draw();
    });
    sliders.push({ inp, val });
  }

  function syncVals() {
    for (let n = 1; n <= N; n++) {
      sliders[n - 1].inp.value = Math.round(coef[n] * 100);
      sliders[n - 1].val.textContent = coef[n].toFixed(2);
    }
  }

  function draw(partialGhost) {
    const [ctx, w, h] = fit(cv);
    clearPanel(ctx, w, h);
    const g = partialGhost || ghost;
    if (g) plot(ctx, w, h, g, '#6B7080', 2, 1.45, 0.55, [5, 5]);
    for (let n = 1; n <= N; n++) {
      if (Math.abs(coef[n]) < 0.02) continue;
      const yc = new Float64Array(S);
      for (let i = 0; i < S; i++) yc[i] = coef[n] * Math.sin(n * PI * X(i));
      plot(ctx, w, h, yc, modeColor(n), 1, 1.45, 0.28);
    }
    plot(ctx, w, h, synth(coef, N), '#F4F5F8', 2.4);
  }

  $$('#ch2 [data-p]').forEach((b) =>
    b.addEventListener('click', () => {
      coef = b.dataset.p === 'zero' ? new Float64Array(N + 1) : presetCoef(b.dataset.p, N);
      ghost = null; $('#c2draw').classList.remove('on'); delete cv.dataset.drawmode;
      $('#c2read').textContent = b.dataset.p === 'zero'
        ? 'Silence. Push some faders.'
        : `Loaded ${b.dataset.p}. Note where the energy sits in the spectrum.`;
      syncVals(); draw();
    })
  );

  const drawBtn = $('#c2draw');
  drawBtn.addEventListener('click', () => {
    const on = drawBtn.classList.toggle('on');
    if (on) { cv.dataset.drawmode = '1'; $('#c2read').textContent = 'Draw a curve on the scope.'; }
    else delete cv.dataset.drawmode;
  });

  makeDrawer(cv,
    (ys) => {
      ghost = ys; coef = project(ys, N);
      for (let n = 1; n <= N; n++) coef[n] = Math.max(-1, Math.min(1, coef[n]));
      syncVals(); draw();
      $('#c2read').textContent = 'Gray dashes: your stroke. Solid: the same curve rebuilt from ten fader settings.';
    },
    (ys) => { draw(ys); },
    setUserShape
  );

  $('#c2hear').addEventListener('click', () => {
    AudioEngine.shapeTone(coef, N, 140, 1.7);
    $('#c2read').textContent = 'You are hearing the faders as additive synthesis — same ten numbers, time axis instead of space.';
  });

  syncVals(); draw();
  onResize(IDX, () => draw());
})();
