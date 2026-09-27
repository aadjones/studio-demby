import { useCallback, useEffect, useRef, type RefObject } from "react";
import type { Diatonic } from "./lib/pitch";
import { dOf } from "./layout";

/**
 * Drag the staff along the ladder.
 *
 * Where it is allowed to land is `snap`'s business, not this hook's: the real-clef
 * widgets snap to the seven clef stops, the free slider takes any step at all. The hook only
 * turns a pointer into a pitch.
 *
 * Screen coordinates are converted through the SVG's own CTM rather than by
 * measuring the element, so the drag keeps tracking the pointer at any
 * rendered size without a resize listener.
 */
export function useStaffDrag(
  svgRef: RefObject<SVGSVGElement>,
  currentBottom: Diatonic,
  onChange: (bottom: Diatonic) => void,
  snap: (want: number) => Diatonic
) {
  const dragging = useRef(false);
  const grabOffset = useRef(0);

  const pointerToDiatonic = useCallback(
    (e: { clientX: number; clientY: number }) => {
      const svg = svgRef.current;
      const ctm = svg?.getScreenCTM();
      if (!svg || !ctm) return 0;
      const p = svg.createSVGPoint();
      p.x = e.clientX;
      p.y = e.clientY;
      return dOf(p.matrixTransform(ctm.inverse()).y);
    },
    [svgRef]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      dragging.current = true;
      // Remember where on the staff the grab happened, so it doesn't jump.
      grabOffset.current = pointerToDiatonic(e) - currentBottom;
    },
    [pointerToDiatonic, currentBottom]
  );

  useEffect(() => {
    function move(e: PointerEvent) {
      if (!dragging.current) return;
      const next = snap(pointerToDiatonic(e) - grabOffset.current);
      if (next !== currentBottom) onChange(next);
    }
    function end() {
      dragging.current = false;
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, [pointerToDiatonic, currentBottom, onChange, snap]);

  return onPointerDown;
}
