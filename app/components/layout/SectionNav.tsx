"use client";

import { useEffect, useState } from "react";

export default function SectionNav() {
  const [hasAnimated, setHasAnimated] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setHasAnimated(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setHasAnimated(false);
  };

  const items = [
    { label: "What This Is", id: "overview" },
    { label: "Make Your Own!", id: "control-panel" },
    { label: "Gallery", id: "gallery" },
  ];

  return (
    <nav className="mt-10 mb-16 flex justify-center gap-4">
      {items.map(({ label, id }, i) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          onMouseEnter={() => setHasAnimated(false)}
          className={`px-5 py-3 rounded-md shadow-sm border border-zinc-300 dark:border-zinc-700
            text-base font-semibold tracking-wide
            bg-white dark:bg-zinc-900
            text-zinc-800 dark:text-zinc-100
            hover:bg-zinc-100 dark:hover:bg-zinc-800
            hover:scale-105 active:scale-95
            transition-all duration-200 ease-in-out
            ${hasAnimated ? "opacity-0 animate-fadeSlideIn" : ""}`}
          style={{ animationDelay: `${i * 150}ms` }}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
