'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface ViolationNoticeProps {
  level: number;
}

export default function ViolationNotice({ level }: ViolationNoticeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [dismissLevel1, setDismissLevel1] = useState(false);
  const [dismissLevel2, setDismissLevel2] = useState(false);

  useEffect(() => {
    if (level > 0) {
      setShouldRender(true);
      setDismissLevel1(false);
      setDismissLevel2(false);

      // Level 2: Delay showing message so rotation is visible first
      if (level === 2) {
        // Wait 1.5s for rotation to be visible
        const showTimer = setTimeout(() => {
          setIsVisible(true);
        }, 1500);

        // Auto-dismiss after 10 more seconds (11.5s total)
        const dismissTimer = setTimeout(() => {
          setDismissLevel2(true);
          setIsVisible(false);
          setTimeout(() => setShouldRender(false), 500);
        }, 11500);

        return () => {
          clearTimeout(showTimer);
          clearTimeout(dismissTimer);
        };
      }
      // Level 1: Show immediately
      else if (level === 1) {
        setTimeout(() => setIsVisible(true), 50);
        const timer = setTimeout(() => {
          setDismissLevel1(true);
          setIsVisible(false);
          setTimeout(() => setShouldRender(false), 500);
        }, 10000);
        return () => clearTimeout(timer);
      }
      // Level 3: Show immediately, no auto-dismiss
      else {
        setTimeout(() => setIsVisible(true), 50);
      }
    } else {
      setIsVisible(false);
      setTimeout(() => setShouldRender(false), 500);
    }
  }, [level]);

  if (!shouldRender || (level === 1 && dismissLevel1) || (level === 2 && dismissLevel2)) return null;

  // Level 1: Polite bureaucratic warning
  if (level === 1) {
    return (
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-md transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="bg-white border-2 border-museum-800 shadow-lg p-4">
          <p className="font-serif text-xs text-museum-900 leading-relaxed">
            <strong>SECURITY ALERT:</strong> Please refrain from tapping the glass.
            This behavior has been noted in the Museum Incident Register (Form 27-B).
          </p>
        </div>
      </div>
    );
  }

  // Level 2: Stern notice (appears during rebellion)
  if (level === 2) {
    return (
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 max-w-lg transition-all duration-500 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="bg-museum-50 border-4 border-museum-900 shadow-2xl p-6">
          <p className="font-serif text-sm text-museum-900 leading-relaxed text-center">
            <strong className="block text-base mb-2">NOTICE OF SPECIMEN DISTRESS</strong>
            Repeated violations have triggered a protective response.
            All specimens are undergoing temporary reclassification.
            Please cease interaction immediately.
          </p>
        </div>
      </div>
    );
  }

  // Level 3: Museum shutdown (persistent overlay)
  if (level === 3) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/20 transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-red-50 border-4 border-red-900 shadow-2xl p-8 max-w-xl mx-4">
          <p className="font-serif text-base text-red-900 leading-relaxed">
            <strong className="block text-xl mb-4 text-center">MUSEUM CLOSURE NOTICE</strong>
            Due to repeated visitor misconduct, this exhibit has been closed for the day.
            All specimens have been relocated to protective storage for their safety.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-red-900 text-red-50 font-serif text-sm uppercase tracking-wide hover:bg-red-800 transition-colors border-2 border-red-950"
            >
              Exit Through Gift Shop →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
