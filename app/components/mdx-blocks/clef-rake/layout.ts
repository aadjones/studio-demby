import { HIGH, type Diatonic } from "./lib/pitch";

/**
 * All the geometry, named. These were bare numbers scattered through the
 * prototype's `draw()`; nothing here is new, it is just no longer anonymous.
 *
 * The coordinate system is the SVG viewBox below, so every value is in user
 * units and independent of the rendered size.
 */
export const VIEW_W = 360;
/**
 * Narrower viewBox for when the clef notches are hidden. The notch column
 * occupies x 312–360, so cropping there removes the dead space instead of
 * leaving the staff floating left of a blank margin. Clears the staff (ends at
 * 290) and the drag hint.
 */
export const VIEW_W_NO_NOTCHES = 300;
export const VIEW_H = 380;

/** Vertical px per diatonic step. A staff line gap is twice this. */
export const STEP_PX = 8;
/** Distance from the top of the viewBox down to `HIGH`. */
export const TOP_PAD = 20;

/** Diatonic index → y. The one affine map the whole drawing hangs off. */
export function yOf(d: Diatonic): number {
  return TOP_PAD + (HIGH - d) * STEP_PX;
}

/** y → diatonic index. The exact inverse of `yOf`; used by the drag. */
export function dOf(y: number): number {
  return HIGH - (y - TOP_PAD) / STEP_PX;
}

// The staff itself, and the clef sign that sits on it.
export const STAFF_X0 = 70;
export const STAFF_X1 = 290;
export const SIGN_X = 92;

// The two alternating columns of note heads.
export const NOTE_COLS = [150, 172] as const;

// Ledger lines and the "N ledger lines" labels to their right.
export const LEDGER_X0 = 134;
export const LEDGER_X1 = 188;
export const LEDGER_LABEL_X = 196;

// Letter names for notes currently on the staff.
export const STAFF_LABEL_X = 202;
export const STAFF_LABEL_DX = 26;

// The octave-C labels running down the left edge of the ladder.
export const LADDER_LABEL_X = 56;
export const LADDER_TICK_X0 = 59;
export const LADDER_TICK_X1 = 67;

// The clickable clef stops down the right-hand side.
export const NOTCH_X = 312;
export const NOTCH_W = 48;
export const NOTCH_H = 16;
export const NOTCH_TICK_X0 = 318;
export const NOTCH_TICK_X1 = 326;
export const NOTCH_LABEL_X = 329;

/** Where the "drag ↕" hint sits before the reader has dragged anything. */
export const HINT_X = 272;

/** Half the height of the arrow cluster, used to centre it on the staff. */
export const ARROW_HALF_H = 45;
