import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

/**
 * The site shell may only use design-token colors (CLAUDE.md, "Design tokens").
 * Project worlds (Museum, Married For, visualizers, bird cards…) keep their own
 * palettes and aren't listed here.
 *
 * Twice, a migration missed colors: first only greys moved to tokens, leaving blue
 * links and an indigo button. This test catches any raw Tailwind palette color or
 * hex value in a shell file.
 */

const ROOT = path.resolve(__dirname, "..");

const SHELL = [
  "app/page.tsx", "app/about", "app/teaching", "app/contact", "app/work/page.tsx", "app/work/[slug]",
  "app/work/by-category", "app/components/layout", "app/components/WorkGrid.tsx", "app/components/WorkIndex.tsx",
  "app/components/StartHere.tsx", "app/components/RelatedWorks.tsx", "app/components/Breadcrumb.tsx",
  "app/components/ProjectNavigation.tsx", "app/components/RandomProjectButton.tsx", "app/components/CardMedia.tsx",
  "app/components/hero/BloodFeathersHeroClient.tsx", "app/components/media", "components/SubscribeForm.tsx",
  "app/components/WorkWithMe.tsx",
  ...["CallToAction", "FieldNote", "CollapseMetadata", "ProjectOverview", "HeroTitleBlock", "HeroBlock", "Caption",
    "Callout", "MediaSection", "MediaItem", "LaunchExperience", "TechnicalDetails", "Footnote", "VideoEmbed",
    "VideoFile", "AmbientLoop"].map((b) => `app/components/mdx-blocks/${b}.tsx`),
];

/** Token families that have shades, and the shades that exist. Anything else (ink-100, ink-800)
 *  compiles to nothing, so a hover or color silently does nothing. */
const TOKEN_SHADES: Record<string, Set<string>> = { ink: new Set(["900", "700", "500", "300"]) };

const TOKEN_PALETTES = new Set(["ink", "paper", "card", "subtle", "line", "coral", "cream", "error", "code", "white", "black", "transparent", "current", "inherit"]);

/** Known, deliberate exceptions: `file: classes allowed there`. */
const ALLOWED: Record<string, RegExp> = {
  // The draft banner uses amber on purpose: it's a warning state, shown only on unpublished pages.
  "app/work/[slug]/page.tsx": /^(border|bg|text)-amber-\d+/,
};

const COLOR = /(?<![\w-])(?:[a-z-]+:)*((?:text|bg|border(?:-[trblxy])?|from|to|via|ring|decoration|outline|divide|fill|stroke|shadow)-([a-z]+)-(\d{2,3})(?:\/\d+)?)\b/g;
const HEX = /\[#[0-9A-Fa-f]{3,6}\]/g;

function files(entry: string): string[] {
  const full = path.join(ROOT, entry);
  if (!fs.existsSync(full)) return [];
  if (fs.statSync(full).isFile()) return [entry];
  return fs
    .readdirSync(full, { recursive: true })
    .map((f) => path.join(entry, String(f)))
    .filter((f) => /\.(tsx|ts)$/.test(f));
}

describe("design tokens in the site shell", () => {
  it("uses only token colors (no raw Tailwind palettes or hex values)", () => {
    const offenders: string[] = [];
    for (const file of SHELL.flatMap(files)) {
      const lines = fs.readFileSync(path.join(ROOT, file), "utf8").split("\n");
      lines.forEach((line, i) => {
        for (const [, cls, palette, shade] of line.matchAll(COLOR)) {
          if (TOKEN_PALETTES.has(palette)) {
            const shades = TOKEN_SHADES[palette];
            if (!shades || shades.has(shade)) continue;
            offenders.push(`${file}:${i + 1} ${cls} (no such shade)`);
            continue;
          }
          if (ALLOWED[file]?.test(cls)) continue;
          offenders.push(`${file}:${i + 1} ${cls}`);
        }
        for (const [hex] of line.matchAll(HEX)) offenders.push(`${file}:${i + 1} ${hex}`);
      });
    }
    expect(offenders).toEqual([]);
  });

  it("lists shell files that exist (a renamed file would silently drop out of the check)", () => {
    const missing = SHELL.filter((entry) => !fs.existsSync(path.join(ROOT, entry)));
    expect(missing).toEqual([]);
  });
});
