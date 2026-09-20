import type { ClefSignType } from "./lib/clefs";

interface Props {
  type: ClefSignType;
  x: number;
  y: number;
}

/**
 * The real clef glyphs, drawn by hand.
 *
 * Not the default: the explainer introduces clefs as plain letters (see
 * `ClefMarker`) because "seven clefs, three symbols" confuses before it is
 * explained. These return as the reveal at the end, and they render at exactly
 * the same position, so nothing moves when they swap in.
 *
 * Faithful port of the prototype's `drawSign`—do not redraw by eye.
 */
export default function ClefSign({ type, x, y }: Props) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      fill="none"
      stroke="var(--ink)"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {type === "C" && (
        <>
          <rect x={-11} y={-32} width={5} height={64} fill="var(--ink)" stroke="none" />
          <rect x={-3.5} y={-32} width={1.8} height={64} fill="var(--ink)" stroke="none" />
          {[-1, 1].map((k) => (
            <g key={k}>
              <path
                d={`M -1 0 L 5 ${7 * k} C 12 ${2 * k} 17 ${14 * k} 15 ${22 * k} C 13 ${30 * k} 4 ${32 * k} 1 ${28 * k}`}
                strokeWidth={3}
              />
              <circle cx={3} cy={27 * k} r={3.2} fill="var(--ink)" stroke="none" />
            </g>
          ))}
        </>
      )}

      {type === "F" && (
        <>
          <circle cx={-7} cy={0} r={4.6} fill="var(--ink)" stroke="none" />
          <path d="M -7 -1 C -7 -13 15 -14 15 1 C 15 15 4 26 -11 33" strokeWidth={3.2} />
          <circle cx={23} cy={-5.5} r={2.4} fill="var(--ink)" stroke="none" />
          <circle cx={23} cy={5.5} r={2.4} fill="var(--ink)" stroke="none" />
        </>
      )}

      {type === "G" && (
        <>
          <path
            d="M 4 3 C -3 3 -4 -6 3 -7 C 12 -8 15 5 6 9 C -5 13 -13 4 -11 -7 C -9 -18 5 -24 6 -36 C 7 -46 -1 -50 -3 -40 L 4 22 C 6 30 -4 32 -6 25"
            strokeWidth={2.6}
          />
          <circle cx={-4} cy={25} r={3.2} fill="var(--ink)" stroke="none" />
        </>
      )}
    </g>
  );
}
