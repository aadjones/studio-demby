"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { featureFlags } from "../../config/features";

const categories = [
  {
    path: "/sound-vision",
    name: "Sound & Vision",
    className: "hover:text-blue-600 transition-colors duration-150",
  },
  {
    path: "/systems-tools",
    name: "Systems & Tools",
    className: "hover:text-blue-600 transition-colors duration-150",
  },
  {
    path: "/provocations",
    name: "Provocations",
    className: "hover:text-blue-600 transition-colors duration-150",
  },
  {
    path: "/practice-pedagogy",
    name: "Practice & Pedagogy",
    className: "hover:text-blue-600 transition-colors duration-150",
  },
];

export default function FloatingClusterNav() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const navHeight = 64;
    const handleScroll = () => {
      setShow(window.scrollY > navHeight);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // If the feature is disabled, don't render anything
  if (!featureFlags.showFloatingClusterNav) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-opacity duration-300 pointer-events-none ${
        show ? "opacity-100 pointer-events-auto" : "opacity-0"
      }`}
    >
      <div className="bg-white/90/80 border border-zinc-300 rounded-xl px-4 py-2 shadow-lg backdrop-blur-md">
        <div className="flex flex-wrap gap-3 text-sm">
          {categories.map(({ path, name, className }) => {
            const isActive = pathname.startsWith(path);

            return (
              <Link
                key={path}
                href={path}
                className={`relative whitespace-nowrap ${className ?? ""} ${
                  isActive ? "font-semibold underline" : ""
                }`}
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
