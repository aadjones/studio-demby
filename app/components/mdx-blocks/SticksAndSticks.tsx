"use client";

import React, { useRef, useState, useEffect } from "react";

export default function SticksAndSticks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const handleChange = () => {
      const doc = document as any;
      setIsFullscreen(!!(doc.fullscreenElement || doc.webkitFullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleChange);
    document.addEventListener("webkitfullscreenchange", handleChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
      document.removeEventListener("webkitfullscreenchange", handleChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    const doc = document as any;
    const el = containerRef.current as any;
    if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
      try {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      } catch {}
    } else {
      try {
        if (doc.exitFullscreen) await doc.exitFullscreen();
        else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
      } catch {}
    }
  };

  useEffect(() => {
    if (!visible || !containerRef.current) return;
    const parent = containerRef.current;

    // 50 lines per layer at 800×800; scale linearly with canvas area
    const BASE_DENSITY = 50 / (800 * 800);
    const MIN_PER_LAYER = 35;
    const NUM_LAYERS = 3;

    const p5Instance: any = new (window as any).p5((p: any) => {
      type StickLine = {
        layer: number;
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        length: number;
        angle: number;
        speed: number;
        offset: number;
      };

      let lines: StickLine[] = [];

      function buildLines() {
        lines = [];
        const perLayer = Math.max(
          MIN_PER_LAYER,
          Math.round(p.width * p.height * BASE_DENSITY)
        );
        const sizeScale = p.width / 800;
        for (let layer = 0; layer < NUM_LAYERS; layer++) {
          for (let i = 0; i < perLayer; i++) {
            lines.push({
              layer,
              x1: p.random(p.width),
              y1: p.random(p.height),
              x2: 0,
              y2: 0,
              length: p.random(50 * sizeScale, 150 * sizeScale),
              angle: p.random(p.TWO_PI),
              speed: p.random(0.001, 0.005) * (layer + 1),
              offset: p.random(1000),
            });
          }
        }
      }

      p.setup = () => {
        p.frameRate(30);
        const canvas = p.createCanvas(parent.clientWidth, parent.clientHeight);
        canvas.parent(parent);
        buildLines();
      };

      p.windowResized = () => {
        p.resizeCanvas(parent.clientWidth, parent.clientHeight);
        buildLines();
      };

      p.draw = () => {
        p.background(200, 10);
        for (const ln of lines) {
          const n = p.noise(ln.offset + p.frameCount * ln.speed);
          ln.angle += p.map(n, 0, 1, 0, 0.02);
          ln.x2 = ln.x1 + p.cos(ln.angle) * ln.length;
          ln.y2 = ln.y1 + p.sin(ln.angle) * ln.length;
          p.strokeWeight(0.5);
          p.stroke(20, 20, 20, 150);
          p.line(ln.x1, ln.y1, ln.x2, ln.y2);
        }
      };
    });

    const resizeObs = new ResizeObserver(() => {
      p5Instance?.windowResized?.();
    });
    resizeObs.observe(parent);

    return () => {
      resizeObs.disconnect();
      p5Instance?.remove();
    };
  }, [visible]);

  return (
    <div
      ref={containerRef}
      className="w-full aspect-[4/3] sm:aspect-square cursor-pointer relative overflow-hidden"
      style={{ backgroundColor: "rgb(200,200,200)" }}
      onClick={toggleFullscreen}
    >
      {!isFullscreen && (
        <div className="absolute bottom-2 right-2 text-[10px] text-black/25 pointer-events-none select-none">
          tap to expand
        </div>
      )}
    </div>
  );
}
