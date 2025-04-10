"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface HeroCarouselBlockProps {
  title?: string;
  subtitle?: string;
  images: string[];
}

export default function HeroCarouselBlock({
  title,
  subtitle,
  images = [],
}: HeroCarouselBlockProps) {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const goLeft = () =>
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  const goRight = () => setIndex((prev) => (prev + 1) % images.length);

  // ⌨️ Keyboard nav
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goLeft();
      if (e.key === "ArrowRight") goRight();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Reset fade animation on image index change
  useEffect(() => {
    setLoaded(false);
  }, [index]);

  if (!images.length) return null;

  return (
    <section className="text-center mt-2 mb-10">
      {title && (
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
      )}
      {subtitle && (
        <p className="italic text-lg text-gray-600 mb-6">{subtitle}</p>
      )}

      <div className="flex items-center justify-center gap-4 max-w-5xl mx-auto px-4">
        {/* Left Arrow (hidden on mobile) */}
        <button
          onClick={goLeft}
          className="hidden sm:flex items-center justify-center w-10 h-10 bg-white/90 rounded-full shadow hover:bg-white transition"
        >
          <span className="text-xl">◀</span>
        </button>

        {/* Image */}
        <div className="w-full max-w-3xl max-h-[480px] mx-auto overflow-hidden rounded-xl border border-gray-300">
          <Image
            src={images[index]}
            alt={`Slide ${index + 1}`}
            width={800}
            height={600}
            className={`w-full h-auto object-contain transition-opacity duration-500 ease-in-out ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setLoaded(true)}
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>

        {/* Right Arrow (hidden on mobile) */}
        <button
          onClick={goRight}
          className="hidden sm:flex items-center justify-center w-10 h-10 bg-white/90 rounded-full shadow hover:bg-white transition"
        >
          <span className="text-xl">▶</span>
        </button>
      </div>

      {/* Dots */}
      <div className="mt-4 flex justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition ${
              i === index ? "bg-black" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
