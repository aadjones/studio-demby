"use client";
import React, { useEffect, useRef } from "react";

export default function P5Container({ 
  sketch, 
  width = "100%", 
  height = "100%",
  className = "",
  renderer = "P2D"
}: { 
  sketch: any;
  width?: number | string;
  height?: number | string;
  className?: string;
  renderer?: "P2D" | "WEBGL";
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
      // Store original methods
      let originalSetup: () => void;
      let originalWindowResized: () => void;

      // Wrap the sketch to ensure proper sizing
      const wrappedSketch = (p: any) => {
        // Call the original sketch to get its methods
        sketch(p, ref.current);

        // Store original methods
        originalSetup = p.setup || (() => {});
        originalWindowResized = p.windowResized || (() => {});

        // Override setup
        p.setup = () => {
          const container = ref.current;
          if (container) {
            const size = Math.min(container.clientWidth, container.clientHeight);
            if (renderer === "WEBGL") {
              p.createCanvas(size, size, p.WEBGL);
            } else {
              p.createCanvas(size, size);
            }
          }
          originalSetup();
        };

        // Override windowResized
        p.windowResized = () => {
          const container = ref.current;
          if (container) {
            const size = Math.min(container.clientWidth, container.clientHeight);
            p.resizeCanvas(size, size);
          }
          originalWindowResized();
        };
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
  }, [sketch, width, height, renderer]);

  return (
    <div 
      ref={ref} 
      className={className}
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        position: 'relative',
      }} 
    />
  );
}
