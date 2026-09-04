/**
 * Running inside a Studio Demby project page.
 *
 * The host renders a fixed-height, non-scrolling iframe and resizes it from a
 * postMessage this page sends (see EmbedExperience.tsx). Without that, gridding
 * is clipped: it wants ~930px and the default box is 600px, which cuts off the
 * pattern list and the grid setup entirely.
 */
const CHANNEL = "gridding-embed";
/**
 * Read once, at startup, and never again.
 *
 * syncUrl() rewrites the address bar with only the settings parameters, which
 * strips `embed` and `print`. Re-reading location.search later would report
 * "not embedded" inside the iframe and fall back to printing the frame.
 */
const FLAGS = new URLSearchParams(location.search);
const EMBEDDED = FLAGS.has("embed") && window.parent !== window;
const AUTO_PRINT = FLAGS.has("print");
export const isEmbedded = () => EMBEDDED;
export const wantsAutoPrint = () => AUTO_PRINT;
/** Tell the host how tall we actually are, now and whenever that changes. */
export function initEmbed() {
    document.body.classList.add("embed");
    const report = () => {
        // Body height, not documentElement.scrollHeight: the latter is floored at
        // the viewport height, so once the host has grown the iframe the reported
        // value can never come back down and the box keeps dead space below the
        // content when the drill gets shorter again.
        const height = Math.ceil(document.body.getBoundingClientRect().height);
        window.parent.postMessage({ source: CHANNEL, height }, location.origin);
    };
    if (window.ResizeObserver)
        new ResizeObserver(report).observe(document.body);
    else
        window.addEventListener("resize", report);
    // The host's listener is not attached yet when this first fires, so it also
    // asks again once it sees the iframe load. That second send is the one the
    // first paint actually depends on.
    window.addEventListener("message", (e) => {
        if (e.origin === location.origin && e.data?.source === `${CHANNEL}-request`)
            report();
    });
    report();
}
/**
 * Where "Print sheet" should go.
 *
 * Printing from inside the iframe is a coin flip: the host box is a fixed
 * height in the parent's flow, so a parent-initiated print shows about 60% of
 * one page and cannot paginate at all, and frame-scoped `window.print()`
 * differs across browsers. Printing is the product, so when embedded we hand
 * off to a real page that prints itself.
 */
export function openPrintablePage() {
    const params = new URLSearchParams(location.search);
    params.delete("embed");
    params.set("print", "1");
    window.open(`${location.pathname}?${params.toString()}`, "_blank", "noopener");
}
//# sourceMappingURL=embed.js.map