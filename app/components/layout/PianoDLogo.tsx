import type { CSSProperties } from "react";

/**
 * Piano-D logo mark — v2 Hairline (2026-02-22)
 * Inline SVG so it inherits `currentColor` from the parent text color.
 * White key backgrounds use fill="white"; works on light backgrounds.
 * Sizing: control via className/style (e.g. height: '0.82em', width: 'auto').
 */
export default function PianoDLogo({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 88 102"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* D body — Bezier semicircle */}
      <path
        d="M 34 1 C 61.6 1, 84 23.4, 84 51 C 84 78.6, 61.6 101, 34 101 Z"
        fill="currentColor"
      />
      {/* White key background */}
      <rect x="3" y="1" width="34" height="100" fill="white" />
      {/* Key dividers */}
      <line x1="3" y1="26"  x2="37" y2="26"  stroke="currentColor" strokeWidth="0.5" />
      <line x1="3" y1="51"  x2="37" y2="51"  stroke="currentColor" strokeWidth="0.5" />
      <line x1="3" y1="76"  x2="37" y2="76"  stroke="currentColor" strokeWidth="0.5" />
      {/* Black keys */}
      <rect x="25" y="19" width="12" height="14" fill="currentColor" rx="1.5" />
      <rect x="25" y="44" width="12" height="14" fill="currentColor" rx="1.5" />
      <rect x="25" y="69" width="12" height="14" fill="currentColor" rx="1.5" />
      {/* Top and bottom thick edges */}
      <line x1="2"  y1="1"   x2="38" y2="1"   stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
      <line x1="2"  y1="101" x2="38" y2="101" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
      {/* Left spine */}
      <line x1="3"  y1="1"   x2="3"  y2="101" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
    </svg>
  );
}
