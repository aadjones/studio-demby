"use client";

import useEmblaCarousel from 'embla-carousel-react';
import { MDXProject } from '@/types/mdx';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

interface FeaturedCarouselProps {
  projects: MDXProject[];
}

export default function FeaturedCarousel({ projects }: FeaturedCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

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

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {projects.map((project) => (
            <div 
              key={project.slug}
              className="flex-[0_0_85%] min-w-0 pl-4 relative"
            >
              <Link href={`/${project.cluster}/${project.slug}`}>
                <div className="mr-4">
                  {project.image && (
                    <div className="aspect-square relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-bold mt-3">{project.title}</h3>
                  <p className="text-sm italic text-gray-500">{project.summary}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {projects.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === selectedIndex 
                ? 'bg-gray-800 dark:bg-gray-200' 
                : 'bg-gray-300 dark:bg-gray-700'
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 