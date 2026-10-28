"use client";

import React, { useRef } from "react";

/**
 * AmbientLoop — a silent, autoplaying loop that is part of the artwork (Degradation's
 * crows, piano and cathedral). Click it to go full screen. No controls, no sound.
 *
 *   <AmbientLoop src="/photos/…/loop.mp4" />
 *
 * Other video jobs have their own block:
 *   - YouTube, Loom or Vimeo → VideoEmbed
 *   - your own MP4 with controls and a poster → VideoFile
 */

interface AmbientLoopProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
}

export default function AmbientLoop({ src, className = "", ...props }: AmbientLoopProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const goFullscreen = () => {
    const el = videoRef.current as (HTMLVideoElement & { webkitRequestFullscreen?: () => void }) | null;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
    else el.webkitRequestFullscreen?.();
  };

  return (
    <video
      ref={videoRef}
      onClick={goFullscreen}
      autoPlay
      loop
      muted
      playsInline
      {...props}
      // Merged, not overridden: ClientMDX passes className="not-prose", which used to
      // replace these sizing classes entirely.
      className={`h-full w-full cursor-pointer object-cover ${className}`.trim()}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
