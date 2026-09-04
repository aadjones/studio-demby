# Gridding—working notes for Claude

A practice-sheet generator for rhythmic gridding. Read
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) before changing anything structural;
it records the invariants that fail quietly.

## The one thing to keep straight

**The browser page is a generator. The printed sheet is the product.**

This was settled by an audit (`docs/audit-2-session-and-skeptic.md`) after
measuring that the screen is unreadable at playing distance and unusable with
both hands on an instrument. Consequences that come up constantly:

- Print quality outranks screen polish. If a change makes the sheet worse to fix
  the screen, it's the wrong change.
- Screen and sheet use the **same visual language**—steady hand hollow,
  sliding hand solid. Keep them in sync; they're separate renderers.
- Desk ergonomics (mouse, full attention) are the screen's target, not
  music-stand ergonomics. That's why sub-44px tap targets are a known,
  accepted trade-off rather than a bug.

## Commands

```bash
npm test          # tsc + node --test  (fast; run this first)
npm run build     # tsc -> dist/       (must be clean before any commit)
npm run watch
npm run serve     # http://localhost:5178
```

**Always `npm run serve`.** Never `python3 -m http.server`—it sends no cache
headers, browsers then serve a stale `dist/main.js` against fresh HTML, and the
resulting mid-`bind()` throw silently disables features. This has already cost
one debugging session.

## Verification

Two layers, and the split matters.

**Unit tests** (`src/**/*.test.ts`, `node:test`, no framework) cover the pure
model in `core/` and `estimatePages`. Add tests here for combinatorics,
placement maths and page packing. Do **not** add tests for the DOM, the
renderers, or `main.ts` wiring—per the testing philosophy those are UI, and
they are verified in a browser instead.

**Browser verification** for everything else. Verify in Playwright
with a cache-bust (`?v=<timestamp>`), and put screenshots in `.playwright/`.

After **any** layout or CSS change, check:

| Case | Why |
|---|---|
| 375px and 1000px | mobile-first, `min-width` queries only |
| Print media at 680 × 1009 | 180 × 267mm A4 content box at 96dpi |
| `k=3` | 3-bar cycle—exercises the multi-system path |
| `k=6, j=3` | 20 drills, ~10 pages—exercises page packing |
| Playhead on first + last cell | the scroll container clips edge rings |
| Embedded (`?embed`) | Studio Demby renders it in a fixed, non-scrolling iframe |

For print: dispatch `beforeprint`, then `page.emulateMedia({media:'print'})`.
The sheet is built lazily, so it's empty until one of those fires.

**Measure, don't eyeball.** Every significant bug in this project was found by
measuring and missed by looking: two lane colours with identical luminance
(1.00), a page estimate off by 3 pages, a sheet overflowing A4 by 0.9mm, a ring
clipped by 2px. Contrast ratios, millimetres and visual angles are all cheap to
compute in `page.evaluate`.

## Deploying to Studio Demby

Copy `index.html`, `styles.css`, `dist/` and `docs/` into
`studio-demby/public/standalone/gridding/`. **Never copy `src/`** — Next
typechecks `.ts` anywhere in the project including `public/`, with the
portfolio's tsconfig rather than this one, and it fails the production build.
Run `pnpm build` in studio-demby before committing anything there.

## House rules that bite here

- **Delete > Add.** Four exports were shipped unused and later removed. If a
  helper has no caller, delete it and describe it in the ARCHITECTURE TODO
  instead.
- **Wireframe before layout CSS.** Named containers, agreed first. Class names
  match container names.
- **Em dashes take no spaces**—`word—word`.
- **Conservative visual adjustments.** Expect 2–3 rounds; don't overcorrect on
  the first note.
- **No em-dash-free jargon in UI copy.** Plain language, one sentence. "Starts
  on the *e* of beat 1", not "displacement 1 / 4".

## Where things live

```
src/core/     pure model, no DOM — shapes.ts, grid.ts
src/views/    dom.ts (screen), sheet.ts (print) — same inputs
src/          transport.ts (playhead), main.ts (state + wiring)
docs/         ARCHITECTURE.md + two UX audits with status tables
.playwright/  screenshot scratch (gitignored)
```

`core/` must never import from `views/`. That rule is why print and the playhead
were both added without touching the model.
