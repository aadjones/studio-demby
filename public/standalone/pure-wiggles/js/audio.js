export const AudioEngine = {
  ctx: null,
  master: null,
  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.32;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  },
  // additive tone: parts = [{ratio, amp, tau}] — tau>0 gives per-partial exponential decay
  partials(f0, parts, dur, level = 0.9) {
    const ac = this.ensure();
    if (!ac) return;
    const t0 = ac.currentTime + 0.02;
    let norm = 0;
    parts.forEach((p) => (norm += Math.abs(p.amp)));
    if (norm < 1e-5) return;
    const sc = level / Math.max(1.2, norm * 0.7);
    parts.forEach((p) => {
      const a0 = Math.abs(p.amp) * sc,
        f = f0 * p.ratio;
      if (a0 < 1e-4 || f < 25 || f > 9000) return;
      const o = ac.createOscillator();
      o.frequency.value = f;
      const g = ac.createGain();
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(a0, t0 + 0.012);
      if (p.tau && p.tau > 0) g.gain.setTargetAtTime(0.00004, t0 + 0.012, p.tau);
      g.gain.setTargetAtTime(0.00004, t0 + dur, 0.05);
      o.connect(g);
      g.connect(this.master);
      o.start(t0);
      o.stop(t0 + dur + 0.6);
    });
  },
  // anti-heat: each partial RISES exponentially toward its target — treble screaming back in
  reversePartials(f0, parts, dur, level = 0.45) {
    const ac = this.ensure();
    if (!ac) return;
    const t0 = ac.currentTime + 0.02;
    let norm = 0;
    parts.forEach((p) => (norm += Math.abs(p.amp)));
    if (norm < 1e-5) return;
    const sc = level / Math.max(1.2, norm * 0.7);
    parts.forEach((p) => {
      const a1 = Math.abs(p.amp) * sc,
        f = f0 * p.ratio;
      if (a1 < 1e-4 || f < 25 || f > 9000) return;
      const a0 = Math.max(1e-4, a1 * Math.exp(-dur / Math.max(0.02, p.tau || 1)));
      const o = ac.createOscillator();
      o.frequency.value = f;
      const g = ac.createGain();
      g.gain.setValueAtTime(a0, t0);
      g.gain.exponentialRampToValueAtTime(a1, t0 + dur);
      g.gain.setTargetAtTime(0.00004, t0 + dur, 0.03);
      o.connect(g);
      g.connect(this.master);
      o.start(t0);
      o.stop(t0 + dur + 0.4);
    });
  },
  // loop a spatial shape as a waveform via its own sine-series coefficients
  shapeTone(coef, N, f0, dur) {
    const ac = this.ensure();
    if (!ac) return;
    const real = new Float32Array(N + 1),
      imag = new Float32Array(N + 1);
    let norm = 0;
    for (let n = 1; n <= N; n++) {
      imag[n] = coef[n];
      norm += Math.abs(coef[n]);
    }
    if (norm < 1e-5) return;
    const w = ac.createPeriodicWave(real, imag); // normalized by default
    const o = ac.createOscillator();
    o.setPeriodicWave(w);
    o.frequency.value = f0;
    const g = ac.createGain(),
      t0 = ac.currentTime + 0.02;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(0.55, t0 + 0.015);
    g.gain.setTargetAtTime(0.00004, t0 + dur, 0.09);
    o.connect(g);
    g.connect(this.master);
    o.start(t0);
    o.stop(t0 + dur + 0.7);
  },
};

/* ============ Convolution Reverb Helpers ============ */
export const ROOMS = {
  closet: { dur: 0.16, tau: 0.035, damp: 0.12, label: 'closet — G dies in ~150 ms' },
  hall: { dur: 1.6, tau: 0.38, damp: 0.30, label: 'recital hall — G rings ~1.5 s' },
  cathedral: { dur: 4.5, tau: 1.05, damp: 0.55, label: 'cathedral — G rings ~4 s' },
};

export const irBufs = {};
export let dryBuf = null;

export function ensureReverb() {
  const ac = AudioEngine.ensure();
  if (!ac) return null;

  // build IRs: exponentially decaying noise, progressively low-passed
  if (Object.keys(irBufs).length === 0) {
    for (const k in ROOMS) {
      const r = ROOMS[k],
        sr = ac.sampleRate,
        len = Math.floor(r.dur * sr);
      const buf = ac.createBuffer(2, len, sr);
      for (let ch = 0; ch < 2; ch++) {
        const d = buf.getChannelData(ch);
        let lp = 0;
        for (let i = 0; i < len; i++) {
          const t = i / sr;
          const a = Math.pow(1 - r.damp, t * 18); // darker over time
          const n = Math.random() * 2 - 1;
          lp = lp + (n - lp) * (0.55 - 0.5 * Math.min(1, t / r.dur)); // closing filter
          d[i] = lp * Math.exp(-t / r.tau) * (0.4 + 0.6 * a);
        }
        // tiny direct spike at t=0
        d[0] = 1.0;
        if (len > 1) d[1] = 0.6;
      }
      irBufs[k] = buf;
    }
  }

  if (!dryBuf) {
    dryBuf = renderMelody(ac);
  }

  return ac;
}

// Karplus-Strong pluck melody rendered into a buffer
function renderMelody(ac) {
  const sr = ac.sampleRate,
    total = 2.6;
  const buf = ac.createBuffer(1, Math.floor(total * sr), sr);
  const out = buf.getChannelData(0);
  const notes = [
    [220, 0],
    [277.18, 0.28],
    [329.63, 0.56],
    [440, 0.84],
  ];
  notes.forEach(([f, t0]) => {
    const D = Math.round(sr / f),
      tail = Math.floor(1.5 * sr);
    const dl = new Float32Array(D);
    for (let i = 0; i < D; i++) dl[i] = Math.random() * 2 - 1;
    let idx = 0,
      prev = 0;
    const start = Math.floor(t0 * sr);
    for (let i = 0; i < tail && start + i < out.length; i++) {
      const v = dl[idx];
      const nv = 0.498 * (v + prev); // averaging + slight loss
      dl[idx] = nv;
      prev = v;
      idx = (idx + 1) % D;
      out[start + i] += v * 0.5 * Math.exp(-i / (sr * 1.2));
    }
  });
  return buf;
}

export function playReverb(room) {
  const ac = ensureReverb();
  if (!ac) return;
  const src = ac.createBufferSource();
  src.buffer = dryBuf;
  const dry = ac.createGain(),
    wet = ac.createGain();
  if (room) {
    const conv = ac.createConvolver();
    conv.buffer = irBufs[room];
    dry.gain.value = 0.45;
    wet.gain.value = 1.0;
    src.connect(conv);
    conv.connect(wet);
    wet.connect(ac.destination);
  } else {
    dry.gain.value = 1.0;
  }
  src.connect(dry);
  dry.connect(ac.destination);
  src.start();
}

export function playPop(room) {
  const ac = ensureReverb();
  if (!ac) return;
  const src = ac.createBufferSource();
  src.buffer = irBufs[room];
  const g = ac.createGain();
  g.gain.value = 0.8;
  src.connect(g);
  g.connect(ac.destination);
  src.start();
}
