import React, { useState } from "react";

export interface SliderControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  shaderValueRef: React.MutableRefObject<number>;
}

export default function SliderControl({
  label,
  value,
  onChange,
  min,
  max,
  step,
  shaderValueRef,
}: SliderControlProps) {
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
          setLocalVal(v);
          onChange(v);
        }}
        className="w-full"
      />
    </div>
  );
}
