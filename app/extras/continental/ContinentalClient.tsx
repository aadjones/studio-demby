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
        style={{ transitionDelay: `${delay}ms` }}
        className={[
          "relative w-14 h-20 bg-violet-50 rounded-xl shadow-2xl border border-violet-200 select-none",
          transitionClass,
          visibilityClass,
        ].join(" ")}
      >
        <div className="absolute top-1.5 left-1.5 text-violet-500 font-bold text-xs leading-none">★</div>
        <div className="absolute inset-0 flex items-center justify-center text-violet-400 text-3xl leading-none">★</div>
        <div className="absolute bottom-1.5 right-1.5 text-violet-500 font-bold text-xs leading-none rotate-180">★</div>
      </div>
    );
  }

  return (
    <div
      style={{ transitionDelay: `${delay}ms` }}
      className={[
        "relative w-14 h-20 bg-white rounded-xl shadow-2xl border border-gray-100 select-none",
        transitionClass,
        visibilityClass,
      ].join(" ")}
    >
      {/* Top-left corner */}
      <div className={`absolute top-1.5 left-1.5 ${color} font-bold leading-tight`}>
        <div className="text-xs">{rank}</div>
        <div className="text-[9px]">{suit}</div>
      </div>
      {/* Center suit */}
      <div className={`absolute inset-0 flex items-center justify-center ${color} text-2xl leading-none`}>
        {suit}
      </div>
      {/* Bottom-right corner (rotated 180°) */}
      <div className={`absolute bottom-1.5 right-1.5 ${color} font-bold leading-tight rotate-180`}>
        <div className="text-xs">{rank}</div>
        <div className="text-[9px]">{suit}</div>
      </div>
    </div>
  );
}

// Animation phases:
// 0 = blank
// 1 = DOS + trio1 simultaneously
// 2 = TERCIOS + trio2 simultaneously (~800ms later)
// 3 = y UNA CORRIDA + corrida fans left-to-right (~900ms hold)
// 4 = Barajar button

export default function ContinentalClient() {
  const [hand, setHand] = useState<Hand | null>(null);
  const [phase, setPhase] = useState(0);
  const [wiping, setWiping] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const startAnimation = useCallback(() => {
    clearAllTimeouts();
    setPhase(0);
    const schedule = (p: number, delay: number) => {
      timeoutsRef.current.push(setTimeout(() => setPhase(p), delay));
    };
    schedule(1, 300);   // DOS + trio1
    schedule(2, 1100);  // TERCIOS + trio2
    schedule(3, 2000);  // y UNA CORRIDA + corrida
    schedule(4, 2900);  // Barajar
  }, []);

  // Generate hand client-side only to avoid SSR/hydration mismatch
  useEffect(() => {
    setHand(generateHand());
  }, []);

  useEffect(() => {
    if (!hand) return;
    startAnimation();
    return clearAllTimeouts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hand]);

  const barajar = () => {
    clearAllTimeouts();
    setWiping(true);
    setPhase(0);
    timeoutsRef.current.push(
      setTimeout(() => {
        setWiping(false);
        setHand(generateHand());
      }, 200)
    );
  };

  if (!hand) return null;

  const chantClass = (show: boolean) =>
    [
      "font-display font-bold text-white tracking-widest uppercase",
      "text-3xl sm:text-4xl text-center",
      "transition-opacity duration-200",
      show ? "opacity-100" : "opacity-0",
    ].join(" ");

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex flex-col items-center justify-center py-12 px-4"
      style={{
        background:
          "radial-gradient(ellipse at center, #1e6b35 0%, #0f3a1c 55%, #081f0e 100%)",
      }}
    >
      <div className={`flex flex-col items-center gap-6 w-full max-w-sm ${wiping ? "invisible" : ""}`}>

        {/* DOS */}
        <div className="flex flex-col items-center gap-3">
          <div className={chantClass(phase >= 1)}>DOS</div>
          <div className="flex gap-2">
            {hand.trio1.map((card, i) => (
              <PlayingCard
                key={i}
                {...card}
                visible={phase >= 1}
                delay={0}
                pop
              />
            ))}
          </div>
        </div>

        {/* TERCIOS */}
        <div className="flex flex-col items-center gap-3">
          <div className={chantClass(phase >= 2)}>TERCIOS</div>
          <div className="flex gap-2">
            {hand.trio2.map((card, i) => (
              <PlayingCard
                key={i}
                {...card}
                visible={phase >= 2}
                delay={0}
                pop
              />
            ))}
          </div>
        </div>

        {/* y */}
        <div
          className={[
            "font-display italic text-green-300 text-xl sm:text-2xl",
            "transition-all duration-500",
            phase >= 3 ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          y
        </div>

        {/* UNA CORRIDA */}
        <div className="flex flex-col items-center gap-3">
          <div className="font-display font-bold text-white tracking-widest uppercase text-3xl sm:text-4xl text-center flex flex-wrap justify-center">
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
          <div className="flex gap-1.5">
            {hand.corrida.map((card, i) => (
              <PlayingCard
                key={i}
                {...card}
                visible={phase >= 3}
                delay={i * 120}
              />
            ))}
          </div>
        </div>

        {/* Barajar */}
        <div
          className={[
            "mt-4 transition-opacity duration-200",
            phase >= 4 ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          <button
            onClick={barajar}
            className="bg-amber-500 hover:bg-amber-400 active:scale-95 text-white font-display font-bold tracking-widest uppercase px-8 py-3 rounded-xl shadow-lg transition-all duration-150 text-base"
          >
            Barajar
          </button>
        </div>

      </div>
    </div>
  );
}
