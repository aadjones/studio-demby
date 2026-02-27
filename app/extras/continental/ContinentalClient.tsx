"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type Suit = "♠" | "♥" | "♦" | "♣";
type Rank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";

interface Card {
  rank: Rank;
  suit: Suit;
  red: boolean;
  joker?: boolean;
}

interface Hand {
  trio1: Card[];
  trio2: Card[];
  corrida: Card[];
}

const RANKS: Rank[] = [
  "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K",
];
const SUITS: Suit[] = ["♠", "♥", "♦", "♣"];
const RED_SUITS: Suit[] = ["♥", "♦"];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateHand(): Hand {
  const shuffledRanks = shuffle(RANKS);
  const rank1 = shuffledRanks[0];
  const rank2 = shuffledRanks[1];

  const trio1: Card[] = shuffle(SUITS)
    .slice(0, 3)
    .map((s) => ({ rank: rank1, suit: s, red: RED_SUITS.includes(s) }));

  const trio2: Card[] = shuffle(SUITS)
    .slice(0, 3)
    .map((s) => ({ rank: rank2, suit: s, red: RED_SUITS.includes(s) }));

  // Corrida: same suit, 4 consecutive ranks, starting index 0–9
  const corridaSuit = SUITS[Math.floor(Math.random() * 4)];
  const startIdx = Math.floor(Math.random() * 10);
  const corrida: Card[] = RANKS.slice(startIdx, startIdx + 4).map((r) => ({
    rank: r,
    suit: corridaSuit,
    red: RED_SUITS.includes(corridaSuit),
  }));

  // ~30% chance of one joker anywhere in the hand
  if (Math.random() < 0.3) {
    const pools = [trio1, trio2, corrida];
    const pool = pools[Math.floor(Math.random() * pools.length)];
    const idx = Math.floor(Math.random() * pool.length);
    pool[idx] = { ...pool[idx], joker: true };
  }

  return { trio1, trio2, corrida };
}

function PlayingCard({
  rank,
  suit,
  red,
  visible,
  delay,
  pop = false,
  joker = false,
}: {
  rank: Rank;
  suit: Suit;
  red: boolean;
  visible: boolean;
  delay: number;
  pop?: boolean;
  joker?: boolean;
}) {
  const color = red ? "text-red-600" : "text-slate-900";
  const transitionClass = pop
    ? "transition-opacity duration-200"
    : "transition-all duration-300";
  const visibilityClass = visible
    ? "opacity-100 translate-y-0"
    : pop
    ? "opacity-0"
    : "opacity-0 translate-y-4";

  if (joker) {
    return (
      <div
        style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
        className={[
          "relative w-11 h-16 bg-violet-50 rounded-lg shadow-2xl border border-violet-200 select-none",
          transitionClass,
          visibilityClass,
        ].join(" ")}
      >
        <div className="absolute top-1 left-1 text-violet-500 font-bold text-xs leading-none">★</div>
        <div className="absolute inset-0 flex items-center justify-center text-violet-400 text-xl leading-none">★</div>
        <div className="absolute bottom-1 right-1 text-violet-500 font-bold text-xs leading-none rotate-180">★</div>
      </div>
    );
  }

  return (
    <div
      style={{ transitionDelay: `${delay}ms` }}
      className={[
        "relative w-11 h-16 bg-white rounded-lg shadow-2xl border border-gray-100 select-none",
        transitionClass,
        visibilityClass,
      ].join(" ")}
    >
      {/* Top-left corner */}
      <div className={`absolute top-1 left-1 ${color} font-bold leading-tight`}>
        <div className="text-[10px]">{rank}</div>
        <div className="text-[8px]">{suit}</div>
      </div>
      {/* Center suit */}
      <div className={`absolute inset-0 flex items-center justify-center ${color} text-xl leading-none`}>
        {suit}
      </div>
      {/* Bottom-right corner (rotated 180°) */}
      <div className={`absolute bottom-1 right-1 ${color} font-bold leading-tight rotate-180`}>
        <div className="text-[10px]">{rank}</div>
        <div className="text-[8px]">{suit}</div>
      </div>
    </div>
  );
}

// Animation phases:
// 0 = blank
// 1 = DOS + trio1 simultaneously
// 2 = TERCIOS + trio2 simultaneously (~750ms later)
// 3 = y UNA CORRIDA + corrida fans left-to-right (~800ms later)
// 4 = Otra vez button

function SpeakerIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
    </svg>
  );
}

export default function ContinentalClient() {
  const [hand, setHand] = useState<Hand | null>(null);
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState(0);
  const [wiping, setWiping] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  // Audio timestamps (seconds) from the recorded clip:
  //   0.00 → DOS
  //   0.75 → TERCIOS
  //   1.55 → y UNA CORRIDA
  const startAnimation = useCallback(() => {
    clearAllTimeouts();
    stopAudio();
    setPhase(0);

    const audio = new Audio("/audio/continental.mp3");
    audioRef.current = audio;
    audio.play().catch(() => {});

    const schedule = (p: number, ms: number) => {
      timeoutsRef.current.push(setTimeout(() => setPhase(p), ms));
    };
    schedule(1, 0);     // DOS           — 0.00s
    schedule(2, 750);   // TERCIOS       — 0.75s
    schedule(3, 1550);  // y UNA CORRIDA — 1.55s
    schedule(4, 2450);  // Otra vez (after corrida fully fans in)
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Pre-generate a hand on mount (client-side only, avoids SSR mismatch)
  // Animation does NOT auto-start — waits for JUGAR press.
  useEffect(() => {
    setHand(generateHand());
  }, []);

  useEffect(() => {
    return () => { clearAllTimeouts(); stopAudio(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const jugar = () => {
    setStarted(true);
    startAnimation();
  };

  const otraVez = () => {
    clearAllTimeouts();
    stopAudio();
    setWiping(true);
    setPhase(0);
    timeoutsRef.current.push(
      setTimeout(() => {
        setWiping(false);
        setHand(generateHand());
        startAnimation();
      }, 500)
    );
  };

  const bg = {
    background: "radial-gradient(ellipse at center, #1e6b35 0%, #0f3a1c 55%, #081f0e 100%)",
  };

  const btnClass =
    "flex items-center gap-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-white font-display font-bold tracking-widest uppercase px-6 py-2.5 rounded-xl shadow-lg transition-all duration-150 text-sm";

  // ── Lobby ──────────────────────────────────────────────
  if (!started) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 px-4" style={bg}>
        <div className="flex flex-col items-center gap-4">
          <div className="text-white/25 tracking-[0.4em] text-base select-none">♠ ♥ ♦ ♣</div>
          <div className="font-display font-bold text-white tracking-[0.15em] uppercase text-4xl sm:text-5xl text-center">
            Continental
          </div>
        </div>
        <button onClick={jugar} className={btnClass}>
          <SpeakerIcon />
          Jugar
        </button>
      </div>
    );
  }

  // ── Animation ──────────────────────────────────────────
  if (!hand) return null;

  const chantClass = (show: boolean) =>
    [
      "font-display font-bold text-white tracking-widest uppercase",
      "text-2xl sm:text-3xl text-center",
      "transition-opacity duration-200",
      show ? "opacity-100" : "opacity-0",
    ].join(" ");

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex flex-col items-center justify-center py-4 px-4"
      style={bg}
    >
      <div className={`flex flex-col items-center gap-3 w-full max-w-sm ${wiping ? "hidden" : ""}`}>

        {/* DOS */}
        <div className="flex flex-col items-center gap-2">
          <div className={chantClass(phase >= 1)}>DOS</div>
          <div className="flex gap-1.5">
            {hand.trio1.map((card, i) => (
              <PlayingCard key={i} {...card} visible={phase >= 1} delay={0} pop />
            ))}
          </div>
        </div>

        {/* TERCIOS */}
        <div className="flex flex-col items-center gap-2">
          <div className={chantClass(phase >= 2)}>TERCIOS</div>
          <div className="flex gap-1.5">
            {hand.trio2.map((card, i) => (
              <PlayingCard key={i} {...card} visible={phase >= 2} delay={0} pop />
            ))}
          </div>
        </div>

        {/* y */}
        <div
          className={[
            "font-display italic text-green-300 text-base sm:text-xl",
            "transition-all duration-500",
            phase >= 3 ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          y
        </div>

        {/* UNA CORRIDA */}
        <div className="flex flex-col items-center gap-2">
          <div className="font-display font-bold text-white tracking-widest uppercase text-2xl sm:text-3xl text-center flex flex-wrap justify-center">
            <span className={`transition-all duration-300 ${phase >= 3 ? "opacity-100" : "opacity-0"}`}>
              UNA&nbsp;
            </span>
            {"CORRIDA".split("").map((letter, i) => (
              <span
                key={i}
                style={{ transitionDelay: phase >= 3 ? `${i * 60}ms` : "0ms" }}
                className={`inline-block transition-all duration-300 ${
                  phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                }`}
              >
                {letter}
              </span>
            ))}
          </div>
          <div className="flex gap-1">
            {hand.corrida.map((card, i) => (
              <PlayingCard key={i} {...card} visible={phase >= 3} delay={i * 120} />
            ))}
          </div>
        </div>

        {/* Otra vez */}
        <div
          className={[
            "mt-1 transition-opacity duration-200",
            phase >= 4 ? "opacity-100" : "opacity-0 pointer-events-none",
          ].join(" ")}
        >
          <button onClick={otraVez} className={btnClass}>
            <SpeakerIcon />
            Otra vez
          </button>
        </div>

      </div>
    </div>
  );
}
