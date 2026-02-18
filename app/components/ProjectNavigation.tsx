import Link from "next/link";

type Props = {
  previousSlug: string | null;
  nextSlug: string | null;
};

export default function ProjectNavigation({ previousSlug, nextSlug }: Props) {
  return (
    <nav className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex justify-between items-center text-sm">
        {previousSlug ? (
          <Link
            href={`/work/${previousSlug}`}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <span>←</span>
            <span>Previous</span>
          </Link>
        ) : (
          <div className="text-gray-300">
            <span>← Previous</span>
          </div>
        )}

        {nextSlug ? (
          <Link
            href={`/work/${nextSlug}`}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <span>Next</span>
            <span>→</span>
          </Link>
        ) : (
          <div className="text-gray-300">
            <span>Next →</span>
          </div>
        )}
      </div>
    </nav>
  );
}
