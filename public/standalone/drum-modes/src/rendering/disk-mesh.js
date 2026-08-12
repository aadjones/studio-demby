"use strict";

/* ============================================================
   Disk mesh + quadrature
   ============================================================ */
const DiskMesh = (function () {
  const RINGS = Constants.RINGS, SEGMENTS = Constants.SEGMENTS;

  const vertCount = 1 + RINGS*SEGMENTS;
  const positions = new Float32Array(vertCount*3);
  const colors    = new Float32Array(vertCount*3);
  const rArr      = new Float32Array(vertCount);
  const thArr     = new Float32Array(vertCount);
  const wArr      = new Float32Array(vertCount);
  const xArr      = new Float32Array(vertCount);
  const yArr      = new Float32Array(vertCount);

  {
    const dr = 1/RINGS, dth = 2*Math.PI/SEGMENTS;
    rArr[0]=0; thArr[0]=0; wArr[0]=Math.PI*(dr/2)*(dr/2);
    for (let i=1;i<=RINGS;i++){
      for (let j=0;j<SEGMENTS;j++){
        const idx = 1+(i-1)*SEGMENTS+j;
        rArr[idx] = i/RINGS;
        thArr[idx] = 2*Math.PI*j/SEGMENTS;
        // the outermost ring sits ON the boundary, so its cell is only half
        // inside the disk — full weight overstates the area by ~3%
        wArr[idx] = (i/RINGS)*dr*dth*((i===RINGS)?0.5:1);
      }
    }
    for (let v=0; v<vertCount; v++){
      xArr[v] = rArr[v]*Math.cos(thArr[v]);
      yArr[v] = rArr[v]*Math.sin(thArr[v]);
      positions[v*3] = xArr[v]; positions[v*3+1] = 0; positions[v*3+2] = yArr[v];
    }
  }

  const indices = [];
  for (let j=0;j<SEGMENTS;j++) indices.push(0, 1+j, 1+((j+1)%SEGMENTS));
  for (let i=1;i<RINGS;i++){
    for (let j=0;j<SEGMENTS;j++){
      const rb = 1+(i-1)*SEGMENTS, nb = 1+i*SEGMENTS;
      const a=rb+j, b=rb+(j+1)%SEGMENTS, c=nb+j, d=nb+(j+1)%SEGMENTS;
      indices.push(a,c,d, a,d,b);
    }
  }

  return { vertCount, positions, colors, rArr, thArr, wArr, xArr, yArr, indices };
})();
