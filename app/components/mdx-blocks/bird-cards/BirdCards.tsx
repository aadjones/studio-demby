"use client";

import { useState, useEffect } from "react";
import { birds } from "./birdData";
import CardFront from "./CardFront";
import CardBack from "./CardBack";
import AudioBar from "./AudioBar";
import DuskySparrowNotation from "./notation/DuskySparrow";
import IndianBustardNotation from "./notation/IndianBustard";
import LeastBellsVireoNotation from "./notation/LeastBellsVireo";
import SpoonbilledSandpiperNotation from "./notation/SpoonbilledSandpiper";

const notationMap: Record<string, React.ReactNode> = {
  "dusky-seaside-sparrow": <DuskySparrowNotation />,
  "indian-bustard": <IndianBustardNotation />,
  "least-bells-vireo": <LeastBellsVireoNotation />,
  "spoonbilled-sandpiper": <SpoonbilledSandpiperNotation />,
};

function FlipIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Card outline */}
      <rect x="2" y="2" width="14" height="20" rx="1.5" />
      {/* Tail starts right of card edge, hooks clockwise, shaft comes back left to center */}
      <path d="M16 7 Q23 7 23 12 Q23 17 16 17 L8 17" />
      {/* Arrowhead pointing LEFT */}
      <polyline points="10,15 8,17 10,19" />
    </svg>
  );
}

function BirdCard({ slug, index, activeSlug, onPlay }: {
  slug: string;
  index: number;
  activeSlug: string | null;
  onPlay: (slug: string) => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const [faceFlipped, setFaceFlipped] = useState(false); // lags flipped by half the animation
  const [peeking, setPeeking] = useState(false);
  const bird = birds[index];

  const handleFlip = () => {
    const next = !flipped;
    setFlipped(next);
    setTimeout(() => setFaceFlipped(next), 350);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPeeking(true);
      const end = setTimeout(() => setPeeking(false), 1200);
      return () => clearTimeout(end);
    }, 400 + index * 200);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className="flex flex-col">
      {/* Card with flip */}
      <div
        className="relative cursor-pointer group"
        style={{ perspective: "1200px", WebkitPerspective: "1200px" }}
        onClick={handleFlip}
      >
        <div
          className={`relative w-full min-h-[360px] sm:min-h-[420px] transition-transform duration-700 ease-in-out${peeking ? " animate-card-peek" : ""}`}
          style={{
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            // Let the CSS animation own transform while peeking; inline style would override it
            ...(!peeking ? { transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" } : {}),
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-lg border border-stone-200 dark:border-stone-700
                        bg-[#faf7f2] dark:bg-[#1a1816]"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              visibility: faceFlipped ? "hidden" : "visible",
            }}
          >
            <CardFront bird={bird} />
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 rounded-lg border border-stone-200 dark:border-stone-700
                        bg-[#faf7f2] dark:bg-[#1a1816]"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              visibility: faceFlipped ? "visible" : "hidden",
            }}
          >
            <CardBack bird={bird} notationSvg={notationMap[slug]} />
          </div>
        </div>

        {/* Flip affordance icon */}
        <button
          aria-label="Flip card"
          className="absolute top-3 right-3 z-10 p-2 rounded-full
                     bg-black/35 text-white hover:bg-black/55
                     transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            handleFlip();
          }}
        >
          <FlipIcon />
        </button>
      </div>

      {/* Audio bar — always visible below the card */}
      <div className="mt-1 rounded-b-lg border border-t-0 border-stone-200 dark:border-stone-700
                      bg-[#faf7f2] dark:bg-[#1a1816]">
        <AudioBar
          src={bird.audioSrc}
          isActive={activeSlug === slug}
          onPlay={() => onPlay(slug)}
        />
      </div>
    </div>
  );
}

export default function BirdCards() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 my-8">
      {birds.map((bird, i) => (
        <BirdCard
          key={bird.slug}
          slug={bird.slug}
          index={i}
          activeSlug={activeSlug}
          onPlay={setActiveSlug}
        />
      ))}
    </div>
  );
}
