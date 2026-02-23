"use client";

import React, { useRef, useState, useEffect } from "react";

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}

function SliderField({ label, value, min, max, step, onChange }: SliderFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full cursor-pointer accent-neutral-800 dark:accent-neutral-200"
      />
    </div>
  );
}

export default function SticksAndSticks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Refs read by draw loop — no remount on change
  const speedRef = useRef(50);  // 1–100, mapped to 0.1–3.0× in draw
  const trailRef = useRef(50);  // slider value; alpha = (3+60) - value, so high slider = long trail

  // State drives slider UI only
  const [speed, setSpeed] = useState(50);
  const [trail, setTrail] = useState(50);

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
    if (!visible || !containerRef.current) return;
    const parent = containerRef.current;

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
        baseSpeed: number;
        offset: number;
      };

      let lines: StickLine[] = [];
      let lastWidth = 0;

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
              baseSpeed: p.random(0.001, 0.005) * (layer + 1),
              offset: p.random(1000),
            });
          }
        }
      }

      p.setup = () => {
        p.frameRate(30);
        const canvas = p.createCanvas(parent.clientWidth, parent.clientHeight);
        canvas.parent(parent);
        lastWidth = parent.clientWidth;
        buildLines();
      };

      p.windowResized = () => {
        p.resizeCanvas(parent.clientWidth, parent.clientHeight);
        if (Math.abs(parent.clientWidth - lastWidth) > 5) {
          lastWidth = parent.clientWidth;
          buildLines();
        }
      };

      p.draw = () => {
        const speedMult = 0.1 + (speedRef.current / 100) * 2.9; // 0.1–3.0×
        p.background(200, 63 - trailRef.current); // invert: high slider = low alpha = long trail
        for (const ln of lines) {
          const n = p.noise(ln.offset + p.frameCount * ln.baseSpeed);
          ln.angle += p.map(n, 0, 1, 0, 0.02) * speedMult;
          ln.x2 = ln.x1 + p.cos(ln.angle) * ln.length;
          ln.y2 = ln.y1 + p.sin(ln.angle) * ln.length;
          p.strokeWeight(0.5);
          p.stroke(20, 20, 20, 150);
          p.line(ln.x1, ln.y1, ln.x2, ln.y2);
        }
      };

      p.touchMoved = () => true;
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
    <div className="w-full">
      <div
        ref={containerRef}
        className="w-full aspect-[4/3] sm:aspect-square relative overflow-hidden"
        style={{ backgroundColor: "rgb(200,200,200)" }}
      />
      {visible && (
        <div className="mt-4 flex flex-col gap-4 px-0.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SliderField
              label="speed"
              value={speed}
              min={1}
              max={100}
              step={1}
              onChange={(v) => { setSpeed(v); speedRef.current = v; }}
            />
            <SliderField
              label="trail"
              value={trail}
              min={3}
              max={60}
              step={1}
              onChange={(v) => { setTrail(v); trailRef.current = v; }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
