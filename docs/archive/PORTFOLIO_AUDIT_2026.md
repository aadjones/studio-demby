# Studio Demby Portfolio Audit — Six Persona Report

**Date:** February 2026
**Site:** https://www.studiodemby.com
**Method:** Automated browsing (Playwright + WebFetch) at 375px mobile and 1440px desktop, content analysis of all ~35 projects, code review of key components

**Note on methodology:** Playwright's sandbox conflicts with the site's `window.location` handling, causing phantom redirects that do NOT affect real users. The p5.js global script also fails to load in Playwright's context, which caused p5-based thumbnails and canvases to appear blank — **this is purely a testing artifact; thumbnails render correctly in real browsers.** The **React hydration errors (425, 418, 423)** on the Work page are real and appear in production console logs.

---

## 1. THE LOST PHONE STRANGER (Mobile, Zero Context)

**Mission:** Land on the site cold, figure out what this person does, decide whether to stay.

### First 10 Seconds
The homepage at 375px presents: "Studio Demby" in a large serif heading, "musician · visual artist · creative coder" as a subtitle, and a generative background animation. **Verdict: I get it immediately.** The three-word tagline does the work. No jargon, no overcomplicated "I'm a multidisciplinary blah blah." Clean.

### What Works
- **Navigation is dead simple.** Three items: Home, Work, About. Can't get lost.
- **Featured Work section** shows 4 curated projects (Ghostly Double, Fire, Museum of Dashes, FrogMath) — each with a thumbnail, title, and one-word descriptor ("music video", "generative art", "essay", "math app"). This is excellent curation. It shows range without overwhelming.
- **Project cards on the Work page** are well-structured: thumbnail, title with emoji type indicators (🎵🎬, 🎨🕹️), date, one-line description. The emoji system is actually useful — I can quickly scan for music vs art vs writing.
- **Footer has email subscribe + social links.** Not buried.
- **"See all work →"** clear CTA from homepage to Work.

### What Doesn't Work
- ~~**The homepage hero area is enormous on mobile.**~~ *[CORRECTED: The hero is a full-viewport (100dvh) Feathers animation with the title overlaid — it renders as a dramatic generative art splash in real browsers. Playwright couldn't render the p5.js canvas, making it appear as dead space. This is the same testing artifact as the thumbnails.]*
- **The Work page is VERY long on mobile.** 35+ projects in a single scroll with no pagination or "load more." At 375px this is a very, very long page. It can feel like a warehouse, not a curated portfolio.
- **No back-to-top button or sticky nav on the Work page.** Once I scroll halfway down 35 projects, getting back to the filters requires a long scroll up.
- **The category filter buttons ("All / Sound & Vision / Tools / Writing / Teaching") horizontally overflow on mobile.** Five buttons at 375px is tight. They work but feel cramped.

### Bounce Risk Assessment
**Low-to-medium.** The full-viewport animated hero with overlaid title is visually striking when it renders. The main risk is whether a casual visitor scrolls past it to discover the Featured Work section below, since all project content is below the fold.

### Would I Share It?
If I found a specific project I liked (Museum of Dashes, Little Bunny Foo Foo), I'd share that project URL. I probably wouldn't share the homepage — it doesn't have enough personality or hook in the first viewport to be share-worthy on its own.

---

## 2. THE CURATOR (Arts Professional, Desktop)

**Mission:** Evaluate artistic identity, coherence, and how the work is framed for a potential show/residency/feature.

### Artistic Identity
There IS a coherent identity here, and it's genuinely interesting: **systems that misbehave.** The About page articulates this well — "patterns with a mind of their own, tools that talk back, feedback loops that blow up." This isn't a generic artist statement. It's specific enough to be a curatorial thesis.

The throughline connecting music, generative art, writing, and pedagogy is **improvisation-as-method.** Whether it's a piano performance, a p5.js sketch, or a satirical essay, the approach is: set up a system, add constraints, see what happens. This is legible and compelling.

### Strongest Projects (Curatorial Standpoint)
1. **Museum of Dashes** — Conceptually the most sophisticated piece. A mock-museum taxonomy that's simultaneously a genuine typographic reference and an art piece about institutional authority. This is gallery-ready.
2. **Rain (2014)** — Algorithmic composition based on the Cantor set. The concept (recursive self-deletion applied to music) is mathematically elegant and poetically framed. "Rain is carved from time itself."
3. **Degradation** — AI image generation run in reverse, 120 iterations of entropy. Conceptually sharp, well-documented.
4. **Gallery of Lies** — Interactive/generative piece exploring grief through glitch aesthetics. The cryptic artist statements ("Each piece begins as a failure to remain silent") work because they're earned by the visual output.
5. **Spatial Synthesizer** — "What if geometry behaved like tone?" Genuinely bridges audio and visual domains through shared math.
6. **Little Bunny Foo Foo Is Fascist Propaganda** — The strongest writing on the site. Four interpretive frameworks applied rigorously to a children's rhyme, each reaching the same conclusion. This is smart, funny, and structurally inventive.

### Weakest Projects
1. **Shrimp Jesus** — Made with ChatGPT, DALL-E, and Udio. The "prompt engineering + divine inspiration" framing is honest, but the work reads as an AI novelty rather than an artistic statement. In a curatorial context, this undercuts the credibility of the handmade work surrounding it.
2. **Wisdom Teeth Codex** — Conceptually thin. A joke stretched to project length.
3. **Healthcare Guide** — Effective satire but reads more as social media content than gallery work. The flowchart format is clever but doesn't transcend its medium.
4. **Cooooookie!** — Lightweight. Fun but forgettable.
5. **The Chonktionary / Chonkology** — These feel like inside jokes that haven't been contextualized for an outside audience.

### The "Provocations" Problem
The satirical/humorous work (Healthcare Guide, Shrimp Jesus, Wisdom Teeth Codex, Demby Analytics, Little Bunny Foo Foo) is **tonally inconsistent** with the serious generative art and music. Some of it is genuinely strong (Bunny Foo Foo, Museum of Dashes), but some is lightweight and risks making the portfolio feel unserious.

A curator would ask: "Is this person an artist or a comedian?" The answer is "both, deliberately," but the site doesn't frame this tension — it just presents everything chronologically. The category system helps, but "provocations" as a category name is defensive. It says "I know this isn't serious art."

### Category System
The four categories (Sound & Vision, Tools, Writing, Teaching) are serviceable but **don't map to how a curator thinks.** A curator would want to see: the generative visual work grouped separately from the piano performances. "Sound & Vision" lumps together algorithmic compositions, live improvisations, and interactive visual art. These are different practices.

### What's Missing
- **No artist CV / exhibition history / press.** If you've shown work anywhere, taught anywhere notable, or had reviews, this needs to be on the site.
- **No high-resolution documentation of generative pieces.** The p5.js sketches render client-side; there are no curated stills or video captures that show the best outputs. For a curator evaluating print-worthiness or installation potential, this is a gap.
- **No statement about the relationship between the disciplines.** The About page hints at it but doesn't commit. A 2-paragraph "practice statement" articulating how music, code, visual art, and writing inform each other would be powerful.

### Overall Curatorial Assessment
**This is a strong emerging practice with a clear voice, hobbled by undifferentiated presentation.** The best work here (Museum of Dashes, Rain, Degradation, Gallery of Lies, Bunny Foo Foo) would hold up in a curated group show. But it's buried among lighter pieces that dilute the signal. A curator would need to dig to find the gold — and most won't dig.

---

## 3. THE MUSICIAN (Fellow Musician/Composer, Desktop)

**Mission:** Evaluate the musical work, how it's presented, and whether this person can actually play.

### Finding the Music
The emoji system (🎵🎬) makes it easy to identify music projects in the Work listing. Filtering by "Sound & Vision" helps further. **Music is well-represented** — roughly 12-14 of the ~35 projects are music-related, spanning 2014-2025.

### Musical Range
The range is genuinely impressive:
- **Algorithmic composition:** Rain (Cantor set, SuperCollider)
- **Free improvisation:** Escape, Stray Signals
- **Electronic + acoustic hybrid:** Flow, Above
- **Live classical improvisation:** Bach Improv, Seasons, Tetrico, Improvisation on a Simple Melody
- **Audiovisual performance:** Ghostly Double, Fluid Subspaces
- **Interactive instrument:** Spatial Synthesizer

This spans from algorithmic math-music to spontaneous keyboard improvisation. That's real breadth.

### Can This Person Play?
**Yes.** The Bach improvisation is the strongest evidence — improvising in baroque contrapuntal style on the spot, at a workshop, in C major (his "least favorite key"). The self-deprecating framing works. Tetrico demonstrates experimental technique (perpetual pitch-shifting creating unresolvable drift). Seasons shows lyrical sensitivity.

The Juilliard-trained violist testimonial on the Teaching page adds credibility, but it's buried on a different page from the music.

### Presentation of Musical Work
- **YouTube embeds are the primary format.** This is fine for video performances but limiting for audio-only works.
- **SoundCloud is linked in the footer** but individual projects don't deep-link to specific SoundCloud tracks. Escape and Flow (full albums) should link directly to their SoundCloud/streaming pages.
- **There's no "listen" page or music-specific landing.** If I'm a booker or collaborator, I want to hear a curated playlist, not click through 12 project pages one by one.
- **The process/tools metadata is well-done.** Listing instruments, software, iteration count, and notable "artifacts" gives enough technical context without being academic.

### Biggest Missed Opportunity
**No audio player anywhere on the site.** Every music piece requires navigating to its page, then clicking play on a YouTube embed. There's no way to browse the work while listening. A simple embedded SoundCloud playlist or audio sampler on the homepage/work page would dramatically improve the musical experience.

### The Improvisation Teaching Connection
The link between the improvisation performances and the teaching practice (Contrapose: 73 creative constraints, Shape Exercise) is the most interesting thread in the portfolio, and it's **barely articulated.** The performances prove the method works. The teaching frameworks codify the method. Together they tell a story: "I developed a practice, I teach it, here's proof it produces real music." But you have to piece this together yourself across 5+ separate project pages.

### Overall Musical Assessment
**Genuinely talented musician with a distinctive improvisational voice, underserved by the presentation.** The work speaks for itself when you find it, but the site makes you work too hard to experience the music as music. It's organized as a web portfolio, not as a listening experience.

---

## 4. THE CREATIVE TECHNOLOGIST (Creative Coder, Desktop + Mobile)

**Mission:** Evaluate the interactive/generative work technically and artistically.

### The Interactive Pieces
The portfolio includes ~10 interactive generative pieces built with p5.js, several using WebGL/GLSL shaders:
- **Petrol Noise** — WebGL, GLSL, Voronoi noise with FM synthesis concepts
- **Grain Rain** — 2D canvas, seeded random circles with vibrational animation
- **Fire** — Algorithmic bloom with opposition dynamics
- **Feathers** — Organic motion from "failed intention"
- **Shatter** — Polygon-based fragmentation
- **Encased Melting** — Solid forms with soft internal motion
- **Spatial Synthesizer** — 2D Fourier transforms as visual instrument
- **Sticks and Sticks** — Clock-like generative pattern
- **Degradation** — Stable Diffusion img2img loop (not interactive, but code-driven)

### Technical Assessment
The **code architecture is solid.** Based on the codebase review:
- Instance-mode p5.js (not global mode) — correct for React integration
- `useRef` for draw-loop parameters (avoids remounts)
- `IntersectionObserver` for lazy initialization (good for page performance)
- `ResizeObserver` with debounce for responsive canvases
- Seeded random for deterministic layouts
- Cross-dissolve transitions using `p.get()` snapshots

This is competent creative coding infrastructure, not beginner-level "just throw p5 at the page."

### Conceptual Depth
This is where the work splits:
- **Spatial Synthesizer** stands out conceptually — applying FM/AM synthesis to geometry. The question "what if geometry behaved like tone?" is genuine creative research, not a tech demo.
- **Degradation** has strong conceptual framing — running AI generation in reverse to study entropy.
- **Petrol Noise** bridges FM synthesis and Voronoi cellular noise — mathematically interesting.
- **Fire, Feathers, Shatter, Encased Melting** are more conventional generative art. Pretty, but they don't push the field forward. They're texture generators with poetic names. A creative technologist at a conference would say "nice execution" and move on.
- **Grain Rain** is visually distinctive but the "vibrational circles" concept is thin.

### Slider/Control Design
The parameter-exposed sliders (confirmed in Petrol Noise: "pressure" and "grain"; Grain Rain: density, speed, shuffle button) follow a good pattern — they expose interesting creative parameters rather than just "change the color." But without being able to interact with the live pieces in this audit, I can't fully evaluate the parameter space.

### How This Compares
Against the creative coding landscape (Shadertoy, OpenProcessing, dwitter, the Processing Foundation community):
- **Technically:** Mid-to-upper range. The WebGL shader work is competent. The React/p5 integration is above average.
- **Conceptually:** The best pieces (Spatial Synthesizer, Degradation, Rain) are genuinely interesting. The weaker pieces are "another generative texture."
- **Presentation:** Better than most creative coders (who just dump sketches on OpenProcessing with no context). The poetic framing adds value.

### Overall Tech Assessment
**A creative coder with real technical skill and occasional conceptual depth, who needs to kill about 3-4 of the weaker generative pieces to let the strong ones breathe.** The portfolio has a "quantity over curation" problem.

---

## 5. THE DESIGN SNOB (Typography, Spacing, Polish)

**Mission:** Evaluate the visual design system, consistency, and craft.

### Typography
- **Heading font:** A display serif (appears to be a custom/loaded font). Used for "Studio Demby," page headings, and project titles. It's handsome and distinctive.
- **Body font:** A serif body text that reads well at paragraph length.
- **Hierarchy:** Clear — H1 for page titles, H2 for sections, H3 for project card titles. Body text is well-sized.
- **On mobile:** The type scales reasonably. "Studio Demby" on the homepage is large but not absurdly so at 375px.
- **Issue:** The Work page card titles get long ("Chonkology: A Mathematical Theory of Audiovisual Narratives") and at mobile width, combined with the date and description, the cards get text-heavy.

### Spacing & Layout
- **Max-width:** Content is constrained to ~960px. This is good for readability but means at 1440px, there's a lot of unused horizontal space. The About page especially looks sparse — a single column of text occupying maybe 40% of the viewport width.
- **Work page grid:** 3 columns at desktop, 2 at mobile. Consistent card sizes. The grid itself works.
- **Vertical spacing:** Generally consistent. The gap between the hero area and Featured Work on the homepage is the biggest issue — too much empty space where the generative background animation lives.
- **Project page template:** Consistent across project types — title, media embed, description, collapsible metadata, related works, prev/next nav. This consistency is a strength.

### Color
- **Palette:** Warm off-white background (#faf9f6 or similar), dark text, minimal accent color. The indigo "Surprise Me" dice button is the only pop of color on the Work page.
- **Dark mode:** Not apparent in the current deployment.
- **Contrast:** Good. Dark text on light background passes WCAG easily.

### The Homepage Hero
The generative p5.js Feathers animation fills the full viewport (100dvh) with the title overlaid on a frosted-glass panel. This is a bold design choice — the site itself IS a piece of generative art. The animation couldn't render in our Playwright testing, but in a real browser this is likely the strongest first impression the site makes. The tradeoff: all project content (Featured Work) is below the fold, requiring a scroll to discover.

### Cards & Thumbnails
- **Consistent aspect ratio:** Yes, the card images are consistently cropped.
- **Hover states:** Subtle scale-up on hover. Clean.
- **Category descriptors under card titles** (MUSIC VIDEO, GENERATIVE ART, ESSAY, MATH APP) on the homepage are in all-caps, small, muted — good hierarchy.

### Micro-Interactions
- Hover scale on cards: yes.
- Hover on nav items: underline indicator for active page.
- "Surprise Me" button: hover scale, no other flourish.
- **Missing:** No page transitions. No loading states visible (skeleton screens). No scroll-triggered animations. The site is static-feeling despite hosting dynamic interactive content.

### Mobile Responsive Assessment
- The layout adapts correctly (3-col to 2-col grid, full-width content on project pages).
- No horizontal overflow detected on text content.
- Filter buttons on the Work page are tight at 375px but functional.
- Footer email form goes full-width on mobile — good.

### "Designed" vs "Developer with Tailwind" Scale: 6/10
The site is **clean and competent** but not **distinctive.** The typography is the best design element — the serif heading font gives it personality. But the layout is standard (centered content column, card grid, footer), the color palette is conservative, and there's no visual element that says "an artist made this." Compare it to, say, Beeple's site, or Zach Lieberman's, or any established creative coder's portfolio — those sites ARE art objects. This one is a nice container for art. The generative homepage background is the attempt at making the site itself artistic, but it reads as decorative, not designed.

### Overall Design Assessment
**A well-built, typographically pleasant site that plays it too safe for an artist portfolio.** The consistency and readability are genuine strengths. But the design doesn't take risks proportional to the work it contains. The art inside is wilder than the frame around it.

---

## 6. THE POTENTIAL COLLABORATOR (Multipurpose Evaluator)

**Mission:** Understand what this person does, assess their range, decide whether to reach out.

### The Elevator Pitch
The site communicates "musician / visual artist / creative coder" within 2 seconds. The About page expands: obsessed with systems, works across disciplines, method is improvisation. **This is clear enough in 30 seconds.** The problem is: it's clear what he does (many things) but not what he's best at or what he wants to be hired for.

### Contact & Professional Information
- **Email:** aaron.demby.jones@gmail.com — visible on About page. Good.
- **Social:** SoundCloud + Instagram in footer. Good.
- **Teaching page:** Yes, with pricing ($45 trial, $90/hour), location (San Diego), and a Juilliard testimonial.
- **CV/Resume:** None.
- **Press/Exhibitions:** None mentioned.

### By Collaborator Type

**Hiring as a musician/performer:**
- Can find performance videos (Bach Improv, Tetrico, Seasons, Ghostly Double).
- Testimonial from Juilliard-trained violist adds credibility.
- **Missing:** A press kit, a curated demo reel, genre/style keywords for search, availability/booking info. A venue booker needs to see: "Available for solo piano performances, audiovisual sets, improvisation workshops."

**Commissioning visual/generative art:**
- Strong portfolio of interactive pieces, well-documented with tools and process.
- **Missing:** Any mention of commissions, pricing, past installations, or how the work could exist outside a browser (prints? projections? installations?). No "hire me for your lobby installation" signal.

**Bringing in as teacher/workshop leader:**
- Teaching page exists with clear structure, pricing, testimonial.
- Contrapose (73 creative constraints) and Shape Exercise prove pedagogical creativity.
- FrogMath shows ability to build educational tools.
- **Missing:** Teaching CV. What institutions? How many students? What age ranges? The single testimonial is good but isolated.

**Collaborating on creative coding projects:**
- Technical skill is evident. GitHub link on ChessWalk shows open-source willingness.
- **Missing:** A GitHub profile link anywhere on the site? Open-source contributions?

**Publishing writing:**
- Little Bunny Foo Foo is genuinely publishable. Museum of Dashes is gallery-catalog-quality writing.
- **Missing:** A "Writing" landing page or portfolio. The pieces are scattered across the general Work listing.

### The Satire Risk
Would the provocations/satire make a potential collaborator nervous? **Depends on the collaborator.** The Healthcare Guide and Little Bunny Foo Foo are sharp social commentary. Shrimp Jesus is absurdist. Wisdom Teeth Codex and Demby Analytics are goofy. The Chonktionary... might confuse a potential employer.

For a **gallery or festival:** The satire adds dimension. Curators like artists with a critical voice.
For a **university hiring committee:** The satire could be a risk if not contextualized academically.
For a **corporate gig:** They'd see Shrimp Jesus and close the tab.

The issue is that the site doesn't let you choose your own adventure. A potential collaborator looking for "serious generative artist" sees Shrimp Jesus and Cooooookie in the same feed.

### What Would Make Me MORE Likely to Reach Out
1. A clearer sense of what he WANTS to do next (commissions? teaching? performing? all of it?)
2. Evidence of external validation (shows, publications, clients, students)
3. A 30-second video or audio sample on the homepage that demonstrates the work without requiring clicks

### What Would Make Me LESS Likely to Reach Out
1. The sheer volume of projects with no curation hierarchy — it's hard to tell what's a major work vs. a weekend experiment
2. No CV or professional history
3. The lighter satirical pieces mixed with serious work without framing

### Overall Collaborator Assessment
**Talented and approachable, but underselling himself.** The site reads as "here's everything I've made" rather than "here's what I can do for you." This works for a personal archive but not for attracting professional opportunities. The work itself is the strongest selling point, but the site's framing doesn't help a busy collaborator understand what to do with it.

---

## CONSOLIDATED PRIORITY FIX LIST

### Critical (Do First)
1. **Investigate React hydration errors.** The Work page throws 8 console errors (React #425, #418, #423) on every load. These are hydration mismatches — likely from `Math.random()` calls or date formatting differences between server and client rendering.

### High Priority
4. **Curate the Work page.** 35+ projects in a flat list is too many. Consider: featured/pinned section at top, or a "Selected Work" vs "All Work" toggle, or just archive the weakest 5-6 pieces.
5. **Add an artist CV or professional history.** Even a minimal one: education, exhibitions, teaching positions, notable collaborations.
6. **Add a music landing page or embedded player.** A SoundCloud embed or curated playlist so musicians/bookers can listen without clicking through 12 separate pages.
7. **Frame the satire.** Either make "provocations" a proper curatorial statement ("I believe humor is a critical tool...") or reconsider whether pieces like Cooooookie and Wisdom Teeth Codex belong in a professional portfolio.

### Medium Priority
8. **Tighten the About page.** Add a 2-sentence practice statement connecting the disciplines. Add brief credentials. The current bio is good but could do more work.
9. **Add a "back to top" or sticky filter bar on the Work page.** Mobile users scrolling 35 projects need a way back.
10. **Consider commissioning/collaboration CTAs on relevant project pages.** "Like this kind of work? Let's talk about a commission" on the generative art pages. "Want this at your venue?" on performance pages.
11. **Expand the Teaching page.** Add teaching history, student age ranges, more testimonials if available.

### Nice to Have
12. **Add page transitions or subtle scroll animations.** The site is static-feeling for an artist working in motion and interactivity.
13. **Consider a dark mode toggle.** The generative work would pop more on dark backgrounds.
14. **Add GitHub profile link** for the creative technologist audience.
15. **Write a proper practice statement** (2-3 paragraphs) that could double as a curatorial text.
