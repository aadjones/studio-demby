# Architectural Audit: Studio Demby Portfolio

**Date:** December 7, 2025
**Codebase:** Next.js 14 Portfolio Site
**Scope:** app/, lib/, types/ directories

---

## Executive Summary

This Next.js portfolio has undergone a recent migration from a "cluster" system to a "category" system. The codebase is generally well-structured with strong type safety via Zod schemas and a clear separation between content loading, component rendering, and configuration. However, the migration has left **architectural debt** that will compound over time. The biggest risks are **naming inconsistencies**, **orphaned legacy code**, **duplicate configuration sources**, and **incomplete test coverage** after schema changes.

**Key Findings:**
- **Critical Issues:** 2 (migration artifacts, duplicate config files)
- **Moderate Issues:** 7 (naming debt, component organization, type safety gaps)
- **Minor Issues:** 5 (dead code, console statements, test coverage)

---

## Current State Assessment

### What's Working Well

1. **Type Safety with Zod:** Runtime validation via `ProjectSchema` and `SketchSchema` in `/Users/adj/Documents/Code/app-development/portfolio/types/mdx.ts` provides excellent protection against invalid frontmatter.

2. **Centralized Content Loading:** The loader pattern in `/Users/adj/Documents/Code/app-development/portfolio/lib/content/` is clean and consistent between projects and activity.

3. **Component Organization:** Clear separation between:
   - `/app/components/layout/` - Navigation and shells
   - `/app/components/mdx-blocks/` - Custom MDX content blocks
   - `/app/components/media/` - Media embeds
   - `/app/components/surreal-systems/` - Project-specific interactive components

4. **Feature Flags:** Simple, type-safe feature toggle system in `/Users/adj/Documents/Code/app-development/portfolio/app/config/features.ts`.

5. **Static Generation:** Proper use of `generateStaticParams()` for category and project pages.

### The Migration Gap

The codebase completed a **cluster → category** migration, but residual terminology and code remain scattered throughout:

**Evidence of incomplete migration:**
- `/Users/adj/Documents/Code/app-development/portfolio/lib/clusterMeta.ts` - Still exists with old cluster definitions
- `/Users/adj/Documents/Code/app-development/portfolio/lib/theme.ts` - Defines `clusterColors` object
- `/Users/adj/Documents/Code/app-development/portfolio/app/components/utils/useClusterTextEffect.tsx` - Hook named for old system
- `/Users/adj/Documents/Code/app-development/portfolio/app/components/layout/ClusterProjectNav.tsx` - Component still using old naming
- `/Users/adj/Documents/Code/app-development/portfolio/app/components/layout/StickyClusterNav.tsx` - Feature-flagged out but not removed
- `/Users/adj/Documents/Code/app-development/portfolio/app/config.ts` - metaData description still references "clusters"

**This will create confusion in 6-12 months when:**
- New developers join and see mixed terminology
- You need to extend the category system but find cluster-named functions
- Search/replace operations become risky due to semantic overlap

---

## Issues Found

### CRITICAL SEVERITY

#### 1. Duplicate Next.js Configuration Files

**Location:**
- `/Users/adj/Documents/Code/app-development/portfolio/next.config.js` (active, 55 lines)
- `/Users/adj/Documents/Code/app-development/portfolio/next.config.cjs` (orphaned, 26 lines)

**Impact:** Active file contains comprehensive redirects for cluster→featured migration, but the `.cjs` file has different webpack config for p5.js. This is a ticking time bomb.

**When this breaks:** When you upgrade Next.js or modify webpack config, you'll debug the wrong file.

**Recommendation:** Delete `next.config.cjs` immediately. Verify that p5.js loading works (current approach uses global script tag in layout, not webpack externals).

#### 2. Duplicate Global CSS Files

**Location:**
- `/Users/adj/Documents/Code/app-development/portfolio/app/global.css` (154 lines, imported by layout)
- `/Users/adj/Documents/Code/app-development/portfolio/app/globals.css` (100 lines, NOT imported)

**Impact:** `globals.css` contains vertical slider styles that may be needed but are orphaned. The active file is `global.css`.

**When this breaks:** When you add new slider components and expect styles to work but they don't exist.

**Recommendation:** Audit if any styles from `globals.css` are actually used. If vertical sliders exist in the codebase, merge the styles. Then delete `globals.css`.

### MODERATE SEVERITY

#### 3. Category Data Duplication (Configuration Smell)

**Problem:** Category definitions exist in **three places** with slight differences:

1. `/Users/adj/Documents/Code/app-development/portfolio/app/components/utils/categories.ts` - Full category metadata (name, slug, description, image)
2. `/Users/adj/Documents/Code/app-development/portfolio/app/components/layout/Nav.tsx` - Hardcoded `categoryNavItems` object (lines 9-29)
3. `/Users/adj/Documents/Code/app-development/portfolio/app/components/layout/StickyClusterNav.tsx` - Another hardcoded categories array (lines 8-29)

**Discrepancy Example:**
- `categories.ts` calls it "Systems"
- `Nav.tsx` and `StickyClusterNav.tsx` have "Systems & Tools" and "Practice & Pedagogy" (longer names)

**When this breaks:** When you add a 5th category or rename one, you'll update one file and miss the others. Navigation will be inconsistent.

**Recommendation:** Create single source of truth. Move category metadata to `/Users/adj/Documents/Code/app-development/portfolio/app/config.ts` alongside `metaData` and `socialLinks`. Import everywhere. Components should never hardcode category data.

#### 4. Legacy Component Naming After Migration

**Affected Files:**
- `ClusterProjectNav.tsx` (56 lines) - Should be `CategoryProjectNav.tsx`
- `StickyClusterNav.tsx` (77 lines) - Should be `StickyCategoryNav.tsx` (though feature-flagged off)
- `useClusterTextEffect.tsx` (86 lines) - Should be `useCategoryTextEffect.tsx`

**Props Still Using Old Names:**
```typescript
// ClusterProjectNav.tsx
interface ClusterProjectNavProps {
  previousCluster: string | null;
  nextCluster: string | null;
  clusterSlug: string;
  clusterName: string;
}
```

**Impact:** Cognitive overhead when reading code. New developers won't understand the terminology disconnect.

**Recommendation:** Rename these files and props. This is a safe refactor—TypeScript will catch all usage sites.

#### 5. Unused Legacy Metadata Files

**Files:**
- `/Users/adj/Documents/Code/app-development/portfolio/lib/clusterMeta.ts` - Exports `clusterMeta` object with resonant/errant/fractured/enclosed
- `/Users/adj/Documents/Code/app-development/portfolio/lib/theme.ts` - Exports `clusterColors` object

**Usage:** Searched codebase—these are NOT imported anywhere. They're orphaned from the old system.

**When this becomes a problem:** Someone (or an LLM) tries to use them thinking they're active, causing runtime errors.

**Recommendation:** Delete both files. If color theming is needed later, implement it properly for the new category system.

#### 6. Type Safety Gaps with `any`

**Problematic Patterns:**

1. **MDX Source Typing** (`/Users/adj/Documents/Code/app-development/portfolio/types/mdx.ts:46,67`):
```typescript
export type MDXSource = {
  frontMatter: MDXProject;
  mdxSource: any;  // ← Should be MDXRemoteSerializeResult
};
```

2. **P5.js Sketch Functions** (`/Users/adj/Documents/Code/app-development/portfolio/app/components/utils/P5Container.tsx`):
```typescript
sketch: any;  // ← Should be (p: P5) => void
const instance: any = new (window as any).p5((p: any) => { ... });
```

3. **YouTube Component** (`/Users/adj/Documents/Code/app-development/portfolio/app/components/media/YouTube.tsx:4`):
```typescript
export function YouTubeComponent(props: any) { ... }
```

4. **Type Coercion in Loader** (`/Users/adj/Documents/Code/app-development/portfolio/lib/content/projects-loader.ts:37`):
```typescript
project.categories?.includes(category as any)
```

**When this breaks:**
- MDX rendering errors won't be caught at compile time
- P5.js type inference fails in editor
- YouTube embed props can be anything, breaking runtime

**Recommendation:**
- Import `MDXRemoteSerializeResult` from `next-mdx-remote/serialize`
- Create `P5Sketch` type: `type P5Sketch = (p: P5) => void` (requires `@types/p5`)
- Define YouTube props interface based on actual usage
- Fix category filtering with proper string literal types

#### 7. Incomplete Migration: Failing Test

**File:** `/Users/adj/Documents/Code/app-development/portfolio/tests/projects-loader.test.ts`

**Failure:**
```
Expected project to match { cluster: 'resonant', ... }
But cluster field no longer exists in schema
```

**Impact:** The test expects the OLD schema but the loader now uses the NEW schema. This means tests aren't validating current behavior.

**This is critical because:** Tests that don't reflect reality give false confidence. The test would pass with old data that would fail in production.

**Recommendation:** Update test fixtures to use `categories` array instead of `cluster` field. Remove `cluster` from assertions.

#### 8. Navigation Component Confusion: Two Nav Systems

**The Problem:**

1. **Desktop/Mobile Nav:** `/Users/adj/Documents/Code/app-development/portfolio/app/components/layout/Nav.tsx` (214 lines) - Main navigation
2. **Floating Nav:** `/Users/adj/Documents/Code/app-development/portfolio/app/components/layout/StickyClusterNav.tsx` (77 lines) - Feature-flagged OFF
3. **Project Nav:** `ClusterProjectNav.tsx` vs `ProjectNavBar.tsx` - Unclear difference

**In `featured/[slug]/page.tsx` (lines 146-150):**
```typescript
<ProjectNavBar
  previousCluster={null}  // Always null
  nextCluster={null}      // Always null
  clusterSlug={null}      // Always null
  clusterName="Projects"  // Hardcoded
/>
```

**Why this is a problem:** Half the props are always null. The component was designed for the old cluster-based navigation but is being used with nulls in the new system.

**Recommendation:**
- Delete `StickyClusterNav.tsx` (it's feature-flagged off permanently)
- Simplify `ProjectNavBar` to remove cluster-related props since they're always null
- Or create a new `SimpleProjectNavBar` without legacy parameters

#### 9. Orphaned Components Directory

**Location:** `/Users/adj/Documents/Code/app-development/portfolio/components/`

**Contents:**
- `SocialLinks.tsx`
- `SubscribeForm.tsx`

**Current Usage:** These files exist but may not be imported. The main components are in `/app/components/`.

**When this becomes confusing:** When adding new shared components and finding two possible locations.

**Recommendation:**
- Search if these are imported anywhere
- If yes, move them to `app/components/` for consistency
- If no, delete them
- The convention should be: ALL components live in `app/components/`

### MINOR SEVERITY

#### 10. Debug Console Statements in Production Code

**Locations:**
- `/Users/adj/Documents/Code/app-development/portfolio/app/components/surreal-systems/FeathersPlaygroundClient.tsx:45,64` - `console.log('Initializing sketch...')`

**Impact:** Pollutes browser console in production. Not a bug, but unprofessional.

**Recommendation:** Remove or wrap in `if (process.env.NODE_ENV === 'development')`.

#### 11. Incomplete ProjectList Reference in Documentation

**CLAUDE.md states:**
> When adding new projects, update `app/components/projectList.ts` with the cluster and slug.

**Problem:** This file doesn't exist in the codebase. It was likely removed during migration.

**Impact:** Following the docs will confuse developers.

**Recommendation:** Update `CLAUDE.md` to remove this instruction. The random project button in `/Users/adj/Documents/Code/app-development/portfolio/app/components/RandomProjectButton.tsx` now receives slugs directly as props from the page.

#### 12. Metadata Still References Old System

**File:** `/Users/adj/Documents/Code/app-development/portfolio/app/config.ts:7`

```typescript
description: "Creative work organized by emotional clusters: resonant, errant, fractured, and enclosed",
```

**Impact:** SEO and OG tags use outdated copy.

**Recommendation:** Update to reflect categories: "Creative work across sound & vision, systems & tools, provocations, and practice & pedagogy" (or similar).

#### 13. RSS Feed Generation Not Validated

**Build Script:** `"build": "next build && node scripts/generateRss.js"`

**Concern:** RSS generation happens AFTER the Next.js build. If it fails, the build still succeeds. No error handling visible.

**Recommendation:** Wrap RSS script in try/catch and exit with error code if it fails, OR run it before `next build` so failures block deployment.

#### 14. Test Coverage Gaps

**Current State:**
- 2 test files
- `/Users/adj/Documents/Code/app-development/portfolio/tests/projects-loader.test.ts` - Has failing test
- `/Users/adj/Documents/Code/app-development/portfolio/tests/new-loaders.test.ts` - 7 passing tests

**Missing Coverage:**
- Category filtering logic (`getProjectsByCategory`)
- Recent projects sorting
- Activity loading
- MDX component rendering
- Navigation prev/next logic

**Recommendation:** Per your testing philosophy, focus on testing core data transformations (loaders, sorting, filtering). But first, fix the failing test so you have a reliable baseline.

---

## Naming Consistency Analysis

### Current Inconsistencies

| Concept | File/Location | Name Used |
|---------|---------------|-----------|
| Main grouping | Types | `categories` (correct) |
| Main grouping | Old lib files | `cluster` (outdated) |
| Main grouping | Components | Mixed (`cluster` in filenames) |
| Project display | Featured route | `/featured/[slug]` |
| Project display | Category route | `/[category]/[slug]` |
| Navigation | Component names | `Nav`, `ProjectNavBar`, `ClusterProjectNav` |

**Recommendation:** Establish glossary:
- **Category** = Main content grouping (Sound & Vision, Systems, etc.)
- **Project** = Individual work
- **Activity** = Sketch/update item
- **Featured** = Route name for individual project pages (keep for backward compat)

Update all file/component names to use these terms consistently.

---

## Component Structure Analysis

### Component Count
- **Total:** 81 TypeScript/TSX files in `/app/components/`
- **Top-level:** 10 components (generally small, focused)
- **Subdirectories:** Well-organized by type

### Largest/Most Complex Components

1. **`ClientMDX.tsx`** (135 lines)
   - **Role:** MDX rendering with 40+ custom component mappings
   - **Complexity:** High - imports everything from mdx-blocks, media, surreal-systems
   - **Issue:** Tightly coupled to ALL project-specific components
   - **Recommendation:** This is acceptable for a portfolio site. To improve: use dynamic imports for heavy components (p5.js playgrounds) to reduce bundle size.

2. **`Nav.tsx`** (214 lines)
   - **Role:** Desktop and mobile navigation with modal menu
   - **Complexity:** Moderate - handles state, keyboard events, focus trapping
   - **Issue:** Mobile menu logic is embedded (lines 139-209)
   - **Recommendation:** Extract `<MobileMenu>` into separate component. The 70-line JSX block for the modal should be its own file.

3. **`SpatialSynthesizer/index.tsx`**
   - **Role:** Complex interactive audio-visual instrument
   - **Complexity:** Very High - has own subdirectory with config/, hooks/, sketch/
   - **Assessment:** Properly modularized with separation of concerns. No changes needed.

### Component Organization Wins

- **`mdx-blocks/`** - 15 reusable MDX components, well-named
- **`media/`** - 6 media embed components, clean abstractions
- **`layout/`** - 8 layout shells, though some need renaming
- **`surreal-systems/`** - Project-specific interactive components isolated

### Suggested Reorganization

**OPTIONAL:** Consider this structure for scaling:
```
app/components/
├── core/           # Reusable primitives (Door, Breadcrumb)
├── layout/         # Page shells and navigation
├── mdx/            # All MDX components (rename from mdx-blocks)
├── media/          # Embeds (YouTube, SoundCloud, etc.)
├── projects/       # Project-specific components
│   ├── surreal-systems/
│   ├── looproom/
│   └── spatial-synthesizer/
└── utils/          # Hooks, helpers, types
```

**But honestly:** Your current structure is fine for a portfolio. Only reorganize if you plan to scale to 50+ projects.

---

## Data Layer Assessment

### Content Loading Pattern

**Strengths:**
- Synchronous file system reads (appropriate for static generation)
- Zod validation catches bad frontmatter at build time
- Clear separation: loaders return typed data, pages consume it

**Concerns:**

1. **No Caching:** `getAllProjects()` reads filesystem every time it's called.
   - **Impact:** In development, this is fine. In build, it's called once per route.
   - **Recommendation:** No changes needed unless you exceed 100+ projects.

2. **Filter Performance** (`getProjectsByCategory`):
```typescript
const allProjects = await getAllProjects();
return allProjects.filter(project =>
  project.categories?.includes(category as any)
);
```
   - **Problem:** Loads all 23 projects to filter for 5.
   - **When this breaks:** At 500+ projects, this becomes slow.
   - **Recommendation:** Current scale is fine. If you exceed 100 projects, add memoization or build-time category indexes.

3. **No Error Recovery:** If one project has invalid frontmatter, it's filtered out silently (except console.warn).
   - **Problem:** You might not notice missing projects until they're deployed.
   - **Recommendation:** In `getAllProjects()`, collect errors and throw at the end if any exist, OR add a `pnpm validate-content` script that runs in CI.

### MDX Content Structure

**23 project MDX files, 3 activity MDX files**

**Validation:** Strong - Zod schemas enforce required fields.

**Migration Status:** Projects still in frontmatter have `categories` field, but 0 files have old `cluster` field (good!). However, test files still expect `cluster`.

---

## Configuration Management

### Current Configuration Files

1. `/Users/adj/Documents/Code/app-development/portfolio/app/config.ts` - Site metadata, social links
2. `/Users/adj/Documents/Code/app-development/portfolio/app/config/features.ts` - Feature flags
3. `/Users/adj/Documents/Code/app-development/portfolio/app/components/utils/categories.ts` - Category metadata
4. `/Users/adj/Documents/Code/app-development/portfolio/types/mdx.ts` - Content schemas
5. `/Users/adj/Documents/Code/app-development/portfolio/tailwind.config.js` - Styles
6. `/Users/adj/Documents/Code/app-development/portfolio/next.config.js` - Next.js + redirects

**Centralization Score: 6/10**

**Problem Areas:**
- Category data duplicated across `categories.ts` and nav components
- Feature flags in separate directory
- Old cluster metadata in orphaned files

**Ideal Structure:**
```typescript
// app/config/index.ts
export { metaData, socialLinks } from './site';
export { categories } from './categories';
export { featureFlags } from './features';
export { ProjectSchema, SketchSchema } from './schemas';
```

**Recommendation:** Consolidate config into `app/config/` directory with a barrel export. Delete orphaned `lib/clusterMeta.ts` and `lib/theme.ts`.

---

## Dead Code Analysis

### Files to Delete

1. **`/Users/adj/Documents/Code/app-development/portfolio/lib/clusterMeta.ts`** - Not imported anywhere
2. **`/Users/adj/Documents/Code/app-development/portfolio/lib/theme.ts`** - Not imported anywhere
3. **`/Users/adj/Documents/Code/app-development/portfolio/next.config.cjs`** - Duplicate config
4. **`/Users/adj/Documents/Code/app-development/portfolio/app/globals.css`** - Not imported, shadowed by global.css

### Components to Review

1. **`StickyClusterNav.tsx`** - Feature-flagged to `false` permanently. If not planning to re-enable, delete.
2. **`/components/SocialLinks.tsx` and `/components/SubscribeForm.tsx`** - Check if imported. If not, delete. If yes, move to `app/components/`.

### Scripts to Audit

**`/Users/adj/Documents/Code/app-development/portfolio/scripts/` directory:**
- `checkBrokenImagePaths.js`
- `findUnusedImages.js`
- `groupImagesByProject.js`
- `migrate-frontmatter.js`
- `moveAndRewriteImages.js`

**Question:** Are `migrate-frontmatter.js` and image migration scripts still needed post-migration?

**Recommendation:** Archive old migration scripts to `scripts/archive/` or delete them to reduce clutter.

---

## Testing Assessment

### Current Coverage

**Passing Tests:** 7/9 (78%)

**Failing Test:** `projects-loader.test.ts` expects old `cluster` field.

**What's Tested:**
- Project loading and validation
- Activity loading
- Frontmatter validation via Zod

**What's Missing:**
- Category filtering logic
- Date sorting edge cases (missing dates)
- Navigation prev/next wrapping behavior
- MDX component rendering
- Related projects selection

### Testing Philosophy Alignment

Per your `CLAUDE.md`, you want:
> Write focused unit tests for core analysis logic only.

**Current Approach:** Tests focus on data loading and validation. Good!

**Gaps Per Your Philosophy:**
- **Core algorithms:** ✅ Loading logic tested
- **Data transformations:** ⚠️ Sorting and filtering not tested
- **Edge cases:** ⚠️ Missing date handling not tested
- **Business rules:** ❌ Category filtering not validated

**Recommendation:**
1. Fix failing test (remove `cluster` from assertions)
2. Add test for `getProjectsByCategory` to ensure filtering works
3. Add test for `getRecentProjects` with missing dates
4. Don't test UI or MDX rendering (per your guidelines)

---

## Documentation Quality

### CLAUDE.md

**Strengths:**
- Clear tech stack description
- Development commands documented
- Architecture overview (routing, content structure)
- ESLint rule callout for quotes

**Outdated Sections:**
- References to "clusters" terminology (line 9)
- Mentions `projectList.ts` which doesn't exist
- Cluster system still described in "Content Structure"

**Recommendation:** Update to reflect:
- Categories (not clusters)
- Remove projectList reference
- Update URL structure examples

### README.md

**Not reviewed in this audit, but:** Check if it aligns with CLAUDE.md updates.

---

## Recommendations by Priority

### IMMEDIATE (Do This Week)

1. **Delete duplicate config files** - `next.config.cjs`, `globals.css`, `clusterMeta.ts`, `theme.ts`
2. **Fix failing test** - Update test fixture to use `categories` instead of `cluster`
3. **Update CLAUDE.md** - Remove cluster references, fix projectList mention
4. **Audit orphaned components** - Check if `/components/SocialLinks.tsx` is used, move or delete

### SHORT-TERM (Next Sprint)

5. **Rename legacy components** - `ClusterProjectNav` → `CategoryProjectNav`, same for hook and sticky nav
6. **Centralize category data** - Single source in `app/config/categories.ts`, remove duplicates in nav components
7. **Simplify ProjectNavBar** - Remove unused cluster props or create simplified version
8. **Add missing tests** - Category filtering, date sorting edge cases
9. **Update site metadata** - Change description from "clusters" to "categories"

### MEDIUM-TERM (When Scaling)

10. **Extract MobileMenu** - Pull 70-line modal from `Nav.tsx` into own component
11. **Type safety improvements** - Replace `any` types with proper interfaces (MDXSource, P5Sketch, YouTube props)
12. **Content validation script** - Add `pnpm validate-content` to catch frontmatter errors in CI
13. **Consolidate config** - Move all config to `app/config/` with barrel export

### LONG-TERM (Future Architecture)

14. **Dynamic imports for heavy components** - Code-split p5.js playgrounds in ClientMDX
15. **Memoize getAllProjects** - If project count exceeds 100
16. **Component reorganization** - Only if scaling to 50+ projects

---

## Risk Assessment

### What Will Break First?

**In 3 Months:**
- Someone tries to use `clusterMeta.ts` thinking it's active → runtime error
- You add a 5th category but forget to update Nav.tsx → inconsistent navigation
- Test suite gives false confidence because failing test is ignored

**In 6 Months:**
- New developer confused by cluster vs category naming → feature built on wrong abstraction
- Config duplication causes drift → categories have different names in different components
- RSS generation fails silently → broken feeds in production

**In 12 Months:**
- Next.js upgrade requires touching webpack config → you edit the wrong next.config file
- Type `any` usage causes runtime error when MDX structure changes
- Navigation props with null values accumulate more edge cases → component becomes unmaintainable

### Blast Radius Analysis

**Most Dangerous Files (change these, break everything):**
1. `/Users/adj/Documents/Code/app-development/portfolio/lib/content/projects-loader.ts` - All pages depend on this
2. `/Users/adj/Documents/Code/app-development/portfolio/types/mdx.ts` - Schema change breaks all content
3. `/Users/adj/Documents/Code/app-development/portfolio/app/components/utils/ClientMDX.tsx` - Renders all MDX, breaks all projects

**Safest to Refactor:**
1. Layout components (isolated to presentation)
2. MDX blocks (self-contained)
3. Media components (simple adapters)

---

## Conclusion

This is a **solid codebase with clear patterns**, but it's at a **critical juncture post-migration**. The biggest risk isn't bugs—it's **technical debt accumulation**. Every month the cluster naming persists, it becomes harder to clean up. Every duplicated config source increases the chance of drift.

**Good News:** None of these issues are blocking. The site works. But they're **compounding complexity** that will slow down future development.

**The Path Forward:**
1. Clean up migration artifacts (1-2 hours)
2. Fix naming and consolidate config (4-6 hours)
3. Add validation tests (2-3 hours)

**Total cleanup cost: ~8-11 hours**

**Cost of NOT fixing: 20+ hours over the next year** debugging inconsistencies, plus elevated risk of production bugs.

The simplest thing that could work long-term is: **Finish the migration completely.** Remove all traces of the old system, consolidate configuration, and establish clear naming conventions. Then you have a clean foundation for the next 2-3 years.

---

**End of Audit**
