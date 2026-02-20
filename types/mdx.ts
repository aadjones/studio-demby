import { z } from "zod";

export const ProjectSchema = z.object({
  // Core identity
  title: z.string(),
  slug: z.string(),
  categories: z.array(z.enum(["visual-art", "music", "teaching"])),

  // Descriptions
  summary: z.string(),

  // Media
  image: z.string().optional(),
  images: z.array(z.string()).optional(),

  // Links
  externalLink: z.string().optional(),
  githubLink: z.string().optional(),

  // Metadata
  date: z.string().optional(),
  tags: z.array(z.string()),

  // Layout
  useDefaultHero: z.boolean().optional(),
  relatedSlugs: z.array(z.string()).optional(),
  archived: z.boolean().optional(),
});

export type MDXProject = z.infer<typeof ProjectSchema>;

export type MDXSource = {
  frontMatter: MDXProject;
  mdxSource: any;
};

export const SketchSchema = z.object({
  title: z.string(),
  slug: z.string(),
  date: z.string(),
  categories: z.array(z.enum(["visual-art", "music", "teaching"])).optional().default([]),
  body: z.string().optional(),
  image: z.string().optional(),
  video: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  description: z.string().optional(),
  archived: z.boolean().optional(),
});

export type MDXSketch = z.infer<typeof SketchSchema>;

export type SketchMDXSource = {
  frontMatter: MDXSketch;
  mdxSource: any;
};
