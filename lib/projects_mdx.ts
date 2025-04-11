import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import { ProjectSchema, MDXProject } from "@/types/mdx";

const projectsDirectory = path.join(process.cwd(), "content/projects");

export async function getProjectBySlug(cluster: string, slug: string) {
  const fullPath = path.join(projectsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // Verify cluster match before continuing
  if (data.cluster !== cluster) return null;

  // Validate frontmatter
  const parsed = ProjectSchema.safeParse({ slug, ...data });
  if (!parsed.success) {
    console.warn(`[getProjectBySlug] Invalid frontmatter in ${slug}.mdx:`);
    console.warn(parsed.error.format());
    return null;
  }

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    },
  });

  return {
    frontMatter: parsed.data,
    mdxSource,
  };
}

export async function getAllProjects(): Promise<MDXProject[]> {
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
