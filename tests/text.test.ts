import { describe, it, expect } from "vitest";
import { withoutEmoji } from "@/lib/text";

describe("withoutEmoji", () => {
  it("drops trailing emoji from a project title", () => {
    expect(withoutEmoji("Ghostly Double 🎵🎬")).toBe("Ghostly Double");
  });

  // Escapes, not pasted emoji: editors can silently drop the invisible U+FE0F (emoji style)
  // and U+200D (joiner) characters, and then these tests would prove nothing.
  it("drops emoji with a style selector (🕹\uFE0F is U+1F579 U+FE0F)", () => {
    expect(withoutEmoji("Grain Rain \u{1F3A8} \u{1F579}\uFE0F")).toBe("Grain Rain");
    expect(withoutEmoji("Shatter \u{1F3A8}\u{1F579}\uFE0F Remix")).toBe("Shatter Remix");
  });

  it("drops joined and skin-tone emoji whole (woman, medium skin, ZWJ, microphone)", () => {
    expect(withoutEmoji("Duo \u{1F469}\u{1F3FD}\u200D\u{1F3A4} live")).toBe("Duo live");
  });

  it("keeps accented letters, punctuation and digits", () => {
    expect(withoutEmoji("Tétrico: 3 studies — #1")).toBe("Tétrico: 3 studies — #1");
  });
});
