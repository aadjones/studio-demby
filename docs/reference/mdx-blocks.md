# MDX blocks

Details for writing or embedding blocks in `app/components/mdx-blocks/`, moved out of CLAUDE.md.

## Videos: one block per job

Each file's header comment says the same.

| Job | Block | Example |
|---|---|---|
| Hosted player: YouTube (any link form), Loom, Vimeo | `VideoEmbed` | `<VideoEmbed src="https://youtu.be/ID" title="…" caption="…" />` |
| Your own MP4 with controls and a poster | `VideoFile` | used inside `HeroBlock` for the Preview Mix videos |
| Silent autoplay loop that's part of the artwork | `AmbientLoop` | Degradation's three loops |

All fill their container: never wrap them in a `max-w-*` div or pass a narrowing `className` (Rain and Above once did, giving 544px and 768px videos). A video's `title` only names it for screen readers; the page heading comes from `HeroTitleBlock`. A raw `<iframe>` in `content/projects/` **fails the build**.

## Build error: "Expected component `X` to be defined"

This error during the build means the page uses a block that isn't registered in `ClientMDX.tsx` (renamed, deleted or misspelled). Register it there; don't add an import.

## `.prose a` Override Gotcha

All MDX content is wrapped in a `.prose` container. `app/global.css` has a `.prose a` rule that forces **all links** inside prose to `text-ink-900` (near-black) with a coral underline decoration — regardless of any Tailwind color utilities on the element.

**Symptom:** Styled `<a>` buttons inside MDX components appear as dark rectangles with invisible text and a reddish underline, even with explicit `text-white` or other color classes.

**Fix:** Use Tailwind's `!` important modifier and suppress the underline:
```tsx
className="... !text-white no-underline hover:!text-white ..."
```

This applies to any `<a>` tag rendered inside an MDX page, including all components in `app/components/mdx-blocks/`.

## Every MDX Component Must Accept `className`

`.prose` leaks into MDX components constantly. `ClientMDX.tsx` defends against this by injecting `className={`not-prose ${props.className || ""}`}` into **every** registered component — but that defence only works if the component actually renders the className it is handed.

**Symptom:** prose typography (link colors, list markers, heading sizes, `max-width`, vertical margins) bleeding into a component's own controls and labels, even though `ClientMDX` "already adds `not-prose`."

**Root cause:** the component hardcodes its own `className` and never declares the prop, so the injected `not-prose` is passed, ignored, and silently dropped. TypeScript does not catch it — `ClientMDX` casts each component to `any` before spreading props.

**Fix:** every component registered in `ClientMDX.tsx` accepts `className` and merges it:
```tsx
export default function MyBlock({ className = "" }: Props) {
  return <div className={`my-block ${className}`.trim()}>…</div>;
}
```

**Exception: blocks that hold prose.** A block whose children are markdown text (paragraphs, lists, emphasis) needs prose styling, so it must *not* get `not-prose`. These are listed in `PROSE_BLOCKS` in `ClientMDX.tsx` (today: `ProjectOverview`). Giving such a block a `className` without listing it there strips its paragraph spacing and list bullets on every page that uses it.

**Related trap — background-dependent effects.** If a component draws anything that knocks out to a background color (SVG text halos, gradient masks, faux-borders), it must *paint that background itself* rather than assuming an ancestor supplies it. A component that looks right in isolation will grow fringes on a page whose background differs. See `app/components/mdx-blocks/clef-rake/clef-rake.css`.
