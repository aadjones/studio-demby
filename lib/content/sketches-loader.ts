import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import { SketchSchema, MDXSketch } from "@/types/mdx";

const sketchesDirectory = path.join(process.cwd(), "content/sketches");

export async function getSketchBySlug(slug: string) {
  const fullPath = path.join(sketchesDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // Validate frontmatter
  const parsed = SketchSchema.safeParse({ slug, ...data });
  if (!parsed.success) {
    console.warn(`[getSketchBySlug] Invalid frontmatter in ${slug}.mdx:`);
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

export async function getAllSketches(): Promise<MDXSketch[]> {
  // Check if directory exists
  if (!fs.existsSync(sketchesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(sketchesDirectory);

  const sketches = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, "");
    const fullPath = path.join(sketchesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    const parsed = SketchSchema.safeParse({ slug, ...data });
    if (!parsed.success) {
      console.warn(`[getAllSketches] Invalid frontmatter in ${fileName}:`);
      console.warn(parsed.error.format());
      return null;
    }

    return parsed.data;
  });

  return sketches.filter(Boolean) as MDXSketch[];
}

export async function getRecentSketches(limit: number = 10): Promise<MDXSketch[]> {
  const allSketches = await getAllSketches();

  return allSketches
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; // Newest first
    })
    .slice(0, limit);
}
