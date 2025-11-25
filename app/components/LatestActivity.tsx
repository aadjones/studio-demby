import Link from "next/link";
import Image from "next/image";
import { StreamItem } from "@/types/mdx";

type Props = {
  items: StreamItem[];
};

export default function LatestActivity({ items }: Props) {
  // Format date as "Nov 2024"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Only show sketches/activity items (no projects), max 6
  const activityItems = items.filter(item => item.type === 'sketch').slice(0, 6);

  if (activityItems.length === 0) return null;

  return (
    <section className="mb-10 sm:mb-12">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
          Latest Activity
        </h2>
        <Link
          href="/activity"
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          View all →
        </Link>
      </div>

      {/* Unified vertical feed */}
      <div className="space-y-3">
        {activityItems.map((item) => {
          const activity = item.data;
          return (
            <Link
              key={activity.slug}
              href={`/activity/${activity.slug}`}
              className="group block border-l-2 border-gray-300 dark:border-gray-700 pl-4 py-3 hover:border-blue-400 dark:hover:border-blue-600 transition-colors bg-gray-50 dark:bg-gray-800/20 rounded-r"
            >
              <div className="flex items-start gap-4">
                {/* Thumbnail if present */}
                {activity.image && (
                  <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden opacity-90 group-hover:opacity-100 transition-opacity border border-gray-300 dark:border-gray-600">
                    <Image
                      src={activity.image}
                      alt={activity.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                      {activity.tags && activity.tags[0] ? activity.tags[0] : 'Sketch'}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {formatDate(activity.date)}
                    </span>
                  </div>
                  <h3 className="font-normal text-base leading-snug text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {activity.title}
                  </h3>
                  {activity.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {activity.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
