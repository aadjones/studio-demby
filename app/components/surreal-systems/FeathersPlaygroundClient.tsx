"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import P5Container from "../utils/P5Container";
import P5 from "p5";

type SketchFunction = (p: P5, parent: HTMLElement) => void;

export default function FeathersPlaygroundClient() {
  const [triggerRender, setTriggerRender] = useState(0);
  const sketchRef = useRef<SketchFunction | null>(null);
  const canvasRef = useRef<P5 | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [containerSize, setContainerSize] = useState(512);

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
    const updateSize = () => {
      if (ref.current) {
        const width = ref.current.clientWidth;
        setContainerSize(Math.min(width, 512));
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    console.log('Initializing sketch with containerSize:', containerSize);
    sketchRef.current = (p, parent) => feathersSketch(p, parent, canvasRef, containerSize);
    setTriggerRender((prev) => prev + 1);
  }, [containerSize]);

  const handleGenerate = useCallback(() => {
    sketchRef.current = (p, parent) => feathersSketch(p, parent, canvasRef, containerSize);
    setTriggerRender((prev) => prev + 1);
  }, [containerSize]);

  return (
    <section id="feathers-playground" className="mb-12 not-prose">
      <h2 className="text-2xl font-semibold mb-4">Molting Grounds</h2>
      <div ref={ref} className="flex flex-col sm:flex-row sm:items-start sm:justify-center gap-8">
        {visible && sketchRef.current && (
          <div className="w-full sm:w-[512px] aspect-square rounded-lg shadow-md overflow-hidden bg-white dark:bg-black">
            <P5Container
              key={triggerRender}
              sketch={(p: P5, parent: HTMLElement) => {
                console.log('P5Container sketch called');
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

function feathersSketch(p: P5, parent: HTMLElement, canvasRef: React.MutableRefObject<P5 | null>, size: number) {
  let buffer: P5.Graphics;

  p.setup = () => {
    const canvas = p.createCanvas(size, size);
    canvas.parent(parent);
    
    buffer = p.createGraphics(size, size);
    buffer.colorMode(p.HSB, 360, 100, 100, 1.0);
    buffer.noStroke();
    
    // Draw to buffer
    buffer.background(255);
    buffer.resetMatrix();

    for (let i = 0; i < 4; ++i) {
      drawStreakSet(buffer,
        p.random(10, 50),
        0,
        size / 2,
        [50, size - 200],
        [200, 500],
        [1, 0.2],
        200,
        100
      );
      buffer.translate(size / 2, size / 2);
      buffer.rotate(p.random(-p.PI / 8, p.PI / 8));
      buffer.scale(p.random(-1.5, -0.5), p.random(0, 4));
      buffer.translate(-size / 2, -size / 2);
      buffer.translate(p.random(-100, 100), p.random(-100, 100));
    }
  };

  p.draw = () => {
    p.background(255);
    p.image(buffer, 0, 0);
  };
}

function drawStreakSet(p: P5 | P5.Graphics, numStreaks: number, startYRange: number, endYRange: number, startXRange: number[], horizontalLengthRange: number[], lengthAdjustmentRange: number[], controlXOffset: number, controlYOffset: number) {
  for (let i = 0; i < numStreaks; i++) {
    const verticalPosition = p.map(i, 0, numStreaks, startYRange, endYRange);
    const phaseOffset = p.map(i, 0, numStreaks, 0, p.TWO_PI);
    let horizontalLength = p.map(verticalPosition, startYRange, endYRange, horizontalLengthRange[0], horizontalLengthRange[1]);
    const lengthAdjustment = p.map(i, 0, numStreaks, lengthAdjustmentRange[0], lengthAdjustmentRange[1]);
    const startX = p.map(i, 0, numStreaks, startXRange[0], startXRange[1]);
    horizontalLength *= lengthAdjustment;

    createStreak(p, startX, verticalPosition, controlXOffset, controlYOffset, horizontalLength, 100, phaseOffset);
  }
}

function createStreak(p: P5 | P5.Graphics, startX: number, startY: number, controlXOffset: number, controlYOffset: number, endXOffset: number, endYOffset: number, phase: number) {
  const controlX = startX + controlXOffset;
  const controlY = startY + controlYOffset + p.sin(phase) * 50;
  const endX = startX + endXOffset;
  const endY = startY + endYOffset + p.sin(phase + p.HALF_PI) * 50;
  const numDrops = p.int(p.dist(startX, startY, endX, endY) / 30);

  for (let t = 0; t <= 1; t += 1 / numDrops) {
    const x = p.bezierPoint(startX, controlX, controlX, endX, t);
    const y = p.bezierPoint(startY, controlY, controlY, endY, t);
    const cycle = p.sin(phase + t * p.TWO_PI);
    const baseSize = p.lerp(20, 40, (cycle + 1) / 2);
    const stretchX = p.lerp(1, 5, t);
    const stretchY = p.lerp(1, 0.5, t) * p.map(cycle, -1, 1, 0.5, 1.5);
    const hue = p.lerp(0, 10, t) + p.map(cycle, -1, 1, -20, 20);
    const brightness = p.map(startY, 0, p.height, 30, 60) + p.map(cycle, -1, 1, -20, 20);

    p.fill(hue + p.random(20), 80 + p.random(10), brightness, 0.9);
    p.beginShape();
    p.vertex(x, y);
    p.bezierVertex(
      x - baseSize * stretchX + p.random(-5, 5),
      y - baseSize * stretchY + p.random(-5, 5),
      x + baseSize * stretchX + p.random(-5, 5),
      y + baseSize * stretchY + p.random(-5, 5),
      x, y
    );
    p.endShape(p.CLOSE);
  }
} 