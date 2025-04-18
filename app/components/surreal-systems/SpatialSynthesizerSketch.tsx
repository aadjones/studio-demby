"use client";
import React, { useRef, useState, useEffect } from "react";
import P5Container from "../utils/P5Container";

interface SliderControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  shaderValueRef: React.MutableRefObject<number>;
}

function SliderControl({ label, value, onChange, min, max, step }: SliderControlProps) {
  const [localVal, setLocalVal] = useState(value);

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-sm text-gray-600">{localVal.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={localVal}
        onChange={(e) => {
          const v = Number(e.target.value);
          setLocalVal(v);   // moves the knob; re‑renders only this slider
          onChange(v);      // updates the ref
        }}
        className="w-full"
      />
    </div>
  );
}

interface SynthParams {
  carrierFreqX: number;
  carrierFreqY: number;
  modulatorFreq: number;
  modulationIndex: number;
  amplitudeModulationIndex: number;
  modulationCenterX: number;
  modulationCenterY: number;
  lfoFrequency: number;
  lfoAmplitude: number;
}

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

const createSketch = (paramsRef: React.MutableRefObject<Record<keyof SynthParams, React.MutableRefObject<number>>>) => (p: any, parent: HTMLDivElement) => {
  let myShader: any;

  p.preload = () => {
    myShader = p.loadShader(
      "/sketches/spatial-synthesizer/shader.vert",
      "/sketches/spatial-synthesizer/fm.frag"
    );
  };

  p.setup = () => {
    p.createCanvas(parent.clientWidth, parent.clientWidth, p.WEBGL).parent(parent);
  };

  p.windowResized = () => {
    p.resizeCanvas(parent.clientWidth, parent.clientWidth);
  };

  p.draw = () => {
    p.shader(myShader);

    // Set all uniforms except center
    Object.entries(paramsRef.current).forEach(([key, valueRef]) => {
      if (key === "modulationCenterX" || key === "modulationCenterY") return;
      myShader.setUniform(`u_${key}`, valueRef.current);
    });

    // Combined vec2 uniform
    myShader.setUniform("u_modulationCenter", [
      paramsRef.current.modulationCenterX.current,
      paramsRef.current.modulationCenterY.current,
    ]);

    myShader.setUniform("u_resolution", [p.width, p.height]);
    myShader.setUniform("u_time", p.millis() / 1000);
    p.rect(-p.width / 2, -p.height / 2, p.width, p.height);
  };
};

interface SpatialSynthesizerSketchProps {
  width?: number | string;
  height?: number | string;
}

export default function SpatialSynthesizerSketch({ width = "100%", height = "100%" }: SpatialSynthesizerSketchProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  
  // Create state for UI values
  const [params, setParams] = useState<SynthParams>(defaultParams);
  
  // Create refs for shader values
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

  const handleParamChange = (key: keyof SynthParams) => (value: number) => {
    shaderParamsRef.current[key].current = value;     // fast
  };

  return (
    <div ref={ref} className="flex flex-col md:flex-row gap-8">
      {visible && (
        <>
          <div style={{ width, height, aspectRatio: "1/1" }}>
            <P5Container sketch={createSketch(shaderParamsRef)} width="100%" height="100%" />
          </div>
          <div className="w-full md:w-64 space-y-4 p-4 bg-gray-50 rounded-lg">
            {Object.entries(paramRanges).map(([key, { min, max, step }]) => (
              <SliderControl
                key={key}
                label={key}
                value={params[key as keyof SynthParams]}
                onChange={handleParamChange(key as keyof SynthParams)}
                min={min}
                max={max}
                step={step}
                shaderValueRef={shaderParamsRef.current[key as keyof SynthParams]}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
