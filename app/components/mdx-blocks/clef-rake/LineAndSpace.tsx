"use client";

import "./clef-rake.css";
import { MIDDLE_C, isLine, letterOf, type Diatonic } from "./lib/pitch";
import { yOf } from "./layout";
import HaloText from "./HaloText";

/**
 * Two rungs of the ladder, close up, and every note they can hold: B in the
 * space below, C on a line, D between, E on a line, F in the space above.
 * Five notes from two lines is the small case section 3 scales up from—five
 * lines hold eleven.
 *
 * Same `yOf` as every other figure, cropped tight so the gap is big enough to
 * see a note head fill it.
 */

const NOTES: Diatonic[] = [
  MIDDLE_C - 1,
  MIDDLE_C,
  MIDDLE_C + 1,
  MIDDLE_C + 2,
  MIDDLE_C + 3,
];
const NOTE_X = [30, 72, 114, 156, 198];

/**
 * Narrow on purpose: the gap between two rungs is only 16 units, so the
 * window has to be small for the rendered gap to be big enough to read.
 */
const VIEW_X = 0;
const VIEW_Y = 150;
const VIEW_W = 240;
const VIEW_H = 76;

const LINE_X0 = 14;
const LINE_X1 = 226;
/** Letters sit just right of each head. */
const LETTER_DX = 16;
/** Below the lowest head, so the captions are not drawn through. */
const CAPTION_Y = yOf(MIDDLE_C) + 30;

export default function LineAndSpace({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`clef-rake line-and-space ${className}`.trim()}>
      <svg
        viewBox={`${VIEW_X} ${VIEW_Y} ${VIEW_W} ${VIEW_H}`}
        aria-label="Two lines close up, holding five notes: B in the space below, C on the lower line, D in the space between, E on the upper line, and F in the space above."
      >
        {[MIDDLE_C, MIDDLE_C + 2].map((d) => (
          <line
            key={d}
            x1={LINE_X0}
            x2={LINE_X1}
            y1={yOf(d)}
            y2={yOf(d)}
            stroke="var(--line)"
            strokeWidth={3.5}
            strokeLinecap="round"
          />
        ))}

        {NOTES.map((d, i) => {
          const x = NOTE_X[i];
          const y = yOf(d);
          return (
            <g key={d}>
              <ellipse
                cx={x}
                cy={y}
                rx={9.5}
                ry={7.07}
                fill="var(--ink)"
                transform={`rotate(-20 ${x} ${y})`}
              />
              <HaloText
                halo={4}
                x={x + LETTER_DX}
                y={y + 4.5}
                fontSize={11}
                fontWeight={700}
                fill="var(--ink)"
              >
                {letterOf(d)}
              </HaloText>
              <text
                x={x}
                y={CAPTION_Y}
                textAnchor="middle"
                fontSize={9}
                fill="var(--soft)"
              >
                {isLine(d, MIDDLE_C) ? "line" : "space"}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
