// Measures a recorded string's partials and fits its inharmonicity
// coefficient—the same thing an electronic tuning device does when it
// "listens" to a note. See docs/plans/inharmonicity-explainer.md §4.4b.

import { fftMag, applyHann, nextPow2 } from "./fft";

export interface MeasuredPartial {
  n: number;
  /** Interpolated peak frequency, Hz */
  freq: number;
  /** Peak magnitude (linear) */
  mag: number;
  /** Deviation from n·f0 of the fitted fundamental, in cents */
  cents: number;
}

export interface SpectrumAnalysis {
  /** Fitted fundamental, Hz */
  f0: number;
  /** Fitted inharmonicity coefficient (physics convention) */
  B: number;
  partials: MeasuredPartial[];
  /** Magnitude spectrum for drawing, bins 0..maxFreq */
  mags: Float64Array;
  /** Hz per spectrum bin */
  binHz: number;
}

const MAX_FFT = 1 << 18;

/** Parabolic-interpolated peak location and height near [fLo, fHi]. */
function peakNear(
  mags: Float64Array,
  binHz: number,
  fLo: number,
  fHi: number
): { freq: number; mag: number } | null {
  let i0 = Math.max(1, Math.floor(fLo / binHz));
  let i1 = Math.min(mags.length - 2, Math.ceil(fHi / binHz));
  if (i1 <= i0) return null;
  let iMax = i0;
  for (let i = i0; i <= i1; i++) {
    if (mags[i] > mags[iMax]) iMax = i;
  }
  const a = Math.log(mags[iMax - 1] + 1e-30);
  const b = Math.log(mags[iMax] + 1e-30);
  const c = Math.log(mags[iMax + 1] + 1e-30);
  const denom = a - 2 * b + c;
  const d = denom === 0 ? 0 : (0.5 * (a - c)) / denom;
  return { freq: (iMax + d) * binHz, mag: mags[iMax] };
}

/**
 * Analyze a recorded note: measure partial frequencies and jointly fit
 * the fundamental f0 and inharmonicity B for fn = n·f0·√(1 + B·n²).
 *
 * `f0Guess` is the nominal pitch (e.g. 220 for A3). Uses up to ~5 s of the
 * signal starting at `startSec` to skip the attack transient.
 */
export function analyzeStringSpectrum(
  samples: ArrayLike<number>,
  sampleRate: number,
  f0Guess: number,
  maxPartials = 16,
  startSec = 0.3
): SpectrumAnalysis {
  const start = Math.min(
    Math.floor(startSec * sampleRate),
    Math.max(0, samples.length - sampleRate)
  );
  const segLen = Math.min(samples.length - start, Math.floor(5 * sampleRate));
  const seg = new Float64Array(segLen);
  for (let i = 0; i < segLen; i++) seg[i] = samples[start + i];
  applyHann(seg);

  const N = Math.min(MAX_FFT, nextPow2(segLen) * 2);
  const mags = fftMag(seg, N);
  const binHz = sampleRate / N;

  // Measure the fundamental, then each partial in a window that widens with
  // n (inharmonic partials drift progressively sharp)
  const f0Peak = peakNear(mags, binHz, f0Guess * 0.94, f0Guess * 1.06);
  let f0 = f0Peak ? f0Peak.freq : f0Guess;

  const measured: { n: number; freq: number; mag: number }[] = [];
  if (f0Peak) measured.push({ n: 1, freq: f0Peak.freq, mag: f0Peak.mag });
  for (let n = 2; n <= maxPartials; n++) {
    const lo = n * f0 * 0.985;
    const hi = n * f0 * Math.min(1.15, 1.005 + 0.006 * n);
    if (hi > sampleRate / 2) break;
    const p = peakNear(mags, binHz, lo, hi);
    if (p) measured.push({ n, freq: p.freq, mag: p.mag });
  }

  // Joint fit: alternate the linear B fit ((fn/(n·f0))² − 1 = B·n²) with a
  // least-squares f0 update against the full model. Anchoring f0 on the
  // measured fundamental alone is biased—unison beating pulls single peaks.
  let B = 0;
  for (let iter = 0; iter < 3; iter++) {
    let num = 0;
    let den = 0;
    for (const m of measured) {
      const y = (m.freq / (m.n * f0)) ** 2 - 1;
      num += y * m.n * m.n;
      den += m.n ** 4;
    }
    B = Math.max(0, den > 0 ? num / den : 0);

    let fNum = 0;
    let fDen = 0;
    for (const m of measured) {
      const s = m.n * Math.sqrt(1 + B * m.n * m.n);
      fNum += m.freq * s;
      fDen += s * s;
    }
    if (fDen > 0) f0 = fNum / fDen;
  }

  const partials: MeasuredPartial[] = measured.map((m) => ({
    ...m,
    cents: 1200 * Math.log2(m.freq / (m.n * f0)),
  }));

  // Keep only the bins the component draws (up to just past the last partial)
  const maxFreq = (maxPartials + 2) * f0;
  const keep = Math.min(mags.length, Math.ceil(maxFreq / binHz));

  return { f0, B, partials, mags: mags.slice(0, keep), binHz };
}
