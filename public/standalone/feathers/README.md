# Feathers

Generative art piece that creates abstract feather-like compositions from layered Bezier-curve streaks. Each feather animates into existence over ~12 seconds with a shuffled, eased draw order for an organic blooming effect.

By Aaron Demby Jones.

## Controls

- **Wispy / Lush / Dense** buttons select the feather style
- Click the active button (marked with ↻) to generate a new random variation
- **Spacebar** pauses/resumes the animation
- **S** saves the current canvas as a PNG

## Running

Open `index.html` in a browser. No build step required — p5.js is loaded from CDN.

## How it works

Drops are arranged along Bezier curves, grouped into streak sets, and layered with random rotation/scale/mirror transforms. All drop coordinates are pre-computed with transforms baked in via 2D affine matrix math, then shuffled and drawn one-by-one onto an off-screen buffer. Each drop fades in over ~0.5 seconds using a two-buffer compositing approach.

## License

[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) — see [LICENSE](LICENSE).
