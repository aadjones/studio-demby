import { linePitches } from "./lib/clefs";
import type { Diatonic } from "./lib/pitch";
import { STAFF_X0, STAFF_X1, yOf } from "./layout";

interface Props {
  bottom: Diatonic;
  /**
   * Horizontal extent. Defaults to the ladder's own staff span; the
   * side-by-side comparison draws two narrower staves and overrides it.
   */
  x0?: number;
  x1?: number;
}

/** The five lines themselves—the window that slides along the ladder. */
export default function StaffLines({
  bottom,
  x0 = STAFF_X0,
  x1 = STAFF_X1,
}: Props) {
  return (
    <>
      {linePitches(bottom).map((d) => (
        <line
          key={d}
          x1={x0}
          x2={x1}
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
