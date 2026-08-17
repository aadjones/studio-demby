// Minimal iterative radix-2 FFT for the inharmonicity explainer's spectrum
// analysis. We roll our own instead of using AnalyserNode because we need a
// long window (sub-Hz bin spacing) over a chosen segment of a decoded buffer,
// not a live 32k-max snapshot of whatever is currently playing.

/** Smallest power of two ≥ n. */
export function nextPow2(n: number): number {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

/**
 * Magnitude spectrum of `signal` zero-padded to `N` (power of two).
 * Returns N/2 + 1 magnitudes; bin k is frequency k·sampleRate/N.
 */
export function fftMag(
  signal: ArrayLike<number>,
  N: number
): Float64Array {
  if ((N & (N - 1)) !== 0) throw new Error("N must be a power of two");
  const re = new Float64Array(N);
  const im = new Float64Array(N);
  const len = Math.min(signal.length, N);
  for (let i = 0; i < len; i++) re[i] = signal[i];

  // Bit-reversal permutation
  for (let i = 1, j = 0; i < N; i++) {
    let bit = N >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      const tr = re[i];
      re[i] = re[j];
      re[j] = tr;
      const ti = im[i];
      im[i] = im[j];
      im[j] = ti;
    }
  }

  // Butterflies
  for (let size = 2; size <= N; size <<= 1) {
    const half = size >> 1;
    const step = (-2 * Math.PI) / size;
    for (let start = 0; start < N; start += size) {
      for (let k = 0; k < half; k++) {
        const angle = step * k;
        const wr = Math.cos(angle);
        const wi = Math.sin(angle);
        const i0 = start + k;
        const i1 = i0 + half;
        const xr = re[i1] * wr - im[i1] * wi;
        const xi = re[i1] * wi + im[i1] * wr;
        re[i1] = re[i0] - xr;
        im[i1] = im[i0] - xi;
        re[i0] += xr;
        im[i0] += xi;
      }
    }
  }

  const mags = new Float64Array(N / 2 + 1);
  for (let k = 0; k <= N / 2; k++) {
    mags[k] = Math.hypot(re[k], im[k]);
  }
  return mags;
}

/** In-place Hann window. */
export function applyHann(signal: Float64Array): void {
  const n = signal.length;
  for (let i = 0; i < n; i++) {
    signal[i] *= 0.5 * (1 - Math.cos((2 * Math.PI * i) / (n - 1)));
  }
}
