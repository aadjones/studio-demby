# Site audit: follow-ups

Started 2026-10-27 from a full design / speed / codebase review. Work happens in
batches, each on its own branch and checked with `pnpm snapshot` before merging.
Delete this file when everything below is done.

## Batches

| Batch | What | Status |
|---|---|---|
| 0 | Snapshot safety net; invalid frontmatter fails the build | merged |
| 1 | Image optimization on, ZoomImage sizes, Degradation card as MP4 | merged |
| 2 | p5 only on sketch pages, image priority, hero title server-rendered, Teaching in nav, aria-labels | on branch, checking preview |
| 3 | Dead code and dependencies, activity content type, route bugs below | not started |

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
| Lighthouse's default mode estimates phone timings from a model; it reported 7 s "render delay" on Shatter that a real throttled run measured at under 0.1 s. | Docs: measure with `--throttling-method=devtools` (see CLAUDE.md). | to do |
| `ZoomImage` hardcoded `sizes` and `priority`, so galleries fetched 3840px images and all competed to load first. | Code: both are props now, off by default. Docs: note in CLAUDE.md. | code done, docs to do |
| `/work/contrapose` is both a static route and a `[slug]` page; both write `contrapose.html` and which one wins differs between local and Vercel builds. | Code: exclude it from `generateStaticParams`. | to do (batch 3) |
| `html { min-width: 360px }` in `global.css` makes every page scroll sideways on a 320px phone; looked like a nav overflow at first. | Decide: keep (and comment why) or remove. | to do |
| CLAUDE.md says dark mode uses `next-themes`; it isn't installed and the `dark:` classes never apply. | Docs: fix the line. | to do |
| `tsc --noEmit` reports an error in `tests/clef-ledger.test.ts` that `next build` never sees (it doesn't type-check tests). | Code: fix the test or tsconfig target. | to do |
| Related Works links to Sack Vulnerability get a 404 on prefetch because the slug redirects to a static HTML file. | Code: link straight to the standalone page. | to do (batch 3) |
| Archived Chonktionary page throws React hydration errors. | Code: find the server/client mismatch. | to do (batch 3) |
| 15 MDX components are registered but unused; `P5Container` is only used by dead components. | Code: delete. | to do (batch 3) |
| On a local batch 2 build, /work card images never loaded in the Playwright browser: zero image requests, even for an eager test image, while `curl` fetched the same URLs and production loaded fine in the same browser. Several server restarts had happened in that session. | The batch 2 preview loads all 12 /work images, so it was the local test setup, not the code. Cause still unknown; if it recurs, restart the browser and server before debugging the site. | resolved: not a code bug |
| `git add` on a file already deleted with `git rm` fails, and the staged deletion silently lands in whatever commit runs next. | Docs: stage deletions in the commit they belong to. | noted here |
