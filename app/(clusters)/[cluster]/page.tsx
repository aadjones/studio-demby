import { getAllProjects } from "@/lib/projects_mdx";
import Link from "next/link";
import Image from "next/image";

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
    <main className="px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 capitalize">{cluster}</h1>
      <p className="text-lg italic mb-8 text-zinc-600">{description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((project) => (
          <Link key={project.slug} href={`/${cluster}/${project.slug}`}>
            <div className="group">
              {project.image && (
                <Image
                  src={project.image}
                  alt={project.title}
                  width={400}
                  height={400}
                  className="rounded-md object-cover group-hover:opacity-90"
                />
              )}
              <h2 className="mt-4 text-xl font-medium">{project.title}</h2>
              <p className="italic text-gray-600">{project.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
