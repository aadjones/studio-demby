# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portfolio site for Aaron Demby Jones (Studio Demby) - musician, artist, and creative coder. The site organizes creative work into three categories: music, visual art, and teaching.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, p5.js, Tailwind CSS, deployed on Vercel

**Live Site:** https://www.studiodemby.com

## Development Commands

```bash
# Development server
pnpm dev

# Build (always clear cache first: rm -rf .next)
pnpm build

# Production server
pnpm start

# Run tests (--run exits after completion; without it vitest hangs in watch mode)
pnpm test -- --run

# Lint
pnpm lint
```

## Architecture

### Content Structure

Projects live in `content/projects/` as MDX files with frontmatter defining:
- `categories`: Array from `["visual-art", "music", "teaching"]`
- `slug`: URL identifier
- `date`: Publication date
- `title`, `summary`, `image`, `tags`, etc.
- See `types/mdx.ts` (`ProjectSchema`) for the full schema

### Routing

Uses Next.js App Router:
- `app/work/page.tsx` - Work listing page (filterable by category)
- `app/work/[slug]/page.tsx` - Individual project/activity pages
- `app/teaching/page.tsx` - Teaching landing page
- URL structure: `studiodemby.com/work/{slug}` or `studiodemby.com/work?category=music`

### Project Management

When adding new projects, simply create a new MDX file in `content/projects/`. The random project navigation automatically discovers all projects via the content loader.

### Build Process

The build process (`pnpm build`) runs `next build`.

**IMPORTANT: Always clear the `.next` cache before building.** Run `rm -rf .next && pnpm build`. Stale cache causes spurious `ENOENT` / `PageNotFoundError` failures that waste time.

### Styling

- Tailwind with `@tailwindcss/typography` for prose content
- Dark mode via `next-themes` (class-based)
- Custom animations defined in `tailwind.config.js`
- p5.js loaded globally via script tag in root layout for generative visuals

### ESLint Configuration

The project uses `react/no-unescaped-entities` rule. Always escape quotes and apostrophes in JSX:
- Use `&ldquo;` and `&rdquo;` for double quotes
- Use `&apos;` for apostrophes
- Use `&quot;` as alternative for quotes

### Special Components

Custom MDX blocks are in `app/components/mdx-blocks/` for embedding media, p5 sketches, and interactive elements in project pages.

### `.prose a` Override Gotcha

All MDX content is wrapped in a `.prose` container. `app/global.css` has a `.prose a` rule that forces **all links** inside prose to `text-ink-900` (near-black) with a coral underline decoration — regardless of any Tailwind color utilities on the element.

**Symptom:** Styled `<a>` buttons inside MDX components appear as dark rectangles with invisible text and a reddish underline, even with explicit `text-white` or other color classes.

**Fix:** Use Tailwind's `!` important modifier and suppress the underline:
```tsx
className="... !text-white no-underline hover:!text-white ..."
```

This applies to any `<a>` tag rendered inside an MDX page, including all components in `app/components/mdx-blocks/`.

### Slider Touch Targets (Mobile)

Range sliders (`<input type="range">`) have small default touch targets. A global rule in `app/global.css` sets `height: 3rem` (48px) on `@media (pointer: coarse)` to fix this for all sliders site-wide. Do not override this height in individual components. Use `pointer: coarse` (not a breakpoint) so it applies to any touch device regardless of screen width.

### Screenshots

Save all Playwright/MCP screenshots to `.playwright-mcp/`. This directory is gitignored. Never save screenshots to the project root.

### Safari Compatibility — p5.js Canvases

Safari is a persistent source of bugs for p5.js sketches. Known issues and fixes:

**1. `aspect-ratio` CSS + `clientHeight` → canvas size 0**
Safari resolves `aspect-ratio` lazily. If you call `parent.clientHeight` at `IntersectionObserver` or `setup` time on an `aspect-square` container, it may return `0`. `Math.min(clientWidth, 0) = 0` → `createCanvas(0, 0)` → silent failure, nothing renders.
- **Fix:** Use `parent.clientWidth` only (the container is already square via CSS). Never use `clientHeight` for canvas sizing on aspect-ratio containers.
- **Guard:** Add `if (size < 1) return;` at the top of any draw/generate function.

**2. `blendMode(ADD)` on `p5.Graphics` buffers**
Safari can produce compositing artifacts when `blendMode(ADD)` is set before `background()` on a graphics buffer.
- **Fix:** Call `buffer.background(0)` first, then `buffer.blendMode(p.ADD)`.
- Safari's WebKit Canvas 2D handles `globalCompositeOperation: 'lighter'` (ADD) significantly slower than Chrome. This is a fundamental WebKit limitation — reducing vertex count or debouncing helps but won't fully close the gap. Accept it or switch to WebGL mode.

**3. `pixelDensity` on mobile**
On iPhone (3x display), p5 renders a canvas 9x larger than the visible size by default. This is the biggest single cause of mobile slowness.
- **Fix:** Call `p.pixelDensity(1)` in `setup()` before anything else.

**4. General rule**
When a p5 sketch works in Chrome but is blank/broken in Safari, check canvas sizing first. When it's slow on mobile Safari, check pixelDensity and ADD blend mode.

### Safari Compatibility — CSS 3D Card Flips (React inline styles)

React's `style={}` object does **not** auto-add vendor prefixes. Safari requires `-webkit-` prefixes for 3D transform properties or they silently do nothing.

**Symptom:** Card back content shows through as mirrored/ghost text—`backface-visibility: hidden` did nothing.

**Root cause (spec-level, not a Safari bug):** The CSS spec defines properties that **force `transform-style: flat`** on any element, even if you explicitly set `preserve-3d`. These kill `backface-visibility` entirely:
- `overflow: hidden/scroll/auto` — 2D clipping is architecturally incompatible with a 3D context
- `opacity < 1`
- `filter` (any value other than `none`)
- `clip-path`
- `mask-image`
- `will-change: transform` (or other compositing values)

Audit every element in the chain (face divs AND their ancestors) for these. Chrome is more forgiving; Safari is strict about the spec.

**Fix 1 — webkit prefixes** (necessary but not sufficient):
```tsx
style={{ perspective: "1200px", WebkitPerspective: "1200px" }}
style={{ transformStyle: "preserve-3d", WebkitTransformStyle: "preserve-3d" }}
style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
```

**Fix 3 — cold-start GPU jank on first flip:**
The first CSS transition on an element triggers expensive synchronous compositing layer creation. Add `willChange: "transform"` to the flip container to pre-promote it at mount. Subsequent flips are always smooth because the layer is already warm. Symptom: first click is slow/snappy, all subsequent clicks are fine.

**Fix 2 — don't fight the browser, use React state:**
If CSS 3D still misbehaves, bypass `backface-visibility` entirely with a React visibility toggle:
```tsx
// On the face divs — toggled with `flipped` state
style={{ visibility: flipped ? "hidden" : "visible" }}  // front face
style={{ visibility: flipped ? "visible" : "hidden" }}  // back face
```
This is reliable across all browsers. The tradeoff: the face content swaps at click time (not at the animation midpoint). Can smooth this with a 350ms `setTimeout` delay (half of a 700ms flip duration).

### Frontmatter Dates

Always use quoted, zero-padded ISO 8601 format: `date: "YYYY-MM-DD"` (e.g. `"2023-01-10"`, not `2023-1-10`). Two failure modes: (1) missing quotes → YAML parses as a date object, schema expects string → project disappears from listings; (2) single-digit month/day without quotes → Safari renders `NaN`.

### Creative Copy

**Never write creative copy for project pages unless explicitly asked.** This includes: summaries, whisper lines, field notes, project overview prose, metadata flavor text, or any narrative/descriptive writing. Leave those fields blank or with clear placeholders, and let the user fill them in.
