import { z } from "zod";

/**
 * Publication state. One field, three states — this is the contract:
 *
 * | status      | In listings | In sitemap | Built at URL      |
 * |-------------|-------------|------------|-------------------|
 * | published   | yes         | yes        | yes               |
 * | draft       | no          | NO         | yes, with noindex |
 * | archived    | no          | yes        | yes               |
 *
 * `draft`    — in progress. Shareable preview link, invisible to search.
 * `archived` — retired. Unlisted, but the URL stays indexed so existing
 *              inbound links aren't devalued.
 *
 * Run `pnpm content:status` to see what's currently in each state.
 */
export const ContentStatusSchema = z
  .enum(["published", "draft", "archived"])
  .default("published");

export type ContentStatus = z.infer<typeof ContentStatusSchema>;

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
  status: ContentStatusSchema,
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
  status: ContentStatusSchema,
});

export type MDXSketch = z.infer<typeof SketchSchema>;

export type SketchMDXSource = {
  frontMatter: MDXSketch;
  mdxSource: any;
};
