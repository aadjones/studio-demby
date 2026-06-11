// Wave equation — chapter 3 in reading order, index 2 in DOM.
import { $ } from './nav.js';
import { PI } from './math.js';
import { AudioEngine } from './audio.js';
import { evolutionRig } from './rig.js';

(function () {
  const rig = evolutionRig({
    idx: 2,
    cv: '#c4', bars: '#c4bars', color: '#54C8EC',
    startPreset: 'pluck',
    presetSel: '#ch4 [data-p]',
    playBtn: '#c4play', resetBtn: '#c4reset', drawBtn: '#c4draw',
    amp: (n, b, t) => b * Math.cos(n * PI * t),
    tauMax: 4, speed: 0.30, signedBars: true, loop: true,
    read: (t) => {
      $('#c4read').textContent = `t = ${t.toFixed(2)} · fader n spins at frequency ∝ n · full recurrence every t = 2`;
    },
  });

  $('#c4hear').addEventListener('click', () => {
    const b = rig.getB0(), parts = [];
    for (let n = 1; n <= 10; n++) parts.push({ ratio: n, amp: b[n], tau: 2.2 / (1 + 0.03 * n * n) });
    AudioEngine.partials(165, parts, 3.0);
  });
})();
