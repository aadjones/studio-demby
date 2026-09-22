"use client";

import "./clef-rake.css";
import { PHRASE, type Syllable } from "./lib/twinkle";
import SyllableRow from "./SyllableRow";

/**
 * "Twinkle, twinkle, little star" drawn as pure contour: marks floating at
 * varying heights over a fixed line of syllables, with no staff and no
 * reference of any kind.
 *
 * Only the first phrase. Seven syllables are enough to make the point, and a
 * shorter figure keeps the whole idea inside one glance.
 *
 * A real adiastematic manuscript does not even carry this much — there the
 * height of a mark means nothing at all — so this is deliberately the
 * *generous* version of the idea, and still not enough to name a single pitch.
 *
 * The tune itself lives in `lib/twinkle`, shared with the ladder in section 2 —
 * the two figures have to show the same phrase.
 */

const X_START = 42;
const X_STEP = 50;
/** Vertical distance between adjacent scale degrees. */
const DEGREE_PX = 15;

const xOf = (i: number) => X_START + i * X_STEP;

function System({
  syllables,
  markBase,
  textY,
}: {
  syllables: Syllable[];
  /** y of degree 1 for this system; higher degrees sit above it. */
  markBase: number;
  textY: number;
}) {
  const yOf = (degree: number) => markBase - (degree - 1) * DEGREE_PX;
  const points = syllables
    .map((s, i) => `${xOf(i)},${yOf(s.degree)}`)
    .join(" ");

  return (
    <g>
      {/* The trace is a reading aid, kept faint so the marks stay primary. */}
      <polyline
        points={points}
        fill="none"
        stroke="var(--line)"
        strokeOpacity={0.3}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {syllables.map((s, i) => {
        const x = xOf(i);
        const y = yOf(s.degree);
        return (
          <ellipse
            key={`${s.text}-${i}`}
            cx={x}
            cy={y}
            rx={6}
            ry={4.6}
            fill="var(--ink)"
            transform={`rotate(-20 ${x} ${y})`}
          />
        );
      })}
      {/* No halo: there is nothing drawn behind the words in this figure. */}
      <SyllableRow xOf={xOf} y={textY} fontSize={15} />
    </g>
  );
}

export default function ContourFigure({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`clef-rake contour-figure ${className}`.trim()}>
      <svg
        viewBox="0 0 380 166"
        aria-label="The opening phrase of Twinkle Twinkle Little Star drawn as contour: marks at varying heights above a line of syllables, with no staff lines."
      >
        {/*
          Same degree-to-pixel scale and the same markBase as before the figure
          was cut back to one phrase, so the shape reads at exactly the size it
          always did — only the canvas below it is gone.
        */}
        <System syllables={PHRASE} markBase={122} textY={150} />
      </svg>
    </div>
  );
}
