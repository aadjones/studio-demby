/**
 * Grid: placing a shape into a bar, against a fixed ostinato.
 *
 * The bar is N cells. Nothing here knows about instruments — a Row is just
 * "hit or don't hit on this cell", so the same model serves drums, piano, or
 * anything else with two independent limbs.
 */
import { minimalPeriod, mod } from "./shapes.js";
export const cellCount = (spec) => spec.beatsPerBar * spec.cellsPerBeat;
/**
 * The longest pattern that makes sense in a bar of n cells.
 *
 * A tiled pattern may be any length — it just repeats. A *single figure*
 * longer than the bar would wrap onto itself and silently swallow its own
 * onsets, so it is capped at the bar.
 */
export function maxPatternLength(mode, n, limit) {
    return mode === "once" ? Math.min(limit, n) : limit;
}
/**
 * Render a pattern spec into an N-cell row.
 * In "once" mode the shape must fit the bar — see `maxPatternLength`.
 */
export function renderPattern(p, n) {
    const k = p.shape.length;
    const out = new Array(n).fill(0);
    if (k === 0)
        return out;
    if (p.mode === "tile") {
        for (let i = 0; i < n; i++)
            out[i] = p.shape[mod(i - p.displacement, k)];
    }
    else {
        for (let t = 0; t < k; t++) {
            if (p.shape[t] === 1)
                out[mod(p.displacement + t, n)] = 1;
        }
    }
    return out;
}
/** An evenly-spaced ostinato: a hit every `period` cells, starting at `offset`. */
export function pulse(n, period, offset = 0) {
    const out = new Array(n).fill(0);
    if (period <= 0)
        return out;
    for (let i = mod(offset, period); i < n; i += period)
        out[i] = 1;
    return out;
}
/**
 * How far the slip can slide before it repeats itself.
 *
 * Keyed on the shape's real period, so an all-onsets pattern offers one
 * position rather than pretending to offer k identical ones.
 */
export function displacementRange(mode, shape, n) {
    return mode === "tile" ? minimalPeriod(shape) : n;
}
export function compositeCycle(mode, shape, n) {
    if (mode === "once")
        return { cells: n, bars: 1 };
    const cells = lcm(minimalPeriod(shape), n);
    return { cells, bars: cells / n };
}
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}
function lcm(a, b) {
    return (a / gcd(a, b)) * b;
}
//# sourceMappingURL=grid.js.map