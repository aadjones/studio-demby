import Link from "next/link";
import Image from "next/image";
import { MDXProject } from "@/types/mdx";
import { categories } from "@/app/components/utils/categories";

type Props = {
  projects: MDXProject[];
};

export default function LatestActivity({ projects }: Props) {
  // Helper to get category name from slug
  const getCategoryName = (categorySlug: string) => {
    const cat = categories.find((c) => c.slug === categorySlug);
    return cat?.name || categorySlug;
  };

  // Format date as "Nov 2024"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Show only first 3 projects
  const displayProjects = projects.slice(0, 3);

  return (
    <section className="mb-8 sm:mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
          Latest Activity
        </h2>
        <Link
          href="/recent"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          View All →
        </Link>
      </div>

      {/* Horizontal grid of cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayProjects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
          >
            {/* Thumbnail */}
            {project.image && (
              <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-900">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-3">
              <h3 className="font-medium text-sm leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                {project.title}
              </h3>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                {project.categories && project.categories[0] && (
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                    {getCategoryName(project.categories[0])}
                  </span>
                )}
                {project.date && (
                  <span className="text-gray-400 dark:text-gray-500">
                    {formatDate(project.date)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
