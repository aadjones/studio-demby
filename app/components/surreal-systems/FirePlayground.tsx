"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import P5Container from "../utils/P5Container";
import P5 from "p5";

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

type SketchPreset = {
  blendMode: 'BLEND' | 'ADD' | 'SCREEN';
  flowers: FlowerParams[];
};

type SketchWithParamsProps = {
  preset: SketchPreset;
  title?: string;
};

export default function SketchWithParams({ preset, title }: SketchWithParamsProps) {
  const [triggerRender, setTriggerRender] = useState(0);
  const sketchRef = useRef<((p: P5, parent: HTMLElement) => void) | null>(null);
  const canvasRef = useRef<P5 | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

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

  useEffect(() => {
    sketchRef.current = (p, parent) => polygonFadeSketch(p, parent, preset);
    setTriggerRender((prev) => prev + 1);
  }, [preset]);

  const handleGenerate = useCallback(() => {
    sketchRef.current = (p, parent) => polygonFadeSketch(p, parent, preset);
    setTriggerRender((prev) => prev + 1);
  }, [preset]);

  return (
    <section className="mb-12 not-prose">
      {title && <h2 className="text-2xl font-semibold mb-4">{title}</h2>}
      <div ref={ref} className="flex flex-col sm:flex-row sm:items-start sm:justify-center gap-8">
        {visible && sketchRef.current && (
          <div className="w-[512px] h-[512px] rounded-lg shadow-md overflow-hidden bg-white dark:bg-black">
            <P5Container
              key={triggerRender}
              sketch={(p, parent) => {
                canvasRef.current = p;
                if (sketchRef.current) {
                  sketchRef.current(p, parent);
                }
              }}
            />
          </div>
        )}
        <div className="flex flex-col gap-4">
          <button
            onClick={handleGenerate}
            className="mt-2 px-4 py-2 bg-black text-white rounded shadow hover:bg-gray-800"
          >
            Regenerate
          </button>
        </div>
      </div>
    </section>
  );
}

function polygonFadeSketch(p: P5, parent: HTMLElement, preset: SketchPreset) {
  let buffer: P5.Graphics;
  let fadeProgress = 0;
  const fadeDuration = 30;

  p.setup = () => {
    p.createCanvas(512, 512).parent(parent);
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
      case 'ADD': buffer.blendMode(p.ADD); break;
      case 'SCREEN': buffer.blendMode(p.SCREEN); break;
      default: buffer.blendMode(p.BLEND); break;
    }
    buffer.background(0);
    preset.flowers.forEach(flower => {
      let basePolygons = createPolygonFlowerData(p, flower);
      drawPolygonFlower(p, buffer, basePolygons, flower.layers, flower.hue, flower.deformOptions);
    });
    buffer.blendMode(p.BLEND);
  }

  p.draw = () => {
    p.background(0);
    p.tint(255, 255 * (fadeProgress / fadeDuration));
    p.image(buffer, 0, 0);
    fadeProgress++;
    if (fadeProgress <= fadeDuration) {
      p.redraw();
    } else {
      p.noLoop();
    }
  };
}

function createPolygonFlowerData(p: P5, flower: FlowerParams): P5.Vector[][] {
  const basePolygons: P5.Vector[][] = [];
  for (let i = 0; i < flower.numPolygons; i++) {
    const offsetX = p.random(-p.width / 4, p.width / 4);
    const offsetY = p.random(-p.width / 4, p.width / 4);
    const angleOffset = p.random(p.TWO_PI);
    basePolygons.push(createRegularPolygon(p, flower.vertices, flower.x + offsetX, flower.y + offsetY, flower.maxRadius, angleOffset));
  }
  return basePolygons;
}

function createRegularPolygon(p: P5, numVertices: number, centerX: number, centerY: number, radius: number, angleOffset = 0): P5.Vector[] {
  const points: P5.Vector[] = [];
  for (let i = 0; i < numVertices; i++) {
    const angle = angleOffset + p.map(i, 0, numVertices, 0, p.TWO_PI);
    const x = centerX + radius * p.cos(angle);
    const y = centerY + radius * p.sin(angle);
    points.push(p.createVector(x, y));
  }
  return points;
}

function drawPolygonFlower(p: P5, pg: P5.Graphics, basePolygons: P5.Vector[][], layers: number, hue: number, deformOptions: DeformOptions) {
  for (let i = 0; i < layers; i++) {
    let saturation = p.map(i, 0, layers, 50, 100);
    let lightness = p.map(i, 0, layers, 30, 70);
    pg.fill(hue, saturation, lightness, 0.1 + (0.5 * (1 - i / layers)));
    for (let j = 0; j < basePolygons.length; j++) {
      const polygon = basePolygons[j];
      drawPolygon(pg, polygon);
      basePolygons[j] = deformPolygon(p, polygon, deformOptions);
    }
  }
}

function drawPolygon(pg: P5.Graphics, polygon: P5.Vector[]) {
  pg.beginShape();
  for (const pt of polygon) {
    pg.vertex(pt.x, pt.y);
  }
  pg.endShape(pg.CLOSE);
}

function deformPolygon(p: P5, polygon: P5.Vector[], options: DeformOptions): P5.Vector[] {
  const newPolygon: P5.Vector[] = [];
  for (let i = 0; i < polygon.length; i++) {
    const nextIndex = (i + 1) % polygon.length;
    const p1 = polygon[i];
    const p2 = polygon[nextIndex];
    const interp = p.random(options.interpMin, options.interpMax);
    const newPoint = P5.Vector.lerp(p1, p2, interp);
    const perturbation = P5.Vector.random2D().mult(p.random(options.perturbationMin, options.perturbationMax));
    newPoint.add(perturbation);
    const angle = p.random(options.angleMin, options.angleMax);
    newPoint.rotate(angle);
    newPoint.mult(1 + p.random(options.scaleMin, options.scaleMax));
    newPolygon.push(p1);
    newPolygon.push(newPoint);
  }
  return newPolygon;
}
