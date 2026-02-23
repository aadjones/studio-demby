# Artifact System — Future Directions

## What exists now

The generative system is deterministic: a seed + density + weight fully specifies any artwork. These parameters are encoded into a compact artifact code (`f:` + 7 base62 chars, e.g. `f:0a3kL2x`) that lives in the URL hash and updates live. Any code can be shared as a link, saved as a PNG (with the code in the filename), or printed via Cmd+P as a minimal certificate (artwork + code + title + year).

The encode/decode functions are pure — no DOM dependency — so any external tool can consume them.

## Conceptual direction

The artifact code is a system specification, not an image format. It can be rendered as a still, an animation, a print, or anything else. The code is the artwork. The image is just one projection of it.

This is conceptually similar to fxhash/Art Blocks — the artist makes the system, the collector gets a specific instance — but without blockchain, tokens, or digital scarcity enforcement. Scarcity comes from physical production, not protocol.

## Physical edition models

### Edition objects
Print a set of cards, plates, or postcards — each with a unique artifact code. The code on the object lets anyone verify/reproduce the artwork digitally, but the physical object is the ownership proof. Laser-etched metal tags, letterpress prints, embossed certificates. The medium is the authentication.

### Blind editions
Sealed envelopes, each containing a certificate with a code. The buyer picks one without knowing which piece they get. Opening is irreversible. Trust without preview.

### Mail art
Postcards with the artwork on front, the code on back, sent through actual mail. The postmark dates it. The physical handling makes each one unique. An edition that arrives, not one you download.

### Studio ledger
A handwritten notebook (or a simple static page) that records: code, date, recipient. Analog provenance. The artist is the authority, not a protocol. This is how the art world worked for centuries.

## Contract types (from original spec)

### A. "Future Artifact"
Entitles the holder to one future generated work from the system, created at a later date. You decide when. They decide to trust you. Could be implemented as a certificate with `seed=PENDING` — the holder chooses when to activate (generate the seed). Once activated, locked forever.

### B. "System Access (Private)"
Grants private access to the full parameter space — the 11+ internal parameters that aren't exposed through the public 2-slider UI. A code that unlocks deeper control. The version field in the encoding format already supports this (bump to v1 with a longer payload).

### C. "One-Time Intervention"
Allows the holder to choose the mode/preset for a single future generation. They don't control the output — just the condition. A certificate where the preset field is blank until they fill it in.

## Technical extensions (back pocket)

### Video export
Record the 12-second generation animation as a WebM using MediaRecorder + canvas.captureStream(). Same artifact code drives the animation. Deferred to avoid bloating the main page — could be a separate capture tool that imports the decode function.

### Batch/series mode
Same parameters, sequential seeds — for generating editions programmatically. A Node.js script that decodes a code, iterates seeds, and renders each to PNG via headless browser.

### Expanded parameter encoding
Version 1 of the artifact code format could encode the full 11-parameter preset space (layers, alpha, saturation, hue shift, etc.) for "System Access" certificates. The 2-bit version field already reserves room for this.
