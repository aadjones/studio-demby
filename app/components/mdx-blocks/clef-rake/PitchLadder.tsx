"use client";

import "./clef-rake.css";
import {
  HIGH,
  LOW,
  MIDDLE_C,
  letterOf,
  noteName,
  type Diatonic,
} from "./lib/pitch";
import { pitchesFrom } from "./lib/twinkle";
import {
  LADDER_LABEL_X,
  LADDER_TICK_X0,
  LADDER_TICK_X1,
  MELODY_DX,
  MELODY_TEXT_DY,
  MELODY_X0,
  VIEW_W_NO_NOTCHES,
  ladderViewBox,
  yOf,
} from "./layout";
import PitchGrid from "./PitchGrid";
import SyllableRow from "./SyllableRow";

/**
 * The ladder: every rung from C1 to C7, named, with the Twinkle phrase from
 * section 1 finally pinned to it.
 *
 * Section 1 left the tune floating — the contour knew "twinkle" was higher than
 * "Twinkle" and nothing more. Here the same seven syllables land on actual
 * rungs, starting on C4, which is what the ladder buys you.
 *
 * Every letter is labelled so the reader can see the seven names running out
 * and starting over; the Cs are the only ones drawn dark enough to count by,
 * which is the section's other claim. Middle C is labelled exactly like every
 * other C — nothing acts as an anchor yet, that is section 3's job.
 *
 * Deliberately identical geometry to `ClefRake` — same `yOf`, same scale, and
 * now the same rung phase — so that when the staff slides onto it in section 3
 * it is visibly *this* ladder, not a second drawing of one. C4 sits on a rung,
 * as it does under every clef; C1 falls in a space, as it also does. Only the
 * viewBox is taller, to make room for the dots that say the ladder does not
 * really stop at either end.
 */

export default function PitchLadder({
  className = "",
}: {
  className?: string;
}) {
  // Every step, not every rung: PitchGrid draws a line on every *other* step,
  // but all seven letters have to be named for the repeat to be visible.
  const steps: Diatonic[] = [];
  for (let d = LOW; d <= HIGH; d++) steps.push(d);

  const melody = pitchesFrom(MIDDLE_C);
  const xOf = (i: number) => MELODY_X0 + i * MELODY_DX;
  // The phrase's lowest note is its C4, so the syllables clear all of it.
  const textY = Math.max(...melody.map(yOf)) + MELODY_TEXT_DY;

  return (
    <div className={`clef-rake pitch-ladder ${className}`.trim()}>
      <svg
        viewBox={ladderViewBox(VIEW_W_NO_NOTCHES)}
        aria-label="A ladder of notes from C1 to C7, every letter labelled and repeating every seven, with the opening phrase of Twinkle Twinkle Little Star sitting on it starting from C4."
      >
        <PitchGrid />

        {steps.map((d) => {
          const y = yOf(d);
          const isC = d % 7 === 0;

          // Every letter is named, but only faintly. Read down the column and
          // the seven run out and begin again, which is the thing to notice;
          // read the dark ones alone and you can count octaves.
          return isC ? (
            <g key={d}>
              <text
                x={LADDER_LABEL_X}
                y={y + 4}
                textAnchor="end"
                fontSize={11}
                fill="var(--soft)"
              >
                {noteName(d)}
              </text>
              <line
                x1={LADDER_TICK_X0}
                x2={LADDER_TICK_X1}
                y1={y}
                y2={y}
                stroke="var(--soft)"
                strokeWidth={1}
              />
            </g>
          ) : (
            <text
              key={d}
              x={LADDER_LABEL_X}
              y={y + 2.6}
              textAnchor="end"
              fontSize={7.5}
              fill="var(--soft)"
              fillOpacity={0.45}
            >
              {letterOf(d)}
            </text>
          );
        })}

        {/*
          No trace joining the notes. The contour figure can afford one because
          it has nothing else drawn on it; here a faint line between note heads
          reads as one more rung, and the rungs are the thing the reader is
          being taught to see.
        */}
        {melody.map((d, i) => {
          const x = xOf(i);
          const y = yOf(d);
          return (
            <ellipse
              key={`n-${i}`}
              cx={x}
              cy={y}
              rx={8.6}
              ry={6.2}
              fill="var(--ink)"
              fillOpacity={0.85}
              transform={`rotate(-20 ${x} ${y})`}
            />
          );
        })}

        {/* Haloed: the syllable row lands on a rung, and the rung has to give way. */}
        <SyllableRow xOf={xOf} y={textY} fontSize={11} halo={4} />
      </svg>
    </div>
  );
}
