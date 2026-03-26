"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface AudioBarProps {
  src: string;
  isActive: boolean;
  onPlay: () => void;
}

export default function AudioBar({ src, isActive, onPlay }: AudioBarProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  function fmtTime(s: number) {
    if (!isFinite(s) || s < 0) return "—";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  }

  // Stop when another card starts playing
  useEffect(() => {
    if (!isActive && playing) {
      audioRef.current?.pause();
      setPlaying(false);
    }
  }, [isActive, playing]);

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      onPlay();
      a.play();
      setPlaying(true);
    }
  }, [playing, onPlay]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => {
      if (a.duration) {
        setProgress(a.currentTime / a.duration);
        setCurrentTime(a.currentTime);
      }
    };
    const onMeta = () => setDuration(a.duration);
    // metadata may already be loaded before effect runs
    if (isFinite(a.duration) && a.duration > 0) setDuration(a.duration);
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
    };
  }, []);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    a.currentTime = ratio * a.duration;
    setProgress(ratio);
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1">
      <audio ref={audioRef} src={src} preload="metadata" />
      <button
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        className="w-11 h-11 flex items-center justify-center rounded-full
                   bg-stone-200 dark:bg-stone-700 hover:bg-stone-300
                   dark:hover:bg-stone-600 transition-colors flex-shrink-0"
      >
        {playing ? (
          <svg width="10" height="12" viewBox="0 0 10 12" className="fill-stone-700 dark:fill-stone-200">
            <rect x="1" y="1" width="3" height="10" rx="0.5" />
            <rect x="6" y="1" width="3" height="10" rx="0.5" />
          </svg>
        ) : (
          <svg width="10" height="12" viewBox="0 0 10 12" className="fill-stone-700 dark:fill-stone-200 ml-0.5">
            <polygon points="1,1 9,6 1,11" />
          </svg>
        )}
      </button>
      {/* Tall hit area for touch seekability, thin visual track inside */}
      <div
        className="flex-1 flex items-center h-11 cursor-pointer"
        onClick={seek}
      >
        <div className="w-full h-1 bg-stone-200 dark:bg-stone-700 rounded-full">
          <div
            className="h-full bg-stone-500 dark:bg-stone-400 rounded-full transition-[width] duration-100"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
      <div className="font-mono text-[10px] text-stone-400 dark:text-stone-500 tabular-nums flex-shrink-0 select-none">
        {duration > 0 ? `${fmtTime(currentTime)} / ${fmtTime(duration)}` : fmtTime(currentTime)}
      </div>
    </div>
  );
}
