import type { Diatonic } from "./pitch";

/**
 * The three clef symbols. There are only three because there are only three
 * *named* notes being pointed at—F3, C4 and G4, a chain of fifths centered on
 * middle C. See `tests/clefs.test.ts`.
 */
export type ClefSignType = "C" | "F" | "G";

export interface Clef {
  /** Diatonic index of the staff's bottom line. */
  bottom: Diatonic;
  name: string;
  /** Abbreviation for the notch labels down the right-hand side. */
  short: string;
  sign: ClefSignType;
  /** Which staff line the sign sits on, 0 = bottom line. */
  signLine: 0 | 1 | 2 | 3 | 4;
}

/**
 * The seven historical clef positions, each a third (`+2`) above the last.
 * Replaces the four parallel objects in the prototype (`HIST`, `STOPS`,
 * `SHORT`, `SIGNS`) that were keyed by bottom line and had to be edited in
 * lockstep.
 */
export const CLEFS: readonly Clef[] = [
  { bottom: 18, name: "Bass", short: "B", sign: "F", signLine: 3 },
  { bottom: 20, name: "Baritone", short: "Bar", sign: "F", signLine: 2 },
  { bottom: 22, name: "Tenor", short: "T", sign: "C", signLine: 3 },
  { bottom: 24, name: "Alto", short: "A", sign: "C", signLine: 2 },
  { bottom: 26, name: "Mezzo-soprano", short: "Mz", sign: "C", signLine: 1 },
  { bottom: 28, name: "Soprano", short: "S", sign: "C", signLine: 0 },
  { bottom: 30, name: "Treble", short: "Tr", sign: "G", signLine: 1 },
];

export const LINE_COUNT = 5;
export const SPACE_COUNT = 4;

/** Diatonic index of the top line of a staff sitting on `bottom`. */
export function topPitch(bottom: Diatonic): Diatonic {
  return bottom + 2 * (LINE_COUNT - 1);
}

/** The five line pitches, bottom to top. */
export function linePitches(bottom: Diatonic): Diatonic[] {
  return Array.from({ length: LINE_COUNT }, (_, k) => bottom + 2 * k);
}

/** The four space pitches, bottom to top. */
export function spacePitches(bottom: Diatonic): Diatonic[] {
  return Array.from({ length: SPACE_COUNT }, (_, k) => bottom + 1 + 2 * k);
}

/**
 * The pitch the clef's sign sits on—and, by the invariant this whole thing
 * rests on, the pitch the clef is *named after*. The letter marker and the
 * real glyph both render here.
 */
export function signPitch(clef: Clef): Diatonic {
  return clef.bottom + 2 * clef.signLine;
}

export function clefAt(bottom: Diatonic): Clef | undefined {
  return CLEFS.find((c) => c.bottom === bottom);
}

/** Step `delta` clefs up or down, clamped to the ends of the rake. */
export function stepClef(clef: Clef, delta: number): Clef {
  const i = CLEFS.indexOf(clef);
  return CLEFS[Math.max(0, Math.min(CLEFS.length - 1, i + delta))];
}

/** The clef whose bottom line sits closest to `want`—used by the drag. */
export function nearestClef(want: number): Clef {
  return CLEFS.reduce((best, c) =>
    Math.abs(c.bottom - want) < Math.abs(best.bottom - want) ? c : best
  );
}
