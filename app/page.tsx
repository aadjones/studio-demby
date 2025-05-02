// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getAllProjects } from "@/lib/content/projects-loader";
import { MDXProject } from "@/types/mdx";
import ProjectCarousel from "./components/carousel/ProjectCarousel";

export default async function HomePage() {
  const projects = await getAllProjects();
  const featuredProjects = projects
    .filter((p) => p.isFeatured)
    .sort((a, b) => {
      const orderA = a.featuredOrder ?? 999;
      const orderB = b.featuredOrder ?? 999;
      return orderA - orderB;
    });

  return (
    <main className="container mx-auto px-4 pt-4 sm:pt-8">
      <h1 className="text-[2rem] sm:text-[2.5rem] md:text-4xl font-bold mb-3 leading-none tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
        Aaron Demby Jones
      </h1>
      <p className="text-[0.9rem] sm:text-lg md:text-xl mb-8 leading-none tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
        Artist. Improviser. Builder of strange systems.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Featured Work</h2>
      
      {/* Mobile Carousel */}
      <div className="sm:hidden -mx-4">
        <ProjectCarousel projects={featuredProjects} />
      </div>

      {/* Desktop Grid */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProjects.map((project) => (
          <div key={project.slug} className="flex flex-col group">
            <Link href={`/${project.cluster}/${project.slug}`}>
              <div className="space-y-3">
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
                <h3 className="text-lg font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm italic text-gray-500">{project.summary}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
