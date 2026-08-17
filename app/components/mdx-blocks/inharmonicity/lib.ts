// Math and reference data for the inharmonicity explainer.
// See docs/plans/inharmonicity-explainer.md for the full spec.
//
// Convention: physics coefficient B, where fn = n·f0·√(1 + B·n²).
// Tuner literature (Igrec, Pianos Inside Out) uses b with cents ≈ b·n²;
// the two relate by b ≈ (600/ln 2)·B ≈ 865.6·B for small B.

export const IGREC_B_FACTOR = 600 / Math.LN2; // ≈ 865.62

/** Frequency of partial n of a stiff string. B=0 gives exact harmonics. */
export function partialFreq(f0: number, n: number, B: number): number {
  return n * f0 * Math.sqrt(1 + B * n * n);
}

/** Signed interval from f1 up to f2, in cents. */
export function centsBetween(f1: number, f2: number): number {
  return 1200 * Math.log2(f2 / f1);
}

/** Convert Igrec's cents-based b to physics B. */
export function igrecBToB(b: number): number {
  return b / IGREC_B_FACTOR;
}

/**
 * Per-partial strike amplitude and decay, shared by the audio engine and the
 * spectrum canvas so what you see matches what you hear.
 *
 * The hammer strikes ~1/8 along the string, which suppresses partials whose
 * nodes sit near the strike point (a softened |sin(nπx)| comb over a 1/n
 * rolloff). The comb is floored so no partial vanishes entirely.
 */
export const STRIKE_POSITION = 0.12;

export function partialAmp(n: number): number {
  const comb = 0.25 + 0.75 * Math.abs(Math.sin(n * Math.PI * STRIKE_POSITION));
  return comb / Math.pow(n, 1.1);
}

/** Decay time constant (seconds) for partial n of a note with fundamental f0. */
export function decayTau(f0: number, n: number): number {
  const tauBase = Math.min(8, Math.max(1.5, 4 * (220 / f0)));
  return tauBase / (1 + 0.6 * n);
}

export interface StringMeasurement {
  note: string;
  f0: number;
  /** Igrec's coefficient (cents ≈ b·n²) */
  bIgrec: number;
  /** Physics coefficient (fn = n·f0·√(1+B·n²)) */
  B: number;
}

/**
 * Measured inharmonicity of every A on a 1923 Steinway A (6'4" grand).
 * Factual measurement data from Igrec, Pianos Inside Out, Table 4.
 */
export const STEINWAY_1923: StringMeasurement[] = (
  [
    ["A0", 27.5, 0.37],
    ["A1", 55, 0.16],
    ["A2", 110, 0.055],
    ["A3", 220, 0.21],
    ["A4", 440, 0.707],
    ["A5", 880, 2.294],
    ["A6", 1760, 6.484],
    ["A7", 3520, 21.561],
  ] as const
).map(([note, f0, bIgrec]) => ({ note, f0, bIgrec, B: igrecBToB(bIgrec) }));

export function steinwayB(note: string): number | undefined {
  return STEINWAY_1923.find((m) => m.note === note)?.B;
}
