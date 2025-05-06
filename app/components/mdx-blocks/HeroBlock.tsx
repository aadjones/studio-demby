import React from "react";
import VideoPlayer from "../media/VideoPlayer";

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
  return (
    <section className="my-8 sm:my-12">
      <div className="text-center mb-6">
        {title && <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{title}</h1>}
        {subtitle && <p className="italic text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-2">{subtitle}</p>}
        {subtext && <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">{subtext}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start">
        <div className="w-full min-w-0">
          <VideoPlayer
            src={videoSrc}
            poster={poster}
            caption={caption}
            showPreviewLabel={true}
            controlsList="nodownload noplaybackrate"
          />
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
                      className="flex items-center px-1 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all duration-200 group"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(link.id);
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      <span className="flex-1 text-[11px] sm:text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 underline decoration-zinc-400/50 dark:decoration-zinc-600/50 group-hover:decoration-zinc-500 dark:group-hover:decoration-zinc-400">
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
