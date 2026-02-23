// ── Presets ──────────────────────────────────────────────────────
var PRESETS = {
  congregation: {
    label: 'Congregation',
    numPlanes: 700,
    planeW: [400, 900],
    planeH: [400, 900],
    volume: 450,
    maxRotation: Math.PI * 2,
    shardDuration: 3,
    totalDuration: 10,
    noiseAmplitude: 15,
    noiseScale: 0.01,
  },
  swarm: {
    label: 'Swarm',
    numPlanes: 5000,
    planeW: [100, 500],
    planeH: [100, 500],
    volume: 400,
    maxRotation: Math.PI * 2,
    shardDuration: 3,
    totalDuration: 12,
    noiseAmplitude: 25,
    noiseScale: 0.01,
  },
  voidscream: {
    label: 'The Void Screams Back',
    numPlanes: 4000,
    planeW: [8, 40],
    planeH: [40, 200],
    volume: 550,
    maxRotation: Math.PI * 2,
    shardDuration: 0.8,
    totalDuration: 5,
    noiseAmplitude: 30,
    noiseScale: 0.015,
  },
};

var PRESET_KEYS = Object.keys(PRESETS);
var HOLD_MS = 2500;

// ── State ────────────────────────────────────────────────────────
var shaderProgram;
let planes = [];
let animStartTime = 0;
let currentDuration = 8;
let activePreset = 'swarm';

// Mode: 'showcase' or 'creator'
let mode = 'showcase';

// Showcase state machine
// Phases: 'shattering', 'hold_shattered', 'reassembling', 'hold_wall'
let phase = 'shattering';
let phaseStartTime = 0;
let showcaseTimer = null;

// Creator state
let interactiveSeed = null;
let regenTimer = null;

// Shuffle animation
let shuffleAnimating = false;
let shuffleStartTime = 0;
let shuffleOldPlanes = [];
var SHUFFLE_MS = 800;

// DOM refs (set in setup)
let densitySlider, sizeSlider;

// ── Easing ───────────────────────────────────────────────────────
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInCubic(t) {
  return Math.pow(t, 3);
}

// ── p5 lifecycle ─────────────────────────────────────────────────
function preload() {
  shaderProgram = loadShader('waveVert.vert', 'waveFrag.frag');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('canvas-container');
  noStroke();

  // DOM refs
  densitySlider = document.getElementById('density-slider');
  sizeSlider = document.getElementById('size-slider');

  // Wire events
  document.getElementById('make-own-btn').addEventListener('click', function () {
    switchMode('creator');
  });
  document.getElementById('back-btn').addEventListener('click', function () {
    switchMode('showcase');
  });
  document.getElementById('shuffle-btn').addEventListener('click', function () {
    // Snapshot current end positions before regenerating
    shuffleOldPlanes = planes.map(function (p) {
      return { ex: p.ex, ey: p.ey, ez: p.ez, erx: p.erx, ery: p.ery, erz: p.erz, w: p.w, h: p.h };
    });
    interactiveSeed = Math.floor(Math.random() * 1000000);
    generateInstant(getUserParams());
    shuffleAnimating = true;
    shuffleStartTime = millis();
    loop();
  });
  densitySlider.addEventListener('input', onSliderChange);
  sizeSlider.addEventListener('input', onSliderChange);

  // Start showcase immediately
  enterShowcaseMode();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (mode === 'showcase') {
    generate(activePreset);
  } else {
    generateInstant(getUserParams());
  }
}

// ── Draw ─────────────────────────────────────────────────────────
function draw() {
  background(0);
  if (planes.length === 0) return;

  shader(shaderProgram);
  directionalLight(255, 255, 255, 1, 1, 0);

  let p = PRESETS[activePreset];
  shaderProgram.setUniform('uTime', 0);
  shaderProgram.setUniform('uAmplitude', mode === 'creator' ? 20 : p.noiseAmplitude);
  shaderProgram.setUniform('uNoiseScale', mode === 'creator' ? 0.01 : p.noiseScale);

  if (mode === 'creator') {
    if (shuffleAnimating) {
      let t = constrain((millis() - shuffleStartTime) / SHUFFLE_MS, 0, 1);
      let easedT = easeOutCubic(t);
      drawShuffleTransition(easedT);
      if (t >= 1) {
        shuffleAnimating = false;
        noLoop();
      }
    } else {
      drawPlanesAtT(1);
      noLoop();
    }
    return;
  }

  // ── Showcase state machine ──
  let elapsed = (millis() - animStartTime) / 1000;

  if (phase === 'shattering') {
    let globalT = constrain(elapsed / currentDuration, 0, 1);
    drawPlanesAnimated(globalT, false);
    if (globalT >= 1) {
      phase = 'hold_shattered';
      phaseStartTime = millis();
    }
  } else if (phase === 'hold_shattered') {
    drawPlanesAtT(1);
    if (millis() - phaseStartTime >= HOLD_MS) {
      phase = 'reassembling';
      animStartTime = millis();
    }
  } else if (phase === 'reassembling') {
    let globalT = constrain(elapsed / currentDuration, 0, 1);
    drawPlanesAnimated(globalT, true);
    if (globalT >= 1) {
      phase = 'hold_wall';
      phaseStartTime = millis();
    }
  } else if (phase === 'hold_wall') {
    drawPlanesAtT(0);
    if (millis() - phaseStartTime >= HOLD_MS) {
      // Pick new preset and restart cycle
      generate(randomPreset());
    }
  }
}

// ── Rendering helpers ────────────────────────────────────────────
function drawPlanesAnimated(globalProgress, reverse) {
  for (let i = 0; i < planes.length; i++) {
    let pl = planes[i];
    let localT = constrain((globalProgress - pl.delay) / pl.duration, 0, 1);
    let easedT = reverse ? (1 - easeInCubic(localT)) : easeOutCubic(localT);

    let x = lerp(pl.sx, pl.ex, easedT);
    let y = lerp(pl.sy, pl.ey, easedT);
    let z = lerp(pl.sz, pl.ez, easedT);
    let rx = lerp(0, pl.erx, easedT);
    let ry = lerp(0, pl.ery, easedT);
    let rz = lerp(0, pl.erz, easedT);

    push();
    translate(x, y, z);
    rotateX(rx);
    rotateY(ry);
    rotateZ(rz);
    plane(pl.w, pl.h);
    pop();
  }
}

function drawPlanesAtT(t) {
  for (let i = 0; i < planes.length; i++) {
    let pl = planes[i];
    let x = lerp(pl.sx, pl.ex, t);
    let y = lerp(pl.sy, pl.ey, t);
    let z = lerp(pl.sz, pl.ez, t);
    let rx = lerp(0, pl.erx, t);
    let ry = lerp(0, pl.ery, t);
    let rz = lerp(0, pl.erz, t);

    push();
    translate(x, y, z);
    rotateX(rx);
    rotateY(ry);
    rotateZ(rz);
    plane(pl.w, pl.h);
    pop();
  }
}

function drawShuffleTransition(t) {
  for (let i = 0; i < planes.length; i++) {
    let pl = planes[i];
    let old = i < shuffleOldPlanes.length ? shuffleOldPlanes[i] : pl;

    let x = lerp(old.ex, pl.ex, t);
    let y = lerp(old.ey, pl.ey, t);
    let z = lerp(old.ez, pl.ez, t);
    let rx = lerp(old.erx, pl.erx, t);
    let ry = lerp(old.ery, pl.ery, t);
    let rz = lerp(old.erz, pl.erz, t);
    let w = lerp(old.w, pl.w, t);
    let h = lerp(old.h, pl.h, t);

    push();
    translate(x, y, z);
    rotateX(rx);
    rotateY(ry);
    rotateZ(rz);
    plane(w, h);
    pop();
  }
}

// ── Mode switching ───────────────────────────────────────────────
function switchMode(target) {
  let overlay = document.getElementById('fade-overlay');
  overlay.classList.add('active');

  // Wait for fade-in, then swap
  setTimeout(function () {
    if (target === 'creator') {
      enterCreatorMode();
    } else {
      enterShowcaseMode();
    }
    // Fade out
    setTimeout(function () {
      overlay.classList.remove('active');
    }, 100);
  }, 500);
}

function enterShowcaseMode() {
  clearTimeout(showcaseTimer);
  cancelAnimationFrame(regenTimer);
  mode = 'showcase';

  document.getElementById('creator-ui').classList.add('hidden');
  document.getElementById('showcase-ui').classList.remove('hidden');

  generate(randomPreset());
}

function enterCreatorMode() {
  clearTimeout(showcaseTimer);
  cancelAnimationFrame(regenTimer);
  mode = 'creator';

  document.getElementById('showcase-ui').classList.add('hidden');
  document.getElementById('creator-ui').classList.remove('hidden');

  interactiveSeed = Math.floor(Math.random() * 1000000);
  generateInstant(getUserParams());
}

// ── Slider handling ──────────────────────────────────────────────
function getUserParams() {
  return {
    density: Number(densitySlider.value),
    fragmentSize: Number(sizeSlider.value),
  };
}

function onSliderChange() {
  cancelAnimationFrame(regenTimer);
  regenTimer = requestAnimationFrame(function () {
    generateInstant(getUserParams());
  });
}

// ── Generation ───────────────────────────────────────────────────
function generate(presetKey) {
  activePreset = presetKey;
  planes = [];
  phase = 'shattering';

  let p = PRESETS[presetKey];
  currentDuration = p.totalDuration;

  buildPlanes(p.numPlanes, p.planeW, p.planeH, p.volume, p.maxRotation, p.shardDuration / currentDuration);

  animStartTime = millis();
  loop();
}

function generateInstant(params) {
  planes = [];

  let size = params.fragmentSize;
  let wRange = [size * 0.3, size * 1.5];
  let hRange = [size * 0.3, size * 1.5];
  let volume = lerp(350, 700, params.density / 8000);

  randomSeed(interactiveSeed);
  buildPlanes(params.density, wRange, hRange, volume, Math.PI * 2, 0.1);
  randomSeed(null); // restore true randomness

  // Draw one frame then stop
  loop();
}

function buildPlanes(numPlanes, planeWRange, planeHRange, volume, maxRotation, shardDurationNorm) {
  let avgSize = (planeWRange[0] + planeWRange[1] + planeHRange[0] + planeHRange[1]) / 4;

  let cols = Math.ceil(Math.sqrt(numPlanes));
  let rows = Math.ceil(numPlanes / cols);
  let wallW = cols * avgSize;
  let wallH = rows * avgSize;
  let offsetX = -wallW / 2 + avgSize / 2;
  let offsetY = -wallH / 2 + avgSize / 2;

  let maxDist = Math.sqrt((wallW / 2) ** 2 + (wallH / 2) ** 2);
  let maxDelay = 0.6;

  let count = 0;
  for (let row = 0; row < rows && count < numPlanes; row++) {
    for (let col = 0; col < cols && count < numPlanes; col++) {
      let sx = offsetX + col * avgSize + random(-avgSize * 0.15, avgSize * 0.15);
      let sy = offsetY + row * avgSize + random(-avgSize * 0.15, avgSize * 0.15);
      let sz = random(-5, 5);

      let dist = Math.sqrt(sx * sx + sy * sy);
      let delay = 0.4 * (dist / maxDist) * maxDelay + 0.6 * random(0, maxDelay);

      let ex = random(-volume, volume);
      let ey = random(-volume, volume);
      let ez = random(-volume, volume * 0.2);

      let erx = random(-maxRotation, maxRotation);
      let ery = random(-maxRotation, maxRotation);
      let erz = random(-maxRotation, maxRotation);

      let w = random(planeWRange[0], planeWRange[1]);
      let h = random(planeHRange[0], planeHRange[1]);

      planes.push({
        sx, sy, sz,
        ex, ey, ez,
        erx, ery, erz,
        delay,
        duration: shardDurationNorm,
        w, h,
      });

      count++;
    }
  }
}

function randomPreset() {
  // Weighted selection: favor swarm (middle option)
  var weights = { congregation: 0.25, swarm: 0.55, voidscream: 0.20 };
  var r = Math.random();
  var cumulative = 0;
  for (var i = 0; i < PRESET_KEYS.length; i++) {
    cumulative += weights[PRESET_KEYS[i]] || (1 / PRESET_KEYS.length);
    if (r < cumulative) return PRESET_KEYS[i];
  }
  return PRESET_KEYS[PRESET_KEYS.length - 1];
}

// ── Keyboard controls ────────────────────────────────────────────
function keyPressed() {
  if (key === 's' || key === 'S') {
    let stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    saveCanvas('shatter-' + stamp, 'png');
  }
}
