"use strict";

/* ============================================================
   Camera drag-to-rotate
   ============================================================ */
const CameraControls = (function () {
  const { rig, camera, renderer } = SceneRig;
  const { AZIMUTH_DRAG_SENS, ELEVATION_DRAG_SENS } = Constants;

  const state = { dragging: false, lastX: 0, lastY: 0, azimuth: 0.5, elevation: 0.55 };

  function applyRotation(){
    rig.rotation.y = state.azimuth;
    camera.position.set(0, 1.35 + 1.1*(state.elevation-0.55), 2.4);
    camera.lookAt(0,0,0);
  }

  renderer.domElement.addEventListener('pointerdown',(e)=>{ state.dragging=true; state.lastX=e.clientX; state.lastY=e.clientY; });
  window.addEventListener('pointerup',()=>state.dragging=false);
  window.addEventListener('pointermove',(e)=>{
    if(!state.dragging) return;
    state.azimuth += (e.clientX-state.lastX)*AZIMUTH_DRAG_SENS;
    state.elevation = Math.max(0.15, Math.min(1.3, state.elevation + (e.clientY-state.lastY)*ELEVATION_DRAG_SENS));
    state.lastX=e.clientX; state.lastY=e.clientY;
    applyRotation();
  });

  return { state, applyRotation };
})();
