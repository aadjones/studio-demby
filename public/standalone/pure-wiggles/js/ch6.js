// Green's function tap + convolution reverb — chapter 6, index 5 in DOM.
import { $, $$, tickFns, onResize } from './nav.js';
import { PI, S, X, synth } from './math.js';
import { fit, clearPanel, plot, drawRod } from './canvas.js';
import { AudioEngine, ROOMS, ensureReverb, playReverb, playPop } from './audio.js';

const IDX = 5;

/* ---- tap-to-inject heat (Green's function) ---- */
(function () {
  const N = 64, cv = $('#c5');
  let c = new Float64Array(N + 1), running = true;
  const pops = [];

  function draw() {
    const [ctx, w, h] = fit(cv);
    clearPanel(ctx, w, h);
    pops.forEach((p) => {
      ctx.strokeStyle = `rgba(255,122,69,${Math.max(0, 0.6 - p.age * 0.25)})`;
      ctx.setLineDash([2, 4]);
      ctx.beginPath(); ctx.moveTo(p.x * w, 8); ctx.lineTo(p.x * w, h - 8); ctx.stroke();
      ctx.setLineDash([]);
    });
    const y = synth(c, N);
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < S; i++) {
      const px = i / (S - 1) * w;
      const py = h / 2 - Math.max(-1.45, Math.min(1.45, y[i])) / 1.45 * (h / 2 - 10);
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.lineTo(w, h / 2); ctx.lineTo(0, h / 2); ctx.closePath();
    ctx.fillStyle = 'rgba(255,122,69,0.13)'; ctx.fill(); ctx.restore();
    plot(ctx, w, h, y, '#FF7A45', 2.4);
    drawRod($('#c5rod'), y, 1.45);
  }

  cv.addEventListener('pointerdown', (e) => {
    const r = cv.getBoundingClientRect();
    const x0 = Math.max(0.03, Math.min(0.97, (e.clientX - r.left) / r.width));
    for (let n = 1; n <= N; n++) c[n] += 1.15 * Math.sin(n * PI * x0) * Math.exp(-n * n * 0.0014);
    pops.push({ x: x0, age: 0 });
    if (pops.length > 12) pops.shift();
    draw();
  });

  tickFns[IDX] = (dt) => {
    if (!running) return;
    let energy = 0;
    for (let n = 1; n <= N; n++) { c[n] *= Math.exp(-n * n * dt * 0.16); energy += c[n] * c[n]; }
    pops.forEach((p) => (p.age += dt));
    if (energy > 1e-7 || pops.some((p) => p.age < 3)) draw();
  };

  $('#c5pause').addEventListener('click', (e) => {
    running = !running; e.target.textContent = running ? '⏸ pause' : '▶ resume';
  });
  $('#c5reset').addEventListener('click', () => { c = new Float64Array(N + 1); pops.length = 0; draw(); });
  onResize(IDX, draw);
  draw();
})();

/* ---- convolution reverb ---- */
(function () {
  let currentRoom = null;

  function drawIR(room) {
    const cv = $('#c5ir');
    const [ctx, w, h] = fit(cv);
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#252A35'; ctx.beginPath(); ctx.moveTo(0, h - 12); ctx.lineTo(w, h - 12); ctx.stroke();
    ctx.fillStyle = '#7B8190'; ctx.font = '10px IBM Plex Mono,monospace';
    if (!room) {
      ctx.fillText('impulse response G(t) — select a room', 10, 16);
      ctx.strokeStyle = '#54C8EC'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(14, h - 12); ctx.lineTo(14, 8); ctx.stroke();
      ctx.fillText('a delta: dry = convolve with a spike', 24, h - 26);
      return;
    }
    const r = ROOMS[room], maxDur = 4.5;
    ctx.fillText(`G(t) · ${room} · ${r.dur.toFixed(1)} s`, 10, 16);
    ctx.strokeStyle = '#FF7A45'; ctx.lineWidth = 1.4;
    ctx.beginPath();
    for (let i = 0; i <= 240; i++) {
      const t = i / 240 * maxDur;
      const env = t > r.dur ? 0 : Math.exp(-t / r.tau);
      const x = 10 + (w - 20) * (t / maxDur);
      const y = (h - 12) - env * (0.75 + 0.25 * Math.sin(i * 1.7)) * (h - 26);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
  }

  $('#c5dry').addEventListener('click', () => {
    currentRoom = null;
    $$('#ch5 [data-room]').forEach((x) => x.classList.remove('on'));
    drawIR(null); playReverb(null);
    $('#c5read').textContent = 'Dry: convolving with a bare delta function returns the signal unchanged.';
  });

  $$('#ch5 [data-room]').forEach((b) =>
    b.addEventListener('click', () => {
      currentRoom = b.dataset.room;
      $$('#ch5 [data-room]').forEach((x) => x.classList.toggle('on', x === b));
      ensureReverb(); drawIR(currentRoom); playReverb(currentRoom);
      $('#c5read').textContent = `${ROOMS[currentRoom].label}. Same dry signal, convolved with this G.`;
    })
  );

  $('#c5pop').addEventListener('click', () => {
    const room = currentRoom || 'hall';
    ensureReverb(); playPop(room);
    $('#c5read').textContent = `That sound is G for the ${room} — the room's complete linear personality in one recording.`;
  });

  onResize(IDX, () => drawIR(currentRoom));
  drawIR(null);
})();
