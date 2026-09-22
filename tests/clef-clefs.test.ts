import { describe, it, expect } from "vitest";
import {
  CLEFS,
  linePitches,
  nearestClef,
  signPitch,
  stepClef,
  topPitch,
} from "@/app/components/mdx-blocks/clef-rake/lib/clefs";
import { MIDDLE_C, letterOf, noteName } from "@/app/components/mdx-blocks/clef-rake/lib/pitch";

describe("the clef names the note it points at", () => {
  it("holds for all seven clefs", () => {
    for (const clef of CLEFS) {
      expect(letterOf(signPitch(clef))).toBe(clef.sign);
    }
  });

  it("puts every C clef on middle C itself", () => {
    // Five of the seven are C clefs. They are one clef pointing at one note,
    // with the staff slid underneath.
    const cClefs = CLEFS.filter((c) => c.sign === "C");
    expect(cClefs.map((c) => c.name)).toEqual([
      "Baritone",
      "Tenor",
      "Alto",
      "Mezzo-soprano",
      "Soprano",
    ]);
    for (const clef of cClefs) expect(signPitch(clef)).toBe(MIDDLE_C);
  });

  it("splits the seven clefs 1 / 5 / 1 across the three symbols", () => {
    const tally = (sign: string) => CLEFS.filter((c) => c.sign === sign).length;
    expect([tally("F"), tally("C"), tally("G")]).toEqual([1, 5, 1]);
    expect(tally("F") + tally("C") + tally("G")).toBe(CLEFS.length);
  });

  it("lets the five C clefs use each of the five lines in turn", () => {
    // Bottom line upwards, so: soprano 1st, mezzo 2nd, alto 3rd, tenor 4th,
    // baritone 5th. This is why five and not four — the set is only complete
    // if middle C gets every line.
    const lineOf = (bottom: number) => (MIDDLE_C - bottom) / 2;
    const byLine = CLEFS.filter((c) => c.sign === "C")
      .map((c) => [lineOf(c.bottom), c.name] as const)
      .sort((a, b) => a[0] - b[0]);

    expect(byLine).toEqual([
      [0, "Soprano"],
      [1, "Mezzo-soprano"],
      [2, "Alto"],
      [3, "Tenor"],
      [4, "Baritone"],
    ]);
  });

  it("uses a non-C clef exactly where middle C has left the staff", () => {
    // The reason the other two cannot be C clefs: there is no line to put
    // middle C on, so each has to name a note it can still reach.
    for (const clef of CLEFS) {
      const onStaff =
        MIDDLE_C >= clef.bottom && MIDDLE_C <= topPitch(clef.bottom);
      expect(clef.sign === "C").toBe(onStaff);
    }

    const [bass, treble] = [CLEFS[0], CLEFS[CLEFS.length - 1]];
    expect(MIDDLE_C).toBeGreaterThan(topPitch(bass.bottom)); // above bass
    expect(MIDDLE_C).toBeLessThan(treble.bottom); // below treble
  });

  it("puts the sign on an actual staff line, never in a space", () => {
    for (const clef of CLEFS) {
      expect(linePitches(clef.bottom)).toContain(signPitch(clef));
    }
  });
});

describe("the rake", () => {
  it("steps by a third between consecutive clefs", () => {
    for (let i = 1; i < CLEFS.length; i++) {
      expect(CLEFS[i].bottom - CLEFS[i - 1].bottom).toBe(2);
    }
  });

  it("spans bass to treble", () => {
    expect(CLEFS[0].name).toBe("Bass");
    expect(CLEFS[CLEFS.length - 1].name).toBe("Treble");
  });

  it("clamps at both ends instead of wrapping", () => {
    expect(stepClef(CLEFS[0], -1)).toBe(CLEFS[0]);
    expect(stepClef(CLEFS[CLEFS.length - 1], 1)).toBe(CLEFS[CLEFS.length - 1]);
  });

  it("snaps to the nearest stop when dragged between two", () => {
    expect(nearestClef(24.4).bottom).toBe(24);
    expect(nearestClef(24.9).bottom).toBe(24);
    expect(nearestClef(25.1).bottom).toBe(26);
    expect(nearestClef(-100).bottom).toBe(18); // clamped by proximity
    expect(nearestClef(1000).bottom).toBe(30);
  });
});

describe("why there are exactly seven clefs", () => {
  it("exhausts all seven letter names on the bottom line", () => {
    const letters = CLEFS.map((c) => letterOf(c.bottom));
    expect(letters).toEqual(["G", "B", "D", "F", "A", "C", "E"]);
    expect(new Set(letters).size).toBe(7);
  });

  it("makes an eighth stop a repeat of bass clef, two octaves up", () => {
    // Stepping by a third is +2, and gcd(2, 7) = 1, so +2 generates all of
    // Z/7 before returning to where it started. Getting back to the starting
    // letter takes 7 steps of 2 = +14 diatonic steps, which is exactly two
    // octaves. So the eighth stop is not a new clef—it is bass clef displaced.
    const eighth = CLEFS[CLEFS.length - 1].bottom + 2;
    const bass = CLEFS[0];

    expect(eighth - bass.bottom).toBe(14);
    expect((eighth - bass.bottom) / 7).toBe(2); // two octaves, not one
    expect(linePitches(eighth).map((d) => letterOf(d))).toEqual(
      linePitches(bass.bottom).map((d) => letterOf(d))
    );
  });
});

describe("why there are only three clef symbols", () => {
  it("uses exactly three across all seven clefs", () => {
    expect(new Set(CLEFS.map((c) => c.sign)).size).toBe(3);
  });

  it("points them at F3, C4 and G4—a chain of fifths centred on middle C", () => {
    const named = new Map(CLEFS.map((c) => [c.sign, signPitch(c)]));

    expect(noteName(named.get("F")!)).toBe("F3");
    expect(noteName(named.get("C")!)).toBe("C4");
    expect(noteName(named.get("G")!)).toBe("G4");

    // Symmetric about middle C: a fifth below, middle C, a fifth below.
    // Four diatonic steps each way = a perfect fifth.
    expect(MIDDLE_C - named.get("F")!).toBe(4);
    expect(named.get("G")! - MIDDLE_C).toBe(4);
  });
});

describe("staff geometry", () => {
  it("spans eight diatonic steps from bottom line to top line", () => {
    for (const clef of CLEFS) {
      expect(topPitch(clef.bottom) - clef.bottom).toBe(8);
      expect(linePitches(clef.bottom)).toHaveLength(5);
    }
  });
});
