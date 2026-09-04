/**
 * Print view. Same inputs as dom.ts, laid out for paper.
 *
 * Paper is the deliverable: it is legible at playing distance, needs no free
 * hand, and doesn't sleep. It is also greyscale, which is why the two hands are
 * distinguished here by glyph (hollow vs solid) rather than by colour.
 */
import { cellCount } from "../core/grid.js";
import { buildRuler } from "./dom.js";
import { gaps } from "../core/shapes.js";
/**
 * Sheet geometry in millimetres, measured from the rendered print layout rather
 * than guessed—A4 portrait at 15mm margins gives a 180 x 267mm content box.
 */
export const SHEET_MM = {
    page: 267,
    header: 27.5,
    /** Drill label plus the margin below the block. */
    drillOverhead: 11.8,
    /** One bar: ruler plus both lanes. */
    system: 28.1,
};
/**
 * Pages a selection will actually occupy, given each drill's bar count.
 *
 * Takes a count per drill rather than one figure for all of them: drills in the
 * same family can differ, since the cycle follows each shape's own period —
 * `111000` needs three bars where `101010` needs one.
 *
 * Drills carry `break-inside: avoid`, so this packs whole drills rather than
 * dividing total height by page height; one that doesn't fit the remaining
 * space moves down intact.
 */
export function estimatePages(barsPerDrill) {
    if (barsPerDrill.length === 0)
        return 0;
    let pages = 1;
    let room = SHEET_MM.page - SHEET_MM.header;
    for (const bars of barsPerDrill) {
        const cost = SHEET_MM.drillOverhead + bars * SHEET_MM.system;
        if (cost > room) {
            pages += 1;
            room = SHEET_MM.page;
        }
        room -= cost;
    }
    return pages;
}
function lane(spec, cells, bar, role) {
    const n = cellCount(spec);
    const el = document.createElement("div");
    el.className = `lane lane-${role}`;
    for (let i = 0; i < n; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        if (i % spec.cellsPerBeat === 0)
            cell.classList.add("beat");
        if (cells[bar * n + i] === 1)
            cell.classList.add("on");
        el.append(cell);
    }
    return el;
}
export function renderSheet(host, spec, meta, drills) {
    const n = cellCount(spec);
    host.innerHTML = "";
    const head = document.createElement("header");
    head.className = "sheet-header";
    head.innerHTML =
        `<h1>${meta.title}</h1><p>${meta.subtitle}</p>` +
            `<p class="legend"><span class="key key-pattern"></span> sliding hand` +
            `<span class="key key-ostinato"></span> steady hand</p>`;
    host.append(head);
    drills.forEach((drill, i) => {
        const bars = Math.max(1, Math.round(drill.pattern.length / n));
        const block = document.createElement("section");
        block.className = "drill";
        const label = document.createElement("p");
        label.className = "drill-head";
        const shape = drill.shape.map((c) => (c === 1 ? "■" : "□")).join("");
        label.innerHTML =
            `<span class="drill-number">${i + 1}</span>` +
                `<span class="drill-shape">${shape}</span>` +
                `<span class="drill-gaps">gaps ${gaps(drill.shape).join("–") || "—"}</span>`;
        block.append(label);
        for (let b = 0; b < bars; b++) {
            const system = document.createElement("div");
            system.className = "system";
            system.style.setProperty("--n", String(n));
            if (bars > 1) {
                const num = document.createElement("p");
                num.className = "bar-number";
                num.textContent = `${b + 1}/${bars}`;
                system.append(num);
            }
            system.append(buildRuler(spec));
            // Same order as the screen: sliding hand above, steady hand below.
            system.append(lane(spec, drill.pattern, b, "pattern"));
            system.append(lane(spec, drill.ostinato, b, "ostinato"));
            block.append(system);
        }
        host.append(block);
    });
}
//# sourceMappingURL=sheet.js.map