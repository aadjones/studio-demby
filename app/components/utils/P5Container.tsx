"use client";
import React, { useEffect, useRef } from "react";

export default function P5Container({ sketch, width = 600, height = 600 }: { 
  sketch: any;
  width?: number | string;
  height?: number | string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // Force instance to any so TS won't complain about gui
    const instance: any = new (window as any).p5((p: any) => sketch(p, ref.current), ref.current);

    // Add resize observer to handle container size changes
    const resizeObserver = new ResizeObserver(() => {
      if (instance.windowResized) {
        instance.windowResized();
      }
    });
    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
      instance.gui?.destroy();
      instance.remove();
    };
  }, [sketch]);

  return <div ref={ref} style={{ width, height }} />;
}
