'use client';

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";

interface SimpleVideoBlockProps {
  title?: string;
  subtitle?: string;
  caption?: string;
  videoSrc: string;
  poster: string;
  className?: string;
  aspectRatio?: 'square' | 'video';
}

export default function SimpleVideoBlock({
  title,
  subtitle,
  caption,
  videoSrc,
  poster,
  className,
  aspectRatio = 'square',
}: SimpleVideoBlockProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mobile detection with more reliable method
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) || false;
      setIsMobile(isMobileDevice);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle video loading and errors
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = (e: Event) => {
      setError('Error loading video');
      setIsLoading(false);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    setHasInteracted(true);
    if (video.paused || video.ended) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Playback failed:', error);
          setError('Playback failed. Please try again.');
        });
      }
    } else {
      video.pause();
    }
  };

  // Handle touch events for mobile
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Prevent default only if we're showing custom controls
      if (!hasInteracted) {
        e.preventDefault();
      }
    };

    video.addEventListener('touchstart', handleTouchStart, { passive: false });
    return () => video.removeEventListener('touchstart', handleTouchStart);
  }, [isMobile, hasInteracted]);

  return (
    <section className={`my-8 mx-auto ${className ?? "max-w-sm"}`}>
      <div className="text-center">
        {title && <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>}
        {subtitle && <p className="italic text-base text-gray-600 mb-2">{subtitle}</p>}
      </div>

      <div className="w-full mx-auto">
        <div
          ref={containerRef}
          className={`relative w-full ${aspectRatio === 'video' ? 'aspect-video' : 'aspect-square'} bg-black rounded-xl overflow-hidden`}
        >
          {/* Loading state */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
              <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
              <p className="text-white text-center px-4">{error}</p>
            </div>
          )}

          {/* Optimized poster image - only show on desktop or before interaction on mobile */}
          {(!isMobile || !hasInteracted) && !error && (
            <div className={`absolute inset-0 transition-opacity duration-300 ${posterLoaded ? 'opacity-0' : 'opacity-100'}`}>
              <Image
                src={poster}
                alt="Video poster"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 800px"
                className="object-cover"
                priority
                onLoad={() => setPosterLoaded(true)}
              />
            </div>
          )}

          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            controls
            controlsList="nodownload"
            poster={isMobile ? poster : undefined}
            style={{ zIndex: 1 }}
            preload="metadata"
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Only show custom controls on desktop when video is not playing */}
          {!isMobile && !isPlaying && !error && (
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
                  <svg
                    className="w-16 h-16 text-white"
                    viewBox="0 0 100 100"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polygon points="35,25 75,50 35,75" fill="white" />
                  </svg>
                </div>
              </button>
            </div>
          )}
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
