import { getAllProjects } from "@/lib/content/projects-loader";
import Link from "next/link";
import Image from "next/image";
import ProjectCarousel from "@/app/components/carousel/ProjectCarousel";

type Props = {
  params: {
    cluster: string;
  };
};

const clusterDescriptions: Record<string, string> = {
  resonant: "Sound that remembers itself.",
  errant: "Wrong turns. Mischief.",
  fractured: "Beauty in the broken.",
  enclosed: "A sealed room, still vibrating.",
};

export default async function ClusterLandingPage({ params }: Props) {
  const projects = await getAllProjects();
  const cluster = params.cluster;
  const filtered = projects
    .filter((p) => p.cluster === cluster)
    .sort((a, b) => {
      const orderA = Number(a.clusterOrder) ?? 999;
      const orderB = Number(b.clusterOrder) ?? 999;
      return orderA - orderB;
    });
  const description = clusterDescriptions[cluster] ?? "";

  return (
    <main className="px-4 py-6 sm:py-8 pb-0">
      <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4 capitalize">{cluster}</h1>
      <p className="text-base sm:text-lg italic mb-6 sm:mb-8 text-zinc-600">{description}</p>

      {/* Mobile Carousel */}
      <div className="sm:hidden -mx-4 mb-0">
        <ProjectCarousel 
          projects={filtered}
          imageSize="small"
          showDots={filtered.length > 1}
        />
      </div>

      {/* Desktop Grid */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((project) => (
          <Link key={project.slug} href={`/${cluster}/${project.slug}`}>
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
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
