"use strict";

/* ============================================================
   Strike mode
   ============================================================ */
const StrikeEngine = (function () {
  const { groups, funcs, j01 } = ModeBasis;
  const { projectCoeffs } = GramSolver;
  const { vertCount, xArr, yArr, wArr } = DiskMesh;
  const { MALLET_SIGMA, D_A0, D_A1, D_RAD, D_MAX, D_CLAMP, ACTIVE_MODE_AMP_CUTOFF } = Constants;
  const { strikeMarker } = SceneRig;

  const state = {
    strikeActive: false,
    strikeR0: 0.45,
    strikeTh0: 0.0,
    ampNorm: 1,
    captureFrac: 0,
    activeFuncs: [],
    dampAmount: 0      // 0 = ring forever
  };

  function updateDamping(){
    // Freeze each mode's already-decayed amplitude into an anchor before the
    // rate changes, so lowering damping mid-ring slows future decay without
    // undoing decay that already happened — striking again is the only way
    // back to full amplitude. Mirrors AudioEngine.updateDamping(), where
    // setTargetAtTime() gets this for free by continuing from the gain's
    // current live value instead of recomputing from t=0.
    const reanchor = state.strikeActive;
    const tNow = reanchor ? PlaybackClock.strikeElapsed(performance.now()) : 0;

    const D = state.dampAmount * D_MAX;
    for (const f of funcs){
      if (reanchor){
        const dt = tNow - f.envAnchorT;
        f.envAnchorVal = f.alpha > 0 ? f.envAnchorVal*Math.exp(-f.alpha*dt) : f.envAnchorVal;
        f.envAnchorT = tNow;
      }
      const ratio = f.k/j01;
      let a = D*(D_A0 + D_A1*ratio*ratio + D_RAD*Math.pow(5,-f.m));
      f.alpha = Math.min(a, D_CLAMP*f.omega);          // never overdamp
      f.omegaD = Math.sqrt(Math.max(f.omega*f.omega - f.alpha*f.alpha, 1e-9));
    }
    for (const g of groups){
      const f = funcs[g.funcIdx[0]];
      g.alpha = f.alpha;
      g.t60 = f.alpha > 0 ? 3*Math.LN10/f.alpha : Infinity;
      // same anchor as f, exposed on the group so spectrum-view.js's bars can
      // decay from it too, without undoing already-lost energy on undamp
      g.envAnchorT = f.envAnchorT;
      g.envAnchorVal = f.envAnchorVal;
    }
  }
  updateDamping();

  function doStrike(r0, th0){
    state.strikeR0=r0; state.strikeTh0=th0; state.strikeActive=true;
    PlaybackClock.state.runStart=performance.now(); PlaybackClock.state.elapsedAtPause=0;
    for (const f of funcs){ f.envAnchorT = 0; f.envAnchorVal = 1; }
    for (const g of groups){ g.envAnchorT = 0; g.envAnchorVal = 1; }

    const sx=r0*Math.cos(th0), sy=r0*Math.sin(th0);
    const s2 = MALLET_SIGMA*MALLET_SIGMA;

    // initial velocity field: gaussian mallet contact patch
    const v0 = new Float32Array(vertCount);
    let totalE = 0;
    for (let v=0; v<vertCount; v++){
      const d2 = (xArr[v]-sx)*(xArr[v]-sx) + (yArr[v]-sy)*(yArr[v]-sy);
      v0[v] = Math.exp(-d2/(2*s2));
      totalE += v0[v]*v0[v]*wArr[v];
    }

    // project onto the basis: solve  G a = P  (true orthogonal projection)
    const P = new Float64Array(GramSolver.NF);
    for (let i=0; i<GramSolver.NF; i++){
      const sp = funcs[i].sp;
      let s = 0;
      for (let v=0; v<vertCount; v++) s += v0[v]*sp[v]*wArr[v];
      P[i] = s;
    }
    const a = projectCoeffs(P);

    // captured energy = a . P  (exact for the projection; equals sum a_i^2 N_i
    // when the basis is orthogonal, which it is to ~2e-3 here)
    let capturedE = 0;
    for (let i=0; i<GramSolver.NF; i++){
      funcs[i].coeff = a[i];
      capturedE += a[i]*P[i];
    }
    state.captureFrac = totalE>0 ? Math.min(capturedE/totalE, 1) : 0;

    // group energies = sum over degenerate partners (rotation-invariant)
    for (const g of groups){
      let e = 0;
      for (const i of g.funcIdx) e += Math.max(0, funcs[i].coeff*P[i]);
      g.energy = e;
    }

    // drop modes whose amplitude is negligible, so the per-frame sum stays cheap
    let maxAmp = 0;
    for (const f of funcs) maxAmp = Math.max(maxAmp, Math.abs(f.coeff/f.omega));
    state.activeFuncs = funcs.filter(f => Math.abs(f.coeff/f.omega) > ACTIVE_MODE_AMP_CUTOFF*maxAmp);

    // amplitude normalisation: must sample at least one full period of the
    // SLOWEST mode or the peak is underestimated (1.0s window undershot by 19%)
    const slowest = Math.min(...funcs.map(f=>f.omega));
    const window = 2*Math.PI/slowest * 1.05;
    let peak = 0;
    const STRIDE = 8, SAMPLES = 80;
    for (let s=0; s<SAMPLES; s++){
      const t = s*window/SAMPLES;
      for (let v=0; v<vertCount; v+=STRIDE){
        let d = 0;
        for (const f of state.activeFuncs) d += (f.coeff/f.omega)*Math.sin(f.omega*t)*f.sp[v];
        const ad = Math.abs(d);
        if (ad > peak) peak = ad;
      }
    }
    state.ampNorm = Math.max(peak, 1e-9);

    strikeMarker.visible = true;
    strikeMarker.position.set(sx, 0.03, sy);

    document.getElementById('capBadge').textContent =
      `${(state.captureFrac*100).toFixed(1)}% of strike energy captured by ` +
      `${groups.length} mode groups (${funcs.length} functions, ${state.activeFuncs.length} audible)`;
  }

  return { state, updateDamping, doStrike };
})();
