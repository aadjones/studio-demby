"use client";

import Link from "next/link";
import Image from "next/image";
import { MDXProject } from "@/types/mdx";
import ProjectCarousel from "@/app/components/carousel/ProjectCarousel";

type Props = {
  projects: MDXProject[];
};

export default function CategoryProjectList({ projects }: Props) {
  // Always sort by date, newest first
  const sortedProjects = [...projects].sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <>
      {sortedProjects.length === 0 ? (
        <p className="text-gray-500 italic">No projects in this category yet.</p>
      ) : (
        <>
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
              <Link key={project.slug} href={`/featured/${project.slug}`}>
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
                  {project.date && (
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(project.date).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                  <p className="italic text-gray-600">{project.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
