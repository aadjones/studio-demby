import { describe, it, expect } from "vitest";
import {
  DEFAULT_INSTRUMENT,
  INSTRUMENTS,
  coreText,
  extText,
  rangeText,
  type Instrument,
} from "@/app/components/mdx-blocks/clef-rake/lib/instruments";
import { clefByName } from "@/app/components/mdx-blocks/clef-rake/lib/clefs";
import { bestClefs } from "@/app/components/mdx-blocks/clef-rake/lib/ledger";
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

/**
 * Section 8's widget jumps to the instrument's real clef when you pick it, so
 * these names have to resolve. A typo would otherwise fail silently: the lookup
 * returns undefined and the staff simply does not move.
 */
describe("conventional clefs", () => {
  it("names a real clef for every instrument", () => {
    for (const inst of INSTRUMENTS) {
      expect(clefByName(inst.clef), `${inst.name} → ${inst.clef}`).toBeDefined();
    }
  });

  it("uses only the clefs that are still read today", () => {
    // Array.from, not a spread: the tsconfig target predates Set iteration.
    const used = Array.from(new Set(INSTRUMENTS.map((i) => i.clef)));
    // Tenor is absent on purpose: no instrument reads it full-time, it is
    // switched into mid-piece. That asymmetry is section 8's point.
    expect(used.sort()).toEqual(["Alto", "Bass", "Treble"]);
  });

  it("leaves the viola alone on alto clef", () => {
    const alto = INSTRUMENTS.filter((i) => i.clef === "Alto");
    expect(alto.map((i) => i.name)).toEqual(["Viola"]);
  });

  it("opens on a staff that already matches the default instrument", () => {
    // The widget's initial position and its initial instrument are set
    // independently; if they drift apart it opens on the wrong clef.
    expect(DEFAULT_INSTRUMENT.clef).toBe("Alto");
    expect(clefByName(DEFAULT_INSTRUMENT.clef)!.bottom).toBe(24);
  });
});

/**
 * Section 8 claims in prose that "for 10 of the 13 instruments here, the clef
 * that players actually use is the one that needs the fewest ledger lines".
 * That is a computable claim, so it is computed.
 *
 * Measured on the *everyday* range, not the extreme one: on the extreme range
 * every instrument's conventional clef is a minimum (13 of 13), which is a
 * weaker and less interesting statement.
 */
describe("clefs minimise ledger lines", () => {
  const minimises = (inst: Instrument) =>
    bestClefs(...inst.core).some((c) => c.name === inst.clef);

  it("holds for 10 of the 13 instruments", () => {
    expect(INSTRUMENTS.filter(minimises)).toHaveLength(10);
  });

  it("fails only where transposition or convention overrode it", () => {
    // Guitar sounds an octave below what it reads, so its treble clef is not
    // really pointing where it appears to. Trombone genuinely does better in
    // tenor up high. Alto voice was written in alto clef historically and
    // moved to treble. Each exception is explicable; none is a data error.
    const exceptions = INSTRUMENTS.filter((i) => !minimises(i)).map((i) => i.name);
    expect(exceptions.sort()).toEqual(["Alto voice", "Guitar", "Trombone"]);
  });
});
