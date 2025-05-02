// components/LoopRoomTrack.tsx
import React from 'react';
import clsx from 'clsx'; // Using clsx library for cleaner className merging (install if needed: pnpm add clsx)
                        // Or manually merge: `baseClasses ${className || ''}`
import Image from 'next/image';

interface Props {
  title: string;
  description?: string;
  src: string;
  thumbnail: string;
  id?: string;
  className?: string;
}

export default function LoopRoomTrack({
  title,
  description,
  src,
  thumbnail,
  id,
  className
}: Props) {
  return (
    <section
      id={id}
      className={clsx(
        "grid grid-cols-[64px_1fr] gap-3 sm:gap-4 items-start px-3 sm:px-4",
        className
      )}
    >
      <div className="w-full">
        <Image
          src={thumbnail}
          alt={`${title} cover art`}
          width={64}
          height={64}
          className="w-full aspect-square rounded shadow-sm object-cover"
        />
      </div>
      
      <div className="w-full min-w-0 space-y-1.5">
        <h2 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          {title}
        </h2>
        <audio
          src={src}
          loop
          controls
          controlsList="nodownload noplaybackrate"
          className="w-full h-[32px] border border-zinc-600/40 rounded shadow-sm [&::-webkit-media-controls-panel]:!bg-white dark:[&::-webkit-media-controls-panel]:!bg-zinc-900 [&::-webkit-media-controls-current-time-display]:hidden [&::-webkit-media-controls-time-remaining-display]:hidden"
        />
        {description && (
          <p className="text-xs italic text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}