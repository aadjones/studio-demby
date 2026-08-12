# Modes & Spectrum of a Circular Drumhead

An interactive visualization of how a circular drumhead actually vibrates — built on the Bessel-function math for a 2D vibrating membrane, rendered in real time with three.js.

## What it shows

A struck string vibrates at neat integer-multiple harmonics, which is why it reads as a musical *note*. A struck drumhead doesn't — its natural frequencies are governed by the zeros of Bessel functions, which don't line up on a harmonic grid. That mismatch is most of why a drum sounds like a *thud* instead of a pitch.

The piece has two modes:

- **Explore mode** — step through individual normal modes by choosing `m` (nodal diameters) and `n` (nodal circles). Watch the standing wave `u = Jₘ(kr)·cos(mθ)·cos(ωt)` animate, with its nodal lines (the parts of the membrane that stay still) overlaid.
- **Strike mode** — tap anywhere on the 3D drumhead itself and an animated drumstick swings in and strikes it. The tap is modeled as a Gaussian mallet impulse, decomposed into a weighted sum of normal modes (a least-squares projection, not an approximation), and the resulting superposition animates in 3D while a live spectrum chart shows each mode's frequency and energy. Adjustable damping and radiation-loss models show why some modes (like the fundamental) die out fast while others ring on — the actual mechanism behind a timpani's distinctive tone.

## Running it

No build step, no dependencies beyond three.js (loaded from a CDN). Open [`index.html`](index.html) directly in a browser, or serve the directory for parity with other pieces in this style:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Project structure

Vanilla JS, organized into `src/core/` (physics and math), `src/rendering/` (three.js scene + Canvas2D views), and `src/ui/` (DOM wiring), using the IIFE module pattern (no bundler required). See [ARCHITECTURE.md](ARCHITECTURE.md) for the full breakdown, or [CLAUDE.md](CLAUDE.md) for a working-in-this-codebase quick reference.

## Tech stack

- Vanilla JavaScript (ES6+)
- [three.js](https://threejs.org/) r128, for the 3D membrane rendering
- Canvas 2D, for the spectrum chart
