"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import P5Container from "../utils/P5Container";
import P5 from "p5";

interface Option {
  label: string;
  value: number;
}

interface FunnySliderProps {
  label: string;
  options: Option[];
  value: number;
  onChange: (value: number) => void;
}

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

function FunnySlider({ label, options, value, onChange }: FunnySliderProps) {
  return (
    <div className="flex flex-col items-start w-full text-sm relative">
      <label className="mb-1 font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="w-full max-w-[360px] relative">
        <select
          className="w-full text-sm rounded-lg border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-black appearance-none"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-gray-800">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
  }, [numPlanes, planeSize]);

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
          <div className="w-full sm:w-[512px] aspect-square rounded-lg shadow-md overflow-hidden bg-white dark:bg-black">
            <P5Container
              key={triggerRender}
              sketch={sketchRef.current}
              width="100%"
              height="100%"
            />
          </div>
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
            Regenerate
          </button>
        </div>
      </div>
    </section>
  );
}

interface SketchParams {
  numPlanes: number;
  planeSize: number;
}

function shatterSketch(p: P5, parent: HTMLElement, { numPlanes, planeSize }: SketchParams) {
  let shaderProgram: P5.Shader;
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
      p.push();
      p.translate(0, 0, 0);
      p.rotateX(p.PI * p.random(0.12, 0.18));
      p.rotateY(p.PI * p.random(0.08, 0.12));
      p.rotateZ(p.PI * p.random(0.03, 0.07));
      p.plane(planeSize, planeSize);
      p.pop();
    } else {
      p.shader(shaderProgram);
      p.directionalLight(255, 255, 255, 1, 1, 0);
      shaderProgram.setUniform("uTime", timeOffset);
      shaderProgram.setUniform("uAmplitude", amplitude);
      shaderProgram.setUniform("uNoiseScale", noiseScale);

      for (let i = 0; i < numPlanes; i++) {
        p.push();
        p.translate(p.random(-300, 300), p.random(-300, 300), p.random(-300, 300));
        p.rotateX(p.random(p.TWO_PI));
        p.rotateY(p.random(p.TWO_PI));
        p.rotateZ(p.random(p.TWO_PI));
        p.plane(planeSize, planeSize);
        p.pop();
      }
    }
  };
}
