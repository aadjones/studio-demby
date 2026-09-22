import { MIDDLE_C, type Diatonic } from "./pitch";

/**
 * The opening phrase of "Twinkle, twinkle, little star", the one tune this
 * explainer keeps coming back to.
 *
 * It is stored as **scale degrees**, not pitches, because that is the honest
 * amount of information section 1 has: a contour knows that "twinkle" is higher
 * than "Twinkle", and nothing about where either one sits. Section 2 is where
 * the tune gets pinned to the ladder, and it does that by naming a starting
 * pitch — see `pitchesFrom`.
 *
 * One array, two figures. The contour and the ladder must show the same tune,
 * so neither of them gets its own copy to drift.
 */
export interface Syllable {
  text: string;
  /** Scale degree, 1–7. Height only; no octave, no absolute pitch. */
  degree: number;
  /**
   * True when the word carries on into the next syllable, so a hyphen is drawn
   * between them — the convention in any vocal score. It marks a word
   * continuing, not a gap being filled, which is why "kle" and "star" do not
   * have one: those end their words.
   */
  hyphenAfter?: boolean;
}

export const PHRASE: Syllable[] = [
  { text: "Twin", degree: 1, hyphenAfter: true },
  { text: "kle", degree: 1 },
  { text: "twin", degree: 5, hyphenAfter: true },
  { text: "kle", degree: 5 },
  { text: "lit", degree: 6, hyphenAfter: true },
  { text: "tle", degree: 6 },
  { text: "star", degree: 5 },
];

/**
 * The phrase as actual pitches, with degree 1 landing on `tonic`.
 *
 * From C4 that gives C4 C4 G4 G4 A4 A4 G4 — the whole phrase inside a sixth,
 * which is why it fits in the thin band the ladder gives it.
 */
export function pitchesFrom(tonic: Diatonic = MIDDLE_C): Diatonic[] {
  return PHRASE.map((s) => tonic + (s.degree - 1));
}
