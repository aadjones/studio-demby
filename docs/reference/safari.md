# Safari compatibility

Known Safari bugs and their fixes, moved out of CLAUDE.md. Read this when a p5 sketch is blank or slow in Safari, or a CSS 3D card flip misbehaves.

## Safari Compatibility — p5.js Canvases

Safari is a persistent source of bugs for p5.js sketches. Known issues and fixes:

**1. `aspect-ratio` CSS + `clientHeight` → canvas size 0**
Safari resolves `aspect-ratio` lazily. If you call `parent.clientHeight` at `IntersectionObserver` or `setup` time on an `aspect-square` container, it may return `0`. `Math.min(clientWidth, 0) = 0` → `createCanvas(0, 0)` → silent failure, nothing renders.
- **Fix:** Use `parent.clientWidth` only (the container is already square via CSS). Never use `clientHeight` for canvas sizing on aspect-ratio containers.
- **Guard:** Add `if (size < 1) return;` at the top of any draw/generate function.

**2. `blendMode(ADD)` on `p5.Graphics` buffers**
Safari can produce compositing artifacts when `blendMode(ADD)` is set before `background()` on a graphics buffer.
- **Fix:** Call `buffer.background(0)` first, then `buffer.blendMode(p.ADD)`.
- Safari's WebKit Canvas 2D handles `globalCompositeOperation: 'lighter'` (ADD) significantly slower than Chrome. This is a fundamental WebKit limitation — reducing vertex count or debouncing helps but won't fully close the gap. Accept it or switch to WebGL mode.

**3. `pixelDensity` on mobile**
On iPhone (3x display), p5 renders a canvas 9x larger than the visible size by default. This is the biggest single cause of mobile slowness.
- **Fix:** Call `p.pixelDensity(1)` in `setup()` before anything else.

**4. General rule**
When a p5 sketch works in Chrome but is blank/broken in Safari, check canvas sizing first. When it's slow on mobile Safari, check pixelDensity and ADD blend mode.

## Safari Compatibility — CSS 3D Card Flips (React inline styles)

React's `style={}` object does **not** auto-add vendor prefixes. Safari requires `-webkit-` prefixes for 3D transform properties or they silently do nothing.

**Symptom:** Card back content shows through as mirrored/ghost text—`backface-visibility: hidden` did nothing.

**Root cause (spec-level, not a Safari bug):** The CSS spec defines properties that **force `transform-style: flat`** on any element, even if you explicitly set `preserve-3d`. These kill `backface-visibility` entirely:
- `overflow: hidden/scroll/auto` — 2D clipping is architecturally incompatible with a 3D context
- `opacity < 1`
- `filter` (any value other than `none`)
- `clip-path`
- `mask-image`
- `will-change: transform` (or other compositing values)

Audit every element in the chain (face divs AND their ancestors) for these. Chrome is more forgiving; Safari is strict about the spec.

**Fix 1 — webkit prefixes** (necessary but not sufficient):
```tsx
style={{ perspective: "1200px", WebkitPerspective: "1200px" }}
style={{ transformStyle: "preserve-3d", WebkitTransformStyle: "preserve-3d" }}
style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
```

**Fix 3 — cold-start GPU jank on first flip:**
The first CSS transition on an element triggers expensive synchronous compositing layer creation. Add `willChange: "transform"` to the flip container to pre-promote it at mount. Subsequent flips are always smooth because the layer is already warm. Symptom: first click is slow/snappy, all subsequent clicks are fine.

**Fix 2 — don't fight the browser, use React state:**
If CSS 3D still misbehaves, bypass `backface-visibility` entirely with a React visibility toggle:
```tsx
// On the face divs — toggled with `flipped` state
style={{ visibility: flipped ? "hidden" : "visible" }}  // front face
style={{ visibility: flipped ? "visible" : "hidden" }}  // back face
```
This is reliable across all browsers. The tradeoff: the face content swaps at click time (not at the animation midpoint). Can smooth this with a 350ms `setTimeout` delay (half of a 700ms flip duration).

