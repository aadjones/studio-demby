import { SynthParams } from '../config/defaultParams';
import { debounce } from '../utils/debounce';

export const createSketch = (
  paramsRef: React.MutableRefObject<Record<keyof SynthParams, React.MutableRefObject<number>>>
) => (p: any, parent: HTMLDivElement) => {
  let myShader: any;
  let canvas: any;
  
  p.preload = () => {
    if (!myShader) {
      myShader = p.loadShader(
        "/sketches/spatial-synthesizer/shader.vert",
        "/sketches/spatial-synthesizer/fm.frag"
      );
    }
  };

  p.setup = () => {
    canvas = p.createCanvas(parent.clientWidth, parent.clientWidth, p.WEBGL);
    canvas.parent(parent);
  };

  p.windowResized = debounce(() => {
    if (canvas) {
      p.resizeCanvas(parent.clientWidth, parent.clientWidth);
    }
  }, 250);

  p.draw = () => {
    if (!myShader || !canvas) return;
    p.shader(myShader);

    const uniforms: Record<string, number | number[]> = {
      u_resolution: [p.width, p.height],
      u_time: p.millis() / 1000,
    };

    for (const [key, valRef] of Object.entries(paramsRef.current)) {
      if (key === "modulationCenterX" || key === "modulationCenterY") continue;
      uniforms[`u_${key}`] = valRef.current;
    }
    uniforms.u_modulationCenter = [
      paramsRef.current.modulationCenterX.current * 2.0,
      paramsRef.current.modulationCenterY.current * 2.0,
    ];

    for (const [key, value] of Object.entries(uniforms)) {
      myShader.setUniform(key, value);
    }
    p.rect(-p.width / 2, -p.height / 2, p.width, p.height);
  };
}; 