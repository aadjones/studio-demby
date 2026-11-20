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

- **Next 15 + React 19 migration.** `next@14.2.35` is the last 14.x release and gets no more
  security fixes; as of 2026-11-20 `pnpm audit --prod` lists 26 Next advisories fixed only in
  15.5.x. Most need things this site doesn't use (Windows hosting, a custom server, Pages Router
  i18n), so it isn't urgent, but every new advisory will stay open until this is done. Three are
  critical, and two of those are in Next's image optimizer (AVIF and SVG files,
  GHSA-2xp9-vwfh-vxw4 and GHSA-2464-fhr4-w9xw). They're filed against `next`, not `sharp`, so
  upgrading sharp doesn't close them. Do it on its own branch: React 19, async `params` in
  `app/work/[slug]` and `app/work/by-category/[category]`, check `next-mdx-remote` and `loadP5`,
  then `pnpm snapshot diff` against production.
- **Other flagged packages.** Done 2026-11-20: `sharp` 0.35.5, and through `pnpm.overrides` in
  `package.json`, `postcss` 8.5.33 (Next pins 8.4.31), which brings `nanoid` 3.3.20 and
  `source-map-js` 1.2.4, plus `js-yaml` 3.15.2 (via `gray-matter`), and `mdast-util-to-hast` 13.2.2
  and `yaml` 2.9.1 (via `next-mdx-remote-client`). Still open:
  - `zod`: the fix is only in 4.x, a major jump from 3.24, so it needs its own branch (the
    frontmatter schemas in `types/mdx.ts` and `lib/content/projects-loader.ts` use it).
  - `katex` (low): needs 0.18.2. Under 0.x versioning that's a breaking bump from 0.16.
  Once Next is on 15, drop the `next>postcss` override.

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
