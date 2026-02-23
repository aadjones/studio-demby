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

export default function GrainRain() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Refs read by the p5 draw loop — avoids remounting the sketch on param change
  const densityRef = useRef(1000);
  const speedRef = useRef(1.0);
  const seedRef = useRef(Math.floor(Math.random() * 1000000));
  // Signal to the draw loop that grains need to be rebuilt (e.g. after density change)
  const needsRebuildRef = useRef(false);

  // State drives the slider UI
  const [density, setDensity] = useState(1000);
  const [speed, setSpeed] = useState(1.0);

  // Lazy-init: don't spin up sketch until the canvas is in view
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

  // Keep refs in sync with UI state
  useEffect(() => {
    densityRef.current = density;
    needsRebuildRef.current = true;
  }, [density]);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  useEffect(() => {
    if (!visible || !containerRef.current) return;
    const parent = containerRef.current;

    let lastWidth = parent.clientWidth;
    let lastHeight = parent.clientHeight;

    const p5Instance: any = new (window as any).p5((p: any) => {
      interface GrainData {
        x: number;
        y: number;
        size: number;
        frequency: number;
        direction: number;
        fadeFrequency: number;
        stripeOffset: number;
        fadePhase: number;
      }

      let grains: GrainData[] = [];

      function makeGrain(): GrainData {
        return {
          x: p.random(p.width),
          y: p.random(p.height),
          size: p.pow(2, p.random(2, 7)),
          frequency: p.pow(2, p.random(-1, 6)),
          direction: p.random([-1, 1]),
          fadeFrequency: p.pow(2, p.random(-3, 4)),
          stripeOffset: 0,
          fadePhase: p.random(p.TWO_PI),
        };
      }

      function buildGrains(count: number): GrainData[] {
        // Seed before building so the same seed always produces the same layout.
        p.randomSeed(seedRef.current);
        const result: GrainData[] = [];
        for (let i = 0; i < count; i++) result.push(makeGrain());
        return result;
      }

      function displayGrain(g: GrainData, speedMult: number) {
        const fadeAmount = (p.sin(g.fadeFrequency * p.millis() / 1000 + g.fadePhase) + 1) / 2;
        const currentOpacity = 255 * fadeAmount;

        p.push();
        p.fill(255, currentOpacity);
        p.noStroke();
        p.ellipse(g.x, g.y, g.size, g.size);

        // Barbershop stripes within the grain circle
        const stripeWidth = g.size / 10;
        g.stripeOffset = (g.stripeOffset + g.frequency * g.direction * speedMult) % stripeWidth;

        for (let i = -g.size / 2; i < g.size / 2; i += stripeWidth) {
          const xPos = g.x + i + g.stripeOffset - stripeWidth / 2;
          const radius = g.size / 2;
          const lineHeight = Math.sqrt(radius * radius - (i + g.stripeOffset) ** 2) * 2;
          if (!isNaN(lineHeight)) {
            p.stroke(0, currentOpacity);
            p.strokeWeight(2);
            p.line(xPos, g.y - lineHeight / 2, xPos, g.y + lineHeight / 2);
          }
        }

        p.pop();
      }

      p.setup = () => {
        const canvas = p.createCanvas(parent.clientWidth, parent.clientHeight);
        canvas.parent(parent);
        grains = buildGrains(densityRef.current);
        needsRebuildRef.current = false;
      };

      p.draw = () => {
        if (needsRebuildRef.current) {
          grains = buildGrains(densityRef.current);
          needsRebuildRef.current = false;
        }

        p.background(0);
        const speedMult = speedRef.current;
        for (const grain of grains) {
          displayGrain(grain, speedMult);
        }
      };

      p.windowResized = () => {
        const newW = parent.clientWidth;
        const newH = parent.clientHeight;
        if (Math.abs(newW - lastWidth) > 5 || Math.abs(newH - lastHeight) > 5) {
          lastWidth = newW;
          lastHeight = newH;
          p.resizeCanvas(newW, newH);
          grains = buildGrains(densityRef.current);
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
        className="w-full aspect-square relative overflow-hidden bg-black"
      />
      {visible && (
        <div className="mt-4 px-0.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SliderField
              label="density"
              value={density}
              min={100}
              max={2000}
              step={100}
              onChange={setDensity}
            />
            <SliderField
              label="speed"
              value={speed}
              min={0.0}
              max={5.0}
              step={0.05}
              onChange={setSpeed}
            />
          </div>
        </div>
      )}
    </div>
  );
}
