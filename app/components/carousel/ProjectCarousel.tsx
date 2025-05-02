"use client";

import useEmblaCarousel from 'embla-carousel-react';
import { MDXProject } from '@/types/mdx';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

interface ProjectCarouselProps {
  projects: MDXProject[];
  imageSize?: 'small' | 'normal' | 'large';
  showDots?: boolean;
}

export default function ProjectCarousel({ 
  projects,
  imageSize = 'normal',
  showDots = true
}: ProjectCarouselProps) {
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

  // Size classes based on imageSize prop
  const containerSizeClasses = {
    small: 'flex-[0_0_60%]',
    normal: 'flex-[0_0_85%]',
    large: 'flex-[0_0_95%]'
  }[imageSize];

  // Text size classes based on imageSize prop
  const titleSizeClasses = {
    small: 'text-base',
    normal: 'text-lg',
    large: 'text-xl'
  }[imageSize];

  const summarySizeClasses = {
    small: 'text-xs',
    normal: 'text-sm',
    large: 'text-base'
  }[imageSize];

  // Always use square aspect ratio with padding options
  const imageSizeClasses = imageSize === 'small' 
    ? 'aspect-square px-2 py-1' 
    : 'aspect-square';

  return (
    <div className="relative mb-6">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {projects.map((project) => (
            <div 
              key={project.slug}
              className={`${containerSizeClasses} min-w-0 pl-4 relative`}
            >
              <Link href={`/${project.cluster}/${project.slug}`}>
                <div className="mr-4">
                  {project.image && (
                    <div className={`relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 ${imageSizeClasses}`}>
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  )}
                  <h3 className={`${titleSizeClasses} font-bold mt-3`}>{project.title}</h3>
                  <p className={`${summarySizeClasses} italic text-gray-500`}>{project.summary}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {showDots && projects.length > 1 && (
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
      )}
    </div>
  );
} 