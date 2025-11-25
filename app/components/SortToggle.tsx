"use client";

import { useState, useEffect } from "react";

type SortMode = "latest" | "title";

type Props = {
  onSortChange: (mode: SortMode) => void;
};

export default function SortToggle({ onSortChange }: Props) {
  const [sortMode, setSortMode] = useState<SortMode>("latest");

  // Load saved sort preference on mount
  useEffect(() => {
    const saved = localStorage.getItem("project-sort-mode");
    if (saved === "latest" || saved === "title") {
      setSortMode(saved);
      onSortChange(saved);
    }
  }, [onSortChange]);

  const handleSort = (mode: SortMode) => {
    setSortMode(mode);
    localStorage.setItem("project-sort-mode", mode);
    onSortChange(mode);
  };

  return (
    <div className="flex gap-2 mb-6">
      <span className="text-sm text-gray-600 dark:text-gray-400 mr-2 flex items-center">
        Sort by:
      </span>
      <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => handleSort("latest")}
          className={`px-4 py-1.5 text-sm font-medium transition-colors ${
            sortMode === "latest"
              ? "bg-blue-600 text-white dark:bg-blue-500"
              : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          Latest
        </button>
        <button
          onClick={() => handleSort("title")}
          className={`px-4 py-1.5 text-sm font-medium transition-colors border-l border-gray-300 dark:border-gray-700 ${
            sortMode === "title"
              ? "bg-blue-600 text-white dark:bg-blue-500"
              : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          A–Z
        </button>
      </div>
    </div>
  );
}
