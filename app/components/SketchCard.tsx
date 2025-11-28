import Link from "next/link";
import Image from "next/image";
import { MDXSketch } from "@/types/mdx";

type Props = {
  sketch: MDXSketch;
};

export default function SketchCard({ sketch }: Props) {
  // Format date as "Nov 2024"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Link
      href={`/sketches/${sketch.slug}`}
      className="group block border-l-2 border-gray-300 pl-3 py-2 hover:border-blue-400 transition-colors bg-gray-50/50/20 rounded-r"
    >
      {/* Compact horizontal layout */}
      <div className="flex items-start gap-3">
        {/* Small thumbnail if present */}
        {sketch.image && (
          <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden opacity-50 group-hover:opacity-70 transition-opacity">
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
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold">
              Sketch
            </span>
            <span className="text-[11px] text-gray-400">
              {formatDate(sketch.date)}
            </span>
          </div>
          <h3 className="font-light text-sm leading-snug text-gray-700 group-hover:text-blue-600 transition-colors">
            {sketch.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
