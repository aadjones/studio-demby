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
    
    // Set initial size before creating p5 instance
    if (typeof width === 'number') {
      ref.current.style.width = `${width}px`;
      ref.current.style.height = `${height}px`;
    } else {
      ref.current.style.width = width as string;
      ref.current.style.height = height as string;
    }

    // Create p5 instance
    const instance: any = new (window as any).p5((p: any) => {
      // Wrap the sketch to ensure proper sizing
      const wrappedSketch = (p: any) => {
        // Override setup to ensure canvas size matches container
        const originalSetup = p.setup || (() => {});
        p.setup = () => {
          originalSetup();
          const container = ref.current;
          if (container) {
            p.createCanvas(container.clientWidth, container.clientWidth, p.WEBGL);
          }
        };

        // Call the original sketch
        sketch(p, ref.current);
      };
      
      return wrappedSketch(p);
    }, ref.current);

    // Add resize observer
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
  }, [sketch, width, height]);

  return (
    <div 
      ref={ref} 
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        position: 'relative',
      }} 
    />
  );
}
