"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface LightboxGalleryProps {
  images?: string[];
  title?: string;
}

export default function LightboxGallery({ images = [], title }: LightboxGalleryProps) {
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  // Keyboard nav: Escape closes, arrows cycle
  useEffect(() => {
    if (fullscreenIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreenIndex(null);
      if (e.key === "ArrowRight") setFullscreenIndex(i => i === null ? null : (i + 1) % images.length);
      if (e.key === "ArrowLeft")  setFullscreenIndex(i => i === null ? null : (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fullscreenIndex, images.length]);

  if (!images.length) return null;

  const prev = fullscreenIndex !== null ? (fullscreenIndex - 1 + images.length) % images.length : 0;
  const next = fullscreenIndex !== null ? (fullscreenIndex + 1) % images.length : 0;

  return (
    <>
      {title && (
        <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((src, i) => (
          <div
            key={i}
            className="relative aspect-square rounded-lg overflow-hidden cursor-zoom-in bg-gray-100"
            onClick={() => setFullscreenIndex(i)}
          >
            <Image
              src={src}
              alt={`${title ? title + ", " : ""}image ${i + 1}`}
              fill
              className="object-cover transition-opacity duration-300"
              sizes="(max-width: 640px) 100vw, 50vw"
              quality={75}
            />
          </div>
        ))}
      </div>

      {/* Fullscreen lightbox */}
      {fullscreenIndex !== null && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
          onClick={() => setFullscreenIndex(null)}
        >
          {/* Image */}
          <div className="relative w-[95vw] h-[95dvh]">
            <Image
              src={images[fullscreenIndex]}
              alt={`${title ? title + ", " : ""}image ${fullscreenIndex + 1}`}
              fill
              className="object-contain"
              quality={90}
              sizes="95vw"
            />
          </div>

          {/* Close */}
          <button
            className="absolute top-5 right-6 text-white/70 hover:text-white text-4xl font-light leading-none transition-colors"
            onClick={(e) => { e.stopPropagation(); setFullscreenIndex(null); }}
            aria-label="Close"
          >
            ×
          </button>

          {/* Prev */}
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors text-xl"
            onClick={(e) => { e.stopPropagation(); setFullscreenIndex(prev); }}
            aria-label="Previous image"
          >
            ◀
          </button>

          {/* Next */}
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors text-xl"
            onClick={(e) => { e.stopPropagation(); setFullscreenIndex(next); }}
            aria-label="Next image"
          >
            ▶
          </button>

          {/* Counter */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-xs font-mono tracking-widest">
            {fullscreenIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
