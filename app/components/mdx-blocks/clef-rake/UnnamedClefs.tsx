"use client";

import "./clef-rake.css";
import { MIDDLE_C, type Diatonic } from "./lib/pitch";
import { yOf } from "./layout";
import ClefMarker from "./ClefMarker";
import StaffLines from "./StaffLines";

/**
 * Two staves, not yet named, each marked the historical way: a plain letter
 * instead of a glyph. Middle C sits off both — one ledger line below the
 * upper staff, one above the lower — which is exactly why a plain "C" was no
 * good here and G or F had to stand in for it.
 *
 * Deliberately not called treble or bass. That naming is the next section's
 * reveal; this figure only has to answer the question the prose just asked —
 * why G and F, plainly, in place of a clef glyph.
 *
 * Same `yOf` as every other figure, so middle C's ledger note falls at one
 * shared height between the two staves for free — it is one pitch, not two,
 * the same fact `MiddleCAcrossClefs` makes a few lines up. The ledger note
 * sits exactly in the gap between the staves: real grand-staff geometry, not
 * a diagram trick.
 */

/** The "high" staff — historically marked with G. */
const G_BOTTOM: Diatonic = 30;
/** The "low" staff — historically marked with F. */
const F_BOTTOM: Diatonic = 18;

/** A third above the staff's bottom line — G's real position on it. */
const G: Diatonic = G_BOTTOM + 2;
/** A third below the staff's top line — F's real position on it. */
const F: Diatonic = F_BOTTOM + 6;

const STAFF_X0 = 56;
const STAFF_X1 = 230;
const LETTER_X = STAFF_X0 + 30;

const NOTE_X = 166;
const LEDGER_X0 = NOTE_X - 14;
const LEDGER_X1 = NOTE_X + 14;
const LABEL_X = NOTE_X + 22;

const VIEW_X = 0;
const VIEW_Y = 98;
const VIEW_W = 252;
const VIEW_H = 182;

const MIDDLE_C_Y = yOf(MIDDLE_C);

export default function UnnamedClefs({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`clef-rake unnamed-clefs ${className}`.trim()}>
      <svg
        viewBox={`${VIEW_X} ${VIEW_Y} ${VIEW_W} ${VIEW_H}`}
        aria-label="Two five-line staves, one above the other. A plain letter G sits on the second line from the bottom of the upper staff; a plain letter F sits on the second line from the top of the lower staff. Middle C sits on a ledger line in the gap between them, level with both."
      >
        <StaffLines bottom={G_BOTTOM} x0={STAFF_X0} x1={STAFF_X1} />
        <ClefMarker type="G" x={LETTER_X} y={yOf(G)} />

        {/* Middle C, drawn once: it sits in the gap, level with both staves. */}
        <line
          x1={LEDGER_X0}
          x2={LEDGER_X1}
          y1={MIDDLE_C_Y}
          y2={MIDDLE_C_Y}
          stroke="var(--line)"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <ellipse
          cx={NOTE_X}
          cy={MIDDLE_C_Y}
          rx={9.5}
          ry={7.07}
          fill="var(--ink)"
          transform={`rotate(-20 ${NOTE_X} ${MIDDLE_C_Y})`}
        />
        <text
          x={LABEL_X}
          y={MIDDLE_C_Y + 4}
          fontSize={12}
          fontWeight={600}
          fill="var(--ink)"
        >
          middle C
        </text>

        <StaffLines bottom={F_BOTTOM} x0={STAFF_X0} x1={STAFF_X1} />
        <ClefMarker type="F" x={LETTER_X} y={yOf(F)} />
      </svg>
    </div>
  );
}
