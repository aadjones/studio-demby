// ── Presets ──────────────────────────────────────────────────────
// Spatial values are in "design units" (based on a 600px reference canvas).
// They get multiplied by a scale factor at generation time.
const PRESETS = {
  wispy: {
    label: 'Wispy',
    layers: 3,
    streaks: [10, 20],
    dropSpacing: 50,
    baseSize: [10, 25],
    stretchXEnd: 7,
    alpha: 0.7,
    saturation: 70,
    hueShift: 10,
    brightnessBase: [40, 70],
    scaleYRange: [0, 2.5],
    jitter: 3,
  },
  lush: {
    label: 'Lush',
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
    label: 'Dense',
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

// ── Artifact code (encode / decode) ──────────────────────────────
const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const PRESET_KEYS = ['wispy', 'lush', 'dense'];

function encodeArtifact(seed, density, weight, presetIdx) {
  if (presetIdx === undefined) presetIdx = 1; // lush
  // Pack: version(2) | preset(2) | seed(20) | density(7) | weight(7)
  let val = 0;
  val = val * 4 + 0;                       // version 0
  val = val * 4 + (presetIdx & 3);          // preset
  val = val * 1048576 + (seed % 1048576);   // 2^20
  val = val * 128 + (density & 127);        // 2^7
  val = val * 128 + (weight & 127);         // 2^7

  let code = '';
  for (let i = 0; i < 7; i++) {
    code = BASE62[val % 62] + code;
    val = Math.floor(val / 62);
  }
  return 'f:' + code;
}

function decodeArtifact(code) {
  if (!code || !code.startsWith('f:') || code.length !== 9) return null;
  let payload = code.slice(2);

  let val = 0;
  for (let i = 0; i < payload.length; i++) {
    let idx = BASE62.indexOf(payload[i]);
    if (idx === -1) return null;
    val = val * 62 + idx;
  }

  let weight  = val % 128; val = Math.floor(val / 128);
  let density = val % 128; val = Math.floor(val / 128);
  let seed    = val % 1048576; val = Math.floor(val / 1048576);
  let preset  = val % 4; val = Math.floor(val / 4);
  let version = val % 4;

  if (version !== 0) return null;
  if (density > 100 || weight > 100) return null;
  if (preset >= PRESET_KEYS.length) return null;

  return { seed, density, weight, preset };
}

function getArtifactCode() {
  let params = getUserParams();
  return encodeArtifact(interactiveSeed, params.density, params.weight);
}

function updateHash() {
  if (mode !== 'interactive') return;
  let code = getArtifactCode();
  history.replaceState(null, '', '#' + code);
  document.querySelector('.print-code').textContent = code;
}

function clearHash() {
  history.replaceState(null, '', window.location.pathname);
}

// ── Constants ────────────────────────────────────────────────────
const REFERENCE_SIZE = 600;
const TARGET_SECONDS = 12;
const FADE_FRAMES = 30;
const SHOWCASE_HOLD_MS = 4500;

// ── State ────────────────────────────────────────────────────────
let drops = [];
let spawnIndex = 0;
let activeDrops = [];
let animStartFrame = 0;
let totalFrames = 0;
let buf;
let fadeBuf;
let s = 1;
let paused = false;
let animDone = false;

// Mode: 'showcase' or 'interactive'
let mode = 'showcase';
let showcaseTimer = null;
let regenTimer = null;
let interactiveSeed = null; // locked seed for smooth slider exploration

// Shuffle animation (cross-dissolve between old and new)
let shuffleAnimating = false;
let shuffleStartTime = 0;
let shuffleOldImage = null;
const SHUFFLE_MS = 800;

// ── 2D Affine Transform helpers ─────────────────────────────────
function matIdentity() {
  return { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };
}

function matMultiply(m1, m2) {
  return {
    a:  m1.a * m2.a  + m1.c * m2.b,
    b:  m1.b * m2.a  + m1.d * m2.b,
    c:  m1.a * m2.c  + m1.c * m2.d,
    d:  m1.b * m2.c  + m1.d * m2.d,
    tx: m1.a * m2.tx + m1.c * m2.ty + m1.tx,
    ty: m1.b * m2.tx + m1.d * m2.ty + m1.ty,
  };
}

function matTranslate(m, x, y) {
  return matMultiply(m, { a: 1, b: 0, c: 0, d: 1, tx: x, ty: y });
}

function matRotate(m, angle) {
  let cs = Math.cos(angle), sn = Math.sin(angle);
  return matMultiply(m, { a: cs, b: sn, c: -sn, d: cs, tx: 0, ty: 0 });
}

function matScale(m, sx, sy) {
  return matMultiply(m, { a: sx, b: 0, c: 0, d: sy, tx: 0, ty: 0 });
}

function matTransformPoint(m, x, y) {
  return [m.a * x + m.c * y + m.tx, m.b * x + m.d * y + m.ty];
}

// ── Easing ───────────────────────────────────────────────────────
function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// ── Parameter helpers (future-proof for save/export) ─────────────
function getUserParams() {
  let densityEl = document.getElementById('density-slider');
  let weightEl = document.getElementById('weight-slider');
  return {
    density: Number(densityEl.value),
    weight: Number(weightEl.value),
  };
}

function buildGenerationParams(userParams) {
  let streakCount = Math.round(lerp(5, 80, userParams.density / 100));
  let dropSpacing = lerp(55, 10, userParams.weight / 100);
  return Object.assign({}, PRESETS.lush, {
    streaks: [streakCount, streakCount],
    dropSpacing: dropSpacing,
  });
}

// ── Random preset picker ─────────────────────────────────────────
function randomPreset() {
  const keys = ['lush', 'dense'];
  return keys[Math.floor(Math.random() * keys.length)];
}

// ── p5 lifecycle ─────────────────────────────────────────────────
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  colorMode(HSB, 360, 100, 100, 1.0);
  noStroke();

  createBuffers();
  wireUI();

  // Check URL hash for an artifact code
  let hashCode = window.location.hash.replace('#', '');
  let artifact = decodeArtifact(hashCode);

  if (artifact) {
    // Load artifact: set state and enter interactive mode
    interactiveSeed = artifact.seed;
    document.getElementById('density-slider').value = artifact.density;
    document.getElementById('weight-slider').value = artifact.weight;

    mode = 'interactive';
    document.getElementById('showcase-ui').classList.add('hidden');
    document.getElementById('interactive-ui').classList.remove('hidden');
    document.querySelector('.print-code').textContent = hashCode;
    generateInstant(getUserParams());
  } else {
    // Start in showcase mode immediately
    background(240);
    generate(randomPreset());
  }
}

function wireUI() {
  // Showcase → Interactive
  document.getElementById('make-own-btn').addEventListener('click', () => {
    enterInteractiveMode();
  });

  // Interactive → Showcase
  document.getElementById('back-btn').addEventListener('click', () => {
    enterShowcaseMode();
  });

  // Shuffle: snapshot old, generate new, cross-dissolve
  document.getElementById('shuffle-btn').addEventListener('click', () => {
    shuffleOldImage = buf.get();
    interactiveSeed = Math.floor(Math.random() * 1000000);
    generateInstant(getUserParams());
    updateHash();
    shuffleAnimating = true;
    shuffleStartTime = millis();
    loop();
  });

  // Copy link
  let copyBtn = document.getElementById('copy-btn');
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      copyBtn.textContent = 'Copied';
      setTimeout(() => { copyBtn.textContent = 'Copy Link'; }, 1500);
    });
  });

  // Slider changes (debounced)
  let densitySlider = document.getElementById('density-slider');
  let weightSlider = document.getElementById('weight-slider');

  densitySlider.addEventListener('input', onSliderChange);
  weightSlider.addEventListener('input', onSliderChange);
}

function onSliderChange() {
  cancelAnimationFrame(regenTimer);
  regenTimer = requestAnimationFrame(() => {
    generateInstant(getUserParams());
    updateHash();
  });
}

function enterInteractiveMode() {
  // Stop showcase
  clearTimeout(showcaseTimer);
  noLoop();
  paused = false;
  animDone = false;

  mode = 'interactive';
  document.getElementById('showcase-ui').classList.add('hidden');
  document.getElementById('interactive-ui').classList.remove('hidden');

  // Lock a seed so slider adjustments produce smooth, continuous changes
  interactiveSeed = Math.floor(Math.random() * 1000000);

  // Generate with current slider values
  generateInstant(getUserParams());
  updateHash();
}

function enterShowcaseMode() {
  cancelAnimationFrame(regenTimer);
  clearHash();

  mode = 'showcase';
  document.getElementById('interactive-ui').classList.add('hidden');
  document.getElementById('showcase-ui').classList.remove('hidden');

  paused = false;
  animDone = false;
  generate(randomPreset());
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createBuffers();
  if (mode === 'showcase') {
    clearTimeout(showcaseTimer);
    generate(randomPreset());
  } else {
    generateInstant(getUserParams());
  }
}

function createBuffers() {
  buf = createGraphics(width, height);
  buf.colorMode(HSB, 360, 100, 100, 1.0);
  buf.noStroke();

  fadeBuf = createGraphics(width, height);
  fadeBuf.colorMode(HSB, 360, 100, 100, 1.0);
  fadeBuf.noStroke();
}

// ── Draw (showcase animation only) ──────────────────────────────
function draw() {
  if (mode === 'interactive') {
    background(240);
    if (shuffleAnimating) {
      let t = constrain((millis() - shuffleStartTime) / SHUFFLE_MS, 0, 1);
      let easedT = easeOutCubic(t);
      drawingContext.globalAlpha = 1 - easedT;
      image(shuffleOldImage, 0, 0);
      drawingContext.globalAlpha = easedT;
      image(buf, 0, 0);
      drawingContext.globalAlpha = 1;
      if (t >= 1) {
        shuffleAnimating = false;
        shuffleOldImage = null;
        noLoop();
      }
    } else {
      image(buf, 0, 0);
      noLoop();
    }
    return;
  }

  // Showcase: animated fade-in
  let elapsed = frameCount - animStartFrame;
  let linearProgress = constrain(elapsed / totalFrames, 0, 1);
  let easedProgress = easeInOutSine(linearProgress);
  let targetSpawn = Math.floor(easedProgress * drops.length);

  while (spawnIndex < targetSpawn && spawnIndex < drops.length) {
    activeDrops.push({ drop: drops[spawnIndex], birthFrame: frameCount });
    spawnIndex++;
  }

  let stillActive = [];
  for (let entry of activeDrops) {
    let age = frameCount - entry.birthFrame;
    if (age >= FADE_FRAMES) {
      drawDrop(buf, entry.drop, entry.drop.alpha);
    } else {
      stillActive.push(entry);
    }
  }
  activeDrops = stillActive;

  fadeBuf.clear();
  for (let entry of activeDrops) {
    let age = frameCount - entry.birthFrame;
    let t = age / FADE_FRAMES;
    let fadeAlpha = entry.drop.alpha * t * t;
    drawDrop(fadeBuf, entry.drop, fadeAlpha);
  }

  background(240);
  image(buf, 0, 0);
  image(fadeBuf, 0, 0);

  if (spawnIndex >= drops.length && activeDrops.length === 0) {
    animDone = true;
    noLoop();
    // Auto-cycle: hold, then generate next
    showcaseTimer = setTimeout(() => {
      generate(randomPreset());
    }, SHOWCASE_HOLD_MS);
  }
}

function drawDrop(g, d, alpha) {
  g.fill(d.hue, d.saturation, d.brightness, alpha);
  g.beginShape();
  g.vertex(d.vx, d.vy);
  g.bezierVertex(d.c1x, d.c1y, d.c2x, d.c2y, d.vx, d.vy);
  g.endShape(CLOSE);
}

// ── Keyboard controls ────────────────────────────────────────────
function keyPressed() {
  if (key === ' ' && mode === 'showcase' && !animDone) {
    paused = !paused;
    if (paused) {
      noLoop();
    } else {
      loop();
    }
    return false;
  }
  if (key === 's' || key === 'S') {
    let name = (mode === 'interactive')
      ? 'feather-' + getArtifactCode().replace(':', '_')
      : 'feather-' + new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    saveCanvas(name, 'png');
  }
}

// ── Generation (animated, for showcase) ─────────────────────────
function generate(presetKey) {
  let p = PRESETS[presetKey];
  drops = [];
  spawnIndex = 0;
  activeDrops = [];
  paused = false;
  animDone = false;
  s = Math.min(width, height) / REFERENCE_SIZE;

  buf.clear();
  buf.resetMatrix();
  buf.background(240);
  fadeBuf.clear();

  collectAllDrops(p);

  shuffleArray(drops);
  totalFrames = TARGET_SECONDS * 60;
  animStartFrame = frameCount;
  loop();
}

// ── Generation (instant, for interactive) ────────────────────────
function generateInstant(userParams) {
  let p = buildGenerationParams(userParams);
  drops = [];
  spawnIndex = 0;
  activeDrops = [];
  s = Math.min(width, height) / REFERENCE_SIZE;

  buf.clear();
  buf.resetMatrix();
  buf.background(240);
  fadeBuf.clear();

  // Lock the RNG so the same seed + different slider values
  // produces smooth, continuous variation (same structure, different params)
  randomSeed(interactiveSeed);
  collectAllDrops(p);

  // Draw everything in one pass — no animation
  for (let d of drops) {
    drawDrop(buf, d, d.alpha);
  }

  // Single frame render
  background(240);
  image(buf, 0, 0);
}

// ── Shared drop collection pipeline ─────────────────────────────
function collectAllDrops(p) {
  let mat = matIdentity();
  let stable = interactiveSeed !== null && mode === 'interactive';

  for (let i = 0; i < p.layers; i++) {
    // Seed per-layer so streak count doesn't shift later layers' randomness
    if (stable) randomSeed(interactiveSeed + i * 10000);
    let numStreaks = random(p.streaks[0], p.streaks[1]);

    collectStreakSet(numStreaks, p, mat, stable ? i : -1);

    if (i < p.layers - 1) {
      // Seed per-layer transform independently
      if (stable) randomSeed(interactiveSeed + i * 10000 + 5000);
      mat = matTranslate(mat, width / 2, height / 2);
      mat = matRotate(mat, random(-PI / 8, PI / 8));
      mat = matScale(mat, random(-1.5, -0.5), random(p.scaleYRange[0], p.scaleYRange[1]));
      mat = matTranslate(mat, -width / 2, -height / 2);
      mat = matTranslate(mat, random(-100 * s, 100 * s), random(-100 * s, 100 * s));
    }
  }
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ── Pre-computation ──────────────────────────────────────────────
function collectStreakSet(numStreaks, p, mat, layerIndex) {
  let startYMin = 0;
  let startYMax = height / 2;
  let startXMin = 50 * s;
  let startXMax = width - 200 * s;
  let lengthMin = 200 * s;
  let lengthMax = 500 * s;
  let controlXOff = 200 * s;
  let controlYOff = 100 * s;

  for (let i = 0; i < numStreaks; i++) {
    // Seed per-streak so each streak's jitter is independent
    // of how many other streaks exist
    if (layerIndex >= 0) {
      randomSeed(interactiveSeed + layerIndex * 10000 + i * 100 + 1);
    }

    let verticalPos = map(i, 0, numStreaks, startYMin, startYMax);
    let phase = map(i, 0, numStreaks, 0, TWO_PI);
    let hLength = map(verticalPos, startYMin, startYMax, lengthMin, lengthMax);
    let lengthAdj = map(i, 0, numStreaks, 1, 0.2);
    let startX = map(i, 0, numStreaks, startXMin, startXMax);
    hLength *= lengthAdj;

    collectStreak(startX, verticalPos, controlXOff, controlYOff, hLength, 100 * s, phase, p, mat);
  }
}

function collectStreak(startX, startY, controlXOff, controlYOff, endXOff, endYOff, phase, p, mat) {
  let waveAmp = 50 * s;
  let controlX = startX + controlXOff;
  let controlY = startY + controlYOff + sin(phase) * waveAmp;
  let endX = startX + endXOff;
  let endY = startY + endYOff + sin(phase + PI / 2) * waveAmp;

  let spacing = p.dropSpacing * s;
  let numDrops = int(dist(startX, startY, endX, endY) / spacing);

  for (let t = 0; t <= 1; t += 1 / max(1, numDrops)) {
    let x = bezierPoint(startX, controlX, controlX, endX, t);
    let y = bezierPoint(startY, controlY, controlY, endY, t);

    let cycle = sin(phase + t * TWO_PI);
    let baseSize = lerp(p.baseSize[0], p.baseSize[1], (cycle + 1) / 2) * s;
    let stretchX = lerp(1, p.stretchXEnd, t);
    let stretchY = lerp(1, 0.5, t) * map(cycle, -1, 1, 0.5, 1.5);
    let hue = lerp(0, 10, t) + map(cycle, -1, 1, -20, 20) + p.hueShift;
    let brightness = map(startY, 0, height, p.brightnessBase[0], p.brightnessBase[1]) + map(cycle, -1, 1, -20, 20);

    let jitter = p.jitter * s;
    let j1x = random(-jitter, jitter);
    let j1y = random(-jitter, jitter);
    let j2x = random(-jitter, jitter);
    let j2y = random(-jitter, jitter);

    let c1x = x - baseSize * stretchX + j1x;
    let c1y = y - baseSize * stretchY + j1y;
    let c2x = x + baseSize * stretchX + j2x;
    let c2y = y + baseSize * stretchY + j2y;

    let tv  = matTransformPoint(mat, x, y);
    let tc1 = matTransformPoint(mat, c1x, c1y);
    let tc2 = matTransformPoint(mat, c2x, c2y);

    drops.push({
      vx: tv[0],   vy: tv[1],
      c1x: tc1[0], c1y: tc1[1],
      c2x: tc2[0], c2y: tc2[1],
      hue, saturation: p.saturation, brightness, alpha: p.alpha,
    });
  }
}
