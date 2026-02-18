// Blood Feathers — showcase-only p5 instance-mode sketch
// Ported from: p5js-projects/misc/blood-feathers-gen/sketch.js
// Strips interactive mode, artifact codes, UI wiring. Keeps auto-cycling showcase.

type P5 = any;

// ── Presets ──────────────────────────────────────────────────────
const PRESETS: Record<string, Preset> = {
  lush: {
    layers: 4,
    streaks: [20, 50],
    dropSpacing: 30,
    baseSize: [20, 40],
    stretchXEnd: 5,
    alpha: 0.9,
    saturation: 80,
    hueShift: 0,
    brightnessBase: [30, 60],
    scaleYRange: [0, 4],
    jitter: 5,
  },
  dense: {
    layers: 5,
    streaks: [45, 80],
    dropSpacing: 15,
    baseSize: [25, 50],
    stretchXEnd: 3,
    alpha: 0.95,
    saturation: 90,
    hueShift: -5,
    brightnessBase: [20, 50],
    scaleYRange: [0.5, 5],
    jitter: 6,
  },
};

interface Preset {
  layers: number;
  streaks: [number, number];
  dropSpacing: number;
  baseSize: [number, number];
  stretchXEnd: number;
  alpha: number;
  saturation: number;
  hueShift: number;
  brightnessBase: [number, number];
  scaleYRange: [number, number];
  jitter: number;
}

interface Drop {
  vx: number; vy: number;
  c1x: number; c1y: number;
  c2x: number; c2y: number;
  hue: number; saturation: number; brightness: number; alpha: number;
}

interface Mat {
  a: number; b: number; c: number; d: number; tx: number; ty: number;
}

// ── Constants ────────────────────────────────────────────────────
const REFERENCE_SIZE = 600;
const TARGET_SECONDS = 12;
const FADE_FRAMES = 30;
const SHOWCASE_HOLD_MS = 4500;

// ── 2D Affine Transform helpers ─────────────────────────────────
function matIdentity(): Mat {
  return { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };
}

function matMultiply(m1: Mat, m2: Mat): Mat {
  return {
    a:  m1.a * m2.a  + m1.c * m2.b,
    b:  m1.b * m2.a  + m1.d * m2.b,
    c:  m1.a * m2.c  + m1.c * m2.d,
    d:  m1.b * m2.c  + m1.d * m2.d,
    tx: m1.a * m2.tx + m1.c * m2.ty + m1.tx,
    ty: m1.b * m2.tx + m1.d * m2.ty + m1.ty,
  };
}

function matTranslate(m: Mat, x: number, y: number): Mat {
  return matMultiply(m, { a: 1, b: 0, c: 0, d: 1, tx: x, ty: y });
}

function matRotate(m: Mat, angle: number): Mat {
  const cs = Math.cos(angle), sn = Math.sin(angle);
  return matMultiply(m, { a: cs, b: sn, c: -sn, d: cs, tx: 0, ty: 0 });
}

function matScale(m: Mat, sx: number, sy: number): Mat {
  return matMultiply(m, { a: sx, b: 0, c: 0, d: sy, tx: 0, ty: 0 });
}

function matTransformPoint(m: Mat, x: number, y: number): [number, number] {
  return [m.a * x + m.c * y + m.tx, m.b * x + m.d * y + m.ty];
}

// ── Easing ───────────────────────────────────────────────────────
function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

// ── Shuffle ──────────────────────────────────────────────────────
function shuffleArray(arr: Drop[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ── Random preset picker ─────────────────────────────────────────
function randomPreset(): string {
  const keys = ["lush", "dense"];
  return keys[Math.floor(Math.random() * keys.length)];
}

/**
 * Creates the blood feathers showcase sketch in p5 instance mode.
 * Auto-cycles: generate → 12s animation → 4.5s hold → regenerate.
 */
export default function bloodFeathersSketch(p: P5, parent: HTMLElement): void {
  let drops: Drop[] = [];
  let spawnIndex = 0;
  let activeDrops: { drop: Drop; birthFrame: number }[] = [];
  let animStartFrame = 0;
  let totalFrames = 0;
  let buf: P5;
  let fadeBuf: P5;
  let s = 1;
  let animDone = false;
  let showcaseTimer: ReturnType<typeof setTimeout> | null = null;

  function createBuffers(): void {
    buf = p.createGraphics(p.width, p.height);
    buf.colorMode(p.HSB, 360, 100, 100, 1.0);
    buf.noStroke();

    fadeBuf = p.createGraphics(p.width, p.height);
    fadeBuf.colorMode(p.HSB, 360, 100, 100, 1.0);
    fadeBuf.noStroke();
  }

  function drawDrop(g: P5, d: Drop, alpha: number): void {
    g.fill(d.hue, d.saturation, d.brightness, alpha);
    g.beginShape();
    g.vertex(d.vx, d.vy);
    g.bezierVertex(d.c1x, d.c1y, d.c2x, d.c2y, d.vx, d.vy);
    g.endShape(p.CLOSE);
  }

  function collectStreak(
    startX: number, startY: number,
    controlXOff: number, controlYOff: number,
    endXOff: number, endYOff: number,
    phase: number, preset: Preset, mat: Mat
  ): void {
    const waveAmp = 50 * s;
    const controlX = startX + controlXOff;
    const controlY = startY + controlYOff + p.sin(phase) * waveAmp;
    const endX = startX + endXOff;
    const endY = startY + endYOff + p.sin(phase + p.PI / 2) * waveAmp;

    const spacing = preset.dropSpacing * s;
    const numDrops = p.int(p.dist(startX, startY, endX, endY) / spacing);

    for (let t = 0; t <= 1; t += 1 / p.max(1, numDrops)) {
      const x = p.bezierPoint(startX, controlX, controlX, endX, t);
      const y = p.bezierPoint(startY, controlY, controlY, endY, t);

      const cycle = p.sin(phase + t * p.TWO_PI);
      const baseSize = p.lerp(preset.baseSize[0], preset.baseSize[1], (cycle + 1) / 2) * s;
      const stretchX = p.lerp(1, preset.stretchXEnd, t);
      const stretchY = p.lerp(1, 0.5, t) * p.map(cycle, -1, 1, 0.5, 1.5);
      const hue = p.lerp(0, 10, t) + p.map(cycle, -1, 1, -20, 20) + preset.hueShift;
      const brightness = p.map(startY, 0, p.height, preset.brightnessBase[0], preset.brightnessBase[1])
        + p.map(cycle, -1, 1, -20, 20);

      const jitter = preset.jitter * s;
      const j1x = p.random(-jitter, jitter);
      const j1y = p.random(-jitter, jitter);
      const j2x = p.random(-jitter, jitter);
      const j2y = p.random(-jitter, jitter);

      const c1x = x - baseSize * stretchX + j1x;
      const c1y = y - baseSize * stretchY + j1y;
      const c2x = x + baseSize * stretchX + j2x;
      const c2y = y + baseSize * stretchY + j2y;

      const tv  = matTransformPoint(mat, x, y);
      const tc1 = matTransformPoint(mat, c1x, c1y);
      const tc2 = matTransformPoint(mat, c2x, c2y);

      drops.push({
        vx: tv[0],   vy: tv[1],
        c1x: tc1[0], c1y: tc1[1],
        c2x: tc2[0], c2y: tc2[1],
        hue, saturation: preset.saturation, brightness, alpha: preset.alpha,
      });
    }
  }

  function collectStreakSet(numStreaks: number, preset: Preset, mat: Mat): void {
    const startYMin = 0;
    const startYMax = p.height / 2;
    const startXMin = 50 * s;
    const startXMax = p.width - 200 * s;
    const lengthMin = 200 * s;
    const lengthMax = 500 * s;
    const controlXOff = 200 * s;
    const controlYOff = 100 * s;

    for (let i = 0; i < numStreaks; i++) {
      const verticalPos = p.map(i, 0, numStreaks, startYMin, startYMax);
      const phase = p.map(i, 0, numStreaks, 0, p.TWO_PI);
      let hLength = p.map(verticalPos, startYMin, startYMax, lengthMin, lengthMax);
      const lengthAdj = p.map(i, 0, numStreaks, 1, 0.2);
      const startX = p.map(i, 0, numStreaks, startXMin, startXMax);
      hLength *= lengthAdj;

      collectStreak(startX, verticalPos, controlXOff, controlYOff, hLength, 100 * s, phase, preset, mat);
    }
  }

  function collectAllDrops(preset: Preset): void {
    let mat = matIdentity();

    for (let i = 0; i < preset.layers; i++) {
      const numStreaks = p.random(preset.streaks[0], preset.streaks[1]);
      collectStreakSet(numStreaks, preset, mat);

      if (i < preset.layers - 1) {
        mat = matTranslate(mat, p.width / 2, p.height / 2);
        mat = matRotate(mat, p.random(-p.PI / 8, p.PI / 8));
        mat = matScale(mat, p.random(-1.5, -0.5), p.random(preset.scaleYRange[0], preset.scaleYRange[1]));
        mat = matTranslate(mat, -p.width / 2, -p.height / 2);
        mat = matTranslate(mat, p.random(-100 * s, 100 * s), p.random(-100 * s, 100 * s));
      }
    }
  }

  function generate(presetKey: string): void {
    const preset = PRESETS[presetKey];
    drops = [];
    spawnIndex = 0;
    activeDrops = [];
    animDone = false;
    s = Math.min(p.width, p.height) / REFERENCE_SIZE;

    buf.clear();
    buf.resetMatrix();
    buf.background(240);
    fadeBuf.clear();

    collectAllDrops(preset);
    shuffleArray(drops);

    totalFrames = TARGET_SECONDS * 60;
    animStartFrame = p.frameCount;
    p.loop();
  }

  // ── p5 lifecycle ───────────────────────────────────────────────

  p.setup = () => {
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    const canvas = p.createCanvas(w, h);
    canvas.parent(parent);
    p.colorMode(p.HSB, 360, 100, 100, 1.0);
    p.noStroke();

    createBuffers();
    p.background(240);
    generate(randomPreset());
  };

  p.draw = () => {
    const elapsed = p.frameCount - animStartFrame;
    const linearProgress = p.constrain(elapsed / totalFrames, 0, 1);
    const easedProgress = easeInOutSine(linearProgress);
    const targetSpawn = Math.floor(easedProgress * drops.length);

    while (spawnIndex < targetSpawn && spawnIndex < drops.length) {
      activeDrops.push({ drop: drops[spawnIndex], birthFrame: p.frameCount });
      spawnIndex++;
    }

    const stillActive: typeof activeDrops = [];
    for (const entry of activeDrops) {
      const age = p.frameCount - entry.birthFrame;
      if (age >= FADE_FRAMES) {
        drawDrop(buf, entry.drop, entry.drop.alpha);
      } else {
        stillActive.push(entry);
      }
    }
    activeDrops = stillActive;

    fadeBuf.clear();
    for (const entry of activeDrops) {
      const age = p.frameCount - entry.birthFrame;
      const t = age / FADE_FRAMES;
      const fadeAlpha = entry.drop.alpha * t * t;
      drawDrop(fadeBuf, entry.drop, fadeAlpha);
    }

    p.background(240);
    p.image(buf, 0, 0);
    p.image(fadeBuf, 0, 0);

    if (spawnIndex >= drops.length && activeDrops.length === 0) {
      animDone = true;
      p.noLoop();
      showcaseTimer = setTimeout(() => {
        generate(randomPreset());
      }, SHOWCASE_HOLD_MS);
    }
  };

  p.windowResized = () => {
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    if (w === 0 || h === 0) return;
    p.resizeCanvas(w, h);
    createBuffers();
    if (showcaseTimer) clearTimeout(showcaseTimer);
    generate(randomPreset());
  };

  // Cleanup hook — called by the container's useEffect cleanup
  (p as any)._heroCleanup = () => {
    if (showcaseTimer) clearTimeout(showcaseTimer);
  };
}
