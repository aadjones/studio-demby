"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { UnifiedWorkItem } from "@/lib/content/unified-loader";

const FILTER_TABS = [
  { label: "All", filter: null },
  { label: "Sound & Vision", filter: "sound-vision" },
  { label: "Tools", filter: "systems-tools" },
  { label: "Writing", filter: "provocations" },
  { label: "Teaching", filter: "practice-pedagogy" },
] as const;

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function WorkCard({ item }: { item: UnifiedWorkItem }) {
  return (
    <Link
      href={`/work/${item.slug}`}
      className="group block"
    >
      <div className="aspect-square relative rounded-xl overflow-hidden bg-gray-100">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            {item.title}
          </div>
        )}
      </div>
      <h3 className="mt-2 text-sm sm:text-base font-display font-semibold leading-tight group-hover:text-gray-600 transition-colors">
        {item.title}
      </h3>
      {item.date && (
        <p className="text-xs text-gray-400 mt-0.5">{formatDate(item.date)}</p>
      )}
      {item.summary && (
        <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">{item.summary}</p>
      )}
    </Link>
  );
}

export default function WorkGrid({ items }: { items: UnifiedWorkItem[] }) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filtered = activeFilter
    ? items.filter((item) => item.categories.includes(activeFilter))
    : items;

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1.5 mb-8">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveFilter(tab.filter)}
            className={`px-2 py-1 text-xs rounded-full transition-colors ${
              activeFilter === tab.filter
                ? "bg-ink-900 text-white"
                : "bg-neutral-100 text-ink-500 hover:bg-neutral-200 hover:text-ink-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {filtered.map((item) => (
          <WorkCard key={`${item.contentType}-${item.slug}`} item={item} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 py-12">No work in this category yet.</p>
      )}
    </div>
  );
}
