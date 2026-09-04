# Architecture

~800 lines of TypeScript, no runtime dependencies. The whole thing compiles with
`tsc` to browser-native ES modules; `index.html` loads `dist/main.js` directly.

## Shape of it

```
src/core/shapes.ts    combinatorics on binary words — no bars, no time
src/core/grid.ts      placing a word into a bar of N cells
src/views/dom.ts      screen renderer
src/views/sheet.ts    print renderer
src/transport.ts      playhead (WebAudio + rAF)
src/main.ts           state, wiring, the only mutable thing
```

The import graph is acyclic and one-directional:

```
main.ts ─┬─> core/shapes.ts
         ├─> core/grid.ts ──> core/shapes.ts
         ├─> views/dom.ts ──> core/*
         ├─> views/sheet.ts ─> core/*, views/dom.ts (shares the ruler)
         └─> transport.ts
```

**`core/` never imports from `views/`.** That is the load-bearing rule. It is why
the print sheet and the playhead were both added without touching a line of the
model, and it is what a notation view would rely on.

## The model is bitstrings

A `Row` is `(0 | 1)[]`. That is the entire representation—no durations, no
pitches, no note values. Everything else is derived:

| Concept | Derivation |
|---|---|
| The bar | `beatsPerBar × cellsPerBeat` cells |
| A tiled pattern | `row[i] = shape[(i - d) mod k]` |
| A single figure | `row[(d + t) mod n] = shape[t]` |
| Where it repeats | `lcm(minimalPeriod(shape), n) / n` bars |

This is deliberately less than notation carries, and it is still enough to
*derive* notation—see the TODO below.

## Non-obvious invariants

Things that look like arbitrary choices but are not. Breaking any of these fails
quietly.

### The cycle follows the shape's period, not its length

`minimalPeriod(shape)` is the shortest length a shape actually repeats at, which
can be shorter than its declared length: `111` has period 1, `101010` has period
2. Both the composite cycle and the displacement range key on it.

Using `k` instead looks right and is wrong in a way nobody notices until they
fill the pattern in completely: an all-onsets pattern is identical in every bar,
but `lcm(3, 16) / 16` claims it needs three of them. The same over-count hits
any shape that repeats early.

It also means **drills in one family can differ in length** — `111000` needs
three bars where `101010` needs one — which is why `estimatePages` takes a bar
count per drill rather than one figure for the family.

### The cycle absorbs the ostinato

`compositeCycle` takes no ostinato argument. It looks like it should:
the ostinato is the other voice. But the ostinato is *authored as exactly `n`
cells and repeats every bar*, so its period always divides `n`, and
`lcm(lcm(k, p), n) = lcm(k, n)` whenever `p | n`. Adding the parameter back would
be redundant and would break for hand-drawn non-uniform ostinatos, where "period"
isn't even well defined.

### Drawing one bar is wrong, not just incomplete

When `k` does not divide `n`, bar 2 of a tiled pattern is a *different row* than
bar 1. Rendering a single bar and letting the user loop it produces a rhythm the
tool never intended. `render()` always draws `compositeCycle().cells`.

### Tile-mode distinct drills = `C(k, j)` exactly

Displacement is a closed operation on the shape set: rotating a tiled shape lands
you on another shape already in the list. This is why the sheet prints one drill
per shape and ignores the current displacement's identity.

### The lane gap belongs to whichever lane is on top

The space between the two voices is a `margin-bottom` on `.lane-pattern` (the
sliding hand, currently rendered above the steady hand). Reorder the lanes in
`main.ts` without moving that rule and the two rows will touch on every system
past the first, where labels aren't drawn to hide it.

### Playhead clearance lives on the content, not the container

`.grid-scroll` has `overflow-x: auto`, which makes `overflow-y` compute to `auto`
too, so it clips on all four sides. The playhead ring extends 2px past a cell, so
edge cells get shaved without clearance. Padding on the *container* does not
work: a scroll box's trailing padding is excluded from `scrollWidth` and vanishes
once you scroll to the end. The clearance is therefore
`.grid .lane { padding: 3px; min-width: max-content }`—the `min-width` is
required because otherwise the grid content overflows the lane's own box and the
padding never applies to it.

### Two channels distinguish the hands, and colour is the redundant one

Steady hand renders **hollow**, sliding hand renders **solid**—identical on
screen and on paper. Colour reinforces but does not carry it, because paper is
greyscale.

Do not pair the brand coral `#FF6B6B` with the brand teal `#06B6D4` for this:
their relative luminance differs by a ratio of **1.14**, which is effectively
invisible in greyscale. An earlier build used an amber/cyan pair measuring
**1.00**—literally identical luminance. The current ink-against-coral pair
measures **6.27**.

### Sheet geometry is measured, not estimated

The constants in `sheet.ts` (`SHEET.page`, `.header`, `.drillOverhead`,
`.system`) were read off the rendered print layout in millimetres, not guessed.
`estimatePages()` greedily packs *whole drills* because `.drill` carries
`break-inside: avoid`—dividing total height by page height gives the wrong
answer, badly: for `k=5, j=2` it says 7 pages where the true answer is 10.

If you change print padding, margins or cell size, re-measure. The check is:
render the sheet under print media at a 680 × 1009 viewport (180 × 267mm at
96dpi) and compare `.sheet` height against the estimate.

### Print is wired first in `bind()`

Printing is the product. It is registered before any other binding so that a
throw in a later one cannot silently disable it. `$()` throws by name for the
same reason—a missing element should say which element.

### Embed mode reads its flags exactly once

`src/embed.ts` captures `?embed` and `?print` into constants at startup, because
`syncUrl()` rewrites the address bar with only the settings parameters and
strips them. Re-reading `location.search` later reports "not embedded" inside
the iframe, and the Print button then prints the frame instead of handing off.

Two things follow from the host rendering a fixed-height, non-scrolling iframe:

- **Height is reported from `document.body`, not `documentElement.scrollHeight`.**
  The latter is floored at the viewport height, so once the host grows the box
  the value can never come back down and dead space accumulates below the
  content when the drill gets shorter.
- **Printing hands off to a real page.** A fixed iframe cannot paginate: a
  parent-initiated print shows about 60% of one page and stops. When embedded,
  the Print button opens `?print=1` in a new tab, which builds the sheet and
  prints itself. Settings ride along in the query string.

### Deploying: ship the build, not the source

`npm run deploy` does this — `scripts/deploy.mjs`, which tests, copies an
explicit allowlist, and fails if any TypeScript lands in the destination.
Prefer it over copying by hand.

The tool lives in Studio Demby at `public/standalone/gridding/` as
`index.html`, `styles.css`, `dist/` and `docs/`. **`src/` must not go there.**

Next.js typechecks every `.ts` file under the project — `public/` included —
using the *portfolio's* tsconfig, not this one. Gridding targets ES2022; the
portfolio's target is lower, so `for (const el of document.querySelectorAll(...))`
fails with a downlevelIteration error and takes the whole production build down.
Every other standalone piece ships plain `.js`, which is why none of them hit
this. This repo stays the source of truth; `public/` gets the artifact.

<a name="dev-server"></a>
### Use `serve.py`, not `python3 -m http.server`

`http.server` sends no `Cache-Control` and no `ETag`. With no validators at all,
browsers fall back to heuristic caching and will happily serve a stale
`dist/main.js` against a fresh `index.html`. That mismatch throws partway through
`bind()` and takes out whichever features were wired after the failure point.
`serve.py` sends `no-store`.

### A single figure cannot outlast its bar

In "once" mode a shape longer than `n` would wrap onto itself and silently
swallow its own onsets—a 5-cell figure in a 4-cell bar lands two onsets on one
cell and renders one. `maxPatternLength()` caps it, and `reconcile()` applies the
cap on every state change. Reachable in the UI: 2 beats of eighths is a 4-cell
bar, and pattern length goes to 6.

## Verifying changes

Two layers. Unit tests cover the pure model; the browser covers everything a
test can't see.

```bash
npm test               # tsc + node --test, no test framework
npx tsc                # must be clean before committing
npm run serve
```

Tests live beside their subjects as `*.test.ts` and cover `core/` plus
`estimatePages`. They deliberately do **not** touch the DOM, the renderers or
the wiring—those are verified in a browser instead. The suite runs in ~60ms
with no dependencies beyond `@types/node`.

The tests worth not breaking:

- **`displacing lands on another shape from the same family`**—the invariant
  the whole printed sheet rests on. If this fails, printing one drill per shape
  no longer covers every position.
- **`plays a different bar 2 when the pattern crosses the barline`**—locks in
  the reason the tool draws whole cycles.
- **`never splits a drill across a page`**—guards the packing model against
  being "simplified" back into a height division.

Then drive Playwright against `http://localhost:5178`. Worth checking after any
layout change:

- **375px** and **1000px+** viewports
- **Print media emulation** at 680 × 1009—`page.emulateMedia({media:'print'})`
  after dispatching `beforeprint`
- **`k=3`** (a 3-bar cycle, exercises the multi-system path)
- **`k=6, j=3`** (20 drills, ~10 pages—exercises page packing)
- The playhead ring on the **first and last** cells of a bar
- **Embedded**, via `.playwright/embed-harness.html`, which mirrors
  `EmbedExperience.tsx`: the iframe must fit with no clipping, grow and shrink
  with the drill, and the Print button must open a new tab rather than print
  the frame

Screenshots go in `.playwright/` (gitignored).

## TODO

Ordered by value, not effort.

### Notation view

The bitstring model was chosen so this stays a pure view. The bridge is
run-length encoding—roughly ten lines that belong in `core/grid.ts`:

```ts
/** `1100` -> [{onset:true, cells:2}, {onset:true, cells:2}] */
export function runs(row: Row): Array<{ onset: boolean; cells: number }> {
  const out: Array<{ onset: boolean; cells: number }> = [];
  for (let i = 0; i < row.length; i++) {
    const onset = row[i] === 1;
    const last = out[out.length - 1];
    if (onset || !last) out.push({ onset, cells: 1 });
    else last.cells += 1;
  }
  return out;
}
```

`cells` times `1 / cellsPerBeat` is the duration; the tuplet case falls out of
`cellsPerBeat` not being a power of two. A `views/notation.ts` consuming this
would need no change anywhere else. (This function existed and was removed as
dead code—it is recorded here rather than shipped unused.)

### Open UX findings

Both audits are in this directory with status tables:
[audit-1-heuristic.md](audit-1-heuristic.md),
[audit-2-session-and-skeptic.md](audit-2-session-and-skeptic.md).

Still open:

- **Tap targets** are ~19px on mobile against a 44pt minimum. Downgraded by the
  generator/sheet reframe (it's a desk tool now) but not fixed.
- **Layout jolt**—dragging pattern length can jump the page from 1 system to 5
  with no warning.
- **Freemium joke**—a parked idea about gating absurdly hypercomplex features
  (sextuplet grids, nested tuplets) behind a fake paid tier.
