"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { metaData } from "../../config";
import { JSX, useRef } from "react";

const navItems: Record<
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
  "/about": {
    name: "About",
    className: "hover:text-neutral-600",
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

  return (
    <nav className="lg:mb-16 mb-12 py-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-3xl font-semibold tracking-tight">
            {metaData.title}
          </Link>
        </div>
        <div className="flex flex-wrap gap-4 mt-6 md:mt-0 md:ml-auto items-center">
          {Object.entries(navItems).map(([path, item]) => {
            const { className } = item;
            const isActive = pathname.startsWith(path);
            const isErrant = path === "/errant";
            const content =
              typeof item.name === "string" ? item.name : item.name;

            return (
              <Link
                key={path}
                href={path}
                ref={isErrant ? errantRef : undefined}
                onMouseEnter={isErrant ? handleErrantHover : undefined}
                className={`flex align-middle relative whitespace-nowrap ${className ?? ""} ${
                  isActive ? "font-semibold underline" : ""
                }`}
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
        </div>
      </div>
    </nav>
  );
}
