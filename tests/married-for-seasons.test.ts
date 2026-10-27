import { describe, it, expect } from "vitest";
import {
  seasonEventJDE,
  seasonEventDate,
  seasonalAngle,
} from "@/app/extras/married-for/utils/seasons";

const MINUTE = 60 * 1000;

describe("seasonEventJDE", () => {
  it("matches Meeus's worked example (Example 27.a: June solstice 1962)", () => {
    expect(seasonEventJDE(1962, "june")).toBeCloseTo(2437837.39245, 3);
  });
});

describe("seasonEventDate", () => {
  // Published UTC times; Dynamical Time runs ~69 s ahead of UTC, so allow a few minutes
  it("lands on the March 2024 equinox (2024-03-20 03:06 UTC)", () => {
    const d = seasonEventDate(2024, "march");
    expect(Math.abs(d.getTime() - Date.UTC(2024, 2, 20, 3, 6))).toBeLessThan(3 * MINUTE);
  });

  it("lands on the December 2024 solstice (2024-12-21 09:20 UTC)", () => {
    const d = seasonEventDate(2024, "december");
    expect(Math.abs(d.getTime() - Date.UTC(2024, 11, 21, 9, 20))).toBeLessThan(3 * MINUTE);
  });
});

describe("seasonalAngle", () => {
  it("crosses each axis exactly at the real equinox or solstice", () => {
    for (const [event, quarter] of [["march", 1], ["june", 2], ["september", 3]] as const) {
      expect(seasonalAngle(seasonEventDate(2026, event))).toBeCloseTo(quarter * (Math.PI / 2), 6);
    }
  });

  it("starts the dial at the top just after the December solstice", () => {
    const justAfter = new Date(seasonEventDate(2026, "december").getTime() + MINUTE);
    expect(seasonalAngle(justAfter)).toBeLessThan(0.001);
  });

  it("puts the wedding in the autumn quarter", () => {
    const angle = seasonalAngle(new Date("2026-10-24T16:30:00-07:00"));
    expect(angle).toBeGreaterThan(1.5 * Math.PI);
    expect(angle).toBeLessThan(2 * Math.PI);
  });

  it("only moves forward through a seasonal year (it wraps to 0 at each December solstice)", () => {
    const start = seasonEventDate(2026, "december").getTime() + 24 * 60 * MINUTE;
    let prev = -1;
    for (let day = 0; day < 360; day += 5) {
      const angle = seasonalAngle(new Date(start + day * 24 * 60 * MINUTE));
      expect(angle).toBeGreaterThan(prev);
      prev = angle;
    }
  });
});
