// Bessel drum modes + string vs drum A/B — chapter 7, index 6 in DOM.
import { $, $$, RM, tickFns } from './nav.js';
import { besselJ } from './math.js';
import { AudioEngine } from './audio.js';

/* ---- drum (Bessel) modes ---- */
(function () {
  const cv = $('#c6'), ctx = cv.getContext('2d');
  const R = 120;
  cv.width = R; cv.height = R; cv.style.imageRendering = 'auto';
  const img = ctx.createImageData(R, R);

  const MODES = {
    '01': { m: 0, j: 2.405, om: 1.0,             txt: 'The fundamental: the whole head breathes together. This is the drum’s “sine wave.”' },
    '11': { m: 1, j: 3.832, om: 3.832 / 2.405,   txt: 'One diameter stays still (a nodal line); the halves seesaw. Frequency ≈ 1.59× the fundamental — not 2×.' },
    '21': { m: 2, j: 5.136, om: 5.136 / 2.405,   txt: 'Two nodal diameters: four alternating quadrants. ≈ 2.14× the fundamental.' },
    '02': { m: 0, j: 5.520, om: 5.520 / 2.405,   txt: 'A nodal circle: the bullseye and the ring move opposite ways. ≈ 2.30× the fundamental.' },
  };

  const geo = [];
  for (let py = 0; py < R; py++) {
    for (let px = 0; px < R; px++) {
      const x = (px - R / 2) / (R / 2), y = (py - R / 2) / (R / 2);
      const r = Math.hypot(x, y);
      geo.push(r <= 1 ? { r, th: Math.atan2(y, x) } : null);
    }
  }

  const radial = {};
  function profile(key) {
    if (radial[key]) return radial[key];
    const md = MODES[key], p = new Float64Array(513);
    let mx = 0;
    for (let i = 0; i <= 512; i++) { p[i] = besselJ(md.m, md.j * i / 512); mx = Math.max(mx, Math.abs(p[i])); }
    for (let i = 0; i <= 512; i++) p[i] /= mx;
    return (radial[key] = p);
  }

  let curKey = '01', mode = MODES['01'], t = 0;

  function render() {
    const md = mode, p = profile(curKey), osc = Math.cos(t * md.om * 2.2);
    const d = img.data;
    const base = [21, 24, 31], em = [255, 122, 69], cyn = [84, 200, 236];
    for (let i = 0; i < geo.length; i++) {
      const g = geo[i], o = i * 4;
      if (!g) { d[o + 3] = 0; continue; }
      const ang = md.m ? Math.cos(md.m * g.th) : 1;
      let v = p[Math.round(g.r * 512)] * ang * osc;
      v = Math.max(-1, Math.min(1, v * 1.15));
      const tgt = v > 0 ? em : cyn, a = Math.abs(v);
      d[o]     = base[0] + (tgt[0] - base[0]) * a;
      d[o + 1] = base[1] + (tgt[1] - base[1]) * a;
      d[o + 2] = base[2] + (tgt[2] - base[2]) * a;
      d[o + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }

  $$('#c6modes .btn').forEach((b) =>
    b.addEventListener('click', () => {
      $$('#c6modes .btn').forEach((x) => x.classList.remove('on'));
      b.classList.add('on');
      curKey = b.dataset.m; mode = MODES[curKey];
      $('#c6read').textContent = mode.txt;
      render();
    })
  );

  tickFns[6] = (dt) => { if (!RM) { t += dt; render(); } };
  render();
})();

/* ---- coda: string vs drum A/B ---- */
(function () {
  const amps = [1, 0.62, 0.45, 0.36, 0.28, 0.22];
  $('#c7string').addEventListener('click', () => {
    const p = amps.map((a, i) => ({ ratio: i + 1, amp: a, tau: 1.8 / (1 + 0.05 * (i + 1) * (i + 1)) }));
    AudioEngine.partials(220, p, 2.8);
  });
  $('#c7drum').addEventListener('click', () => {
    const ratios = [1, 1.594, 2.136, 2.296, 2.653, 2.918];
    const p = amps.map((a, i) => ({ ratio: ratios[i], amp: a, tau: 0.85 / (1 + 0.30 * i) }));
    AudioEngine.partials(150, p, 2.2);
  });
})();
