/**
 * Playhead. A preview, not a practice transport — you keep time with whatever
 * metronome you already own; this is here so you can hear what a drill is before
 * you print it.
 *
 * Audio is scheduled ahead against AudioContext time (sample-accurate); the
 * visual playhead is driven separately by rAF (accurate enough for the eye).
 */
const LOOKAHEAD = 0.1; // seconds of audio scheduled in advance
export class Transport {
    o;
    ctx = null;
    raf = 0;
    origin = 0;
    nextCell = 0;
    dur = 0.1;
    shownCell = -1;
    playing = false;
    constructor(o) {
        this.o = o;
    }
    toggle() {
        if (this.playing)
            this.stop();
        else
            this.start();
    }
    start() {
        this.ctx ??= new AudioContext();
        void this.ctx.resume();
        this.dur = this.o.cellDuration();
        this.origin = this.ctx.currentTime + 0.05;
        this.nextCell = 0;
        this.shownCell = -1;
        this.playing = true;
        this.tick();
    }
    stop() {
        this.playing = false;
        cancelAnimationFrame(this.raf);
        this.o.onCell(null);
    }
    /** Restart timing in place — used when tempo or the pattern changes mid-play. */
    refresh() {
        if (this.playing)
            this.start();
    }
    tick = () => {
        if (!this.playing || !this.ctx)
            return;
        const total = this.o.totalCells();
        const now = this.ctx.currentTime;
        while (this.origin + this.nextCell * this.dur < now + LOOKAHEAD) {
            const at = this.origin + this.nextCell * this.dur;
            const { ostinato, pattern } = this.o.onsetsAt(this.nextCell % total);
            if (ostinato)
                this.click(at, 660, 0.18);
            if (pattern)
                this.click(at, 1320, 0.13);
            this.nextCell += 1;
        }
        const elapsed = now - this.origin;
        const cell = elapsed < 0 ? 0 : Math.floor(elapsed / this.dur) % total;
        if (cell !== this.shownCell) {
            this.shownCell = cell;
            this.o.onCell(cell);
        }
        this.raf = requestAnimationFrame(this.tick);
    };
    click(at, freq, gain) {
        const ctx = this.ctx;
        const osc = ctx.createOscillator();
        const env = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = freq;
        env.gain.setValueAtTime(0, at);
        env.gain.linearRampToValueAtTime(gain, at + 0.002);
        env.gain.exponentialRampToValueAtTime(0.0001, at + 0.05);
        osc.connect(env).connect(ctx.destination);
        osc.start(at);
        osc.stop(at + 0.07);
    }
}
//# sourceMappingURL=transport.js.map