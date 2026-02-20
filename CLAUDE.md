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

### Slider Touch Targets (Mobile)

Range sliders (`<input type="range">`) have small default touch targets. A global rule in `app/global.css` sets `height: 3rem` (48px) on `@media (pointer: coarse)` to fix this for all sliders site-wide. Do not override this height in individual components. Use `pointer: coarse` (not a breakpoint) so it applies to any touch device regardless of screen width.

### Screenshots

Save all Playwright/MCP screenshots to `.playwright-mcp/`. This directory is gitignored. Never save screenshots to the project root.

### Creative Copy

**Never write creative copy for project pages unless explicitly asked.** This includes: summaries, whisper lines, field notes, project overview prose, metadata flavor text, or any narrative/descriptive writing. Leave those fields blank or with clear placeholders, and let the user fill them in.
