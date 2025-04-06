"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeSwitch } from "./theme-switch";
import { metaData } from "../config";
import { useRef } from "react";

const navItems: Record<string, { name: string; className?: string }> = {
  "/resonant": {
    name: "Resonant",
    className: "hover:scale-105 hover:text-blue-700 transition-transform duration-200",
  },
  "/errant": {
    name: "Errant",
    className: "errant-hover transition-all duration-150 ease-out",
  },
  "/fractured": {
    name: "Fractured",
    className: "hover:text-red-600 hover:line-through",
  },
  "/enclosed": {
    name: "Enclosed",
    className: "hover:text-zinc-600 hover:tracking-tighter hover:opacity-80",
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
        <div className="flex flex-row gap-4 mt-6 md:mt-0 md:ml-auto items-center">
          {Object.entries(navItems).map(([path, { name, className }]) => {
            const isActive = pathname.startsWith(path);
            const isErrant = path === "/errant";
            return (
              <Link
                key={path}
                href={path}
                ref={isErrant ? errantRef : undefined}
                onMouseEnter={isErrant ? handleErrantHover : undefined}
                className={`flex align-middle relative
                  ${className ?? ""}
                  ${isActive ? "font-semibold underline" : ""}
                `}
                style={
                  isErrant
                    ? ({
                        "--x": "0px",
                        "--y": "0px",
                        "--r": "0deg",
                        transform: "translate(var(--x), var(--y)) rotate(var(--r))",
                      } as React.CSSProperties)
                    : undefined
                }
              >
                {name}
              </Link>
            );
          })}
          <ThemeSwitch />
        </div>
      </div>
    </nav>
  );
}
