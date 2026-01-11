'use client';

import React, { useEffect } from 'react';
import MuseumHeader from '../museum/MuseumHeader';
import MuseumSection from '../museum/MuseumSection';
import MuseumFooter from '../museum/MuseumFooter';
import ViolationNotice from '../museum/ViolationNotice';
import { MUSEUM_SECTIONS, ESCALATION_THRESHOLDS } from '../museum/constants';
import { MuseumProvider, useMuseum } from '../museum/MuseumContext';

function MuseumContent() {
  const { violationLevel } = useMuseum();

  useEffect(() => {
    // Override body background for museum experience with smooth transition
    const originalBackground = document.body.style.background;
    const originalTransition = document.body.style.transition;

    // Enable transition
    document.body.style.transition = 'background 0.8s ease-in-out';

    // Dim the lights on shutdown
    const isShutdown = violationLevel >= 3;
    document.body.style.background = isShutdown ? '#e7e5df' : '#f9f8f6';

    return () => {
      // Restore original background and transition on unmount
      document.body.style.background = originalBackground;
      // Wait for transition to complete before removing it
      setTimeout(() => {
        document.body.style.transition = originalTransition;
      }, 800);
    };
  }, [violationLevel]);

  return (
    <>
      <ViolationNotice level={violationLevel} />
      <div className={`min-h-screen w-full -mx-4 sm:-mx-6 md:-mx-8 px-6 md:px-12 py-8 transition-colors duration-1000 ${
        violationLevel >= 3 ? 'bg-museum-100' : 'bg-museum-50'
      }`}>
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
    </>
  );
}

export default function MuseumExhibit() {
  return (
    <MuseumProvider>
      <MuseumContent />
    </MuseumProvider>
  );
}
