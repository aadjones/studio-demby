"use client";
import { useRef, useState, useEffect } from "react";
import P5FullscreenContainer from "./P5FullscreenContainer";
import bloodFeathersSketch from "./bloodFeathersSketch";
import PianoDLogo from "@/app/components/layout/PianoDLogo";

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
      className="relative overflow-hidden bg-paper"
      style={{
        height: "70dvh",
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
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-paper/20 via-transparent to-paper/40" />

      {/* Hero content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center">
        <div className="hero-title-fade px-2 py-4 sm:px-6">
          {/* aria-label: the "D" is an SVG, so the text alone reads as "Studio emby" */}
          <h1
            aria-label="Studio Demby"
            // nowrap: the wordmark must never split (at 320px it broke between the D and "emby").
            className="whitespace-nowrap text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-ink-900 mb-2"
          >
            Studio{" "}
            <PianoDLogo
              className="inline-block align-baseline"
              style={{ height: "0.73em", width: "auto" }}
            />
            emby
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-body text-ink-700 tracking-wide">
            musician &middot; artist &middot; educator
          </p>
        </div>
      </div>
    </section>
  );
}
