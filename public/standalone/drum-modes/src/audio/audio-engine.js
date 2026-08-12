"use strict";

/* ============================================================
   Additive synthesis: plays the just-computed mode superposition as a
   bank of decaying sine partials, one per mode group — the same data
   the spectrum chart plots, just rendered as sound instead of pixels.
   ============================================================ */
const AudioEngine = (function () {
  const { groups } = ModeBasis;
  const { AUDIO_BASE_FREQ, AUDIO_MASTER_GAIN, AUDIO_DEFAULT_TAU, AUDIO_ENERGY_CUTOFF,
          AUDIO_ATTACK, AUDIO_MUTE_RAMP } = Constants;

  let ctx = null;
  let master = null;   // shared bus: every partial feeds this, not the destination directly

  // group -> Set of live mute-gate GainNodes, so a mid-decay mute/unmute click
  // (spectrum-view.js) can reach partials that were already triggered by a strike.
  const liveGates = new Map();

  // group -> Set of {osc, env} for partials currently ringing, so a mid-decay
  // damping-slider move (ui.js) can retarget their envelopes, same idea as liveGates.
  const liveEnvs = new Map();

  // Call synchronously from inside a real user-gesture handler (pointerdown/
  // click), before any animation delay — browsers require the AudioContext
  // to be created/resumed while user activation is still active, and the
  // drumstick's swing animation would otherwise push `strike()` past that window.
  function ensureContext(){
    if (!ctx){
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      // A strike can excite dozens of partials that all start in-phase at t=0;
      // their sum can clip well past +-1.0 regardless of per-partial headroom.
      // A limiter on the shared bus catches that without capping the quiet strikes.
      const limiter = ctx.createDynamicsCompressor();
      limiter.threshold.value = -12;
      limiter.knee.value = 6;
      limiter.ratio.value = 12;
      limiter.attack.value = 0.003;
      limiter.release.value = 0.25;
      limiter.connect(ctx.destination);
      master = ctx.createGain();
      master.connect(limiter);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function strike(){
    const c = ensureContext();

    let maxE = 0;
    for (const g of groups) if (!g.muted && g.energy > maxE) maxE = g.energy;
    if (maxE <= 0) return;

    const now = c.currentTime;
    for (const g of groups){
      if (g.muted) continue;
      const frac = g.energy / maxE;
      if (frac <= AUDIO_ENERGY_CUTOFF) continue;

      const osc = c.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = AUDIO_BASE_FREQ * g.ratio;

      // decay envelope: never touched by mute, keeps running underneath exactly
      // like the visual amplitude does — muting just hides the current value.
      const env = c.createGain();
      const peak = AUDIO_MASTER_GAIN * Math.sqrt(frac);
      const tau = g.alpha > 0 ? 1/g.alpha : AUDIO_DEFAULT_TAU;
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(peak, now + AUDIO_ATTACK);
      env.gain.setTargetAtTime(0, now + AUDIO_ATTACK, tau);   // exp(-t/tau) decay, never a hard zero

      // mute gate: instant on/off, independent of the envelope above
      const gate = c.createGain();
      gate.gain.value = g.muted ? 0 : 1;

      osc.connect(env).connect(gate).connect(master);
      osc.start(now);
      const stopAt = now + AUDIO_ATTACK + tau*8;   // ~8 time constants: inaudible, then free the nodes
      osc.stop(stopAt);

      if (!liveGates.has(g)) liveGates.set(g, new Set());
      const gateSet = liveGates.get(g);
      gateSet.add(gate);

      if (!liveEnvs.has(g)) liveEnvs.set(g, new Set());
      const envSet = liveEnvs.get(g);
      const rec = { osc, env };
      envSet.add(rec);

      osc.onended = () => { gateSet.delete(gate); envSet.delete(rec); };
    }
  }

  // Called from spectrum-view.js when a spike is clicked, so a mute/unmute
  // reaches partials that are already ringing, not just future strikes.
  function setMuted(group, muted){
    const set = liveGates.get(group);
    if (!set || !ctx) return;
    const now = ctx.currentTime;
    for (const gate of set) gate.gain.setTargetAtTime(muted ? 0 : 1, now, AUDIO_MUTE_RAMP);
  }

  // Called from ui.js when the damping slider moves, so it reaches partials
  // already ringing, not just future strikes — mirrors setMuted() above.
  // setTargetAtTime() re-targeting mid-curve picks up from the envelope's
  // current live value, so this splices in the new decay rate without a click.
  function updateDamping(){
    if (!ctx) return;
    const now = ctx.currentTime;
    for (const g of groups){
      const set = liveEnvs.get(g);
      if (!set || set.size === 0) continue;
      const tau = g.alpha > 0 ? 1/g.alpha : AUDIO_DEFAULT_TAU;
      for (const { osc, env } of set){
        env.gain.setTargetAtTime(0, now, tau);
        osc.stop(now + tau*8);
      }
    }
  }

  return { ensureContext, strike, setMuted, updateDamping };
})();
