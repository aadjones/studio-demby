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

  useEffect(() => {
    // Check if we're on a mobile device
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    
    // For mobile devices, we'll try to use the video element's native fullscreen
    if (isMobile) {
      if ((video as any).webkitEnterFullscreen) {
        (video as any).webkitEnterFullscreen();
      } else if ((video as any).webkitRequestFullscreen) {
        (video as any).webkitRequestFullscreen();
      }
      return;
    }
    
    // Desktop fullscreen handling
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if ((video as any).webkitRequestFullscreen) {
      (video as any).webkitRequestFullscreen();
    } else if ((video as any).mozRequestFullScreen) {
      (video as any).mozRequestFullScreen();
    } else if ((video as any).msRequestFullscreen) {
      (video as any).msRequestFullscreen();
    }
  };

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
          {/* Optimized poster image */}
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

          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            controls
            onDoubleClick={!isMobile ? handleFullscreen : undefined}
            onClick={isMobile ? handleFullscreen : undefined}
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
