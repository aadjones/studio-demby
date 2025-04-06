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
    {/* HERO BLOCK */}
    <section className="text-center space-y-4">
      {project.frontMatter.image && (
       <Image
       src={project.frontMatter.image}
       alt={project.frontMatter.title}
       width={720}
       height={720}
       className="rounded-lg object-cover mx-auto max-w-md w-full"
       priority
     />
      )}
      <h1 className="text-3xl font-bold">{project.frontMatter.title}</h1>
      <p className="italic text-zinc-600">{project.frontMatter.summary}</p>
    </section>
  
    {/* BODY CONTENT */}
    <article className="prose dark:prose-invert mx-auto prose-headings:mb-4 prose-p:mb-3 prose-img:my-4">
      <ClientMDX mdxSource={project.mdxSource} />
    </article>
  
    {/* STICKY NAV */}
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

