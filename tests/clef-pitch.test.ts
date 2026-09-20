import { describe, it, expect } from "vitest";
import {
  HIGH,
  LOW,
  MIDDLE_C,
  isLine,
  letterOf,
  noteName,
  octaveOf,
  toSolfege,
} from "@/app/components/mdx-blocks/clef-rake/lib/pitch";

describe("diatonic index", () => {
  it("anchors middle C at 28", () => {
    expect(noteName(MIDDLE_C)).toBe("C4");
  });

  it("spans C1 to C7", () => {
    expect(noteName(LOW)).toBe("C1");
    expect(noteName(HIGH)).toBe("C7");
  });

  it("rolls the octave over between B and C, not elsewhere", () => {
    expect(noteName(27)).toBe("B3");
    expect(noteName(28)).toBe("C4");
    // ...and nowhere in between: one octave's worth of names, one octave number
    for (let d = 28; d < 35; d++) expect(octaveOf(d)).toBe(4);
  });

  it("names every seventh index C", () => {
    for (let d = LOW; d <= HIGH; d += 7) expect(letterOf(d)).toBe("C");
  });
});

describe("name systems", () => {
  it("agree on octave numbers", () => {
    for (let d = LOW; d <= HIGH; d++) {
      expect(noteName(d, "solfege")).toMatch(new RegExp(`${octaveOf(d)}$`));
    }
  });

  it("map middle C to Do4", () => {
    expect(noteName(MIDDLE_C, "solfege")).toBe("Do4");
  });
});

describe("toSolfege", () => {
  it("preserves flats and octave digits", () => {
    expect(toSolfege("B♭1–E5")).toBe("Si♭1–Mi5");
  });

  it("converts names inside a full sentence", () => {
    expect(toSolfege("usually G4–G6, full range C4–C7.")).toBe(
      "usually Sol4–Sol6, full range Do4–Do7."
    );
  });

  it("leaves prose without note names alone", () => {
    const s = "Sounds an octave lower than written.";
    expect(toSolfege(s)).toBe(s);
  });
});

describe("isLine", () => {
  it("alternates line and space going up from the bottom line", () => {
    const bottom = 24;
    for (let k = 0; k < 10; k++) {
      expect(isLine(bottom + k, bottom)).toBe(k % 2 === 0);
    }
  });

  it("works below the staff too", () => {
    expect(isLine(22, 24)).toBe(true); // a ledger line
    expect(isLine(23, 24)).toBe(false); // the space under the staff
  });
});
