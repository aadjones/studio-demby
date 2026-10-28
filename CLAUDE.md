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

**Commits while a dev server runs.** The pre-commit hook builds into `.next`, so with `vercel dev` or `next dev` on port 3000 the build guard blocks every commit. That's intended; commit after stopping it (`pnpm kill-port`), or keep working and commit later.

Building a copy while a dev server runs, checking a production deploy, and the missing `--distDir` flag: `docs/reference/build.md`.

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

For any change that could touch many pages, run a before/after snapshot diff: `docs/reference/snapshots.md`.

### Routing

Uses Next.js App Router:
- `app/work/page.tsx` - Work listing page (filterable by category)
- `app/work/[slug]/page.tsx` - Individual project pages
- `app/teaching/page.tsx` - Teaching landing page
- URL structure: `studiodemby.com/work/{slug}` or `studiodemby.com/work?category=music`

Before touching `WorkGrid` or the rewrites in `next.config.js`, read `docs/reference/routing.md`. It covers two traps that silently break `/work?category=`.

### Hiring and lessons paths

- **Nav:** "Work with me" (→ `/contact`) is the hiring path; "Lessons" (→ `/teaching`) is its own item. They're kept apart on purpose: working with Aaron and taking lessons are different things.
- **Homepage:** after Featured Work and "See all work", a "Hire or book" row (`app/components/WorkWithMe.tsx`): Lessons, Performance, Commissions. Each whole card is the link.
- **Wording:** `lib/offers.ts` is the one source for each offer's title, line and link text ("Try a $45 lesson", "Book a performance", "Ask about a commission") and their order. The end-of-project box (`CallToAction`) uses the same lines and link text. Edit it there.
- **Contact form:** a link can preselect the topic (`/contact?inquiry=music|art|teaching`); without one, the form starts on "Choose a topic".

### Styling

- Tailwind with `@tailwindcss/typography` for prose content
- **No dark mode.** `next-themes` isn't installed and Tailwind has no `darkMode` setting, so the few `dark:` classes in the code never apply.
- Custom animations defined in `tailwind.config.js`
- p5.js is **not** global. Sketches call `loadP5()` (`app/components/utils/loadP5.ts`), which loads `/p5.min.js` once, only on pages that draw. Don't add it back to the root layout: it's ~240 KB and slowed every page.

### Design tokens

The site **shell** (nav, footer, listings, project-page chrome, About, Teaching, Contact, shared MDX blocks) uses only the tokens in `tailwind.config.js`: no raw Tailwind greys, no hex literals. Individual projects keep their own palettes. `tests/design-tokens.test.ts` enforces this. Before styling shell UI, read `docs/reference/design-tokens.md` for each token's role and the hover, focus, contrast and exception rules.

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

- **Videos:** use `VideoEmbed` (hosted players), `VideoFile` (own MP4) or `AmbientLoop` (silent artwork loop), and never narrow them. A raw `<iframe>` in `content/projects/` **fails the build**. Which block for which job: `docs/reference/mdx-blocks.md`.
- **No `import` lines in MDX.** Every block registered in `ClientMDX.tsx` works by name; an `import` line outside a code example **fails the build**. "Expected component `X` to be defined" means the block isn't registered there.
- **Project page column:** every block aligns to one column (`project-shell` in `ProjectContentShell.tsx`): breadcrumb, article and the Related Works/prev-next footer share its left edge. Don't add side padding or a narrower `max-w-*` to a wrapper inside it.

### Writing an MDX block

Every block registered in `ClientMDX.tsx` must accept and merge `className`, or the injected `not-prose` is silently dropped. Styled `<a>` buttons inside prose need `!text-white no-underline`. Details, the `PROSE_BLOCKS` exception, and the background-knockout trap: `docs/reference/mdx-blocks.md`.

### Slider Touch Targets (Mobile)

Range sliders (`<input type="range">`) have small default touch targets. A global rule in `app/global.css` sets `height: 3rem` (48px) on `@media (pointer: coarse)` to fix this for all sliders site-wide. Do not override this height in individual components. Use `pointer: coarse` (not a breakpoint) so it applies to any touch device regardless of screen width.

### Screenshots

Save all Playwright/MCP screenshots to `.playwright-mcp/`. This directory is gitignored. Never save screenshots to the project root.

### Safari

If a p5 sketch is blank or slow in Safari, or a CSS 3D card flip shows ghost text, read `docs/reference/safari.md` first.

### Frontmatter Dates

Always use quoted, zero-padded ISO 8601 format: `date: "YYYY-MM-DD"` (e.g. `"2023-01-10"`, not `2023-1-10`). Two failure modes: (1) missing quotes → YAML parses as a date object, schema expects string → project disappears from listings; (2) single-digit month/day without quotes → Safari renders `NaN`.

### Creative Copy

**Never write creative copy for project pages unless explicitly asked.** This includes: summaries, whisper lines, field notes, project overview prose, metadata flavor text, or any narrative/descriptive writing. Leave those fields blank or with clear placeholders, and let the user fill them in.
