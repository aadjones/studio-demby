"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { metaData } from "../../config";
import { featureFlags } from "../../config/features";
import { useState, useEffect } from "react";

const categoryNavItems: Record<
  string,
  { name: string; className?: string }
> = {
  "/sound-vision": {
    name: "Sound & Vision",
    className: "hover:text-blue-600 transition-colors duration-150",
  },
  "/systems-tools": {
    name: "Systems",
    className: "hover:text-blue-600 transition-colors duration-150",
  },
  "/provocations": {
    name: "Provocations",
    className: "hover:text-blue-600 transition-colors duration-150",
  },
  "/practice-pedagogy": {
    name: "Practice",
    className: "hover:text-blue-600 transition-colors duration-150",
  },
};

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on ESC
  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  // Focus trap for modal
  useEffect(() => {
    if (!menuOpen) return;
    const first = document.getElementById("mobile-menu-close");
    first?.focus();
  }, [menuOpen]);

  // Category paths for easy mapping
  const categoryPaths = Object.keys(categoryNavItems);

  return (
    <nav className="lg:mb-16 mb-12 py-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        {/* Desktop Nav */}
        <div className="hidden lg:flex gap-2 items-center">
          {/* Home */}
          <Link
            href="/"
            className={`flex items-center gap-1 text-zinc-500 hover:text-blue-600 transition-colors px-1.5 py-1 rounded-md text-[15px] ${pathname === "/" ? "font-semibold underline text-blue-700" : ""}`}
            aria-label="Home"
          >
            {/* House Icon */}
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16" aria-hidden="true" className="inline-block align-middle"><path d="M2 6l6-4 6 4v7a1 1 0 01-1 1H3a1 1 0 01-1-1V6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M6 13V9h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span>Home</span>
          </Link>

          {/* Featured */}
          <Link
            href="/featured"
            className={`flex items-center gap-1 text-zinc-500 hover:text-blue-600 transition-colors px-1.5 py-1 rounded-md text-[15px] ${pathname.startsWith("/featured") ? "font-semibold underline text-blue-700" : ""}`}
            aria-label="Featured"
          >
            {/* Star Icon */}
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16" aria-hidden="true" className="inline-block align-middle"><path d="M8 2l1.5 4.5H14l-3.5 2.5 1.5 4.5L8 11l-4 2.5 1.5-4.5L2 6.5h4.5L8 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/></svg>
            <span>Featured</span>
          </Link>

          {/* Activity */}
          <Link
            href="/activity"
            className={`flex items-center gap-1 text-zinc-500 hover:text-blue-600 transition-colors px-1.5 py-1 rounded-md text-[15px] ${pathname.startsWith("/activity") ? "font-semibold underline text-blue-700" : ""}`}
            aria-label="Activity"
          >
            {/* Pencil Icon */}
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16" aria-hidden="true" className="inline-block align-middle"><path d="M11.5 2.5l2 2-7 7-2.5.5.5-2.5 7-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 4l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span>Activity</span>
          </Link>

          {/* Divider before categories */}
          <span className="inline-block border-l border-zinc-300 h-6 mx-1.5" aria-hidden="true" />

          {/* Category Links */}
          {categoryPaths.map((path) => {
            const item = categoryNavItems[path];
            const { className } = item;
            const isActive = pathname.startsWith(path);
            return (
              <Link
                key={path}
                href={path}
                className={`flex items-center px-1.5 py-1 relative whitespace-nowrap text-[15px] ${className ?? ""} ${isActive ? "font-semibold underline" : ""}`}
              >
                {item.name}
              </Link>
            );
          })}

          {/* Divider after categories */}
          <span className="inline-block border-l border-zinc-300 h-6 mx-1.5" aria-hidden="true" />

          {/* About Link */}
          <Link
            href="/about"
            className={`flex items-center gap-1 text-zinc-500 hover:text-blue-600 transition-colors px-1.5 py-1 rounded-md text-[15px] ${pathname.startsWith("/about") ? "font-semibold underline text-blue-700" : ""}`}
            aria-label="About"
          >
            {/* User Icon */}
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16" aria-hidden="true" className="inline-block align-middle"><circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M2.5 13c.5-2 2.5-3 5.5-3s5 1 5.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span>About</span>
          </Link>
        </div>
        {/* Hamburger for Mobile */}
        <button
          className="lg:hidden ml-auto p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 28 28" aria-hidden="true">
            <rect y="6" width="28" height="2.5" rx="1.25" fill="currentColor" />
            <rect y="13" width="28" height="2.5" rx="1.25" fill="currentColor" />
            <rect y="20" width="28" height="2.5" rx="1.25" fill="currentColor" />
          </svg>
        </button>
        {/* Mobile Menu Modal */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-end lg:hidden">
            <div className="w-full max-w-xs bg-white h-full shadow-xl flex flex-col p-6 relative animate-slideInRight">
              <button
                id="mobile-menu-close"
                className="self-end mb-6 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                tabIndex={0}
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <nav className="flex flex-col gap-4 mt-2" aria-label="Mobile menu">
                <Link
                  href="/"
                  className={`flex items-center gap-2 text-zinc-700 hover:text-blue-600 transition-colors px-2 py-2 rounded-md text-lg ${pathname === "/" ? "font-semibold underline text-blue-700" : ""}`}
                  aria-label="Home"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 16 16" aria-hidden="true" className="inline-block align-middle"><path d="M2 6l6-4 6 4v7a1 1 0 01-1 1H3a1 1 0 01-1-1V6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M6 13V9h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span>Home</span>
                </Link>
                <Link
                  href="/featured"
                  className={`flex items-center gap-2 text-zinc-700 hover:text-blue-600 transition-colors px-2 py-2 rounded-md text-lg ${pathname.startsWith("/featured") ? "font-semibold underline text-blue-700" : ""}`}
                  aria-label="Featured"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 16 16" aria-hidden="true" className="inline-block align-middle"><path d="M8 2l1.5 4.5H14l-3.5 2.5 1.5 4.5L8 11l-4 2.5 1.5-4.5L2 6.5h4.5L8 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/></svg>
                  <span>Featured</span>
                </Link>
                <Link
                  href="/activity"
                  className={`flex items-center gap-2 text-zinc-700 hover:text-blue-600 transition-colors px-2 py-2 rounded-md text-lg ${pathname.startsWith("/activity") ? "font-semibold underline text-blue-700" : ""}`}
                  aria-label="Activity"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 16 16" aria-hidden="true" className="inline-block align-middle"><path d="M11.5 2.5l2 2-7 7-2.5.5.5-2.5 7-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 4l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  <span>Activity</span>
                </Link>
                <hr className="border-zinc-200 my-1" />
                {categoryPaths.map((path) => {
                  const item = categoryNavItems[path];
                  const isActive = pathname.startsWith(path);
                  return (
                    <Link
                      key={path}
                      href={path}
                      className={`flex items-center gap-2 text-zinc-700 px-2 py-2 rounded-md text-lg ${isActive ? "font-semibold underline" : ""}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  );
                })}
                <hr className="border-zinc-200 my-1" />
                <Link
                  href="/about"
                  className={`flex items-center gap-2 text-zinc-700 hover:text-blue-600 transition-colors px-2 py-2 rounded-md text-lg ${pathname.startsWith("/about") ? "font-semibold underline text-blue-700" : ""}`}
                  aria-label="About"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 16 16" aria-hidden="true" className="inline-block align-middle"><circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M2.5 13c.5-2 2.5-3 5.5-3s5 1 5.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  <span>About</span>
                </Link>
              </nav>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
