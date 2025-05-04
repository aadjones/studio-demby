"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from 'embla-carousel-react';
import { motion, useScroll, useTransform } from "framer-motion";

interface Chapter {
  title: string;
  content: string;
  quote?: string;
}

interface GospelCarouselProps {
  chapters: Chapter[];
}

export default function GospelCarousel({ chapters }: GospelCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: 'trimSnaps',
    dragFree: false,
    loop: true
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Shimmer effect based on scroll
  const shimmerOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.7, 0.3]);
  const shimmerScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.95]);

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

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div ref={containerRef} className="relative py-12 overflow-hidden">
      {/* Shimmer background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-pink-500/20"
        style={{ 
          opacity: shimmerOpacity,
          scale: shimmerScale,
          transformOrigin: "center"
        }}
      />

      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 relative z-10">
        The Gospel According to the Deep
      </h2>

      {/* Carousel Container */}
      <div className="relative max-w-4xl mx-auto px-1 sm:px-4">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {chapters.map((chapter, i) => (
              <div 
                key={i}
                className="flex-[0_0_100%] min-w-0 px-0 sm:px-4 relative"
              >
                <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border border-pink-200/20 dark:border-pink-800/20 w-full max-w-full mx-auto min-h-[180px] sm:min-h-[220px] flex flex-col justify-center">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-pink-900 dark:text-pink-100 break-words">
                    {chapter.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2 sm:mb-4 break-words text-base sm:text-lg">
                    {chapter.content}
                  </p>
                  {chapter.quote && (
                    <blockquote className="italic text-pink-800 dark:text-pink-200 border-l-2 border-pink-500/50 pl-2 sm:pl-4 text-sm sm:text-base">
                      {chapter.quote}
                    </blockquote>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 bg-white/90 dark:bg-black/90 rounded-full shadow hover:bg-white dark:hover:bg-black transition z-10 hidden sm:flex touch-manipulation"
          aria-label="Previous chapter"
        >
          <span className="text-xl">◀</span>
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 bg-white/90 dark:bg-black/90 rounded-full shadow hover:bg-white dark:hover:bg-black transition z-10 hidden sm:flex touch-manipulation"
          aria-label="Next chapter"
        >
          <span className="text-xl">▶</span>
        </button>

        {/* Dots for mobile */}
        <div className="sm:hidden flex justify-center gap-2 mt-4">
          {chapters.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === selectedIndex 
                  ? 'bg-pink-500' 
                  : 'bg-pink-200 dark:bg-pink-800'
              }`}
              aria-label={`Go to chapter ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 