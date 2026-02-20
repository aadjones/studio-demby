# Architectural Audit — February 2026

## Context

The site went through several organizational phases (clusters → four categories → three categories). This audit identifies vestigial code from those transitions. The goal is internal cleanup only — no surface behavior changes.

## Canonical Categories (as of Feb 2026)

`music`, `visual-art`, `teaching`

## Findings

### Dead Frontmatter Fields (schema + MDX)

| Field | In MDX? | Read by app? | Action |
|-------|---------|-------------|--------|
| `type` | All 33 projects | No | Remove from schema + all MDX |
| `isFeatured` | All 33 projects | No — `StartHere.tsx` hardcodes `CURATED_WORKS` | Remove from schema + all MDX |
| `featuredOrder` | 6 projects | No | Remove from schema + all MDX |
| `collapseMode` | 22 projects | No | Remove from schema + all MDX |
| `fieldNumber` | 1 project (shatter) | No | Remove from schema + MDX |
| `phaseState` | 1 project (above) | No | Remove from schema + MDX |
| `subtitle` | 0 projects | No | Remove from schema |
| `description` | 0 projects | No (only `summary` used) | Remove from schema |
| `whisper` | 21 projects | No — frontmatter field is never read; `<Whisper>` component gets text via explicit MDX props | Remove from schema + all MDX |

### Dead Code

| Item | Location | Action |
|------|----------|--------|
| `StreamItem` type | `types/mdx.ts:74-76` | Delete |
| `SketchCard.tsx` | `app/components/SketchCard.tsx` | Delete — links to nonexistent `/sketches/` route, never imported |

### Stale Documentation

- `CLAUDE.md` category examples referenced old slugs (`sound-vision`, `systems-tools`). Updated to canonical three.

### Active Fields (kept)

| Field | Why |
|-------|-----|
| `overrideHero` | Used in `work/[slug]/page.tsx` to toggle default hero. 30/33 set `true` (inverted default, but works) |
| `relatedSlugs` | Used in `work/[slug]/page.tsx` for related works section |
| `images` | Used by `HeroCarouselBlock` |
| `externalLink` / `githubLink` | Present in 6 projects. Not rendered in UI currently but kept as intentional data |
| `archived` | Used by loaders to filter out archived projects |

### Redirects in `next.config.js` — keep them

Old category/cluster redirects (`/sound-vision`, `/systems-tools`, `/featured/:slug`, `/resonant/:slug`, etc.) prevent 404s for bookmarked/linked old URLs. Don't touch these.

### Future Considerations (not done in this pass)

1. **Invert `overrideHero` default** — 30/33 projects set `true`. Could flip to `useDefaultHero` on the 2-3 that need it. Low priority since it works.
2. **Add `categories` to `SketchSchema`** — Currently `inferActivityCategories()` in `unified-loader.ts` guesses categories from tags. Adding explicit categories to the 6 activity MDX files would be cleaner.
3. **Clean up `{...frontMatter}` spreading in `ClientMDX.tsx`** — Every MDX component receives all frontmatter as props. Only a few need it (e.g. `HeroCarouselBlock` needs `images`). Low risk but noisy.
4. **Wire up `externalLink`/`githubLink`** — These exist in content but aren't rendered anywhere. Decide whether to surface them or remove them.
