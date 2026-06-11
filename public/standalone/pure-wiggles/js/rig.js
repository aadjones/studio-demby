import { $, $$, tickFns, onResize, setUserShape, userShape } from './nav.js';
import { PI, S, synth, presetCoef, project } from './math.js';
import { fit, clearPanel, plot, drawRod, makeDrawer, modeColor } from './canvas.js';

const NB = 14;

export function evolutionRig(opts) {
  const N = 40;
  const cv = $(opts.cv), bars = $(opts.bars);
  let b0 = presetCoef(opts.startPreset, N);
  let tau = 0, playing = false;
  const slider = opts.slider ? $(opts.slider) : null;

  function curCoef() {
    const b = new Float64Array(N + 1);
    for (let n = 1; n <= N; n++) b[n] = opts.amp(n, b0[n], tau);
    return b;
  }

  function draw(extraGhost) {
    const [ctx, w, h] = fit(cv);
    clearPanel(ctx, w, h);
    if (extraGhost) plot(ctx, w, h, extraGhost, '#6B7080', 2, 1.45, 0.5, [5, 5]);
    plot(ctx, w, h, synth(b0, N), '#6B7080', 1.4, 1.45, 0.4, [3, 5]);
    if (opts.overlay && opts.overlay.on) {
      const ob = new Float64Array(N + 1);
      for (let n = 1; n <= N; n++) ob[n] = opts.overlay.amp(n, b0[n], tau);
      plot(ctx, w, h, synth(ob, N), opts.overlay.color || '#FF7A45', 2.2, 1.45, 0.9);
    }
    plot(ctx, w, h, synth(curCoef(), N), opts.color, 2.4);
    if (opts.rod) drawRod($(opts.rod), synth(curCoef(), N), 1.45);
    drawBars();
    if (opts.read) opts.read(tau);
  }

  function drawBars() {
    const [ctx, w, h] = fit(bars);
    ctx.clearRect(0, 0, w, h);
    const bw = w / NB;
    const base = opts.signedBars ? h / 2 : h - 14;
    ctx.strokeStyle = '#252A35';
    ctx.beginPath(); ctx.moveTo(0, base); ctx.lineTo(w, base); ctx.stroke();
    const b = curCoef();
    const scale = opts.signedBars ? h / 2 - 14 : h - 26;
    for (let n = 1; n <= NB; n++) {
      const x = (n - 1) * bw + bw * 0.2, wd = bw * 0.6;
      const g0 = (opts.signedBars ? b0[n] : Math.abs(b0[n])) * scale;
      ctx.fillStyle = 'rgba(123,129,144,0.18)';
      ctx.fillRect(x, Math.min(base, base - g0), wd, Math.abs(g0));
      const v = (opts.signedBars ? b[n] : Math.abs(b[n])) * scale;
      ctx.fillStyle = modeColor(n);
      ctx.fillRect(x, Math.min(base, base - v), wd, Math.max(1, Math.abs(v)));
      ctx.fillStyle = '#7B8190';
      ctx.font = '9px IBM Plex Mono,monospace';
      ctx.textAlign = 'center';
      ctx.fillText(n, x + wd / 2, h - 3);
    }
  }

  function setTau(t) {
    tau = Math.max(0, Math.min(opts.tauMax, t));
    if (slider) slider.value = Math.round(Math.cbrt(tau / opts.tauMax) * 1000);
    draw();
  }

  if (slider) {
    slider.addEventListener('input', () => {
      pause();
      tau = Math.pow(slider.value / 1000, 3) * opts.tauMax;
      draw();
    });
  }

  const playBtn = $(opts.playBtn);
  function pause() {
    playing = false;
    playBtn.textContent = '▶ play';
    playBtn.classList.remove('on');
  }

  playBtn.addEventListener('click', () => {
    playing = !playing;
    if (playing && tau >= opts.tauMax * 0.999) tau = 0;
    playBtn.textContent = playing ? '⏸ pause' : '▶ play';
    playBtn.classList.toggle('on', playing);
  });

  $(opts.resetBtn).addEventListener('click', () => { pause(); setTau(0); });

  $$(opts.presetSel).forEach((btn) =>
    btn.addEventListener('click', () => {
      // userShape is a live binding from nav.js — always reads current value
      b0 = presetCoef(btn.dataset.p, N, userShape);
      pause(); setTau(0);
      $(opts.drawBtn).classList.remove('on');
      delete cv.dataset.drawmode;
    })
  );

  const dBtn = $(opts.drawBtn);
  dBtn.addEventListener('click', () => {
    const on = dBtn.classList.toggle('on');
    if (on) { cv.dataset.drawmode = '1'; pause(); setTau(0); }
    else delete cv.dataset.drawmode;
  });

  makeDrawer(cv, (ys) => { b0 = project(ys, N); setTau(0); }, (ys) => { draw(ys); }, setUserShape);

  tickFns[opts.idx] = (dt) => {
    if (!playing) return;
    tau += dt * opts.speed;
    if (tau >= opts.tauMax) {
      if (opts.loop) tau -= opts.tauMax;
      else { tau = opts.tauMax; pause(); }
    }
    if (slider) slider.value = Math.round(Math.cbrt(tau / opts.tauMax) * 1000);
    draw();
  };

  onResize(opts.idx, () => draw());
  draw();

  return { redraw: draw, pause, getB0: () => b0 };
}
