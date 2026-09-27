"use client";

import "./clef-rake.css";
import { MIDDLE_C } from "./lib/pitch";
import { pitchesFrom } from "./lib/twinkle";
import {
  CUTAWAY_H,
  CUTAWAY_MELODY_DX,
  CUTAWAY_MELODY_X0,
  CUTAWAY_W,
  CUTAWAY_X,
  CUTAWAY_Y,
  MELODY_TEXT_DY,
  SIGN_X,
  yOf,
} from "./layout";
import ClefMarker from "./ClefMarker";
import StaffLines from "./StaffLines";
import SyllableRow from "./SyllableRow";

/**
 * The five-line slice on its own, with the tune on it — the first time in the
 * explainer that anything looks like real written music.
 *
 * Everything the ladder was carrying is gone: no rungs above or below, no
 * octave labels, no column of every other note. What is left is what a reader
 * would actually meet on a page.
 *
 * The marker is still the plain letter C with a dot, not the clef symbol it
 * would really be. The reader has been told what this staff is — the slice with
 * middle C on its middle line — and has not been told that the mark for it is a
 * drawing of a letter C. That reveal comes later, with the real symbols.
 */

/**
 * The staff whose *middle line* is middle C. Five lines sit at `bottom + 2k`,
 * so the middle one is `bottom + 4` — which makes the bottom line four
 * diatonic steps below middle C.
 *
 * This is alto position, but it is deliberately not named or derived that way:
 * at this point in the explainer clefs do not exist yet, and the reason to
 * choose this slice is that it puts the anchor in the middle, not that it has
 * a name.
 */
const BOTTOM = MIDDLE_C - 4;

export default function StaffCutaway({
  className = "",
}: {
  className?: string;
}) {
  // Note heads are `NoteLadder`'s size, not the bare ladder's: on an actual
  // staff a head has to fill its space, or the reader cannot tell a line note
  // from a space note at a glance.
  const melody = pitchesFrom(MIDDLE_C);
  const xOf = (i: number) => CUTAWAY_MELODY_X0 + i * CUTAWAY_MELODY_DX;
  // Below the staff, not below the lowest note: the tune sits in the top half
  // of the staff, and syllables tucked under it would collide with the lines.
  const textY = yOf(BOTTOM) + MELODY_TEXT_DY;

  return (
    <div className={`clef-rake staff-cutaway ${className}`.trim()}>
      <svg
        viewBox={`${CUTAWAY_X} ${CUTAWAY_Y} ${CUTAWAY_W} ${CUTAWAY_H}`}
        aria-label="A five-line staff with middle C marked on the middle line, carrying the opening phrase of Twinkle Twinkle Little Star."
      >
        <StaffLines bottom={BOTTOM} />
        <ClefMarker type="C" x={SIGN_X} y={yOf(MIDDLE_C)} />

        {melody.map((d, i) => {
          const x = xOf(i);
          const y = yOf(d);
          return (
            <ellipse
              key={`n-${i}`}
              cx={x}
              cy={y}
              rx={9.5}
              ry={7.07}
              fill="var(--ink)"
              transform={`rotate(-20 ${x} ${y})`}
            />
          );
        })}

        <SyllableRow xOf={xOf} y={textY} fontSize={10} halo={4} />
      </svg>
    </div>
  );
}
