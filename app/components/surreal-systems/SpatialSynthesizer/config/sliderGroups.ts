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
    title: "THE TAPESTRY",
    controls: [
      { key: "carrierFreqX", label: "Vertical" },
      { key: "carrierFreqY", label: "Horizontal" },
    ],
  },
  {
    title: "WARP BOX",
    controls: [
      { key: "modulatorFreq", label: "Ripples" },
      { key: "modulationIndex", label: "Twist" },
      { key: "amplitudeModulationIndex", label: "Sharpness" },
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
    title: "MAKE IT DANCE",
    controls: [
      { key: "lfoFrequency", label: "Speed" },
      { key: "lfoAmplitude", label: "Intensity" },
    ],
  },
];
