import { HIGH, LOW, MIDDLE_C, type Diatonic } from "./pitch";

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
  sign: ClefSignType;
  /** Which staff line the sign sits on, 0 = bottom line. */
  signLine: 0 | 1 | 2 | 3 | 4;
}

/**
 * The seven historical clef positions, each a third (`+2`) above the last.
 * Replaces the four parallel objects in the prototype (`HIST`, `STOPS`,
 * `SHORT`, `SIGNS`) that were keyed by bottom line and had to be edited in
 * lockstep.
 *
 * The split is **1 F / 5 C / 1 G**, not the more commonly quoted 2 / 4 / 1.
 * That is a deliberate reading, not an error: baritone's staff puts both F3 and
 * C4 on lines, so it is a real clef either way, and choosing C makes the seven
 * say something. The five C clefs put middle C on each of the five lines in
 * turn — soprano on the 1st, mezzo-soprano the 2nd, alto the 3rd, tenor the
 * 4th, baritone the 5th — and the only two that are *not* C clefs are exactly
 * the two where middle C has left the staff altogether: it sits above bass and
 * below treble, so each has to name a different note. `tests/clef-clefs`
 * pins all of this down.
 */
export const CLEFS: readonly Clef[] = [
  { bottom: 18, name: "Bass", sign: "F", signLine: 3 },
  // Baritone is the one clef with a genuine choice: its lines are B2 D3 F3 A3
  // C4, so F3 (3rd line) and C4 (5th) both land on lines, and history wrote it
  // both ways. Taking the C reading makes the set say something — see the note
  // above CLEFS.
  { bottom: 20, name: "Baritone", sign: "C", signLine: 4 },
  { bottom: 22, name: "Tenor", sign: "C", signLine: 3 },
  { bottom: 24, name: "Alto", sign: "C", signLine: 2 },
  { bottom: 26, name: "Mezzo-soprano", sign: "C", signLine: 1 },
  { bottom: 28, name: "Soprano", sign: "C", signLine: 0 },
  { bottom: 30, name: "Treble", sign: "G", signLine: 1 },
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

/** Look a clef up by name — how `INSTRUMENTS` refers to its conventional clef. */
export function clefByName(name: string): Clef | undefined {
  return CLEFS.find((c) => c.name === name);
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

/**
 * Snap a wanted bottom line to the nearest staff position a third away, and
 * keep all five lines on the ladder.
 *
 * Moving by thirds is the real constraint, not a convenience. A staff line is
 * `bottom + 2k`, so shifting the staff by an odd number of steps would land its
 * lines on the ladder's spaces: the rungs behind the staff would stop lining up
 * with the lines, and middle C — which sits on a line under every clef there
 * has ever been — would fall into a space. Lines move onto lines or nowhere.
 *
 * Measured in thirds from middle C, so the parity is anchored to the one note
 * the whole explainer is built around rather than to the foot of the ladder.
 *
 * Unlike `nearestClef` this is not limited to the seven historical stops: it
 * reaches every third from `LOW` to the top the staff can occupy, which is
 * seventeen positions rather than seven.
 */
export function snapStaffBottom(want: number): Diatonic {
  const highest = HIGH - 2 * (LINE_COUNT - 1);
  const lowestThird = Math.ceil((LOW - MIDDLE_C) / 2);
  const highestThird = Math.floor((highest - MIDDLE_C) / 2);
  const thirds = Math.max(
    lowestThird,
    Math.min(highestThird, Math.round((want - MIDDLE_C) / 2))
  );
  return MIDDLE_C + 2 * thirds;
}
