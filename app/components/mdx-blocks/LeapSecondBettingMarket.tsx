'use client';

import React, { useState, useEffect } from 'react';

const LeapSecondBettingMarket: React.FC = () => {
  const [balance, setBalance] = useState(1000);
  const [positions, setPositions] = useState({ negative: 0, none: 0, positive: 0 });
  const [buttonStates, setButtonStates] = useState({ negative: 'IDLE', none: 'IDLE', positive: 'IDLE' });

  const [tickerItems, setTickerItems] = useState([
    { user: 'TimeLord_99', action: 'BOUGHT YES', on: 'NEGATIVE LEAP', color: 'text-red-400' },
    { user: 'AtomicWhale', action: 'BOUGHT YES', on: 'ZERO LEAPS', color: 'text-time-text-600' },
    { user: 'CesiumFan', action: 'BOUGHT YES', on: 'POSITIVE LEAP', color: 'text-green-400' },
    { user: 'IERS_Insider', action: 'SOLD NO', on: 'ZERO LEAPS', color: 'text-time-text-600' },
  ]);

  // Fake live ticker effect
  useEffect(() => {
    const interval = setInterval(() => {
      const users = ['ChronoDegen', 'SatoshiClock', 'LeapYearWilliam', 'UTC_Maxi', 'SolarDrift', 'MagmaFlow'];
      const bets = ['BOUGHT YES', 'SOLD NO', 'DOUBLED DOWN', 'HEDGED', 'LIQUIDATED'];
      const options = [
        { label: 'NEGATIVE LEAP', color: 'text-red-400' },
        { label: 'ZERO LEAPS', color: 'text-time-text-600' },
        { label: 'POSITIVE LEAP', color: 'text-green-400' }
      ];

      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomBet = bets[Math.floor(Math.random() * bets.length)];
      const randomOption = options[Math.floor(Math.random() * options.length)];

      const newItem = {
        user: randomUser,
        action: randomBet,
        on: randomOption.label,
        color: randomOption.color
      };

      setTickerItems(prev => [newItem, ...prev.slice(0, 4)]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleBuy = (type: 'negative' | 'none' | 'positive', label: string, color: string) => {
    const COST = 1000;
    if (balance < COST) return;

    // 1. Deduct Balance
    setBalance(prev => prev - COST);

    // 2. Add Position
    setPositions(prev => ({
        ...prev,
        [type]: prev[type] + 1
    }));

    // 3. Inject into Ticker
    const myTrade = {
        user: 'YOU',
        action: 'ALL IN',
        on: label,
        color: color
    };
    setTickerItems(prev => [myTrade, ...prev.slice(0, 4)]);

    // 4. Button Feedback Animation
    setButtonStates(prev => ({ ...prev, [type]: 'FILLED' }));
    setTimeout(() => {
        setButtonStates(prev => ({ ...prev, [type]: 'IDLE' }));
    }, 1000);
  };

  const renderButton = (type: 'negative' | 'none' | 'positive', label: string, colorClass: string, hoverClass: string, borderClass: string) => {
    const state = buttonStates[type];
    const isFilled = state === 'FILLED';
    const hasPosition = positions[type] > 0;
    const isAllIn = balance < 1000;

    let buttonText = 'Buy Yes (⏳ 1,000)';
    let dynamicClass = `bg-time-surface-100 ${borderClass} ${colorClass} ${hoverClass}`;

    if (isFilled) {
        buttonText = 'ORDER FILLED';
        dynamicClass = 'bg-green-500 border-green-500 text-white scale-95';
    } else if (hasPosition) {
        buttonText = 'ALL IN (HOLDING)';
        dynamicClass = `bg-time-surface-50 border-current ${colorClass} opacity-100 ring-1 ring-${colorClass.replace('text-', '')}`;
    } else if (isAllIn) {
        buttonText = 'NO FUNDS';
        dynamicClass = 'bg-time-surface-100 border-time-border-300 text-time-text-700 cursor-not-allowed opacity-50';
    }

    return (
        <button
            onClick={() => handleBuy(type, label, colorClass)}
            disabled={balance < 1000}
            className={`w-full py-2 border font-bold rounded transition-all uppercase text-base mt-auto relative overflow-hidden ${dynamicClass}`}
        >
            {buttonText}
        </button>
    );
  };

  return (
    <div className="bg-time-surface-50 rounded-xl border border-time-border-300 shadow-xl overflow-hidden relative">
      {/* Header / Context */}
      <div className="p-6 border-b border-time-border-300 bg-time-surface-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
            <h3 className="text-xl font-bold text-time-text-800 flex items-center gap-2">
            <span className="text-2xl">🎰</span>
            Leap Second Prediction Market (2025-2035)
            </h3>
            <div className="flex items-center gap-4">
                 <div className="flex flex-col items-end">
                    <span className="text-xs text-time-text-600 font-bold uppercase tracking-wider">Your Balance</span>
                    <span className={`font-mono font-bold text-lg ${balance < 1000 ? 'text-time-text-600' : 'text-accent-400'}`}>
                        ⏳ {balance.toLocaleString()}
                    </span>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-xs font-mono font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    CLOSING 2035
                </div>
            </div>
        </div>
        <p className="text-sm text-time-text-600">
          The authorities voted to abolish the leap second by 2035. You have just enough credits for <span className="text-time-text-800 font-bold">ONE</span> bet.
          <span className="text-time-text-600 italic ml-1">
             (Choose wisely. There are no refunds in physics.)
          </span>
        </p>
      </div>

      {/* Betting Lines */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-time-border-300">

        {/* OPTION 1: NEGATIVE */}
        <div className="p-6 flex flex-col items-center hover:bg-time-surface-100 transition-colors group cursor-pointer relative">
            <div className="text-xs font-mono text-red-500 font-bold tracking-widest mb-2 uppercase">Prop Bet A</div>
            <div className="text-xl font-bold text-time-text-800 mb-1">Any Negative Leap?</div>
            <div className="text-base text-time-text-600 mb-4 font-mono text-center px-2">
                &ldquo;Short The Second&rdquo;
            </div>

            <div className="text-3xl font-black text-red-400 mb-2 font-mono">+2500</div>

            <div className="w-full bg-time-surface-100 rounded p-3 mb-6 border border-time-border-300">
                <div className="flex justify-between items-center mb-1">
                    <h5 className="text-xs text-time-text-600 font-bold uppercase">Contract Terms</h5>
                    <span className="text-xs text-red-400 font-mono">
                        {positions.negative > 0 ? `YOU OWN: ${positions.negative}` : ''}
                    </span>
                </div>
                <p className="text-xs text-time-text-600 leading-snug">
                    Pays YES if <span className="text-red-400">at least one</span> negative leap second is officially declared before 2035.
                </p>
            </div>

            {renderButton('negative', 'NEGATIVE LEAP', 'text-red-400', 'hover:bg-red-500 hover:text-white', 'border-red-500/50')}
        </div>

        {/* OPTION 2: NO ACTION */}
        <div className="p-6 flex flex-col items-center hover:bg-time-surface-100 transition-colors group cursor-pointer bg-time-surface-50/50 relative">
            <div className="text-xs font-mono text-blue-500 font-bold tracking-widest mb-2 uppercase">Prop Bet B</div>
            <div className="text-xl font-bold text-time-text-800 mb-1">Zero Leaps Total?</div>
            <div className="text-base text-time-text-600 mb-4 font-mono text-center px-2">
                &ldquo;Hold The Line&rdquo;
            </div>

            <div className="text-3xl font-black text-blue-400 mb-2 font-mono">-150</div>

            <div className="w-full bg-time-surface-100 rounded p-3 mb-6 border border-time-border-300">
                <div className="flex justify-between items-center mb-1">
                    <h5 className="text-xs text-time-text-600 font-bold uppercase">Contract Terms</h5>
                    <span className="text-xs text-blue-400 font-mono">
                         {positions.none > 0 ? `YOU OWN: ${positions.none}` : ''}
                    </span>
                </div>
                <p className="text-xs text-time-text-600 leading-snug">
                    Pays YES only if <span className="text-blue-400">absolutely zero</span> leap seconds (positive OR negative) occur before 2035.
                </p>
            </div>

            {renderButton('none', 'ZERO LEAPS', 'text-blue-400', 'hover:bg-blue-500 hover:text-white', 'border-blue-500/50')}
        </div>

        {/* OPTION 3: POSITIVE */}
        <div className="p-6 flex flex-col items-center hover:bg-time-surface-100 transition-colors group cursor-pointer relative">
            <div className="text-xs font-mono text-green-500 font-bold tracking-widest mb-2 uppercase">Prop Bet C</div>
            <div className="text-xl font-bold text-time-text-800 mb-1">Any Positive Leap?</div>
            <div className="text-base text-time-text-600 mb-4 font-mono text-center px-2">
                &ldquo;Long The Second&rdquo;
            </div>

            <div className="text-3xl font-black text-green-400 mb-2 font-mono">+450</div>

            <div className="w-full bg-time-surface-100 rounded p-3 mb-6 border border-time-border-300">
                <div className="flex justify-between items-center mb-1">
                    <h5 className="text-xs text-time-text-600 font-bold uppercase">Contract Terms</h5>
                    <span className="text-xs text-green-400 font-mono">
                        {positions.positive > 0 ? `YOU OWN: ${positions.positive}` : ''}
                    </span>
                </div>
                <p className="text-xs text-time-text-600 leading-snug">
                    Pays YES if <span className="text-green-400">at least one</span> positive leap second is officially declared before 2035.
                </p>
            </div>

            {renderButton('positive', 'POSITIVE LEAP', 'text-green-400', 'hover:bg-green-500 hover:text-white', 'border-green-500/50')}
        </div>

      </div>

      {/* Live Ticker Footer */}
      <div className="bg-time-surface-100 border-t border-time-border-300 p-2 overflow-hidden flex items-center gap-4">
        <div className="text-xs font-bold text-time-text-600 whitespace-nowrap px-2">RECENT TRADES:</div>
        <div className="flex-1 overflow-hidden relative h-6">
            <div className="absolute top-0 left-0 w-full flex gap-8 animate-marquee whitespace-nowrap">
                {tickerItems.map((item, idx) => {
                    const isMe = item.user === 'YOU';
                    return (
                        <div key={idx} className={`flex items-center gap-2 text-xs font-mono ${isMe ? 'bg-yellow-500/10 border border-yellow-500/30 rounded px-2 py-0.5' : ''}`}>
                            <span className={isMe ? "text-yellow-400 font-black" : "text-time-text-700 font-bold"}>
                                {isMe ? '🫵 YOU' : item.user}
                            </span>
                            <span className={isMe ? "text-yellow-100/70" : "text-time-text-600"}>{item.action} on</span>
                            <span className={item.color}>{item.on}</span>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default LeapSecondBettingMarket;
