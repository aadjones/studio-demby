'use client';

import React from 'react';

interface VideoEmbedProps {
  src: string;
  aspectRatio?: number;
  title?: string;
}

export default function VideoEmbed({
  src,
  aspectRatio = 56.25, // Default 16:9 ratio
  title = 'Embedded video',
}: VideoEmbedProps) {
  return (
    <div className="my-8">
      <div
        style={{
          position: 'relative',
          paddingBottom: `${aspectRatio}%`,
          height: 0,
        }}
      >
        <iframe
          src={src}
          title={title}
          frameBorder="0"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    </div>
  );
}
