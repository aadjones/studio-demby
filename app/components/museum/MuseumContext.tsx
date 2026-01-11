'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { ESCALATION_THRESHOLDS } from './constants';

interface MuseumContextType {
  totalTaps: number;
  incrementTaps: () => void;
  violationLevel: number;
  isRebelling: boolean;
  triggerRebellion: () => void;
}

const MuseumContext = createContext<MuseumContextType | undefined>(undefined);

export function MuseumProvider({ children }: { children: React.ReactNode }) {
  const [totalTaps, setTotalTaps] = useState(0);
  const [isRebelling, setIsRebelling] = useState(false);

  const incrementTaps = useCallback(() => {
    setTotalTaps(prev => prev + 1);
  }, []);

  const triggerRebellion = useCallback(() => {
    setIsRebelling(true);
    // Rotation is now permanent - no timeout to reset
  }, []);

  // Calculate violation level based on tap count
  const violationLevel =
    totalTaps >= ESCALATION_THRESHOLDS.SHUTDOWN ? 3 :
    totalTaps >= ESCALATION_THRESHOLDS.REBELLION ? 2 :
    totalTaps >= ESCALATION_THRESHOLDS.WARNING ? 1 : 0;

  return (
    <MuseumContext.Provider value={{ totalTaps, incrementTaps, violationLevel, isRebelling, triggerRebellion }}>
      {children}
    </MuseumContext.Provider>
  );
}

export function useMuseum() {
  const context = useContext(MuseumContext);
  if (!context) {
    throw new Error('useMuseum must be used within MuseumProvider');
  }
  return context;
}
