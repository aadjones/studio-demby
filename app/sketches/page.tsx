import Link from "next/link";
import Image from "next/image";
import { getAllSketches } from "@/lib/content/sketches-loader";

export default async function SketchesPage() {
  const sketches = await getAllSketches();

  // Sort by date (newest first)
  const sortedSketches = sketches.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Format date as "Nov 2024"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="px-4 py-6 sm:py-8 pb-0">
      <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4">Sketches</h1>
      <p className="text-base sm:text-lg italic mb-6 sm:mb-8 text-zinc-600 dark:text-zinc-400">
        Quick thoughts, works in progress, field notes
      </p>

      {sortedSketches.length === 0 ? (
        <p className="text-gray-500 italic">No sketches yet.</p>
      ) : (
        <div className="space-y-6 max-w-3xl">
          {sortedSketches.map((sketch) => (
            <Link
              key={sketch.slug}
              href={`/sketches/${sketch.slug}`}
              className="block group"
            >
              <article className="border-l-2 border-gray-200 dark:border-gray-800 pl-4 py-2 hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  {sketch.image && (
                    <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden opacity-70 group-hover:opacity-90 transition-opacity">
                      <Image
                        src={sketch.image}
                        alt={sketch.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-4 mb-2">
                      <h2 className="text-xl font-normal group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {sketch.title}
                      </h2>
                      <time className="text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap">
                        {formatDate(sketch.date)}
                      </time>
                    </div>
                    {sketch.tags && sketch.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {sketch.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-gray-500 dark:text-gray-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
