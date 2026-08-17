"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { analyzeStringSpectrum, type SpectrumAnalysis } from "./analysis";
import { playSampleBuffer } from "./audio";

const SAMPLE_URL = "/audio/inharmonicity/salamander-a3.mp3";
const F0_NOMINAL = 220; // A3
const MAX_PARTIALS = 16;
const FLOOR_DB = -80;

const COLORS = {
  bg: "#0b0b0e",
  grid: "rgba(148, 163, 184, 0.4)",
  curve: "#ff6f61",
  dot: "#ffb4a8",
  dotHover: "#ffffff",
  label: "#a3a3a3",
};

interface HoverInfo {
  n: number;
  freq: number;
  cents: number;
}

export default function RealPianoSpectrum() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [analysis, setAnalysis] = useState<SpectrumAnalysis | null>(null);
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  const bufferRef = useRef<AudioBuffer | null>(null);
  const playingRef = useRef<{ stop: () => void } | null>(null);

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

  // Fetch + decode + analyze once in view. Decoding uses OfflineAudioContext
  // so no user gesture is needed; playback creates the real context later.
  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(SAMPLE_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const bytes = await res.arrayBuffer();
        const offline = new OfflineAudioContext(1, 1, 48000);
        const buffer = await offline.decodeAudioData(bytes);
        if (cancelled) return;
        bufferRef.current = buffer;
        const samples = buffer.getChannelData(0);
        const result = analyzeStringSpectrum(
          samples,
          buffer.sampleRate,
          F0_NOMINAL,
          MAX_PARTIALS
        );
        if (cancelled) return;
        setAnalysis(result);
        setStatus("ready");
      } catch (err) {
        console.error("RealPianoSpectrum analysis failed:", err);
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [visible]);

  useEffect(() => {
    return () => playingRef.current?.stop();
  }, []);

  const freqToX = useCallback(
    (f: number, width: number, f0: number) =>
      (f / ((MAX_PARTIALS + 2) * f0)) * width,
    []
  );

  // Static draw (no animation loop—the analysis doesn't change)
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const parent = containerRef.current;
    if (!canvas || !parent) return;
    const dctx = canvas.getContext("2d");
    if (!dctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = parent.clientWidth;
    if (w < 1) return;
    const h = Math.max(180, Math.round(w * 0.42));
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.height = `${h}px`;

    dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dctx.fillStyle = COLORS.bg;
    dctx.fillRect(0, 0, w, h);

    const legendWraps = w < 460;
    const plotTop = legendWraps ? 44 : 24;
    const baseline = h - 22;

    dctx.font = "11px ui-monospace, monospace";
    dctx.textAlign = "left";
    dctx.fillStyle = COLORS.curve;
    dctx.fillText("■ recorded grand piano, A3", 10, 16);
    dctx.fillStyle = COLORS.label;
    dctx.fillText(
      "| perfect harmonics n·f₀",
      legendWraps ? 10 : 220,
      legendWraps ? 32 : 16
    );

    if (!analysis) {
      dctx.fillStyle = COLORS.label;
      dctx.font = "13px ui-monospace, monospace";
      dctx.textAlign = "center";
      dctx.fillText(
        status === "error" ? "couldn't load the recording" : "analyzing…",
        w / 2,
        Math.round(h * 0.5)
      );
      return;
    }

    const { f0, mags, binHz, partials } = analysis;

    // Harmonic comb at the fitted f0
    dctx.strokeStyle = COLORS.grid;
    dctx.lineWidth = 1;
    for (let n = 1; n <= MAX_PARTIALS; n++) {
      const x = freqToX(n * f0, w, f0);
      if (x > w) break;
      dctx.beginPath();
      dctx.moveTo(x, plotTop);
      dctx.lineTo(x, baseline);
      dctx.stroke();
    }

    // Measured spectrum in dB, per-pixel max
    let magMax = 0;
    for (let i = 0; i < mags.length; i++) {
      if (mags[i] > magMax) magMax = mags[i];
    }
    const dbToY = (db: number) =>
      baseline - ((db - FLOOR_DB) / -FLOOR_DB) * (baseline - plotTop);
    dctx.strokeStyle = COLORS.curve;
    dctx.lineWidth = 1.5;
    dctx.beginPath();
    for (let px = 0; px < w; px++) {
      const fLo = (px / w) * (MAX_PARTIALS + 2) * f0;
      const fHi = ((px + 1) / w) * (MAX_PARTIALS + 2) * f0;
      const i0 = Math.floor(fLo / binHz);
      const i1 = Math.min(mags.length, Math.ceil(fHi / binHz));
      let m = 0;
      for (let i = i0; i < i1; i++) if (mags[i] > m) m = mags[i];
      const db = Math.max(FLOOR_DB, 20 * Math.log10(m / magMax + 1e-30));
      const y = dbToY(db);
      if (px === 0) dctx.moveTo(px, y);
      else dctx.lineTo(px, y);
    }
    dctx.stroke();

    // Dots on the measured partials
    for (const p of partials) {
      const x = freqToX(p.freq, w, f0);
      const db = Math.max(FLOOR_DB, 20 * Math.log10(p.mag / magMax + 1e-30));
      const isHover = hover?.n === p.n;
      dctx.fillStyle = isHover ? COLORS.dotHover : COLORS.dot;
      dctx.beginPath();
      dctx.arc(x, dbToY(db), isHover ? 4 : 2.5, 0, Math.PI * 2);
      dctx.fill();
    }

    // Axis labels
    dctx.fillStyle = COLORS.label;
    dctx.font = "10px ui-monospace, monospace";
    dctx.textAlign = "center";
    for (const n of [1, 4, 8, 12, 16]) {
      const x = freqToX(n * f0, w, f0);
      if (x > w - 8) continue;
      dctx.fillText(n === 1 ? "f₀" : `${n}f₀`, x, h - 8);
    }

    if (!hasPlayed && status === "ready") {
      dctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      dctx.font = "13px ui-monospace, monospace";
      dctx.textAlign = "center";
      dctx.fillText("▶ tap to listen", w / 2, Math.round(h * 0.35));
    }
  }, [analysis, status, hover, hasPlayed, freqToX]);

  useEffect(() => {
    draw();
    if (!containerRef.current) return;
    const obs = new ResizeObserver(draw);
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [draw]);

  const play = useCallback(() => {
    if (!bufferRef.current) return;
    playingRef.current = playSampleBuffer(bufferRef.current);
    setHasPlayed(true);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!analysis || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    let best: HoverInfo | null = null;
    let bestDist = 14;
    for (const p of analysis.partials) {
      const x = freqToX(p.freq, rect.width, analysis.f0);
      const d = Math.abs(x - px);
      if (d < bestDist) {
        bestDist = d;
        best = { n: p.n, freq: p.freq, cents: p.cents };
      }
    }
    setHover(best);
  };

  const readout = hover
    ? `overtone ${hover.n}: ${hover.freq.toFixed(1)} Hz, ${
        hover.cents >= 0.05 ? "+" : ""
      }${hover.cents.toFixed(1)}¢ from ${hover.n}×f₀`
    : analysis
      ? `measured stiffness B ≈ ${analysis.B.toFixed(5)} · every overtone sits sharp of the gray grid`
      : status === "error"
        ? "recording unavailable"
        : "loading the recording…";

  return (
    <div ref={containerRef} className="w-full my-8">
      <canvas
        ref={canvasRef}
        className="w-full rounded-md touch-none cursor-pointer"
        onClick={play}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHover(null)}
        aria-label="Measured overtone spectrum of a recorded piano note. Tap to hear the recording."
      />
      <div className="mt-1.5 min-h-[1.25rem] text-xs font-mono text-neutral-500 dark:text-neutral-400">
        {readout}
      </div>
      <div className="mt-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
        <button
          onClick={play}
          disabled={status !== "ready"}
          className="shrink-0 px-5 py-2.5 text-sm font-mono uppercase tracking-widest rounded bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 disabled:opacity-50"
        >
          ▶ play the recording
        </button>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          A real grand piano&apos;s A3, with its overtones measured from the
          recording. Touch the dots for exact numbers.
        </p>
      </div>
    </div>
  );
}
