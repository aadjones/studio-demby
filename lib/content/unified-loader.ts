import { getAllProjects } from "./projects-loader";
import { getAllActivity } from "./activity-loader";
import { MDXProject, MDXSketch } from "@/types/mdx";

/**
 * A unified work item that normalizes projects and activity
 * into a common shape for the /work page grid.
 */
export interface UnifiedWorkItem {
  title: string;
  slug: string;
  date: string | null;
  image?: string;
  summary?: string;
  tags: string[];
  categories: string[];
  contentType: "project" | "activity";
}

function projectToWorkItem(p: MDXProject): UnifiedWorkItem {
  return {
    title: p.title,
    slug: p.slug,
    date: p.date ?? null,
    image: p.image,
    summary: p.summary,
    tags: p.tags,
    categories: p.categories ?? [],
    contentType: "project",
  };
}

function activityToWorkItem(a: MDXSketch): UnifiedWorkItem {
  return {
    title: a.title,
    slug: a.slug,
    date: a.date ?? null,
    image: a.image,
    summary: a.description,
    tags: a.tags ?? [],
    categories: a.categories ?? [],
    contentType: "activity",
  };
}

export async function getAllWork(): Promise<UnifiedWorkItem[]> {
  const [projects, activity] = await Promise.all([
    getAllProjects(),
    getAllActivity(),
  ]);

  const workItems: UnifiedWorkItem[] = [
    ...projects.map(projectToWorkItem),
    ...activity.map(activityToWorkItem),
  ];

  // Sort by date, newest first. Items without dates go to the end.
  return workItems.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}
