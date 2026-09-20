import { describe, it, expect } from "vitest";
import {
  INSTRUMENTS,
  coreText,
  extText,
  rangeText,
  type Instrument,
} from "@/app/components/mdx-blocks/clef-rake/lib/instruments";
import { HIGH, LOW, noteName } from "@/app/components/mdx-blocks/clef-rake/lib/pitch";

describe("rangeText", () => {
  it("builds a range from two indices", () => {
    expect(rangeText(28, 49)).toBe("C4–C7");
  });

  it("uses an em dash with no surrounding spaces", () => {
    expect(rangeText(28, 49)).not.toMatch(/\s[–—]\s/);
  });
});

describe("range data", () => {
  it("keeps every range ordered and inside the displayed ladder", () => {
    for (const inst of INSTRUMENTS) {
      expect(inst.ext[0]).toBeLessThan(inst.ext[1]);
      expect(inst.core[0]).toBeLessThan(inst.core[1]);
      expect(inst.ext[0]).toBeGreaterThanOrEqual(LOW);
      expect(inst.ext[1]).toBeLessThanOrEqual(HIGH);
    }
  });

  it("nests the everyday range inside the extreme range", () => {
    for (const inst of INSTRUMENTS) {
      expect(inst.core[0]).toBeGreaterThanOrEqual(inst.ext[0]);
      expect(inst.core[1]).toBeLessThanOrEqual(inst.ext[1]);
    }
  });

  it("names instruments uniquely", () => {
    const names = INSTRUMENTS.map((i) => i.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

/**
 * The prototype stored each range twice—as indices and as display text—so the
 * two could silently diverge. Text is now derived, and the one row that needs
 * to differ says so explicitly. These tests guard that override from drifting
 * away from the indices it annotates.
 */
describe("display text overrides", () => {
  const overridden = INSTRUMENTS.filter((i) => i.extText || i.coreText);

  it("is used on exactly one row", () => {
    expect(overridden.map((i) => i.name)).toEqual(["Bassoon"]);
  });

  it("differs from the derived text only by an accidental", () => {
    // B♭1 is written on the B1 staff position. Strip accidentals and the
    // override must land back on exactly what the indices say.
    const strip = (s: string) => s.replace(/[♭♯]/g, "");
    for (const inst of overridden) {
      expect(strip(extText(inst))).toBe(rangeText(...inst.ext));
      expect(strip(coreText(inst))).toBe(rangeText(...inst.core));
    }
  });

  it("explains itself in a note", () => {
    for (const inst of overridden) expect(inst.note).toBeTruthy();
  });
});

describe("derived text", () => {
  const plain = INSTRUMENTS.filter((i) => !i.extText && !i.coreText);

  it("covers twelve of the thirteen instruments", () => {
    expect(plain).toHaveLength(12);
  });

  it("matches the indices exactly", () => {
    const endpoints = (inst: Instrument) => [
      noteName(inst.ext[0]),
      noteName(inst.ext[1]),
      noteName(inst.core[0]),
      noteName(inst.core[1]),
    ];
    for (const inst of plain) {
      const [eLo, eHi, cLo, cHi] = endpoints(inst);
      expect(extText(inst)).toBe(`${eLo}–${eHi}`);
      expect(coreText(inst)).toBe(`${cLo}–${cHi}`);
    }
  });
});
