# Site audit: follow-ups

Started 2026-10-27 from a full design / speed / codebase review. Work happens in
batches, each on its own branch and checked with `pnpm snapshot` before merging.
Delete this file when everything below is done.

## Batches

| Batch | What | Status |
|---|---|---|
| 0 | Snapshot safety net; invalid frontmatter fails the build | merged |
| 1 | Image optimization on, ZoomImage sizes, Degradation card as MP4 | merged |
| 2 | p5 only on sketch pages, image priority, hero title server-rendered, Teaching in nav, aria-labels | merged |
| 2b | /work grid rendered on the server, including `?category=` links. Production: score 68 → 94, LCP 4.3 s → 2.5 s, layout shift 0.28 → 0. | merged |
| 3 | Dead code and dependencies, activity content type, route bugs below. 35 files and 8 packages removed; project-page JS 230 → 209 KB; `tsc --noEmit` clean. | merged |
| 4 | Design: one background white, text contrast, project-page column widths; then taste calls (emoji in titles, Teaching styling, Music thumbnails, hero title panel, `min-width: 360px`) | next |

Measured (Lighthouse mobile, `--throttling-method=devtools`, production) after batch 2:
Home 87 / LCP 2.4 s, Shatter 90 / LCP 2.9 s, /work 68 / LCP 4.3 s.

## Things that caused confusion

Anything that misled a working session goes here, with how it gets fixed: in
code (preferred), in docs, or both. Fixed items stay listed with the fix so the
history is visible until this file is deleted.

| What happened | Fix | Status |
|---|---|---|
| A stale `next start` was still running during a rebuild. `/contact`, `/extras/married-for` and the 404 page then returned a bare 500 with nothing in the log. | Code: `prebuild` runs `scripts/guardBuild.js`, which refuses to build while port 3000 is in use. | done |
| `images.unoptimized: true` (commented "helps with local image loading") silently disabled all image resizing. | Code: removed. | done |
| `next.config.js` marked npm `p5` as a webpack external, so `import p5 from "p5"` meant "read the global". Removing the global script would have crashed every project page via dead playgrounds. | Code: externals override, dead playgrounds and npm `p5` removed; sketches use `loadP5()`. | done |
| The homepage hero, title included, was wrapped in `ssr: false`, so the server HTML had no heading. | Code: wrapper deleted. | done |
| Lighthouse's default mode estimates phone timings from a model; it reported 7 s "render delay" on Shatter that a real throttled run measured at under 0.1 s. | Docs: measure with `--throttling-method=devtools` (see CLAUDE.md). | done (3) |
| `ZoomImage` hardcoded `sizes` and `priority`, so galleries fetched 3840px images and all competed to load first. | Code: both are props now, off by default. Docs: "Images" in CLAUDE.md. | done (3) |
| `/work/contrapose` is both a static route and a `[slug]` page; both write `contrapose.html` and which one wins differs between local and Vercel builds. | Code: `[slug]` skips any slug with its own `app/work/<slug>/page.tsx`. | done (3) |
| `html { min-width: 360px }` in `global.css` makes every page scroll sideways on a 320px phone; looked like a nav overflow at first. | Decide: keep (and comment why) or remove. | to do |
| CLAUDE.md says dark mode uses `next-themes`; it isn't installed and the `dark:` classes never apply. | Docs: fixed; CLAUDE.md says there is no dark mode. | done (3) |
| `tsc --noEmit` reports an error in `tests/clef-ledger.test.ts` that `next build` never sees (it doesn't type-check tests). | Code: tsconfig `target` es5 → ES2017 (only affects type checking). `tsc --noEmit` is now clean. | done (3) |
| Related Works links to Sack Vulnerability get a 404 on prefetch because the slug redirects to a static HTML file. | Code: `redirectTo` frontmatter; config builds a 307 for direct visits (skipping RSC requests) and the page's `redirect()` handles links. Docs: CLAUDE.md. | done (3) |
| Archived Chonktionary page throws React hydration errors. | Cause: React escapes `'` in an inline `<style>{`…`}</style>` on the server; the browser keeps it literally. Code: `dangerouslySetInnerHTML`. | done (3) |
| 15 MDX components are registered but unused; `P5Container` is only used by dead components. | Code: 11 unregistered, 35 files and 8 dependencies deleted. Kept: `clef-rake/lib/ledger.ts` (tested, unused by pages yet) and `degradation.gif` (best remaining source of that loop). | done (3) |
| On a local batch 2 build, /work card images never loaded in the Playwright browser: zero image requests, even for an eager test image, while `curl` fetched the same URLs and production loaded fine in the same browser. Several server restarts had happened in that session. | The batch 2 preview loads all 12 /work images, so it was the local test setup, not the code. Cause still unknown; if it recurs, restart the browser and server before debugging the site. | resolved: not a code bug |
| `git add` on a file already deleted with `git rm` fails, and the staged deletion silently lands in whatever commit runs next. | Docs: stage deletions in the commit they belong to. | noted here |
| `useSearchParams` in `WorkGrid` made Next skip server-rendering the whole /work grid (it sat inside `<Suspense>`), so cards and images waited for JavaScript and the footer jumped when they appeared. Nothing in the code said so. | Code: the page passes the category in; `/work?category=` is served by a prebuilt page per category via a `beforeFiles` rewrite. Docs: "How `/work?category=…` works" in CLAUDE.md. | done (2b) |
| The first version of that rewrite was a plain array, which Next runs only after matching `/work`'s own page file, so every category URL silently got the Music page. | Code: `beforeFiles`. Docs: CLAUDE.md routing section. | done (2b) |
| CLAUDE.md said "always `rm -rf .next && pnpm build`". The `rm` runs before the build guard, so following the rule deleted the user's running `vercel dev` `.next`. | Code: `pnpm clean-build` checks the port first, then clears and builds. Docs: CLAUDE.md now says to use it and never type `rm -rf .next`. | done (3) |
| A `vercel dev` session on port 3000 blocks commits, because the pre-commit hook builds into the same `.next`. Test builds can still run safely from a copy in another folder on another port. | Docs: noted here. | noted here |
| After merging a branch whose commit already had a preview, waiting on the commit's status returned "success" from the preview immediately, so production checks ran against the old site. | Wait on the Production deployment's own status: `gh api "repos/aadjones/studio-demby/deployments?sha=<full sha>&environment=Production"`, then its `/statuses`. | noted here |
| `next start` serves a prerendered page's `redirect()` as a 307 with no Location header, so the destination is only known to JavaScript. | Code: the config redirect covers direct visits (see `redirectTo`). | done (3) |
| Six archived activity pages became projects; their bodies had no title, and Chonktionary's design already had one, so a generic title block doubled it. | Code: `<HeroTitleBlock />` on five, none on Chonktionary. | done (3) |
| `HeroTitleBlock` didn't accept `className`, breaking the CLAUDE.md MDX rule, so `not-prose` from ClientMDX was dropped. | Code: added the prop. | done (3) |
| `html { min-width: 360px }` decision (above) belongs to the design batch. | Decide in batch 4. | to do (4) |
| `pnpm snapshot diff batch-2b batch-3 baseline-rerun` reported zero changes: the noise capture was of the original site, not batch 2b, so every page changed since then was filed as noise. | Docs: the noise capture must be a second run of the same site as "before" (CLAUDE.md says so); without one, leave the argument off. | noted here |
| Making `HeroTitleBlock` honor `className` let `not-prose` remove the prose margin above subtitles, tightening three titles by ~14px. | Code: subtitle keeps `mt-[1.25em]` so nothing moves; spacing is for the design batch. | done (3) |
