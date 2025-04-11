"use client";

import React, { useRef, useState, useEffect } from "react";
import P5Container from "./P5Container";

function Slider({ label, value, onChange, min, max, step }) {
  return (
    <div className="flex flex-col items-center text-sm">
      <label className="mb-1 font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type="range"
        className="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">{value}</span>
    </div>
  );
}

export default function ShatterPlayground() {
  const [numPlanes, setNumPlanes] = useState(8000);
  const [planeSize, setPlaneSize] = useState(1000);
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

  return (
    <section id="playground" className="mt-12">
      <h2 className="text-xl font-semibold mb-4 text-center">Playground</h2>
      <div
        ref={ref}
        className="flex flex-col items-center justify-center gap-y-4"
      >
        {visible && (
          <P5Container
            sketch={(p, parent) =>
              shatterSketch(p, parent, {
                getNumPlanes: () => numPlanes,
                getPlaneSize: () => planeSize,
              })
            }
          />
        )}
        <div className="flex flex-wrap justify-center gap-8">
          <Slider
            label="Number of Planes"
            min={1000}
            max={20000}
            step={100}
            value={numPlanes}
            onChange={setNumPlanes}
          />
          <Slider
            label="Plane Size"
            min={100}
            max={2000}
            step={50}
            value={planeSize}
            onChange={setPlaneSize}
          />
        </div>
      </div>
    </section>
  );
}

function shatterSketch(p, parent, { getNumPlanes, getPlaneSize }) {
  let shaderProgram;
  let amplitude = 20;
  let noiseScale = 0.01;
  let timeOffset = 0;
  let shouldRender = true;

  p.preload = () => {
    shaderProgram = p.loadShader(
      "/sketches/shatter/waveVert.vert",
      "/sketches/shatter/waveFrag.frag"
    );
  };

  p.setup = () => {
    const canvas = p.createCanvas(512, 512, p.WEBGL);
    canvas.parent(parent);
    p.noStroke();
    p.frameRate(30);
  };

  p.draw = () => {
    if (!shouldRender) return;

    p.background(0);
    p.shader(shaderProgram);
    p.directionalLight(255, 255, 255, 1, 1, 0);

    const numPlanes = getNumPlanes();
    const planeSize = getPlaneSize();

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

    shouldRender = false;
  };

  p.keyPressed = () => {
    if (p.key === "s" || p.key === "S") {
      p.saveCanvas("shatter_frame_" + p.nf(p.frameCount, 3), "png");
    }
    if (p.key === " ") {
      timeOffset += 0.01;
      shouldRender = true;
      p.redraw();
    }
  };

  p.mouseReleased = () => {
    shouldRender = true;
    p.redraw();
  };
}
