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
}

export default function HeroCarouselBlock({
  title,
  subtitle,
  images = [],
  frontmatter = {},
  dotActiveClass = "bg-white",
  dotInactiveClass = "bg-white/50",
}: HeroCarouselBlockProps) {
  // Use images from props or fallback to frontmatter
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
  // Per-image loaded state
  const [loadedArr, setLoadedArr] = useState<boolean[]>(() => imageList.map(() => false));

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Reset loadedArr if imageList changes (e.g. on prop change)
  useEffect(() => {
    setLoadedArr(imageList.map(() => false));
  }, [imageList]);

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

  return (
    <section className="text-center mt-0 mb-6">
      {title && (
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
      )}
      {subtitle && (
        <p className="italic text-base text-gray-600 mb-4">{subtitle}</p>
      )}

      <div className="relative max-w-5xl mx-auto">
        {/* Carousel Container */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {imageList.map((image, i) => (
              <div 
                key={i}
                className="flex-[0_0_100%] min-w-0 pl-4 relative"
              >
                <div className="mr-4">
                  <div className="relative aspect-[4/3] sm:aspect-[3/2] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900">
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

        {/* Navigation Buttons */}
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

        {/* Touch indicator for mobile */}
        <div className="sm:hidden absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-50">
          {imageList.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors border border-zinc-200 ${
                i === selectedIndex
                  ? dotActiveClass
                  : dotInactiveClass
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
