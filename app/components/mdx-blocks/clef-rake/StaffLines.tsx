import { linePitches } from "./lib/clefs";
import type { Diatonic } from "./lib/pitch";
import { STAFF_X0, STAFF_X1, yOf } from "./layout";

interface Props {
  bottom: Diatonic;
}

/** The five lines themselves—the window that slides along the ladder. */
export default function StaffLines({ bottom }: Props) {
  return (
    <>
      {linePitches(bottom).map((d) => (
        <line
          key={d}
          x1={STAFF_X0}
          x2={STAFF_X1}
          y1={yOf(d)}
          y2={yOf(d)}
          stroke="var(--line)"
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      ))}
    </>
  );
}
