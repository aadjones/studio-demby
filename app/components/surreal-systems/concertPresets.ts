import { SynthLFOMap } from './types';

export const gentleWaves: SynthLFOMap = {
  carrierFreqX: { frequency: 0.02, amplitude: 0.15, center: 1.0, phase: 0 },
  modulationIndex: { frequency: 0.03, amplitude: 0.15, center: 1.0, phase: Math.PI / 2 },
  lfoAmplitude: { frequency: 0.05, amplitude: 0.08, center: 0.3, phase: Math.PI },
};

export const wildRipples: SynthLFOMap = {
  carrierFreqX: { frequency: 0.1, amplitude: 0.3, center: 2.0, phase: 0 },
  carrierFreqY: { frequency: 0.08, amplitude: 0.3, center: 1.5, phase: Math.PI / 4 },
  modulationIndex: { frequency: 0.15, amplitude: 0.4, center: 1.2, phase: Math.PI / 2 },
};

export const pulsatingEye: SynthLFOMap = {
  modulationCenterX: { frequency: 0.04, amplitude: 0.5, center: 0, phase: 0 },
  modulationCenterY: { frequency: 0.03, amplitude: 0.5, center: 0, phase: Math.PI / 3 },
  modulationIndex: { frequency: 0.06, amplitude: 0.2, center: 0.8, phase: Math.PI },
}; 