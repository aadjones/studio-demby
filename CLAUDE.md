# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portfolio site for Aaron Demby Jones (Studio Demby) - musician, artist, and creative coder. The site organizes creative work into three categories: music, visual art, and teaching.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, p5.js, Tailwind CSS, deployed on Vercel

**Live Site:** https://www.studiodemby.com

**Open items and things kept on purpose:** `docs/open-items.md` (read before "cleaning up" something that looks unused).

## Development Commands

```bash
# Development server
pnpm dev

# Development server, killing anything already on :3000 first
pnpm fresh

# Free port 3000
pnpm kill-port

# Build from a clean .next (refuses if a server is on port 3000, then clears and builds)
pnpm clean-build

# Build without clearing (also refuses if a server is on port 3000)
pnpm build

# Production server (requires a build first)
pnpm start

# Run tests once and exit
pnpm test

# Run tests in watch mode
pnpm test:watch

# Show what's live vs. draft vs. archived
pnpm content:status

# Lint
pnpm lint
```

Every command above is verified to work as written. Don't insert `--` before a
flag when calling a pnpm script (`pnpm test -- --run`) — pnpm swallows it and
the flag never reaches the underlying tool.

## Build & Dev

Never run `next build` against the same `.next` directory as a running dev server. Use `pnpm clean-build`: it checks port 3000 *before* deleting anything. Never type `rm -rf .next` yourself; the `rm` runs before any check, so it can delete a running dev server's `.next` (this happened on 2026-10-27).

If you need a build while the user's dev server is running, build a copy instead: rsync the repo (minus `node_modules`, `.next`, `public`) to a scratch folder, symlink `node_modules` and `public`, then `npx next build && npx next start -p 3001` there.

**Commits while a dev server runs.** The pre-commit hook builds into `.next`, so with `vercel dev` or `next dev` on port 3000 the build guard blocks every commit. That's intended; commit after stopping it (`pnpm kill-port`), or keep working and commit later.

**Checking a production deploy.** After merging to `main`, wait on the *Production* deployment's own status, not the commit's: if the commit already had a preview, its commit status says "success" immediately and you'll test the old site. `gh api "repos/aadjones/studio-demby/deployments?sha=<full sha>&environment=Production"`, then that deployment's `/statuses`.

Note: `next build` in Next 14 has **no `--distDir` CLI flag** — `distDir` is a `next.config.js` option only. Passing it errors with `unknown option '--distDir'`.

## Architecture

### Content Structure

Projects live in `content/projects/` as MDX files with frontmatter defining:
- `categories`: Array from `["visual-art", "music", "teaching"]`
- `slug`: URL identifier
- `date`: Publication date
- `title`, `summary`, `image`, `tags`, etc.
- `status`: publication state — see below
- `cardVideo`: optional looping MP4 shown on cards instead of `image` (see Images)
- `redirectTo`: optional path for a project that lives as a standalone page in `public/` (e.g. `/standalone/sack-vulnerability/index.html`). Don't hand-write a redirect in `next.config.js`; it builds one from this field, and the page's `redirect()` covers in-app links
- See `types/mdx.ts` (`ProjectSchema`) for the full schema

### Content Status — what is actually live

**Before assuming a project is on the live site, run `pnpm content:status`.** It reads frontmatter directly, so it is never stale. Do not infer live-ness from a file existing in `content/projects/`.

Every project has a `status` field. It defaults to `published`, so omitting it means live.

| `status` | In listings | In sitemap | Built at URL |
|---|---|---|---|
| `published` | yes | yes | yes |
| `draft` | no | **no** | yes, with `noindex` |
| `archived` | no | yes | yes |

- **`draft`** — in progress, not ready to show. Unlisted, excluded from `sitemap.xml`, and served with `noindex, nofollow`, so the URL works as a private preview link you can share but search engines never see it. Draft pages render a visible amber banner. Its build doc belongs in `docs/plans/`.
- **`archived`** — retired work. Unlisted, but the URL stays in the sitemap and indexable on purpose, so existing inbound links aren't devalued. This is deliberately different from `draft`; don't "fix" it.

The filtering lives in one place: `getAllProjects()` (published only), `getIndexableProjects()` (published + archived, for the sitemap), and `getAllProjectEntries()` (everything, for `generateStaticParams`) in `lib/content/projects-loader.ts`. (There used to be a second "activity" content type; its six items are now archived projects.) Route listings and related-works should use `getAllProjects()`.

**Publishing a draft** is one edit: flip `status: draft` to `published` (and delete its `docs/plans/` doc).

**Invalid frontmatter fails the build.** The loaders throw, naming the file and field (e.g. `Invalid frontmatter in content/projects/rain.mdx: date: Expected string, received date`). They used to warn and silently drop the file; don't go back to that.

### Before/after snapshots

For any change that could touch many pages, capture before and after and diff:

```bash
pnpm snapshot capture https://www.studiodemby.com baseline        # production
pnpm snapshot capture https://www.studiodemby.com baseline-rerun  # same site again, to measure noise
pnpm snapshot capture <preview-url> my-change                     # Vercel preview or http://localhost:3000
pnpm snapshot diff baseline my-change baseline-rerun
```

It covers every static page and every content file of any status, at 375 and 1440, and reports new broken requests, new console errors, and pages whose pixels changed. About 20 pages (clocks, generative sketches, embeds) differ slightly even between identical runs; the third argument lists those separately so real changes stand out. Canvases, videos and iframes are hidden, so check sketches and audio by hand. Output goes to `snapshots/` (gitignored).

### Routing

Uses Next.js App Router:
- `app/work/page.tsx` - Work listing page (filterable by category)
- `app/work/[slug]/page.tsx` - Individual project pages
- `app/teaching/page.tsx` - Teaching landing page
- URL structure: `studiodemby.com/work/{slug}` or `studiodemby.com/work?category=music`

**How `/work?category=…` works.** A `beforeFiles` rewrite in `next.config.js` serves it from `app/work/by-category/[category]/page.tsx`, which is prebuilt once per category, so a shared link arrives with the right cards in the HTML. The URL never changes. Both pages render `app/components/WorkIndex.tsx` and pass the category into `WorkGrid`; the tabs then only update the URL with `history.replaceState`.

Two traps here:
- **Don't use `useSearchParams` in `WorkGrid`.** On a static page it makes Next skip server-rendering everything inside the nearest `<Suspense>`, so the grid and its images wait for JavaScript. That cost /work 2+ seconds and a layout shift.
- **Rewrites must be `beforeFiles`.** A plain array of rewrites runs only after Next matches a page file, and `/work` has one, so the rewrite silently never applies.

### Hiring and lessons paths

- **Nav:** "Work with me" (→ `/contact`) is the hiring path; "Lessons" (→ `/teaching`) is its own item. They're kept apart on purpose: working with Aaron and taking lessons are different things.
- **Homepage:** after Featured Work and "See all work", a "Hire or book" row (`app/components/WorkWithMe.tsx`): Lessons, Performance, Commissions. Each whole card is the link.
- **Wording:** `lib/offers.ts` is the one source for each offer's title, line and link text ("Try a $45 lesson", "Book a performance", "Ask about a commission") and their order. The end-of-project box (`CallToAction`) uses the same lines and link text. Edit it there.
- **Contact form:** a link can preselect the topic (`/contact?inquiry=music|art|teaching`); without one, the form starts on "Choose a topic".

### Project Management

When adding new projects, simply create a new MDX file in `content/projects/`. The random project navigation automatically discovers all projects via the content loader.

### Build Process

The build process (`pnpm build`) runs `next build`.

**IMPORTANT: Always clear the `.next` cache before building.** Run `pnpm clean-build`. Stale cache causes spurious `ENOENT` / `PageNotFoundError` failures that waste time.

### Styling

- Tailwind with `@tailwindcss/typography` for prose content
- **No dark mode.** `next-themes` isn't installed and Tailwind has no `darkMode` setting, so the few `dark:` classes in the code never apply.
- Custom animations defined in `tailwind.config.js`
- p5.js is **not** global. Sketches call `loadP5()` (`app/components/utils/loadP5.ts`), which loads `/p5.min.js` once, only on pages that draw. Don't add it back to the root layout: it's ~240 KB and slowed every page.

### Design tokens

The site **shell**—nav, footer, listings, project-page chrome, About, Teaching, Contact, and the shared MDX blocks (CallToAction, FieldNote, ProjectOverview, HeroTitleBlock…)—uses only these tokens. Individual projects (Museum of Dashes, Married For, the time visualizers, bird cards, Chonktionary…) are their own visual worlds and keep their own palettes; don't migrate them.

| Role | Token | Value | Rule |
|---|---|---|---|
| Page background | `paper` | `#F8F7F5` | Anything that should read as "the page" (hero, sticky bars). Not white, not grey. |
| Raised surface | `card` | `#FFFFFF` | Boxes that sit above the page |
| Subtle surface | `subtle` | `#F5F5F5` | Chips, tabs, metadata boxes |
| Hairline | `line` | `#E5E5E5` | Borders and dividers |
| Warm surface | `cream` | `#FFF8F0` | Only the end-of-project call-to-action box |
| Primary text | `ink-900` | `#1A1A1A` | Headings, body text |
| Secondary text | `ink-700` | `#3D3D3D` | Summaries, captions |
| Tertiary text | `ink-500` | `#707070` | Dates, labels. The lightest grey allowed for text (4.6:1 on paper, 4.5:1 on subtle). |
| Decorative grey | `ink-300` | `#A3A3A3` | Icons, dividers. **Never text**: fails contrast. |
| Accent | `coral` | `#FF6B6B` | Link underlines (solid, 2px), button hover, selection. **Never text**: 2.4:1. |
| Error text | `error` | `#F43F5E` | Form errors |
| Inline code | `code-text` / `code-bg` | `#8B5CF6` / `#FEF3C7` | `code` inside prose |
| Display type | `font-display` | Outfit | Headings, titles, buttons |
| Body type | `font-body` | Crimson Pro | Everything else (the default on `body`) |
| Utility type | `font-mono` | JetBrains Mono | Captions, data, code; 14px or larger |
| Corners | `rounded-lg` / `rounded-full` | | Cards and images / pills and round buttons |

Rules:
- **No raw Tailwind greys in the shell** (`gray-*`, `zinc-*`, `neutral-*`, `stone-*`, `slate-*`), and no hex literals. If a role is missing, add a token here and in `tailwind.config.js` rather than reaching for a one-off.
- **Hover:** buttons go to `coral` (`hover:bg-coral`). Text links in prose get a coral underline. Card titles use the `card-title` class (in `global.css`): a coral underline while the card's `group` link is hovered. Don't lighten text on hover; it lowers contrast.
- **Focus:** `global.css` gives every link, button and field a 2px `ink-900` ring on `:focus-visible`. Don't remove outlines (`outline-none`) without replacing them.
- **Tap targets:** icon-only links get a 44×44 box (`h-11 w-11`) around the icon.
- Check contrast with real numbers before adding a text color: 4.5:1 for normal text against every surface it sits on.

- **Text links** outside prose use the `text-link` class: the same style as article links (one definition in `global.css`). Never color a link blue.
- **Quotes and asides** (testimonials, FieldNote, footnote boxes): a left rule in `ink-500`.

**Being different is allowed; being different by accident isn't.** `tests/design-tokens.test.ts` fails if any shell file uses a color that isn't a token. To make a deliberate exception, add the file and the allowed classes to its `ALLOWED` list with a comment saying why (today: the draft banner's amber, a warning state). Project worlds aren't in the test's shell list, so their own palettes are already allowed. When you add a shell file, add it to that list too.

Known exception in the shell: `text-white` on dark buttons (correct as is).

- **Titles:** project titles keep their emoji on the page and on cards; browser tabs, social cards and search results get `withoutEmoji(title)` (`lib/text.ts`).
- **Phones:** every page fits a 320px screen. There's no `min-width` on `html`; don't add one back.

### Images

- Image optimization is on (Vercel resizes and re-encodes). Don't set `images.unoptimized`; it once served 9 MB originals for 180px thumbnails.
- Give every `<Image fill>` a `sizes` that matches its real width, or phones download desktop-sized files. In grids, pass `sizes` to `ZoomImage` (e.g. `"(max-width: 640px) 100vw, 33vw"` for three columns).
- `priority` is opt-in on `ZoomImage` and `CardMedia`. Use it only for the first visible image of a page; a gallery where every image is priority makes them all slower.
- Animated GIFs aren't optimized. For a looping card, set `cardVideo:` in frontmatter to a muted MP4 and keep `image:` as a still (poster and social preview). Encode with ffmpeg: `-an -c:v libx264 -crf 26 -pix_fmt yuv420p -movflags +faststart`.

### Measuring speed

Run Lighthouse with real throttling: `npx lighthouse <url> --only-categories=performance --throttling-method=devtools`. The default mode *estimates* phone timings from a model and can report seconds of "render delay" that a measured run shows aren't there. The site also has Vercel Speed Insights, which records real visitors.

### ESLint Configuration

The project uses `react/no-unescaped-entities` rule. Always escape quotes and apostrophes in JSX:
- Use `&ldquo;` and `&rdquo;` for double quotes
- Use `&apos;` for apostrophes
- Use `&quot;` as alternative for quotes

### Special Components

Custom MDX blocks are in `app/components/mdx-blocks/` for embedding media, p5 sketches, and interactive elements in project pages.

**No copied layout markup in MDX.** If a pattern appears on more than one page (a video embed, a gallery, a boxed note), it's a block, not hand-written `<div className="…">` pasted from another page. Copies drift from the design: five music pages once carried a pasted YouTube snippet that capped videos at 576px in an 800px column. Fix the block, and every page follows.

- **Videos: one block per job.** Each file's header comment says the same.

  | Job | Block | Example |
  |---|---|---|
  | Hosted player: YouTube (any link form), Loom, Vimeo | `VideoEmbed` | `<VideoEmbed src="https://youtu.be/ID" title="…" caption="…" />` |
  | Your own MP4 with controls and a poster | `VideoFile` | used inside `HeroBlock` for the Preview Mix videos |
  | Silent autoplay loop that's part of the artwork | `AmbientLoop` | Degradation's three loops |

  All fill their container: never wrap them in a `max-w-*` div or pass a narrowing `className` (Rain and Above once did, giving 544px and 768px videos). A video's `title` only names it for screen readers; the page heading comes from `HeroTitleBlock`. A raw `<iframe>` in `content/projects/` **fails the build**.
- **No `import` lines in MDX.** Imports are disabled in the loader, so they were silently stripped; pages once carried 29 of them, some naming files that didn't exist. Every block registered in `ClientMDX.tsx` works by name. An `import` line outside a code example **fails the build**.
- **"Expected component `X` to be defined"** during the build means the page uses a block that isn't registered in `ClientMDX.tsx` (renamed, deleted or misspelled). Register it there; don't add an import.
- **Project page column:** every block aligns to one column (`project-shell` in `ProjectContentShell.tsx`): breadcrumb, article and the Related Works/prev-next footer share its left edge. Don't add side padding or a narrower `max-w-*` to a wrapper inside it.

### `.prose a` Override Gotcha

All MDX content is wrapped in a `.prose` container. `app/global.css` has a `.prose a` rule that forces **all links** inside prose to `text-ink-900` (near-black) with a coral underline decoration — regardless of any Tailwind color utilities on the element.

**Symptom:** Styled `<a>` buttons inside MDX components appear as dark rectangles with invisible text and a reddish underline, even with explicit `text-white` or other color classes.

**Fix:** Use Tailwind's `!` important modifier and suppress the underline:
```tsx
className="... !text-white no-underline hover:!text-white ..."
```

This applies to any `<a>` tag rendered inside an MDX page, including all components in `app/components/mdx-blocks/`.

### Every MDX Component Must Accept `className`

`.prose` leaks into MDX components constantly. `ClientMDX.tsx` defends against this by injecting `className={`not-prose ${props.className || ""}`}` into **every** registered component — but that defence only works if the component actually renders the className it is handed.

**Symptom:** prose typography (link colors, list markers, heading sizes, `max-width`, vertical margins) bleeding into a component's own controls and labels, even though `ClientMDX` "already adds `not-prose`."

**Root cause:** the component hardcodes its own `className` and never declares the prop, so the injected `not-prose` is passed, ignored, and silently dropped. TypeScript does not catch it — `ClientMDX` casts each component to `any` before spreading props.

**Fix:** every component registered in `ClientMDX.tsx` accepts `className` and merges it:
```tsx
export default function MyBlock({ className = "" }: Props) {
  return <div className={`my-block ${className}`.trim()}>…</div>;
}
```

**Exception: blocks that hold prose.** A block whose children are markdown text (paragraphs, lists, emphasis) needs prose styling, so it must *not* get `not-prose`. These are listed in `PROSE_BLOCKS` in `ClientMDX.tsx` (today: `ProjectOverview`). Giving such a block a `className` without listing it there strips its paragraph spacing and list bullets on every page that uses it.

**Related trap — background-dependent effects.** If a component draws anything that knocks out to a background color (SVG text halos, gradient masks, faux-borders), it must *paint that background itself* rather than assuming an ancestor supplies it. A component that looks right in isolation will grow fringes on a page whose background differs. See `app/components/mdx-blocks/clef-rake/clef-rake.css`.

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
