/**
 * Screen view. Takes a GridSpec + lanes of cells and paints squares.
 * It reads the model; it never mutates it. `sheet.ts` is its print-shaped sibling.
 */
import { cellCount } from "../core/grid.js";
const SYLLABLES = {
    2: ["&"],
    3: ["trip", "let"],
    4: ["e", "&", "a"],
};
export function rulerLabel(spec, i) {
    const pos = i % spec.cellsPerBeat;
    if (pos === 0)
        return String(Math.floor(i / spec.cellsPerBeat) + 1);
    return SYLLABLES[spec.cellsPerBeat]?.[pos - 1] ?? "·";
}
/** Ruler row for one bar. Shared with the print sheet. */
export function buildRuler(spec) {
    const ruler = document.createElement("div");
    ruler.className = "lane ruler";
    for (let i = 0; i < cellCount(spec); i++) {
        const tick = document.createElement("span");
        tick.className = "tick";
        if (i % spec.cellsPerBeat === 0)
            tick.classList.add("beat");
        tick.textContent = rulerLabel(spec, i);
        ruler.append(tick);
    }
    return ruler;
}
export function renderGrid(host, spec, lanes, onToggle) {
    const n = cellCount(spec);
    const total = lanes[0]?.cells.length ?? n;
    const bars = Math.max(1, Math.round(total / n));
    host.innerHTML = "";
    for (let b = 0; b < bars; b++) {
        const system = document.createElement("div");
        system.className = "system";
        system.style.setProperty("--n", String(n));
        if (bars > 1) {
            const num = document.createElement("p");
            num.className = "bar-number";
            num.textContent = `Bar ${b + 1} of ${bars}`;
            system.append(num);
        }
        const scroll = document.createElement("div");
        scroll.className = "grid-scroll";
        scroll.append(buildRuler(spec));
        for (const lane of lanes) {
            // Labels only on the first system — glyph and bar number carry the rest.
            if (b === 0) {
                const label = document.createElement("p");
                label.className = `lane-label lane-label-${lane.editable ? "editable" : "derived"}`;
                const text = document.createElement("span");
                text.textContent = lane.label;
                label.append(text);
                if (lane.action) {
                    const btn = document.createElement("button");
                    btn.type = "button";
                    btn.className = "lane-action";
                    btn.textContent = lane.action.label;
                    btn.addEventListener("click", lane.action.onClick);
                    label.append(btn);
                }
                scroll.append(label);
            }
            const el = document.createElement("div");
            el.className = `lane lane-${lane.role}`;
            for (let i = 0; i < n; i++) {
                const abs = b * n + i;
                const cell = document.createElement(lane.editable ? "button" : "div");
                cell.className = "cell";
                cell.dataset["cell"] = String(abs);
                if (i % spec.cellsPerBeat === 0)
                    cell.classList.add("beat");
                if (lane.cells[abs] === 1)
                    cell.classList.add("on");
                if (lane.editable) {
                    cell.type = "button";
                    cell.setAttribute("aria-label", `${lane.label} bar ${b + 1} cell ${i + 1}`);
                    cell.addEventListener("click", () => onToggle?.(lane.id, abs));
                }
                el.append(cell);
            }
            scroll.append(el);
        }
        system.append(scroll);
        host.append(system);
    }
}
/** Move the playhead. Cheap enough to call once per cell. */
export function highlightCell(host, index) {
    for (const el of host.querySelectorAll(".cell.playing"))
        el.classList.remove("playing");
    if (index === null)
        return;
    for (const el of host.querySelectorAll(`.cell[data-cell="${index}"]`)) {
        el.classList.add("playing");
    }
}
/** A shape rendered small, for the chip list. */
export function shapeSwatch(shape) {
    const el = document.createElement("span");
    el.className = "swatch";
    el.style.setProperty("--n", String(shape.length));
    for (const c of shape) {
        const dot = document.createElement("span");
        dot.className = c === 1 ? "dot on" : "dot";
        el.append(dot);
    }
    return el;
}
//# sourceMappingURL=dom.js.map