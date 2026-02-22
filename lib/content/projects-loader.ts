import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote-client/serialize";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import { ProjectSchema, MDXProject } from "@/types/mdx";

const projectsDirectory = path.join(process.cwd(), "content/projects");

/** Returns every project including archived — used for generateStaticParams. */
export async function getAllProjectsIncludingArchived(): Promise<MDXProject[]> {
  const fileNames = fs.readdirSync(projectsDirectory);

  const projects = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, "");
    const fullPath = path.join(projectsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    const parsed = ProjectSchema.safeParse({ slug, ...data });
    if (!parsed.success) {
      console.warn(`[getAllProjects] Invalid frontmatter in ${fileName}:`);
      console.warn(parsed.error.format());
      return null;
    }

    return parsed.data;
  });

  return projects.filter(Boolean) as MDXProject[];
}

/** Returns visible (non-archived) projects — used for listings, nav, related works. */
export async function getAllProjects(): Promise<MDXProject[]> {
  const all = await getAllProjectsIncludingArchived();
  return all.filter(p => !p.archived);
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
    console.warn(`[getProjectBySlugOnly] Invalid frontmatter in ${slug}.mdx:`);
    console.warn(parsed.error.format());
    return null;
  }

  const remarkMathPlugin = (remarkMath as unknown as { default?: any }).default ?? remarkMath;
  const rehypeKatexPlugin = (rehypeKatex as unknown as { default?: any }).default ?? rehypeKatex;

  const mdxSource = await serialize({
    source: content,
    options: {
      disableImports: true,
      scope: {},
      mdxOptions: {
        remarkPlugins: [remarkMathPlugin],
        rehypePlugins: [rehypeKatexPlugin],
      },
    },
  });

  return {
    frontMatter: parsed.data,
    mdxSource,
  };
} 
