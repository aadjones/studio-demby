# docs/

Three directories, three different lifespans. Put a document where its
lifespan says it goes.

## `plans/`

One live build doc per **in-flight** project — the handoff notes a future
session reads before touching that project's code. A plan here means the
project is unfinished.

A plan is deleted when its project ships. If you find a plan for something
that's already live, that's a bug: either the project isn't actually done, or
the plan should have been removed.

Current plans should correspond to `status: draft` entries in
`pnpm content:status`.

## `reference/`

Durable specs that stay true after the work ships — asset dimensions, format
conventions, anything you'd need to look up again months later. These are not
tied to a single project's lifecycle.

## `archive/`

Read-only history. Point-in-time audits kept for context about *why* things
are the way they are.

**Never treat `archive/` as current truth.** These documents describe the
repo as it was on the day they were written and have not been maintained
since. Verify against the code before acting on anything in here.
