'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function LoopPlayer({
  coverImage,
  audioSrc,
  alt = 'Album art',
}: {
  coverImage: string;
  audioSrc: string;
  alt?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    const audio = audioRef.current;
    if (audio && !isPlaying) {
      audio.volume = 0;
      audio.play();
      setIsPlaying(true);

      let volume = 0;
      const fadeIn = setInterval(() => {
        if (volume < 1 && audio.volume < 1) {
          volume += 0.05;
          audio.volume = Math.min(volume, 1);
        } else {
          clearInterval(fadeIn);
        }
      }, 150);
    }
  };

  const handleStop = () => {
    const audio = audioRef.current;
    if (audio && isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-square">
      <img
        src={coverImage}
        alt={alt}
        className={`w-full h-full object-cover rounded-xl transition duration-1000 ease-in-out ${
          isPlaying ? 'opacity-90 blur-sm scale-105 saturate-[1.2]' : ''
        }`}
      />

      <motion.button
        onClick={isPlaying ? handleStop : handlePlay}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="p-6 bg-black/40 rounded-full backdrop-blur-md shadow-xl">
          <span className="text-white text-6xl">
            {isPlaying ? '⏹️' : '▶️'}
          </span>
        </div>
      </motion.button>

      {isPlaying && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ duration: 3 }}
        >
          <div className="w-full h-full bg-gradient-to-t from-indigo-800 to-transparent mix-blend-soft-light rounded-xl animate-pulse" />
        </motion.div>
      )}

      <audio ref={audioRef} src={audioSrc} loop preload="auto" />
    </div>
  );
}
