import { canonical, shapesOf } from "./core/shapes.js";
import { cellCount, compositeCycle, displacementRange, maxPatternLength, pulse, renderPattern, } from "./core/grid.js";
import { highlightCell, renderGrid, rulerLabel, shapeSwatch } from "./views/dom.js";
import { estimatePages, renderSheet } from "./views/sheet.js";
import { Transport } from "./transport.js";
import { decodeSettings, encodeSettings } from "./settings.js";
import { initEmbed, isEmbedded, openPrintablePage, wantsAutoPrint } from "./embed.js";
/** Upper bound on the pattern-length slider; the bar can lower it. */
const WINDOW_LIMIT = 6;
/** What you get with no query string, and the fallback for any bad parameter. */
const DEFAULTS = {
    beatsPerBar: 4,
    cellsPerBeat: 4,
    window: 4,
    onsets: 2,
    displacement: 0,
    mode: "tile",
    shape: [1, 1, 0, 0],
    ostinato: pulse(16, 4),
};
const state = {
    spec: { beatsPerBar: 4, cellsPerBeat: 4 },
    window: 4,
    onsets: 2,
    shapeIndex: 0,
    displacement: 0,
    mode: "tile",
    ostinato: pulse(16, 4),
    bpm: 90,
};
/** Rows currently on screen — the transport reads its onsets from here. */
let live = { ostinato: [], pattern: [] };
/**
 * Fails by name. `getElementById` returning null casts away silently, and the
 * error you eventually get is "Cannot read properties of null" with no clue
 * which element vanished.
 */
const $ = (id) => {
    const el = document.getElementById(id);
    if (!el)
        throw new Error(`gridding: missing element #${id}`);
    return el;
};
function currentShapes() {
    return shapesOf(state.window, state.onsets);
}
function currentPattern() {
    const shapes = currentShapes();
    const shape = shapes[state.shapeIndex] ?? shapes[0] ?? [];
    return { shape, displacement: state.displacement, mode: state.mode };
}
/** Keep derived values legal after any control change. */
function reconcile() {
    const n = cellCount(state.spec);
    if (state.ostinato.length !== n)
        state.ostinato = pulse(n, state.spec.cellsPerBeat);
    state.window = Math.min(state.window, maxPatternLength(state.mode, n, WINDOW_LIMIT));
    state.onsets = Math.min(state.onsets, state.window);
    const shapes = currentShapes();
    state.shapeIndex = Math.min(state.shapeIndex, Math.max(shapes.length - 1, 0));
    const span = displacementRange(state.mode, shapes[state.shapeIndex] ?? [], n);
    state.displacement = ((state.displacement % span) + span) % span;
}
/**
 * Keep what the reader is looking at where it was.
 *
 * renderGrid() replaces the entire grid, which destroys the node the browser's
 * own scroll anchoring was holding onto, and a change of pattern length can add
 * four systems at once — well over a thousand pixels. Everything below then
 * lurches, including the control that was just used.
 *
 * Anchors on .library, which survives the rebuild, and only corrects when the
 * reader is looking at it rather than at the grid.
 */
function preserveScroll(redraw) {
    const anchor = document.querySelector(".library");
    const before = anchor?.getBoundingClientRect().top ?? null;
    const watching = before !== null && before < window.innerHeight;
    redraw();
    if (!watching || !anchor)
        return;
    const delta = anchor.getBoundingClientRect().top - before;
    if (Math.abs(delta) < 1)
        return;
    // Embedded, this frame never scrolls — the host page does, and it is
    // same-origin, so we are allowed to move it.
    const scroller = isEmbedded() ? window.parent : window;
    try {
        scroller.scrollBy(0, delta);
    }
    catch {
        /* host refused; leave the scroll alone rather than fail the render */
    }
}
function render() {
    reconcile();
    const n = cellCount(state.spec);
    const pattern = currentPattern();
    const { cells } = compositeCycle(state.mode, pattern.shape, n);
    live = {
        ostinato: Array.from({ length: cells }, (_, i) => state.ostinato[i % n]),
        pattern: renderPattern(pattern, cells),
    };
    preserveScroll(() => {
        renderGrid($("grid"), state.spec, 
        // Sliding hand on top, steady hand beneath it: the ostinato is the lower
        // voice on nearly every instrument (feet on a kit, left hand at a piano),
        // and this puts the ruler directly above the line whose position you read.
        [
            { id: "pattern", label: "Sliding hand (set by the controls below)", role: "pattern", cells: live.pattern },
            {
                id: "ostinato",
                label: "Steady hand (click to edit)",
                role: "ostinato",
                cells: live.ostinato,
                editable: true,
                action: { label: "Reset", onClick: () => { state.ostinato = []; render(); } },
            },
        ], (laneId, i) => {
            if (laneId !== "ostinato")
                return;
            // The ostinato is authored once and repeats each bar, so edits fold back into it.
            const at = i % n;
            state.ostinato[at] = state.ostinato[at] === 1 ? 0 : 1;
            render();
        });
        renderChips();
        renderNote();
        syncControls();
    });
    syncUrl();
    transport.refresh();
}
function renderChips() {
    const host = $("shape-list");
    host.innerHTML = "";
    const shapes = currentShapes();
    const letters = new Map();
    shapes.forEach((shape, i) => {
        const k = canonical(shape);
        if (!letters.has(k))
            letters.set(k, String.fromCharCode(65 + letters.size));
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "chip";
        if (i === state.shapeIndex)
            chip.classList.add("current");
        chip.append(shapeSwatch(shape));
        const tag = document.createElement("span");
        tag.className = "chip-tag";
        tag.textContent = letters.get(k);
        chip.append(tag);
        chip.addEventListener("click", () => {
            state.shapeIndex = i;
            render();
        });
        host.append(chip);
    });
}
/**
 * A row of discrete choices. These ranges are tiny (two to six values) and not
 * continuous, so a slider is the wrong instrument: it asks for a drag to reach
 * a value you can only ever land exactly on, and it regenerates the grid at
 * every value you pass through on the way.
 */
function renderSteps(hostId, min, max, value, onPick) {
    const host = $(hostId);
    const hadFocus = host.contains(document.activeElement);
    host.innerHTML = "";
    for (let v = min; v <= max; v++) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "step";
        if (v === value)
            b.classList.add("current");
        b.setAttribute("aria-pressed", String(v === value));
        b.textContent = String(v);
        b.addEventListener("click", () => onPick(v));
        host.append(b);
        if (hadFocus && v === value)
            b.focus();
    }
}
function renderNote() {
    const n = cellCount(state.spec);
    const cycle = compositeCycle(state.mode, currentPattern().shape, n);
    $("note").innerHTML =
        cycle.bars > 1
            ? `<p>The pattern doesn't fit the bar evenly, so it carries across the barline—all <strong>${cycle.bars}</strong> bars are drawn above, and then it repeats.</p>`
            : "";
}
/** The sheet is the whole family — page ranges in the print dialog do the rest. */
function sheetDrills() {
    const n = cellCount(state.spec);
    const ostinato = (cells) => Array.from({ length: cells }, (_, i) => state.ostinato[i % n]);
    return currentShapes()
        .map((shape) => ({
        shape,
        ostinato: ostinato(compositeCycle(state.mode, shape, n).cells),
        pattern: renderPattern({ shape, displacement: state.displacement, mode: state.mode }, compositeCycle(state.mode, shape, n).cells),
    }));
}
function syncPrintBar() {
    const n = cellCount(state.spec);
    const shapes = currentShapes();
    const count = shapes.length;
    const pages = estimatePages(shapes.map((s) => compositeCycle(state.mode, s, n).bars));
    $("print-summary").textContent =
        `${count} drill${count === 1 ? "" : "s"} · ≈${pages} page${pages === 1 ? "" : "s"}`;
}
function buildSheet() {
    const { beatsPerBar, cellsPerBeat } = state.spec;
    const names = { 2: "eighths", 3: "triplets", 4: "sixteenths" };
    renderSheet($("sheet"), state.spec, {
        title: "Gridding",
        subtitle: `${beatsPerBar}/4 · ${names[cellsPerBeat] ?? `${cellsPerBeat} per beat`} · ` +
            `${state.window}-cell pattern, ${state.onsets} note${state.onsets === 1 ? "" : "s"} · ` +
            `displacement ${state.displacement}`,
    }, sheetDrills());
}
/**
 * Where the pattern now begins, said musically. "0 / 3" is a cell count; what a
 * player needs to know is which part of the beat they are starting on.
 */
function positionLabel() {
    const { cellsPerBeat } = state.spec;
    const d = state.displacement;
    const beat = Math.floor(d / cellsPerBeat) + 1;
    if (d % cellsPerBeat === 0)
        return `Starts on beat ${beat}`;
    return `Starts on the “${rulerLabel(state.spec, d)}” of beat ${beat}`;
}
function nudge(step) {
    const span = displacementRange(state.mode, currentPattern().shape, cellCount(state.spec));
    state.displacement = (((state.displacement + step) % span) + span) % span;
    render();
}
function syncControls() {
    const span = displacementRange(state.mode, currentPattern().shape, cellCount(state.spec));
    const windowMax = maxPatternLength(state.mode, cellCount(state.spec), WINDOW_LIMIT);
    renderSteps("window-steps", 2, windowMax, state.window, (v) => {
        state.window = v;
        state.shapeIndex = 0;
        render();
    });
    renderSteps("onsets-steps", 1, state.window, state.onsets, (v) => {
        state.onsets = v;
        state.shapeIndex = 0;
        render();
    });
    // Nothing to slide when the shape already repeats every cell.
    $("nudge-back").disabled = span <= 1;
    $("nudge-fwd").disabled = span <= 1;
    $("nudge-readout").innerHTML =
        `${positionLabel()} <span class="nudge-count">${state.displacement + 1} of ${span}</span>`;
    syncPrintBar();
}
const transport = new Transport({
    cellDuration: () => 60 / state.bpm / state.spec.cellsPerBeat,
    totalCells: () => live.pattern.length,
    onsetsAt: (i) => ({
        ostinato: live.ostinato[i] === 1,
        pattern: live.pattern[i] === 1,
    }),
    onCell: (i) => highlightCell($("grid"), i),
});
/** Seed state from the query string. Anything malformed falls back silently. */
function applyUrl() {
    const s = decodeSettings(location.search.replace(/^\?/, ""), DEFAULTS);
    state.spec.beatsPerBar = s.beatsPerBar;
    state.spec.cellsPerBeat = s.cellsPerBeat;
    state.window = s.window;
    state.onsets = s.onsets;
    state.displacement = s.displacement;
    state.mode = s.mode;
    state.ostinato = s.ostinato;
    const idx = shapesOf(s.window, s.onsets).findIndex((sh) => sh.join("") === s.shape.join(""));
    state.shapeIndex = idx >= 0 ? idx : 0;
    // Controls that aren't redrawn by render() have to be told.
    $("beats").value = String(s.beatsPerBar);
    $("subdivision").value = String(s.cellsPerBeat);
    const radio = document.querySelector(`input[name="mode"][value="${s.mode}"]`);
    if (radio)
        radio.checked = true;
}
function currentSettings() {
    return {
        beatsPerBar: state.spec.beatsPerBar,
        cellsPerBeat: state.spec.cellsPerBeat,
        window: state.window,
        onsets: state.onsets,
        displacement: state.displacement,
        mode: state.mode,
        shape: currentShapes()[state.shapeIndex] ?? DEFAULTS.shape,
        ostinato: state.ostinato,
    };
}
/**
 * The link to hand someone.
 *
 * Built from state rather than read off the address bar, because syncUrl is
 * debounced — and because embedded there is no address bar to read: this frame
 * rewrites its own history entry, which the host page never shows. That makes
 * this button the only way an embedded reader can share a drill at all.
 */
function shareUrl() {
    return `${location.origin}${location.pathname}?${encodeSettings(currentSettings())}`;
}
let urlTimer = 0;
/**
 * Mirror state into the address bar so any drill can be linked to.
 *
 * Debounced: dragging a slider fires input continuously, and Safari throttles
 * replaceState to roughly a hundred calls per thirty seconds.
 */
function syncUrl() {
    clearTimeout(urlTimer);
    urlTimer = setTimeout(() => {
        history.replaceState(null, "", `?${encodeSettings(currentSettings())}`);
    }, 250);
}
async function copyLink() {
    const button = $("copy-link");
    const url = shareUrl();
    try {
        await navigator.clipboard.writeText(url);
    }
    catch {
        // Clipboard API needs a secure context and can still be refused.
        const scratch = document.createElement("textarea");
        scratch.value = url;
        scratch.setAttribute("readonly", "");
        scratch.style.position = "fixed";
        scratch.style.opacity = "0";
        document.body.append(scratch);
        scratch.select();
        document.execCommand("copy");
        scratch.remove();
    }
    button.textContent = "Copied";
    setTimeout(() => { button.textContent = "Copy link"; }, 1500);
}
function bind() {
    // Printing is the whole point of the tool, so wire it before anything else:
    // a throw in a later binding must never be able to disable it.
    $("copy-link").addEventListener("click", () => {
        void copyLink();
    });
    $("print").addEventListener("click", () => {
        if (isEmbedded()) {
            openPrintablePage();
            return;
        }
        buildSheet();
        window.print();
    });
    // Cmd+P users never touch the button.
    window.addEventListener("beforeprint", buildSheet);
    $("beats").addEventListener("change", (e) => {
        state.spec.beatsPerBar = Number(e.target.value);
        state.ostinato = [];
        render();
    });
    $("subdivision").addEventListener("change", (e) => {
        state.spec.cellsPerBeat = Number(e.target.value);
        state.ostinato = [];
        render();
    });
    $("nudge-back").addEventListener("click", () => nudge(-1));
    $("nudge-fwd").addEventListener("click", () => nudge(1));
    for (const el of document.querySelectorAll('input[name="mode"]')) {
        el.addEventListener("change", () => {
            state.mode = el.value;
            render();
        });
    }
    $("play").addEventListener("click", () => {
        transport.toggle();
        $("play").textContent = transport.playing ? "■ Stop" : "▶ Preview";
    });
    $("bpm").addEventListener("input", (e) => {
        state.bpm = Math.max(20, Math.min(300, Number(e.target.value) || 90));
        transport.refresh();
    });
}
bind();
applyUrl();
if (isEmbedded())
    initEmbed();
render();
// Opened by the embedded page's print button: build the sheet and go straight
// to the print dialog. syncUrl() strips the flag from the address bar after.
if (wantsAutoPrint()) {
    buildSheet();
    window.print();
}
//# sourceMappingURL=main.js.map