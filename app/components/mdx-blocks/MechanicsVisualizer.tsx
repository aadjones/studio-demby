'use client';

import React from 'react';

const MechanicsVisualizer: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 mt-6">

      {/* SECTION 0: DEFINITIONS */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DefinitionCard
            title="Atomic Second"
            icon="⚛️"
            desc="The fundamental unit. Defined as exactly 9,192,631,770 oscillations of a Cesium-133 atom. It never changes."
        />
        <DefinitionCard
            title="Atomic Day"
            icon="⏱️"
            desc="Exactly 86,400 atomic seconds (24 hours × 60 min × 60 sec). This is what our computers and watches count."
        />
        <DefinitionCard
            title="Solar Day"
            icon="☀️"
            desc="The time it takes Earth to spin once so the Sun appears in the same place. It varies slightly but averages ~86,400.002 atomic seconds."
        />
        <DefinitionCard
            title="Tropical Year"
            icon="🌍"
            desc="The time for one full orbit around the Sun. It equals roughly 365.2422 atomic days."
        />
      </section>

      {/* SECTION 1: LEAP YEAR (ORBIT) */}
      <section className="bg-time-surface-50 p-6 rounded-xl border border-time-border-300 shadow-xl">
        <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-time-text-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              1. The Orbit (Leap Years)
            </h3>
            <p className="text-sm text-time-text-600 mt-1 max-w-2xl">
              The Earth&apos;s revolution around the Sun takes approximately 365.2422 days. This is a consistent, predictable pattern caused by gravity. We solve the mismatch by adding a fixed day (Feb 29) every 4 years.
            </p>
          </div>
          <div className="px-3 py-1 bg-green-50 border border-green-300 rounded-full text-xs text-green-700 font-mono whitespace-nowrap">
            Status: PREDICTABLE
          </div>
        </div>

        <div className="relative h-[400px] w-full flex items-center justify-center bg-time-surface-100 rounded-lg border border-time-border-300 overflow-hidden mb-6">
          <LeapYearVisual />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Why it matters: Leap Year */}
          <div className="bg-time-surface-100 border border-time-border-300 rounded-lg p-4 flex gap-4">
             <div className="flex-shrink-0 mt-1">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </div>
             <div>
               <h4 className="text-sm font-bold text-time-text-800">Why This Matters</h4>
               <p className="text-sm text-time-text-600 mt-1">
                 Without leap years, our calendar would drift by about 6 hours every year. After 100 years, the calendar would be off by 25 days. Eventually, the Northern Hemisphere would be celebrating Christmas in the middle of summer.
               </p>
             </div>
          </div>

          {/* Folklore: Leap Day William */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-4">
             <div className="flex-shrink-0 mt-1 text-2xl">🍬</div>
             <div>
               <h4 className="text-sm font-bold text-blue-900">Folklore: Leap Day William</h4>
               <p className="text-xs text-blue-700 mt-0.5 italic mb-1">&ldquo;Real life is for March!&rdquo;</p>
               <p className="text-sm text-time-text-600">
                 According to legend, a gilled entity named Leap Day William emerges from the Mariana Trench every 4 years. He wears blue and yellow and trades candy for children&apos;s tears. Remember to wear blue or he&apos;ll poke you in the eye!
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* EXPLAINER: Why Leap Years Work */}
      <section className="bg-green-50 p-6 rounded-xl border-2 border-green-300 shadow-lg">
        <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
          <span className="text-xl">✓</span>
          Why This Works: Predictable Orbits
        </h3>
        <p className="text-sm text-time-text-700 leading-relaxed">
          Earth&apos;s orbit around the Sun is governed by gravity—a stable, predictable force. The orbital period is constant at ~365.2422 days, which means we can calculate leap years for millennia into the future with perfect accuracy. The pattern is simple: add a day every 4 years, skip century years unless they&apos;re divisible by 400.
        </p>
      </section>

      {/* SECTION 2: LEAP SECONDS (SPIN) */}
      <section className="bg-time-surface-50 p-6 rounded-xl border border-time-border-300 shadow-xl">
         <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-time-text-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              2. The Spin (Leap Seconds)
            </h3>
            <p className="text-sm text-time-text-600 mt-1 max-w-2xl">
              The Earth&apos;s rotation on its own axis determines the length of a day. Unlike the orbit, the spin is chaotic—influenced by magma currents, tides, and weather. We cannot predict it far in advance.
              <span className="block mt-2 text-accent-500">
                (Fun Fact: The last leap second was added on December 31, 2016. As of 2025, Earth&apos;s rotation has actually sped up slightly, so we haven&apos;t needed one in years!)
              </span>
            </p>
          </div>
          <div className="px-3 py-1 bg-red-50 border border-red-300 rounded-full text-xs text-red-700 font-mono whitespace-nowrap">
            Status: CHAOTIC
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Positive Leap Second Panel */}
          <div className="h-[450px] w-full bg-time-surface-100 rounded-lg border border-time-border-300 overflow-hidden">
            <PositiveLeapSecondVisual />
          </div>

          {/* Negative Leap Second Panel */}
          <div className="h-[450px] w-full bg-time-surface-100 rounded-lg border border-time-border-300 overflow-hidden">
            <NegativeLeapSecondVisual />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Why it matters: Leap Second */}
          <div className="bg-time-surface-100 border border-time-border-300 rounded-lg p-4 flex gap-4">
             <div className="flex-shrink-0 mt-1">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </div>
             <div>
               <h4 className="text-sm font-bold text-time-text-800">Why This Matters</h4>
               <p className="text-sm text-time-text-600 mt-1">
                 Without leap seconds, the gap between atomic time (clocks) and solar time (sun) would grow. It is a slow drift (~1 min every 50 years), but eventually, noon on the clock would drift away from solar noon.
               </p>
             </div>
          </div>

          {/* Folklore: Leap Second Lenny */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex gap-4">
             <div className="flex-shrink-0 mt-1 text-2xl">👾</div>
             <div>
               <h4 className="text-sm font-bold text-purple-900">Folklore: Leap Second Lenny</h4>
               <p className="text-xs text-purple-700 mt-0.5 italic mb-1">&ldquo;Mind the gap.&rdquo;</p>
               <p className="text-sm text-time-text-600">
                 A glitch-gremlin made of discarded milliseconds who lives in the buffer overflow of atomic clocks. When a positive leap second occurs (23:59:60), Lenny pauses time to tie his shoes; if you aren&apos;t wearing a watch, he steals a second of your life. During a negative leap second, he walks backward through server rooms, devouring data to make the clock skip a beat.
               </p>
             </div>
          </div>
        </div>
      </section>

    </div>
  );
};

// --- REUSABLE COMPONENTS ---

const DefinitionCard = ({ title, icon, desc }: { title: string, icon: string, desc: string }) => (
    <div className="bg-time-surface-50 p-4 rounded-xl border border-time-border-300 shadow-sm flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{icon}</span>
            <h4 className="font-bold text-time-text-800 text-sm">{title}</h4>
        </div>
        <p className="text-xs text-time-text-600 leading-relaxed">
            {desc}
        </p>
    </div>
);

// Reusable 3D-ish Earth for Spin Visuals (Shifted Center Y to 180)
const EarthGlobe = () => (
  <g transform="rotate(-15, 200, 180)">
     {/* Atmosphere Halo */}
     <circle cx="200" cy="180" r="62" fill="none" stroke="#4B5563" strokeOpacity="0.3" strokeWidth="1" />

     {/* Main Body */}
     <circle cx="200" cy="180" r="60" fill="#1F2937" stroke="#374151" strokeWidth="2" />

     {/* Longitude Lines (Ellipses) */}
     <ellipse cx="200" cy="180" rx="20" ry="60" fill="none" stroke="#374151" strokeWidth="1" />
     <ellipse cx="200" cy="180" rx="40" ry="60" fill="none" stroke="#374151" strokeWidth="1" />
     <line x1="200" y1="120" x2="200" y2="240" stroke="#374151" strokeWidth="1" />

     {/* Latitude Lines (Curves) */}
     <path d="M 142 160 Q 200 175 258 160" fill="none" stroke="#374151" strokeWidth="1" />
     <path d="M 142 200 Q 200 215 258 200" fill="none" stroke="#374151" strokeWidth="1" />
     <line x1="140" y1="180" x2="260" y2="180" stroke="#374151" strokeWidth="1" strokeDasharray="2 2" />

     {/* Axis Pole */}
     <line x1="200" y1="100" x2="200" y2="260" stroke="#6B7280" strokeWidth="3" strokeLinecap="round" />
     <text x="200" y="90" textAnchor="middle" fill="#9CA3AF" fontSize="10" fontWeight="bold" transform="rotate(15, 200, 90)">N</text>
     <text x="200" y="280" textAnchor="middle" fill="#9CA3AF" fontSize="10" fontWeight="bold" transform="rotate(15, 200, 280)">S</text>
  </g>
);

const PositiveLeapSecondVisual = () => (
  <div className="w-full h-full flex flex-col animate-fade-in p-3">
    {/* Case label */}
    <div className="bg-white/95 px-3 py-1 text-xs font-mono text-accent-500 border border-time-border-300 rounded-lg mb-3 self-start">
      CASE A: EARTH LAGS BEHIND
    </div>

    {/* Text box at top with proper spacing */}
    <div className="text-xs text-accent-600 font-mono bg-white/90 px-3 py-2 rounded border border-accent-400 shadow-lg mb-3">
        <span className="text-time-text-700">
           Atomic clocks tick 86,400 times (Midnight), but Earth hasn&apos;t finished its rotation.
        </span>
    </div>

    {/* SVG in the middle - takes remaining space */}
    <div className="flex-1 flex items-center justify-center">
      <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
        <defs>
            <marker id="arrow-blue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 L0,0" fill="#818CF8" />
            </marker>
        </defs>

        <EarthGlobe />

        {/* Start Line Reference (Midnight) - Shifted Y by +30 */}
        <line x1="200" y1="180" x2="200" y2="80" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="4 2" />
        <text x="200" y="70" textAnchor="middle" fill="#E5E7EB" fontSize="11" fontWeight="bold">UTC Midnight</text>

        {/* Rotation Path (Blue) - Stopping Short at ~330 degrees - Shifted Y by +30 */}
        <path
            d="M 200 90 A 90 90 0 1 1 170 95"
            fill="none"
            stroke="#818CF8"
            strokeWidth="3"
            markerEnd="url(#arrow-blue)"
        />

        {/* The "Gap" (Yellow) - Shifted Y by +30 */}
        <path
            d="M 170 95 A 90 90 0 0 1 200 90"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="3"
            strokeDasharray="4 3"
        />

        {/* Labels - Shifted Y - Moved X to 350 to prevent overlap */}
        <text x="350" y="180" fill="#818CF8" fontSize="12" textAnchor="middle">
             <tspan x="350" dy="-5">Actual Spin</tspan>
        </text>

        <text x="80" y="130" fill="#F59E0B" fontSize="12" textAnchor="middle">
             <tspan x="80" dy="0">Lag</tspan>
             <tspan x="80" dy="15">~0.9s</tspan>
        </text>

        {/* Connection Line to Gap - Shifted Y */}
        <path d="M 80 150 Q 100 170 165 100" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.5" />
      </svg>
    </div>

    {/* Solution at bottom with proper spacing */}
    <div className="bg-white/95 text-time-text-700 px-4 py-2 rounded-full border border-time-border-300 shadow-xl text-xs text-center mt-3">
       Solution: <span className="text-accent-600 font-bold">Add 1 Second</span> (Wait)
    </div>
  </div>
);

const NegativeLeapSecondVisual = () => (
    <div className="w-full h-full flex flex-col animate-fade-in p-3">
      {/* Case label */}
      <div className="bg-white/95 px-3 py-1 text-xs font-mono text-red-600 border border-time-border-300 rounded-lg mb-3 self-start">
        CASE B: EARTH SPINS AHEAD
      </div>

      {/* Text box at top with proper spacing */}
      <div className="text-xs text-red-700 font-mono bg-white/90 px-3 py-2 rounded border border-red-400 shadow-lg mb-3">
          <span className="text-time-text-700 block mb-1">
            Earth spins too fast. Solar Midnight happens before Atomic Midnight.
          </span>
          <span className="text-red-600 italic block">
             *Has never happened! (Theoretical possibility ~2029)
          </span>
      </div>

      {/* SVG in the middle - takes remaining space */}
      <div className="flex-1 flex items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
          <defs>
              <marker id="arrow-red" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 L0,0" fill="#F87171" />
              </marker>
          </defs>

          <EarthGlobe />

          {/* Start Line Reference (Midnight) - Shifted Y by +30 */}
          <line x1="200" y1="180" x2="200" y2="80" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="4 2" />
          <text x="200" y="70" textAnchor="middle" fill="#E5E7EB" fontSize="11" fontWeight="bold">UTC Midnight</text>

          {/* Rotation Path (Red) - Going PAST 360 to ~1 o'clock - Shifted Y by +30 */}
          <circle cx="200" cy="180" r="90" fill="none" stroke="#F87171" strokeWidth="1" strokeOpacity="0.2" />

          <path
              d="M 200 90 A 90 90 0 0 1 230 95"
              fill="none"
              stroke="#F87171"
              strokeWidth="4"
              markerEnd="url(#arrow-red)"
          />

          {/* Labels - Shifted Y - Moved X to 350 for consistency */}
          <text x="350" y="110" fill="#EF4444" fontSize="12" textAnchor="middle">
               <tspan x="350" dy="0">Overshoot</tspan>
          </text>

          {/* Connection Line - Shifted Y */}
          <line x1="300" y1="115" x2="235" y2="100" stroke="#EF4444" strokeWidth="1" opacity="0.5" />
        </svg>
      </div>

      {/* Solution at bottom with proper spacing */}
      <div className="bg-white/95 text-time-text-700 px-4 py-2 rounded-full border border-time-border-300 shadow-xl text-xs text-center mt-3">
         Solution: <span className="text-red-600 font-bold">Skip 1 Second</span>
      </div>
    </div>
  );

const LeapYearVisual = () => (
    <div className="w-full h-full flex flex-col animate-fade-in">
      {/* Text box at top with proper spacing */}
      <div className="text-xs text-green-700 font-mono bg-white/90 px-3 py-2 rounded border border-green-400 shadow-lg mb-3">
          <strong className="block text-green-800 mb-1">THE PROBLEM</strong>
          <span className="text-time-text-700">
             Calendar Year: 365 Days<br/>
             Actual Orbit: ~365.2422 Days
          </span>
      </div>

      {/* SVG in the middle - takes remaining space */}
      <div className="flex-1 flex items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 450 300" preserveAspectRatio="xMidYMid meet">
        <defs>
            <marker id="arrow-green" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 L0,0" fill="#34D399" />
            </marker>
        </defs>

        <g transform="translate(10, -25)">
            {/* Sun */}
            <circle cx="200" cy="150" r="25" fill="#FBBF24" stroke="#D97706" strokeWidth="2">
                <animate attributeName="r" values="25;27;25" dur="4s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="1;0.5;1" dur="4s" repeatCount="indefinite" />
            </circle>
            <text x="200" y="154" textAnchor="middle" fill="#78350F" fontSize="10" fontWeight="bold">SUN</text>

            {/* Full Orbit Path (Dashed Reference) */}
            <ellipse cx="200" cy="150" rx="120" ry="90" fill="none" stroke="#374151" strokeWidth="1" strokeDasharray="4 4" />

            {/* Start Line */}
            <line x1="200" y1="60" x2="200" y2="40" stroke="#4B5563" strokeWidth="1" />
            <text x="200" y="35" textAnchor="middle" fill="#9CA3AF" fontSize="11" fontWeight="bold">Jan 1 (Start)</text>

            {/* Travel Path - Stops short of top center */}
            <path
            d="M 200 60 A 120 90 0 1 1 175 62"
            fill="none"
            stroke="#34D399"
            strokeWidth="3"
            strokeLinecap="round"
            markerEnd="url(#arrow-green)"
            />

            {/* Earth Position Icon */}
            <circle cx="175" cy="62" r="8" fill="#10B981" stroke="#064E3B" strokeWidth="1" />

            {/* Gap Indicator */}
            <path
            d="M 175 62 A 120 90 0 0 1 200 60"
            fill="none"
            stroke="#EF4444"
            strokeWidth="3"
            strokeDasharray="3 2"
            />

            {/* Labels - Moved X to 385 to further right, transform shifted group left */}
            <text x="385" y="150" fill="#34D399" fontSize="12" textAnchor="middle">
              <tspan x="385" dy="0">Travels 365 days</tspan>
            </text>

            <text x="110" y="50" fill="#EF4444" fontSize="12" textAnchor="middle">
              <tspan x="110" dy="0">Missing ~6 hours</tspan>
            </text>

            {/* Connector */}
            <path d="M 110 60 Q 140 80 185 62" fill="none" stroke="#EF4444" strokeWidth="1" opacity="0.5" />
        </g>
        </svg>
      </div>

      {/* Solution at bottom with proper spacing */}
      <div className="flex flex-col items-center gap-1 bg-white/95 text-time-text-700 px-5 py-2 rounded-2xl border border-time-border-300 shadow-xl mt-3">
        <div className="text-sm">
            Solution: Every 4 years*, <span className="text-green-700 font-bold">Add 1 Day</span> (Feb 29)
        </div>
        <div className="text-[10px] text-time-text-600 font-mono tracking-tight max-w-[300px] text-center leading-3">
            *This assumes a year is 365.25 days. Since it&apos;s actually ~365.2422, we skip leap years every 100 years (1900) but keep them every 400 (2000) to average 365.2425. Close enough!
        </div>
      </div>
    </div>
  );

export default MechanicsVisualizer;
