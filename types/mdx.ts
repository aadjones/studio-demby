import { z } from "zod"; // ⬅ Make sure this is at the top

// 1. Define Zod schema for runtime validation
export const ProjectSchema = z.object({
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  cluster: z.enum(["resonant", "errant", "fractured", "enclosed"]),
  isFeatured: z.boolean(),
  tags: z.array(z.string()),

  subtitle: z.string().optional(),
  date: z.string().optional(),
  whisper: z.string().optional(),
  collapseMode: z.boolean().optional(),
  clusterOrder: z.number().optional(),
  featuredOrder: z.number().optional(),
  overrideHero: z.boolean().optional(),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
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
