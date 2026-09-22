"use client";

import "./clef-rake.css";
import ClefSign from "./ClefSign";
import type { ClefSignType } from "./lib/clefs";

/**
 * The three clef symbols, cold — on plain staves, with nothing explained.
 *
 * This is the hook, so it deliberately withholds everything the rest of the
 * piece is for: no middle C, no letters, no ladder, no hint that the shapes are
 * letters or that their height means anything. Just the three marks a reader
 * has seen at the start of every piece of music since they were small, and the
 * question of why there are three.
 *
 * Each symbol does sit on its real line — treble on the 2nd, bass on the 4th, C
 * on the 3rd — because that is what these look like in the wild and the figure
 * should not lie. What is withheld is that the line means anything at all. The
 * three staves are drawn at the same height so that comparing them across the
 * figure implies nothing about pitch; a reader can see the marks sit at
 * different heights without yet having a reason to care.
 *
 * Its own coordinates, not the ladder's, because nothing here is a pitch. The
 * vertical scale still has to match the ladder's 8px per step, though: the
 * glyph paths in `ClefSign` are drawn in absolute units sized to a 64-unit
 * staff, so a different line spacing would distort them.
 */

/** Line spacing. Two diatonic steps at the ladder's 8px, so the glyphs fit. */
const GAP = 16;
const STAFF_BOTTOM_Y = 104;

/** y of the k-th line up from the bottom, which is how `signLine` counts. */
const lineY = (k: number) => STAFF_BOTTOM_Y - k * GAP;

const STAFF_W = 110;
const STAFF_PITCH = 134;
const STAFF_X0 = 20;
/** The symbol sits just inside the staff's left edge, as it does on a real one. */
const SIGN_DX = 30;
const NAME_Y = 140;
const NOTE_Y = 156;

interface Glyph {
  type: ClefSignType;
  /** Which line the symbol is drawn on, 0 = bottom line. */
  signLine: number;
  name: string;
  /** Second line under the name. Only the odd one out needs one. */
  note?: string;
}

/**
 * The third one is left unnamed on purpose, and the joke does the work of the
 * explanation: naming it here would answer the question the piece is asking.
 * The first two being named flatly is what makes the third land.
 */
const GLYPHS: Glyph[] = [
  { type: "G", signLine: 1, name: "treble clef" },
  { type: "F", signLine: 3, name: "bass clef" },
  { type: "C", signLine: 2, name: "??", note: "maybe violists know" },
];

export default function ClefGlyphs({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`clef-rake clef-glyphs ${className}`.trim()}>
      <svg
        viewBox="0 26 418 146"
        aria-label="The three clef symbols on plain five-line staves: the treble clef, the bass clef, and a third one left unnamed."
      >
        {GLYPHS.map((glyph, i) => {
          const x0 = STAFF_X0 + i * STAFF_PITCH;
          const x1 = x0 + STAFF_W;

          return (
            <g key={glyph.name}>
              {[0, 1, 2, 3, 4].map((k) => (
                <line
                  key={k}
                  x1={x0}
                  x2={x1}
                  y1={lineY(k)}
                  y2={lineY(k)}
                  stroke="var(--line)"
                  strokeWidth={3.5}
                  strokeLinecap="round"
                />
              ))}

              <ClefSign
                type={glyph.type}
                x={x0 + SIGN_DX}
                y={lineY(glyph.signLine)}
              />

              <text
                x={x0 + STAFF_W / 2}
                y={NAME_Y}
                textAnchor="middle"
                fontSize={13}
                fill="var(--soft)"
              >
                {glyph.name}
              </text>

              {glyph.note && (
                <text
                  x={x0 + STAFF_W / 2}
                  y={NOTE_Y}
                  textAnchor="middle"
                  fontSize={10.5}
                  fontStyle="italic"
                  fill="var(--soft)"
                  fillOpacity={0.75}
                >
                  {glyph.note}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
