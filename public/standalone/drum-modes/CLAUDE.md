# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a vanilla-JS + three.js visualization of the normal modes and impulse response of an idealized circular drumhead (a vibrating membrane), using Bessel-function math. It has two modes: **Explore** (step through individual (m,n) modes) and **Strike** (tap directly on the 3D drumhead to strike it with an animated drumstick, watch a Gaussian mallet impulse decompose into a superposition of modes and decay in real time, with a live frequency-spectrum chart).

## Running the Project

This is a client-side web app with no build step. Because it makes no `fetch()` calls, it can be opened directly:

```bash
open index.html
```

For parity with other standalone pieces in this style (some of which do need a server for shader/asset loading), you can also serve it:

```bash
python3 -m http.server 8000
# or
npx serve
```

The application runs entirely in the browser with no backend or build process.

## Architecture

This project follows a modular architecture with clean separation of concerns, using the IIFE module pattern (no bundler). For detailed architecture documentation, see [ARCHITECTURE.md](ARCHITECTURE.md).

### Quick Reference

**Directory Structure:**
```
src/
├── core/                  # Physics, math, and state
│   ├── constants.js       # Physical/tuning constants
│   ├── bessel.js          # Bessel function math (factorial, besselJ, besselZeros)
│   ├── mode-basis.js      # Enumerates the (m,n) mode basis
│   ├── gram-solver.js     # Gram matrix + Cholesky least-squares projection
│   ├── playback-clock.js  # Shared animation clock (explore + strike)
│   ├── explore-mode.js    # Explore-mode state + computeExplore()
│   └── strike-engine.js   # Strike-mode state + physics (doStrike, updateDamping)
├── rendering/              # Graphics pipeline
│   ├── disk-mesh.js        # Disk mesh + quadrature weights
│   ├── scene-rig.js        # three.js scaffold (scene/camera/renderer/lights)
│   ├── wireframe-view.js   # Coarse polar-grid overlay (drum-vibes style)
│   ├── drumstick-view.js   # Drumstick model + swing animation (drum-vibes style)
│   └── spectrum-view.js    # Frequency-spectrum Canvas2D chart
└── ui/                      # User interface
    ├── dom.js               # `$` getElementById helper
    ├── camera-controls.js   # Drag-to-rotate camera
    ├── strike-input.js      # Raycasts taps on the 3D drumhead itself
    └── ui.js                 # Wires every panel slider/button
```

**Application Layer:**
- `main.js` — boot sequence, `requestAnimationFrame` render loop, entry point (loaded last)
- `index.html` — markup + script tags in dependency order

### Data Flow

```
Strike:  drumhead pointerup (raycast hit) → DrumstickView.strike(r, th, onImpact)
                                → stick falls for T_IMPACT=0.75s → onImpact fires:
                                → StrikeEngine.doStrike() → GramSolver.projectCoeffs()
                                → StrikeEngine.state updated → SpectrumView redraw

Render:  requestAnimationFrame → PlaybackClock.exElapsed()/strikeElapsed()
                                → ExploreMode / StrikeEngine amplitude eval → SceneRig mesh update
                                → DrumstickView.update(now) (swing animation)
```

### Key Architecture Principles

1. **Each concern owns one small state object** (`ExploreMode.state`, `StrikeEngine.state`, `PlaybackClock.state`, `CameraControls.state`, `SpectrumView.state`) rather than one shared blob — ownership stays unambiguous.
2. **`StrikeEngine` is a pure physics leaf** — it never calls drawing functions itself. Callers (`strike-input.js`'s pointerup handler, `ui.js`'s Re-strike button) call `StrikeEngine.doStrike()` and then explicitly redraw. This avoids a circular dependency between the physics and rendering layers.
3. **The physics fires on contact, not on click.** `StrikeInput` never calls `StrikeEngine.doStrike()` directly — it calls `DrumstickView.strike(r, th, onImpact)`, and `DrumstickView` invokes `onImpact` on the exact frame the stick's swing animation reaches the membrane (`T_IMPACT`). Don't reintroduce an immediate `doStrike()` call at click time — the membrane would visibly react before the stick arrives.
4. **Script load order = dependency order.** There's no bundler, so `index.html`'s `<script>` tag order matters — see the full list there or in ARCHITECTURE.md.
5. **IIFE pattern** for module encapsulation without build tools.

## Common Modifications

### Adding a new physical/tuning constant

1. Add it to [src/core/constants.js](src/core/constants.js), grouped with related constants, with a comment explaining what it controls.
2. Reference it via `Constants.YOUR_CONSTANT` from whichever module needs it — don't inline magic numbers.

### Adding a new UI control

1. Add the HTML control (slider/button) to [index.html](index.html), inside `#explorePanel` or `#strikePanel`.
2. Wire its event listener inside `initUI()` in [src/ui/ui.js](src/ui/ui.js), following the existing pattern of reading/writing the relevant module's `state` object and calling its update function.

### Modifying the damping model

- The model and its coefficients live in [src/core/constants.js](src/core/constants.js) (`D_A0`, `D_A1`, `D_RAD`, `D_MAX`, `D_CLAMP`), with the derivation comment right above them.
- The per-mode application of the model is in `updateDamping()` in [src/core/strike-engine.js](src/core/strike-engine.js).

### Adding a new mode-basis parameter (e.g. changing the frequency cutoff)

- `RATIO_CUT` in [src/core/constants.js](src/core/constants.js) controls how many modes are included (see the comment there about why this is a frequency cutoff, not an index cutoff).
- The enumeration logic itself is in [src/core/mode-basis.js](src/core/mode-basis.js).

### Adjusting the wireframe grid

- Density, color, opacity, and lift-above-surface are all local constants at the top of [src/rendering/wireframe-view.js](src/rendering/wireframe-view.js) (`RING_STEP`, `SPOKE_STEP`, `WIRE_COLOR`, `WIRE_OPACITY`, `WIRE_LIFT`). Keep `RING_STEP`/`SPOKE_STEP` as divisors of `Constants.RINGS`/`Constants.SEGMENTS` so wire vertices stay exactly on render vertices — this is a style match with the `drum-vibes` sibling project's `strike.mjs`, which relies on the same trick.

### Adjusting the drumstick swing

- Shape, lean angle, and timing are local constants at the top of [src/rendering/drumstick-view.js](src/rendering/drumstick-view.js) (`STICK_L`, `TIP_R`, `LEAN`, `DROP`, `T_IMPACT`, `FADE_START`, `FADE_END`, `HIDE_AT`) — also a style match with `drum-vibes/strike.mjs`.
- Timing changes need no other edits: every strike call site delays `StrikeEngine.doStrike()` via `DrumstickView`'s `onImpact` callback rather than a hardcoded delay, so changing `T_IMPACT` alone keeps the physics in sync with the new swing duration.
