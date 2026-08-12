"use strict";

/* ============================================================
   three.js scaffold
   ============================================================ */
const SceneRig = (function () {
  const { positions, colors, indices } = DiskMesh;

  const wrap = document.getElementById('canvasWrap');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x15181e);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ antialias:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  wrap.appendChild(renderer.domElement);

  function resize(){
    const s = wrap.clientWidth;
    renderer.setSize(s, s, false);
    camera.aspect = 1; camera.updateProjectionMatrix();
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const l1 = new THREE.DirectionalLight(0xffffff, 0.9); l1.position.set(2,3,2); scene.add(l1);
  const l2 = new THREE.DirectionalLight(0x88aaff, 0.3); l2.position.set(-2,1,-2); scene.add(l2);

  const rig = new THREE.Group(); scene.add(rig);

  const rimMesh = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.008, 8, 96),
    new THREE.MeshStandardMaterial({ color:0xe8e8e8, metalness:0.3, roughness:0.5 })
  );
  rimMesh.rotation.x = Math.PI/2;
  rig.add(rimMesh);

  const strikeMarker = new THREE.Mesh(
    new THREE.SphereGeometry(0.025, 16, 16),
    new THREE.MeshStandardMaterial({ color:0xffe066, emissive:0x554400 })
  );
  strikeMarker.visible = false;
  rig.add(strikeMarker);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions,3));
  geometry.setAttribute('color',    new THREE.BufferAttribute(colors,3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
    vertexColors:true, side:THREE.DoubleSide, roughness:0.55, metalness:0.05
  }));
  rig.add(mesh);

  const nodalGroup = new THREE.Group();
  rig.add(nodalGroup);

  function colorFor(v){
    v = Math.max(-1, Math.min(1, v));
    if (v >= 0) return [1, 1-v, 1-v];
    const a = -v; return [1-a, 1-a, 1];
  }

  return { wrap, scene, camera, renderer, rig, rimMesh, strikeMarker, geometry, mesh, nodalGroup, colorFor, resize };
})();
