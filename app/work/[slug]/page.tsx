import fs from "fs";
import path from "path";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { getAllProjects, getAllProjectEntries, getProjectBySlugOnly } from "@/lib/content/projects-loader";
import { MDXProject } from "@/types/mdx";
import ClientMDX from "@/app/components/utils/ClientMDX";
import Image from "next/image";
import ProjectContentShell from "@/app/components/layout/ProjectContentShell";
import ProjectNavigation from "@/app/components/ProjectNavigation";
import RelatedWorks from "@/app/components/RelatedWorks";
import Breadcrumb from "@/app/components/Breadcrumb";
import { categories } from "@/app/components/utils/categories";
import { metaData } from "@/app/config";

type Props = {
  params: {
    slug: string;
  };
};

/** Drafts get noindex so a shareable preview URL never reaches search. */
const draftRobots = { robots: { index: false, follow: false } } as const;

/** Shown on `status: draft` pages so "is this live?" is answerable in the browser. */
function DraftBanner() {
  return (
    <div className="pt-4">
      <p className="rounded-md border border-amber-400 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-500/60 dark:bg-amber-950/40 dark:text-amber-200">
        <span className="font-semibold">Draft</span> — not listed publicly and
        hidden from search.
      </p>
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlugOnly(params.slug);
  if (project) {
    const { title, summary, image, status } = project.frontMatter;
    const ogImage = image || metaData.ogImage;
    return {
      title,
      description: summary,
      ...(status === "draft" ? draftRobots : {}),
      alternates: {
        canonical: `${metaData.baseUrl}work/${params.slug}`,
      },
      openGraph: {
        title,
        description: summary,
        url: `${metaData.baseUrl}work/${params.slug}`,
        siteName: metaData.name,
        images: [{ url: ogImage, alt: title }],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: summary,
        images: [ogImage],
      },
    };
  }

  return { title: "Not Found" };
}

/**
 * A slug with its own route folder (app/work/contrapose/page.tsx) is served by that page.
 * Generating it here as well writes the same output file twice, and which one wins
 * differed between local and Vercel builds.
 */
const hasOwnRoute = (slug: string) =>
  fs.existsSync(path.join(process.cwd(), "app/work", slug, "page.tsx"));

export async function generateStaticParams() {
  const projects = await getAllProjectEntries();
  return projects.filter((p: MDXProject) => !hasOwnRoute(p.slug)).map((p: MDXProject) => ({ slug: p.slug }));
}

// ── Project rendering ────────────────────────────────────────────
function ProjectView({
  project,
  allProjects,
  slug,
}: {
  project: { frontMatter: MDXProject; mdxSource: any };
  allProjects: MDXProject[];
  slug: string;
}) {
  const sortedProjects = [...allProjects]
    .filter((p) => p.date)
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());

  const currentIndex = sortedProjects.findIndex((p) => p.slug === slug);
  const totalProjects = sortedProjects.length;

  const nextProjectData =
    currentIndex >= 0 ? sortedProjects[(currentIndex + 1) % totalProjects] : undefined;
  const previousProjectData =
    currentIndex >= 0 ? sortedProjects[(currentIndex - 1 + totalProjects) % totalProjects] : undefined;

  const renderDefaultHero = !!project.frontMatter.useDefaultHero;
  const articleClasses = renderDefaultHero
    ? "project-article w-full text-base leading-relaxed space-y-6"
    : "project-article w-full";

  const primaryCategory = project.frontMatter.categories?.[0];
  const categoryMeta = categories.find((c) => c.slug === primaryCategory);

  const pinnedSlugs = project.frontMatter.relatedSlugs ?? [];
  const pinned = pinnedSlugs
    .map((s) => allProjects.find((p) => p.slug === s))
    .filter(Boolean) as MDXProject[];
  const relatedProjects = [
    ...pinned,
    ...allProjects.filter(
      (p) =>
        p.slug !== slug &&
        !pinnedSlugs.includes(p.slug) &&
        p.categories?.some((cat) => project.frontMatter.categories?.includes(cat))
    ),
  ].slice(0, 4);

  return (
    <ProjectContentShell>
      {project.frontMatter.status === "draft" && <DraftBanner />}
      {categoryMeta && (
        <div className="breadcrumb pt-4">
          <Breadcrumb
            categoryName={categoryMeta.name}
            categorySlug={categoryMeta.slug}
            projectTitle={project.frontMatter.title}
          />
        </div>
      )}

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
          {project.frontMatter.date && (
            <p className="text-sm text-ink-500">
              {new Date(project.frontMatter.date).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
          {project.frontMatter.summary && (
            <p className="italic text-ink-700">{project.frontMatter.summary}</p>
          )}
        </section>
      )}

      <article className={articleClasses}>
        <ClientMDX mdxSource={project.mdxSource} frontMatter={project.frontMatter} />
      </article>

      <div className="project-footer w-full">
        <RelatedWorks projects={relatedProjects} />
        <ProjectNavigation
          previousSlug={previousProjectData?.slug || null}
          nextSlug={nextProjectData?.slug || null}
        />
      </div>
    </ProjectContentShell>
  );
}

// ── Main page component ──────────────────────────────────────────
export default async function WorkSlugPage({ params }: Props) {
  const { slug } = params;

  const project = await getProjectBySlugOnly(slug);
  if (!project) notFound();
  // Standalone pages (frontmatter `redirectTo`). Done here rather than in next.config.js
  // so that <Link> prefetches get a redirect instead of a 404.
  if (project.frontMatter.redirectTo) redirect(project.frontMatter.redirectTo);

  const allProjects = await getAllProjects();
  return <ProjectView project={project} allProjects={allProjects} slug={slug} />;
}
