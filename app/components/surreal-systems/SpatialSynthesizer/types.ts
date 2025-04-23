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
  frequency: number;
  amplitude: number;
  center: number;
  phase: number;
}

export type SynthLFOMap = Partial<Record<keyof SynthParams, SliderLFO>>; 