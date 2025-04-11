"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import P5Container from "../utils/P5Container";

const PLANE_COUNTS = [
  { label: "A single plane", value: 1 },
  { label: "A polite cluster", value: 50 },
  { label: "An unruly swarm", value: 4000 },
  { label: "You're pushing it", value: 20000 },
  { label: "The void screams back", value: 100000 },
];

const PLANE_SIZES = [
  { label: "Lego brick", value: 50 },
  { label: "Bread box", value: 200 },
  { label: "Laptop screen", value: 2000 },
  { label: "Twice your ego", value: 4000 },
  { label: "Half the distance to the moon", value: 20000 },
];

function FunnySlider({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col items-start text-sm">
      <label className="mb-1 font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <select
        className="w-60 text-sm rounded border border-gray-400 bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-white px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white dark:bg-gray-800">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function ShatterPlayground() {
  const [numPlanes, setNumPlanes] = useState(PLANE_COUNTS[0].value);
  const [planeSize, setPlaneSize] = useState(PLANE_SIZES[0].value);
  const [triggerRender, setTriggerRender] = useState(0);
  const sketchRef = useRef<((p: any, parent: any) => void) | null>(null);
  const ref = useRef(null);
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

  // Automatically trigger first render on mount
  useEffect(() => {
    const frozenNumPlanes = numPlanes;
    const frozenPlaneSize = planeSize;
    sketchRef.current = (p, parent) =>
      shatterSketch(p, parent, {
        numPlanes: frozenNumPlanes,
        planeSize: frozenPlaneSize,
      });
    setTriggerRender(prev => prev + 1);
  }, []);

  const handleGenerate = useCallback(() => {
    const frozenNumPlanes = numPlanes;
    const frozenPlaneSize = planeSize;

    sketchRef.current = (p, parent) =>
      shatterSketch(p, parent, {
        numPlanes: frozenNumPlanes,
        planeSize: frozenPlaneSize,
      });

    setTriggerRender(prev => prev + 1);
  }, [numPlanes, planeSize]);

  return (
    <section id="playground" className="mb-12">
      <h2 className="text-2xl font-semibold mb-4 text-left w-full">Control Panel</h2>
      <div ref={ref} className="flex flex-col sm:flex-row sm:items-start sm:justify-center gap-8 w-full max-w-5xl">
        {visible && sketchRef.current && (
          <P5Container
            key={triggerRender}
            sketch={sketchRef.current}
          />
        )}
        <div className="flex flex-col gap-4">
          <FunnySlider
            label="Number of Planes"
            options={PLANE_COUNTS}
            value={numPlanes}
            onChange={setNumPlanes}
          />
          <FunnySlider
            label="Plane Size"
            options={PLANE_SIZES}
            value={planeSize}
            onChange={setPlaneSize}
          />
          <button
            onClick={handleGenerate}
            className="mt-2 px-4 py-2 bg-black text-white rounded shadow hover:bg-gray-800"
          >
            Generate
          </button>
        </div>
      </div>
    </section>
  );
}

function shatterSketch(p, parent, { numPlanes, planeSize }) {
  let shaderProgram;
  let amplitude = 20;
  let noiseScale = 0.01;
  let timeOffset = 0;

  p.preload = () => {
    shaderProgram = p.loadShader(
      "/sketches/shatter/waveVert.vert",
      "/sketches/shatter/waveFrag.frag"
    );
  };

  p.setup = () => {
    p.createCanvas(512, 512, p.WEBGL).parent(parent);
    p.noStroke();
    p.noLoop();
    p.background(0);
    p.redraw();
  };

  p.draw = () => {
    p.background(0);

    if (numPlanes === 1) {
      p.resetShader();
      p.fill(200);
    } else {
      p.shader(shaderProgram);
      p.directionalLight(255, 255, 255, 1, 1, 0);
      shaderProgram.setUniform("uTime", timeOffset);
      shaderProgram.setUniform("uAmplitude", amplitude);
      shaderProgram.setUniform("uNoiseScale", noiseScale);
    }

    for (let i = 0; i < numPlanes; i++) {
      p.push();

      if (numPlanes === 1) {
        p.translate(0, 0, 0);
        p.rotateX(0);
        p.rotateY(0);
        p.rotateZ(0);
      } else {
        p.translate(p.random(-300, 300), p.random(-300, 300), p.random(-300, 300));
        p.rotateX(p.random(p.TWO_PI));
        p.rotateY(p.random(p.TWO_PI));
        p.rotateZ(p.random(p.TWO_PI));
      }

      p.plane(planeSize, planeSize);
      p.pop();
    }
  };
}
