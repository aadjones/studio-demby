// components/LoopRoomTrack.tsx
import React from 'react';
import clsx from 'clsx'; // Using clsx library for cleaner className merging (install if needed: pnpm add clsx)
                        // Or manually merge: `baseClasses ${className || ''}`
import Image from 'next/image';

type Props = {
  title: string;
  description?: string;
  src: string;
  thumbnail: string;
  // --- ADD id and className ---
  id?: string;
  className?: string; // For scroll-margin or other styling
};

export default function LoopRoomTrack({
  title,
  description,
  src,
  thumbnail,
  // --- Destructure id and className ---
  id,
  className
}: Props) {
  const baseClasses = "my-16 flex flex-col md:flex-row md:items-end md:justify-center md:gap-10 text-left";

  return (
    // --- Apply id and merged className ---
    <section
      id={id} // Apply the id here
      className={clsx(baseClasses, className)} // Merge base classes with passed className
      // Or without clsx: className={`${baseClasses} ${className || ''}`.trim()}
    >
      <Image
        src={thumbnail}
        alt={`${title} cover art`}
        width={128}
        height={128}
        className="w-32 h-32 rounded-md shadow-md object-cover mx-auto md:mx-0"
      />
      <div className="flex-1 max-w-xl mt-6 md:mt-0 space-y-2">
        <h2 className="text-base font-medium text-zinc-800 dark:text-zinc-200">
          {title}
        </h2>
        <audio
          src={src}
          loop
          controls
          className="w-full border border-zinc-600/40 rounded-md shadow"
        />
        {description && (
          <p className="text-sm italic text-zinc-500 dark:text-zinc-400 mt-1">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}