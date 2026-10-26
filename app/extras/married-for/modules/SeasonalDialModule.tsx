import React, { useEffect, useRef, useState } from "react";
import { Snowflake, Flower2, Sun, Leaf } from "lucide-react";
import { TimeModuleProps } from "../types";
import { MILLISECONDS_PER_DAY } from "../constants";
import { vibes, getVibeClass } from "../designSystem";
import { useT, useLocale } from "../i18n";

// Angles run clockwise from 12 o'clock (winter solstice at the top)
const polar = (angle: number, r: number) => ({ x: Math.sin(angle) * r, y: -Math.cos(angle) * r });

// Filled pie slice from the center, between two angles
const wedgePath = (start: number, end: number, r: number) => {
  const a = polar(start, r);
  const b = polar(end, r);
  const largeArc = end - start > Math.PI ? 1 : 0;
  return `M 0 0 L ${a.x} ${a.y} A ${r} ${r} 0 ${largeArc} 1 ${b.x} ${b.y} Z`;
};

// Position within the solstice-to-solstice year, as an angle
const cycleAngle = (d: Date) => {
  let lastWinterSolstice = new Date(d.getFullYear(), 11, 21);
  if (d < lastWinterSolstice) lastWinterSolstice = new Date(d.getFullYear() - 1, 11, 21);
  const nextWinterSolstice = new Date(lastWinterSolstice.getFullYear() + 1, 11, 21);
  const cycleDays = (nextWinterSolstice.getTime() - lastWinterSolstice.getTime()) / MILLISECONDS_PER_DAY;
  const daysPassed = (d.getTime() - lastWinterSolstice.getTime()) / MILLISECONDS_PER_DAY;
  return (daysPassed / cycleDays) * 2 * Math.PI;
};

const SEASONS = [
  { startAngle: 0, endAngle: Math.PI / 2, labelAngle: Math.PI / 4, color: '#94a3b8', icon: Snowflake, iconColor: '#ffffff' }, // winter: slate-400 (frosty)
  { startAngle: Math.PI / 2, endAngle: Math.PI, labelAngle: (3 * Math.PI) / 4, color: '#4ade80', icon: Flower2, iconColor: '#4ade80' }, // spring: green-400 (bloom)
  { startAngle: Math.PI, endAngle: (3 * Math.PI) / 2, labelAngle: (5 * Math.PI) / 4, color: '#fbbf24', icon: Sun, iconColor: '#facc15' }, // summer: amber-400 (sun)
  { startAngle: (3 * Math.PI) / 2, endAngle: 2 * Math.PI, labelAngle: (7 * Math.PI) / 4, color: '#c2410c', icon: Leaf, iconColor: '#f97316' }, // fall: orange-700 (earth/leaves)
];

const SeasonalDialModule: React.FC<TimeModuleProps> = ({ targetDate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const t = useT();
  const [locale] = useLocale();
  const vibe = 'elemental';

  // Track the container's size. Watching the element (not the window) also catches the first
  // real layout, since the container can still be 0px tall when this mounts.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setSize({ width: el.clientWidth, height: el.clientHeight }));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { width, height } = size;
  const isMobile = width < 640;

  // Tightened label padding — empirically: equinox text is ~110px wide, not 155px.
  // Bottom labels (2 lines + date) need ~78px on desktop, not 90px.
  const topLabelPad = isMobile ? 30 : 52;
  const bottomLabelPad = isMobile ? 95 : 120;
  const sideLabelPad = isMobile ? 78 : 118;

  // Largest constraint wins for each axis
  const maxFromH = (height / 2) - Math.max(topLabelPad, bottomLabelPad);
  const maxFromW = (width / 2) - sideLabelPad;
  const radius = Math.max(40, Math.min(maxFromH, maxFromW));

  // Font scales with radius so text stays proportional on small diagrams
  const labelFontPx = Math.max(8, Math.min(isMobile ? 10 : 12, Math.round(radius * 0.10)));
  const dateFontPx = Math.max(7, Math.min(isMobile ? 9 : 10, Math.round(radius * 0.08)));
  const youHereFontPx = Math.max(8, Math.min(isMobile ? 11 : 13, Math.round(radius * 0.11)));

  // Shift center up so the taller bottom labels don't push into the nav zone
  const centerYOffset = -Math.round((bottomLabelPad - topLabelPad) / 2);

  const iconSize = isMobile ? 16 : 24;
  const iconOffset = isMobile ? 0.35 : 0.4;

  // --- SOLSTICE / EQUINOX LABELS ---
  const labelSpacing = isMobile ? 12 : 25;
  const dateLocale = locale === 'es' ? 'es-MX' : 'en-US';
  const fmtDate = (m: number, d: number) =>
    new Date(2026, m, d).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric' }).toUpperCase();

  const cardinalLabels: { name: string; date: string; angle: number; align: 'start' | 'middle' | 'end'; dy: number; dx: number }[] = [
    { name: t.seasonal.winterSolstice, date: fmtDate(11, 21), angle: 0, align: 'middle', dy: -labelSpacing - 15, dx: 0 },
    { name: t.seasonal.vernalEquinox, date: fmtDate(2, 20), angle: Math.PI / 2, align: 'start', dy: 0, dx: labelSpacing },
    { name: t.seasonal.summerSolstice, date: fmtDate(5, 21), angle: Math.PI, align: 'middle', dy: labelSpacing + 12, dx: 0 },
    { name: t.seasonal.autumnalEquinox, date: fmtDate(8, 22), angle: (3 * Math.PI) / 2, align: 'end', dy: -labelSpacing, dx: isMobile ? -8 : -labelSpacing },
  ];

  // Two-line labels: "Winter / Solstice", or "Solsticio / de Invierno" in Spanish
  const splitLabel = (name: string) => {
    const words = name.split(' ');
    if (words.length === 1) return [name];
    if (words.length === 3 && words[1].toLowerCase() === 'de') return [words[0], words.slice(1).join(' ')];
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  };

  // --- CURRENT PROGRESS ---
  const now = new Date();
  const currentAngle = cycleAngle(now);
  const activeSeasonIndex = Math.min(3, Math.floor(currentAngle / (Math.PI / 2)));
  const activeSeason = SEASONS[activeSeasonIndex];
  const current = polar(currentAngle, radius);

  // Label for You Are Here:
  // - Top/bottom zone (|sin| < 0.7): outside the circle — plenty of vertical room
  // - Left/right zone (|sin| ≥ 0.7): inside the circle — horizontal space is used up by equinox labels
  const isLeftRight = Math.abs(Math.sin(currentAngle)) >= 0.7;
  const curLabel = polar(currentAngle, isLeftRight ? radius * 0.62 : radius + (isMobile ? 70 : 100));

  // --- WEDDING TARGET MARKER ---
  const targetAngle = cycleAngle(targetDate);
  const target = polar(targetAngle, radius);
  const tarLabel = polar(targetAngle, radius + (isMobile ? 40 : 100));

  return (
    <div className={`h-full w-full flex flex-col items-center ${vibes[vibe].container} relative overflow-hidden pt-28 sm:pt-32 px-4`}>
      <h2 className={`${getVibeClass(vibe, 'header')} text-center z-10 mb-2 sm:text-3xl`}>
        {t.seasonal.header}
      </h2>
      <div ref={containerRef} className="flex-1 w-full min-h-0 z-0">
        {width > 0 && (
          <svg width={width} height={height}>
            <g transform={`translate(${width / 2}, ${height / 2 + centerYOffset})`}>
              {/* Base dial */}
              <circle r={radius} fill="none" stroke="#334155" strokeWidth={1} />

              {/* Axes (solid lines for clearer quadrants) */}
              {[0, Math.PI / 2].map((d) => (
                <line
                  key={d}
                  x1={Math.sin(d) * -radius * 1.05}
                  y1={-Math.cos(d) * -radius * 1.05}
                  x2={Math.sin(d) * radius * 1.05}
                  y2={-Math.cos(d) * radius * 1.05}
                  stroke="#334155"
                  strokeWidth={1.5}
                />
              ))}

              {/* Solstice / equinox labels */}
              <g>
                {cardinalLabels.map((d) => {
                  const p = polar(d.angle, radius);
                  const textX = p.x + d.dx;
                  const textY = p.y + d.dy;
                  const lines = splitLabel(d.name);
                  return (
                    <g key={d.name}>
                      <text
                        x={textX}
                        y={textY}
                        textAnchor={d.align}
                        className="font-serif text-emerald-200 fill-current italic tracking-wide"
                        style={{ fontSize: `${labelFontPx}px` }}
                      >
                        {lines.map((line, i) => (
                          <tspan key={i} x={textX} dy={i === 0 ? 0 : '1.2em'}>{line}</tspan>
                        ))}
                      </text>
                      <text
                        x={textX}
                        y={textY + lines.length * labelFontPx * 1.3}
                        textAnchor={d.align}
                        className="font-sans text-emerald-400/60 fill-current tracking-[0.2em]"
                        style={{ fontSize: `${dateFontPx}px` }}
                      >
                        {d.date}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* Tinted wedge for the season so far */}
              <path d={wedgePath(activeSeason.startAngle, currentAngle, radius * 0.95)} fill={activeSeason.color} opacity={0.05} />

              {/* Current date line */}
              <line x1={0} y1={0} x2={current.x} y2={current.y} stroke={activeSeason.color} strokeWidth={2} opacity={0.8} />

              {/* Outline the label in the background color so the date line doesn't strike through it */}
              <g style={{ paintOrder: 'stroke', stroke: '#1a2f2a', strokeWidth: '4px', strokeLinejoin: 'round' }}>
                <text
                  x={curLabel.x}
                  y={curLabel.y}
                  textAnchor="middle"
                  className="font-serif italic text-emerald-100 fill-current tracking-tight"
                  style={{ fontSize: `${youHereFontPx}px` }}
                >
                  {t.seasonal.youAreHere}
                </text>
                <text
                  x={curLabel.x}
                  y={curLabel.y + youHereFontPx * 1.5}
                  textAnchor="middle"
                  className="font-sans text-emerald-400 fill-current tracking-widest font-bold"
                  style={{ fontSize: `${dateFontPx}px` }}
                >
                  {now.toLocaleDateString(dateLocale, { month: 'short', day: 'numeric' }).toUpperCase()}
                </text>
              </g>

              {/* Wedding marker */}
              <circle cx={target.x} cy={target.y} r={5} fill="none" stroke="#fbbf24" strokeWidth={2} />
              <g>
                <text
                  x={tarLabel.x}
                  y={tarLabel.y}
                  textAnchor="middle"
                  className="font-serif italic text-amber-100 fill-current"
                  style={{ fontSize: `${youHereFontPx}px` }}
                >
                  {t.seasonal.wedding}
                </text>
                <text
                  x={tarLabel.x}
                  y={tarLabel.y + youHereFontPx * 1.5}
                  textAnchor="middle"
                  className="font-sans text-amber-500 fill-current tracking-widest font-bold"
                  style={{ fontSize: `${dateFontPx}px` }}
                >
                  {targetDate.toLocaleDateString(dateLocale, { month: 'short', day: 'numeric', timeZone: 'America/Los_Angeles' }).toUpperCase()}
                </text>
              </g>

              {/* Season icons, drawn last so they sit on top. An inside "you are here" label lands on
                  the current season's icon, so that one is skipped; the tinted wedge already marks the season. */}
              {SEASONS.map((season, i) => {
                if (isLeftRight && i === activeSeasonIndex) return null;
                const p = polar(season.labelAngle, radius * iconOffset);
                const Icon = season.icon;
                return (
                  <Icon
                    key={i}
                    x={p.x - iconSize / 2}
                    y={p.y - iconSize / 2}
                    size={iconSize}
                    color={season.iconColor}
                    style={{ opacity: 0.9 }}
                    strokeWidth={1.5}
                  />
                );
              })}
            </g>
          </svg>
        )}
      </div>
      <div className="pb-14 sm:pb-20" />
    </div>
  );
};

export default SeasonalDialModule;
