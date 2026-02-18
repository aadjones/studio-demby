"use client";
import { useRef, useState, useEffect } from "react";
import P5FullscreenContainer from "./P5FullscreenContainer";
import bloodFeathersSketch from "./bloodFeathersSketch";

export default function BloodFeathersHeroClient() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Mount sketch on client (deferred to avoid SSR issues)
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden"
      style={{
        height: "100dvh",
        backgroundColor: "#f0f0f0",
        // Break out of PageLayout's max-w-[960px] container
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
      }}
    >
      {/* p5 canvas background — z-0, renders on top of bg color */}
      {mounted && (
        <P5FullscreenContainer
          sketch={bloodFeathersSketch}
          className="absolute inset-0 z-0"
        />
      )}

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-white/20 via-transparent to-white/50" />

      {/* Hero content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center">
        <div className="px-6 py-4 rounded-2xl backdrop-blur-sm bg-white/40">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-gray-900 mb-2">
            Studio Demby
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-body text-gray-700 tracking-wide">
            musician &middot; visual artist &middot; creative coder
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 animate-bounce">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-500"
          >
            <path d="M7 13l5 5 5-5" />
            <path d="M7 7l5 5 5-5" />
          </svg>
        </div>
      </div>
    </section>
  );
}
