import { notFound } from "next/navigation";
import { getAllActivity, getActivityBySlug } from "@/lib/content/activity-loader";
import { MDXSketch } from "@/types/mdx";
import ClientMDX from "@/app/components/utils/ClientMDX";
import Link from "next/link";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const activity = await getAllActivity();
  return activity.map((item: MDXSketch) => ({
    slug: item.slug,
  }));
}

export default async function ActivityItemPage({ params }: Props) {
  const { slug } = params;

  const allActivity: MDXSketch[] = await getAllActivity();
  const item = await getActivityBySlug(slug);

  if (!item) {
    notFound();
  }

  // Sort activity by date (most recent first) for prev/next navigation
  const sortedActivity = [...allActivity].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Find current item index
  const currentIndex = sortedActivity.findIndex((s) => s.slug === slug);
  const totalItems = sortedActivity.length;

  // Get prev/next items (with wrap-around)
  const previousItem: MDXSketch | undefined =
    currentIndex >= 0
      ? sortedActivity[(currentIndex - 1 + totalItems) % totalItems]
      : undefined;
  const nextItem: MDXSketch | undefined =
    currentIndex >= 0
      ? sortedActivity[(currentIndex + 1) % totalItems]
      : undefined;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      {/* Minimal header */}
      <header className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
        <Link
          href="/activity"
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4 inline-block"
        >
          ← All Activity
        </Link>
        <h1 className="text-2xl sm:text-3xl font-normal mb-2">
          {item.frontMatter.title}
        </h1>
        <time className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(item.frontMatter.date)}
        </time>
      </header>

      {/* MDX Content */}
      <div className="prose prose-sm sm:prose dark:prose-invert max-w-none">
        <ClientMDX
          mdxSource={item.mdxSource}
          frontMatter={item.frontMatter}
        />
      </div>

      {/* Metadata Footer */}
      {item.frontMatter.tags && item.frontMatter.tags.length > 0 && (
        <footer className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
            {item.frontMatter.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        </footer>
      )}

      {/* Prev/Next Navigation */}
      <nav className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center text-sm">
          {previousItem ? (
            <Link
              href={`/activity/${previousItem.slug}`}
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              ← {previousItem.title}
            </Link>
          ) : (
            <span className="text-gray-400 dark:text-gray-600">← Previous</span>
          )}

          {nextItem ? (
            <Link
              href={`/activity/${nextItem.slug}`}
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {nextItem.title} →
            </Link>
          ) : (
            <span className="text-gray-400 dark:text-gray-600">Next →</span>
          )}
        </div>
      </nav>
    </main>
  );
}
