"use client";

import "./clef-rake.css";
import { HIGH, LOW, noteName, type Diatonic } from "./lib/pitch";
import {
  LADDER_LABEL_X,
  LADDER_TICK_X0,
  LADDER_TICK_X1,
  NOTE_COLS,
  VIEW_H,
  VIEW_W_NO_NOTCHES,
  yOf,
} from "./layout";
import PitchGrid from "./PitchGrid";

/**
 * The ladder alone: every note from C1 to C7, stacked, with no staff and
 * nothing to orient by.
 *
 * Section 2 shows this before any staff exists, so the reader feels how much
 * there is before being handed the five-line slice that tames it. Showing the
 * staff here would answer the question before it has been asked.
 *
 * Deliberately identical geometry to `ClefRake` — same `yOf`, same note
 * columns, same scale — so that when the staff slides onto it in section 3 it
 * is visibly *this* ladder, not a second drawing of one.
 */
export default function PitchLadder({
  className = "",
}: {
  className?: string;
}) {
  const notes: Diatonic[] = [];
  for (let d = LOW; d <= HIGH; d++) notes.push(d);

  return (
    <div className={`clef-rake pitch-ladder ${className}`.trim()}>
      <svg
        viewBox={`0 0 ${VIEW_W_NO_NOTCHES} ${VIEW_H}`}
        aria-label="Every note from C1 to C7 stacked in one tall ladder, with no staff."
      >
        <PitchGrid />

        {notes.map((d) => {
          const x = NOTE_COLS[d % 2];
          const y = yOf(d);
          const isC = d % 7 === 0;

          return (
            <g key={d}>
              <ellipse
                cx={x}
                cy={y}
                rx={8.6}
                ry={6.2}
                fill="var(--ink)"
                fillOpacity={0.85}
                transform={`rotate(-20 ${x} ${y})`}
              />
              {isC && (
                <>
                  {/*
                    Every C is labelled identically, middle C included. Singling
                    it out would hand the reader an anchor, and the whole point
                    of this figure is that there isn't one yet.
                  */}
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
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
