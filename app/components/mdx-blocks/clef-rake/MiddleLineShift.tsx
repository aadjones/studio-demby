"use client";

import "./clef-rake.css";
import { MIDDLE_C, letterOf, type Diatonic } from "./lib/pitch";
import { yOf } from "./layout";
import HaloText from "./HaloText";
import StaffLines from "./StaffLines";

/**
 * The same ladder, two window positions: middle line C, then a third up, middle
 * line E — and D sitting in the space the jump passes over.
 *
 * Both windows are drawn on **one** run of rungs rather than as two separate
 * pictures side by side. That is the whole claim: nothing about the ladder
 * changed, only where the five lines were grabbed. Two independent drawings
 * would let a reader think the second staff had its notes relabelled.
 *
 * Deliberately one SVG and no grid. Two figures in a CSS row would need a
 * breakpoint and would either shrink to nothing or stack on a phone; inside a
 * single viewBox the pair scales together and stays side by side everywhere.
 */

/** Window positions. A staff's middle line is `bottom + 4`. */
const BEFORE: Diatonic = MIDDLE_C - 4;
const AFTER: Diatonic = BEFORE + 2;

const VIEW_X = 0;
const VIEW_Y = 112;
const VIEW_W = 400;
const VIEW_H = 154;

const RUNG_X0 = 14;
const RUNG_X1 = 386;

/**
 * Letters on lines sit at `line`, letters in spaces at `space`. A line and the
 * space above it are only eight units apart — closer than the type is tall — so
 * they are pushed apart horizontally instead, the same trick `NoteLadder` uses.
 */
const LEFT = { x0: 16, x1: 132, line: 147, space: 168, mid: 74 };
const RIGHT = { x0: 238, x1: 354, line: 369, space: 390, mid: 296 };

/** Clear of the lowest rung, so nothing is drawn through the captions. */
const CAPTION_Y = 252;

/** Every rung the figure has room for — the ladder both windows sit on. */
function Rungs() {
  const rungs: Diatonic[] = [];
  for (let d = MIDDLE_C - 6; d <= MIDDLE_C + 8; d += 2) rungs.push(d);

  return (
    <>
      {rungs.map((d) => (
        <line
          key={d}
          x1={RUNG_X0}
          x2={RUNG_X1}
          y1={yOf(d)}
          y2={yOf(d)}
          stroke="var(--line)"
          strokeOpacity={0.18}
          strokeWidth={1}
        />
      ))}
    </>
  );
}

/**
 * One window, with its middle line named.
 *
 * `skipped` adds the space immediately above — the note the next window jumps
 * straight past. It sits at its own x so it cannot collide with the letters on
 * the lines, the same offset trick `NoteLadder` uses.
 */
function Window({
  bottom,
  box,
  caption,
  skipped = false,
}: {
  bottom: Diatonic;
  box: { x0: number; x1: number; line: number; space: number; mid: number };
  caption: string;
  skipped?: boolean;
}) {
  const middle = bottom + 4;

  return (
    <g>
      <StaffLines bottom={bottom} x0={box.x0} x1={box.x1} />

      <HaloText
        halo={5}
        x={box.line}
        y={yOf(middle) + 4}
        fontSize={15}
        fontWeight={700}
        textAnchor="middle"
        fill="var(--ink)"
      >
        {letterOf(middle)}
      </HaloText>

      {skipped && (
        <>
          <HaloText
            halo={5}
            x={box.space}
            y={yOf(middle + 1) + 4}
            fontSize={13}
            textAnchor="middle"
            fill="var(--soft)"
          >
            {letterOf(middle + 1)}
          </HaloText>
          <HaloText
            halo={5}
            x={box.line}
            y={yOf(middle + 2) + 4}
            fontSize={13}
            textAnchor="middle"
            fill="var(--soft)"
          >
            {letterOf(middle + 2)}
          </HaloText>
        </>
      )}

      <text
        x={box.mid}
        y={CAPTION_Y}
        textAnchor="middle"
        fontSize={13}
        fill="var(--soft)"
      >
        {caption}
      </text>
    </g>
  );
}

/**
 * The move itself: up one line. It climbs exactly the third the staff climbs,
 * so the arrow is not merely decorative — its slope is the figure's claim.
 */
function Arrow() {
  const x0 = 194;
  const x1 = 222;
  const y0 = yOf(MIDDLE_C);
  const y1 = yOf(MIDDLE_C + 2);
  const angle = Math.atan2(y1 - y0, x1 - x0);
  const head = (spread: number) => {
    const a = angle + spread;
    return `${x1 - 7 * Math.cos(a)},${y1 - 7 * Math.sin(a)}`;
  };

  return (
    <g
      stroke="var(--soft)"
      strokeOpacity={0.8}
      fill="none"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1={x0} x2={x1} y1={y0} y2={y1} />
      <polyline points={`${head(0.5)} ${x1},${y1} ${head(-0.5)}`} />
    </g>
  );
}

export default function MiddleLineShift({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`clef-rake middle-line-shift ${className}`.trim()}>
      <svg
        viewBox={`${VIEW_X} ${VIEW_Y} ${VIEW_W} ${VIEW_H}`}
        aria-label="The same ladder with a five-line staff in two positions. On the left the middle line is C, with D in the space above it; on the right the staff has moved up one line and the middle line is E, D having been passed over."
      >
        <Rungs />

        <Window bottom={BEFORE} box={LEFT} caption="middle line: C" skipped />
        <Window bottom={AFTER} box={RIGHT} caption="middle line: E" />

        <Arrow />
      </svg>
    </div>
  );
}
