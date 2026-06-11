export const PI = Math.PI;
export const TAU = Math.PI * 2;
export const S = 300; // spatial samples
export const X = (i) => i / (S - 1);

export function project(y, N) {
  const b = new Float64Array(N + 1);
  for (let n = 1; n <= N; n++) {
    let s = 0;
    for (let i = 0; i < S; i++) s += y[i] * Math.sin(n * PI * X(i));
    b[n] = (2 * s) / S;
  }
  return b;
}

export function synth(b, N, scale) {
  const y = new Float64Array(S);
  for (let n = 1; n <= N; n++) {
    const a = b[n] * (scale ? scale(n) : 1);
    if (Math.abs(a) < 1e-7) continue;
    for (let i = 0; i < S; i++) y[i] += a * Math.sin(n * PI * X(i));
  }
  return y;
}

export function presetCoef(name, N, userShape) {
  if (name === 'yours') return userShape ? project(userShape, N) : new Float64Array(N + 1);
  const b = new Float64Array(N + 1);
  for (let n = 1; n <= N; n++) {
    if (name === 'square') b[n] = (n % 2) ? 4 / (PI * n) : 0;
    else if (name === 'saw') b[n] = (2 / (PI * n)) * ((n % 2) ? 1 : -1);
    else if (name === 'tri') b[n] = (n % 2) ? (8 / (PI * PI * n * n)) * ((((n - 1) / 2) % 2) ? -1 : 1) : 0;
    else if (name === 'pluck') {
      const a = 0.27;
      b[n] = (2 * Math.sin(n * PI * a)) / (n * n * PI * PI * a * (1 - a));
    } else if (name === 'bump') {
      const a = 0.5, wd = 0.10;
      let s = 0;
      for (let i = 0; i < S; i++) s += Math.exp(-Math.pow((X(i) - a) / wd, 2)) * Math.sin(n * PI * X(i));
      b[n] = (2 * s) / S;
    } else if (name === 'step') {
      b[n] = ((1 - Math.cos(n * PI * 0.5)) * 2) / (n * PI);
    } else if (name === 'random') {
      b[n] = (Math.random() * 2 - 1) * Math.exp(-n * 0.18);
    }
  }
  // normalize peak to ~0.95
  const y = synth(b, N);
  let m = 0;
  for (let i = 0; i < S; i++) m = Math.max(m, Math.abs(y[i]));
  if (m > 1e-9) {
    for (let n = 1; n <= N; n++) b[n] *= 0.95 / m;
  }
  return b;
}

export function besselJ(m, x) {
  let sum = 0, term;
  // term_0 = (x/2)^m / m!
  let f = 1;
  for (let i = 2; i <= m; i++) f *= i;
  term = Math.pow(x / 2, m) / f;
  for (let k = 0; k < 28; k++) {
    sum += term;
    term *= -(x * x / 4) / ((k + 1) * (k + 1 + m));
    if (Math.abs(term) < 1e-12) break;
  }
  return sum;
}
