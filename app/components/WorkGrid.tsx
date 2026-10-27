"use client";

import { useState } from "react";
import Link from "next/link";
import CardMedia from "@/app/components/CardMedia";
import type { UnifiedWorkItem } from "@/lib/content/unified-loader";
import RandomProjectButton from "@/app/components/RandomProjectButton";

const FILTER_TABS = [
  { label: "Music", filter: "music" },
  { label: "Visual Art", filter: "visual-art" },
  { label: "Teaching", filter: "teaching" },
  { label: "All", filter: "all" },
] as const;

const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${SHORT_MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

function WorkCard({ item, priority }: { item: UnifiedWorkItem; priority: boolean }) {
  return (
    <Link
      href={item.externalLink ?? `/work/${item.slug}`}
      className="group block"
    >
      <div className="aspect-square relative rounded-xl overflow-hidden bg-gray-100">
        {item.image ? (
          <CardMedia
            image={item.image}
            video={item.cardVideo}
            alt={item.title}
            className="transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
            priority={priority}
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

export default function WorkGrid({ items, initialFilter }: { items: UnifiedWorkItem[]; initialFilter: string }) {
  // The page passes the category in; don't read it with useSearchParams. That hook
  // makes Next skip server-rendering the grid, so cards and images waited for JavaScript.
  // /work?category=… reaches a prebuilt page via a rewrite (see next.config.js).
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  // Tabs only change the URL (no navigation), so the page doesn't reload.
  function setFilter(value: string) {
    setActiveFilter(value);
    const params = new URLSearchParams(window.location.search);
    params.set("category", value);
    window.history.replaceState(null, "", `/work?${params.toString()}`);
  }

  const filtered = activeFilter === "all"
    ? items
    : items.filter((item) => item.categories.includes(activeFilter));

  return (
    <div>
      {/* Filter tabs */}
      <div className="sticky top-0 z-10 bg-white py-3 -mt-3 flex flex-wrap gap-1.5 mb-8">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setFilter(tab.filter)}
            className={`px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm rounded-full transition-colors ${
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
        {filtered.map((item, i) => (
          // The first row (two cards on phones) is the page's largest image; load it right away.
          <WorkCard key={`${item.contentType}-${item.slug}`} item={item} priority={i < 2} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 py-12">No work in this category yet.</p>
      )}

      <div className="mt-12 mb-4">
        <RandomProjectButton slugs={filtered.map((i) => i.slug)} />
      </div>
    </div>
  );
}
