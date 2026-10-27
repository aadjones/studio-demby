import { getAllProjects } from "./projects-loader";
import { MDXProject } from "@/types/mdx";

/** The shape the /work grid needs from a project. */
export interface UnifiedWorkItem {
  title: string;
  slug: string;
  date: string | null;
  image?: string;
  cardVideo?: string;
  summary?: string;
  tags: string[];
  categories: string[];
  externalLink?: string;
}

function projectToWorkItem(p: MDXProject): UnifiedWorkItem {
  return {
    title: p.title,
    slug: p.slug,
    date: p.date ?? null,
    image: p.image,
    cardVideo: p.cardVideo,
    summary: p.summary,
    tags: p.tags,
    categories: p.categories ?? [],
    externalLink: p.externalLink,
  };
}

export async function getAllWork(): Promise<UnifiedWorkItem[]> {
  const workItems = (await getAllProjects()).map(projectToWorkItem);

  // Sort by date, newest first. Items without dates go to the end.
  return workItems.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}
