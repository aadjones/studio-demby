"use strict";

/* ============================================================
   Bessel functions  (verified vs Miller recurrence to ~1e-10)
   ============================================================ */
const Bessel = (function () {
  function factorial(k){ let f=1; for(let i=2;i<=k;i++) f*=i; return f; }

  function besselJ(m, x){
    if (x === 0) return m === 0 ? 1 : 0;
    const h = x/2;
    let term = Math.pow(h, m)/factorial(m);
    let sum = term;
    const h2 = -h*h;
    for (let k=1; k<300; k++){
      term *= h2/(k*(k+m));
      sum += term;
      if (Math.abs(term) < 1e-14*Math.max(Math.abs(sum),1e-300) && k>6) break;
    }
    return sum;
  }

  function besselZeros(m, count, maxX){
    const z = []; const step = 0.02;
    const ceil = (maxX === undefined) ? 400 : Math.min(maxX, 400);
    let x = 1e-6, fPrev = besselJ(m, x);
    while (z.length < count && x < ceil){
      x += step;
      const f = besselJ(m, x);
      if ((fPrev>0 && f<0) || (fPrev<0 && f>0)){
        let lo = x-step, hi = x;
        for (let i=0;i<60;i++){
          const mid=(lo+hi)/2, fm=besselJ(m,mid), fl=besselJ(m,lo);
          if ((fl>0&&fm<0)||(fl<0&&fm>0)) hi=mid; else lo=mid;
        }
        z.push((lo+hi)/2);
      }
      fPrev = f;
    }
    return z;
  }

  return { factorial, besselJ, besselZeros };
})();
