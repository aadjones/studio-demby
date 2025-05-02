import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/content/projects-loader";

// --- Import your types ---
// Assuming types are correctly located at @/types/mdx
import { MDXProject, MDXSource } from "@/types/mdx";
import ClientMDX from "@/app/components/utils/ClientMDX";

import Image from "next/image";
import ProjectContentShell from "@/app/components/layout/ProjectContentShell";
import ProjectNavBar from "@/app/components/layout/ProjectNavBar";
import StickyClusterNav from "@/app/components/layout/StickyClusterNav";
import { clusterMeta } from "@/lib/clusterMeta";

const clusterOrder = ["resonant", "errant", "fractured", "enclosed"];

type Props = {
  params: {
    cluster: string;
    slug: string;
  };
};

export async function generateStaticParams() {
  // Assuming getAllProjects returns: MDXProject[]
  // (or similar array where each item has at least slug and cluster)
  const projects = await getAllProjects();
  // Map over MDXProject directly
  return projects.map((project: MDXProject) => ({
    cluster: project.cluster, // Access directly from project (MDXProject)
    slug: project.slug,       // Access directly from project (MDXProject)
  }));
}

export default async function ProjectPage({ params }: Props) {
  const { cluster, slug } = params;

  // Assuming getAllProjects returns: MDXProject[]
  const allProjects: MDXProject[] = await getAllProjects();
  // Assuming getProjectBySlug returns: MDXSource | null
  const project: MDXSource | null = await getProjectBySlug(cluster, slug);

  if (!project) {
    notFound();
  }

  // Step 1: Sort all projects (array of MDXProject)
  const sortedProjects = [...allProjects].sort((a: MDXProject, b: MDXProject) => { // Type a, b as MDXProject
    // Access properties directly from a and b
    const clusterIndexA = clusterOrder.indexOf(a.cluster);
    const clusterIndexB = clusterOrder.indexOf(b.cluster);

    if (clusterIndexA === clusterIndexB) {
      const orderA = a.clusterOrder ?? 999;
      const orderB = b.clusterOrder ?? 999;
      return orderA - orderB;
    }

    return clusterIndexA - clusterIndexB;
  });

  // Step 2: Find index in sortedProjects (array of MDXProject)
  const currentIndex = sortedProjects.findIndex((p: MDXProject) => { // Type p as MDXProject
    // Access properties directly from p
    return p.slug === slug && p.cluster === cluster;
  });

  const totalProjects = sortedProjects.length;
  // Type previous/next data as MDXProject | undefined
  const previousProjectData: MDXProject | undefined = sortedProjects[(currentIndex - 1 + totalProjects) % totalProjects];
  const nextProjectData: MDXProject | undefined = sortedProjects[(currentIndex + 1) % totalProjects];

  // Use project.frontMatter (from MDXSource) for current page data
  const clusterName = clusterMeta[project.frontMatter.cluster].title;

  // --- Logic for Conditional Rendering using project.frontMatter (from MDXSource) ---
  const renderDefaultHero = !project.frontMatter.overrideHero;

  const articleClasses = renderDefaultHero
  ? "mx-auto w-full max-w-3xl px-4 sm:px-6 md:px-8 text-base leading-relaxed space-y-6"
  : "w-full";
 // Basic class when MDX handles layout (adjust if needed)
  // --- End Conditional Logic ---

  return (
    <>
      <StickyClusterNav />
      <ProjectContentShell>
        {/* HERO BLOCK - Conditionally Rendered */}
        {/* Data comes from project.frontMatter (MDXSource) */}
        {renderDefaultHero && (
          <section className="text-center space-y-4 mb-8 md:mb-12">
            {project.frontMatter.image && (
              <Image
                src={project.frontMatter.image}
                alt={project.frontMatter.title || 'Project image'}
                width={720}
                height={720}
                className="rounded-lg object-cover mx-auto max-w-md w-full"
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 720px"
              />
            )}
            {project.frontMatter.title && <h1 className="text-3xl font-bold">{project.frontMatter.title}</h1>}
            {project.frontMatter.summary && <p className="italic text-zinc-600">{project.frontMatter.summary}</p>}
          </section>
        )}

        {/* BODY CONTENT */}
        <article className={articleClasses}>
          {/* Pass the mdxSource from the project (MDXSource) */}
          <ClientMDX 
          mdxSource={project.mdxSource}
          frontMatter={project.frontMatter}
           />
        </article>

        {/* STICKY NAV */}
        <ProjectNavBar
          // Use previousProjectData and nextProjectData (MDXProject | undefined)
          previousSlug={previousProjectData?.slug || null} // Access slug directly
          nextSlug={nextProjectData?.slug || null}         // Access slug directly
          previousCluster={previousProjectData?.cluster || null} // Access cluster directly
          nextCluster={nextProjectData?.cluster || null}     // Access cluster directly
          clusterSlug={cluster} // Current cluster from params
          clusterName={clusterName} // Determined above
        />
      </ProjectContentShell>
    </>
  );
}