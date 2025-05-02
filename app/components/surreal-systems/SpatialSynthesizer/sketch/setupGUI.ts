import { SynthParams } from '../config/defaultParams';

let params: SynthParams = {
  carrierFreqX: 0.5,
  carrierFreqY: 0.5,
  modulatorFreq: 0.5,
  modulationIndex: 1.0,
  amplitudeModulationIndex: 1.0,
  modulationCenterX: 0.0,
  modulationCenterY: 0.0,
  lfoFrequency: 0.1,
  lfoAmplitude: 0.5
};

// Global controller variables
let carrierFreqXController: any, carrierFreqYController: any;
let modulatorFreqController: any, modulationIndexController: any, amplitudeModulationIndexController: any;
let modulationCenterXController: any, modulationCenterYController: any;
let lfoFrequencyController: any, lfoAmplitudeController: any;
let gui: any;

let activeLFOMap: any = null;

export function setupGUI(p: any) {
  gui = new (window as any).dat.GUI({ width: 200 });
  gui.domElement.style.display = 'none'; // Hide GUI by default

  const stripesFolder = gui.addFolder('STRIPES');
  carrierFreqXController = stripesFolder.add(params, 'carrierFreqX', 0.1, 10.0).step(0.01).name('Vertical');
  carrierFreqYController = stripesFolder.add(params, 'carrierFreqY', 0.1, 10.0).step(0.01).name('Horizontal');
  stripesFolder.open();

  const warpBoxFolder = gui.addFolder('WARP BOX');
  modulatorFreqController = warpBoxFolder.add(params, 'modulatorFreq', 0.1, 10.0).step(0.01).name('Ripple');
  modulationIndexController = warpBoxFolder.add(params, 'modulationIndex', 0.0, 5.0).step(0.05).name('Twist');
  amplitudeModulationIndexController = warpBoxFolder.add(params, 'amplitudeModulationIndex', 0.0, 5.0).step(0.05).name('Sharpen');
  warpBoxFolder.open();

  const eyeFolder = gui.addFolder('THE EYE');
  modulationCenterXController = eyeFolder.add(params, 'modulationCenterX', -1.0, 1.0).step(0.01).name('↔');
  modulationCenterYController = eyeFolder.add(params, 'modulationCenterY', -1.0, 1.0).step(0.01).name('↕');

  const danceFolder = gui.addFolder('DANCE!');
  lfoFrequencyController = danceFolder.add(params, 'lfoFrequency', 0.0, 2.0).step(0.001).name('Speed');
  lfoAmplitudeController = danceFolder.add(params, 'lfoAmplitude', 0.0, 2.0).step(0.05).name('Intensity');

  const presetFolder = gui.addFolder('MOTIONS');
  presetFolder.add({ ManualMode: () => manualMode() }, 'ManualMode').name('Manual');
  presetFolder.add({ GentleWaves: () => gentleWaves() }, 'GentleWaves').name('Gentle Waves');
  presetFolder.add({ WildRipples: () => wildRipples() }, 'WildRipples').name('Wild Ripples');
  presetFolder.add({ PulsatingEye: () => pulsatingEye() }, 'PulsatingEye').name('Pulsating Eye');
  presetFolder.open();

  // GUI position
  gui.domElement.style.position = 'fixed';
  gui.domElement.style.top = '20px';
  gui.domElement.style.right = '20px';

  return params;
}

export function toggleGUI(show: boolean) {
  if (gui) {
    gui.domElement.style.display = show ? 'block' : 'none';
  }
}

export function updateGUI() {
  carrierFreqXController.updateDisplay();
  carrierFreqYController.updateDisplay();
  modulatorFreqController.updateDisplay();
  modulationIndexController.updateDisplay();
  amplitudeModulationIndexController.updateDisplay();
  modulationCenterXController.updateDisplay();
  modulationCenterYController.updateDisplay();
  lfoFrequencyController.updateDisplay();
  lfoAmplitudeController.updateDisplay();
}

export function updateParamsFromLFOs(time: number) {
  if (!activeLFOMap) return;

  for (const param in activeLFOMap) {
    const lfo = activeLFOMap[param];
    params[param as keyof SynthParams] = lfo.center + lfo.amplitude * Math.sin(2 * Math.PI * lfo.frequency * time + lfo.phase);
  }
}

// Preset functions
export function gentleWaves() {
  activeLFOMap = {
    carrierFreqX: { frequency: 0.2, amplitude: 0.3, center: 0.5, phase: 0 },
    carrierFreqY: { frequency: 0.15, amplitude: 0.2, center: 0.5, phase: Math.PI / 2 },
    modulatorFreq: { frequency: 0.1, amplitude: 0.2, center: 0.5, phase: Math.PI },
  };
}

export function wildRipples() {
  activeLFOMap = {
    carrierFreqX: { frequency: 0.8, amplitude: 0.6, center: 0.7, phase: 0 },
    carrierFreqY: { frequency: 0.6, amplitude: 0.5, center: 0.7, phase: Math.PI / 3 },
    modulatorFreq: { frequency: 0.4, amplitude: 0.4, center: 0.6, phase: Math.PI / 2 },
    modulationIndex: { frequency: 0.3, amplitude: 1.5, center: 2.0, phase: Math.PI },
  };
}

export function pulsatingEye() {
  activeLFOMap = {
    modulationIndex: { frequency: 0.2, amplitude: 1.5, center: 2.0, phase: 0 },
    amplitudeModulationIndex: { frequency: 0.15, amplitude: 1.0, center: 1.5, phase: Math.PI / 2 },
    modulationCenterX: { frequency: 0.1, amplitude: 0.5, center: 0.0, phase: 0 },
    modulationCenterY: { frequency: 0.1, amplitude: 0.5, center: 0.0, phase: Math.PI / 2 },
  };
}

export function manualMode() {
  activeLFOMap = null;
} 