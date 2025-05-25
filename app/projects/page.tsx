import { getAllProjects } from "@/lib/content/projects-loader";
import Link from "next/link";
import Image from "next/image";
import ProjectCarousel from "@/app/components/carousel/ProjectCarousel";
import { MDXProject } from "@/types/mdx";

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  
  // Sort projects by cluster and then by clusterOrder
  const sortedProjects = [...projects].sort((a: MDXProject, b: MDXProject) => {
    const clusterOrder = ["resonant", "errant", "fractured", "enclosed"];
    const clusterIndexA = clusterOrder.indexOf(a.cluster);
    const clusterIndexB = clusterOrder.indexOf(b.cluster);

    if (clusterIndexA === clusterIndexB) {
      const orderA = Number(a.clusterOrder) ?? 999;
      const orderB = Number(b.clusterOrder) ?? 999;
      return orderA - orderB;
    }

    return clusterIndexA - clusterIndexB;
  });

  return (
    <main className="px-4 py-6 sm:py-8 pb-0">
      <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4">All Projects</h1>
      <p className="text-base sm:text-lg italic mb-6 sm:mb-8 text-zinc-600">
        A collection of all works across clusters
      </p>

      {/* Mobile Carousel */}
      <div className="sm:hidden -mx-4 mb-0">
        <ProjectCarousel 
          projects={sortedProjects}
          imageSize="small"
          showDots={sortedProjects.length > 1}
        />
      </div>

      {/* Desktop Grid */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedProjects.map((project) => (
          <Link key={project.slug} href={`/${project.cluster}/${project.slug}`}>
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
              <p className="text-sm text-gray-500 mt-1 capitalize">{project.cluster}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
} 