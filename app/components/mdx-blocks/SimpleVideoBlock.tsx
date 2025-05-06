'use client';

import React from "react";
import VideoPlayer from "../media/VideoPlayer";

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
  return (
    <VideoPlayer
      src={videoSrc}
      poster={poster}
      title={title}
      subtitle={subtitle}
      caption={caption}
      className={className}
      aspectRatio={aspectRatio}
    />
  );
}
