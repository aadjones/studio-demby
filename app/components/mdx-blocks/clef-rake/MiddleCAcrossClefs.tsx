"use client";

import "./clef-rake.css";
import { CLEFS, topPitch } from "./lib/clefs";
import { MIDDLE_C, type Diatonic } from "./lib/pitch";

/**
 * All seven staves at their true heights, with middle C running level through
 * the lot of them.
 *
 * The figure works because middle C is one pitch, not seven. Draw every staff
 * where it actually sits on the ladder and middle C lands at a single height
 * across the whole picture: the staves staircase upward, and middle C walks
 * down through them. Off the top of the first, onto each of the five lines in
 * turn, off the bottom of the last.
 *
 * Built from `CLEFS` rather than from seven hardcoded positions, so it cannot
 * drift from the widgets if the clef set is ever edited again.
 *
 * Its own vertical scale, not the ladder's. At the ladder's 8px per step a
 * staff here would be taller than it is wide and stop reading as a staff; this
 * figure is a summary rather than another view of the ladder, so it is free to
 * compress. Nothing else depends on its geometry.
 */

/**
 * Four units per step, so a staff comes out wider than it is tall and still
 * reads as a staff. At the ladder's 8 it would be a narrow column.
 */
const STEP = 4;
/** Treble's top line — the highest thing drawn. */
const TOP_D: Diatonic = 38;
const Y_TOP = 26;

const yAt = (d: Diatonic) => Y_TOP + (TOP_D - d) * STEP;

const STAFF_X0 = 58;
const STAFF_W = 42;
/**
 * The gap matters more than it looks. Neighbouring staves overlap in height by
 * design — that is the staircase — so with too little space between them the
 * seven merge into one field of horizontal lines and stop being countable.
 */
const STAFF_PITCH = 58;

const GUIDE_X0 = 10;
const GUIDE_X1 = 452;
const LABEL_X = 50;
const CAPTION_Y = 122;

const MIDDLE_C_Y = yAt(MIDDLE_C);

const xOf = (i: number) => STAFF_X0 + i * STAFF_PITCH;
const centreOf = (i: number) => xOf(i) + STAFF_W / 2;

export default function MiddleCAcrossClefs({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`clef-rake middle-c-across ${className}`.trim()}>
      <svg
        viewBox="-16 10 492 130"
        aria-label="The seven staves side by side at their true pitches, stepping upward from left to right. Middle C stays at one height across all of them: above the first staff, then on the bottom, second, third, fourth and top line of the middle five, then below the last staff."
      >
        {/*
          Dashed, so it reads as "one pitch, held level" rather than as a line
          anyone is meant to play. The two real ledger lines below are solid,
          which is what keeps them distinguishable from it.
        */}
        <line
          x1={GUIDE_X0}
          x2={GUIDE_X1}
          y1={MIDDLE_C_Y}
          y2={MIDDLE_C_Y}
          stroke="var(--soft)"
          strokeOpacity={0.4}
          strokeWidth={1}
          strokeDasharray="3 4"
        />
        <text
          x={LABEL_X}
          y={MIDDLE_C_Y + 4}
          textAnchor="end"
          fontSize={12}
          fontWeight={600}
          fill="var(--ink)"
        >
          middle C
        </text>

        {CLEFS.map((clef, i) => {
          const x0 = xOf(i);
          const x1 = x0 + STAFF_W;
          const cx = centreOf(i);
          const onStaff =
            MIDDLE_C >= clef.bottom && MIDDLE_C <= topPitch(clef.bottom);

          return (
            <g key={clef.name}>
              {[0, 1, 2, 3, 4].map((k) => {
                const y = yAt(clef.bottom + 2 * k);
                return (
                  <line
                    key={k}
                    x1={x0}
                    x2={x1}
                    y1={y}
                    y2={y}
                    stroke="var(--line)"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Off the staff: it needs a ledger line, which is the point. */}
              {!onStaff && (
                <line
                  x1={cx - 9}
                  x2={cx + 9}
                  y1={MIDDLE_C_Y}
                  y2={MIDDLE_C_Y}
                  stroke="var(--line)"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              )}

              <ellipse
                cx={cx}
                cy={MIDDLE_C_Y}
                rx={4.6}
                ry={3.4}
                fill="var(--ink)"
                transform={`rotate(-20 ${cx} ${MIDDLE_C_Y})`}
              />
            </g>
          );
        })}

        {(
          [
            [centreOf(0), "off the top"],
            [(xOf(1) + xOf(5) + STAFF_W) / 2, "on each of the 5 lines"],
            [centreOf(CLEFS.length - 1), "off the bottom"],
          ] as const
        ).map(([x, text]) => (
          <text
            key={text}
            x={x}
            y={CAPTION_Y}
            textAnchor="middle"
            fontSize={11}
            fill="var(--soft)"
          >
            {text}
          </text>
        ))}
      </svg>
    </div>
  );
}
