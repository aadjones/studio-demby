"use client";

import React from 'react';
import { useCallback, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import useEmblaCarousel from 'embla-carousel-react';

interface HeroCarouselBlockProps {
  title?: string;
  subtitle?: string;
  images?: string[];
  frontmatter?: {
    images?: string[];
  };
  dotActiveClass?: string;
  dotInactiveClass?: string;
  tall?: boolean; // Use viewport-height sizing instead of fixed aspect ratio
}

export default function HeroCarouselBlock({
  title,
  subtitle,
  images = [],
  frontmatter = {},
  dotActiveClass = "bg-white",
  dotInactiveClass = "bg-white/50",
  tall = false,
}: HeroCarouselBlockProps) {
  const imageList = useMemo(() =>
    images.length > 0 ? images : (frontmatter.images || []),
    [images, frontmatter.images]
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: 'trimSnaps',
    dragFree: false,
    loop: true
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadedArr, setLoadedArr] = useState<boolean[]>(() => imageList.map(() => false));
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    setLoadedArr(imageList.map(() => false));
  }, [imageList]);

  // Keyboard nav in fullscreen: Escape closes, arrows cycle
  useEffect(() => {
    if (fullscreenIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreenIndex(null);
      if (e.key === 'ArrowRight') setFullscreenIndex(i => i === null ? null : (i + 1) % imageList.length);
      if (e.key === 'ArrowLeft') setFullscreenIndex(i => i === null ? null : (i - 1 + imageList.length) % imageList.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [fullscreenIndex, imageList.length]);

  const handleImageLoad = (i: number) => {
    setLoadedArr(prev => {
      const next = [...prev];
      next[i] = true;
      return next;
    });
  };

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!imageList.length) return null;

  const imageHeightClass = tall
    ? "h-[55vh] min-h-[240px] max-h-[680px]"
    : "aspect-[16/9]";

  return (
    <>
      <section className="text-center mt-0 mb-6">
        {title && <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>}
        {subtitle && <p className="italic text-base text-gray-600 mb-4">{subtitle}</p>}

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {imageList.map((image, i) => (
                <div key={i} className="flex-[0_0_100%] min-w-0 pl-4 relative">
                  <div className="mr-4">
                    <div
                      className={`relative rounded-xl overflow-hidden bg-gray-100 ${imageHeightClass} ${tall ? "cursor-zoom-in" : ""}`}
                      onClick={tall ? () => setFullscreenIndex(i) : undefined}
                    >
                      <Image
                        src={image}
                        alt={`Slide ${i + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 1024px"
                        className={`object-cover transition-opacity duration-500 ease-in-out ${
                          loadedArr[i] ? "opacity-100" : "opacity-0"
                        }`}
                        onLoad={() => handleImageLoad(i)}
                        priority={i === 0}
                        loading={i === 0 ? "eager" : "lazy"}
                        quality={75}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 bg-white/90 rounded-full shadow hover:bg-white transition z-10 hidden sm:flex touch-manipulation"
            aria-label="Previous slide"
          >
            <span className="text-xl">◀</span>
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 bg-white/90 rounded-full shadow hover:bg-white transition z-10 hidden sm:flex touch-manipulation"
            aria-label="Next slide"
          >
            <span className="text-xl">▶</span>
          </button>

          <div className="sm:hidden absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-50">
            {imageList.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors border border-zinc-200 ${
                  i === selectedIndex ? dotActiveClass : dotInactiveClass
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Fullscreen lightbox */}
      {fullscreenIndex !== null && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
          onClick={() => setFullscreenIndex(null)}
        >
          <div className="relative w-[95vw] h-[95dvh]">
            <Image
              src={imageList[fullscreenIndex]}
              alt={`Slide ${fullscreenIndex + 1}`}
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
            aria-label="Close fullscreen"
          >
            ×
          </button>

          {/* Prev */}
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors text-xl"
            onClick={(e) => { e.stopPropagation(); setFullscreenIndex(i => i === null ? null : (i - 1 + imageList.length) % imageList.length); }}
            aria-label="Previous image"
          >
            ◀
          </button>

          {/* Next */}
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors text-xl"
            onClick={(e) => { e.stopPropagation(); setFullscreenIndex(i => i === null ? null : (i + 1) % imageList.length); }}
            aria-label="Next image"
          >
            ▶
          </button>

          {/* Counter */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-xs font-mono tracking-widest">
            {fullscreenIndex + 1} / {imageList.length}
          </div>
        </div>
      )}
    </>
  );
}
