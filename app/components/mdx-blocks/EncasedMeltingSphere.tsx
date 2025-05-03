"use client";

import React, { useRef, useState, useEffect } from "react";
import P5Container from "../utils/P5Container";

export default function EncasedMeltingSphere() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const sketch = (p: any, parent: HTMLDivElement) => {
    const numTextures = 9;
    let textures: any[] = [];
    let currentIndex = 0;
    let nextIndex = 1;
    let lastSwitchTime = 0;
    const switchInterval = 3000;
    const alpha = 180;
    let canvas: any;

    p.preload = () => {
      for (let i = 0; i < numTextures; i++) {
        textures[i] = p.loadImage(`/photos/encased-melting/texture${i}.png`);
      }
    };

    p.setup = () => {
      p.frameRate(30);
      const size = Math.min(parent.clientWidth, parent.clientHeight);
      canvas = p.createCanvas(size, size, p.WEBGL);
      canvas.parent(parent);
      lastSwitchTime = p.millis();
    };

    p.windowResized = () => {
      const size = Math.min(parent.clientWidth, parent.clientHeight);
      p.resizeCanvas(size, size);
      if (p._renderer && p._renderer.isP3D) {
        p.camera(0, 0, (size * 3.33), 0, 0, 0, 0, 1, 0);
      }
    };

    p.draw = () => {
      p.noStroke();
      p.orbitControl();
      p.background(70);
      p.ambientLight(255);
      p.directionalLight(70, 0, 50, -0.5, 1, -4);

      const t = p.frameCount / (16 * 30);
      p.rotateY(p.TWO_PI * t);
      
      const baseScale = p.width / 600;
      p.scale(baseScale * p.map(p.sin(p.TWO_PI * t), -1, 1, 2.0, 2.5));

      const timeSinceSwitch = p.millis() - lastSwitchTime;
      const fade = p.constrain(timeSinceSwitch / 1000, 0, 1);

      if (textures[nextIndex]) {
        p.push();
        p.tint(255, alpha * (1 - fade));
        p.texture(textures[nextIndex]);
        p.specularMaterial(255);
        p.shininess(1);
        p.sphere(p.width / 2);
        p.pop();
      }

      if (textures[currentIndex]) {
        p.push();
        p.tint(255, alpha * fade);
        p.texture(textures[currentIndex]);
        p.specularMaterial(255);
        p.shininess(1);
        p.sphere(p.width / 2);
        p.pop();
      }

      if (timeSinceSwitch > switchInterval) {
        nextIndex = currentIndex;
        currentIndex = (currentIndex + 1) % numTextures;
        lastSwitchTime = p.millis();
      }
    };
  };

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="w-full aspect-square">
        {visible && <P5Container sketch={sketch} className="w-full h-full" />}
      </div>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 text-center italic">
        The orb responds to touch.
      </p>
    </div>
  );
}
