import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlugOnly } from "@/lib/content/projects-loader";
import { MDXProject, MDXSource } from "@/types/mdx";
import ClientMDX from "@/app/components/utils/ClientMDX";
import Image from "next/image";
import ProjectContentShell from "@/app/components/layout/ProjectContentShell";
import ProjectNavBar from "@/app/components/layout/ProjectNavBar";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project: MDXProject) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = params;

  const allProjects: MDXProject[] = await getAllProjects();
  const project: MDXSource | null = await getProjectBySlugOnly(slug);

  if (!project) {
    notFound();
  }

  // Sort projects by date (most recent first) for prev/next navigation
  const sortedProjects = [...allProjects]
    .filter((p) => p.date) // Only include projects with dates
    .sort((a, b) => {
      const dateA = new Date(a.date!).getTime();
      const dateB = new Date(b.date!).getTime();
      return dateB - dateA; // Newest first
    });

  // Find current project index
  const currentIndex = sortedProjects.findIndex((p) => p.slug === slug);
  const totalProjects = sortedProjects.length;

  // Get prev/next projects (with wrap-around)
  const previousProjectData: MDXProject | undefined =
    currentIndex >= 0
      ? sortedProjects[(currentIndex - 1 + totalProjects) % totalProjects]
      : undefined;
  const nextProjectData: MDXProject | undefined =
    currentIndex >= 0
      ? sortedProjects[(currentIndex + 1) % totalProjects]
      : undefined;

  // Conditional hero rendering
  const renderDefaultHero = !project.frontMatter.overrideHero;
  const articleClasses = renderDefaultHero
    ? "mx-auto w-full max-w-3xl px-4 sm:px-6 md:px-8 text-base leading-relaxed space-y-6"
    : "w-full";

  return (
    <>
      <ProjectContentShell>
        {/* Default Hero Block */}
        {renderDefaultHero && (
          <section className="text-center space-y-4 mb-8 md:mb-12">
            {project.frontMatter.image && (
              <Image
                src={project.frontMatter.image}
                alt={project.frontMatter.title || "Project image"}
                width={720}
                height={720}
                className="rounded-lg object-cover mx-auto max-w-md w-full"
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 720px"
              />
            )}
            {project.frontMatter.title && (
              <h1 className="text-3xl font-bold">{project.frontMatter.title}</h1>
            )}
            {project.frontMatter.summary && (
              <p className="italic text-zinc-600">{project.frontMatter.summary}</p>
            )}
          </section>
        )}

        {/* MDX Content */}
        <article className={articleClasses}>
          <ClientMDX
            mdxSource={project.mdxSource}
            frontMatter={project.frontMatter}
          />
        </article>

        {/* Mobile Navigation */}
        <div className="sm:hidden">
          <ProjectNavBar
            previousSlug={previousProjectData?.slug || null}
            nextSlug={nextProjectData?.slug || null}
            previousCluster={null}
            nextCluster={null}
            clusterSlug={null}
            clusterName="Projects"
          />
        </div>
      </ProjectContentShell>
    </>
  );
}
