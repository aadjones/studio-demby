"use strict";

/* ============================================================
   Constants
   ============================================================ */
const Constants = (function () {
  // Truncation is by FREQUENCY, not by index. A rectangle in (m,n) index space
  // is the wrong shape: j_{7,1}=4.61x sits BELOW j_{6,4}=8.45x, so an
  // m<=6,n<=4 box excludes 45% of the modes inside its own frequency range.
  const RATIO_CUT = 8.45;         // include every mode with j_{m,n}/j_{0,1} <= this
  const M_SCAN = 40, N_SCAN = 30; // search bounds while enumerating
  const EX_M_MAX = 6, EX_N_MAX = 4;   // explore-mode slider limits (independent)
  const MALLET_SIGMA = 0.13;      // locked: ~99.9% energy capture with this basis
  const RINGS = 32, SEGMENTS = 64;
  const TIME_SCALE = 1.6;         // visual: omega = k * TIME_SCALE
  const AMP = 0.34;

  /* Damping model.  alpha_i = D * (A0 + A1*(w_i/w_01)^2 + RAD*5^-m)
       A0  : constant floor (rim / clamping losses)
       A1  : internal viscoelastic loss, scales as omega^2 -> high modes die first
       RAD : acoustic radiation. m=0 is monopole-like and radiates efficiently;
             m>0 modes have cancelling lobes, radiate poorly, so they ring longer.
     The SCALINGS are principled; the COEFFICIENTS are fitted by eye, not derived.
     alpha is clamped below omega so no mode goes overdamped. */
  const D_A0 = 1.0, D_A1 = 0.115, D_RAD = 1.3, D_MAX = 1.3, D_CLAMP = 0.85;

  // Camera drag sensitivity (pointermove delta -> radians)
  const AZIMUTH_DRAG_SENS = 0.008;
  const ELEVATION_DRAG_SENS = 0.006;

  // Strike pad: clamp tap position to stay inside the drumhead circle
  const STRIKE_R_MAX = 0.93;

  // Spectrum chart: click-to-mute hit-test radius, in CSS px (scaled by dpr at use site)
  const SPECTRUM_HIT_RADIUS_PX = 14;

  // Strike mode: drop mode functions whose displacement amplitude is negligible
  // relative to the loudest one, so the per-frame sum stays cheap
  const ACTIVE_MODE_AMP_CUTOFF = 1e-4;

  // Render loop: skip a mode's contribution once its damping envelope decays below this
  const ENV_SKIP_CUTOFF = 1e-4;

  /* Audio: additive synthesis of the strike, one sine partial per mode group.
     Frequency is mapped from the same j_{m,n}/j_{0,1} ratio the spectrum chart
     plots — NOT from `omega`, which is slowed by TIME_SCALE for visual
     legibility and is nowhere near audio-rate. */
  const AUDIO_BASE_FREQ = 180;      // Hz mapped to the (0,1) fundamental
  const AUDIO_MASTER_GAIN = 0.22;   // per-partial headroom; a limiter on the bus catches the rest
  const AUDIO_DEFAULT_TAU = 0.8;    // decay time constant (s) used when damping is off, so notes don't ring forever
  const AUDIO_ENERGY_CUTOFF = 0.01; // skip partials below this fraction of the loudest group's energy
  const AUDIO_ATTACK = 0.003;       // linear ramp-up (s); avoids a broadband click from dozens of partials snapping on at once
  const AUDIO_MUTE_RAMP = 0.005;    // mute/unmute gate transition (s); same anti-click reasoning

  return {
    RATIO_CUT, M_SCAN, N_SCAN, EX_M_MAX, EX_N_MAX, MALLET_SIGMA,
    RINGS, SEGMENTS, TIME_SCALE, AMP,
    D_A0, D_A1, D_RAD, D_MAX, D_CLAMP,
    AZIMUTH_DRAG_SENS, ELEVATION_DRAG_SENS, STRIKE_R_MAX,
    SPECTRUM_HIT_RADIUS_PX, ACTIVE_MODE_AMP_CUTOFF, ENV_SKIP_CUTOFF,
    AUDIO_BASE_FREQ, AUDIO_MASTER_GAIN, AUDIO_DEFAULT_TAU, AUDIO_ENERGY_CUTOFF,
    AUDIO_ATTACK, AUDIO_MUTE_RAMP
  };
})();
