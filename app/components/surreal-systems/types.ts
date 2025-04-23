export interface SynthParams {
  carrierFreqX: number;
  carrierFreqY: number;
  modulatorFreq: number;
  modulationIndex: number;
  amplitudeModulationIndex: number;
  modulationCenterX: number;
  modulationCenterY: number;
  lfoFrequency: number;
  lfoAmplitude: number;
}

export interface SliderLFO {
  frequency: number;  // Hz
  amplitude: number;  // range of motion
  center: number;     // midpoint of oscillation
  phase: number;      // phase offset in radians
}

export type SynthLFOMap = Partial<Record<keyof SynthParams, SliderLFO>>; 