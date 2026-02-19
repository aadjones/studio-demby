"use client";

import React, { useRef, useState, useEffect } from "react";

const VERT_SRC = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
}
`;

const FRAG_SRC = `
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_noise_scale;
uniform float u_carrier_freq;
uniform float u_contrast;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float cellular(vec2 st) {
  vec2 i_st = floor(st);
  vec2 f_st = fract(st);
  float min_dist = 1.0;
  for (int x = -1; x <= 1; x++) {
    for (int y = -1; y <= 1; y++) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 point = vec2(hash(i_st + neighbor), hash(i_st.yx + neighbor)) + neighbor;
      vec2 diff = f_st - point;
      float dist = dot(diff, diff);
      min_dist = min(min_dist, dist);
    }
  }
  return u_noise_scale * sqrt(min_dist);
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;

  float carrierFreq = u_carrier_freq;

  float timeX = sin(0.3 * u_time) * 2.0 + 10.0 * noise(st);
  float timeY = (0.5 * u_time) * 2.0 + 10.0 * noise(st);

  float highFreqMod = cellular(st * 20.0 + vec2(timeX, timeY));
  highFreqMod = 20.0 * step(0.5, highFreqMod) * highFreqMod;

  float lowFreqMod = cellular(st * 2.0 + vec2(timeY, -timeX));
  lowFreqMod = 10.0 * step(0.5, lowFreqMod) * lowFreqMod;

  float modulatedFreq = carrierFreq + highFreqMod * 0.2 + lowFreqMod * 0.8;

  float color = cellular(st * modulatedFreq + u_time * 0.7);
  color = step(u_contrast, color) * color;

  gl_FragColor = vec4(vec3(color), 1.0);
}
`;

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

export default function PetrolNoise() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Refs read by the p5 draw loop — avoids remounting the sketch on param change
  const noiseScaleRef = useRef(1.0);
  const carrierFreqRef = useRef(2.0);

  // State drives the slider UI
  const [noiseScale, setNoiseScale] = useState(1.0);
  const [carrierFreq, setCarrierFreq] = useState(2.0);

  // Lazy-init: don't spin up WebGL until the canvas is in view
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
  useEffect(() => { noiseScaleRef.current = noiseScale; }, [noiseScale]);
  useEffect(() => { carrierFreqRef.current = carrierFreq; }, [carrierFreq]);

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

    let lastWidth = parent.clientWidth;
    let lastHeight = parent.clientHeight;

    const p5Instance: any = new (window as any).p5((p: any) => {
      let myShader: any;
      let time = 0;

      p.setup = () => {
        const canvas = p.createCanvas(parent.clientWidth, parent.clientHeight, p.WEBGL);
        canvas.parent(parent);
        p.noStroke();
        myShader = p.createShader(VERT_SRC, FRAG_SRC);
        p.shader(myShader);
      };

      p.draw = () => {
        time += 0.01;
        myShader.setUniform("u_time", time);
        myShader.setUniform("u_resolution", [p.width, p.height]);
        myShader.setUniform("u_noise_scale", noiseScaleRef.current);
        myShader.setUniform("u_carrier_freq", carrierFreqRef.current);
        myShader.setUniform("u_contrast", 0.4);
        p.rect(-p.width / 2, -p.height / 2, p.width, p.height);
      };

      p.windowResized = () => {
        const newW = parent.clientWidth;
        const newH = parent.clientHeight;
        if (Math.abs(newW - lastWidth) > 5 || Math.abs(newH - lastHeight) > 5) {
          lastWidth = newW;
          lastHeight = newH;
          p.resizeCanvas(newW, newH);
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
        className="w-full aspect-square cursor-pointer relative overflow-hidden bg-black"
        onClick={toggleFullscreen}
      />
      {visible && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5 px-0.5">
          <SliderField
            label="pressure"
            value={noiseScale}
            min={0.6}
            max={4.0}
            step={0.01}
            onChange={setNoiseScale}
          />
          <SliderField
            label="grain"
            value={carrierFreq}
            min={0.1}
            max={20.0}
            step={0.01}
            onChange={setCarrierFreq}
          />
        </div>
      )}
    </div>
  );
}
