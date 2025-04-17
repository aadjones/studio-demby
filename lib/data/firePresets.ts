// presets/polygonPresets.ts
import { SketchPreset } from "@/app/components/surreal-systems/FirePlaygroundClient"; 

export const rustVeilPreset: SketchPreset = {
  blendMode: "BLEND",
  flowers: [
    {
      x: 260,
      y: 260,
      layers: 15,
      vertices: 3,
      maxRadius: 10,
      numPolygons: 1,
      hue: 20,
      deformOptions: {
        interpMin: 0.1,
        interpMax: 1.2,
        perturbationMin: 1,
        perturbationMax: 7,
        angleMin: -Math.PI / 16,
        angleMax: Math.PI / 8,
        scaleMin: -0.15,
        scaleMax: 0.15,
      },
    },
  ],
};

export const glacialStrikePreset: SketchPreset = {
  blendMode: "ADD",
  flowers: [
    {
      x: 240,
      y: 270,
      layers: 10,
      vertices: 3   ,
      maxRadius: 20,
      numPolygons: 1,
      hue: 190,
      deformOptions: {
        interpMin: 0.2,
        interpMax: 0.9,
        perturbationMin: 4,
        perturbationMax: 12,
        angleMin: -Math.PI / 4,
        angleMax: -Math.PI / 2,
        scaleMin: -1.5,
        scaleMax: 1.5,
      },
    },
  ],
};
