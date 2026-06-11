// Field guide to fader choreography — chapter 5, index 4 in DOM.
// Equations live as pre-rendered spans in the HTML with data-eq-id attributes;
// this module just toggles their visibility, so no innerHTML injection needed.
import { $, $$ } from './nav.js';
import { PI } from './math.js';
import { AudioEngine } from './audio.js';
import { evolutionRig } from './rig.js';

(function () {
  const CHOREO = {
    fade: {
      amp: (n, b, t) => b * Math.exp(-n * n * t * 0.55),
      desc: 'fade — every fader slides down, tempo n². Diffusion.',
      sound: (b) => { const p = []; for (let n = 1; n <= 10; n++) p.push({ ratio: n, amp: b[n], tau: 1.15 / (n * n) }); AudioEngine.partials(150, p, 3.4); },
    },
    spin: {
      amp: (n, b, t) => b * Math.cos(n * PI * t),
      desc: 'spin — every fader oscillates, tempo n. The ideal string: harmonics 1, 2, 3, …',
      sound: (b) => { const p = []; for (let n = 1; n <= 10; n++) p.push({ ratio: n, amp: b[n], tau: 2.6 }); AudioEngine.partials(165, p, 3.0); },
    },
    spiral: {
      amp: (n, b, t) => b * Math.cos(n * PI * t) * Math.exp(-t * (0.16 + 0.055 * n * n)),
      desc: 'spiral — spin and slide at once; treble decays faster. A real string: the note darkens as it rings.',
      sound: (b) => { const p = []; for (let n = 1; n <= 10; n++) p.push({ ratio: n, amp: b[n], tau: 2.0 / (1 + 0.12 * n * n) }); AudioEngine.partials(165, p, 3.4); },
    },
    shimmer: {
      amp: (n, b, t) => b * Math.cos(n * n * PI * t * 0.5),
      desc: 'shimmer — faders spin at tempo n²: partials at 1, 4, 9, 16 × f₀. A stiff bar: inharmonic, bell-like.',
      sound: (b) => { const p = []; for (let n = 1; n <= 6; n++) p.push({ ratio: n * n, amp: b[n] / (1 + 0.15 * n), tau: 1.9 / (1 + 0.06 * n * n) }); AudioEngine.partials(75, p, 3.6); },
    },
  };

  let cur = 'spin';

  function showEq(key) {
    $$('#fgEq [data-eq-id]').forEach((el) => { el.hidden = el.dataset.eqId !== key; });
  }

  const rig = evolutionRig({
    idx: 4,
    cv: '#cfg', bars: '#cfgbars', color: '#9D7BFF',
    startPreset: 'pluck',
    presetSel: '#chfg [data-p]',
    playBtn: '#fgplay', resetBtn: '#fgreset', drawBtn: '#fgdraw',
    amp: (n, b, t) => CHOREO[cur].amp(n, b, t),
    tauMax: 8, speed: 0.4, signedBars: true, loop: true,
    read: (t) => { $('#fgread').textContent = `t = ${t.toFixed(2)} · ${CHOREO[cur].desc}`; },
  });

  $$('#fgChoreo .btn').forEach((b) =>
    b.addEventListener('click', () => {
      $$('#fgChoreo .btn').forEach((x) => x.classList.remove('on'));
      b.classList.add('on');
      cur = b.dataset.c;
      showEq(cur);
      rig.redraw();
    })
  );
  $('#fghear').addEventListener('click', () => CHOREO[cur].sound(rig.getB0()));
})();
