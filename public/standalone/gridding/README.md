# Gridding

A practice-sheet generator for rhythmic *gridding*: one hand holds a steady
ostinato while the other plays a short pattern that you displace across the bar,
one cell at a time.

The browser page is a **generator**. The deliverable is **paper**—build the
sheet you want this week, print it, and practice from the printout. Nothing on
screen is meant to be read while your hands are on an instrument.

The grid is deliberately abstract, so it works for piano, drums, guitar or
anything else with two independent voices.

## Running it

```bash
npm install
npm run build     # tsc -> dist/
npm run serve     # http://localhost:5178
npm test          # unit tests for the model (no framework)
npm run deploy    # test, then copy the build into Studio Demby
```

Use `npm run serve`, not `python3 -m http.server`—see
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#dev-server) for why.

`npm run watch` recompiles on change.

## Using it

1. **Grid setup** (collapsed at the bottom)—beats per bar, cells per beat, and
   whether the pattern is *Continuous* (carries across barlines) or a *Single
   figure* (one occurrence placed anywhere).
2. **Patterns**—set the pattern length and how many notes it contains. Every
   pattern of that size appears as a chip; click one to preview it.
3. **Displacement**—the `◀ ▶` buttons slide the pattern one cell at a time.
   The readout says where it now starts musically ("Starts on the *e* of beat 1").
4. **Preview**—plays the drill with two clicks, one per hand.
5. **Print sheet**—prints every pattern of the current size. The topbar shows
   the count and page estimate first; use your print dialog's page range if you
   only want part of it.

## The idea

A bar is `N` cells (4/4 in sixteenths → 16). A pattern is a binary word of
length `k` with `j` onsets—think of it as a slip of paper you slide along the
grid. There are `C(k, j)` such patterns.

Two things worth knowing, because they are not obvious:

- **Displacement does not multiply the material.** For a pattern that tiles the
  bar, sliding it by one cell just lands you on another pattern already in the
  `C(k, j)` list. `C(4,2) = 6` patterns × 4 displacements is **6** drills, not 24.
- **A pattern whose length doesn't divide the bar carries across the barline.**
  A 3-cell pattern in 4/4 sixteenths plays a different row in bar 2 than in bar 1
  and takes 3 bars to come back around. The tool draws the whole cycle, because
  drawing one bar would be wrong, not merely incomplete.

## Layout

```
src/core/     pure model — no DOM, no instrument, no notation
src/views/    dom.ts (screen) and sheet.ts (print), same inputs
src/          transport.ts (playhead), main.ts (state + wiring)
docs/         architecture notes and two UX audits
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
