/**
 * Pitch as a **diatonic index**: `octave * 7 + step`, where step 0..6 is C..B.
 * C1 = 7, middle C (C4) = 28, C7 = 49.
 *
 * This representation is why the widget stays small. In it:
 *   - a staff line is `bottom + 2k`
 *   - an interval of a third is `+2`
 *   - line-vs-space is a parity check
 *   - vertical position is one affine map (see `src/layout.ts`)
 *
 * Do not "improve" this into MIDI numbers or `{ letter, octave }`—both turn
 * thirds and staff positions back into lookup tables.
 */
export type Diatonic = number;

export const LETTERS = ["C", "D", "E", "F", "G", "A", "B"] as const;
export const SOLFEGE = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"] as const;

export type NameSystem = "letters" | "solfege";

/** C1—the bottom of the displayed ladder. */
export const LOW: Diatonic = 7;
/** C7—the top of the displayed ladder. */
export const HIGH: Diatonic = 49;
/** C4. The anchor the whole explainer pivots on. */
export const MIDDLE_C: Diatonic = 28;

/** Scale degree 0..6 (C..B), correct for negative indices too. */
export function stepOf(d: Diatonic): number {
  return ((d % 7) + 7) % 7;
}

/** The letter (or solfège syllable) alone, with no octave number. */
export function letterOf(d: Diatonic, system: NameSystem = "letters"): string {
  return (system === "solfege" ? SOLFEGE : LETTERS)[stepOf(d)];
}

export function octaveOf(d: Diatonic): number {
  return Math.floor(d / 7);
}

/** Full name with octave, e.g. `noteName(28) === "C4"`. */
export function noteName(d: Diatonic, system: NameSystem = "letters"): string {
  return letterOf(d, system) + octaveOf(d);
}

/**
 * Is `d` on a line (rather than in a space) for a staff whose bottom line is
 * `bottom`? Lines sit at even offsets from the bottom line.
 */
export function isLine(d: Diatonic, bottom: Diatonic): boolean {
  return (((d - bottom) % 2) + 2) % 2 === 0;
}

/**
 * Rewrite letter names inside an already-assembled sentence as solfège,
 * preserving any flat sign and octave digit (`B♭1` → `Si♭1`).
 *
 * Applied to whole sentences rather than to each name, matching the original
 * prototype so instrument notes convert too.
 */
export function toSolfege(text: string): string {
  return text.replace(
    /([A-G])(♭?)(\d)/g,
    (_m, letter: string, flat: string, octave: string) =>
      SOLFEGE[LETTERS.indexOf(letter as (typeof LETTERS)[number])] + flat + octave
  );
}
