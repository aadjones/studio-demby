"use strict";

/* ============================================================
   Animation
   ============================================================ */
const { vertCount } = DiskMesh;
const { geometry, resize, colorFor, renderer, scene, camera, strikeMarker } = SceneRig;
const { applyRotation } = CameraControls;
const { TIME_SCALE, AMP, ENV_SKIP_CUTOFF } = Constants;
const { groups } = ModeBasis;

const disp = new Float32Array(vertCount);

function updateFrame(now){
  const pos = geometry.attributes.position;
  const col = geometry.attributes.color;

  if (PlaybackClock.state.viewMode === 'explore'){
    const phase = Math.cos(ExploreMode.state.exK*TIME_SCALE*PlaybackClock.exElapsed(now));
    for (let v=0; v<vertCount; v++){
      const s = ExploreMode.exSpatial[v]*phase;
      pos.setY(v, AMP*s);
      const c = colorFor(s);
      col.setXYZ(v, c[0], c[1], c[2]);
    }
  } else {
    const t = PlaybackClock.strikeElapsed(now);
    disp.fill(0);
    for (const f of StrikeEngine.state.activeFuncs){
      const g = groups[f.group];
      if (g.muted) continue;
      const dt = t - f.envAnchorT;
      const env = f.alpha > 0 ? f.envAnchorVal*Math.exp(-f.alpha*dt) : f.envAnchorVal;
      if (env < ENV_SKIP_CUTOFF) continue;
      const q = (f.coeff/f.omegaD)*env*Math.sin(f.omegaD*t);
      if (q === 0) continue;
      const sp = f.sp;
      for (let v=0; v<vertCount; v++) disp[v] += q*sp[v];
    }
    for (let v=0; v<vertCount; v++){
      const s = disp[v]/StrikeEngine.state.ampNorm;
      pos.setY(v, AMP*s);
      const c = colorFor(s);
      col.setXYZ(v, c[0], c[1], c[2]);
    }
  }

  pos.needsUpdate = true;
  col.needsUpdate = true;
  geometry.computeVertexNormals();

  WireframeView.update(pos);
}

window.addEventListener('resize', ()=>{ resize(); SpectrumView.drawSpectrum(); });

/* ---------- boot ---------- */
UI.initUI();
resize();
applyRotation();
ExploreMode.computeExplore();
SpectrumView.drawSpectrum();
PlaybackClock.state.viewMode = 'explore';
strikeMarker.visible = false;

let lastSpecDraw = 0;
(function loop(t){
  updateFrame(t);
  DrumstickView.update(t);
  // keep the decaying spectrum in sync, throttled
  if (PlaybackClock.state.viewMode==='strike' && StrikeEngine.state.strikeActive
      && StrikeEngine.state.dampAmount>0 && t-lastSpecDraw > 50){
    SpectrumView.drawSpectrum();
    lastSpecDraw = t;
  }
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
})(performance.now());
