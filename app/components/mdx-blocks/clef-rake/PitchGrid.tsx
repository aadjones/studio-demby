import { topPitch } from "./lib/clefs";
import { HIGH, LOW, MIDDLE_C, isLine, type Diatonic } from "./lib/pitch";
import { STAFF_X0, STAFF_X1, yOf } from "./layout";

interface Props {
  /**
   * Bottom line of the staff currently sitting on the ladder. Omit it to draw
   * every rung — the bare ladder, before any staff exists to hide part of it.
   */
  bottom?: Diatonic;
  /** Right edge of the rungs. Shorter when the clef stops need the room. */
  x1?: number;
}

/** Three dots above C7 or below C1: in theory the ladder never ends. */
function Continues({
  from,
  direction,
  x,
}: {
  from: number;
  direction: 1 | -1;
  /** Centre of the rungs, so the dots stay centred when they are shortened. */
  x: number;
}) {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={x}
          cy={from + direction * (9 + i * 8)}
          r={1.5}
          fill="var(--soft)"
          fillOpacity={0.55}
        />
      ))}
    </g>
  );
}

/**
 * The faint ladder behind everything: every line the staff *could* have, drawn
 * where the staff currently isn't, and the dots at both ends saying it does not
 * really stop there.
 *
 * This is the whole pedagogical point made visible—the five-line staff is a
 * window onto an endless stack of notes, not a thing in itself. The dots live
 * here rather than in any one figure so that every ladder gets the same pair;
 * they need `ladderViewBox`, which is the only viewBox with room for them.
 */
export default function PitchGrid({ bottom, x1 = STAFF_X1 }: Props) {
  const continuesX = (STAFF_X0 + x1) / 2;
  const rungs: Diatonic[] = [];
  if (bottom === undefined) {
    // No staff yet: every other step is a rung. The phase is set by middle C,
    // because every clef in CLEFS has an even `bottom` and so every staff that
    // can arrive later puts its lines on even steps too. Phasing off the foot
    // of the ladder instead would leave this figure a step out from every one
    // that follows it, and C4 — the note the whole explainer pivots on —
    // stranded in a space. C1 lands in a space instead, which is what happens
    // to it under a real clef anyway.
    for (let d = LOW; d <= HIGH; d++) if (isLine(d, MIDDLE_C)) rungs.push(d);
  } else {
    const top = topPitch(bottom);
    for (let d = LOW; d <= HIGH; d++) {
      if (isLine(d, bottom) && (d < bottom || d > top)) rungs.push(d);
    }
  }

  return (
    <>
      <Continues from={yOf(HIGH)} direction={-1} x={continuesX} />
      <Continues from={yOf(LOW)} direction={1} x={continuesX} />

      {rungs.map((d) => (
        <line
          key={d}
          x1={STAFF_X0}
          x2={x1}
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
