"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { metaData } from "../../config";
import { featureFlags } from "../../config/features";
import { JSX, useRef } from "react";

const clusterNavItems: Record<
  string,
  { name: string | JSX.Element; className?: string }
> = {
  "/resonant": {
    name: "Resonant",
    className:
      "hover:scale-105 hover:text-blue-700 transition-transform duration-200",
  },
  "/errant": {
    name: "Errant",
    className: "errant-hover transition-all duration-150 ease-out",
  },
  "/fractured": {
    name: (
      <>
        <span className="relative inline-flex group-hover:text-red-600 transition-all duration-150">
          {/* Default state: whole word */}
          <span className="group-hover:opacity-0 transition-opacity duration-150">
            Fractured
          </span>

          {/* Hover state: Frac | tured */}
          <span className="absolute left-0 top-0 w-full h-full flex items-center justify-center gap-[0.15em] group-hover:opacity-100 opacity-0 transition-opacity duration-150">
            <span>Frac</span>
            <span className="text-red-600">|</span>
            <span>tured</span>
          </span>
        </span>
      </>
    ),
    className: "group transition-all duration-150",
  },
  "/enclosed": {
    name: "Enclosed",
    className:
      "hover:text-zinc-600 hover:tracking-tighter hover:opacity-80",
  },
};

export function Navbar() {
  const pathname = usePathname();
  const errantRef = useRef<HTMLAnchorElement>(null);

  const handleErrantHover = () => {
    const el = errantRef.current;
    if (!el) return;
    el.classList.add("animated");
    el.style.setProperty("--x", `${(Math.random() - 0.5) * 12}px`);
    el.style.setProperty("--y", `${(Math.random() - 0.5) * 12}px`);
    el.style.setProperty("--r", `${(Math.random() - 0.5) * 6}deg`);
    setTimeout(() => el.classList.remove("animated"), 150);
  };

  // Cluster paths for easy mapping
  const clusterPaths = Object.keys(clusterNavItems);

  return (
    <nav className="lg:mb-16 mb-12 py-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-3xl font-semibold tracking-tight">
            {metaData.title}
          </Link>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-4 mt-6 sm:mt-0 sm:ml-auto items-center">
          {/* Browse All */}
          <Link
            href="/projects"
            className={`flex items-center gap-1 text-zinc-500 hover:text-blue-600 transition-colors px-2 py-1 rounded-md text-[13px] sm:text-[15px] ${pathname.startsWith("/projects") ? "font-semibold underline text-blue-700" : ""}`}
            aria-label="Browse All Projects"
          >
            {/* Grid Icon */}
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16" aria-hidden="true" className="inline-block align-middle"><rect x="2" y="2" width="4" height="4" rx="1" fill="currentColor"/><rect x="10" y="2" width="4" height="4" rx="1" fill="currentColor"/><rect x="2" y="10" width="4" height="4" rx="1" fill="currentColor"/><rect x="10" y="10" width="4" height="4" rx="1" fill="currentColor"/></svg>
            <span>Browse All</span>
          </Link>

          {/* Divider before clusters */}
          <span className="hidden sm:inline-block border-l border-zinc-300 h-5 mx-2" aria-hidden="true" />

          {/* Cluster Links */}
          {clusterPaths.map((path) => {
            const item = clusterNavItems[path];
            const { className } = item;
            const isActive = pathname.startsWith(path);
            const isErrant = path === "/errant";
            const content = typeof item.name === "string" ? item.name : item.name;
            return (
              <Link
                key={path}
                href={path}
                ref={isErrant ? errantRef : undefined}
                onMouseEnter={isErrant ? handleErrantHover : undefined}
                className={`flex align-middle relative whitespace-nowrap text-[13px] sm:text-[15px] ${className ?? ""} ${isActive ? "font-semibold underline" : ""}`}
                style={
                  isErrant
                    ? ({
                        "--x": "0px",
                        "--y": "0px",
                        "--r": "0deg",
                        transform:
                          "translate(var(--x), var(--y)) rotate(var(--r))",
                      } as React.CSSProperties)
                    : undefined
                }
              >
                {content}
              </Link>
            );
          })}

          {/* Divider after clusters */}
          <span className="hidden sm:inline-block border-l border-zinc-300 h-5 mx-2" aria-hidden="true" />

          {/* About Link */}
          <Link
            href="/about"
            className={`flex items-center gap-1 text-zinc-500 hover:text-blue-600 transition-colors px-2 py-1 rounded-md text-[13px] sm:text-[15px] ${pathname.startsWith("/about") ? "font-semibold underline text-blue-700" : ""}`}
            aria-label="About"
          >
            {/* User Icon */}
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16" aria-hidden="true" className="inline-block align-middle"><circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M2.5 13c.5-2 2.5-3 5.5-3s5 1 5.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span>About</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
