"use strict";

/* ============================================================
   Wireframe overlay — a coarse polar grid (rings + spokes) drawn
   over the shaded surface, matching the drum-vibes visual style.

   This is deliberately NOT a `wireframe: true` material flag, which
   would draw every triangle edge (including the diagonal from each
   quad's triangulation) — far too dense to read as a grid. Instead
   it's a separate, much coarser THREE.LineSegments object, built at
   ring/spoke indices chosen to evenly divide the render grid so wire
   vertices land exactly on render vertices — no drift, no z-fighting
   beyond the deliberate small lift below.
   ============================================================ */
const WireframeView = (function () {
  const { RINGS, SEGMENTS } = Constants;
  const { rig } = SceneRig;

  const RING_STEP = 4;    // 32 rings -> 8 wire rings
  const SPOKE_STEP = 4;   // 64 segments -> 16 wire spokes
  const WIRE_LIFT = 0.004; // world units above the surface, avoids z-fighting
  const WIRE_COLOR = 0x1a1a22;
  const WIRE_OPACITY = 0.28;

  const ringSel = [];
  for (let i = RING_STEP; i <= RINGS; i += RING_STEP) ringSel.push(i);
  const spokeSel = [];
  for (let j = 0; j < SEGMENTS; j += SPOKE_STEP) spokeSel.push(j);

  function vIdx(i, j){ return 1 + (i-1)*SEGMENTS + j; }   // mirrors DiskMesh's own indexing

  const segments = [];   // [vA, vB] pairs, as DiskMesh vertex indices

  // concentric rings: connect adjacent selected spokes around each selected ring
  for (const i of ringSel){
    for (let k = 0; k < spokeSel.length; k++){
      segments.push([vIdx(i, spokeSel[k]), vIdx(i, spokeSel[(k+1) % spokeSel.length])]);
    }
  }
  // radial spokes: connect consecutive selected rings along each selected spoke,
  // starting from the center
  for (const j of spokeSel){
    let prev = 0;   // center vertex
    for (const i of ringSel){
      const cur = vIdx(i, j);
      segments.push([prev, cur]);
      prev = cur;
    }
  }

  const positions = new Float32Array(segments.length * 2 * 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.LineBasicMaterial({
    color: WIRE_COLOR, transparent: true, opacity: WIRE_OPACITY
  });
  const lines = new THREE.LineSegments(geometry, material);
  rig.add(lines);

  // reads the live displaced position buffer of the main mesh each frame —
  // no separate displacement computation needed
  function update(sourcePos){
    for (let s = 0; s < segments.length; s++){
      const [a, b] = segments[s];
      const i0 = s*2, i1 = s*2+1;
      positions[i0*3]   = sourcePos.getX(a);
      positions[i0*3+1] = sourcePos.getY(a) + WIRE_LIFT;
      positions[i0*3+2] = sourcePos.getZ(a);
      positions[i1*3]   = sourcePos.getX(b);
      positions[i1*3+1] = sourcePos.getY(b) + WIRE_LIFT;
      positions[i1*3+2] = sourcePos.getZ(b);
    }
    geometry.attributes.position.needsUpdate = true;
  }

  return { lines, update };
})();
