# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portfolio site for Aaron Demby Jones (Studio Demby) - musician, artist, and creative coder. The site organizes creative work into emotional clusters: resonant, errant, fractured, and enclosed.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, p5.js, Tailwind CSS, deployed on Vercel

**Live Site:** https://www.studiodemby.com

## Development Commands

```bash
# Development server
pnpm dev

# Build (also generates RSS feed)
pnpm build

# Production server
pnpm start

# Run tests
pnpm test

# Lint
pnpm lint
```

## Architecture

### Content Structure

Projects live in `content/projects/` as MDX files with frontmatter defining:
- `cluster`: One of `resonant`, `errant`, `fractured`, or `enclosed`
- `slug`: URL identifier
- `date`: Publication date (required for RSS feed)
- `title`, `summary`, `image`, `tags`, etc.

### Routing

Uses Next.js App Router with a route group pattern:
- `app/(clusters)/[cluster]/[slug]/` - Dynamic routes for project pages
- `app/(clusters)/[cluster]/page.tsx` - Cluster landing pages
- URL structure: `studiodemby.com/{cluster}/{slug}`

### Project Management

**IMPORTANT:** When adding new projects, update `app/components/projectList.ts` with the cluster and slug. This array powers the random project navigation feature.

### Build Process

The build process (`pnpm build`) runs:
1. `next build` - Standard Next.js build
2. `scripts/generateRss.js` - Generates RSS feed at `public/feed.xml` from project MDX files

### Styling

- Tailwind with `@tailwindcss/typography` for prose content
- Dark mode via `next-themes` (class-based)
- Custom animations for cluster-specific effects (see `tailwind.config.js`)
- p5.js loaded globally via script tag in root layout for generative visuals

### ESLint Configuration

The project uses `react/no-unescaped-entities` rule. Always escape quotes and apostrophes in JSX:
- Use `&ldquo;` and `&rdquo;` for double quotes
- Use `&apos;` for apostrophes
- Use `&quot;` as alternative for quotes

### Special Components

Custom MDX blocks are in `app/components/mdx-blocks/` for embedding media, p5 sketches, and interactive elements in project pages.
