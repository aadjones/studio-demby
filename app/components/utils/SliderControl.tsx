import React, { useState } from "react";

export interface EmotionLabel {
  range: [number, number];
  label: string;
}

export interface SliderControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  shaderValueRef: React.MutableRefObject<number>;
  labels?: EmotionLabel[];
  sliderRef?: (el: HTMLInputElement | null) => void;
  vertical?: boolean;
}

function getEmotionLabel(value: number, labels?: EmotionLabel[]) {
  if (!labels) return value.toFixed(2);
  const match = labels.find(({ range }) => value >= range[0] && value <= range[1]);
  return match ? match.label : value.toFixed(2);
}

const TRACK_LENGTH = 100; // px, adjust to taste

export default function SliderControl({
  label,
  value,
  onChange,
  min,
  max,
  step,
  shaderValueRef,
  labels,
  sliderRef,
  vertical = false,
}: SliderControlProps) {
  const [localVal, setLocalVal] = useState(value);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Display current value or emotion label */}
      <span className="text-[10px] font-medium text-gray-400">
        {getEmotionLabel(localVal, labels)}
      </span>

      {/* Slider track container with fixed height */}
      <div
        className="flex items-center"
        style={{ height: vertical ? TRACK_LENGTH : undefined }}
      >
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
          ref={sliderRef}
          className="vertical-slider"
          style={
            vertical
              ? {
                  writingMode: 'vertical-lr' as const,
                  WebkitAppearance: 'slider-vertical',
                  width: '20px',
                  height: '100%',
                  transform: 'rotate(180deg)',
                }
              : {}
          }
        />
      </div>

      {/* Label below slider */}
      <span className="text-[10px] font-medium text-gray-600 whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}
