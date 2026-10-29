# Before/after snapshots

For any change that could touch many pages, capture before and after and diff:

```bash
pnpm snapshot capture https://www.studiodemby.com baseline        # production
pnpm snapshot capture https://www.studiodemby.com baseline-rerun  # same site again, to measure noise
pnpm snapshot capture <preview-url> my-change                     # Vercel preview or http://localhost:3000
pnpm snapshot diff baseline my-change baseline-rerun
```

It covers every static page and every content file of any status, at 375 and 1440, and reports new broken requests, new console errors, and pages whose pixels changed. About 20 pages (clocks, generative sketches, embeds) differ slightly even between identical runs; the third argument lists those separately so real changes stand out. Canvases, videos and iframes are hidden, so check sketches and audio by hand. Output goes to `snapshots/` (gitignored).
