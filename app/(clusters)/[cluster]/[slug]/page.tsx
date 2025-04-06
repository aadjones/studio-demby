import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/projects_mdx";
import ClientMDX from "@/app/components/ClientMDX";
import Image from "next/image";
import ProjectLayout from "@/app/components/ProjectLayout";
import ProjectNavBar from "@/app/components/ProjectNavBar"; // new import

const clusterOrder = ["resonant", "errant", "fractured", "enclosed"];

type Props = {
  params: {
    cluster: string;
    slug: string;
  };
};

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    cluster: project.cluster,
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: Props) {
  const { cluster, slug } = params;

  const allProjects = await getAllProjects();
  const project = await getProjectBySlug(cluster, slug);

  if (!project) {
    notFound();
  }

  // Step 1: Sort all projects by cluster → order
  const sortedProjects = [...allProjects].sort((a, b) => {
    const clusterIndexA = clusterOrder.indexOf(a.cluster);
    const clusterIndexB = clusterOrder.indexOf(b.cluster);
  
    if (clusterIndexA === clusterIndexB) {
      const orderA = a.clusterOrder ?? 999;
      const orderB = b.clusterOrder ?? 999;
      return orderA - orderB;
    }
  
    return clusterIndexA - clusterIndexB;
  });
  

  // Step 2: Find index in global project list
  const currentIndex = sortedProjects.findIndex((p) => p.slug === slug && p.cluster === cluster);

  const totalProjects = sortedProjects.length;
  const previousProject = sortedProjects[(currentIndex - 1 + totalProjects) % totalProjects];
  const nextProject = sortedProjects[(currentIndex + 1) % totalProjects];

  const clusterName = project.frontMatter.clusterName || cluster;

  return (
    <ProjectLayout>
      {project.frontMatter.image && (
        <Image
          src={project.frontMatter.image}
          alt={project.frontMatter.title}
          width={720}
          height={720}
          className="rounded-lg object-cover w-full max-w-[512px] mb-6"
          priority
        />
      )}
      <h1 className="text-3xl font-bold mb-2">{project.frontMatter.title}</h1>
      <p className="italic text-zinc-600 mb-4">{project.frontMatter.summary}</p>
      <article className="prose dark:prose-invert prose-headings:mb-4 prose-p:mb-3 prose-img:my-4">
        <ClientMDX mdxSource={project.mdxSource} />
      </article>

      <ProjectNavBar
  previousSlug={previousProject?.slug || null}
  nextSlug={nextProject?.slug || null}
  previousCluster={previousProject?.cluster || null}
  nextCluster={nextProject?.cluster || null}
  clusterSlug={cluster}
  clusterName={clusterName}
/>
    </ProjectLayout>
  );
}

