# Design tokens

The site **shell**—nav, footer, listings, project-page chrome, About, Teaching, Contact, and the shared MDX blocks (CallToAction, FieldNote, ProjectOverview, HeroTitleBlock…)—uses only these tokens. Individual projects (Museum of Dashes, Married For, the time visualizers, bird cards, Chonktionary…) are their own visual worlds and keep their own palettes; don't migrate them.

| Role | Token | Value | Rule |
|---|---|---|---|
| Page background | `paper` | `#F8F7F5` | Anything that should read as "the page" (hero, sticky bars). Not white, not grey. |
| Raised surface | `card` | `#FFFFFF` | Boxes that sit above the page |
| Subtle surface | `subtle` | `#F5F5F5` | Chips, tabs, metadata boxes |
| Hairline | `line` | `#E5E5E5` | Borders and dividers |
| Warm surface | `cream` | `#FFF8F0` | Only the end-of-project call-to-action box |
| Primary text | `ink-900` | `#1A1A1A` | Headings, body text |
| Secondary text | `ink-700` | `#3D3D3D` | Summaries, captions |
| Tertiary text | `ink-500` | `#707070` | Dates, labels. The lightest grey allowed for text (4.6:1 on paper, 4.5:1 on subtle). |
| Decorative grey | `ink-300` | `#A3A3A3` | Icons, dividers. **Never text**: fails contrast. |
| Accent | `coral` | `#FF6B6B` | Link underlines (solid, 2px), button hover, selection. **Never text**: 2.4:1. |
| Error text | `error` | `#F43F5E` | Form errors |
| Inline code | `code-text` / `code-bg` | `#8B5CF6` / `#FEF3C7` | `code` inside prose |
| Display type | `font-display` | Outfit | Headings, titles, buttons |
| Body type | `font-body` | Crimson Pro | Everything else (the default on `body`) |
| Utility type | `font-mono` | JetBrains Mono | Captions, data, code; 14px or larger |
| Corners | `rounded-lg` / `rounded-full` | | Cards and images / pills and round buttons |

Rules:
- **No raw Tailwind greys in the shell** (`gray-*`, `zinc-*`, `neutral-*`, `stone-*`, `slate-*`), and no hex literals. If a role is missing, add a token in this file and in `tailwind.config.js` rather than reaching for a one-off.
- **Hover:** buttons go to `coral` (`hover:bg-coral`). Text links in prose get a coral underline. Card titles use the `card-title` class (in `global.css`): a coral underline while the card's `group` link is hovered. Don't lighten text on hover; it lowers contrast.
- **Focus:** `global.css` gives every link, button and field a 2px `ink-900` ring on `:focus-visible`. Don't remove outlines (`outline-none`) without replacing them.
- **Tap targets:** icon-only links get a 44×44 box (`h-11 w-11`) around the icon.
- Check contrast with real numbers before adding a text color: 4.5:1 for normal text against every surface it sits on.

- **Text links** outside prose use the `text-link` class: the same style as article links (one definition in `global.css`). Never color a link blue.
- **Quotes and asides** (testimonials, FieldNote, footnote boxes): a left rule in `ink-500`.

**Being different is allowed; being different by accident isn't.** `tests/design-tokens.test.ts` fails if any shell file uses a color that isn't a token. To make a deliberate exception, add the file and the allowed classes to its `ALLOWED` list with a comment saying why (today: the draft banner's amber, a warning state). Project worlds aren't in the test's shell list, so their own palettes are already allowed. When you add a shell file, add it to that list too.

Known exception in the shell: `text-white` on dark buttons (correct as is).
