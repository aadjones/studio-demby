import type { BirdData } from "./birdData";

/** Crosshatch placeholder for artwork (pending permission) */
export default function CardFront({ bird }: { bird: BirdData }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-10 bird-card-text">
      {/* Hatching pattern background */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.07] dark:opacity-[0.06]" aria-hidden>
        <defs>
          <pattern id={`hatch-${bird.slug}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <pattern id={`hatch2-${bird.slug}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#hatch-${bird.slug})`} />
        <rect width="100%" height="100%" fill={`url(#hatch2-${bird.slug})`} />
      </svg>

      {/* Bird name — using div instead of h3 to avoid .prose h3 override */}
      <div className="relative z-10 text-center pr-8">
        <div
          className="font-serif text-2xl sm:text-3xl tracking-[0.2em] uppercase mb-2
                     text-stone-800 dark:text-stone-100"
          style={{ fontWeight: 300 }}
          role="heading"
          aria-level={3}
        >
          {bird.name}
        </div>
        <div className="font-serif text-xs italic text-stone-500 dark:text-stone-400 tracking-wide">
          {bird.species}
        </div>
      </div>

      {/* Placeholder — flex-1 so it fills the space between name and attribution */}
      <div className="relative z-10 flex-1 flex items-center justify-center text-center">
        <div className="font-serif text-2xl sm:text-3xl italic text-stone-400 dark:text-stone-500">
          art goes here
        </div>
      </div>

      {/* Attribution */}
      <div className="relative z-10 font-serif text-[10px] tracking-[0.15em] uppercase text-stone-300 dark:text-stone-600">
        Stacie Birky Greene
      </div>
    </div>
  );
}
