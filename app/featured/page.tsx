import { getAllProjects } from "@/lib/content/projects-loader";
import CategoryProjectList from "@/app/components/CategoryProjectList";

export default async function FeaturedPage() {
  const projects = await getAllProjects();

  return (
    <main className="px-4 py-6 sm:py-8 pb-0">
      <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4">Featured</h1>
      <p className="text-base sm:text-lg italic mb-6 sm:mb-8 text-zinc-600">
        Polished work across all four areas
      </p>

      <CategoryProjectList projects={projects} />
    </main>
  );
} 