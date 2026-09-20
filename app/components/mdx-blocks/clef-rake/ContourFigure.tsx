"use client";

import "./clef-rake.css";

/**
 * "Twinkle, twinkle, little star" drawn as pure contour: marks floating at
 * varying heights over a fixed line of syllables, with no staff and no
 * reference of any kind.
 *
 * The companion to the manuscript figure beside it. A real adiastematic
 * manuscript does not even carry this much — there the height of a mark means
 * nothing at all — so this is deliberately the *generous* version of the idea,
 * and still not enough to name a single pitch.
 *
 * Scale degrees, C major:
 *   Twin kle twin kle lit tle star  →  1 1 5 5 6 6 5
 *   How  I   won  der what you are  →  4 4 3 3 2 2 1
 */

interface Syllable {
  text: string;
  /** Scale degree, 1–7. Height only; no octave, no absolute pitch. */
  degree: number;
}

const SYSTEM_1: Syllable[] = [
  { text: "Twin", degree: 1 },
  { text: "kle", degree: 1 },
  { text: "twin", degree: 5 },
  { text: "kle", degree: 5 },
  { text: "lit", degree: 6 },
  { text: "tle", degree: 6 },
  { text: "star", degree: 5 },
];

const SYSTEM_2: Syllable[] = [
  { text: "How", degree: 4 },
  { text: "I", degree: 4 },
  { text: "won", degree: 3 },
  { text: "der", degree: 3 },
  { text: "what", degree: 2 },
  { text: "you", degree: 2 },
  { text: "are", degree: 1 },
];

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
      {syllables.map((s, i) => (
        <text
          key={`t-${s.text}-${i}`}
          x={xOf(i)}
          y={textY}
          textAnchor="middle"
          fontSize={15}
          fill="var(--ink)"
        >
          {s.text}
        </text>
      ))}
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
        viewBox="0 0 380 292"
        aria-label="The melody of Twinkle Twinkle Little Star drawn as contour: marks at varying heights above two lines of syllables, with no staff lines."
      >
        {/*
          Both systems use the same degree-to-pixel scale, so the shape within
          each is true. The break between them is a break, exactly as a system
          break is on a real page — the eye should not read the vertical gap
          between "star" and "How" as the size of that step.
        */}
        <System syllables={SYSTEM_1} markBase={122} textY={150} />
        <System syllables={SYSTEM_2} markBase={248} textY={276} />
      </svg>
    </div>
  );
}
