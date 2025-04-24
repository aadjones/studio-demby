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

export const defaultParams: SynthParams = {
  carrierFreqX: 0.5,
  carrierFreqY: 0.5,
  modulatorFreq: 0.5,
  modulationIndex: 1.0,
  amplitudeModulationIndex: 1.0,
  modulationCenterX: 0.0,
  modulationCenterY: 0.0,
  lfoFrequency: 0.1,
  lfoAmplitude: 0.5,
};

export const paramRanges: Record<keyof SynthParams, { min: number; max: number; step: number }> = {
  carrierFreqX: { min: 0.1, max: 10, step: 0.1 },
  carrierFreqY: { min: 0.1, max: 10, step: 0.1 },
  modulatorFreq: { min: 0.1, max: 10, step: 0.1 },
  modulationIndex: { min: 0, max: 5, step: 0.1 },
  amplitudeModulationIndex: { min: 0, max: 5, step: 0.1 },
  modulationCenterX: { min: -1, max: 1, step: 0.01 },
  modulationCenterY: { min: -1, max: 1, step: 0.01 },
  lfoFrequency: { min: 0, max: 10, step: 0.01 },
  lfoAmplitude: { min: 0, max: 2, step: 0.01 },
}; 