"use strict";

/* ============================================================
   Explore mode
   ============================================================ */
const ExploreMode = (function () {
  const { besselJ, besselZeros } = Bessel;
  const { vertCount, rArr, thArr } = DiskMesh;
  const { j01 } = ModeBasis;
  const { nodalGroup } = SceneRig;

  const state = { exM: 0, exN: 1, exK: 0 };
  const exSpatial = new Float32Array(vertCount);

  function computeExplore(){
    const zeros = besselZeros(state.exM, state.exN);
    const j = zeros[state.exN-1];
    state.exK = j;
    let maxAbs = 0;
    for (let v=0; v<vertCount; v++){
      const val = besselJ(state.exM, state.exK*rArr[v]) * Math.cos(state.exM*thArr[v]);
      exSpatial[v] = val;
      if (Math.abs(val) > maxAbs) maxAbs = Math.abs(val);
    }
    if (maxAbs>0) for (let v=0; v<vertCount; v++) exSpatial[v] /= maxAbs;

    // nodal overlay
    while (nodalGroup.children.length) nodalGroup.remove(nodalGroup.children[0]);
    const lm = new THREE.LineBasicMaterial({ color:0x111318 });
    for (let i=0; i<state.exN-1; i++){
      const frac = zeros[i]/j;
      const pts = [];
      for (let a=0; a<=72; a++){
        const t = 2*Math.PI*a/72;
        pts.push(new THREE.Vector3(frac*Math.cos(t), 0.003, frac*Math.sin(t)));
      }
      nodalGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lm));
    }
    if (state.exM>0){
      for (let a=0; a<2*state.exM; a++){
        const t = (Math.PI/(2*state.exM)) + a*Math.PI/state.exM;
        nodalGroup.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0,0.003,0),
            new THREE.Vector3(Math.cos(t),0.003,Math.sin(t))
          ]), lm));
      }
    }
    nodalGroup.visible = PlaybackClock.state.viewMode==='explore';

    document.getElementById('info').innerHTML =
      `Mode <b>(m=${state.exM}, n=${state.exN})</b>: <b>${state.exM}</b> nodal diameter${state.exM===1?'':'s'}, ` +
      `<b>${state.exN}</b> nodal circle${state.exN===1?'':'s'}.<br>` +
      (state.exM===0 && state.exN===1
        ? `This is the fundamental.`
        : `Frequency: <b>${(j/j01).toFixed(3)}&times;</b> the fundamental.`);
  }

  return { state, exSpatial, computeExplore };
})();
