import { topPitch } from "./lib/clefs";
import { ledgerCount } from "./lib/ledger";
import type { Instrument } from "./lib/instruments";
import type { Diatonic } from "./lib/pitch";
import { LEDGER_LABEL_X, LEDGER_X0, LEDGER_X1, yOf } from "./layout";
import HaloText from "./HaloText";

interface Props {
  bottom: Diatonic;
  instrument: Instrument;
}

const EMPHASIS = { fontSize: 11, fontWeight: 600, fill: "var(--ink)" } as const;
const ASIDE = { fontSize: 10, fill: "var(--soft)" } as const;

function phrase(n: number): string {
  return n ? `${n} ledger line${n > 1 ? "s" : ""}` : "no ledger lines";
}

/**
 * Ledger lines for the selected instrument, plus the running count.
 *
 * Solid lines cover the everyday range, faded ones the extremes—so the cost of
 * slicing the ladder in the wrong place is visible rather than asserted.
 */
export default function RangeLayer({ bottom, instrument }: Props) {
  const top = topPitch(bottom);
  const [eLo, eHi] = instrument.ext;
  const [cLo, cHi] = instrument.core;

  const below: Diatonic[] = [];
  for (let d = bottom - 2; d >= eLo; d -= 2) below.push(d);
  const above: Diatonic[] = [];
  for (let d = top + 2; d <= eHi; d += 2) above.push(d);

  const core = ledgerCount(cLo, cHi, bottom);
  const ext = ledgerCount(eLo, eHi, bottom);

  // Park the labels just past the outermost ledger line, then clamp them
  // inside the viewBox.
  let yAbove = (ext.above ? yOf(top + 2 * ext.above) : yOf(top)) - 10;
  yAbove = Math.max(yAbove, ext.above > core.above ? 26 : 13);
  let yBelow = (ext.below ? yOf(bottom - 2 * ext.below) : yOf(bottom)) + 18;
  yBelow = Math.min(yBelow, ext.below > core.below ? 362 : 375);

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

      {ext.above > core.above ? (
        <>
          <HaloText x={LEDGER_LABEL_X} y={yAbove - 13} {...EMPHASIS} halo={4}>
            {phrase(core.above)}
          </HaloText>
          <HaloText x={LEDGER_LABEL_X} y={yAbove} {...ASIDE} halo={4}>
            {`${ext.above} at the extreme`}
          </HaloText>
        </>
      ) : (
        <HaloText x={LEDGER_LABEL_X} y={yAbove} {...EMPHASIS} halo={4}>
          {phrase(core.above)}
        </HaloText>
      )}

      <HaloText x={LEDGER_LABEL_X} y={yBelow} {...EMPHASIS} halo={4}>
        {phrase(core.below)}
      </HaloText>
      {ext.below > core.below && (
        <HaloText x={LEDGER_LABEL_X} y={yBelow + 13} {...ASIDE} halo={4}>
          {`${ext.below} at the extreme`}
        </HaloText>
      )}
    </>
  );
}
