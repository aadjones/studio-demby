'use client';

import React from "react";

interface VideoPlayerProps {
  src: string; // YouTube video ID or full URL
  poster?: string;
  title?: string;
  subtitle?: string;
  caption?: string;
  className?: string;
  aspectRatio?: 'square' | 'video';
  showPreviewLabel?: boolean;
  controlsList?: string;
}

export default function VideoPlayer({
  src,
  poster,
  title,
  subtitle,
  caption,
  className = "",
  aspectRatio = 'square',
  showPreviewLabel = false,
  controlsList = "nodownload nofullscreen",
}: VideoPlayerProps) {
  const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');
  const videoId = isYouTube
    ? src.split(/[=/]/).pop()?.split('&')[0]
    : src;

  return (
    <div className={className}>
      {/* Title and subtitle section */}
      {(title || subtitle) && (
        <div className="text-center mb-6">
          {title && <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{title}</h1>}
          {subtitle && <p className="italic text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-2">{subtitle}</p>}
        </div>
      )}

      {/* Video container */}
      <div className="w-full">
        <div
          className={`relative w-full ${aspectRatio === 'video' ? 'aspect-video' : 'aspect-square'} bg-black rounded-xl overflow-hidden`}
        >
          {isYouTube ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`}
              title={title || "Video player"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <video
              src={src}
              poster={poster}
              controls
              controlsList={controlsList}
              className="w-full h-full bg-black"
            />
          )}

          {/* Preview Mix Label - only shown when requested */}
          {showPreviewLabel && (
            <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-black/60 backdrop-blur-sm text-white px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-wide shadow-lg shadow-black/20 ring-1 ring-white/20">
              Preview Mix
            </div>
          )}
        </div>

        {/* Caption */}
        {caption && (
          <div className="mt-2 sm:mt-3 text-center">
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 italic">{caption}</p>
          </div>
        )}
      </div>
    </div>
  );
} 