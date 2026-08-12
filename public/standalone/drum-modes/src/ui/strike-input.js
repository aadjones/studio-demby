"use strict";

/* ============================================================
   Click-to-strike — raycasts pointer taps directly onto the 3D
   drumhead, replacing a separate flat 2D pad. Disambiguates a tap
   (strike) from a drag (camera rotate, handled by CameraControls)
   purely by total pointer movement between down and up.
   ============================================================ */
const StrikeInput = (function () {
  const { renderer, camera, mesh } = SceneRig;
  const { STRIKE_R_MAX } = Constants;

  const CLICK_MOVE_THRESHOLD = 6;   // px; beyond this, treat it as a drag, not a tap

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();

  let downX = 0, downY = 0;

  renderer.domElement.addEventListener('pointerdown', (e)=>{
    downX = e.clientX; downY = e.clientY;
  });

  renderer.domElement.addEventListener('pointerup', (e)=>{
    if (PlaybackClock.state.viewMode !== 'strike') return;
    if (Math.hypot(e.clientX-downX, e.clientY-downY) > CLICK_MOVE_THRESHOLD) return;
    AudioEngine.ensureContext();   // unlock while user activation is still active

    const rect = renderer.domElement.getBoundingClientRect();
    ndc.x = ((e.clientX-rect.left)/rect.width)*2 - 1;
    ndc.y = -(((e.clientY-rect.top)/rect.height)*2 - 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObject(mesh, false)[0];
    if (!hit) return;

    const local = mesh.worldToLocal(hit.point.clone());
    const r = Math.min(Math.hypot(local.x, local.z), STRIKE_R_MAX);
    const th = Math.atan2(local.z, local.x);

    // the stick starts swinging now, but the membrane shouldn't react until
    // it actually makes contact — see DrumstickView's onImpact callback
    DrumstickView.strike(r, th, () => {
      StrikeEngine.doStrike(r, th);
      SpectrumView.drawSpectrum();
      AudioEngine.strike();
    });
  });

  return {};
})();
