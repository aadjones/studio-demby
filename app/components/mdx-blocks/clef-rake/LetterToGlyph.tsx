"use client";

import "./clef-rake.css";
import ClefSign from "./ClefSign";
import type { ClefSignType } from "./lib/clefs";

/**
 * Each plain letter beside the symbol it turned into.
 *
 * Deliberately NOT a morph. The sources support the claim that the reference
 * line was originally labelled with the plain letter and that those letters
 * became stylised over time — Wikipedia's Clef article says exactly that — but
 * none I could reach gives dated intermediate shapes. Drawing a sequence of
 * in-between forms would mean inventing them and presenting the invention as
 * history, so the figure shows only the two ends and lets the reader see the
 * resemblance for themselves.
 *
 * Same order as section 0, so the three shapes the reader met cold at the top
 * of the piece come back here explained — including the one that was labelled
 * "??" and now gets its name.
 */

const LETTER_SIZE = 62;
const GLYPH_Y = 72;
/** Optical centring of a cap-height letter against the glyph beside it. */
const LETTER_BASELINE = GLYPH_Y + 22;
const CAPTION_Y = 130;

const COL_X0 = 10;
const COL_PITCH = 150;
const LETTER_DX = 26;
const ARROW_X0 = 56;
const ARROW_X1 = 86;
const GLYPH_DX = 114;

interface Pair {
  letter: string;
  type: ClefSignType;
  name: string;
}

const PAIRS: Pair[] = [
  { letter: "G", type: "G", name: "treble clef" },
  { letter: "F", type: "F", name: "bass clef" },
  { letter: "C", type: "C", name: "C clef" },
];

function Arrow({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  return (
    <g
      stroke="var(--soft)"
      strokeOpacity={0.8}
      fill="none"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1={x0} x2={x1} y1={y} y2={y} />
      <polyline points={`${x1 - 6},${y - 5} ${x1},${y} ${x1 - 6},${y + 5}`} />
    </g>
  );
}

export default function LetterToGlyph({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`clef-rake letter-to-glyph ${className}`.trim()}>
      <svg
        viewBox="0 8 460 140"
        aria-label="Each plain letter beside the clef symbol it became: G and the treble clef, F and the bass clef, C and the C clef."
      >
        {PAIRS.map((pair, i) => {
          const x0 = COL_X0 + i * COL_PITCH;

          return (
            <g key={pair.name}>
              <text
                x={x0 + LETTER_DX}
                y={LETTER_BASELINE}
                textAnchor="middle"
                fontSize={LETTER_SIZE}
                fontWeight={600}
                fill="var(--ink)"
                fillOpacity={0.45}
              >
                {pair.letter}
              </text>

              <Arrow x0={x0 + ARROW_X0} x1={x0 + ARROW_X1} y={GLYPH_Y} />

              <ClefSign type={pair.type} x={x0 + GLYPH_DX} y={GLYPH_Y} />

              <text
                x={x0 + 70}
                y={CAPTION_Y}
                textAnchor="middle"
                fontSize={12}
                fill="var(--soft)"
              >
                {pair.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
