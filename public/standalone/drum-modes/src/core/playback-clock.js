"use strict";

/* ============================================================
   Animation / playback clock
   ============================================================ */
const PlaybackClock = (function () {
  const state = {
    viewMode: 'explore',
    exPlaying: true,
    speed: 1.0,
    exStart: performance.now(),
    exPaused: 0,
    runStart: performance.now(),
    elapsedAtPause: 0
  };

  function exElapsed(now){ return state.exPaused + (state.exPlaying ? (now-state.exStart)/1000*state.speed : 0); }
  // Strike is never pausable — the Pause button lives only in the Explore
  // panel, so a struck membrane always keeps decaying in real time.
  function strikeElapsed(now){ return state.elapsedAtPause + (now-state.runStart)/1000*state.speed; }

  return { state, exElapsed, strikeElapsed };
})();
