import { topPitch } from "./lib/clefs";
import { HIGH, LOW, isLine, type Diatonic } from "./lib/pitch";
import { STAFF_X0, STAFF_X1, yOf } from "./layout";

interface Props {
  bottom: Diatonic;
}

/**
 * The faint ladder behind everything: every line the staff *could* have, drawn
 * where the staff currently isn't.
 *
 * This is the whole pedagogical point made visible—the five-line staff is a
 * window onto an endless stack of notes, not a thing in itself.
 */
export default function PitchGrid({ bottom }: Props) {
  const top = topPitch(bottom);
  const rungs: Diatonic[] = [];
  for (let d = LOW; d <= HIGH; d++) {
    if (isLine(d, bottom) && (d < bottom || d > top)) rungs.push(d);
  }

  return (
    <>
      {rungs.map((d) => (
        <line
          key={d}
          x1={STAFF_X0}
          x2={STAFF_X1}
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
