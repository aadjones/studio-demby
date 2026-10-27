// Equinox and solstice moments for any year, from Jean Meeus, "Astronomical Algorithms" (2nd ed.), chapter 27.
// Accurate to about a minute for years 1000–3000, far better than the dial needs.

export type SeasonEvent = 'march' | 'june' | 'september' | 'december';

// Mean event times (Julian Ephemeris Day) for 2000–3000, Table 27.B; Y = (year - 2000) / 1000
const MEAN_TERMS: Record<SeasonEvent, number[]> = {
  march: [2451623.80984, 365242.37404, 0.05169, -0.00411, -0.00057],
  june: [2451716.56767, 365241.62603, 0.00325, 0.00888, -0.0003],
  september: [2451810.21715, 365242.01767, -0.11575, 0.00337, 0.00078],
  december: [2451900.05952, 365242.74049, -0.06223, -0.00823, 0.00032],
};

// Periodic terms [A, B, C], Table 27.C
const PERIODIC_TERMS = [
  [485, 324.96, 1934.136], [203, 337.23, 32964.467], [199, 342.08, 20.186], [182, 27.85, 445267.112],
  [156, 73.14, 45036.886], [136, 171.52, 22518.443], [77, 222.54, 65928.934], [74, 296.72, 3034.906],
  [70, 243.58, 9037.513], [58, 119.81, 33718.147], [52, 297.17, 150.678], [50, 21.02, 2281.226],
  [45, 247.54, 29929.562], [44, 325.15, 31555.956], [29, 60.93, 4443.417], [18, 155.12, 67555.328],
  [17, 288.79, 4562.452], [16, 198.04, 62894.029], [14, 199.76, 31436.921], [12, 95.39, 14577.848],
  [12, 287.11, 31931.756], [12, 320.81, 34777.259], [9, 227.73, 1222.114], [8, 15.45, 16859.074],
];

const DEG = Math.PI / 180;

// Julian Ephemeris Day of the event (Dynamical Time, which runs about a minute ahead of UTC today)
export const seasonEventJDE = (year: number, event: SeasonEvent): number => {
  const Y = (year - 2000) / 1000;
  const jde0 = MEAN_TERMS[event].reduce((sum, c, i) => sum + c * Math.pow(Y, i), 0);
  const T = (jde0 - 2451545.0) / 36525;
  const W = (35999.373 * T - 2.47) * DEG;
  const dLambda = 1 + 0.0334 * Math.cos(W) + 0.0007 * Math.cos(2 * W);
  const S = PERIODIC_TERMS.reduce((sum, [A, B, C]) => sum + A * Math.cos((B + C * T) * DEG), 0);
  return jde0 + (0.00001 * S) / dLambda;
};

export const seasonEventDate = (year: number, event: SeasonEvent): Date =>
  new Date((seasonEventJDE(year, event) - 2440587.5) * 86400000);

// The solstice-to-solstice year containing d: [last December solstice, March, June, September, next December solstice]
export const seasonalYear = (d: Date): Date[] => {
  const year = d.getFullYear();
  const start = d < seasonEventDate(year, 'december') ? year - 1 : year;
  return [
    seasonEventDate(start, 'december'),
    seasonEventDate(start + 1, 'march'),
    seasonEventDate(start + 1, 'june'),
    seasonEventDate(start + 1, 'september'),
    seasonEventDate(start + 1, 'december'),
  ];
};

// Angle on the dial, clockwise from 12 o'clock: each quarter spans one real season,
// so the line crosses an axis exactly at its solstice or equinox
export const seasonalAngle = (d: Date): number => {
  const bounds = seasonalYear(d);
  const t = d.getTime();
  // bounds[0] <= d < bounds[4], so the first boundary after d is index 1–4 and d sits in the quarter before it
  const q = bounds.findIndex((b) => t < b.getTime()) - 1;
  const from = bounds[q].getTime();
  const to = bounds[q + 1].getTime();
  return (q + (t - from) / (to - from)) * (Math.PI / 2);
};
