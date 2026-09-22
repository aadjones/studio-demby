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
 * that note's line.
 *
 * The letter alone. It used to carry a dot on the line beside it, meant to make
 * the pointing unambiguous, but next to a staff full of note heads the dot read
 * as one more note — so it pointed at the wrong idea instead. The letter is
 * centred on its line, which is enough.
 *
 * This is the clef with its costume off. It renders at the same position as
 * `ClefSign`, so the end-of-explainer reveal swaps one for the other with
 * nothing moving.
 */
export default function ClefMarker({ type, x, y }: Props) {
  return (
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
  );
}
