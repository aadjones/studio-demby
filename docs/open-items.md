# Open items

What's left after the October 2026 site audit, and things kept or deferred on purpose. The lasting
rules from that work live in CLAUDE.md; this is only what's still open or easy to forget.

## Yours to do

- **Lessons line on the homepage.** `lib/offers.ts` → `lessons.line` is placeholder wording borrowed
  from the lessons page subtitle ("Piano lessons emphasizing creativity and improvisation."). The
  Performance and Commissions lines, and all three link texts, live in the same file.
- **Music thumbnails.** Five of the first eight on /work are similar photos at a piano. Swapping in
  stills from the videos (or anything more varied) is a content choice.

## Deferred on purpose

- **YouTube click-to-load** (thumbnail first, player on click). The player is ~970 KB, about two
  thirds of a music page, and contacts Google's ad servers on every visit, but it doesn't slow what
  visitors see. Not done because on iPhones the first tap often only loads the player and a second
  tap plays it. Numbers and reasoning are in `app/components/mdx-blocks/VideoEmbed.tsx`.

## Kept on purpose (don't "clean up")

- `app/components/mdx-blocks/clef-rake/lib/ledger.ts`: no page imports it yet, but it's tested
  music-theory logic for the Clefs article.
- `public/photos/degradation/degradation.gif`: nothing references it, but it's the best remaining
  source of the Degradation crow loop (the original frames are lost). The site uses
  `degradation-loop.mp4`, made from it.

## Small, if ever

- The contact form reads `?inquiry=` with `useSearchParams`, so (like /work used to) the form isn't
  in the server HTML and appears after JavaScript loads. Harmless on a contact page; the fix is the
  same pattern /work uses (pass the value in from the page).
