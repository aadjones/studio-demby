import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote-client/serialize";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import type { ZodError } from "zod";

import { ProjectSchema, MDXProject } from "@/types/mdx";

const projectsDirectory = path.join(process.cwd(), "content/projects");

/** One line per problem, e.g. `date: Expected string, received date`. */
export function describeIssues(error: ZodError): string {
  return error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`).join("; ");
}

/** Every project on disk regardless of status — used for generateStaticParams. */
export async function getAllProjectEntries(): Promise<MDXProject[]> {
  const fileNames = fs.readdirSync(projectsDirectory);

  const projects = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, "");
    const fullPath = path.join(projectsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    // Throw rather than skip: a skipped file vanishes from the site while the build still passes.
    const parsed = ProjectSchema.safeParse({ slug, ...data });
    if (!parsed.success) {
      throw new Error(`Invalid frontmatter in content/projects/${fileName}: ${describeIssues(parsed.error)}`);
    }

    return parsed.data;
  });

  return projects;
}

/** Live projects only — used for listings, nav, related works. */
export async function getAllProjects(): Promise<MDXProject[]> {
  const all = await getAllProjectEntries();
  return all.filter(p => p.status === "published");
}

/** Everything search engines may see: published + archived, never drafts. Used by the sitemap. */
export async function getIndexableProjects(): Promise<MDXProject[]> {
  const all = await getAllProjectEntries();
  return all.filter(p => p.status !== "draft");
}

export async function getProjectsByCategory(category: string): Promise<MDXProject[]> {
  const allProjects = await getAllProjects();
  return allProjects.filter((project) =>
    project.categories?.includes(category as any)
  );
}

export async function getRecentProjects(limit: number = 10): Promise<MDXProject[]> {
  const allProjects = await getAllProjects();

  return allProjects
    .filter((project) => project.date) // Only projects with dates
    .sort((a, b) => {
      const dateA = new Date(a.date!).getTime();
      const dateB = new Date(b.date!).getTime();
      return dateB - dateA; // Newest first
    })
    .slice(0, limit);
}

export async function getProjectBySlugOnly(slug: string) {
  const fullPath = path.join(projectsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // Validate frontmatter
  const parsed = ProjectSchema.safeParse({ slug, ...data });
  if (!parsed.success) {
    throw new Error(`Invalid frontmatter in content/projects/${slug}.mdx: ${describeIssues(parsed.error)}`);
  }

  // Embeds go through a block so they follow the design. Hand-copied <iframe> markup
  // once capped five videos at 576px and drifted from the layout.
  if (/<iframe\b/i.test(content)) {
    throw new Error(
      `Raw <iframe> in content/projects/${slug}.mdx: use <VideoEmbed src="…" title="…" /> instead.`
    );
  }

  // GFM is here for footnotes: `[^key]` in the prose, `[^key]: …` anywhere
  // in the file. It numbers them by order of appearance and builds the list
  // at the end, which hand-numbering would not survive a reorder.
  const remarkGfmPlugin = (remarkGfm as unknown as { default?: any }).default ?? remarkGfm;
  const remarkMathPlugin = (remarkMath as unknown as { default?: any }).default ?? remarkMath;
  const rehypeKatexPlugin = (rehypeKatex as unknown as { default?: any }).default ?? rehypeKatex;

  const mdxSource = await serialize({
    source: content,
    options: {
      disableImports: true,
      scope: {},
      mdxOptions: {
        remarkPlugins: [remarkGfmPlugin, remarkMathPlugin],
        rehypePlugins: [rehypeKatexPlugin],
      },
    },
  });

  return {
    frontMatter: parsed.data,
    mdxSource,
  };
} 
