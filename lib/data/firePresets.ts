// presets/polygonPresets.ts
import { SketchPreset } from "@/app/components/surreal-systems/FirePlayground"; 

export const rustVeilPreset: SketchPreset = {
  blendMode: "SCREEN",
  flowers: [
    {
      x: 260,
      y: 260,
      layers: 6,
      vertices: 7,
      maxRadius: 30,
      numPolygons: 3,
      hue: 20,
      deformOptions: {
        interpMin: 0.3,
        interpMax: 0.6,
        perturbationMin: 6,
        perturbationMax: 18,
        angleMin: -Math.PI / 16,
        angleMax: Math.PI / 16,
        scaleMin: -0.15,
        scaleMax: 0.15,
      },
    },
  ],
};

export const glacialBloomPreset: SketchPreset = {
  blendMode: "ADD",
  flowers: [
    {
      x: 240,
      y: 270,
      layers: 8,
      vertices: 6,
      maxRadius: 20,
      numPolygons: 4,
      hue: 190,
      deformOptions: {
        interpMin: 0.2,
        interpMax: 0.5,
        perturbationMin: 4,
        perturbationMax: 12,
        angleMin: -Math.PI / 20,
        angleMax: Math.PI / 20,
        scaleMin: -0.1,
        scaleMax: 0.1,
      },
    },
  ],
};
