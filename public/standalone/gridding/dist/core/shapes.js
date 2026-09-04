/**
 * Shapes: the "slip of paper".
 *
 * A shape is a short binary word of length k with j onsets. Everything in this
 * module is pure and instrument-agnostic — no notion of hands, pitch, or duration.
 */
/** All C(k, j) shapes of length k with j onsets, in lexicographic order. */
export function shapesOf(k, j) {
    if (j < 0 || j > k)
        return [];
    const out = [];
    const cur = new Array(k).fill(0);
    const walk = (i, left) => {
        if (left === 0) {
            out.push(cur.slice());
            return;
        }
        if (k - i < left)
            return;
        cur[i] = 1;
        walk(i + 1, left - 1);
        cur[i] = 0;
        walk(i + 1, left);
    };
    walk(0, j);
    return out;
}
/** Rotate a shape right by d cells (cyclic). */
export function rotate(shape, d) {
    const k = shape.length;
    if (k === 0)
        return [];
    const out = new Array(k).fill(0);
    for (let i = 0; i < k; i++)
        out[i] = shape[mod(i - d, k)];
    return out;
}
/** Lexicographically-least rotation — the shape's rotation-class identity. */
export function canonical(shape) {
    const k = shape.length;
    let best = shape.join("");
    for (let d = 1; d < k; d++) {
        const s = rotate(shape, d).join("");
        if (s < best)
            best = s;
    }
    return best;
}
/**
 * The shortest length this shape actually repeats at, which may be less than
 * its declared length: `111` has period 1, `101010` has period 2.
 *
 * This is what governs how the shape behaves once tiled, so it — not `k` — is
 * the number to reason with. Using `k` makes an all-onsets pattern claim it
 * needs three bars to come back around when every bar of it is identical.
 *
 * Always divides the length: for a cyclic word, if p is a period then so is
 * gcd(p, k).
 */
export function minimalPeriod(shape) {
    const k = shape.length;
    for (let p = 1; p < k; p++) {
        if (k % p !== 0)
            continue;
        let repeats = true;
        for (let i = 0; i < k; i++) {
            if (shape[i] !== shape[(i + p) % k]) {
                repeats = false;
                break;
            }
        }
        if (repeats)
            return p;
    }
    return Math.max(k, 1);
}
/** Cyclic inter-onset intervals, starting at the first onset. `x..x` -> [3, 1]. */
export function gaps(shape) {
    const k = shape.length;
    const hits = [];
    for (let i = 0; i < k; i++)
        if (shape[i] === 1)
            hits.push(i);
    if (hits.length === 0)
        return [];
    return hits.map((h, i) => mod((hits[(i + 1) % hits.length] - h), k) || k);
}
export function mod(a, n) {
    return ((a % n) + n) % n;
}
//# sourceMappingURL=shapes.js.map