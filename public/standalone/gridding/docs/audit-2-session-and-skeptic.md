# Gridding—UX audit, pass 2

Two lenses that pass 1 structurally could not reach. Pass 1 was a heuristic
inspection of a static artifact—every finding in it was derivable from a
screenshot. These two are not.

Status: observations only. Nothing in `src/` has been changed.
Date: 2026-09-03

---

# Lens 1—The practice session

Frame: twenty minutes at the piano. Phone propped on the music stand at roughly
70cm. Both hands occupied. Measurements below are real, taken from the running
page at a 375px viewport; physical sizes assume an iPhone 13 (390pt across
~64mm, so 1 CSS px ≈ 0.165mm).

### 0:00—Setup

Nothing prevents the screen sleeping. iOS auto-lock is 30s–2min by default. You
will be waking the device roughly every other drill, with whichever hand is
least busy.

### 0:30—Reading it from the bench

| Element | CSS px | Physical | Visual angle at 70cm |
|---|---|---|---|
| Grid cell | 18.6 | 3.06mm | 15.0 arcmin |
| Ruler glyph (`1 e & a`) | 10 | 1.65mm | **8.1 arcmin** |

Acuity limit is ~5 arcmin; comfortable sustained reading wants 16–20. The cells
survive as blocks. **The ruler does not.** You cannot read the counting row at
playing distance without leaning in—and the counting row is precisely the
information that tells you *where in the beat* the pattern sits. The tool's
central fact is set in its least legible type.

### 0:45—Telling the two hands apart

Contrast ratios, measured:

| Pair | Ratio |
|---|---|
| Ostinato lit vs unlit cell | 8.06 ✓ |
| Pattern lit vs unlit cell | 8.05 ✓ |
| **Ostinato vs pattern** | **1.00** |

The gold and the cyan have *identical relative luminance*. I picked them by eye
and landed on a perfect match by accident. Consequence: colour is not merely the
primary channel separating the two hands—it is the **only** channel. Desaturate
the screen (night mode, a dimmed display, sunlight, a colour-blind reader, a
photocopy) and the two lanes become the same row.

This is the single worst defect found in either pass, and it is invisible in
every screenshot I took, because I was looking at them in full colour on a bright
monitor.

### 2:00—Advancing to the next drill

Both hands are on the keys. Advancing requires stopping, reaching out, and
hitting a target.

| Target | Size | iOS min (44pt) | Android min (48dp) |
|---|---|---|---|
| Ostinato cell | 20 × 20 | **45%** | 42% |

The primary editing interaction is under half the minimum touch target. With
sticks in hand—your "works for drummers too" case—it is unusable.

More fundamentally: **every interaction in this tool assumes a free hand.** That
assumption was never stated and never tested. It is the load-bearing one.

### 5:00—Which have I already done?

Six chips. Nothing distinguishes played from unplayed. To work through the set
systematically you need a pencil and paper beside the device, which is a fair
description of the problem the tool was meant to solve.

### 8:00—Am I actually in time?

No sound, no tempo, no playhead. For the phasing cases this is severe: a 3-cell
slip against 4/4 takes three bars to resolve, losing your place is the *default*
outcome, and nothing in the tool can catch you. You are reading a rhythm you
cannot hear, at a tempo the tool has no opinion about.

### 15:00—Changing subdivision

At an iPhone SE viewport (667px tall), with a 3-bar cycle drawn:

- Page height: **1410px**
- Controls end at 477; grid runs 505–886; chips start at 1155

The grid and the controls that drive it are never simultaneously visible. Neither
are the grid and the chip library. Changing anything is scroll → adjust → scroll
back → discover it wasn't what you wanted.

### Session findings, ranked

1. **Two lanes share identical luminance.** Colour is the only channel. (Critical)
2. **Every interaction assumes a free hand.** Untested load-bearing assumption. (Critical)
3. **Ruler is illegible at playing distance.** 8 arcmin. (High)
4. **Tap targets at 45% of minimum.** (High)
5. **No tempo, sound, or playhead**—cannot self-verify. (High)
6. **No progress tracking** across the drill set. (Medium)
7. **Screen sleeps** mid-practice. (Medium)
8. **Grid and its controls never co-visible** on a small phone. (Medium)

---

# Lens 2—The skeptic

**Question: does this need to be an application?**

### The material is small

Tile-mode distinct drills equal `C(k, j)` exactly. Summed over pattern lengths
2–6, excluding the empty and all-onsets degenerate cases:

| k | 2 | 3 | 4 | 5 | 6 | total |
|---|---|---|---|---|---|---|
| drills | 2 | 6 | 14 | 30 | 62 | **114** |

At twelve systems to a page that is **≈10 printed pages**. The complete corpus
of the exercise, for every pattern length anyone would practice, is a thin
booklet. This is not a large-content problem.

### What does the app do that paper doesn't?

| Capability | Paper | App today |
|---|---|---|
| Show the grid, both hands, all displacements | ✓ | ✓ |
| Legible at 70cm | ✓ | ✗ (measured above) |
| Usable with no free hand | ✓ | ✗ |
| Survives a dimmed screen | ✓ | ✗ (luminance 1.00) |
| Doesn't sleep | ✓ | ✗ |
| Explore parameter space quickly | ✗ | ✓ |
| Play sound / keep tempo / show a playhead | ✗ | not built |
| Track progress / quiz you | ✗ | not built |

**As built, the app's capability set is a strict subset of paper's, minus four
things paper does better.** Every advantage a screen could have—sound, tempo,
a moving playhead, memory—is unbuilt. That is the honest reading and it is not
comfortable.

### But this is not an argument for deleting it

The parameter space is too large to print exhaustively—114 drills times several
meters times two slip modes. You don't want a fixed booklet; you want to generate
*this week's sheet*. That is a real job, and it is the job the app is currently
good at.

So the tool is not a practice surface that happens to be printable. It is a
**generator whose output is paper**.

### The reframe

Two artifacts, two contexts, two sets of rules:

| | **Generator** | **Sheet** |
|---|---|---|
| Where | desk, browser | music stand |
| Hands | free | occupied |
| Interaction | full | none |
| Optimise for | exploration, parameter clarity | legibility at 70cm |
| Exists today | yes | no |

### What follows if you accept it

1. **Print stops being roadmap item #7 and becomes the point.** The interactive
   page is the input form; the sheet is the deliverable. That inverts the build
   order set in the first conversation.
2. **Most session findings relocate rather than disappear.** Tap targets, screen
   sleep, and co-visibility become desk problems (mild). Legibility and the
   luminance collapse become *sheet* requirements (critical)—a printed sheet is
   greyscale by default, where a 1.00 contrast ratio means the two hands are
   literally the same row of ink.
3. **Audio, tempo and playhead get cheaper to skip.** If the sheet is the
   deliverable, the metronome app you already own does that job. Building a
   scheduler, a transport and a playhead is a large piece of work whose main
   competitor is a free app that already exists.
4. **Progress tracking becomes a pencil.** On paper, that's correct and free.

### Honest update to pass 1

Pass 1 recommended cutting single-occurrence mode as excess conceptual surface.
Under the generator framing that recommendation **weakens**: a desk tool with the
user's full attention can afford modes that a practice surface cannot. I'd now
say keep it, but only once the labels name the exercise rather than the
mechanism.

The regrouping wireframe and the Studio Demby re-skin both stand—they apply to
the generator.

### The alternative path, stated fairly

The opposite conclusion is that the screen *should* be the practice surface, and
the answer is to build audio, a tempo control, a playhead, a wake lock, and a
big-mode display. That is a defensible product. It is also perhaps five times the
work of a print view, and it competes with every metronome app in existence.

**Recommendation:** the generator-plus-sheet framing. It is the smaller thing, it
matches how musicians actually work, and it reaches something usable at an
instrument sooner.

---

## If you only do three things now

1. **Fix the luminance collapse.** Two accents with genuinely different lightness,
   plus a second non-colour channel (shape, fill vs outline, or row position
   markers). One CSS change; fixes the worst defect in both passes.
2. **Decide the framing question** above before any more UI work. It reorders
   everything else.
3. **Set the ruler in something readable**—and if the sheet is the deliverable,
   size it for 70cm, not for a monitor.
