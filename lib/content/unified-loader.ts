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
    categories: inferActivityCategories(a),
    contentType: "activity",
  };
}

/**
 * Infer categories for activity items based on their tags.
 * Activity MDX files don't have a `categories` field, so we map
 * from tags to the closest category for filter tab purposes.
 */
function inferActivityCategories(a: MDXSketch): string[] {
  const tags = (a.tags ?? []).map((t) => t.toLowerCase());

  if (tags.some((t) => ["game", "tool"].includes(t))) {
    return ["systems-tools"];
  }
  if (tags.some((t) => ["satire", "absurd", "linguistics", "reference", "math", "theory", "paper"].includes(t))) {
    return ["provocations"];
  }
  // Default: provocations (most activity items are writing/experiments)
  return ["provocations"];
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
