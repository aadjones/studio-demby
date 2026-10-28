# Routing: /work?category=

**How `/work?category=…` works.** A `beforeFiles` rewrite in `next.config.js` serves it from `app/work/by-category/[category]/page.tsx`, which is prebuilt once per category, so a shared link arrives with the right cards in the HTML. The URL never changes. Both pages render `app/components/WorkIndex.tsx` and pass the category into `WorkGrid`; the tabs then only update the URL with `history.replaceState`.

Two traps here:
- **Don't use `useSearchParams` in `WorkGrid`.** On a static page it makes Next skip server-rendering everything inside the nearest `<Suspense>`, so the grid and its images wait for JavaScript. That cost /work 2+ seconds and a layout shift.
- **Rewrites must be `beforeFiles`.** A plain array of rewrites runs only after Next matches a page file, and `/work` has one, so the rewrite silently never applies.
