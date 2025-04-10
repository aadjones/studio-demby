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
  videoSrc: string;
  poster: string;
  tracklistSections?: TracklistSection[];
}

export default function HeroBlock({
  title,
  subtitle,
  videoSrc,
  poster,
  tracklistSections = [],
}: HeroBlockProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused || video.ended) {
      video.play();
    } else {
      video.pause();
    }
  };

  const scheduleHideControls = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      scheduleHideControls();
    };

    const handlePause = () => {
      setIsPlaying(false);
      setShowControls(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  return (
    <section className="my-12">
      {title && <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>}
      {subtitle && <p className="italic text-lg text-gray-600 mb-6">{subtitle}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div
          className="relative w-full aspect-[1/1] bg-black rounded-xl overflow-hidden"
          onMouseMove={() => {
            setShowControls(true);
            if (isPlaying) scheduleHideControls();
          }}
          onMouseLeave={() => {
            if (isPlaying) setShowControls(false);
          }}
        >
          <video
            ref={videoRef}
            poster={poster}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <button
            onClick={togglePlayback}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
              showControls ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {!isPlaying ? (
              <svg
                className="w-16 h-16 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <polygon points="8,5 19,12 8,19" />
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
          </button>
        </div>

        <div className="space-y-4 text-sm">
          {tracklistSections.map((section) => {
            const sectionId = section.title
              .replace(/^[IVXLCDM]+\.\s*/, "") // strip Roman numeral prefix
              .toLowerCase()
              .replace(/\s+/g, "-");
            return (
              <div key={section.title}>
                <strong className="text-base block mb-1">
                  <a
                    href={`#${sectionId}`}
                    className="hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(sectionId);
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {section.title}
                  </a>
                </strong>
                {section.links.map((link) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    className="block pl-4 hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(link.id);
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
