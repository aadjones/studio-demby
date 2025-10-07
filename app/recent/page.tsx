import { getRecentProjects } from "@/lib/content/projects-loader";
import Link from "next/link";
import Image from "next/image";
import ProjectCarousel from "@/app/components/carousel/ProjectCarousel";

export default async function RecentPage() {
  const recentProjects = await getRecentProjects(10);

  return (
    <main className="px-4 py-6 sm:py-8 pb-0">
      <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4">Recent Work</h1>
      <p className="text-base sm:text-lg italic mb-6 sm:mb-8 text-zinc-600">
        Latest projects across all categories
      </p>

      {/* Mobile Carousel */}
      <div className="sm:hidden -mx-4 mb-0">
        <ProjectCarousel
          projects={recentProjects}
          imageSize="small"
          showDots={recentProjects.length > 1}
        />
      </div>

      {/* Desktop Grid */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-8">
        {recentProjects.map((project) => (
          <Link key={project.slug} href={`/projects/${project.slug}`}>
            <div className="group">
              {project.image && (
                <div className="aspect-square relative rounded-xl overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
              )}
              <h2 className="mt-4 text-xl font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {project.title}
              </h2>
              <p className="italic text-gray-600">{project.summary}</p>
              {project.date && (
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(project.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
