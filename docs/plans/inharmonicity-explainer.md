# Inharmonicity Explainer: Planning & Handoff Doc

**Status:** Phase 1 complete + extended (2026-07-08): `lib.ts`, `audio.ts`, `InharmonicSynth` built (then rebuilt to the §4.4 UI-minimalism standard after user feedback), verified at 375/768/1440 with unit tests passing and a clean build. Page stub lives at `/work/inharmonicity` (`status: draft`—unlisted, absent from the sitemap, `noindex`; flip to `published` in Phase 5). **Architecture decision:** the explainer is now hybrid—a real recording is the ground truth (§4.4b `RealPianoSpectrum`, in progress), the synth is the manipulable lab model. Salamander samples are downloaded to `public/audio/inharmonicity/` and offline analysis confirmed the A3's measured B = 0.000209. Next: finish `RealPianoSpectrum`, then Phase 2.
**Audience for this doc:** Any Claude Code session (including less capable models) picking up this project cold. Read this entire doc before writing any code. When in doubt, follow this doc over your own instincts.

---

## 1. What this is

An in-depth interactive explainer about **piano inharmonicity**, published as a project page on studiodemby.com. Prose sections interleaved with interactive audio/visual React components, in the same MDX pattern as every other project on the site.

The narrative arc (in page order):

1. **Beats**—how piano tuners measure pitch with their ears. Two nearly-equal frequencies interfere and produce a slow audible throb; the ear can't hear 1 Hz of melodic difference but trivially hears a 1-beat-per-second wobble. Beats are pre-electronic precision measurement.
2. **Temperament**—you can't tune all twelve fifths pure (twelve pure fifths overshoot seven octaves by ~23.5 cents, the Pythagorean comma). Brief tour: meantone → well temperaments → equal temperament (every fifth ~2 cents narrow, every major third ~13.7 cents wide and fast-beating). Aural tuners set a "temperament octave" in the middle of the piano using memorized beat-rate relationships. **Keep this section short**—one interactive, a few paragraphs. It exists to motivate beats and ET, not to be a temperament treatise.
3. **Inharmonicity**—the twist. Real string partials are NOT at f, 2f, 3f… They land progressively sharp because piano wire is stiff. All those textbook beat rates are therefore wrong on a real piano. Core physics, the coefficient B/b, why bass strings are copper-wound, why small pianos sound worse.
4. **Stretch & the machine era**—octaves are tuned by eliminating beats between *coincident partials* (2:1, 4:2, 6:3 levels), so sharp partials force stretched octaves. The Railsback curve. Modern electronic tuning devices (ETDs: CyberTuner, Verituner, etc.) sample a few notes, measure partials via FFT, fit a B curve across all 88 keys, and compute a bespoke stretched tuning per instrument. Closing note: inharmonicity is not a defect—mild inharmonicity gives the piano its warmth, and stretched octaves sound *better* to human ears.

**Decisions already made (do not relitigate):**
- Lives in the Studio Demby site (this repo), as an MDX project page.
- Math depth: formulas shown, gently. Show fₙ = n·f₀·√(1+Bn²) and walk through it in plain language. No derivations of the stiff-string wave equation.
- Method/structure reference: Mario Igrec, *Pianos Inside Out*, tuning chapter (see §8 Sources). Follow his pedagogical approach; NEVER copy his text or figures.
- Multi-session build in phases (§6). Do not attempt the whole thing in one session.

---

## 2. Repo integration (exact steps)

Read the repo root `CLAUDE.md` first—all of its rules apply. Key touchpoints:

| What | Where |
|---|---|
| Page content | `content/projects/inharmonicity.mdx` (create) |
| Interactive components | `app/components/mdx-blocks/inharmonicity/` (create dir; one file per component) |
| Component registration | `app/components/utils/ClientMDX.tsx`—add an import and an entry in the components map, same as `PetrolNoise` / `GrainRain` |
| Shared audio/math helpers | `app/components/mdx-blocks/inharmonicity/lib.ts` |
| Unit tests | `tests/` (vitest; see §7) |

**MDX frontmatter** (copy the shape from `content/projects/petrol-noise.mdx`):

```yaml
---
title: "PLACEHOLDER—user writes this"
slug: inharmonicity
summary: "PLACEHOLDER—user writes this"
image: /photos/inharmonicity/inharmonicity.png   # create later
date: "2026-07-08"        # quoted, zero-padded ISO—unquoted dates break Safari/schema
tags:
  - interactive
  - music
  - audio
  - explainer
categories:
  - music
  - teaching
---
```

**Component conventions** (match `PetrolNoise.tsx`):
- `"use client"` at top of every interactive component.
- React function components, TypeScript, hooks (`useRef` for mutable audio state, `useState` for UI state, `useEffect` with cleanup).
- Tailwind for styling. Range sliders get correct mobile touch targets automatically from a global CSS rule—do not set slider heights yourself.
- Any `<a>` inside MDX needs `!text-…` + `no-underline` to escape the `.prose a` override (see repo CLAUDE.md).

**Hard rules from the user (violating these is a failed session):**
- **Creative copy is the user's.** Never write summaries, whisper lines, FieldNotes, titles, or flavor text—leave `PLACEHOLDER` markers. *Explanatory* prose (the actual physics/history explanation) IS Claude's job and belongs in the MDX body.
- Em dashes never have surrounding spaces: `word—word`.
- Always `rm -rf .next && pnpm build` before any commit; never commit type errors.
- Visual feedback from the user ("too big", "too fast") → conservative adjustment, expect 2–3 refinement rounds.
- Mobile-first: `min-width` media queries only; never `100vh` (use `100dvh`); test at 375 / 768 / 1440 px.

---

## 3. Physics & tuning reference sheet

Everything the prose and components need. Trust this section; it was checked against Igrec's chapter and standard acoustics literature.

### 3.1 The core formula

An ideal flexible string has partials at exactly fₙ = n·f₀. A real (stiff) wire has:

```
fₙ = n · f₀ · √(1 + B·n²)
```

- **B** is the inharmonicity coefficient, dimensionless, per string. Typical range ~0.00005 (long bass core wire) to ~0.025 (short treble strings).
- B ≈ π³·E·d⁴ / (64·ℓ²·T) for plain wire: E = Young's modulus, d = diameter, ℓ = speaking length, T = tension. The takeaways to explain: B grows with the **4th power of diameter** and falls with the **square of length**. Hence: longer piano = lower B = cleaner sound; bass strings are copper-**wound** to add mass without adding core stiffness; the worst spot is often the tenor/bass break.
- Two conventions exist. Igrec (and some tuner literature) uses lowercase **b** where the sharpening of partial n in **cents** ≈ b·n². The physics **B** relates via cents ≈ (600/ln 2)·B·n² for small B, so **b ≈ 865.6·B**. The page should use B (physics convention) in formulas and mention b in a footnote. In code, helpers should accept B.
- Equivalent frequency form used in code: `fn = n * f0 * Math.sqrt(1 + B * n * n)`.

### 3.2 Real measured data (1923 Steinway A, 6'4", from Igrec Table 4)

Use this as the built-in "real piano" preset. Values are Igrec's b (cents = b·n²); B = b/865.6.

| Note | f₀ (Hz) | b (Igrec) | B (physics) |
|---|---|---|---|
| A0 | 27.5 | 0.370 | 0.00043 |
| A1 | 55 | 0.160 | 0.00018 |
| A2 | 110 | 0.055 | 0.000064 |
| A3 | 220 | 0.210 | 0.00024 |
| A4 | 440 | 0.707 | 0.00082 |
| A5 | 880 | 2.294 | 0.00265 |
| A6 | 1760 | 6.484 | 0.00749 |
| A7 | 3520 | 21.561 | 0.02491 |

Notable facts to cite in prose: A4's 8th partial is ~45 cents sharp; A7's 3rd partial is ~345 cents sharp (more than a minor third!); the dip at A2 then jump at A#2 is the wound/plain break (Igrec: A2 wound b=0.055 vs A#2 plain b=0.155 at nearly the same length → negative stretch, hard to tune). Note B is NOT monotonic across the keyboard—it dips in the tenor and rises steeply in the treble; bass values are erratic because winding is imprecise.

### 3.3 Beats

Two tones at f and f+Δ produce audible loudness pulses at Δ per second. Tuners tune intervals by adjusting until beats between *coincident partials* slow to a target rate (or stop). Example: an octave A3–A4 beats between A3's 2nd partial (2×220·√(1+4B)) and A4's 1st partial. Cents ↔ frequency: `cents = 1200·log2(f2/f1)`; beat rate between nearly-equal frequencies = |f2−f1| Hz.

### 3.4 Equal temperament numbers

- Semitone ratio 2^(1/12); fifths narrow by ~1.955 cents (beat ~0.4–0.8 bps in the temperament octave); major thirds wide by ~13.686 cents, beating ~7 bps around middle C and speeding up as you ascend—ascending contiguous M3s should form a smooth accelerating ramp (a classic aural check).
- Pythagorean comma ≈ 23.46 cents. Syntonic comma ≈ 21.51 cents (pure M3 is 5:4 = 386.3 cents vs ET 400).
- For the temperament comparison interactive: pure P5 = 702.0¢, ET P5 = 700¢; pure M3 = 386.3¢, ET M3 = 400¢; quarter-comma meantone M3 = 386.3¢ (pure) with P5 = 696.6¢.

### 3.5 Octave levels & stretch

Octaves are tuned at "levels": 2:1 (lower note's 2nd partial vs upper's 1st), 4:2, 6:3, 8:4. With inharmonicity these levels disagree—a beatless 4:2 octave leaves 2:1 slightly wide and 6:3 slightly narrow. Which level to prioritize varies by register: treble octaves work at 2:1 (upper partials die instantly up there); midrange typically 4:2. If the upper note's B ≈ 4× the lower note's B, the levels coincide and octaves can be exceptionally pure—good scale design aims for smoothly matched inharmonicity curves. Stretch compounds: tuning outward octave by octave from the middle accumulates sharpness in the treble (up to +30¢ at C8) and flatness in the bass (−30¢ at A0)—that S-shape is the **Railsback curve** (O.L. Railsback, 1938, measured on real pianos with a stroboscope).

Extra treble stretch is also *psychoacoustic*: humans perceive very high pitches as flatter than they are, so tuners sharpen the top beyond what inharmonicity alone demands.

### 3.6 Igrec's aural method (model for the "how tuners work" prose + OctaveLab)

- Set A4 to a fork (A440). Set a **temperament octave** (roughly F3–F4/A3–A4 region) with a strip mute.
- Simple sequence: fourths and fifths around the circle—from A4 tune D4 (P5 down), A3 (P4 down), check octave A3–A4; then chain P4s-up/P5s-down: G4, C4, F4, A#3, D#4; then from A4 the other direction: E4, B3, F#4, C#4, G#4; final check D#4–G#4 P4 should beat under ~1 bps. If it's too fast/slow, distribute corrections around the circle.
- Then tune octaves chromatically outward to both ends, unisons last, verifying with test intervals (M3/M10 tests, contiguous M3 ramps).
- Bass: listen for slow "woo-woo" beats among low coincident partials, ignore the jangle of high partials.
- ETD workflow: measure a few notes' partials per section → device estimates b per note → fits a smooth curve across the keyboard → computes target frequencies with appropriate stretch; tuner still sets unisons and stability by hand, and the best finish by ear.

---

## 4. Interactive components (specs)

Six components, listed in **page order**. Build order differs—see §6. Shared helpers in `lib.ts`: `partialFreq(f0, n, B)`, `centsBetween(f1, f2)`, note-name↔frequency utilities, the Steinway preset table, and the shared-AudioContext module (§5).

Every component: works with mouse AND touch, renders sensibly at 375px, no audio until a user gesture, all audio stops on unmount and when another component starts playing (simplest: a tiny event bus or shared `stopAll()` in the audio module).

### 4.1 `BeatsExplorer` (section 1)

Purpose: feel what a beat is and that beat rate = frequency difference.
- Two sine oscillators. Tone A fixed at 220 Hz. Tone B draggable 210–230 Hz via slider.
- Play/stop button. Big readout: "Δ = 2.0 Hz → 2 beats per second."
- Canvas: the summed waveform's envelope "breathing" in real time (draw analytically from the two frequencies—do NOT use AnalyserNode; drawing `|cos(π·Δ·t)|` envelope over a carrier is smoother and always legible).
- Acceptance: at Δ=0 the sound is steady; at Δ=1 you hear one throb/second and see the envelope pulse once/second; slider feels smooth (update oscillator frequency via `setTargetAtTime`, no clicks).

### 4.2 `TemperamentLab` (section 2, deliberately small)

Purpose: hear why equal temperament was a compromise.
- One interval/chord selector (P5, M3, major triad) × three tuning buttons (Pure / Quarter-comma meantone / Equal). Cent values in §3.4.
- Play sustained chord with ~4 harmonic partials per note (pure sines sound too thin to judge; harmonic partials make the beating obvious).
- Readout of the cent deviations + expected beat rate.
- Acceptance: pure M3 sounds still, ET M3 audibly churns (~7 bps around middle C). No visualization needed beyond the numbers—keep it lean.

### 4.3 `StringModes` (section 3)

Purpose: the "wiggles" visual—modes of a vibrating string and how stiffness sharpens the high ones.
- Canvas animation: a string vibrating in mode n (standing wave), n selectable 1–8. Optionally "all modes" summed.
- Toggle: **Ideal string** vs **Stiff string**. In stiff mode, each mode's oscillation frequency is multiplied by √(1+Bn²) with an exaggerated B (~0.02) so the sharpening is visible as mode-n visibly outpacing where the ideal would be; show a ghost of the ideal-string motion for comparison.
- Readout: fₙ ideal vs actual, deviation in cents.
- No audio required (audio lives in 4.4). Keep frame rate cheap: one `requestAnimationFrame` loop, plain 2D canvas, `pixelDensity`-style scaling by `devicePixelRatio` capped at 2.
- Acceptance: at n=8 with stiff mode on, the phase drift vs the ghost is obvious within ~2 seconds of watching.

### 4.4 `InharmonicSynth` (section 3)—**the centerpiece, build first**

Purpose: HEAR inharmonicity morph a tone from organ-like to piano-like to clangy, and SEE partials slide off the harmonic grid.

**UI philosophy (learned the hard way in Phase 1—applies to EVERY component in this project):** a first-time reader must understand what to do in two seconds. One obvious play affordance, one dial, plain-language labels, zero jargon on buttons. Do not expose internal state (coefficients, notation, axis modes) as controls; the surrounding prose carries the theory. The first version of this component had 12 controls ("STRIKE", "A/B: IDEAL VS REAL", note selector, preset chips, axis toggle, `B = 0.00800 (b ≈ 6.92)` readouts) and the user found it incomprehensible. The rebuilt version below is the standard to match.

- Single note: A3 (220 Hz). No note selector—register differences are later components' job.
- Additive synth: ~20 partials, each an `OscillatorNode` (sine) + `GainNode`. Frequencies from `partialFreq(f0, n, B)`. Skip partials above ~10 kHz.
- One **"▶ play" button**; clicking the spectrum chart also plays. A "▶ tap to listen" nudge is drawn on the canvas until first play.
- One **"string stiffness" slider** (cubic-mapped, 0 → 0.02) with clickable landmark labels rendered on the track: "perfect string" (0), "1923 Steinway" (0.00024, the measured A3), "small upright" (0.0035), "bell?" (0.02). Landmarks replace preset chips; clicking one sets the value and plays.
- **The slider replays the note on release** (pointerup/keyup)—comparison happens by dragging and listening, so no A/B button is needed.
- Strike envelope (this is what makes it sound piano-like rather than organ-like): per-partial gain `1/n^1.2`, attack ~3 ms, exponential decay with time constant `τₙ = 4 / (1 + 0.6·n)` seconds at A3. Retrigger on each press.
- Spectrum view (canvas): vertical lines at each partial's frequency, drawn analytically (never AnalyserNode—we know the exact frequencies, and FFT resolution at low f is poor). Faint full-height comb at exact n·f₀; in-chart legend in plain words ("the string's overtones" / "where they should be"). Linear axis only.
- Below the chart, a one-line plain-language readout: "overtones perfectly in tune…" at 0, else "the 8th overtone lands N¢ sharp…". Hover/tap a bar for per-overtone Hz and cents.
- Acceptance: B=0 sounds like a cheesy organ tone; B≈0.0004 with the strike envelope sounds recognizably piano-ish; B≥0.01 sounds clangy/bell-like. The spectrum shear is visible on a phone screen. A first-time user can operate it with no instructions beyond what's on screen.

### 4.4b `RealPianoSpectrum` (section 3, directly before the synth)—the ground truth

Purpose: prove the phenomenon on a REAL piano before the reader touches the model. Plays an actual recorded note and shows its measured spectrum with the harmonic comb overlaid—the partials visibly sit sharp of the grid, and a fitted B is displayed. This is exactly what an ETD does, which foreshadows section 4.

- Source: **Salamander Grand Piano** (Yamaha C5, Alexander Holm, **CC-BY 3.0—attribution line required on the page**), mono MP3s in `public/audio/inharmonicity/` (`salamander-a3.mp3` primary, `salamander-a1.mp3` spare for a possible bass demo). Fetched lazily, decoded via `OfflineAudioContext` (no user gesture needed for decode; playback still goes through the shared engine on gesture).
- Analysis (in-browser, once, after decode): Hann-windowed FFT (~4 s of sustain, zero-padded to ≥2^17), peak-picking near each n·f₀ with parabolic interpolation, then a joint least-squares fit of f₀ and B (iterate: B from `(fn/(nf₀))²−1 = Bn²`, then f₀ from the model). Verified offline: A3v10 gives f₀ ≈ 220.13 Hz, B ≈ 0.000209 (b ≈ 0.18—nearly the same as Igrec's 1923 Steinway A3, b = 0.21; use this coincidence in the prose), partial 8 ≈ +10.5¢, partial 16 ≈ +46¢. Note: the measured 2nd partial can read ~−1.5¢ against a naively-anchored f₀ (three unison strings beat and pull peaks), which is why the joint fit matters.
- UI (per the §4.4 minimalism standard): one "▶ play the recording" button (canvas tap also plays), the measured magnitude curve in coral with the fitted harmonic comb in gray, hover/tap a partial for Hz + cents, one plain-language readout line including the fitted B. No other controls.
- FFT and fit live in `fft.ts` / `analysis.ts` with unit tests against synthetic signals of known f₀/B.
- Acceptance: readout shows B within ~15% of 0.00021 for the A3 sample; comb-vs-peak drift is visible by partial ~8 on a phone; recording plays and stops cleanly alongside the synth (shared `stopAll`).
- **v2 (asterisk, not now): resynthesis.** Extract per-partial amplitude + decay from the recording and drive the additive engine with measured data, so the synth keeps its adjustable B but inherits the real note's spectral envelope. Revisit after the full page exists.

### 4.5 `OctaveLab` (section 4)

Purpose: discover that a beatless octave is NOT at exactly 2:1 on a real piano.
- Lower note fixed: A3, B from Steinway preset (0.00024), sounded with ~8 decaying partials.
- Upper note A4 (B=0.00082, ~6 partials): a fine-tune slider ±30 cents around the 2:1 point, cents readout.
- Both notes sustain together (or auto-retrigger every 2 s). Beat-rate readouts for the 2:1, 4:2, and 6:3 coincident-partial pairs, computed analytically and displayed live; highlight whichever pair beats slowest.
- Guided goal text: "drag until the beating stops." The beatless-4:2 point lands a few cents wide of a pure 2:1—show a marker at true 2:1 so the user sees they've tuned sharp of it, and that the three levels can't all be zero at once.
- Acceptance: audible beats slow and stop near the predicted stretched point, not at 0¢.

### 4.6 `VirtualTuner` (section 4, most ambitious—build last)

Purpose: simulate what CyberTuner/Verituner do.
- Step 1 "Sample": user taps 4–6 keys on a mini keyboard (e.g. A0–A7 subset); each plays the synth tone and shows "measured" partials appearing (simulated measurement of the preset piano + slight noise).
- Step 2 "Fit": scatter-plot the measured B values vs key number, animate a best-fit smooth curve through them (fit `log B` with a low-order polynomial/two-segment fit—B spans decades, never fit linearly; bass points get noise to echo Igrec's "bass is unpredictable").
- Step 3 "Tune": from the fitted curve compute a stretched tuning across all 88 keys (octave-level matching, 4:2 in midrange, 2:1 top; simple iterative outward pass from A4 is fine) and plot deviation-from-ET in cents vs key—the Railsback curve emerges. Overlay the classic measured Railsback shape for comparison.
- Optional payoff: play a wide chord (e.g. A2+A4+A6) "unstretched ET" vs "stretched," hear the stretched one sound cleaner.
- Acceptance: fitted curve visibly S-shaped in the final plot: bass ~−20…−30¢, treble ~+20…+30¢. Unit-test the fit + stretch math (see §7).

---

## 5. Web Audio implementation guide

One shared module, e.g. `inharmonicity/audio.ts`:

- **Lazy singleton AudioContext**, created inside the first user-gesture handler (iOS Safari refuses otherwise). Always `await ctx.resume()` in the gesture handler before scheduling.
- Chain: per-component gain → shared master `GainNode` (≈0.15—twenty summed oscillators clip fast) → `DynamicsCompressorNode` (safety net) → destination, plus a parallel wet path through a `ConvolverNode` (synthetic IR: ~0.9 s exponentially decaying noise, wet ≈0.15).
- **Piano-likeness requires more than sines + decay** (a bare additive bank sounds like an organ patch). `strikeNote()` layers: (1) a hammer thump—short lowpassed noise burst; (2) **two unison "strings" detuned ±~0.35 cents** whose partials beat slowly, giving chorusing and a two-stage decay; (3) sub-ms random start jitter per partial so the attack isn't phase-coherent; (4) a strike-position comb in `partialAmp()` (hammer at ~1/8 suppresses partials near n = 8). Keep `partialAmp`/`decayTau` in `lib.ts`—the spectrum canvas reads the same functions.
- Per-note voice = array of `{osc, gain}`; start all oscillators at `ctx.currentTime + 0.01`; envelopes via `gain.gain.setValueAtTime` + `linearRampToValueAtTime` (attack) + `setTargetAtTime` (exponential decay; do NOT use `exponentialRampToValueAtTime` to 0—it can't reach 0).
- Slider-driven frequency changes: `osc.frequency.setTargetAtTime(f, ctx.currentTime, 0.02)`—never set `.value` directly while playing (zipper noise).
- Stop = ramp gain to 0 over ~50 ms, then `osc.stop(ctx.currentTime + 0.1)`; keep a `stopAll()` registry so components silence each other.
- Cleanup in `useEffect` return: stop voices, disconnect nodes. Do not close the shared context (other components use it).
- **Never trigger window.alert/confirm** (breaks automation), never `setInterval` for audio timing.

Canvas guidelines: 2D context, size from `clientWidth` (never `clientHeight`—Safari aspect-ratio bug, see repo CLAUDE.md), scale by `min(devicePixelRatio, 2)`, one rAF loop per mounted component, cancel on unmount.

---

## 6. Build phases (one session ≈ one phase; finish and verify before moving on)

| Phase | Deliverable | Done when |
|---|---|---|
| **P1** | `lib.ts` + `audio.ts` + `InharmonicSynth`, registered in ClientMDX, on a stub `inharmonicity.mdx` page with placeholder frontmatter | §4.4 acceptance passes; unit tests for `partialFreq`/cents pass; verified in browser at 375/768/1440; `pnpm build` clean |
| **P2** | `BeatsExplorer` + `StringModes` | §4.1 + §4.3 acceptance; build clean |
| **P3** | `OctaveLab` + `TemperamentLab` | §4.5 + §4.2 acceptance; build clean |
| **P4** | `VirtualTuner` | §4.6 acceptance incl. fit unit tests; build clean |
| **P5** | Full explanatory prose in MDX around all components, footnotes, section flow, mobile pass, OG image, user reviews copy placeholders | Page reads end-to-end; user has filled/approved creative copy; final build clean |

Each phase: follow the repo's autonomous visual-refinement loop (screenshot via Playwright/Chrome MCP, self-evaluate, ≤4 iterations before surfacing). Audio can't be screenshot—verify audio acceptance criteria by reasoning + the analytic readouts (beat-rate numbers on screen), and flag anything you couldn't hear-test for the user to confirm by ear.

**Page wireframe (agreed, mobile-first, single column—interactives are full-width blocks in the prose flow):**

```
[page]
  [hero-title]
  [prose: intro—what tuning actually is]
  [beats-explorer]
  [prose: beats as measurement]
  [temperament-lab]
  [prose: temperament → ET, the setup for the twist]
  [string-modes]
  [prose: stiffness physics, the formula walkthrough]
  [inharmonic-synth]
  [prose: B across the piano, wound strings, small pianos]
  [octave-lab]
  [prose: stretch, octave levels, Railsback]
  [virtual-tuner]
  [prose: the machine era; coda—inharmonicity as character]
  [collapse-metadata]
```

No component needs a two-column desktop layout; at ≥768px components simply get more generous canvas heights and side-by-side control rows (`min-width` queries only).

---

## 7. Testing

Per the user's testing philosophy: unit-test **core math only**, no UI/component tests, no mocking Web Audio.

Worth testing (vitest, `pnpm test -- --run`):
- `partialFreq`: B=0 gives exact harmonics; known Steinway values reproduce Igrec's cent deviations within tolerance (e.g. A3 b=0.21 → 3rd partial +1.89¢, 8th +13.4¢; A4 8th ≈ +45¢).
- `centsBetween` round-trips with frequency ratios.
- VirtualTuner fit: recovers a synthetic B curve from noisy samples; stretch output is monotonic-ish and S-shaped (behavioral bounds, not exact values).

---

## 8. Sources

- Salamander Grand Piano V3 (Alexander Holm)—Yamaha C5 samples, CC-BY 3.0, https://github.com/sfzinstruments/SalamanderGrandPiano. **Attribution required on the published page** (Phase 5: add to CollapseMetadata).
- Mario Igrec, *Pianos Inside Out* (2013), Chapter 4 "Tuning". Free 6-page sample: https://www.pianosinsideout.com/tuning.pdf (re-download if needed; contains the inharmonicity section, Table 4 data, Figure 214 on octave levels, and the Lesson 7 temperament sequence). **Reference only—no copied text or figures.** Igrec's supporting data: http://www.pianosinsideout.com/bonus
- O.L. Railsback (1938)—stretched-tuning measurements; "Railsback curve".
- Robert Young, "Inharmonicity of Plain Wire Piano Strings" (1952)—the B formula.
- Background works cited by Igrec: Daniel Levitan, *The Craft of Piano Tuning*; W.V. McFerrin, *The Piano: Its Acoustics*.

## 9. Open items (ask the user, don't decide unilaterally)

- Final title, summary, and all creative copy (user writes; see §2 hard rules).
- Hero image / OG image concept (Phase 5).
- Whether the temperament section should also demo a well temperament (currently: pure/meantone/ET only, for scope).
