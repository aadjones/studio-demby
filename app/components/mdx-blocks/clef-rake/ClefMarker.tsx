import type { ClefSignType } from "./lib/clefs";
import HaloText from "./HaloText";

interface Props {
  type: ClefSignType;
  x: number;
  y: number;
}

const FONT_SIZE = 30;
/** Optical centring. Avoids `dominant-baseline`, which Safari is unreliable about. */
const BASELINE_NUDGE = FONT_SIZE * 0.35;

/**
 * The default marker: the plain letter of the note this clef names, sitting on
 * that note's line, with a dot on the line beside it so the pointing is
 * unambiguous.
 *
 * This is the clef with its costume off. It renders at the same position as
 * `ClefSign`, so the end-of-explainer reveal swaps one for the other with
 * nothing moving.
 */
export default function ClefMarker({ type, x, y }: Props) {
  return (
    <g>
      <HaloText
        x={x}
        y={y + BASELINE_NUDGE}
        fontSize={FONT_SIZE}
        fontWeight={600}
        textAnchor="middle"
        fill="var(--ink)"
        halo={6}
      >
        {type}
      </HaloText>
      <circle cx={x + 19} cy={y} r={3.4} fill="var(--ink)" />
    </g>
  );
}
