import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { getAllActivity } from "@/lib/content/activity-loader";
import { metaData } from "@/app/config";

export const metadata: Metadata = {
  title: "Activity",
  description: "Quick thoughts, works in progress, field notes from Studio Demby.",
  openGraph: {
    title: "Activity",
    description: "Quick thoughts, works in progress, field notes from Studio Demby.",
    url: `${metaData.baseUrl}activity`,
    siteName: metaData.name,
    images: [
      {
        url: metaData.ogImage,
        alt: "Studio Demby Activity",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Activity | Studio Demby",
    description: "Quick thoughts, works in progress, field notes from Studio Demby.",
    images: [metaData.ogImage],
  },
};

export default async function ActivityPage() {
  const activity = await getAllActivity();

  // Sort by date (newest first)
  const sortedActivity = activity.sort((a, b) => {
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
      <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4">Activity</h1>
      <p className="text-base sm:text-lg italic mb-6 sm:mb-8 text-zinc-600">
        Quick thoughts, works in progress, field notes
      </p>

      {sortedActivity.length === 0 ? (
        <p className="text-gray-500 italic">No activity yet.</p>
      ) : (
        <div className="space-y-6 max-w-3xl">
          {sortedActivity.map((item) => (
            <Link
              key={item.slug}
              href={`/activity/${item.slug}`}
              className="block group"
            >
              <article className="border-l-2 border-gray-200 pl-4 py-2 hover:border-blue-400 transition-colors">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  {item.image && (
                    <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden opacity-90 group-hover:opacity-100 transition-opacity border border-gray-300">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-4 mb-2">
                      <h2 className="text-xl font-normal group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h2>
                      <time className="text-sm text-gray-400 whitespace-nowrap">
                        {formatDate(item.date)}
                      </time>
                    </div>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-gray-500"
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
