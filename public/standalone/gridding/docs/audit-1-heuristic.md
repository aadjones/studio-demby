# Gridding—UX audit

Status: observations only. Nothing in `src/` has been changed.
Date: 2026-09-03

---

## Summary

Seven of the eight findings below trace back to four structural causes. Fixing the
causes is cheaper than fixing the symptoms one at a time, and several of the
symptoms disappear for free.

Most of these are my errors, and they share a bias: I optimised the UI for
*explaining the combinatorics* rather than for *practicing the exercise*.

---

## Root causes

### A. There is no control hierarchy

Six controls sit in one undifferentiated card, but they operate at three
different rates:

| Level | Controls | How often you touch it |
|---|---|---|
| The grid | beats in the bar, cells per beat | once per session |
| The pattern family | pattern length, notes in pattern | once per exercise |
| The current drill | which shape, displacement | constantly |

They are presented as equals, and the ones you touch constantly are the furthest
from the thing they change. This single cause produces findings 2, 5, and 8, and
part of 1.

### B. Two lanes look identical but are ontologically different

The ostinato is **authored**—you draw it. The pattern is **derived**—the app
computes it from length/notes/displacement. They render as the same row of
squares, so the interface is lying about what you can touch. This is finding 4.

### C. The UI shows my reasoning instead of your information

"Naive count would be 24", the A/B rotation-family tags, the phrase "distinct
drills"—these are artefacts of the argument I was having about whether
displacement is redundant. That argument is settled. It does not belong on
screen. This is finding 3.

### D. The visual language is borrowed, not yours

Detail in finding 7.

---

## Findings

Ordered by how much they hurt, not by how easy they are.
Status added 2026-09-03 after the print/playhead build.

### 1. "How the pattern sits in the bar" is incomprehensible—HIGH

**Symptom:** the panel's purpose isn't guessable, and toggling it is disorienting.

**Diagnosis:** toggling changes three things at once with no explanation—the
displacement range silently jumps from 0–3 to 0–15, the number of drawn systems
changes, and the drill count changes. The labels ("Repeats to fill the bar" /
"Happens once, slides anywhere") describe the *implementation*, not the exercise.

These are really two different exercises: tiling is groove practice, single
occurrence is figure-placement practice. One radio group is making them look like
one setting.

**Options, cheapest first:**
- Cut single-occurrence mode for v1. It was my suggestion, you opted in before
  seeing it, and it doubles the conceptual surface for the less common exercise.
- Or: rename to name the exercise, not the mechanism, and show the consequence
  ("the pattern keeps going across the barline" vs "one figure, placed anywhere").

**My recommendation:** cut it. It can come back as its own mode later if you miss it.

### 2. Pattern controls are far from the pattern—HIGH

**Symptom:** pattern length and notes-in-pattern are in a panel above the grid,
separated from both the pattern lane and the shape chips they generate.

**Diagnosis:** root cause A. These two sliders exist *only* to filter the chip
list. They should be adjacent to it.

**Fix:** regroup by rate of change. See the proposed wireframe below.

### 3. Delete the naive count—HIGH, trivial—**DONE**

**Symptom:** "Whole family: 6 distinct drills (naive count would be 24)."

**Diagnosis:** root cause C. Nobody practicing cares what a wrong count would
have been. Worse, the correct number is already visible—it's the number of chips.

**Fix:** delete the entire counting block. Keep only the multi-bar sentence,
which is functional (it explains why there are three systems). Consider whether
the A/B tags survive; they teach something real, but the 12px grey hint
explaining them is doing weak work.

### 4. One lane is editable, one isn't, and they look the same—HIGH

**Symptom:** tapping the top row works, tapping the bottom row does nothing.

**Diagnosis:** root cause B. The pattern lane can't be hand-edited because it
would immediately desync from the shape/displacement controls that generate it.
That's a real constraint, but I hid it instead of expressing it.

**Options:**
- *Cheap:* make the difference visible. The authored lane gets a hover state,
  a pointer cursor, and a subtle inset; the derived lane is visibly flat/locked.
- *Better:* make both editable. Hand-editing the pattern deselects the chips and
  enters a "custom" state, the way a preset dropdown shows "Custom" when tweaked.
  More state, but it removes the constraint rather than labelling it.

**My recommendation:** cheap fix now, better fix when someone actually wants it.

### 5. Reset button is verbose and orphaned—MEDIUM, trivial

**Symptom:** "Reset the steady hand to the beat" lives in the footer, far below
the row it resets.

**Diagnosis:** root cause A again—proximity.

**Fix:** a small "Reset" control inline with the ostinato lane label. The label
already says which hand, so the button doesn't need to.

### 6. Over-built controls—MEDIUM, trivial

**Cut: DONE.**
- Sextuplets (`cellsPerBeat: 6`). Derivable as triplets at double tempo. Nobody
  is gridding sextuplets on a piano.

**Consider cutting:**
- Pattern length 7 and 8. These generate 7- and 8-bar cycles, which are correct
  but produce a wall of systems. Capping at 6 keeps the worst case at 3 bars for
  most meters.

**Keep:** odd meters (5, 6, 7 beats). Those are legitimate practice.

### 7. The design reads as generic AI output, not Studio Demby—MEDIUM

**Symptom:** it doesn't look like your work.

**Diagnosis:** it is close to the *inverse* of your actual design system, and
where it isn't inverse it's a near-miss, which is worse than a clean contrast.

| | Studio Demby | Gridding today |
|---|---|---|
| Ground | light warm `#F8F7F5` | dark `#12100e` |
| Display type | Outfit | system sans |
| Body type | Crimson Pro (**serif**) | system sans |
| Mono | JetBrains Mono | none |
| Accents | coral `#FF6B6B`, teal `#06B6D4`, violet `#8B5CF6`, amber `#F59E0B` | amber `#e8b04b`, cyan `#5ec8d8` |

The two accents I picked sit *near* your brand amber and teal without matching
them. That reads as sloppy rather than as a choice.

Specific tells that mark it as machine-default:
- Uppercase micro-labels with wide letter-spacing on every single control
- Uniform 4–6px radius on everything, no variation
- A bordered card containing an evenly-spaced grid of form controls
- No typographic voice at all—one font, one weight range, no serif

**Fix:** adopt the real tokens. Light ground, Outfit for the interface, Crimson
Pro for the explanatory prose, JetBrains Mono for the ruler and cell counts
(where tabular figures actually help). Pick two brand accents outright—coral for
the authored hand and teal for the derived one would be on-brand and higher
contrast than what's there.

### 8. Displacement is the wrong control for the core verb—MEDIUM

**Symptom (mine, not on your list):** the entire premise of the tool is "move the
slip *one cell* at a time", and that action is a drag-slider with 3 to 16 stops.
Sliders are bad at precise single increments and give no feedback about where you
landed musically.

**Fix:** a pair of nudge buttons (`◀ ▶`) with the position stated in musical
terms—"starts on the **e** of 1"—rather than "0 / 3". Keyboard arrows come free.

### 9. Printing is the point and the UI doesn't say so—HIGH

**Added 2026-09-03,** after the generator-plus-sheet reframe in pass 2 settled
what this tool is for.

**Symptom:** the print button sits at the bottom of the page, below the chip
list, styled identically to "All", "None" and "Reset the steady hand to the
beat". Nothing about the interface says the sheet is the deliverable.

**Diagnosis:** the layout still reflects the original premise—that the screen is
the practice surface and printing is an export. Pass 2 concluded the opposite:
the browser is a generator whose output is paper. The visual hierarchy never
followed the conclusion.

**Fix:**
- Print becomes the **only filled button on the page**. Everything else is
  quiet. Hierarchy does the explaining, not a label.
- It lives in a **sticky top bar**, so it is reachable from anywhere in the page
  including the bottom of a long chip list.
- It carries its live count (`6 drills · 1 page`) so the consequence is legible
  before you commit.
- The intro copy states the workflow in one line: build a sheet, print it,
  practice from paper.

---

## Also noticed

Smaller, not urgent:

- ~~**No sound.**~~ **DONE**—preview playhead with two clicks. For a rhythm tool this was the largest functional gap. Deliberately
  out of scope so far, but worth naming: everything above is about reading, and
  practice is about hearing.
- **Layout jolt.** Dragging pattern length can jump the page from 1 system to 8
  with no warning.
- **No URL state.** A drill can't be bookmarked, shared, or reopened—which also
  blocks the eventual "print this worksheet" goal.
- ~~**Triplet counting is wrong.**~~ **DONE**—now renders "1 trip let".
- **Drum-centric language.** "Steady hand" / "sliding hand" is pad vocabulary.
  For piano, left/right may read better—or let the labels be edited.
- **Chip selection resets** to the first shape whenever length or notes changes.

---

## Proposed regrouping

Not built. Structure only, for agreement before any layout CSS.

```
[page]
  [header]                    title + one line
  [setup]                     collapsed by default — beats, cells per beat
  [stage]                     the thing you look at while practicing
    [system]                  repeated per bar
      [bar-number]
      [ruler]
      [lane-authored]         + inline reset
      [lane-derived]
    [nudge]                   ◀ ▶ with musical position readout
  [library]                   pattern length + notes + the chips they generate
  [note]                      only the multi-bar explanation, nothing else
```

The move: `setup` recedes, `stage` and `nudge` become the centre of gravity, and
the two pattern sliders move down to sit with the chips they filter.

---

## Parked

- **Freemium joke.** Pretend there's a paid tier gating absurdly hypercomplex
  features (sextuplet grids, 13/8, nested tuplets). Recorded as a future idea,
  not designed.

---

## Status

| # | Finding | State |
|---|---|---|
| 1 | Mode panel incomprehensible | open—pass 2 revised this to *rename*, not cut |
| 2 | Pattern controls far from pattern | open |
| 3 | Naive count | **done** |
| 4 | Editable vs derived lanes look identical | open |
| 5 | Reset button verbose and orphaned | open |
| 6 | Over-built controls | sextuplets **done**; length cap open |
| 7 | Reads as AI output, not Studio Demby | open |
| 8 | Displacement is the wrong control | open |
| 9 | Printing not promoted | open |
| p2-1 | Lanes share identical luminance | **done on paper**; open on screen |
| p2-5 | No tempo or sound | **done** |
