'use client';

import React, { useState, useRef, useEffect } from 'react';

interface MorseAudioPlayerProps {
  className?: string;
}

export default function MorseAudioPlayer({ className = '' }: MorseAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playDash = () => {
    if (isPlaying) return;

    setIsPlaying(true);

    // Create audio context if it doesn't exist
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const audioContext = audioContextRef.current;
    const currentTime = audioContext.currentTime;

    // Morse code timing at 7 WPM
    // At 7 WPM, one unit = 171ms, dash = 3 units = 513ms
    const dashDuration = 0.513; // seconds
    const frequency = 1000; // Hz

    // Create oscillator for the tone
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    // Create gain node for smooth envelope (avoid clicks)
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0;

    // Connect oscillator -> gain -> destination
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Envelope: quick fade in/out to avoid clicks
    const fadeTime = 0.01; // 10ms fade
    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, currentTime + fadeTime);
    gainNode.gain.setValueAtTime(0.3, currentTime + dashDuration - fadeTime);
    gainNode.gain.linearRampToValueAtTime(0, currentTime + dashDuration);

    // Start and stop the oscillator
    oscillator.start(currentTime);
    oscillator.stop(currentTime + dashDuration);

    // Store references
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;

    // Reset playing state after the dash completes
    oscillator.onended = () => {
      setIsPlaying(false);
      oscillatorRef.current = null;
      gainNodeRef.current = null;
    };
  };

  return (
    <button
      onClick={playDash}
      disabled={isPlaying}
      className={`inline-flex items-center gap-1.5 p-1.5 hover:bg-museum-100 active:bg-museum-200 rounded text-museum-700 hover:text-museum-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label="Play morse code dash sound"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="flex-shrink-0"
      >
        {isPlaying ? (
          <>
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </>
        ) : (
          <path d="M8 5v14l11-7z" />
        )}
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="flex-shrink-0"
      >
        <path d="M2 10v3" />
        <path d="M6 6v11" />
        <path d="M10 3v18" />
        <path d="M14 8v7" />
        <path d="M18 5v13" />
        <path d="M22 10v3" />
      </svg>
    </button>
  );
}
