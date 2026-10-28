import React from "react";
import VideoFile from "./VideoFile";

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
  className?: string;
}

export default function HeroBlock({
  title,
  subtitle,
  subtext,
  caption,
  videoSrc,
  poster,
  tracklistSections = [],
  className = "",
}: HeroBlockProps) {
  return (
    <section className={`mt-2 mb-8 sm:mt-4 sm:mb-12 ${className}`.trim()}>
      <div className="text-center mb-6">
        {title && <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{title}</h1>}
        {subtitle && <p className="italic text-base sm:text-lg text-ink-700 mb-2">{subtitle}</p>}
        {subtext && <p className="text-xs sm:text-sm text-ink-500">{subtext}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start">
        <div className="w-full min-w-0">
          <VideoFile
            src={videoSrc}
            poster={poster}
            caption={caption}
            label="Preview Mix"
            aspectRatio="square"
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
              <div key={section.title} className="rounded-xl border border-line">
                <div className="px-1.5 py-1.5">
                  {section.links.map((link) => (
                    <a
                      key={link.id}
                      href={`#${link.id}`}
                      className="flex items-center px-1 py-1 rounded-lg hover:bg-subtle/50 transition-all duration-200 group"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(link.id);
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      <span className="flex-1 text-[11px] sm:text-sm text-ink-700 group-hover:text-ink-900 underline group-hover:decoration-ink-500">
                        {link.label}
                      </span>
                      <span className="ml-2 text-ink-300 group-hover:text-ink-700">
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
