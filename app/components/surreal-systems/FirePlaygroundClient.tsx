// app/components/surreal-systems/FirePlaygroundClient.tsx

"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import P5Container from "../utils/P5Container";
import P5 from "p5";

// Types for deform options and flower parameters
type DeformOptions = {
  interpMin: number;
  interpMax: number;
  perturbationMin: number;
  perturbationMax: number;
  angleMin: number;
  angleMax: number;
  scaleMin: number;
  scaleMax: number;
};

type FlowerParams = {
  x: number;
  y: number;
  layers: number;
  vertices: number;
  maxRadius: number;
  numPolygons: number;
  hue: number;
  deformOptions: DeformOptions;
};

// Preset type that FirePlaygroundClient will accept
export type SketchPreset = {
  blendMode: "BLEND" | "ADD" | "SCREEN";
  flowers: FlowerParams[];
};

type FirePlaygroundClientProps = {
  preset: SketchPreset;
  title?: string;
};

// Client-only sketch component using p5
export default function FirePlaygroundClient({ preset, title }: FirePlaygroundClientProps) {
  const [triggerRender, setTriggerRender] = useState(0);
  const sketchRef = useRef<((p: P5, parent: HTMLElement) => void) | null>(null);
  const canvasRef = useRef<P5 | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  // Lazy-mount when in view
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // Initialize sketch whenever preset changes
  useEffect(() => {
    sketchRef.current = (p, parent) => polygonFadeSketch(p, parent, preset);
    setTriggerRender((prev) => prev + 1);
  }, [preset]);

  // Regenerate on button press
  const handleGenerate = useCallback(() => {
    sketchRef.current = (p, parent) => polygonFadeSketch(p, parent, preset);
    setTriggerRender((prev) => prev + 1);
  }, [preset]);

  return (
    <div className="not-prose flex flex-col md:flex-row gap-1 justify-center scale-75">
      <div className="w-full max-w-[512px]">
        <section className="mb-1">
          {title && <h2 className="text-xl font-semibold mb-1 leading-tight">{title}</h2>}
          <div
            ref={ref}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-full aspect-square rounded-lg shadow-md overflow-hidden bg-white dark:bg-black min-h-[240px]">
              {visible && sketchRef.current && (
                <P5Container
                  key={triggerRender}
                  sketch={(p, parent) => {
                    canvasRef.current = p;
                    if (sketchRef.current) sketchRef.current(p, parent);
                  }}
                />
              )}
            </div>
            <button
              onClick={handleGenerate}
              className="mt-0.5 px-2.5 py-1 bg-black text-white rounded shadow hover:bg-gray-800 text-sm"
            >
              Regenerate
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

// The sketch with eased fade-in from black
function polygonFadeSketch(p: P5, parent: HTMLElement, preset: SketchPreset) {
  let buffer: P5.Graphics;
  let fadeProgress = 0;
  const fadeDuration = 600; // ~1 second at 60 FPS

  p.setup = () => {
    const size = Math.min(parent.clientWidth, parent.clientHeight);
    p.createCanvas(size, size).parent(parent);
    p.colorMode(p.HSB, 360, 100, 100, 1.0);
    p.noStroke();
    p.noLoop();

    buffer = p.createGraphics(p.width, p.height);
    buffer.colorMode(p.HSB, 360, 100, 100, 1.0);

    generateSceneToBuffer();
    p.background(0);
    fadeProgress = 0;
    p.loop();
  };

  function generateSceneToBuffer() {
    buffer.clear();
    buffer.noStroke();
    switch (preset.blendMode) {
      case "ADD": buffer.blendMode(p.ADD); break;
      case "SCREEN": buffer.blendMode(p.SCREEN); break;
      default: buffer.blendMode(p.BLEND); break;
    }
    buffer.background(0);
    preset.flowers.forEach((flower) => {
      const basePolygons = createPolygonFlowerData(p, flower);
      drawPolygonFlower(
        p,
        buffer,
        basePolygons,
        flower.layers,
        flower.hue,
        flower.deformOptions
      );
    });
    buffer.blendMode(p.BLEND);
  }

  p.draw = () => {
    p.background(0);
    // normalized progress
    const tNorm = fadeProgress / fadeDuration;
    // smoothstep ease in/out
    const tSmooth = tNorm * tNorm * (3 - 2 * tNorm);
    p.tint(255, 255 * tSmooth);
    p.image(buffer, 0, 0);
    fadeProgress++;
    if (fadeProgress <= fadeDuration) p.redraw();
    else p.noLoop();
  };
}

// Helpers for polygon generation and deformation
function createPolygonFlowerData(p: P5, flower: FlowerParams): P5.Vector[][] {
  const basePolygons: P5.Vector[][] = [];
  for (let i = 0; i < flower.numPolygons; i++) {
    const offsetX = p.random(-p.width / 4, p.width / 4);
    const offsetY = p.random(-p.width / 4, p.width / 4);
    const angleOffset = p.random(p.TWO_PI);
    basePolygons.push(
      createRegularPolygon(
        p,
        flower.vertices,
        flower.x + offsetX,
        flower.y + offsetY,
        flower.maxRadius,
        angleOffset
      )
    );
  }
  return basePolygons;
}

function createRegularPolygon(
  p: P5,
  numVertices: number,
  centerX: number,
  centerY: number,
  radius: number,
  angleOffset = 0
): P5.Vector[] {
  const points: P5.Vector[] = [];
  for (let i = 0; i < numVertices; i++) {
    const angle = angleOffset + p.map(i, 0, numVertices, 0, p.TWO_PI);
    points.push(
      p.createVector(centerX + radius * p.cos(angle), centerY + radius * p.sin(angle))
    );
  }
  return points;
}

function drawPolygonFlower(
  p: P5,
  pg: P5.Graphics,
  basePolygons: P5.Vector[][],
  layers: number,
  hue: number,
  deformOptions: DeformOptions
) {
  for (let i = 0; i < layers; i++) {
    const saturation = p.map(i, 0, layers, 50, 100);
    const lightness = p.map(i, 0, layers, 30, 70);
    pg.fill(hue, saturation, lightness, 0.1 + 0.5 * (1 - i / layers));
    basePolygons.forEach((polygon, idx) => {
      pg.beginShape();
      polygon.forEach((pt) => pg.vertex(pt.x, pt.y));
      pg.endShape(pg.CLOSE);
      basePolygons[idx] = deformPolygon(p, polygon, deformOptions);
    });
  }
}

function deformPolygon(
  p: P5,
  polygon: P5.Vector[],
  options: DeformOptions
): P5.Vector[] {
  const newPolygon: P5.Vector[] = [];
  for (let i = 0; i < polygon.length; i++) {
    const nextIndex = (i + 1) % polygon.length;
    const p1 = polygon[i];
    const p2 = polygon[nextIndex];
    const interp = p.random(options.interpMin, options.interpMax);
    const newPoint = P5.Vector.lerp(p1, p2, interp);
    const perturbation = P5.Vector.random2D().mult(
      p.random(options.perturbationMin, options.perturbationMax)
    );
    newPoint.add(perturbation);
    newPoint.rotate(p.random(options.angleMin, options.angleMax));
    newPoint.mult(1 + p.random(options.scaleMin, options.scaleMax));
    newPolygon.push(p1, newPoint);
  }
  return newPolygon;
}
