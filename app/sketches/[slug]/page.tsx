import { notFound } from "next/navigation";
import { getAllSketches, getSketchBySlug } from "@/lib/content/sketches-loader";
import { MDXSketch } from "@/types/mdx";
import ClientMDX from "@/app/components/utils/ClientMDX";
import Link from "next/link";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const sketches = await getAllSketches();
  return sketches.map((sketch: MDXSketch) => ({
    slug: sketch.slug,
  }));
}

export default async function SketchPage({ params }: Props) {
  const { slug } = params;

  const allSketches: MDXSketch[] = await getAllSketches();
  const sketch = await getSketchBySlug(slug);

  if (!sketch) {
    notFound();
  }

  // Sort sketches by date (most recent first) for prev/next navigation
  const sortedSketches = [...allSketches].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Find current sketch index
  const currentIndex = sortedSketches.findIndex((s) => s.slug === slug);
  const totalSketches = sortedSketches.length;

  // Get prev/next sketches (with wrap-around)
  const previousSketch: MDXSketch | undefined =
    currentIndex >= 0
      ? sortedSketches[(currentIndex - 1 + totalSketches) % totalSketches]
      : undefined;
  const nextSketch: MDXSketch | undefined =
    currentIndex >= 0
      ? sortedSketches[(currentIndex + 1) % totalSketches]
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
          href="/sketches"
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4 inline-block"
        >
          ← All Sketches
        </Link>
        <h1 className="text-2xl sm:text-3xl font-normal mb-2">
          {sketch.frontMatter.title}
        </h1>
        <time className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(sketch.frontMatter.date)}
        </time>
      </header>

      {/* MDX Content */}
      <article className="prose prose-sm sm:prose dark:prose-invert max-w-none">
        <ClientMDX
          mdxSource={sketch.mdxSource}
          frontMatter={sketch.frontMatter}
        />
      </article>

      {/* Metadata Footer */}
      {sketch.frontMatter.tags && sketch.frontMatter.tags.length > 0 && (
        <footer className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
            {sketch.frontMatter.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        </footer>
      )}

      {/* Prev/Next Navigation */}
      <nav className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center text-sm">
          {previousSketch ? (
            <Link
              href={`/sketches/${previousSketch.slug}`}
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              ← {previousSketch.title}
            </Link>
          ) : (
            <span className="text-gray-400 dark:text-gray-600">← Previous</span>
          )}

          {nextSketch ? (
            <Link
              href={`/sketches/${nextSketch.slug}`}
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {nextSketch.title} →
            </Link>
          ) : (
            <span className="text-gray-400 dark:text-gray-600">Next →</span>
          )}
        </div>
      </nav>
    </main>
  );
}
