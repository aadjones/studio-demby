"use strict";

/* ============================================================
   Spectrum chart
   ============================================================ */
const SpectrumView = (function () {
  const { groups, MAX_RATIO } = ModeBasis;
  const { SPECTRUM_HIT_RADIUS_PX } = Constants;

  const specCv = document.getElementById('spectrum');
  const specCtx = specCv.getContext('2d');
  const X_MIN = 0.75, X_MAX = MAX_RATIO + 0.4;   // derived from the actual basis

  const hover = { group: null };   // hovered bar, mouse-only (no touch equivalent) — drives cursor + tooltip

  function specLayout(){
    const W = specCv.width, H = specCv.height;
    // actual internal-pixels-per-CSS-pixel, not an assumed 2
    const rect = specCv.getBoundingClientRect();
    const dpr = rect.width > 0 ? W/rect.width : 2;
    return {
      W, H, dpr,
      left: 16*dpr, right: W-10*dpr,
      top: 14*dpr, bottom: H-30*dpr
    };
  }
  function ratioToX(ratio, L){
    return L.left + (ratio-X_MIN)/(X_MAX-X_MIN)*(L.right-L.left);
  }

  function drawSpectrum(){
    const L = specLayout();
    const {W,H,dpr} = L;
    specCtx.clearRect(0,0,W,H);

    const plotH = L.bottom - L.top;
    let maxE = 0;
    for (const g of groups) if (g.energy > maxE) maxE = g.energy;
    if (maxE <= 0) maxE = 1;

    // harmonic comb (integer multiples of the fundamental)
    specCtx.strokeStyle = 'rgba(120,200,255,0.28)';
    specCtx.lineWidth = 1*dpr;
    specCtx.setLineDash([4*dpr, 4*dpr]);
    for (let h=1; h<=Math.floor(X_MAX); h++){
      const x = ratioToX(h, L);
      if (x < L.left || x > L.right) continue;
      specCtx.beginPath();
      specCtx.moveTo(x, L.top); specCtx.lineTo(x, L.bottom);
      specCtx.stroke();
    }
    specCtx.setLineDash([]);

    // baseline
    specCtx.strokeStyle = '#3a4150';
    specCtx.lineWidth = 1*dpr;
    specCtx.beginPath();
    specCtx.moveTo(L.left, L.bottom); specCtx.lineTo(L.right, L.bottom);
    specCtx.stroke();

    // axis labels
    specCtx.fillStyle = '#6b7280';
    specCtx.font = `${10*dpr}px -apple-system, sans-serif`;
    specCtx.textAlign = 'center';
    for (let h=1; h<=Math.floor(X_MAX); h++){
      const x = ratioToX(h, L);
      if (x < L.left || x > L.right) continue;
      specCtx.fillText(`${h}×`, x, L.bottom + 16*dpr);
    }

    // spikes: ghost = energy at t=0, solid = energy right now
    const tNow = (PlaybackClock.state.viewMode==='strike' && StrikeEngine.state.strikeActive)
      ? PlaybackClock.strikeElapsed(performance.now()) : 0;
    for (const g of groups){
      const x = ratioToX(g.ratio, L);
      const frac0 = g.energy/maxE;
      if (frac0 <= 0.0005) continue;
      const h0 = Math.max(frac0*plotH, 2*dpr);

      // energy decays at 2*alpha (amplitude decays at alpha). Reads off g's
      // anchor (kept in sync with the mesh's per-func anchor by StrikeEngine)
      // instead of recomputing from t=0, so easing damping mid-ring slows the
      // bar's future decay without undoing decay that already happened.
      const dt = tNow - g.envAnchorT;
      const envNow = g.alpha > 0 ? g.envAnchorVal*Math.exp(-g.alpha*dt) : g.envAnchorVal;
      const decay = envNow*envNow;
      const hNow = Math.max(h0*decay, 0);

      // ghost outline of the initial spectrum
      if (StrikeEngine.state.dampAmount > 0){
        specCtx.strokeStyle = 'rgba(120,130,150,0.30)';
        specCtx.lineWidth = 3.5*dpr;
        specCtx.lineCap = 'round';
        specCtx.beginPath();
        specCtx.moveTo(x, L.bottom);
        specCtx.lineTo(x, L.bottom - h0);
        specCtx.stroke();
      }

      const isHovered = g === hover.group;

      if (hNow > 0.4*dpr){
        specCtx.strokeStyle = g.muted ? (isHovered ? '#5a6272' : '#3a4150')
                            : (isHovered ? '#ffffff' : (frac0 > 0.28 ? '#ff5566' : '#3a8bff'));
        specCtx.lineWidth = (isHovered ? 5.5 : 3.5)*dpr;
        specCtx.lineCap = 'round';
        specCtx.beginPath();
        specCtx.moveTo(x, L.bottom);
        specCtx.lineTo(x, L.bottom - hNow);
        specCtx.stroke();
      }

      // hover tooltip replaces the plain label (and shows even for small,
      // otherwise-unlabeled bars) so it's obvious what a click will do
      if (isHovered){
        const tx = Math.min(Math.max(x, L.left + 62*dpr), L.right - 62*dpr);
        specCtx.fillStyle = '#fff';
        specCtx.font = `600 ${10*dpr}px -apple-system, sans-serif`;
        specCtx.textAlign = 'center';
        specCtx.fillText(`(${g.m},${g.n}) · click to ${g.muted ? 'unmute' : 'mute'}`, tx, L.bottom - h0 - 8*dpr);
      } else if (frac0 > 0.16){
        specCtx.fillStyle = g.muted ? '#4a5160' : '#c7cbd1';
        specCtx.font = `${9.5*dpr}px -apple-system, sans-serif`;
        specCtx.textAlign = 'center';
        specCtx.fillText(`${g.m},${g.n}`, x, L.bottom - h0 - 5*dpr);
      }
    }

    // legend
    specCtx.fillStyle = '#6b7280';
    specCtx.font = `${9.5*dpr}px -apple-system, sans-serif`;
    specCtx.textAlign = 'left';
    specCtx.fillText('energy', L.left, L.top + 2*dpr);
    specCtx.textAlign = 'right';
    specCtx.fillText('frequency (× fundamental)', L.right, L.bottom + 27*dpr);

    UI.updateButtonStates();
  }

  // shared by the click handler and the hover handler, so hovering always
  // previews exactly the bar a click would toggle
  function hitTest(clientX){
    if (!StrikeEngine.state.strikeActive) return null;
    const L = specLayout();
    const rect = specCv.getBoundingClientRect();
    const px = (clientX - rect.left) * (specCv.width/rect.width);
    let best=null, bestD=Infinity;
    for (const g of groups){
      const d = Math.abs(ratioToX(g.ratio, L) - px);
      if (d < bestD){ bestD = d; best = g; }
    }
    return (best && bestD < SPECTRUM_HIT_RADIUS_PX*L.dpr) ? best : null;
  }

  specCv.addEventListener('pointerdown', (e)=>{
    const best = hitTest(e.clientX);
    if (!best) return;
    best.muted = !best.muted;
    AudioEngine.setMuted(best, best.muted);
    drawSpectrum();
    const on = groups.filter(g=>!g.muted).length;
    document.getElementById('info').innerHTML =
      `<b>(${best.m},${best.n})</b> ${best.muted ? 'muted' : 'unmuted'}: ` +
      `frequency <b>${best.ratio.toFixed(3)}&times;</b> the fundamental, ` +
      `carrying <b>${(best.energy/groups.reduce((a,g)=>a+g.energy,0)*100).toFixed(1)}%</b> of the strike energy.<br>` +
      `${on} of ${groups.length} mode groups active.`;
  });

  // desktop-only affordance (touch has no hover): a pointer cursor + a
  // brightened, labeled bar make it obvious the spectrum is clickable —
  // otherwise the mute/unmute interaction is invisible.
  specCv.addEventListener('pointermove', (e)=>{
    const hit = hitTest(e.clientX);
    specCv.style.cursor = hit ? 'pointer' : '';
    if (hit !== hover.group){
      hover.group = hit;
      drawSpectrum();
    }
  });
  specCv.addEventListener('pointerleave', ()=>{
    specCv.style.cursor = '';
    if (hover.group){
      hover.group = null;
      drawSpectrum();
    }
  });

  return { drawSpectrum };
})();
