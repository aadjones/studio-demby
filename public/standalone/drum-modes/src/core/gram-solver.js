"use strict";

/* ------------------------------------------------------------
   Gram matrix + Cholesky factorisation.

   The clean textbook formula is  a_i = <v0, phi_i> / <phi_i, phi_i>,
   which is exact only when the basis is exactly orthogonal. On a
   discrete mesh it isn't quite (off-diagonal overlaps ~2e-3), so that
   formula can report >100% of the strike energy captured — it isn't a
   true projection. Solving  G a = P  with G_ij = <phi_i, phi_j> gives
   the genuine least-squares projection onto the mesh basis, for which
   captured <= total holds by construction.

   G is strike-independent, so this is a one-time cost.
   ------------------------------------------------------------ */
const GramSolver = (function () {
  const { funcs } = ModeBasis;
  const { vertCount, wArr } = DiskMesh;

  const NF = funcs.length;
  let chol = null;

  (function buildGram(){
    const G = [];
    for (let i=0; i<NF; i++) G.push(new Float64Array(NF));
    for (let i=0; i<NF; i++){
      const si = funcs[i].sp;
      for (let j=i; j<NF; j++){
        const sj = funcs[j].sp;
        let s = 0;
        for (let v=0; v<vertCount; v++) s += si[v]*sj[v]*wArr[v];
        G[i][j] = s; G[j][i] = s;
      }
    }
    const L = [];
    for (let i=0; i<NF; i++) L.push(new Float64Array(NF));
    for (let i=0; i<NF; i++){
      for (let j=0; j<=i; j++){
        let s = G[i][j];
        for (let k=0; k<j; k++) s -= L[i][k]*L[j][k];
        if (i === j){
          if (s <= 0 || !isFinite(s)) return;   // not positive-definite: bail
          L[i][i] = Math.sqrt(s);
        } else {
          L[i][j] = s/L[j][j];
        }
      }
    }
    chol = L;
  })();

  function projectCoeffs(P){
    if (!chol){
      // fallback: diagonal (analytic-norm) projection
      const a = new Float64Array(NF);
      for (let i=0; i<NF; i++) a[i] = P[i]/funcs[i].N;
      return a;
    }
    const y = new Float64Array(NF), a = new Float64Array(NF);
    for (let i=0; i<NF; i++){
      let s = P[i];
      for (let k=0; k<i; k++) s -= chol[i][k]*y[k];
      y[i] = s/chol[i][i];
    }
    for (let i=NF-1; i>=0; i--){
      let s = y[i];
      for (let k=i+1; k<NF; k++) s -= chol[k][i]*a[k];
      a[i] = s/chol[i][i];
    }
    return a;
  }

  return { NF, projectCoeffs };
})();
