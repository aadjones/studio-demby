import { noteName, type Diatonic } from "./pitch";

export interface Instrument {
  name: string;
  /** Extreme range: [lo, hi] in WRITTEN pitch. */
  ext: [Diatonic, Diatonic];
  /** Everyday range: [lo, hi] in WRITTEN pitch. */
  core: [Diatonic, Diatonic];
  /**
   * Display text overrides. Omitted on almost every row, because the text is
   * derivable from the indices; supplied only where the written note and the
   * staff position genuinely differ (see Bassoon).
   */
  extText?: string;
  coreText?: string;
  note?: string;
}

/** `rangeText(28, 49) === "C4–C7"`. Em dash, per the prototype. */
export function rangeText(lo: Diatonic, hi: Diatonic): string {
  return `${noteName(lo)}–${noteName(hi)}`;
}

export function extText(inst: Instrument): string {
  return inst.extText ?? rangeText(...inst.ext);
}

export function coreText(inst: Instrument): string {
  return inst.coreText ?? rangeText(...inst.core);
}

/**
 * All ranges in WRITTEN pitch—what the player reads, not what sounds. Where
 * the two differ the `note` field says so.
 */
export const INSTRUMENTS: readonly Instrument[] = [
  { name: "Flute", ext: [28, 49], core: [32, 46] },
  { name: "Violin", ext: [25, 49], core: [25, 43] },
  { name: "Viola", ext: [21, 44], core: [21, 36] },
  { name: "Cello", ext: [14, 40], core: [14, 30] },
  {
    name: "Double bass",
    ext: [16, 36],
    core: [16, 30],
    note: "Sounds an octave lower than written.",
  },
  {
    name: "Guitar",
    ext: [23, 44],
    core: [23, 37],
    note: "Sounds an octave lower than written.",
  },
  {
    name: "Bassoon",
    ext: [13, 37],
    core: [13, 32],
    // The lowest note is B♭1, which is written on the B1 staff position—the
    // one place where the display text and the index legitimately disagree.
    extText: "B♭1–E5",
    coreText: "B♭1–G4",
    note: "B♭1 sits on the B1 position.",
  },
  { name: "Trombone", ext: [16, 38], core: [19, 31] },
  { name: "Tuba", ext: [8, 31], core: [10, 24] },
  { name: "Soprano voice", ext: [27, 42], core: [30, 39] },
  { name: "Alto voice", ext: [24, 38], core: [26, 36] },
  {
    name: "Tenor voice",
    ext: [28, 42],
    core: [30, 39],
    note: "Written in treble, sounds an octave lower.",
  },
  { name: "Bass voice", ext: [16, 31], core: [18, 29] },
];

/**
 * Viola—the instrument whose clef is least familiar, so the best default for
 * showing why the rake exists. Matches the prototype's `inst = 2`.
 */
export const DEFAULT_INSTRUMENT = INSTRUMENTS[2];
