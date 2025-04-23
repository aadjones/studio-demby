// components/SpatialSynthesizer/SliderGrid.tsx
import React from "react";
import SliderGroup from "./SliderGroup";
import { groupsConfig } from "./config/sliderGroups";
import { defaultParams, paramRanges } from "./config/defaultParams";
import type { SynthParams } from "./types";

interface SliderGridProps {
  shaderRefs: Record<keyof SynthParams, React.MutableRefObject<number>>;
  onParamChange: (key: keyof SynthParams) => (v: number) => void;
  sliderRefs: Record<keyof SynthParams, HTMLInputElement | null>;
}

export default function SliderGrid({
  shaderRefs,
  onParamChange,
  sliderRefs,
}: SliderGridProps) {
  return (
    <div className="space-y-4">
      {groupsConfig.map((group) => (
        <SliderGroup
          key={group.title}
          title={group.title}
          controls={group.controls}
          defaultParams={defaultParams}
          paramRanges={paramRanges}
          shaderRefs={shaderRefs}
          onParamChange={onParamChange}
          sliderRefs={sliderRefs}
        />
      ))}
    </div>
  );
}
