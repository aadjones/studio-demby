import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Heart, MapPin } from 'lucide-react';
import { EARTH_ORBIT_KM, DAYS_PER_YEAR, MILLISECONDS_PER_DAY } from '../constants';
import { TimeModuleProps } from '../types';
import { vibes, getVibeClass } from '../designSystem';
import { useT } from '../i18n';

const OrbitModule: React.FC<TimeModuleProps> = ({ targetDate, isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const weddingLabelRef = useRef<SVGTextElement>(null);
  const youAreHereRef = useRef<SVGTextElement>(null);
  const t = useT();
  const [size, setSize] = useState({ width: 0, height: 0, offsetTop: 0 });
  const [minLabelGap, setMinLabelGap] = useState(0);
  const [now, setNow] = useState(() => new Date());
  const vibe = 'space';

  // Track the container's size, including its first real layout (it may still be 0px tall at mount)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() =>
      setSize({ width: el.clientWidth, height: el.clientHeight, offsetTop: el.offsetTop })
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Animate only while this section is on screen
  useEffect(() => {
    if (!isActive) return;
    let animationId: number;
    const animate = () => {
      setNow(new Date());
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isActive]);

  // Near the anniversary both labels sit at the top of the orbit; measure how far apart they must be
  useLayoutEffect(() => {
    const a = weddingLabelRef.current;
    const b = youAreHereRef.current;
    if (!a || !b) return;
    setMinLabelGap((a.getBBox().width + b.getBBox().width) / 2 + 10);
  }, [size, t]);

  const { width, height } = size;
  const isMobile = width < 640;

  // Header Safe Area (branding + toggle)
  const headerSafety = isMobile ? 50 : 70;
  // Bottom Stats Safe Area - Increase this to push the diagram center UP
  const footerSafety = isMobile ? 140 : 180;

  const availableHeightForOrbit = height - headerSafety - footerSafety;
  const centerY = headerSafety + (availableHeightForOrbit / 2);

  // Label padding for vertical radius calculation
  const labelPadding = isMobile ? 50 : 70;
  const horizontalMaxRadius = (width / 2) - 40;
  const verticalMaxRadius = (availableHeightForOrbit / 2) - labelPadding;
  const radius = Math.max(60, Math.min(horizontalMaxRadius, verticalMaxRadius));

  // The diagram's lowest visible element is the "You Are Here" label.
  // offsetTop converts from inner div coords → outer div coords (adds header + h2 height).
  const youAreHereExtension = isMobile ? 40 : 60;
  const statsTop = width > 0 ? size.offsetTop + centerY + radius + youAreHereExtension + 12 : null;

  // Wedding/anniversary marker, fixed at the top of the orbit
  const weddingIconSize = isMobile ? 12 : 16;
  const weddingIconR = radius + (isMobile ? 30 : 40);
  const isMarried = now >= targetDate;

  // Before the wedding diffDays was positive; after it goes negative and Earth carries on round
  const diffDays = (targetDate.getTime() - now.getTime()) / MILLISECONDS_PER_DAY;
  const totalDegrees = (diffDays / DAYS_PER_YEAR) * 360;
  const km = (diffDays / DAYS_PER_YEAR) * EARTH_ORBIT_KM;
  const currentAngle = -Math.PI / 2 + (totalDegrees * Math.PI) / 180;

  const earthX = Math.cos(currentAngle) * radius;
  const earthY = Math.sin(currentAngle) * radius;

  const moonOrbitRadius = isMobile ? 10 : 14;
  const moonRadians = (diffDays / 29.53) * 2 * Math.PI;

  // "You Are Here" label: slide it sideways (toward Earth's side) if it would overlap the top label
  const youAreHereLabelR = radius + youAreHereExtension;
  let youAreHereX = Math.cos(currentAngle) * youAreHereLabelR;
  const youAreHereY = Math.sin(currentAngle) * youAreHereLabelR;
  if (youAreHereY < 0 && Math.abs(youAreHereX) < minLabelGap) {
    youAreHereX = (earthX >= 0 ? 1 : -1) * minLabelGap;
  }

  // Leader line from Earth toward the label, stopping short of the pin
  const toLabelX = youAreHereX - earthX;
  const toLabelY = youAreHereY - earthY;
  const toLabelLen = Math.hypot(toLabelX, toLabelY) || 1;
  const mapPinSize = isMobile ? 10 : 12;

  // Direction-of-travel arrow trailing just ahead of Earth
  const arrowStart = currentAngle - 0.15;
  const arrowEnd = arrowStart - 0.5;
  const arrowD = `M ${Math.cos(arrowStart) * radius} ${Math.sin(arrowStart) * radius} A ${radius} ${radius} 0 0 0 ${Math.cos(arrowEnd) * radius} ${Math.sin(arrowEnd) * radius}`;

  // Distance travelled since the wedding
  const stats = {
    degrees: Math.abs(totalDegrees),
    km: Math.abs(km),
    fraction: Math.abs(diffDays / DAYS_PER_YEAR),
  };

  return (
    <div className={`h-full w-full flex flex-col items-center ${vibes[vibe].container} relative overflow-hidden pt-28 sm:pt-32 px-4`}>
      {/* 1. Module Title */}
      <h2 className={`${getVibeClass(vibe, 'header')} text-center z-10 mb-4 sm:text-2xl`}>
        {t.orbit.header}
      </h2>

      {/* 2. Visualization Area (In Flow) */}
      <div ref={containerRef} className="flex-1 w-full min-h-0 z-0">
        {width > 0 && (
          <svg width={width} height={height}>
            <defs>
              <marker id="orbit-arrow" viewBox="0 0 10 10" refX={5} refY={5} markerWidth={5} markerHeight={5} orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
              </marker>
            </defs>
            <g transform={`translate(${width / 2}, ${centerY})`}>
              {/* Sun */}
              <circle r={isMobile ? 12 : 16} fill="#fff" opacity={0.6} style={{ filter: 'blur(8px)' }} />
              <circle r={isMobile ? 6 : 8} fill="#fff" />

              {/* Orbit Path */}
              <circle r={radius} fill="none" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 3" />

              {/* Wedding tick, heart and label */}
              <line x1={0} y1={-(radius - 15)} x2={0} y2={-(radius + 15)} stroke="#38bdf8" strokeWidth={2} />
              <Heart
                x={-weddingIconSize / 2}
                y={-weddingIconR - weddingIconSize / 2}
                size={weddingIconSize}
                className="text-rose-500"
                fill="currentColor"
                strokeWidth={1.5}
              />
              <text
                ref={weddingLabelRef}
                x={0}
                y={-(radius + (isMobile ? 45 : 60))}
                textAnchor="middle"
                fill="#fff"
                className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold"
              >
                {/* Once married, the same point on the orbit comes round again every anniversary */}
                {isMarried ? t.orbit.anniversary : t.orbit.wedding}
              </text>

              <path d={arrowD} fill="none" stroke="#475569" strokeWidth={1.5} markerEnd="url(#orbit-arrow)" />

              {/* Earth with its moon */}
              <g transform={`translate(${earthX}, ${earthY})`}>
                <circle r={moonOrbitRadius} fill="none" stroke="#1e293b" strokeWidth={0.5} />
                <circle r={isMobile ? 5 : 7} fill="#38bdf8" />
                <circle
                  r={isMobile ? 1.5 : 2.5}
                  cx={Math.cos(moonRadians) * moonOrbitRadius}
                  cy={Math.sin(moonRadians) * moonOrbitRadius}
                  fill="#fff"
                />
              </g>

              {/* "You Are Here" label */}
              <g>
                <line
                  x1={earthX}
                  y1={earthY}
                  x2={youAreHereX - (toLabelX / toLabelLen) * 16}
                  y2={youAreHereY - (toLabelY / toLabelLen) * 16}
                  stroke="#334155"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                />
                <MapPin
                  x={youAreHereX - mapPinSize / 2}
                  y={youAreHereY - mapPinSize / 2 - (isMobile ? 8 : 10)}
                  size={mapPinSize}
                  className="text-white"
                  fill="currentColor"
                  strokeWidth={1.5}
                />
                <text
                  ref={youAreHereRef}
                  x={youAreHereX}
                  y={youAreHereY + (isMobile ? 4 : 6)}
                  textAnchor="middle"
                  fill="#fff"
                  className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-black"
                >
                  {t.orbit.youAreHere}
                </text>
              </g>
            </g>
          </svg>
        )}
      </div>

      {/* 3. Stats — top anchored to diagram's actual bottom edge (offset-corrected coords) */}
      <div className="absolute left-0 right-0 px-4 z-10" style={statsTop !== null ? { top: `${statsTop}px` } : { bottom: '7rem' }}>
        <div className="grid grid-cols-3 gap-3 sm:gap-8 text-center w-full max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <div className={`${getVibeClass(vibe, 'number')} text-base sm:text-xl md:text-2xl`}>
              {stats.degrees.toFixed(1)}°
            </div>
            <div className={`${getVibeClass(vibe, 'label')} mt-0.5 text-[10px] sm:text-xs`}>{t.orbit.arc}</div>
          </div>

          <div className="flex flex-col items-center">
            <div className={`${getVibeClass(vibe, 'number')} text-base sm:text-xl md:text-2xl`}>
              {(stats.km / 1000000).toFixed(1)}M
            </div>
            <div className={`${getVibeClass(vibe, 'label')} mt-0.5 text-[10px] sm:text-xs`}>{t.orbit.km}</div>
          </div>

          <div className="flex flex-col items-center">
            <div className={`${getVibeClass(vibe, 'number')} text-base sm:text-xl md:text-2xl`}>
              {stats.fraction.toFixed(3)}
            </div>
            <div className={`${getVibeClass(vibe, 'label')} mt-0.5 text-[10px] sm:text-xs`}>{t.orbit.orbits}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrbitModule;
