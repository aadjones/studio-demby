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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setLocalVal(newValue);
    onChange(newValue);
    shaderValueRef.current = newValue;
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={localVal}
        onChange={handleChange}
        className="w-full"
      />
    </div>
  );
}