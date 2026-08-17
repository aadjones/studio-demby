import { describe, it, expect } from "vitest";
import {
  fftMag,
  nextPow2,
  applyHann,
} from "@/app/components/mdx-blocks/inharmonicity/fft";
import { analyzeStringSpectrum } from "@/app/components/mdx-blocks/inharmonicity/analysis";
import { partialFreq } from "@/app/components/mdx-blocks/inharmonicity/lib";

const SR = 48000;

function synthesizeString(
  f0: number,
  B: number,
  partials: number,
  seconds: number
): Float64Array {
  const out = new Float64Array(Math.floor(SR * seconds));
  for (let n = 1; n <= partials; n++) {
    const fn = partialFreq(f0, n, B);
    const amp = 1 / n;
    const phase = Math.random() * Math.PI * 2;
    const w = (2 * Math.PI * fn) / SR;
    for (let i = 0; i < out.length; i++) {
      out[i] += amp * Math.sin(w * i + phase);
    }
  }
  return out;
}

describe("fftMag", () => {
  it("puts the peak of a pure sine at its frequency", () => {
    const f = 1000;
    const sig = new Float64Array(SR);
    for (let i = 0; i < sig.length; i++) {
      sig[i] = Math.sin((2 * Math.PI * f * i) / SR);
    }
    applyHann(sig);
    const N = nextPow2(sig.length);
    const mags = fftMag(sig, N);
    let iMax = 1;
    for (let i = 1; i < mags.length; i++) if (mags[i] > mags[iMax]) iMax = i;
    expect((iMax * SR) / N).toBeCloseTo(f, 0);
  });

  it("rejects a non-power-of-two size", () => {
    expect(() => fftMag(new Float64Array(10), 1000)).toThrow();
  });
});

describe("analyzeStringSpectrum", () => {
  it("recovers f0 and B from a synthetic stiff string", () => {
    const sig = synthesizeString(220, 0.0004, 14, 4);
    const result = analyzeStringSpectrum(sig, SR, 220, 14, 0);
    expect(result.f0).toBeGreaterThan(219.8);
    expect(result.f0).toBeLessThan(220.2);
    expect(result.B).toBeGreaterThan(0.0004 * 0.9);
    expect(result.B).toBeLessThan(0.0004 * 1.1);
    // measured deviations grow with n, as inharmonicity demands
    const c4 = result.partials.find((p) => p.n === 4)!.cents;
    const c12 = result.partials.find((p) => p.n === 12)!.cents;
    expect(c12).toBeGreaterThan(c4);
    expect(c12).toBeGreaterThan(20); // 0.0004·144 → ~49¢ actual
  });

  it("fits B ≈ 0 for a perfectly harmonic signal", () => {
    const sig = synthesizeString(220, 0, 12, 4);
    const result = analyzeStringSpectrum(sig, SR, 220, 12, 0);
    expect(result.B).toBeLessThan(0.00002);
    for (const p of result.partials) {
      expect(Math.abs(p.cents)).toBeLessThan(1);
    }
  });

  it("survives a detuned unison pair like a real piano note", () => {
    // Two "strings" ±0.4 cents, like the audio engine and real pianos
    const a = synthesizeString(220 * Math.pow(2, -0.4 / 1200), 0.0003, 12, 4);
    const b = synthesizeString(220 * Math.pow(2, 0.4 / 1200), 0.0003, 12, 4);
    const sig = new Float64Array(a.length);
    for (let i = 0; i < sig.length; i++) sig[i] = a[i] + b[i];
    const result = analyzeStringSpectrum(sig, SR, 220, 12, 0);
    expect(result.B).toBeGreaterThan(0.0003 * 0.75);
    expect(result.B).toBeLessThan(0.0003 * 1.25);
  });
});
