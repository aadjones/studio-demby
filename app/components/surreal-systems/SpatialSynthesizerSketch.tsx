"use client";
import React, { useRef, useState, useEffect } from "react";
import P5Container from "../utils/P5Container";
import SliderControl from "../utils/SliderControl";
import { SynthParams, SliderLFO, SynthLFOMap } from './types';
import { gentleWaves, wildRipples, pulsatingEye } from './concertPresets';

const defaultParams: SynthParams = {
  carrierFreqX: 0.5,
  carrierFreqY: 0.5,
  modulatorFreq: 0.5,
  modulationIndex: 1.0,
  amplitudeModulationIndex: 1.0,
  modulationCenterX: 0.0,
  modulationCenterY: 0.0,
  lfoFrequency: 0.1,
  lfoAmplitude: 0.5,
};

const paramRanges: Record<keyof SynthParams, { min: number; max: number; step: number }> = {
  carrierFreqX: { min: 0.1, max: 10, step: 0.1 },
  carrierFreqY: { min: 0.1, max: 10, step: 0.1 },
  modulatorFreq: { min: 0.1, max: 10, step: 0.1 },
  modulationIndex: { min: 0, max: 5, step: 0.1 },
  amplitudeModulationIndex: { min: 0, max: 5, step: 0.1 },
  modulationCenterX: { min: -1, max: 1, step: 0.01 },
  modulationCenterY: { min: -1, max: 1, step: 0.01 },
  lfoFrequency: { min: 0, max: 10, step: 0.01 },
  lfoAmplitude: { min: 0, max: 2, step: 0.01 },
};

// First, let's create a debounce utility at the top of the file
const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

const createSketch = (
  paramsRef: React.MutableRefObject<Record<keyof SynthParams, React.MutableRefObject<number>>>
) => (p: any, parent: HTMLDivElement) => {
  let myShader: any;
  let canvas: any;
  
  p.preload = () => {
    // Load shader once and cache it
    if (!myShader) {
      myShader = p.loadShader(
        "/sketches/spatial-synthesizer/shader.vert",
        "/sketches/spatial-synthesizer/fm.frag"
      );
    }
  };

  p.setup = () => {
    canvas = p.createCanvas(parent.clientWidth, parent.clientWidth, p.WEBGL);
    canvas.parent(parent);
  };

  // Debounce resize handler to prevent rapid canvas resizing
  p.windowResized = debounce(() => {
    if (!canvas) return;
    p.resizeCanvas(parent.clientWidth, parent.clientWidth);
  }, 250);

  p.draw = () => {
    if (!myShader || !canvas) return;
    
    p.shader(myShader);

    // Batch uniform updates to minimize state changes
    const uniforms: Record<string, number | number[]> = {
      u_resolution: [p.width, p.height],
      u_time: p.millis() / 1000,
    };

    // Collect all uniforms first
    for (const [key, valRef] of Object.entries(paramsRef.current)) {
      if (key === "modulationCenterX" || key === "modulationCenterY") continue;
      uniforms[`u_${key}`] = valRef.current;
    }

    uniforms.u_modulationCenter = [
      paramsRef.current.modulationCenterX.current,
      paramsRef.current.modulationCenterY.current,
    ];

    // Set all uniforms at once
    for (const [key, value] of Object.entries(uniforms)) {
      myShader.setUniform(key, value);
    }

    p.rect(-p.width / 2, -p.height / 2, p.width, p.height);
  };
};

interface SpatialSynthesizerSketchProps {
  width?: number | string;
  height?: number | string;
}

export default function SpatialSynthesizerSketch({
  width = "100%",
  height = "100%",
}: SpatialSynthesizerSketchProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [params, setParams] = useState<SynthParams>(defaultParams);
  const [lfoMap, setLfoMap] = useState<SynthLFOMap>({});
  const [concertMode, setConcertMode] = useState<'manual' | 'gentleWaves' | 'wildRipples' | 'pulsatingEye'>('manual');

  const shaderParamsRef = useRef<Record<keyof SynthParams, React.MutableRefObject<number>>>({
    carrierFreqX: useRef(defaultParams.carrierFreqX),
    carrierFreqY: useRef(defaultParams.carrierFreqY),
    modulatorFreq: useRef(defaultParams.modulatorFreq),
    modulationIndex: useRef(defaultParams.modulationIndex),
    amplitudeModulationIndex: useRef(defaultParams.amplitudeModulationIndex),
    modulationCenterX: useRef(defaultParams.modulationCenterX),
    modulationCenterY: useRef(defaultParams.modulationCenterY),
    lfoFrequency: useRef(defaultParams.lfoFrequency),
    lfoAmplitude: useRef(defaultParams.lfoAmplitude),
  });

  // IntersectionObserver to trigger canvas load
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // LFO animation using requestAnimationFrame, only updating shader refs
  useEffect(() => {
    let rafId: number;
    const start = performance.now();

    const animate = () => {
      const now = performance.now();
      const t = (now - start) / 1000;

      // Only update the shader refs, NEVER update React state
      for (const [key, lfo] of Object.entries(lfoMap) as [keyof SynthParams, SliderLFO][]) {
        const { frequency, amplitude, center, phase } = lfo;
        const val = center + amplitude * Math.sin(2 * Math.PI * frequency * t + phase);
        shaderParamsRef.current[key].current = val;
      }

      rafId = requestAnimationFrame(animate);
    };

    if (Object.keys(lfoMap).length) {
      rafId = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(rafId);
  }, [lfoMap]);

  // Update LFO map when concert mode changes
  useEffect(() => {
    switch (concertMode) {
      case 'gentleWaves':
        setLfoMap(gentleWaves);
        break;
      case 'wildRipples':
        setLfoMap(wildRipples);
        break;
      case 'pulsatingEye':
        setLfoMap(pulsatingEye);
        break;
      case 'manual':
      default:
        setLfoMap({});
        break;
    }
  }, [concertMode]);

  // Modify the handleParamChange to only update the shader ref
  const handleParamChange = (key: keyof SynthParams) => (value: number) => {
    // Only update the shader ref
    shaderParamsRef.current[key].current = value;
    
    // Remove from LFO control if it was being controlled
    if (key in lfoMap) {
      setLfoMap(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  return (
    <div ref={ref} className="flex flex-col md:flex-row gap-8">
      {visible && (
        <>  
          <div className="flex-1">
            <div style={{ width: "100%", aspectRatio: "1/1" }}>
              <P5Container sketch={createSketch(shaderParamsRef)} width="100%" height="100%" />
            </div>
          </div>
          <div className="w-full md:w-64 flex flex-col gap-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-sm uppercase text-gray-500 mb-1">Concert Mode</h3>
              <select
                id="concert-mode"
                value={concertMode}
                onChange={(e) => setConcertMode(e.target.value as typeof concertMode)}
                className="block w-full rounded border-gray-300 py-1.5 text-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="manual">Manual Control</option>
                <option value="gentleWaves">Gentle Waves</option>
                <option value="wildRipples">Wild Ripples</option>
                <option value="pulsatingEye">Pulsating Eye</option>
              </select>
            </div>
            <div>
              <h3 className="font-semibold text-sm uppercase text-gray-500 mb-1">The Tapestry</h3>
              <SliderControl
                label="Vertical stripes"
                {...paramRanges.carrierFreqX}
                value={params.carrierFreqX}
                onChange={handleParamChange("carrierFreqX")}
                shaderValueRef={shaderParamsRef.current.carrierFreqX}
              />
              <SliderControl
                label="Horizontal stripes"
                {...paramRanges.carrierFreqY}
                value={params.carrierFreqY}
                onChange={handleParamChange("carrierFreqY")}
                shaderValueRef={shaderParamsRef.current.carrierFreqY}
              />
            </div>
            <div>
              <h3 className="font-semibold text-sm uppercase text-gray-500 mb-1">Warp Box</h3>
              <SliderControl
                label="Ripples"
                {...paramRanges.modulatorFreq}
                value={params.modulatorFreq}
                onChange={handleParamChange("modulatorFreq")}
                shaderValueRef={shaderParamsRef.current.modulatorFreq}
              />
              <SliderControl
                label="Twist"
                {...paramRanges.modulationIndex}
                value={params.modulationIndex}
                onChange={handleParamChange("modulationIndex")}
                shaderValueRef={shaderParamsRef.current.modulationIndex}
              />
              <SliderControl
                label="Sharpness"
                {...paramRanges.amplitudeModulationIndex}
                value={params.amplitudeModulationIndex}
                onChange={handleParamChange("amplitudeModulationIndex")}
                shaderValueRef={shaderParamsRef.current.amplitudeModulationIndex}
              />
            </div>
            <div>
              <h3 className="font-semibold text-sm uppercase text-gray-500 mb-1">The Eye</h3>
              <SliderControl
                label="Left + right"
                {...paramRanges.modulationCenterX}
                value={params.modulationCenterX}
                onChange={handleParamChange("modulationCenterX")}
                shaderValueRef={shaderParamsRef.current.modulationCenterX}
              />
              <SliderControl
                label="Up + down"
                {...paramRanges.modulationCenterY}
                value={params.modulationCenterY}
                onChange={handleParamChange("modulationCenterY")}
                shaderValueRef={shaderParamsRef.current.modulationCenterY}
              />
            </div>
            <div>
              <h3 className="font-semibold text-sm uppercase text-gray-500 mb-1">Make It Dance</h3>
              <SliderControl
                label="Tempo"
                {...paramRanges.lfoFrequency}
                value={params.lfoFrequency}
                onChange={handleParamChange("lfoFrequency")}
                shaderValueRef={shaderParamsRef.current.lfoFrequency}
              />
              <SliderControl
                label="Volume"
                {...paramRanges.lfoAmplitude}
                value={params.lfoAmplitude}
                onChange={handleParamChange("lfoAmplitude")}
                shaderValueRef={shaderParamsRef.current.lfoAmplitude}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
