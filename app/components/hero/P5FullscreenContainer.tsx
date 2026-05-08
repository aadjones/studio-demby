"use client";
import React, { useEffect, useRef } from "react";

/**
 * Like P5Container but fills the parent's full width × height
 * instead of forcing a square canvas. Used for the hero background.
 */
export default function P5FullscreenContainer({
  sketch,
  className = "",
}: {
  sketch: (p: any, parent: HTMLElement) => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const container = ref.current;
    let instance: any;
    let resizeObserver: ResizeObserver;
    let rafId: number;
    let unmounted = false;

    function setup() {
      if (unmounted) return;
      instance = new (window as any).p5((p: any) => {
        sketch(p, container);
      }, container);

      resizeObserver = new ResizeObserver(() => {
        if (instance?.windowResized) instance.windowResized();
      });
      resizeObserver.observe(container);
    }

    function waitForP5() {
      if (unmounted) return;
      if ((window as any).p5) {
        setup();
      } else {
        rafId = requestAnimationFrame(waitForP5);
      }
    }

    waitForP5();

    return () => {
      unmounted = true;
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      if (instance?._heroCleanup) instance._heroCleanup();
      instance?.remove();
    };
  }, [sketch]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        inset: 0,
      }}
    />
  );
}
