// Shared Web Audio engine for the inharmonicity explainer components.
// One lazy AudioContext for the whole page (iOS requires creation inside a
// user gesture); every component plays through the same master gain +
// compressor, and stopAll() lets components silence each other.
//
// A "note" here is modeled after a real piano unison, not a single string:
// two oscillator banks detuned by a fraction of a cent (chorusing + two-stage
// decay), a filtered-noise hammer thump, per-partial start jitter (phase
// decoherence), and a short synthetic room. Pure additive sines with none of
// these read as "organ patch"—see docs/plans/inharmonicity-explainer.md §5.

import { partialFreq, partialAmp, decayTau } from "./lib";

const MASTER_LEVEL = 0.15; // summed oscillator banks clip fast
const MAX_PARTIAL_HZ = 10000;
const VOICE_LIFETIME_S = 12;
const UNISON_DETUNE_CENTS = 0.35; // per string, ± around nominal
const REVERB_WET = 0.15;
const REVERB_SECONDS = 0.9;
const HAMMER_LEVEL = 0.6;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let outBus: DynamicsCompressorNode | null = null;
let noiseBuffer: AudioBuffer | null = null;

function ensureContext(): { ctx: AudioContext; master: GainNode } {
  if (!ctx) {
    const Ctor = window.AudioContext || (window as any).webkitAudioContext;
    ctx = new Ctor();

    const compressor = ctx.createDynamicsCompressor();
    compressor.connect(ctx.destination);
    outBus = compressor;

    master = ctx.createGain();
    master.gain.value = MASTER_LEVEL;
    // Dry path
    master.connect(compressor);
    // Wet path: short synthetic room (exponentially decaying noise IR)
    const convolver = ctx.createConvolver();
    convolver.buffer = makeImpulseResponse(ctx);
    const wet = ctx.createGain();
    wet.gain.value = REVERB_WET;
    master.connect(convolver);
    convolver.connect(wet);
    wet.connect(compressor);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return { ctx, master: master! };
}

function makeImpulseResponse(ctx: AudioContext): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * REVERB_SECONDS);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      const t = i / ctx.sampleRate;
      data[i] = (Math.random() * 2 - 1) * Math.exp(-t / 0.25);
    }
  }
  return buf;
}

function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (!noiseBuffer) {
    const len = Math.floor(ctx.sampleRate * 0.08);
    noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

export interface VoiceHandle {
  /** AudioContext time the strike was scheduled at. */
  startTime: number;
  f0: number;
  B: number;
  partials: number;
  /** Ramp the voice down over `release` seconds and free its nodes. */
  stop: (release?: number) => void;
}

interface Stoppable {
  stop: (release?: number) => void;
}

const activeVoices = new Set<Stoppable>();

export function stopAll(): void {
  for (const v of Array.from(activeVoices)) v.stop(0.05);
}

/**
 * Play a decoded recording through the shared output (dry—recordings carry
 * their own room, so they bypass the synth's reverb). Participates in
 * stopAll() like any synth voice.
 */
export function playSampleBuffer(buffer: AudioBuffer): Stoppable {
  const { ctx } = ensureContext();
  stopAll();
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.value = 0.9;
  src.connect(gain);
  gain.connect(outBus!);
  src.start();

  let stopped = false;
  const handle: Stoppable = {
    stop: (release = 0.05) => {
      if (stopped) return;
      stopped = true;
      activeVoices.delete(handle);
      gain.gain.setTargetAtTime(0, ctx.currentTime, release / 3);
      try {
        src.stop(ctx.currentTime + release + 0.05);
      } catch {}
    },
  };
  src.onended = () => {
    activeVoices.delete(handle);
    try {
      gain.disconnect();
    } catch {}
  };
  activeVoices.add(handle);
  return handle;
}

/** Seconds elapsed in the audio clock since `handle` was struck. */
export function voiceElapsed(handle: VoiceHandle): number {
  return ctx ? ctx.currentTime - handle.startTime : 0;
}

export interface StrikeParams {
  f0: number;
  B: number;
  partials?: number;
  /** 0–1 note-level gain before the master chain. */
  level?: number;
}

/**
 * Strike a piano-like note: two slightly-detuned additive "strings" at
 * stiff-string partial frequencies, plus a hammer thump.
 */
export function strikeNote({
  f0,
  B,
  partials = 20,
  level = 0.6,
}: StrikeParams): VoiceHandle {
  const { ctx, master } = ensureContext();
  const t0 = ctx.currentTime + 0.02;

  const noteGain = ctx.createGain();
  noteGain.gain.value = level;
  noteGain.connect(master);

  // Hammer thump: a short lowpassed noise burst
  const thump = ctx.createBufferSource();
  thump.buffer = getNoiseBuffer(ctx);
  const thumpFilter = ctx.createBiquadFilter();
  thumpFilter.type = "lowpass";
  thumpFilter.frequency.value = Math.min(1200, f0 * 3);
  const thumpGain = ctx.createGain();
  thumpGain.gain.setValueAtTime(HAMMER_LEVEL, t0);
  thumpGain.gain.setTargetAtTime(0, t0 + 0.005, 0.015);
  thump.connect(thumpFilter);
  thumpFilter.connect(thumpGain);
  thumpGain.connect(noteGain);
  thump.start(t0);

  // Two unison strings, detuned ± a fraction of a cent. Their partials beat
  // slowly against each other, giving the chorusing shimmer and two-stage
  // decay of a real unison.
  const oscs: OscillatorNode[] = [];
  const detune = UNISON_DETUNE_CENTS * (0.8 + Math.random() * 0.4);
  for (const stringCents of [-detune, +detune]) {
    const stringF0 = f0 * Math.pow(2, stringCents / 1200);
    for (let n = 1; n <= partials; n++) {
      const fn = partialFreq(stringF0, n, B);
      if (fn > MAX_PARTIAL_HZ || fn > ctx.sampleRate / 2) break;

      // Sub-ms start jitter decoheres the partials' phases so the attack
      // doesn't sound like a synced synth stab
      const tStart = t0 + Math.random() * 0.002;
      const osc = ctx.createOscillator();
      osc.frequency.value = fn;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, tStart);
      gain.gain.linearRampToValueAtTime(partialAmp(n) * 0.5, tStart + 0.003);
      // setTargetAtTime, not exponentialRampToValueAtTime — the latter can't reach 0
      gain.gain.setTargetAtTime(0, tStart + 0.003, decayTau(f0, n));

      osc.connect(gain);
      gain.connect(noteGain);
      osc.start(tStart);
      osc.stop(t0 + VOICE_LIFETIME_S);
      oscs.push(osc);
    }
  }

  let stopped = false;
  const teardown = () => {
    if (stopped) return;
    stopped = true;
    activeVoices.delete(handle);
    try {
      noteGain.disconnect();
    } catch {}
  };

  const handle: VoiceHandle = {
    startTime: t0,
    f0,
    B,
    partials,
    stop: (release = 0.05) => {
      if (stopped) return;
      const now = ctx.currentTime;
      noteGain.gain.setTargetAtTime(0, now, release / 3);
      for (const osc of oscs) {
        try {
          osc.stop(now + release + 0.05);
        } catch {}
      }
      window.setTimeout(teardown, (release + 0.1) * 1000);
    },
  };

  if (oscs.length > 0) oscs[oscs.length - 1].onended = teardown;
  activeVoices.add(handle);
  return handle;
}
