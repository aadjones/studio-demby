import { useEffect, useRef } from 'react';
import { SynthParams } from '../config/defaultParams';

interface UseLfoAnimationProps {
  params: SynthParams;
  shaderRefs: { [K in keyof SynthParams]: { current: number } };
  isPlaying: boolean;
}

export function useLfoAnimation({ params, shaderRefs, isPlaying }: UseLfoAnimationProps) {
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = (time: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = time;
      }

      const elapsed = (time - startTimeRef.current) / 1000;
      
      // Update LFO values
      const lfoValue = Math.sin(elapsed * params.lfoFrequency * Math.PI * 2) * params.lfoAmplitude;
      
      // Apply LFO to parameters
      shaderRefs.carrierFreqX.current = params.carrierFreqX * (1 + lfoValue);
      shaderRefs.carrierFreqY.current = params.carrierFreqY * (1 + lfoValue);
      shaderRefs.modulatorFreq.current = params.modulatorFreq * (1 + lfoValue);
      shaderRefs.modulationIndex.current = params.modulationIndex + lfoValue;
      shaderRefs.amplitudeModulationIndex.current = params.amplitudeModulationIndex + lfoValue;
      shaderRefs.modulationCenterX.current = params.modulationCenterX + lfoValue;
      shaderRefs.modulationCenterY.current = params.modulationCenterY + lfoValue;

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [params, shaderRefs, isPlaying]);
}
