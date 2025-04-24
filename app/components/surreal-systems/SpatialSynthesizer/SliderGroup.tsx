// components/SpatialSynthesizer/SliderGroup.tsx
import React from "react";
import SliderControl from "../../utils/SliderControl";
import type { SynthParams } from "../types";

interface SliderGroupProps {
  title: string;
  controls: Array<{ key: keyof SynthParams; label: string }>;
  defaultParams: SynthParams;
  paramRanges: Record<keyof SynthParams, { min: number; max: number; step: number }>;
  shaderRefs: Record<keyof SynthParams, React.MutableRefObject<number>>;
  onParamChange: (k: keyof SynthParams) => (v: number) => void;
  sliderRefs: Record<keyof SynthParams, HTMLInputElement | null>;
}

export default function SliderGroup({
  title,
  controls,
  defaultParams,
  paramRanges,
  shaderRefs,
  onParamChange,
  sliderRefs,
}: SliderGroupProps) {
  const handleResetGroup = () => {
    controls.forEach(({ key }) => {
      const def = defaultParams[key];
      shaderRefs[key].current = def;
      const slider = sliderRefs[key];
      if (slider) slider.value = def.toString();
    });
  };

  return (
    <div className="border rounded-lg bg-white">
      {/* header with tighter padding */}
      <div className="flex justify-between items-center px-3 py-1.5">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <button
          onClick={handleResetGroup}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Reset
        </button>
      </div>

      {/* slider row with reduced vertical padding and gap */}
      <div className="px-3 pb-2 flex justify-center gap-2">
        {controls.map(({ key, label }) => (
          <SliderControl
            key={key}
            label={label}
            value={shaderRefs[key].current}
            {...paramRanges[key]}
            shaderValueRef={shaderRefs[key]}
            onChange={onParamChange(key)}
            sliderRef={(el) => (sliderRefs[key] = el)}
            vertical
          />
        ))}
      </div>
    </div>
  );
}
