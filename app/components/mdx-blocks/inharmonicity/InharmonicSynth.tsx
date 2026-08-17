"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { partialFreq, centsBetween, partialAmp, decayTau } from "./lib";
import { strikeNote, stopAll, voiceElapsed, type VoiceHandle } from "./audio";

const F0 = 220; // A3
const MAX_B = 0.02;
const PARTIALS = 20;

// Slider position s ∈ [0,1] → B, cubic so the musically relevant low range
// (0–0.001) gets most of the travel while 0 stays reachable exactly.
const sliderToB = (s: number) => MAX_B * s * s * s;
const bToSlider = (B: number) => Math.cbrt(B / MAX_B);

// Landmarks rendered on the slider track. Steinway value is the measured A3
// from Igrec's Table 4 (b=0.21 → B≈0.00024).
const MARKS = [
  { label: "perfect string", short: "perfect", B: 0 },
  { label: "1923 Steinway", short: "steinway", B: 0.00024 },
  { label: "small upright", short: "upright", B: 0.0035 },
  { label: "bell?", short: "bell?", B: MAX_B },
];

const COLORS = {
  bg: "#0b0b0e",
  grid: "rgba(148, 163, 184, 0.4)",
  partial: "#ff6f61",
  partialHover: "#ffffff",
  label: "#a3a3a3",
};

interface HoverInfo {
  n: number;
  freq: number;
  cents: number;
}

/** Plain-language summary of how far the overtones have drifted. */
function driftText(B: number): string {
  if (B === 0) return "overtones perfectly in tune: 2×, 3×, 4×… the fundamental";
  const cents8 = centsBetween(8 * F0, partialFreq(F0, 8, B));
  if (cents8 < 100) return `the 8th overtone lands ${cents8.toFixed(0)}¢ sharp of 8×f₀`;
  return `the 8th overtone lands ${cents8.toFixed(0)}¢ sharp—over ${Math.floor(
    cents8 / 100
  )} semitone${cents8 >= 200 ? "s" : ""} off`;
}

export default function InharmonicSynth() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);

  const [B, setB] = useState(0);
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  // Refs read by the draw loop and pointer handlers
  const bRef = useRef(B);
  const hoverNRef = useRef<number | null>(null);
  const voiceRef = useRef<VoiceHandle | null>(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    bRef.current = B;
  }, [B]);

  // Lazy-init the canvas loop when scrolled into view
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const freqToX = useCallback((f: number, width: number) => {
    return (f / ((PARTIALS + 2) * F0)) * width;
  }, []);

  useEffect(() => {
    if (!visible || !canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const parent = containerRef.current;
    const dctx = canvas.getContext("2d");
    if (!dctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      // clientWidth only — Safari's lazy aspect-ratio resolution makes
      // clientHeight unreliable at observer time (see repo CLAUDE.md)
      const w = parent.clientWidth;
      if (w < 1) return;
      const h = Math.max(180, Math.round(w * 0.42));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.height = `${h}px`;
    };
    resize();
    const resizeObs = new ResizeObserver(resize);
    resizeObs.observe(parent);

    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      if (w < 1) return;

      // Once the strike has fully rung out, return to the resting display
      if (voiceRef.current && voiceElapsed(voiceRef.current) > 9) {
        voiceRef.current = null;
      }
      const voice = voiceRef.current;
      const drawB = voice ? voice.B : bRef.current;
      const elapsed = voice ? Math.max(0, voiceElapsed(voice)) : 0;

      dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dctx.fillStyle = COLORS.bg;
      dctx.fillRect(0, 0, w, h);

      // Legend wraps to two lines when the canvas is narrow
      const legendWraps = w < 440;
      const combTop = legendWraps ? 44 : 24;
      const baseline = h - 22;

      // Ideal harmonic comb at exact n·f0
      dctx.strokeStyle = COLORS.grid;
      dctx.lineWidth = 1;
      for (let n = 1; n <= PARTIALS; n++) {
        const x = freqToX(n * F0, w);
        if (x > w) break;
        dctx.beginPath();
        dctx.moveTo(x, combTop);
        dctx.lineTo(x, baseline);
        dctx.stroke();
      }

      // Actual stiff-string partials; heights follow the sounding envelope
      for (let n = 1; n <= PARTIALS; n++) {
        const fn = partialFreq(F0, n, drawB);
        if (fn > 10000) break;
        const x = freqToX(fn, w);
        if (x > w) break;
        const amp =
          partialAmp(n) * (voice ? Math.exp(-elapsed / decayTau(F0, n)) : 1);
        const barH = Math.max(2, amp * (baseline - 30));
        const isHover = hoverNRef.current === n;
        dctx.strokeStyle = isHover ? COLORS.partialHover : COLORS.partial;
        dctx.lineWidth = isHover ? 3 : 2;
        dctx.beginPath();
        dctx.moveTo(x, baseline);
        dctx.lineTo(x, baseline - barH);
        dctx.stroke();
      }

      // In-chart legend, top left
      dctx.font = "11px ui-monospace, monospace";
      dctx.textAlign = "left";
      dctx.fillStyle = COLORS.partial;
      dctx.fillText("■ the string's overtones", 10, 16);
      dctx.fillStyle = COLORS.label;
      if (legendWraps) {
        dctx.fillText("| where they “should” be", 10, 32);
      } else {
        dctx.fillText("| where they “should” be", 190, 16);
      }

      // Axis labels at a few harmonics
      dctx.fillStyle = COLORS.label;
      dctx.textAlign = "center";
      for (const n of [1, 5, 10, 15, 20]) {
        const x = freqToX(n * F0, w);
        if (x > w - 8) continue;
        dctx.fillText(n === 1 ? "f₀" : `${n}f₀`, x, h - 8);
      }

      // First-visit nudge
      if (!hasPlayedRef.current) {
        dctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        dctx.font = "13px ui-monospace, monospace";
        dctx.textAlign = "center";
        dctx.fillText("▶ tap to listen", w / 2, Math.round(h * 0.45));
      }
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      resizeObs.disconnect();
    };
  }, [visible, freqToX]);

  // Stop audio when the component unmounts
  useEffect(() => {
    return () => voiceRef.current?.stop();
  }, []);

  const play = useCallback((playB: number) => {
    stopAll();
    voiceRef.current = strikeNote({ f0: F0, B: playB, partials: PARTIALS });
    hasPlayedRef.current = true;
    setHasPlayed(true);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const drawB = voiceRef.current ? voiceRef.current.B : bRef.current;

    let best: HoverInfo | null = null;
    let bestDist = 14; // px hit radius
    for (let n = 1; n <= PARTIALS; n++) {
      const fn = partialFreq(F0, n, drawB);
      if (fn > 10000) break;
      const x = freqToX(fn, rect.width);
      const d = Math.abs(x - px);
      if (d < bestDist) {
        bestDist = d;
        best = { n, freq: fn, cents: centsBetween(n * F0, fn) };
      }
    }
    hoverNRef.current = best ? best.n : null;
    setHover(best);
  };

  const clearHover = () => {
    hoverNRef.current = null;
    setHover(null);
  };

  return (
    <div ref={containerRef} className="w-full my-8">
      <canvas
        ref={canvasRef}
        className="w-full rounded-md touch-none cursor-pointer"
        onClick={() => play(bRef.current)}
        onPointerMove={handlePointerMove}
        onPointerLeave={clearHover}
        aria-label="Overtone spectrum of the string. Tap to hear it."
      />
      <div className="mt-1.5 min-h-[1.25rem] text-xs font-mono text-neutral-500 dark:text-neutral-400">
        {hover
          ? `overtone ${hover.n}: ${hover.freq.toFixed(1)} Hz, ${
              hover.cents >= 0.05 ? "+" : ""
            }${hover.cents.toFixed(1)}¢ from ${hover.n}×f₀`
          : driftText(B)}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={() => play(B)}
          className="shrink-0 px-5 py-2.5 text-sm font-mono uppercase tracking-widest rounded bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          ▶ play
        </button>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Drag the stiffness slider, then listen again—it replays on release.
        </p>
      </div>

      <div className="mt-5">
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
          string stiffness
        </span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={bToSlider(B)}
          onChange={(e) => setB(sliderToB(parseFloat(e.target.value)))}
          onPointerUp={() => play(bRef.current)}
          onKeyUp={() => play(bRef.current)}
          className="w-full cursor-pointer accent-neutral-800 dark:accent-neutral-200 mt-1"
          aria-label="String stiffness"
        />
        <div className="relative h-9 sm:h-5 text-[0.65rem] font-mono text-neutral-500 dark:text-neutral-400">
          {MARKS.map((m, i) => {
            const pct = bToSlider(m.B) * 100;
            return (
              <button
                key={m.label}
                onClick={() => {
                  setB(m.B);
                  play(m.B);
                }}
                className={`absolute uppercase tracking-wide whitespace-nowrap hover:text-neutral-800 dark:hover:text-neutral-200 ${
                  // Stagger alternate labels into a second row on mobile so
                  // close landmarks (perfect/steinway) don't collide
                  i % 2 === 1 ? "top-4 sm:top-0" : "top-0"
                }`}
                style={{
                  left: `${pct}%`,
                  transform:
                    i === 0
                      ? "none"
                      : i === MARKS.length - 1
                        ? "translateX(-100%)"
                        : "translateX(-50%)",
                }}
              >
                <span className="sm:hidden">{m.short}</span>
                <span className="hidden sm:inline">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
