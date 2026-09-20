# Clef Rake Explainer: Planning & Handoff Doc

**Status (2026-09-19):** Widget built, tested and ported. Page scaffold live at
`/work/clef-rake` (`status: draft` — unlisted, absent from the sitemap,
`noindex`). Branch `clef-rake-explainer`, two commits, not pushed. **The prose
is the entire remaining work, and Aaron writes all of it.**

**Audience for this doc:** any agent picking this up cold. Read it fully before
touching anything. When it conflicts with your instincts, follow the doc.

---

## 1. The hard rule

**Aaron writes every word of body text. Claude writes none.** Not the hook, not
the headings, not the "explanatory" prose — this is broader than the repo
CLAUDE.md rule, which only forbids *creative* copy. Stated directly:

> "don't write anything, just leave placeholders. or mark it easily changeable
> for me. i don't want your writing in general at least for the final version."

Note `docs/plans/inharmonicity-explainer.md` says the opposite ("Explanatory
prose IS Claude's job"). That doc predates this instruction. **This one wins.**

What Claude supplies instead: structure, headings as placeholders, and
*verified facts* (§4) for the prose to be written against. Never draft
sentences, not even as "a starting point."

---

## 2. What this is

A long-form explainer answering a kid's question: *why did I have to learn more
than one system for which notes sit on which lines?* Deliberately **not** a
historical deep dive — no neumes-to-Guido survey. The spine is conceptual:

contour → the full pitch ladder → take a five-line slice → different slices
land on different letters → why exactly seven → why only three symbols → the
seven historical clefs and which four survive → who still reads alto and tenor.

**Decisions already made — do not relitigate:**
- React components in `app/components/mdx-blocks/clef-rake/`, following the
  `inharmonicity/` pattern (pure `lib/` + vitest + React). **Not** the
  `pitch-clock` iframe pattern.
- Clef glyphs are deferred. The staff is marked with the plain letter of the
  note the clef names, at the identical position; real glyphs are the reveal in
  §7. Reason: "seven clefs, three symbols" confuses before it is explained.
- Instruments come **last**, not as mid-article motivation.
- **Section 2 shows no staff.** `<PitchLadder />` draws the ladder alone, with
  every C labelled identically — middle C included — so nothing acts as an
  anchor. Putting the five-line slice here would answer §3's question before it
  has been asked; the reader has to feel the ladder is too much *first*, which
  is what motivates grabbing a slice in §3. `PitchLadder` and `ClefRake` share
  `layout.ts` exactly, so §3 is visibly the same ladder with a staff on it, not
  a redrawing.
- The cream/navy/Fredoka palette stays as-is rather than adapting to site
  theming — it reads as an illustration. Revisitable.

---

## 3. Where everything is

| What | Where |
|---|---|
| Page content | `content/projects/clef-rake.mdx` |
| Components + pure logic | `app/components/mdx-blocks/clef-rake/` |
| Registration | `app/components/utils/ClientMDX.tsx` (import + map entry, done) |
| Tests | `tests/clef-{pitch,clefs,ledger,instruments}.test.ts` (58) |
| Prototype / dev harness | `~/Projects/music-staff` (separate repo, `main`) |

**The two copies are byte-identical by design.**
`music-staff/src/clef-rake/` mirrors
`studio-demby/app/components/mdx-blocks/clef-rake/` exactly, so syncing is `cp`
with no path rewriting. They drifted twice before this was enforced.

```bash
diff -rq ~/Projects/music-staff/src/clef-rake \
         ~/Projects/studio-demby/app/components/mdx-blocks/clef-rake
```

**Keep them in sync or explicitly retire one.** Editing only the studio-demby
copy is how the drift started. music-staff is useful because its Vite harness
isolates widget states via query flags (`?notches=1&solfege=1&instrument=1&marker=glyph`)
without a Next build.

---

## 4. Verified facts

Every one of these was **computed, not recalled**. Two of them corrected errors
Claude had already stated confidently in conversation. They are the raw material
for Aaron's prose, and most are pinned by tests.

1. **Every clef sign lands on the pitch it names.** F clef → F3, all C clefs →
   middle C (28), G clef → G4. True for all seven. This is why the letter marker
   and the real glyph can swap with nothing moving — both render at
   `signPitch(clef)`.
2. **The seven stops exhaust all seven bottom-line letters** — G B D F A C E —
   because a third is `+2` and `gcd(2,7) = 1`. An eighth stop repeats bass clef
   **two octaves** up (G2 → G4), not one: returning to the starting letter takes
   7 steps of 2 = +14 diatonic steps = two octaves. *(Claude first said "one
   octave"; the test caught it.)*
3. **The three symbols are a chain of fifths centred on middle C.** F3 → C4 →
   G4, gaps of 4 and 4 diatonic steps, perfectly symmetric. This answers "why
   only three symbols" and is the intended punchline. A descending fifth inverts
   to an ascending fourth, so "a fourth from middle C" is a natural but lopsided
   way to say it — the clef points at F3, not F4.
4. **The seven split 2 F / 4 C / 1 G.** Bass + baritone; tenor, alto,
   mezzo-soprano, soprano; treble. *(Claude first said "five C-clefs"; the test
   caught it.)*
5. **The conventional clef is a ledger-line minimum for 10 of 13 instruments.**
   Three exceptions, each explicable: guitar (treble clef is an
   octave-transposing convention), trombone (tenor genuinely wins up high, and
   trombonists use it), alto voice (historically alto clef, moved to treble).
   The honest claim is "clefs minimise ledger lines, except where transposition
   or convention overrode it."
6. **Four clefs survive; three are obsolete.**
   - Treble — violin, flute, oboe, clarinet, trumpet, horn, guitar (8vb), upper
     piano, most voices
   - Bass — cello, double bass, bassoon, trombone, tuba, lower piano,
     bass/baritone voice
   - Alto — viola, essentially its only full-time user (also alto trombone,
     viola d'amore)
   - Tenor — upper registers of cello, bassoon, trombone, euphonium, double bass
   - Obsolete: baritone, mezzo-soprano, soprano

   **The asymmetry is the good bit:** alto has exactly one full-time instrument;
   tenor has *none*. Tenor is a register-saving clef that instruments switch
   *into* mid-piece when the bass staff would need too many ledger lines — which
   is fact 5 showing up in live practice, not a historical curiosity.

Instrument range text is derivable from indices for 12 of 13 rows. Bassoon
deliberately reads `B♭1` where the index says `B1` (it sits on the B1 staff
position) — the one legitimate override, guarded by a test.

---

## 5. Article structure

Eight sections. Each has a real `##` heading (placeholder — rename freely) and a
visible `<Callout emoji="✍️">` slot holding the facts that section rests on.
Aaron deletes the Callout and writes in its place. A `🚧` box at the top explains
the convention and says to delete itself.

| # | Section | Widget |
|---|---|---|
| 1 | Contour | `<ContourFigure />` + manuscript crop |
| 2 | The ladder | `<PitchLadder />` — **no staff** |
| 3 | Grabbing a slice | `<ClefRake />` |
| 4 | Different slices, different letters | — |
| 5 | Why exactly seven | — (fact 2) |
| 6 | Why only three symbols | — (fact 3) |
| 7 | The seven clefs, and their real symbols | `<ClefRake marker="glyph" showNotches />` |
| 8 | Who still reads alto and tenor | `<ClefRake showInstrument showNotches />` |

---

## 6. Widget API

```tsx
<ClefRake
  marker="letter" | "glyph"   // default "letter"
  showInstrument={false}      // instrument picker, ranges, ledger lines
  showNotches={false}         // the seven clickable clef stops
  showSolfege={false}         // letters / Do-Re-Mi toggle
  className=""                // ClientMDX injects not-prose here — must be merged
/>
```

**Everything is off by default, on purpose.** Aaron's note: *"too many things
going on."* Controls appear only in the section that needs them. Notches are off
until §7 because their abbreviations (`Tr`, `S`, `Mz`…) name clefs, and the
article does not name clefs until §7. Dragging and the ▲▼ arrows move the staff
without any of them. With notches hidden the viewBox narrows to 300 so the staff
isn't sitting beside a blank column.

### Internals worth knowing before editing

- **Pitch is a diatonic index**, `octave*7 + step`; C1 = 7, middle C = 28.
  A staff line is `bottom + 2k`, a third is `+2`, line-vs-space is a parity
  check, and `yOf` is one affine map. **Do not "improve" this into MIDI numbers
  or `{letter, octave}`** — that turns thirds and staff positions back into
  lookup tables and roughly triples the code.
- **Paint order in the SVG is load-bearing**: notches, ladder, ledger lines,
  staff, marker, hint, notes, drag target. Reordering the JSX changes what
  overlaps what.
- `lib/` is pure — zero DOM, zero React. Keep it that way; it is what makes the
  tests fast and the component portable.

---

## 7. Traps already hit

Do not rediscover these.

- **`.prose` leaks unless the component merges `className`.** `ClientMDX`
  injects `not-prose` into every registered component, but the injection is
  inert if the component hardcodes its own `className`. TypeScript cannot catch
  it — `ClientMDX` casts to `any`. Now documented in the repo `CLAUDE.md`.
- **Background-dependent rendering must paint its own background.** `HaloText`
  knocks out to `var(--bg)`. The component declared the variable but relied on
  an ancestor to paint it, which the dev harness `body` happened to do; on the
  white site every label grew a cream fringe. `.clef-rake` now paints it.
- **The original prototype had no `<meta charset="UTF-8">`.** Served over HTTP it
  rendered `C3ã€"D5` and `â–²`. Opening via `file://` masked it. Fixed in the
  port; noted in `~/Projects/papercuts.md`.
- **pnpm 10 skips esbuild's postinstall**, which breaks Vite in music-staff. Use
  `"pnpm": { "onlyBuiltDependencies": ["esbuild"] }`, not the interactive
  `pnpm approve-builds`.
- **Playwright MCP writes screenshots relative to its own cwd**, which here is
  `~/Projects/music-staff/.playwright-mcp/` regardless of which repo you are
  working in. Look there when a screenshot "vanishes."

---

## 8. Verification

```bash
# studio-demby — 87 tests (29 pre-existing + 58 here)
pnpm test
pnpm kill-port && rm -rf .next && pnpm build     # never build over a live dev server
pnpm start                                        # then /work/clef-rake
pnpm content:status                               # clef-rake should appear under DRAFT

# music-staff — 58 tests, isolated widget states
pnpm test && pnpm typecheck
pnpm dev   # ?notches=1&solfege=1&instrument=1&marker=glyph
```

The tests assert *claims the prose will make*, not implementation details —
e.g. `expect([tally("F"), tally("C"), tally("G")]).toEqual([2, 4, 1])`. That is
deliberate: a data edit that changes what the article is allowed to say fails
loudly. Preserve that property when adding tests.

Glyph fidelity was proven by pixel-diffing `marker="glyph"` against the original
prototype: 1768 differing pixels of 337,500, all of them characters the original
mangled for want of a charset. If you touch `ClefSign.tsx`, re-run that check
against commit `7363c5a` in music-staff, which still contains the original file.

---

## 9. Open, deferred, and decisions for Aaron

- **§1's contour figure is not built.** Aaron chose a marked placeholder. It may
  need no interactive at all — decide when the prose exists.
- **§7 may want clef names on screen.** Currently only the notch abbreviations
  appear. A `showClefNames` prop is the obvious addition; not built.
- **Two copies of the component.** Decide whether music-staff retires to a
  prototype archive or stays as the dev harness.
- **Palette vs site theming.** Cream/navy retained; not yet reviewed against
  dark mode.
- **Branch is unpushed** and the page is `status: draft`. Publishing is one edit:
  flip `status` to `published` and delete this doc.

Related session memory (loads only for the music-staff project directory, so it
will *not* appear automatically when working here):
`~/.claude/projects/-Users-adj-Projects-music-staff/memory/`
