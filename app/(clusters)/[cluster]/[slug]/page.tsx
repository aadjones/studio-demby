import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/projects_mdx";
import ClientMDX from "@/app/components/ClientMDX";
import Image from "next/image";
import ProjectLayout from "@/app/components/ProjectLayout";
import ProjectNavBar from "@/app/components/ProjectNavBar"; // new import

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

  // Get all projects in the current cluster
  const clusterProjects = allProjects
    .filter((p) => p.cluster === cluster)
    .sort((a, b) => {
      const orderA = a.featuredOrder ?? 999;
      const orderB = b.featuredOrder ?? 999;
      return orderA - orderB;
    });

  // Find index of current project
  const currentIndex = clusterProjects.findIndex((p) => p.slug === slug);

  // Determine previous and next slugs (looping behavior optional)
  const previousProject = currentIndex > 0 ? clusterProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < clusterProjects.length - 1 ? clusterProjects[currentIndex + 1] : null;

  // Cluster name from frontmatter (first project in cluster is enough)
  const clusterName = clusterProjects[0]?.clusterName || cluster;

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
        clusterSlug={cluster}
        clusterName={clusterName}
      />
    </ProjectLayout>
  );
}
