'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SpecimenData } from './types';

interface SpecimenCardProps {
  specimen: SpecimenData;
}

export default function SpecimenCard({ specimen }: SpecimenCardProps) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const resetTimerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const performJump = () => {
    const limit = 60;
    const newX = (Math.random() < 0.5 ? -1 : 1) * (20 + Math.random() * limit);
    const newY = (Math.random() < 0.5 ? -1 : 1) * (20 + Math.random() * limit);
    setPos({ x: newX, y: newY });
  };

  const playDashSound = () => {
    if (isPlayingAudio) return;

    setIsPlayingAudio(true);

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const audioContext = audioContextRef.current;
    const currentTime = audioContext.currentTime;
    const dashDuration = 0.513;
    const frequency = 1000;

    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const fadeTime = 0.01;
    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, currentTime + fadeTime);
    gainNode.gain.setValueAtTime(0.3, currentTime + dashDuration - fadeTime);
    gainNode.gain.linearRampToValueAtTime(0, currentTime + dashDuration);

    oscillator.start(currentTime);
    oscillator.stop(currentTime + dashDuration);

    oscillator.onended = () => {
      setIsPlayingAudio(false);
    };
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
    if (specimen.interactionType === 'evasive') {
      performJump();
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (specimen.interactionType === 'evasive') {
      resetTimerRef.current = window.setTimeout(() => {
         setPos({ x: 0, y: 0 });
      }, 1000);
    }
  };

  const handleClick = () => {
    if (specimen.interactionType === 'evasive') {
      performJump();
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = window.setTimeout(() => {
        setPos({ x: 0, y: 0 });
      }, 1500);
    }
    else if (specimen.interactionType === 'anxious') {
      setIsTapped(true);
      setTimeout(() => setIsTapped(false), 2000);
    }
    else if (specimen.interactionType === 'audio') {
      playDashSound();
    }
  };

  useEffect(() => {
    const isActive = isHovering || isTapped;

    if (specimen.interactionType !== 'anxious' || !isActive) {
      if (specimen.interactionType === 'anxious' && !isActive) setPos({ x: 0, y: 0 });
      return;
    }

    const interval = setInterval(() => {
      setPos({
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 4
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isHovering, isTapped, specimen.interactionType]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="bg-white border border-museum-200 p-6 shadow-[2px_2px_0px_rgba(0,0,0,0.05)] hover:shadow-[4px_4px_0px_rgba(0,0,0,0.05)] transition-shadow duration-300">
      <div
        className={`h-32 flex items-center justify-center bg-museum-50 mb-6 border overflow-hidden relative cursor-crosshair active:bg-museum-100 transition-all select-none ${
          specimen.interactionType === 'audio' && isPlayingAudio
            ? 'border-museum-800 border-2'
            : 'border-museum-100'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        title={specimen.interactionType === 'audio' ? 'Tap to hear' : specimen.interactionType ? 'Tap to interact' : undefined}
      >
        <span
          className={`text-6xl text-museum-900 leading-none select-none transition-transform ${specimen.interactionType === 'evasive' ? 'duration-200 ease-out' : 'duration-75'} ${specimen.glyphClassName || 'font-serif'}`}
          style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
        >
          {specimen.glyph}
        </span>
        {specimen.interactionType === 'audio' && (isHovering || isPlayingAudio) && (
          <div className="absolute top-2 right-2 text-museum-700 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isPlayingAudio ? 'opacity-100' : 'opacity-60'}
            >
              <path d="M2 10v3" />
              <path d="M6 6v11" />
              <path d="M10 3v18" />
              <path d="M14 8v7" />
              <path d="M18 5v13" />
              <path d="M22 10v3" />
            </svg>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="border-b border-museum-100 pb-2 mb-3">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
            <h3 className="font-serif text-lg font-bold text-museum-900 tracking-wide">
              {specimen.name}
            </h3>
            {specimen.latinName && (
              <span className="font-serif italic text-sm text-stone-500 whitespace-nowrap">
                {specimen.latinName}
              </span>
            )}
          </div>
        </div>
        <p className="text-sm font-sans text-stone-700 leading-relaxed">
          {specimen.description}
        </p>
        <div className="pt-2 text-[10px] uppercase tracking-widest text-stone-400 font-sans">
          Specimen #{specimen.id}
        </div>
      </div>
    </div>
  );
}
