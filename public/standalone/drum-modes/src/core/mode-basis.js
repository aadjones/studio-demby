"use strict";

/* ============================================================
   Mode basis: every (m,n) with j_{m,n} <= RATIO_CUT * j_{0,1}.
   cos/sin degenerate partners are grouped, since only the sum of their
   squared coefficients is rotation-invariant (physically meaningful).
   ============================================================ */
const ModeBasis = (function () {
  const { besselJ, besselZeros } = Bessel;
  const { RATIO_CUT, M_SCAN, N_SCAN, TIME_SCALE } = Constants;
  const { vertCount, rArr, thArr } = DiskMesh;

  const groups = [];   // one per distinct (m,n)
  const funcs  = [];   // one per basis function

  const j01 = besselZeros(0,1)[0];       // reference frequency
  const K_CUT = RATIO_CUT * j01;

  // enumerate every (m,n) with j_{m,n} <= K_CUT — a disk in k-space, not a box
  const defs = [];
  for (let m=0; m<=M_SCAN; m++){
    // only scan out to the cutoff — zeros beyond it are never used
    const zeros = besselZeros(m, N_SCAN, K_CUT + 0.01);
    if (zeros.length === 0) break;   // j_{m,1} grows with m: none fit, none ever will
    zeros.forEach((k, i) => { if (k <= K_CUT) defs.push({ m, n: i+1, k }); });
  }
  defs.sort((a,b)=> a.k - b.k);

  for (const d of defs){
    const jm1 = besselJ(d.m+1, d.k);
    const N = (0.5*jm1*jm1) * ((d.m===0) ? 2*Math.PI : Math.PI);
    const omega = d.k*TIME_SCALE;
    const g = { m:d.m, n:d.n, k:d.k, N, omega, ratio:d.k/j01,
                funcIdx: [], energy: 0, muted: false };
    for (const type of (d.m===0 ? ['cos'] : ['cos','sin'])){
      const sp = new Float32Array(vertCount);
      for (let v=0; v<vertCount; v++){
        sp[v] = besselJ(d.m, d.k*rArr[v]) *
                ((type==='cos') ? Math.cos(d.m*thArr[v]) : Math.sin(d.m*thArr[v]));
      }
      g.funcIdx.push(funcs.length);
      funcs.push({ m:d.m, n:d.n, type, k:d.k, N, omega, sp, coeff:0, group: groups.length });
    }
    groups.push(g);
  }

  const MAX_RATIO = groups[groups.length-1].ratio;

  return { groups, funcs, j01, K_CUT, MAX_RATIO };
})();
