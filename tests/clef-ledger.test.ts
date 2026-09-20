import { describe, it, expect } from "vitest";
import { CLEFS, clefAt } from "@/app/components/mdx-blocks/clef-rake/lib/clefs";
import { bestClefs, ledgerCount, ledgerTotal } from "@/app/components/mdx-blocks/clef-rake/lib/ledger";
import { INSTRUMENTS } from "@/app/components/mdx-blocks/clef-rake/lib/instruments";

const BASS = 18;
const ALTO = 24;
const TREBLE = 30;

describe("ledgerCount", () => {
  it("is zero for a range that fits on the staff", () => {
    expect(ledgerCount(ALTO, ALTO + 8, ALTO)).toEqual({ below: 0, above: 0 });
  });

  it("needs no ledger line for the space just outside the staff", () => {
    // One diatonic step past the staff is a space, not a line.
    expect(ledgerCount(ALTO - 1, ALTO + 9, ALTO)).toEqual({
      below: 0,
      above: 0,
    });
  });

  it("adds one ledger line per two diatonic steps beyond the staff", () => {
    expect(ledgerCount(ALTO - 2, ALTO + 8, ALTO).below).toBe(1);
    expect(ledgerCount(ALTO - 4, ALTO + 8, ALTO).below).toBe(2);
    expect(ledgerCount(ALTO, ALTO + 10, ALTO).above).toBe(1);
    expect(ledgerCount(ALTO, ALTO + 12, ALTO).above).toBe(2);
  });

  it("counts the cello's everyday range in bass clef", () => {
    // Cello core is C2..E4 (14..30); bass clef spans 18..26.
    expect(ledgerCount(14, 30, BASS)).toEqual({ below: 2, above: 2 });
  });

  it("puts the soprano voice entirely inside the treble staff", () => {
    expect(ledgerTotal(30, 39, TREBLE)).toBe(0);
  });
});

describe("bestClefs", () => {
  it("returns every clef tied for the minimum", () => {
    const best = bestClefs(21, 36); // viola core
    expect(best.length).toBeGreaterThan(1);
    const totals = best.map((c) => ledgerTotal(21, 36, c.bottom));
    expect(new Set(totals).size).toBe(1);
  });

  it("never returns fewer than one clef", () => {
    for (const c of CLEFS) expect(bestClefs(c.bottom, c.bottom + 8).length).toBeGreaterThan(0);
  });
});

/**
 * The historical claim the explainer makes in §6: a clef exists so an
 * instrument's everyday range fits on the staff without a thicket of ledger
 * lines. That is true for most instruments—and where it fails, something else
 * (octave transposition, register switching, modern convention) overrode it.
 *
 * Encoding the exceptions explicitly means a data edit that changes *which*
 * instruments are exceptions fails loudly, because it would also change what
 * the prose is allowed to say.
 */
const CONVENTIONAL_CLEF: Record<string, string> = {
  Flute: "Treble",
  Violin: "Treble",
  Viola: "Alto",
  Cello: "Bass",
  "Double bass": "Bass",
  Guitar: "Treble",
  Bassoon: "Bass",
  Trombone: "Bass",
  Tuba: "Bass",
  "Soprano voice": "Treble",
  "Alto voice": "Treble",
  "Tenor voice": "Treble",
  "Bass voice": "Bass",
};

const EXPECTED_EXCEPTIONS = new Set([
  "Guitar", // treble clef is an octave-transposing convention, not a fit
  "Trombone", // tenor clef genuinely wins up high, and trombonists use it
  "Alto voice", // historically alto clef; moved to treble in the modern era
]);

describe("clefs minimise ledger lines for the range they serve", () => {
  it("covers every instrument in the conventional-clef table", () => {
    expect(Object.keys(CONVENTIONAL_CLEF).sort()).toEqual(
      INSTRUMENTS.map((i) => i.name).sort()
    );
  });

  for (const inst of INSTRUMENTS) {
    const clefName = CONVENTIONAL_CLEF[inst.name];
    const isException = EXPECTED_EXCEPTIONS.has(inst.name);

    it(`${inst.name}: ${clefName} clef is ${isException ? "NOT" : ""} a minimum`.replace(
      "  ",
      " "
    ), () => {
      const clef = CLEFS.find((c) => c.name === clefName)!;
      const best = bestClefs(...inst.core);
      expect(best.includes(clef)).toBe(!isException);
    });
  }

  it("has exactly three exceptions out of thirteen", () => {
    const actual = INSTRUMENTS.filter((inst) => {
      const clef = CLEFS.find((c) => c.name === CONVENTIONAL_CLEF[inst.name])!;
      return !bestClefs(...inst.core).includes(clef);
    }).map((i) => i.name);

    expect(new Set(actual)).toEqual(EXPECTED_EXCEPTIONS);
  });

  it("still puts each exception within one ledger line of the minimum", () => {
    // The exceptions are overridden conventions, not bad fits—the prose says
    // "close but beaten", and this pins that down.
    for (const name of EXPECTED_EXCEPTIONS) {
      const inst = INSTRUMENTS.find((i) => i.name === name)!;
      const clef = CLEFS.find((c) => c.name === CONVENTIONAL_CLEF[name])!;
      const used = ledgerTotal(...inst.core, clef.bottom);
      const min = ledgerTotal(...inst.core, bestClefs(...inst.core)[0].bottom);
      expect(used - min).toBeLessThanOrEqual(1);
    }
  });
});

describe("the alto clef earns its reputation", () => {
  it("beats both treble and bass clef for the viola", () => {
    const viola = INSTRUMENTS.find((i) => i.name === "Viola")!;
    const alto = ledgerTotal(...viola.core, clefAt(ALTO)!.bottom);
    expect(alto).toBeLessThan(ledgerTotal(...viola.core, TREBLE));
    expect(alto).toBeLessThan(ledgerTotal(...viola.core, BASS));
  });
});
