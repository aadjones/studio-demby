import React, { useRef, useState, useEffect } from "react";

interface TracklistLink {
  id: string;
  label: string;
}

interface TracklistSection {
  title: string;
  links: TracklistLink[];
}

interface HeroBlockProps {
  title?: string;
  subtitle?: string;
  subtext?: string;
  caption?: string;
  videoSrc: string;
  poster: string;
  tracklistSections?: TracklistSection[];
}

export default function HeroBlock({
  title,
  subtitle,
  subtext,
  caption,
  videoSrc,
  poster,
  tracklistSections = [],
}: HeroBlockProps) {
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
    <section className="my-8 sm:my-12">
      <div className="text-center mb-6">
        {title && <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{title}</h1>}
        {subtitle && <p className="italic text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-2">{subtitle}</p>}
        {subtext && <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">{subtext}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start">
        <div className="w-full min-w-0">
          <div
            ref={containerRef}
            className="relative w-full aspect-square bg-black rounded-lg sm:rounded-xl overflow-hidden group"
          >
            <video
              ref={videoRef}
              poster={poster}
              className="w-full h-full object-cover [&::-webkit-media-controls-panel]:!bg-black/60 [&::-webkit-media-controls-current-time-display]:hidden [&::-webkit-media-controls-time-remaining-display]:hidden"
              playsInline
              controls
              controlsList="nodownload noplaybackrate"
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Preview Mix Label */}
            <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-black/60 backdrop-blur-sm text-white px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-wide shadow-lg shadow-black/20 ring-1 ring-white/20">
              Preview Mix
            </div>

            {/* Custom Play Button */}
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
                <div className="bg-black/60 rounded-full w-16 sm:w-24 md:w-32 aspect-square flex items-center justify-center">
                  {!isPlaying ? (
                    <svg
                      className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white"
                      viewBox="0 0 100 100"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polygon points="35,25 75,50 35,75" fill="white" />
                    </svg>
                  ) : (
                    <svg
                      className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white"
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
            <div className="mt-2 sm:mt-3 text-center">
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 italic">{caption}</p>
            </div>
          )}
        </div>

        <div className="w-full min-w-0">
          {tracklistSections.map((section) => {
            const sectionId = section.title
              .replace(/^[IVXLCDM]+\.\s*/, "")
              .toLowerCase()
              .replace(/\s+/g, "-");

            return (
              <div key={section.title} className="backdrop-blur-sm bg-white/50 dark:bg-black/20 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                <div className="px-1.5 py-1.5">
                  {section.links.map((link) => (
                    <a
                      key={link.id}
                      href={`#${link.id}`}
                      className="flex items-center px-1.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all duration-200 group"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(link.id);
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      <span className="flex-1 text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 underline decoration-zinc-400/50 dark:decoration-zinc-600/50 group-hover:decoration-zinc-500 dark:group-hover:decoration-zinc-400">
                        {link.label}
                      </span>
                      <span className="ml-2 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-600 dark:group-hover:text-zinc-400">
                        <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
