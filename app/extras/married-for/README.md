# Married For

A hidden extra at `/extras/married-for`: seven full-screen ways of measuring the time since Aaron and Anakaren's wedding (October 24, 2026, 4:30 p.m. Pacific, just after the ceremony). It isn't linked from the site, isn't in search results, and is in English and Spanish.

## Where it came from

It started as the countdown half of the wedding website ([aadjones/save-the-date](https://github.com/aadjones/save-the-date), savethedate-three.vercel.app), which also had a details page with hotels, directions, RSVP and gifts. At the moment of the wedding the countdown flipped to counting up.

On 2026-10-26 it moved here:

| Commit | What |
| --- | --- |
| save-the-date `c2be4ed` | Dropped the "Save the Date" wording, real weekend count, orbit marks the anniversary instead of the engagement. The last full version of the old site. |
| `cb75da7` | Ported here as an extra. |
| `e97058f` | Opening section kept its original sage. A warmer parchment was tried and rejected. |
| save-the-date `3e97eff`, `d009a8b` | The old site became one bilingual "we've moved" screen linking here. |
| `b0403e2` | Polish: visible page dots, textured moons, a context line in Social, clock opens on the anniversary hand. |
| `ea532fb` | Real equinox and solstice dates on the annual dial. |

The old site's details page and Venmo QR were not carried over. They're in that repo's history.

## Files

```
page.tsx              metadata (noindex) and the ARCHIVED switch
MarriedForClient.tsx  the full-screen shell: snap scrolling, header, page dots, arrows
constants.ts          TARGET_DATE, venue, conversion factors
designSystem.ts       per-section "vibes" (colors and fonts) and the page dots
i18n.tsx              language context and toggle
translations/         en.ts, es.ts, and the shared type
modules/              the seven sections, plus Tooltip
utils/                anniversary calendar file, maps link, equinox/solstice astronomy
```

The astronomy is tested in `tests/married-for-seasons.test.ts`.

## How it fits into Studio Demby

- **Full screen over the site.** Like Continental, it covers the site's nav and footer with a `fixed inset-0 z-50` layer instead of opting out of the root layout.
- **Browser-only rendering.** Every section depends on the current time and the visitor's time zone, so the page renders nothing on the server and draws after it mounts. Without this, server and browser output would differ and React would warn about the mismatch.
- **Fonts.** Cormorant Garamond is the base face, and Space Mono overrides the site's `--font-mono` *for this page only*, so `font-mono` classes keep their original look without touching the rest of the site.
- **No d3.** The old site drew the orbit and annual cycle with d3 and mounted each icon in its own React root. Here they're plain SVG in React, and the Lucide icons are positioned inside the SVG with `x`/`y`.
- **Tailwind is compiled at build time here** (the old site used the runtime CDN), so class names must appear in the source as complete strings. `getVibeClass` returns whole literal strings, which is why it works. Don't build class names by joining fragments.
- **Scrollbar hiding** uses arbitrary Tailwind classes (`[scrollbar-width:none] [&::-webkit-scrollbar]:hidden`), not a global utility.

## Behavior worth knowing

- **Everything counts from `TARGET_DATE`** in `constants.ts`. Several sections still contain their pre-wedding branches (countdown wording, the scrolling lunar timeline). They never run now, but they would if the date moved into the future.
- **Annual cycle.** `utils/seasons.ts` computes each equinox and solstice with Jean Meeus's algorithm (*Astronomical Algorithms*, ch. 27), to about a minute. Each quarter of the dial spans one real season, so the "you are here" line crosses an axis at the exact moment, and the labels show that year's dates in the venue's time zone.
- **Relative clock.** The sidereal-day hand is real local sidereal time at the venue's longitude. The red hand is progress to the next anniversary, and the clock opens on it.
- **The date in the header** downloads a yearly anniversary reminder (`.ics`). It has a fixed ID, so adding it twice updates the event rather than duplicating it.
- **Language** is remembered in `localStorage` (`married-for-locale`), and `?lang=es` forces Spanish.
- **Social holidays** are U.S. federal holidays in English and Mexican official holidays in Spanish.

## Tried and dropped

- **Growing the annual dial on phones by measuring its side labels.** The label font scales with the dial, so measuring changed the size, which changed the measurement, and it looped forever. It would also only have gained about a pixel. A noticeably bigger dial would mean moving the equinox labels inside the circle, where they would collide with "you are here" around each equinox.

## Open

- Anakaren to review the Spanish added during the move: `orbit.anniversary`, `social.weekend`/`meal`/`holiday`, `social.weekendsTooltipSince`, `social.footer`, `social.weekendDays`/`mealsEach`/`nextHoliday*`, `absurd.stressNoteMarried`, `app.calendarTitle`/`calendarDescription`/`calendarAriaLabel`.

## Hiding it

Set `ARCHIVED = true` in `page.tsx`; the route then returns 404.
