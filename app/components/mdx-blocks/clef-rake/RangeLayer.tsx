import { topPitch } from "./lib/clefs";
import type { Instrument } from "./lib/instruments";
import type { Diatonic } from "./lib/pitch";
import { LEDGER_X0, LEDGER_X1, yOf } from "./layout";

interface Props {
  bottom: Diatonic;
  instrument: Instrument;
}

/**
 * Ledger lines for the selected instrument.
 *
 * Solid lines cover the everyday range, faded ones the extremes—so the cost of
 * slicing the ladder in the wrong place is visible rather than asserted.
 *
 * The lines used to carry a written count beside them ("2 ledger lines", "6 at
 * the extreme"). They are gone: the reader can see how many there are, and the
 * labels crowded the clef stops. The count still exists in `lib/ledger` and is
 * still tested — it just is not drawn.
 */
export default function RangeLayer({ bottom, instrument }: Props) {
  const top = topPitch(bottom);
  const [eLo, eHi] = instrument.ext;
  const [cLo, cHi] = instrument.core;

  const below: Diatonic[] = [];
  for (let d = bottom - 2; d >= eLo; d -= 2) below.push(d);
  const above: Diatonic[] = [];
  for (let d = top + 2; d <= eHi; d += 2) above.push(d);

  return (
    <>
      {below.map((d) => (
        <line
          key={`b${d}`}
          x1={LEDGER_X0}
          x2={LEDGER_X1}
          y1={yOf(d)}
          y2={yOf(d)}
          stroke="var(--ink)"
          strokeOpacity={d >= cLo ? 1 : 0.4}
          strokeWidth={1.5}
        />
      ))}
      {above.map((d) => (
        <line
          key={`a${d}`}
          x1={LEDGER_X0}
          x2={LEDGER_X1}
          y1={yOf(d)}
          y2={yOf(d)}
          stroke="var(--ink)"
          strokeOpacity={d <= cHi ? 1 : 0.4}
          strokeWidth={1.5}
        />
      ))}

    </>
  );
}
