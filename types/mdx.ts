import { z } from "zod"; // ⬅ Make sure this is at the top

// 1. Define Zod schema for runtime validation
export const ProjectSchema = z.object({
  // Core identity
  title: z.string(),
  slug: z.string(),
  type: z.enum(["audio", "video", "app", "writing", "teaching", "interactive", "essay", "audiovisual"]),

  // New multi-category system
  categories: z.array(z.enum(["sound-vision", "systems-tools", "provocations", "practice-pedagogy"])),

  // Descriptions
  summary: z.string(),           // Short (1 sentence)
  description: z.string().optional(),  // Long (2-3 paragraphs) - optional during migration

  // Media
  image: z.string().optional(),
  images: z.array(z.string()).optional(),

  // Links
  externalLink: z.string().optional(),
  githubLink: z.string().optional(),

  // Metadata
  date: z.string().optional(),   // ISO date for sorting
  tags: z.array(z.string()),
  isFeatured: z.boolean().default(false),

  // Optional fields
  subtitle: z.string().optional(),
  whisper: z.string().optional(),
  collapseMode: z.boolean().optional(),
  featuredOrder: z.number().optional(),
  overrideHero: z.boolean().optional(),
  fieldNumber: z.string().optional(),
  phaseState: z.enum(["awakening", "expansion", "collapse"]).optional(),
});

// 2. Type inferred from the Zod schema (used across app)
export type MDXProject = z.infer<typeof ProjectSchema>;

// 3. Full MDXSource shape used in getProjectBySlug
export type MDXSource = {
  frontMatter: MDXProject;
  mdxSource: any;
};

// 4. Define Zod schema for Sketch content type
export const SketchSchema = z.object({
  title: z.string(),
  slug: z.string(),
  date: z.string(), // Required for sketches
  body: z.string().optional(), // The markdown/MDX content
  image: z.string().optional(),
  video: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  description: z.string().optional(), // Short description for activity feed
});

// 5. Type inferred from the Sketch schema
export type MDXSketch = z.infer<typeof SketchSchema>;

// 6. Full MDXSource shape for sketches
export type SketchMDXSource = {
  frontMatter: MDXSketch;
  mdxSource: any;
};

// 7. Unified stream item type for homepage
export type StreamItem =
  | { type: 'project'; data: MDXProject }
  | { type: 'sketch'; data: MDXSketch };
