"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const clusters = [
  { path: "/resonant", name: "Resonant", className: "hover:scale-105 hover:text-blue-700 transition-transform duration-200" },
  { path: "/errant", name: "Errant", className: "errant-hover transition-all duration-150 ease-out" },
  { path: "/fractured", name: "Fractured", className: "hover:text-red-600 hover:line-through" },
  { path: "/enclosed", name: "Enclosed", className: "hover:text-zinc-600 hover:tracking-tighter hover:opacity-80" }
];

export default function FloatingClusterNav() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const errantRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const navHeight = 64; // Assume nav bar height ~64px
    const handleScroll = () => {
      setShow(window.scrollY > navHeight);
    };

    handleScroll(); // run on mount in case already scrolled
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div
      className={`fixed top-4 right-4 z-50 transition-opacity duration-300 pointer-events-none ${
        show ? "opacity-100 pointer-events-auto" : "opacity-0"
      }`}
    >
      <div className="bg-white/90 dark:bg-black/80 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2 shadow-lg backdrop-blur-md">
        <div className="flex space-x-4 text-sm">
          {clusters.map(({ path, name, className }) => {
            const isActive = pathname.startsWith(path);
            const isErrant = path === "/errant";
            return (
              <Link
                key={path}
                href={path}
                ref={isErrant ? errantRef : undefined}
                onMouseEnter={isErrant ? handleErrantHover : undefined}
                className={`relative ${className ?? ""} ${isActive ? "font-semibold underline" : ""}`}
                style={isErrant
                    ? {
                        ["--x" as any]: "0px",
                        ["--y" as any]: "0px",
                        ["--r" as any]: "0deg",
                        transform: "translate(var(--x), var(--y)) rotate(var(--r))",
                      }
                    : undefined}
              >
                {name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
} 
