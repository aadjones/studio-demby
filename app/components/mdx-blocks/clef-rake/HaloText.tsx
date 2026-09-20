import type { SVGProps } from "react";

interface Props extends SVGProps<SVGTextElement> {
  /** Stroke width of the background-coloured halo drawn underneath. */
  halo: number;
  children: React.ReactNode;
}

/**
 * Text with a knocked-out halo, so labels stay legible where they cross staff
 * lines. Drawn twice: once thickly stroked in the background colour, then
 * again on top. Cheaper and sharper than a filter.
 */
export default function HaloText({ halo, children, ...props }: Props) {
  return (
    <>
      <text
        {...props}
        aria-hidden="true"
        fill="var(--bg)"
        stroke="var(--bg)"
        strokeWidth={halo}
        strokeLinejoin="round"
      >
        {children}
      </text>
      <text {...props}>{children}</text>
    </>
  );
}
