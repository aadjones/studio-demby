# Build and deploy recipes

Occasional build tasks, moved out of CLAUDE.md. The everyday rules (`pnpm clean-build`, never `rm -rf .next`) stay there.

## Building while a dev server runs

If you need a build while the user's dev server is running, build a copy instead: rsync the repo (minus `node_modules`, `.next`, `public`) to a scratch folder, symlink `node_modules` and `public`, then `npx next build && npx next start -p 3001` there.

## Checking a production deploy

After merging to `main`, wait on the *Production* deployment's own status, not the commit's: if the commit already had a preview, its commit status says "success" immediately and you'll test the old site. `gh api "repos/aadjones/studio-demby/deployments?sha=<full sha>&environment=Production"`, then that deployment's `/statuses`.

## No `--distDir` flag

`next build` in Next 14 has **no `--distDir` CLI flag** — `distDir` is a `next.config.js` option only. Passing it errors with `unknown option '--distDir'`.
