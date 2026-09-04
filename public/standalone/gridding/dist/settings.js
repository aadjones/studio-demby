/**
 * The shareable subset of app state, as a query string.
 *
 * Pure and DOM-free (URLSearchParams is a platform global, not the DOM), so it
 * is unit-tested. Everything here treats the URL as untrusted input: a malformed
 * or out-of-range parameter is ignored in favour of the fallback rather than
 * being clamped into something the user didn't ask for.
 */
export const LIMITS = {
    beats: { min: 2, max: 7 },
    cells: [2, 3, 4],
    window: { min: 2, max: 6 },
};
const bits = (row) => row.join("");
function parseBits(raw, length) {
    if (raw === null || raw.length !== length || !/^[01]+$/.test(raw))
        return null;
    return [...raw].map((c) => (c === "1" ? 1 : 0));
}
function parseInt_(raw, lo, hi) {
    if (raw === null || raw.trim() === "")
        return null;
    const n = Number(raw);
    return Number.isInteger(n) && n >= lo && n <= hi ? n : null;
}
const onsetCount = (row) => row.reduce((n, c) => n + c, 0);
export function encodeSettings(s) {
    return new URLSearchParams({
        b: String(s.beatsPerBar),
        c: String(s.cellsPerBeat),
        k: String(s.window),
        j: String(s.onsets),
        d: String(s.displacement),
        m: s.mode,
        p: bits(s.shape),
        o: bits(s.ostinato),
    }).toString();
}
export function decodeSettings(query, fallback) {
    const q = new URLSearchParams(query);
    const beatsPerBar = parseInt_(q.get("b"), LIMITS.beats.min, LIMITS.beats.max) ?? fallback.beatsPerBar;
    const cells = parseInt_(q.get("c"), 2, 6);
    const cellsPerBeat = cells !== null && LIMITS.cells.includes(cells) ? cells : fallback.cellsPerBeat;
    const rawMode = q.get("m");
    const mode = rawMode === "tile" || rawMode === "once" ? rawMode : fallback.mode;
    const window = parseInt_(q.get("k"), LIMITS.window.min, LIMITS.window.max) ?? fallback.window;
    const onsets = parseInt_(q.get("j"), 1, window) ?? Math.min(fallback.onsets, window);
    // Displacement is wrapped against the live range by reconcile(), so any
    // non-negative integer is acceptable here.
    const displacement = parseInt_(q.get("d"), 0, Number.MAX_SAFE_INTEGER) ?? 0;
    const parsedShape = parseBits(q.get("p"), window);
    const shape = parsedShape && onsetCount(parsedShape) === onsets ? parsedShape : fallback.shape;
    const ostinato = parseBits(q.get("o"), beatsPerBar * cellsPerBeat) ?? fallback.ostinato;
    return { beatsPerBar, cellsPerBeat, window, onsets, displacement, mode, shape, ostinato };
}
//# sourceMappingURL=settings.js.map