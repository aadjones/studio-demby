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

// Mode tabs (Manual / Presets)
const modeList = [
  { key: "manual", label: "Manual" },
  { key: "gentleWaves", label: "Gentle Waves" },
  { key: "wildRipples", label: "Wild Ripples" },
  { key: "pulsatingEye", label: "Pulsating Eye" },
] as const;

type ConcertMode = (typeof modeList)[number]["key"];

// Slider-group tabs
const groupList = [
  { key: "tapestry", title: "THE TAPESTRY", controlsKey: "tapestry" },
  { key: "warp",     title: "WARP BOX",     controlsKey: "warp"     },
  { key: "eye",      title: "THE EYE",      controlsKey: "eye"      },
  { key: "dance",    title: "MAKE IT DANCE",controlsKey: "dance"    },
];

// Map controlsKey → the array of controls from your config/sliderGroups.ts
import { groupsConfig } from "./config/sliderGroups";

export default function SpatialSynthesizer() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [concertMode, setConcertMode] = useState<ConcertMode>("manual");
  const [lfoMap, setLfoMap] = useState<SynthLFOMap>({});
  const [activeGroup, setActiveGroup] = useState(groupList[0].key);

  // Refs for sliders and shader parameters
  const sliderRefs = useRef<Record<keyof SynthParams, HTMLInputElement | null>>({
    carrierFreqX: null,
    carrierFreqY: null,
    modulatorFreq: null,
    modulationIndex: null,
    amplitudeModulationIndex: null,
    modulationCenterX: null,
    modulationCenterY: null,
    lfoFrequency: null,
    lfoAmplitude: null,
  });

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

  // Lazy-load canvas
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

  // Handle parameter changes
  const handleParamChange = (key: keyof SynthParams) => (value: number) => {
    shaderParamsRef.current[key].current = value;
    if (key in lfoMap) {
      setLfoMap(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  // Reset all parameters
  const resetAll = () => {
    Object.entries(defaultParams).forEach(([key, value]) => {
      const paramKey = key as keyof SynthParams;
      shaderParamsRef.current[paramKey].current = value;
      const slider = sliderRefs.current[paramKey];
      if (slider) slider.value = value.toString();
    });
    setLfoMap({});
  };

  // Update LFO map on mode change
  useEffect(() => {
    switch (concertMode) {
      case 'gentleWaves': setLfoMap(gentleWaves); break;
      case 'wildRipples': setLfoMap(wildRipples); break;
      case 'pulsatingEye': setLfoMap(pulsatingEye); break;
      default: setLfoMap({}); break;
    }
  }, [concertMode]);

  return (
    <div ref={ref} className="w-full flex justify-center">
      {visible && (
        <div className="bg-gray-50 rounded-xl p-4 flex flex-col md:flex-row w-full + max-w-screen-lg">
          
          {/* ─────── Canvas + Mode Tabs ─────── */}
          <div className="md:w-2/5 flex flex-col items-center">
            <div className="w-[320px] h-[320px] rounded-lg overflow-hidden mb-4">
              <P5Container sketch={createSketch(shaderParamsRef)} width={320} height={320} />
            </div>
            <div className="w-full flex justify-center items-center mb-6">
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
                         ${selected ? "bg-white text-blue-600 shadow" : "text-gray-600 hover:text-gray-800"}`
                      }
                    >
                      {label}
                    </Tab>
                  ))}
                </Tab.List>
              </Tab.Group>
            </div>
          </div>

          {/* ─────── Controls ─────── */}
          <div className="md:w-3/5 px-4">
            {/* Slider-group tabs */}
            <Tab.Group
              selectedIndex={groupList.findIndex(g => g.key === activeGroup)}
              onChange={i => setActiveGroup(groupList[i].key)}
              as="div"
              className="mb-4"
            >
              <Tab.List className="flex space-x-2 overflow-x-auto">
                {groupList.map(({ key, title }) => (
                  <Tab
                    key={key}
                    className={({ selected }) =>
                      `text-xs font-medium px-3 py-1 whitespace-nowrap rounded
                       ${selected ? "bg-white shadow" : "bg-gray-100 hover:bg-gray-200"}`
                    }
                  >
                    {title}
                  </Tab>
                ))}
              </Tab.List>
            </Tab.Group>

            {/* Only one group's sliders */}
            {groupList.map(({ key, title }) => {
              const group = groupsConfig.find(g => g.title === title);
              if (!group) return null;
              
              return (
                <div key={key} style={{ display: key === activeGroup ? "block" : "none" }}>
                  <SliderGroup
                    title={group.title}
                    controls={group.controls}
                    defaultParams={defaultParams}
                    paramRanges={paramRanges}
                    shaderRefs={shaderParamsRef.current}
                    onParamChange={handleParamChange}
                    sliderRefs={sliderRefs.current}
                  />
                </div>
              );
            })}

            {/* Global Reset */}
            <button
              onClick={resetAll}
              className="mt-4 text-xs text-red-500 hover:text-red-700"
            >
              Reset All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
