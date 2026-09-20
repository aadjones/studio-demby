import { CLEFS, type Clef } from "./lib/clefs";
import {
  NOTCH_H,
  NOTCH_LABEL_X,
  NOTCH_TICK_X0,
  NOTCH_TICK_X1,
  NOTCH_W,
  NOTCH_X,
  yOf,
} from "./layout";

interface Props {
  current: Clef;
  onSelect: (clef: Clef) => void;
}

/**
 * The seven clickable stops down the right-hand edge—the "rake" the staff
 * snaps to. Each is a button in its own right, so the whole thing is reachable
 * by keyboard without a drag.
 */
export default function ClefNotches({ current, onSelect }: Props) {
  return (
    <>
      {CLEFS.map((clef) => {
        const y = yOf(clef.bottom);
        const on = clef.bottom === current.bottom;

        return (
          <g
            key={clef.bottom}
            className="notch"
            role="button"
            tabIndex={0}
            aria-label={`${clef.name} clef`}
            aria-pressed={on}
            data-clef={clef.name}
            onClick={() => onSelect(clef)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(clef);
              }
            }}
          >
            <title>{`${clef.name} clef`}</title>
            <rect
              x={NOTCH_X}
              y={y - NOTCH_H / 2}
              width={NOTCH_W}
              height={NOTCH_H}
              rx={4}
              fill={on ? "var(--ink)" : "transparent"}
              fillOpacity={on ? 0.08 : 0}
            />
            <line
              x1={NOTCH_TICK_X0}
              x2={NOTCH_TICK_X1}
              y1={y}
              y2={y}
              stroke={on ? "var(--ink)" : "var(--soft)"}
              strokeWidth={on ? 3 : 1.5}
            />
            <text
              x={NOTCH_LABEL_X}
              y={y + 4}
              fontSize={10}
              fill={on ? "var(--ink)" : "var(--soft)"}
              fontWeight={on ? 600 : 400}
            >
              {clef.short}
            </text>
          </g>
        );
      })}
    </>
  );
}
