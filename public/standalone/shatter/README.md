# Shatter

Generative art piece that creates frozen explosions. A solid wall of planes shatters outward from the center in a propagating wavefront, settling into a chaotic frozen state. Custom GLSL vertex shader adds noise-based displacement to each fragment.

By Aaron Demby Jones.

## Controls

- **Cracked / Shattered / Pulverized** buttons select the explosion intensity
- Click the active button (marked with ↻) to generate a new random shatter
- **Spacebar** pauses/resumes the animation
- **S** saves the current frame as a PNG

## Running

Requires a local HTTP server (shader files can't load over `file://`):

```
python3 -m http.server
```

Then open `http://localhost:8000` in a browser.

## How it works

Planes are pre-computed with starting positions (flat wall grid) and final positions (random 3D scatter). A wavefront delay based on distance from center creates the expanding shatter effect. Each plane lerps from start to end with ease-out-cubic timing. A GLSL vertex shader applies Perlin-like noise displacement for organic surface texture.

## License

[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) — see [LICENSE](LICENSE).
