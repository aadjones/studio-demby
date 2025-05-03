"use client";

import { useEffect, useState } from "react";

interface SectionNavProps {
  customLabel?: string;
  customId?: string;
}

export default function SectionNav({ customLabel, customId }: SectionNavProps) {
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
    { label: customLabel || "Make Your Own!", id: customId || "control-panel" },
    { label: "Gallery", id: "gallery" },
  ];

  return (
    <nav className="mt-2 sm:mt-6 mb-8 sm:mb-12 flex flex-col sm:flex-row justify-center gap-2 px-4 sm:px-0">
      {items.map(({ label, id }, i) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          onMouseEnter={() => setHasAnimated(false)}
          className={`px-4 py-2.5 rounded-md shadow-sm border border-zinc-300 dark:border-zinc-700
            text-sm sm:text-base font-semibold tracking-wide w-full sm:w-auto
            bg-white dark:bg-zinc-900
            text-zinc-800 dark:text-zinc-100
            hover:bg-zinc-100 dark:hover:bg-zinc-800
            active:scale-95 transition-all duration-200 ease-in-out
            ${hasAnimated ? "opacity-0 animate-fadeSlideIn" : ""}`}
          style={{ animationDelay: `${i * 150}ms` }}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
