import { SynthLFOMap } from '../types';

export const gentleWaves: SynthLFOMap = {
  carrierFreqX: { frequency: 0.2, amplitude: 0.3, center: 0.5, phase: 0 },
  carrierFreqY: { frequency: 0.15, amplitude: 0.2, center: 0.5, phase: Math.PI / 2 },
  modulatorFreq: { frequency: 0.1, amplitude: 0.2, center: 0.5, phase: Math.PI },
};

export const wildRipples: SynthLFOMap = {
  carrierFreqX: { frequency: 0.8, amplitude: 0.6, center: 0.7, phase: 0 },
  carrierFreqY: { frequency: 0.6, amplitude: 0.5, center: 0.7, phase: Math.PI / 3 },
  modulatorFreq: { frequency: 0.4, amplitude: 0.4, center: 0.6, phase: Math.PI / 2 },
  modulationIndex: { frequency: 0.3, amplitude: 1.5, center: 2, phase: Math.PI },
};

export const pulsatingEye: SynthLFOMap = {
  modulationIndex: { frequency: 0.2, amplitude: 1.5, center: 2, phase: 0 },
  amplitudeModulationIndex: { frequency: 0.15, amplitude: 1, center: 1.5, phase: Math.PI / 2 },
  modulationCenterX: { frequency: 0.1, amplitude: 0.5, center: 0, phase: 0 },
  modulationCenterY: { frequency: 0.1, amplitude: 0.5, center: 0, phase: Math.PI / 2 },
}; 