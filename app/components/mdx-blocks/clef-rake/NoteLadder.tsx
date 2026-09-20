import { topPitch } from "./lib/clefs";
import type { Instrument } from "./lib/instruments";
import {
  HIGH,
  LOW,
  MIDDLE_C,
  letterOf,
  noteName,
  type Diatonic,
  type NameSystem,
} from "./lib/pitch";
import {
  LADDER_LABEL_X,
  LADDER_TICK_X0,
  LADDER_TICK_X1,
  NOTE_COLS,
  STAFF_LABEL_DX,
  STAFF_LABEL_X,
  yOf,
} from "./layout";
import HaloText from "./HaloText";

interface Props {
  bottom: Diatonic;
  instrument: Instrument | null;
  nameSystem: NameSystem;
}

/**
 * Every note in the ladder, plus the labels that only make sense once the
 * staff is sitting somewhere.
 *
 * Opacity carries the range: solid for the instrument's everyday range, half
 * for its extremes, ghosted for everything it cannot play. With no instrument
 * selected, the staff itself does the highlighting.
 */
export default function NoteLadder({ bottom, instrument, nameSystem }: Props) {
  const top = topPitch(bottom);
  const notes: Diatonic[] = [];
  for (let d = LOW; d <= HIGH; d++) notes.push(d);

  function opacity(d: Diatonic, onStaff: boolean): number {
    if (instrument) {
      const [eLo, eHi] = instrument.ext;
      const [cLo, cHi] = instrument.core;
      if (d >= cLo && d <= cHi) return 1;
      if (d >= eLo && d <= eHi) return 0.42;
      return 0.14;
    }
    return onStaff ? 1 : 0.14;
  }

  return (
    <>
      {notes.map((d) => {
        const x = NOTE_COLS[d % 2];
        const y = yOf(d);
        const onStaff = d >= bottom && d <= top;
        const isC = d % 7 === 0;
        const isMiddleC = d === MIDDLE_C;

        return (
          <g key={d}>
            <ellipse
              cx={x}
              cy={y}
              rx={9.5}
              ry={7.07}
              fill="var(--ink)"
              fillOpacity={opacity(d, onStaff)}
              transform={`rotate(-20 ${x} ${y})`}
            />

            {isC && (
              <>
                <text
                  x={LADDER_LABEL_X}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={isMiddleC ? 12 : 11}
                  fontWeight={isMiddleC ? 600 : 400}
                  fill={isMiddleC ? "var(--ink)" : "var(--soft)"}
                >
                  {isMiddleC
                    ? "middle C"
                    : nameSystem === "solfege"
                      ? "Do"
                      : noteName(d)}
                </text>
                <line
                  x1={LADDER_TICK_X0}
                  x2={LADDER_TICK_X1}
                  y1={y}
                  y2={y}
                  stroke={isMiddleC ? "var(--ink)" : "var(--soft)"}
                  strokeWidth={isMiddleC ? 1.6 : 1}
                />
              </>
            )}

            {onStaff && (
              <HaloText
                x={STAFF_LABEL_X + ((d - bottom) % 2) * STAFF_LABEL_DX}
                y={y + 4}
                fontSize={12}
                fontWeight={600}
                textAnchor="middle"
                fill="var(--ink)"
                halo={5}
              >
                {letterOf(d, nameSystem)}
              </HaloText>
            )}
          </g>
        );
      })}
    </>
  );
}
