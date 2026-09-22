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
/**
 * Where the lines stop when the clef stops are shown.
 *
 * The stops are labelled with full clef names, and "Mezzo-soprano" needs about
 * 76 units. Rather than widening the viewBox — which would shrink the whole
 * widget — the horizontal lines give up their right-hand end, which was empty
 * anyway. Only the notched widgets pay this; everything else keeps `STAFF_X1`.
 */
export const STAFF_X1_NOTCHED = 248;
export const SIGN_X = 92;

// The two alternating columns of note heads.
export const NOTE_COLS = [150, 172] as const;

// Ledger lines, drawn either side of the note column.
export const LEDGER_X0 = 134;
export const LEDGER_X1 = 188;

// Letter names for notes currently on the staff.
export const STAFF_LABEL_X = 202;
export const STAFF_LABEL_DX = 26;

// The octave-C labels running down the left edge of the ladder.
export const LADDER_LABEL_X = 56;
export const LADDER_TICK_X0 = 59;
export const LADDER_TICK_X1 = 67;

// The clickable clef stops down the right-hand side.
/*
 * The right-hand column, sized backwards from its longest label.
 * "Mezzo-soprano" is ~76 units at font-size 10, so the label runs x 275–351 and
 * fits the original 360 viewBox. All of that room came from shortening the
 * lines (`STAFF_X1_NOTCHED`); nothing had to be given up in scale.
 *
 * It only fits because `RangeLayer` no longer writes ledger-line counts beside
 * the staff. Those reached x 271, and while they existed the stops had to start
 * at 278 and the viewBox had to stretch to 384.
 */
export const NOTCH_X = 258;
export const NOTCH_W = 98;
export const NOTCH_H = 16;
export const NOTCH_TICK_X0 = 264;
export const NOTCH_TICK_X1 = 272;
export const NOTCH_LABEL_X = 275;

/**
 * Where the "drag ↕" hint sits before the reader has dragged anything: near the
 * right end of whatever the staff's span currently is, and just above the top
 * line. Above, because every position *inside* the staff already has a letter
 * label on it, and the shortened staff leaves no clear column beside them.
 */
export const hintX = (staffX1: number) => staffX1 - 24;
export const HINT_DY = -10;

/** Half the height of the arrow cluster, used to centre it on the staff. */
export const ARROW_HALF_H = 45;

// The Twinkle phrase laid across the ladder in section 2. It runs left to
// right inside the rungs' own span, so the tune reads as sitting *on* the
// ladder rather than beside it.
export const MELODY_X0 = 86;
export const MELODY_DX = 33;
/** Drop from the lowest note of the phrase down to the syllable baseline. */
export const MELODY_TEXT_DY = 22;

/**
 * How far the ladder's viewBox reaches past C7 and C1.
 *
 * Only the *window* grows — `yOf` and `TOP_PAD` are untouched, so the ladder
 * stays in the same coordinate system everywhere it is drawn. The extra margin
 * is where the "it keeps going" dots live.
 */
export const LADDER_PAD = 26;

/** Height of a ladder viewBox, dots included. */
export const LADDER_VIEW_H = VIEW_H + 2 * LADDER_PAD;

/**
 * The viewBox every ladder diagram uses. Sharing it is what keeps the dots from
 * being clipped in one figure and not another, and keeps all the ladders at the
 * same scale.
 */
export function ladderViewBox(width: number): string {
  return `0 ${-LADDER_PAD} ${width} ${LADDER_VIEW_H}`;
}

/**
 * Where a ladder y falls in the rendered box, 0..1.
 *
 * Only needed by overlays positioned in HTML rather than SVG — the arrow
 * cluster. Deriving it from the same constants as `ladderViewBox` means the
 * arrows cannot drift off the staff when the margin changes.
 */
export function ladderViewFraction(y: number): number {
  return (y + LADDER_PAD) / LADDER_VIEW_H;
}

/*
 * The cutaway in section 3: the five lines on their own, with nothing above or
 * below them. Cropping this tightly magnifies it — the same drawing at roughly
 * twice the scale of the full ladder, which is what makes it a cutaway rather
 * than a second, smaller figure.
 *
 * Only the window is cropped; `yOf` still places every pitch, so the staff is
 * the same staff at the same size per step as everywhere else.
 */
export const CUTAWAY_X = 60;
export const CUTAWAY_W = 240;
export const CUTAWAY_Y = 130;
export const CUTAWAY_H = 128;

/**
 * The tune inside the cutaway. It starts clear of the marker (which ends around
 * x = 103) and runs to just short of the staff's right end.
 */
export const CUTAWAY_MELODY_X0 = 132;
export const CUTAWAY_MELODY_DX = 25;
