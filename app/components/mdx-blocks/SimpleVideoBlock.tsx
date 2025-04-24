'use client';

import React, { useRef, useState, useEffect } from "react";

interface SimpleVideoBlockProps {
  title?: string;
  subtitle?: string;
  caption?: string;
  videoSrc: string;
  poster: string;
  className?: string;
}

export default function SimpleVideoBlock({
  title,
  subtitle,
  caption,
  videoSrc,
  poster,
  className,
}: SimpleVideoBlockProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    setHasInteracted(true);
    if (video.paused || video.ended) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleMouseMove = () => {
      if (!hasInteracted) return;
      setShowControls(true);
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
      hideControlsTimer.current = setTimeout(() => setShowControls(false), 2000);
    };

    const handleClick = () => {
      setHasInteracted(true);
    };

    const containerEl = containerRef.current;
    if (containerEl) {
      containerEl.addEventListener("mousemove", handleMouseMove);
    }
    video.addEventListener("click", handleClick);

    return () => {
      if (containerEl) {
        containerEl.removeEventListener("mousemove", handleMouseMove);
      }
      video.removeEventListener("click", handleClick);
    };
  }, [hasInteracted]);

  return (
    <section className="my-8">
       <div className="text-center">
    {title && <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>}
    {subtitle && <p className="italic text-lg text-gray-600 mb-2">{subtitle}</p>}
  </div>

      <div className={`w-full mx-auto ${className ?? "max-w-sm"}`}>
        <div
          ref={containerRef}
          className="relative w-full aspect-square bg-black rounded-xl overflow-hidden"
        >
          <video
            ref={videoRef}
            poster={poster}
            className="w-full h-full object-cover"
            playsInline
            controls
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div
            className={`absolute top-1/2 left-1/2 z-10 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 ease-in-out
              ${!hasInteracted || showControls ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          >
            <button
              onClick={togglePlayback}
              className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-500 ease-in-out pointer-events-auto ${
                !hasInteracted || showControls ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="bg-black/60 rounded-full w-40 aspect-square flex items-center justify-center">
                {!isPlaying ? (
                  <svg
                    className="w-16 h-16 text-white"
                    viewBox="0 0 100 100"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polygon points="35,25 75,50 35,75" fill="white" />
                  </svg>
                ) : (
                  <svg
                    className="w-16 h-16 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect x="6" y="5" width="4" height="14" />
                    <rect x="14" y="5" width="4" height="14" />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </div>

        {caption && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 italic">{caption}</p>
          </div>
        )}
      </div>
    </section>
  );
}
