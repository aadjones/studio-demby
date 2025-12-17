import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote-client/serialize";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import { SketchSchema, MDXSketch } from "@/types/mdx";

const activityDirectory = path.join(process.cwd(), "content/activity");

export async function getActivityBySlug(slug: string) {
  const fullPath = path.join(activityDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // Validate frontmatter
  const parsed = SketchSchema.safeParse({ slug, ...data });
  if (!parsed.success) {
    console.warn(`[getActivityBySlug] Invalid frontmatter in ${slug}.mdx:`);
    console.warn(parsed.error.format());
    return null;
  }

  const mdxSource = await serialize({
    source: content,
    options: {
      disableImports: true,
      mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      },
    },
  });

  return {
    frontMatter: parsed.data,
    mdxSource,
  };
}

export async function getAllActivity(): Promise<MDXSketch[]> {
  // Check if directory exists
  if (!fs.existsSync(activityDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(activityDirectory);

  const activity = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, "");
    const fullPath = path.join(activityDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    const parsed = SketchSchema.safeParse({ slug, ...data });
    if (!parsed.success) {
      console.warn(`[getAllActivity] Invalid frontmatter in ${fileName}:`);
      console.warn(parsed.error.format());
      return null;
    }

    return parsed.data;
  });

  return activity.filter(Boolean) as MDXSketch[];
}

export async function getRecentActivity(limit: number = 10): Promise<MDXSketch[]> {
  const allActivity = await getAllActivity();

  return allActivity
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; // Newest first
    })
    .slice(0, limit);
}
