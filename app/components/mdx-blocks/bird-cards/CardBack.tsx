import type { BirdData } from "./birdData";

interface CardBackProps {
  bird: BirdData;
  notationSvg: React.ReactNode;
}

export default function CardBack({ bird, notationSvg }: CardBackProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-10">
      {/* Notation SVG */}
      <div className="w-full flex justify-center my-auto text-stone-800 dark:text-stone-200">
        {notationSvg}
      </div>

      {/* Divider */}
      <div className="w-16 h-px bg-stone-300 dark:bg-stone-600 mb-4" />

      {/* Mood words — using div to avoid .prose p override */}
      <div
        className="font-serif text-base sm:text-lg italic text-stone-500 dark:text-stone-400 tracking-[0.25em]"
        style={{ fontWeight: 300 }}
      >
        {bird.moods.join(" \u00B7 ")}
      </div>
    </div>
  );
}
