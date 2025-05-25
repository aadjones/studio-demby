import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

interface ClusterProjectNavProps {
  previousSlug: string | null;
  previousCluster: string | null;
  nextSlug: string | null;
  nextCluster: string | null;
  clusterSlug: string;
  clusterName: string;
  currentProjectTitle: string;
}

export default function ClusterProjectNav({
  previousSlug,
  previousCluster,
  nextSlug,
  nextCluster,
  clusterSlug,
  clusterName,
  currentProjectTitle,
}: ClusterProjectNavProps) {
  return (
    <div className="hidden sm:flex sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm h-12 items-center px-4 w-full">
      <div className="flex items-center justify-between w-full max-w-screen-lg mx-auto">
        {previousSlug && previousCluster ? (
          <Link href={`/${previousCluster}/${previousSlug}`} className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors">
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="hidden md:inline text-base">Previous</span>
          </Link>
        ) : (
          <span className="flex items-center gap-1 text-gray-300 cursor-not-allowed">
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="hidden md:inline text-base">Previous</span>
          </span>
        )}

        <div className="text-center flex-1 font-semibold text-base truncate px-2">
          <span className="text-gray-500 mr-1">{clusterName}:</span>
          <span className="text-gray-900">{currentProjectTitle}</span>
        </div>

        {nextSlug && nextCluster ? (
          <Link href={`/${nextCluster}/${nextSlug}`} className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors justify-end">
            <span className="hidden md:inline text-base">Next</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        ) : (
          <span className="flex items-center gap-1 text-gray-300 cursor-not-allowed justify-end">
            <span className="hidden md:inline text-base">Next</span>
            <ArrowRightIcon className="w-4 h-4" />
          </span>
        )}
      </div>
    </div>
  );
} 