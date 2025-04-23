import React from "react";
import SliderControl from "../../utils/SliderControl";
import { SynthParams } from "../types";

interface SliderGroupProps {
  title: string;
  controls: Array<{ key: keyof SynthParams; label: string }>;
  defaultParams: SynthParams;
  paramRanges: typeof import("./config/defaultParams").paramRanges;
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
  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();           // don’t toggle <details>
    controls.forEach(({ key }) => {
      const def = defaultParams[key];
      shaderRefs[key].current = def;
      const slider = sliderRefs[key];
      if (slider) slider.value = def.toString();
    });
  };

  return (
    <details open className="border rounded-md bg-white">
      <summary className="flex justify-between items-center px-3 py-1 cursor-pointer">
        <span className="text-sm font-semibold">{title}</span>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Reset
        </button>
      </summary>
      <div className="p-3 flex justify-center gap-4">
        {controls.map(({ key, label }) => (
          <SliderControl
            key={key}
            label={label}
            {...paramRanges[key]}
            value={shaderRefs[key].current}
            onChange={onParamChange(key)}
            shaderValueRef={shaderRefs[key]}
            sliderRef={(el) => (sliderRefs[key] = el)}
            vertical
          />
        ))}
      </div>
    </details>
  );
}
