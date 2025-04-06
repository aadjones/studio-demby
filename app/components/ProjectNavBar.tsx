"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ProjectNavBarProps {
  previousSlug: string | null;
  nextSlug: string | null;
  clusterSlug: string;
  clusterName: string;
}

export default function ProjectNavBar({
  previousSlug,
  nextSlug,
  clusterSlug,
  clusterName,
}: ProjectNavBarProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = (scrollTop + winHeight) / docHeight;

      if (scrollPercent > 0.85) { // You can tweak this later
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 w-full z-50 transition-opacity duration-300 pointer-events-none ${
        show ? "opacity-100 pointer-events-auto" : "opacity-0"
      } bg-white/80 backdrop-blur-sm border-t border-gray-300`}
    >
      <div className="max-w-screen-lg mx-auto px-4 py-2 flex justify-between text-sm font-medium text-gray-800">
        {previousSlug ? (
          <Link href={`/${clusterSlug}/${previousSlug}`} className="hover:underline">
            ← Previous
          </Link>
        ) : (
          <span className="text-gray-400">← Previous</span>
        )}

        <Link href={`/${clusterSlug}`} className="hover:underline">
          ↻ Back to {clusterName}
        </Link>

        {nextSlug ? (
          <Link href={`/${clusterSlug}/${nextSlug}`} className="hover:underline">
            Next →
          </Link>
        ) : (
          <span className="text-gray-400">Next →</span>
        )}
      </div>
    </div>
  );
}
