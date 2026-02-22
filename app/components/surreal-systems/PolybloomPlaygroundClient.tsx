// app/components/surreal-systems/PolybloomPlaygroundClient.tsx

"use client";

import React, { useRef, useState, useEffect } from "react";

const HUE_MIN = 0;
const HUE_MAX = 100;
const LAYERS_MIN = 5;
const LAYERS_MAX = 14; // 3×2^14 = 49K vertices max; was 18 (786K) — Safari can't handle that
const DISTORTION_MIN = 1;
const DISTORTION_MAX = 25;
const FADE_FRAMES = 50;

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

export default function PolybloomPlaygroundClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [shufflePressed, setShufflePressed] = useState(false);

  // Refs read by the sketch — no remount on slider change
  const hueRef = useRef(0);
  const layersRef = useRef(10);
  const distortionRef = useRef(7);
  const seedRef = useRef(Math.floor(Math.random() * 99999));
  const regenerateRef = useRef<((animated: boolean) => void) | null>(null);
  const regenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // State drives slider UI only
  const [hue, setHue] = useState(0);
  const [layers, setLayers] = useState(10);
  const [distortion, setDistortion] = useState(7);

  // Lazy-init: don't spin up sketch until canvas is in view
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

  // p5 instance lifecycle — created once when visible, torn down on unmount
  useEffect(() => {
    if (!visible || !containerRef.current) return;
    const parent = containerRef.current;
    // Use clientWidth only — container is already square via aspect-ratio CSS.
    // Safari resolves aspect-ratio lazily so clientHeight may be 0 at IntersectionObserver time.
    let lastSize = parent.clientWidth;

    const p5Instance: any = new (window as any).p5((p: any) => {
      let buffer: any = null;
      let fadeProgress = 0;

      function generateSceneToBuffer() {
        const size = p.width;
        if (size < 1) return; // guard against zero-size canvas (Safari layout timing)
        if (buffer) buffer.remove();

        buffer = p.createGraphics(size, size);
        buffer.colorMode(p.HSB, 360, 100, 100, 1.0);
        buffer.noStroke();
        buffer.background(0);
        buffer.blendMode(p.ADD); // set AFTER background to avoid Safari compositing artifacts

        p.randomSeed(seedRef.current);

        // Map slider (0–100) backward around the color wheel: orange → red → violet → blue → teal
        const hue = (20 - hueRef.current * 1.9 + 360) % 360;
        const numLayers = layersRef.current;
        const dist = distortionRef.current;
        const cx = size / 2;
        const cy = size / 2;
        const maxRadius = size * 0.025;

        const deformOptions = {
          interpMin: 0.1,
          interpMax: 1.2,
          perturbationMin: dist * 0.3,
          perturbationMax: dist,
          angleMin: -Math.PI / 10,
          angleMax: Math.PI / 10,
          scaleMin: -dist * 0.05,
          scaleMax: dist * 0.05,
        };

        // Seed a single polygon flower at a random offset from center
        const offsetX = p.random(-size / 4, size / 4);
        const offsetY = p.random(-size / 4, size / 4);
        const angleOffset = p.random(p.TWO_PI);
        let polygon = createRegularPolygon(p, 3, cx + offsetX, cy + offsetY, maxRadius, angleOffset);

        for (let i = 0; i < numLayers; i++) {
          const saturation = p.map(i, 0, numLayers, 50, 100);
          const lightness = p.map(i, 0, numLayers, 30, 70);
          buffer.fill(hue, saturation, lightness, 0.1 + 0.5 * (1 - i / numLayers));
          buffer.beginShape();
          polygon.forEach((pt: any) => buffer.vertex(pt.x, pt.y));
          buffer.endShape(buffer.CLOSE);
          polygon = deformPolygon(p, polygon, deformOptions);
        }

        buffer.blendMode(p.BLEND);
      }

      p.setup = () => {
        const size = parent.clientWidth; // aspect-ratio guarantees square; don't use clientHeight (Safari)
        lastSize = size;
        const canvas = p.createCanvas(size, size);
        canvas.parent(parent);
        p.colorMode(p.HSB, 360, 100, 100, 1.0);
        p.noStroke();
        p.background(0);
        p.noLoop(); // don't draw until buffer is ready

        // Defer heavy computation so the browser paints the black canvas first.
        // Without this, Safari freezes on the main thread and shows nothing until done.
        setTimeout(() => {
          generateSceneToBuffer();
          fadeProgress = 0;
          p.loop();
        }, 0);

        // Expose regenerate so UI can trigger re-render without remounting p5.
        // animated=true: fade-in reveal (initial load, shuffle)
        // animated=false: instant display (slider drags)
        regenerateRef.current = (animated: boolean) => {
          generateSceneToBuffer();
          if (animated) {
            fadeProgress = 0;
          } else {
            fadeProgress = FADE_FRAMES; // skip straight to full opacity
          }
          p.loop();
        };
      };

      p.draw = () => {
        if (!buffer) return; // buffer not yet ready (deferred init)
        p.background(0);
        const tNorm = fadeProgress / FADE_FRAMES;
        const tSmooth = tNorm * tNorm * (3 - 2 * tNorm);
        p.tint(255, 255 * tSmooth);
        p.image(buffer, 0, 0);
        p.noTint();
        fadeProgress++;
        if (fadeProgress > FADE_FRAMES) p.noLoop();
      };

      p.windowResized = () => {
        const size = parent.clientWidth;
        if (Math.abs(size - lastSize) > 5) {
          lastSize = size;
          p.resizeCanvas(size, size);
          regenerateRef.current?.(false);
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
      regenerateRef.current = null;
    };
  }, [visible]);

  const handleShuffle = () => {
    seedRef.current = Math.floor(Math.random() * 99999);
    regenerateRef.current?.(true);
    setShufflePressed(true);
    setTimeout(() => setShufflePressed(false), 300);
  };

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="w-full aspect-square relative overflow-hidden bg-black"
      />
      {visible && (
        <div className="mt-4 flex flex-col gap-4 px-0.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <SliderField
              label="color"
              value={hue}
              min={HUE_MIN}
              max={HUE_MAX}
              step={1}
              onChange={(v: number) => {
                setHue(v); hueRef.current = v;
                if (regenTimerRef.current) clearTimeout(regenTimerRef.current);
                regenTimerRef.current = setTimeout(() => regenerateRef.current?.(false), 80);
              }}
            />
            <SliderField
              label="layers"
              value={layers}
              min={LAYERS_MIN}
              max={LAYERS_MAX}
              step={1}
              onChange={(v: number) => {
                setLayers(v); layersRef.current = v;
                if (regenTimerRef.current) clearTimeout(regenTimerRef.current);
                regenTimerRef.current = setTimeout(() => regenerateRef.current?.(false), 80);
              }}
            />
            <SliderField
              label="distortion"
              value={distortion}
              min={DISTORTION_MIN}
              max={DISTORTION_MAX}
              step={0.5}
              onChange={(v: number) => {
                setDistortion(v); distortionRef.current = v;
                if (regenTimerRef.current) clearTimeout(regenTimerRef.current);
                regenTimerRef.current = setTimeout(() => regenerateRef.current?.(false), 80);
              }}
            />
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleShuffle}
              className={`px-5 py-3.5 text-xs font-mono uppercase tracking-widest border transition-colors cursor-pointer ${
                shufflePressed
                  ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 border-neutral-600 dark:border-neutral-300"
                  : "text-neutral-700 dark:text-neutral-300 border-neutral-500 dark:border-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              ↺ shuffle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function createRegularPolygon(
  p: any,
  numVertices: number,
  centerX: number,
  centerY: number,
  radius: number,
  angleOffset = 0
): any[] {
  const points: any[] = [];
  for (let i = 0; i < numVertices; i++) {
    const angle = angleOffset + p.map(i, 0, numVertices, 0, p.TWO_PI);
    points.push(p.createVector(centerX + radius * p.cos(angle), centerY + radius * p.sin(angle)));
  }
  return points;
}

function deformPolygon(p: any, polygon: any[], options: any): any[] {
  const newPolygon: any[] = [];
  for (let i = 0; i < polygon.length; i++) {
    const nextIndex = (i + 1) % polygon.length;
    const p1 = polygon[i];
    const p2 = polygon[nextIndex];
    const interp = p.random(options.interpMin, options.interpMax);
    const newPoint = p1.copy().lerp(p2, interp);
    const randAngle = p.random(p.TWO_PI);
    const perturbation = p.createVector(p.cos(randAngle), p.sin(randAngle)).mult(
      p.random(options.perturbationMin, options.perturbationMax)
    );
    newPoint.add(perturbation);
    newPoint.rotate(p.random(options.angleMin, options.angleMax));
    newPoint.mult(1 + p.random(options.scaleMin, options.scaleMax));
    newPolygon.push(p1, newPoint);
  }
  return newPolygon;
}
