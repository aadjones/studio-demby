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

  // Legacy fields (keep during migration)
  cluster: z.enum(["resonant", "errant", "fractured", "enclosed"]).optional(),
  clusterOrder: z.number().optional(),

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
