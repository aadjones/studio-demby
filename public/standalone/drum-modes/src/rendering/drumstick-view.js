"use strict";

/* ============================================================
   Drumstick — a tapered wood shaft + rounded tip, matching the
   drum-vibes reference build (strike.mjs): falls in on a fixed
   lean angle, contacts the head, then retreats and fades out.
   One-shot, triggered per interactive strike (not on every
   StrikeEngine.doStrike() call — see strike-input.js / ui.js).
   ============================================================ */
const DrumstickView = (function () {
  const { rig, geometry } = SceneRig;
  const { RINGS, SEGMENTS, STRIKE_R_MAX } = Constants;

  const STICK_L = 1.62, TIP_R = 0.052;
  const LEAN = 0.62;           // radians off vertical, arrives from outside the rim
  const DROP = 0.72;           // world units above the surface at strike-trigger time
  const T_IMPACT = 0.75;       // seconds: fall duration before contact
  const FADE_START = 0.15;     // seconds after impact: opacity/shadow hold ends
  const FADE_END = 0.37;       // seconds after impact: fully faded
  const HIDE_AT = 0.40;        // seconds after impact: group hidden

  const woodMat = new THREE.MeshStandardMaterial({ color:0xc79a5c, roughness:0.55, metalness:0.02, transparent:true });
  const tipMat  = new THREE.MeshStandardMaterial({ color:0xe0b878, roughness:0.42, metalness:0.02, transparent:true });

  const stick = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.024, STICK_L, 20), woodMat);
  shaft.position.y = STICK_L/2 + TIP_R*0.6;   // sits above the tip
  const tip = new THREE.Mesh(new THREE.SphereGeometry(TIP_R, 20, 20), tipMat);
  stick.add(shaft); stick.add(tip);
  stick.visible = false;
  rig.add(stick);

  let stickDir = new THREE.Vector3(0,1,0);
  let strikeR = 0, strikeTh = 0, strikeSx = 0, strikeSz = 0;
  let strikeStart = 0, active = false;
  let onImpact = null, impactFired = false;

  // starts the visual swing immediately; onImpact fires exactly on the frame
  // contact happens, so callers can delay the actual physics (StrikeEngine.doStrike)
  // until the stick visually touches the head, instead of both firing at once
  function strike(r, th, onImpactCb){
    r = Math.min(r, STRIKE_R_MAX);
    strikeR = r; strikeTh = th;
    strikeSx = r*Math.cos(th); strikeSz = r*Math.sin(th);

    // lean the stick so it arrives from outside the rim, not straight down
    const outw = new THREE.Vector3(Math.cos(th), 0, Math.sin(th));
    stickDir = new THREE.Vector3(
      outw.x*Math.sin(LEAN), Math.cos(LEAN), outw.z*Math.sin(LEAN)
    ).normalize();
    stick.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), stickDir);

    strikeStart = performance.now();
    active = true;
    onImpact = onImpactCb || null;
    impactFired = false;
    stick.visible = true;
    woodMat.opacity = 1; tipMat.opacity = 1;
  }

  // the tip rides the live-deformed membrane at the strike spot
  function surfaceY(){
    const i = Math.max(1, Math.min(RINGS, Math.round(strikeR*RINGS)));
    const j = ((Math.round(strikeTh/(2*Math.PI)*SEGMENTS) % SEGMENTS) + SEGMENTS) % SEGMENTS;
    const idx = 1 + (i-1)*SEGMENTS + j;
    return geometry.attributes.position.getY(idx);
  }

  function update(now){
    if (!active) return;
    const t = (now - strikeStart)/1000;

    // falls under something like gravity, contacts at T_IMPACT, rebounds
    let lift;
    if (t < T_IMPACT){
      const u = t/T_IMPACT;
      lift = DROP*(1 - u*u);              // accelerating fall
    } else {
      const dt = t - T_IMPACT;
      lift = 1.2*dt + 6.0*dt*dt;          // accelerating retreat
    }

    if (t >= T_IMPACT && !impactFired){
      impactFired = true;
      if (onImpact) onImpact();
    }

    stick.position.set(
      strikeSx + stickDir.x*lift,
      surfaceY() + TIP_R*0.5 + lift,
      strikeSz + stickDir.z*lift
    );

    if (t >= T_IMPACT){
      const dts = t - T_IMPACT;
      const fade = dts <= FADE_START ? 1 : Math.max(0, 1 - (dts-FADE_START)/(FADE_END-FADE_START));
      woodMat.opacity = fade; tipMat.opacity = fade;
      if (dts >= HIDE_AT){
        stick.visible = false;
        active = false;
      }
    }
  }

  return { strike, update };
})();
