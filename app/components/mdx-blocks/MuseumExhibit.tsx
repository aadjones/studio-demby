'use client';

import React, { useEffect } from 'react';
import MuseumHeader from '../museum/MuseumHeader';
import MuseumSection from '../museum/MuseumSection';
import MuseumFooter from '../museum/MuseumFooter';
import { MUSEUM_SECTIONS } from '../museum/constants';

export default function MuseumExhibit() {
  useEffect(() => {
    // Override body background for museum experience with smooth transition
    const originalBackground = document.body.style.background;
    const originalTransition = document.body.style.transition;

    // Enable transition
    document.body.style.transition = 'background 0.8s ease-in-out';
    document.body.style.background = '#f9f8f6';

    return () => {
      // Restore original background and transition on unmount
      document.body.style.background = originalBackground;
      // Wait for transition to complete before removing it
      setTimeout(() => {
        document.body.style.transition = originalTransition;
      }, 800);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-museum-50 -mx-4 sm:-mx-6 md:-mx-8 px-6 md:px-12 py-8">
      <div className="max-w-5xl mx-auto">
        <MuseumHeader />
        <main>
          {MUSEUM_SECTIONS.map((section) => (
            <MuseumSection key={section.id} data={section} />
          ))}
        </main>
        <MuseumFooter />
      </div>
    </div>
  );
}
