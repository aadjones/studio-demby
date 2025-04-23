// components/SpatialSynthesizer/index.tsx
"use client";
import React, { useRef, useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import P5Container from "../../utils/P5Container";
import SliderGroup from "./SliderGroup";
import { SynthParams, SliderLFO, SynthLFOMap } from "./types";
import { gentleWaves, wildRipples, pulsatingEye } from "./config/concertPresets";
import { defaultParams, paramRanges } from "./config/defaultParams";
import { createSketch } from "./sketch/createSketch";
import { groupsConfig } from "./config/sliderGroups";

// Preset mode tabs
const modeList = [
  { key: "manual",      label: "Manual" },
  { key: "gentleWaves", label: "Gentle Waves" },
  { key: "wildRipples", label: "Wild Ripples" },
  { key: "pulsatingEye",label: "Pulsating Eye" },
] as const;
type ConcertMode = (typeof modeList)[number]["key"];

export default function SpatialSynthesizer() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [concertMode, setConcertMode] = useState<ConcertMode>("manual");
  const [lfoMap, setLfoMap] = useState<SynthLFOMap>({});

  // slider refs
  const sliderRefs = useRef<Record<keyof SynthParams, HTMLInputElement | null>>({
    carrierFreqX: null, carrierFreqY: null,
    modulatorFreq: null, modulationIndex: null,
    amplitudeModulationIndex: null,
    modulationCenterX: null, modulationCenterY: null,
    lfoFrequency: null, lfoAmplitude: null,
  });

  // shader param refs
  const shaderParamsRef = useRef<Record<keyof SynthParams, React.MutableRefObject<number>>>(
    Object.fromEntries(
      (Object.entries(defaultParams) as [keyof SynthParams, number][])
        .map(([k, v]) => [k, useRef(v)])
    ) as any
  );

  // lazy‐load canvas
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // apply presets
  useEffect(() => {
    switch (concertMode) {
      case "gentleWaves":  setLfoMap(gentleWaves);  break;
      case "wildRipples":  setLfoMap(wildRipples);  break;
      case "pulsatingEye": setLfoMap(pulsatingEye); break;
      default:             setLfoMap({});           break;
    }
  }, [concertMode]);

  // animate LFOs
  useEffect(() => {
    if (!Object.keys(lfoMap).length) return;
    let raf: number;
    const start = performance.now();
    const step = () => {
      const t = (performance.now() - start) / 1000;
      Object.entries(lfoMap).forEach(([k, { frequency, amplitude, center, phase }]) => {
        const val = center + amplitude * Math.sin(2 * Math.PI * frequency * t + phase);
        shaderParamsRef.current[k as keyof SynthParams].current = val;
        const slider = sliderRefs.current[k as keyof SynthParams];
        if (slider) slider.value = val.toString();
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [lfoMap]);

  const handleParamChange = (k: keyof SynthParams) => (v: number) => {
    shaderParamsRef.current[k].current = v;
    if (k in lfoMap) {
      setLfoMap(prev => {
        const next = { ...prev };
        delete next[k];
        return next;
      });
    }
  };

  const resetAll = () => {
    (Object.entries(defaultParams) as [keyof SynthParams, number][])
      .forEach(([k, v]) => {
        shaderParamsRef.current[k].current = v;
        sliderRefs.current[k]!.value = v.toString();
      });
    setLfoMap({});
  };

  return (
    <div ref={ref} className="w-full">
      {visible && (
        <div className="bg-gray-50 rounded-xl p-6 w-full">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            
            {/* ── Canvas & Mode Tabs ── */}
            <div className="md:w-1/2 bg-white rounded-lg p-4 flex flex-col items-center">
              <div className="w-[360px] h-[360px] rounded-lg overflow-hidden mb-4">
                <P5Container
                  sketch={createSketch(shaderParamsRef)}
                  width={360}
                  height={360}
                />
              </div>
              <Tab.Group
                selectedIndex={modeList.findIndex(m => m.key === concertMode)}
                onChange={i => setConcertMode(modeList[i].key)}
                as="div"
                className="w-full"
              >
                <Tab.List className="flex space-x-2 bg-gray-100 rounded-full p-1">
                  {modeList.map(({ key, label }) => (
                    <Tab
                      key={key}
                      className={({ selected }) =>
                        `flex-1 text-sm py-1 rounded-full text-center cursor-pointer
                         ${selected
                           ? "bg-white text-blue-600 shadow"
                           : "text-gray-600 hover:text-gray-800"}`
                      }
                    >
                      {label}
                    </Tab>
                  ))}
                </Tab.List>
              </Tab.Group>
            </div>

            {/* ── 2×2 Slider Groups ── */}
            <div className="md:w-1/2 bg-white rounded-lg p-4">
              <div className="grid grid-cols-2 gap-6">
                {groupsConfig.map(({ title, controls }) => (
                  <SliderGroup
                    key={title}
                    title={title}
                    controls={controls}
                    defaultParams={defaultParams}
                    paramRanges={paramRanges}
                    shaderRefs={shaderParamsRef.current}
                    onParamChange={handleParamChange}
                    sliderRefs={sliderRefs.current}
                  />
                ))}
              </div>

              <button
                onClick={resetAll}
                className="mt-4 text-xs text-red-500 hover:text-red-700"
              >
                Reset All
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
