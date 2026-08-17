import { describe, it, expect } from "vitest";
import {
  partialFreq,
  centsBetween,
  igrecBToB,
  partialAmp,
  decayTau,
  STEINWAY_1923,
  steinwayB,
} from "@/app/components/mdx-blocks/inharmonicity/lib";

describe("partialFreq", () => {
  it("gives exact harmonics when B = 0", () => {
    for (let n = 1; n <= 20; n++) {
      expect(partialFreq(220, n, 0)).toBeCloseTo(220 * n, 10);
    }
  });

  it("sharpens partials progressively when B > 0", () => {
    const B = 0.0005;
    let prevCents = 0;
    for (let n = 2; n <= 20; n++) {
      const cents = centsBetween(n * 220, partialFreq(220, n, B));
      expect(cents).toBeGreaterThan(prevCents);
      prevCents = cents;
    }
  });

  it("reproduces Igrec's measured deviations for A3 (b = 0.21)", () => {
    // Pianos Inside Out, Table 4: A3 3rd partial +1.89¢, 8th +13.4¢.
    // Igrec's cents ≈ b·n² is a small-B approximation of the exact formula,
    // so allow a slightly looser tolerance at n = 8.
    const B = igrecBToB(0.21);
    const c3 = centsBetween(3 * 220, partialFreq(220, 3, B));
    const c8 = centsBetween(8 * 220, partialFreq(220, 8, B));
    expect(c3).toBeCloseTo(1.89, 1);
    expect(c8).toBeGreaterThan(13.0);
    expect(c8).toBeLessThan(13.6);
  });

  it("puts A4's 8th partial roughly 45 cents sharp on the 1923 Steinway", () => {
    const B = steinwayB("A4")!;
    const c8 = centsBetween(8 * 440, partialFreq(440, 8, B));
    expect(c8).toBeGreaterThan(43);
    expect(c8).toBeLessThan(46);
  });
});

describe("centsBetween", () => {
  it("measures an equal-tempered fifth as 700 cents", () => {
    expect(centsBetween(440, 440 * Math.pow(2, 7 / 12))).toBeCloseTo(700, 6);
  });

  it("is antisymmetric", () => {
    expect(centsBetween(220, 440)).toBeCloseTo(-centsBetween(440, 220), 10);
  });
});

describe("STEINWAY_1923 preset", () => {
  it("covers all eight As with fundamentals doubling", () => {
    expect(STEINWAY_1923).toHaveLength(8);
    for (let i = 1; i < STEINWAY_1923.length; i++) {
      expect(STEINWAY_1923[i].f0).toBeCloseTo(STEINWAY_1923[i - 1].f0 * 2, 6);
    }
  });

  it("dips in the tenor and rises steeply in the treble", () => {
    // The non-monotonic shape is the point: wound/plain break at A2,
    // steep climb toward A7
    expect(steinwayB("A2")!).toBeLessThan(steinwayB("A0")!);
    expect(steinwayB("A2")!).toBeLessThan(steinwayB("A3")!);
    expect(steinwayB("A7")!).toBeGreaterThan(steinwayB("A4")! * 10);
  });
});

describe("envelope helpers", () => {
  it("amplitude trends downward with a strike-position comb dip near n = 8", () => {
    // Overall rolloff (comb makes it non-monotonic locally)
    expect(partialAmp(1)).toBeGreaterThan(partialAmp(4));
    expect(partialAmp(4)).toBeGreaterThan(partialAmp(10));
    expect(partialAmp(10)).toBeGreaterThan(partialAmp(20));
    // Hammer at ~1/8 of the string suppresses the 8th partial vs its neighbors
    expect(partialAmp(8)).toBeLessThan(partialAmp(7));
    expect(partialAmp(8)).toBeLessThan(partialAmp(9));
    // Comb floor: nothing vanishes
    for (let n = 1; n <= 20; n++) expect(partialAmp(n)).toBeGreaterThan(0);
  });

  it("higher partials die faster", () => {
    for (let n = 2; n <= 20; n++) {
      expect(decayTau(220, n)).toBeLessThan(decayTau(220, n - 1));
    }
  });

  it("bass notes ring longer than treble notes", () => {
    expect(decayTau(55, 1)).toBeGreaterThan(decayTau(880, 1));
  });
});
