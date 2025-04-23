import { SynthParams } from './defaultParams';

interface SliderGroup {
  title: string;
  controls: Array<{
    key: keyof SynthParams;
    label: string;
  }>;
}

export const groupsConfig: SliderGroup[] = [
  {
    title: "STRIPES",
    controls: [
      { key: "carrierFreqX", label: "Vertical" },
      { key: "carrierFreqY", label: "Horizontal" },
    ],
  },
  {
    title: "WARP BOX",
    controls: [
      { key: "modulatorFreq", label: "Ripple" },
      { key: "modulationIndex", label: "Twist" },
      { key: "amplitudeModulationIndex", label: "Sharpen" },
    ],
  },
  {
    title: "THE EYE",
    controls: [
      { key: "modulationCenterX", label: "X" },
      { key: "modulationCenterY", label: "Y" },
    ],
  },
  {
    title: "DANCE!",
    controls: [
      { key: "lfoFrequency", label: "Speed" },
      { key: "lfoAmplitude", label: "Intensity" },
    ],
  },
];
