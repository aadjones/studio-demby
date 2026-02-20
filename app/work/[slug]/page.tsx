import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getAllProjects, getAllProjectsIncludingArchived, getProjectBySlugOnly } from "@/lib/content/projects-loader";
import { getAllActivity, getAllActivityIncludingArchived, getActivityBySlug } from "@/lib/content/activity-loader";
import { MDXProject, MDXSketch } from "@/types/mdx";
import ClientMDX from "@/app/components/utils/ClientMDX";
import Image from "next/image";
import Link from "next/link";
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Try project first, then activity
  const project = await getProjectBySlugOnly(params.slug);
  if (project) {
    const { title, summary, image } = project.frontMatter;
    const ogImage = image || metaData.ogImage;
    return {
      title,
      description: summary,
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

  const activity = await getActivityBySlug(params.slug);
  if (activity) {
    const { title, description, image } = activity.frontMatter;
    const ogImage = image || metaData.ogImage;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${metaData.baseUrl}work/${params.slug}`,
        siteName: metaData.name,
        images: [{ url: ogImage, alt: title }],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
    };
  }

  return { title: "Not Found" };
}

export async function generateStaticParams() {
  const [projects, activity] = await Promise.all([
    getAllProjectsIncludingArchived(),
    getAllActivityIncludingArchived(),
  ]);
  return [
    ...projects.map((p: MDXProject) => ({ slug: p.slug })),
    ...activity.map((a: MDXSketch) => ({ slug: a.slug })),
  ];
}

// ── Project rendering (reused from featured/[slug]) ──────────────
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

  const renderDefaultHero = !project.frontMatter.overrideHero;
  const articleClasses = renderDefaultHero
    ? "mx-auto w-full max-w-3xl px-4 sm:px-6 md:px-8 text-base leading-relaxed space-y-6"
    : "w-full";

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
      {categoryMeta && (
        <div className="px-4 sm:px-6 md:px-8 pt-4">
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
            <p className="text-sm text-gray-500">
              {new Date(project.frontMatter.date).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
          {project.frontMatter.summary && (
            <p className="italic text-zinc-600">{project.frontMatter.summary}</p>
          )}
        </section>
      )}

      <article className={articleClasses}>
        <ClientMDX mdxSource={project.mdxSource} frontMatter={project.frontMatter} />
      </article>

      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 md:px-8">
        <RelatedWorks projects={relatedProjects} />
        <ProjectNavigation
          previousSlug={previousProjectData?.slug || null}
          nextSlug={nextProjectData?.slug || null}
        />
      </div>
    </ProjectContentShell>
  );
}

// ── Activity rendering (reused from activity/[slug]) ─────────────
function ActivityView({
  item,
  allActivity,
  slug,
}: {
  item: { frontMatter: MDXSketch; mdxSource: any };
  allActivity: MDXSketch[];
  slug: string;
}) {
  const sortedActivity = [...allActivity].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const currentIndex = sortedActivity.findIndex((s) => s.slug === slug);
  const totalItems = sortedActivity.length;
  const nextItem = currentIndex >= 0 ? sortedActivity[(currentIndex + 1) % totalItems] : undefined;
  const previousItem =
    currentIndex >= 0 ? sortedActivity[(currentIndex - 1 + totalItems) % totalItems] : undefined;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <header className="mb-8 border-b border-gray-200 pb-6">
        <Link href="/work" className="text-sm text-gray-500 hover:text-blue-600 mb-4 inline-block">
          &larr; All Work
        </Link>
        <h1 className="text-2xl sm:text-3xl font-normal mb-2">{item.frontMatter.title}</h1>
        <time className="text-sm text-gray-500">{formatDate(item.frontMatter.date)}</time>
      </header>

      <div className="prose prose-sm sm:prose max-w-none">
        <ClientMDX mdxSource={item.mdxSource} frontMatter={item.frontMatter} />
      </div>

      {item.frontMatter.tags && item.frontMatter.tags.length > 0 && (
        <footer className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            {item.frontMatter.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        </footer>
      )}

      <nav className="mt-12 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          {previousItem ? (
            <Link href={`/work/${previousItem.slug}`} className="text-gray-600 hover:text-blue-600">
              &larr; Previous
            </Link>
          ) : (
            <span className="text-gray-400">&larr; Previous</span>
          )}
          {nextItem ? (
            <Link href={`/work/${nextItem.slug}`} className="text-gray-600 hover:text-blue-600">
              Next &rarr;
            </Link>
          ) : (
            <span className="text-gray-400">Next &rarr;</span>
          )}
        </div>
      </nav>
    </main>
  );
}

// ── Main page component ──────────────────────────────────────────
export default async function WorkSlugPage({ params }: Props) {
  const { slug } = params;

  // Try project first
  const project = await getProjectBySlugOnly(slug);
  if (project) {
    const allProjects = await getAllProjects();
    return <ProjectView project={project} allProjects={allProjects} slug={slug} />;
  }

  // Try activity
  const activity = await getActivityBySlug(slug);
  if (activity) {
    const allActivity = await getAllActivity();
    return <ActivityView item={activity} allActivity={allActivity} slug={slug} />;
  }

  notFound();
}
