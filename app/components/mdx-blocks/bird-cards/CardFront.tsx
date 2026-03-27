import Image from "next/image";
import type { BirdData } from "./birdData";

export default function CardFront({ bird }: { bird: BirdData }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-lg">
      {/* Artwork */}
      <Image
        src={bird.imageSrc}
        alt={`${bird.name} — artwork by Stacie Birky Greene`}
        fill
        priority
        className="object-contain"
        sizes="(max-width: 640px) 100vw, 50vw"
      />

      {/* Name / species overlay at bottom */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-5 py-4
                      bg-gradient-to-t from-black/50 to-transparent text-center">
        <div
          className="font-serif text-lg sm:text-xl tracking-[0.08em] uppercase
                     text-white leading-tight"
          style={{ fontWeight: 300 }}
          role="heading"
          aria-level={3}
        >
          {bird.name}
        </div>
        <div className="font-serif text-[11px] italic text-white/70 tracking-wide mt-0.5">
          by Stacie Birky Greene
        </div>
      </div>
    </div>
  );
}
