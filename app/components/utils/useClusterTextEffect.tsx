import { useRef, useCallback } from "react";
import React from "react";

interface ClusterTextEffect {
  ref: React.RefObject<HTMLDivElement | null>;
  className: string;
  onMouseEnter?: () => void;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function useClusterTextEffect(
  cluster: string,
  name: string,
  description: string
): ClusterTextEffect {
  const ref = useRef<HTMLDivElement>(null);

  // Always define the callback, but only use it for errant
  const errantHover = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("animated");
    el.style.setProperty("--x", `${(Math.random() - 0.5) * 12}px`);
    el.style.setProperty("--y", `${(Math.random() - 0.5) * 12}px`);
    el.style.setProperty("--r", `${(Math.random() - 0.5) * 6}deg`);
    setTimeout(() => el.classList.remove("animated"), 150);
  }, []);

  let className =
    "relative z-10 flex flex-col justify-center items-center h-full px-4 text-center";
  let onMouseEnter: (() => void) | undefined = undefined;
  let style: React.CSSProperties | undefined = undefined;
  let children: React.ReactNode = (
    <>
      <h3 className="text-2xl font-bold text-white drop-shadow mb-2">{name}</h3>
      <p className="text-white text-base drop-shadow max-w-[90%]">{description}</p>
    </>
  );

  if (cluster === "errant") {
    className += " errant-hover";
    onMouseEnter = errantHover;
    style = {
      ["--x" as any]: "0px",
      ["--y" as any]: "0px",
      ["--r" as any]: "0deg",
      transform:
        "translate(var(--x, 0px), var(--y, 0px)) rotate(var(--r, 0deg))",
    };
  } else if (cluster === "resonant") {
    className += " transition-transform duration-200 hover:scale-105 hover:text-blue-400";
  } else if (cluster === "fractured") {
    className += " fractured-hover group transition-all duration-150";
    children = (
      <span className="relative inline-flex flex-col items-center group-hover:text-red-600 transition-all duration-150">
        {/* Default state: whole word */}
        <span className="group-hover:opacity-0 transition-opacity duration-150">
          <h3 className="text-2xl font-bold text-white drop-shadow mb-2">{name}</h3>
        </span>
        {/* Hover state: Frac | tured */}
        <span className="absolute left-0 top-0 w-full flex flex-col items-center group-hover:opacity-100 opacity-0 transition-opacity duration-150">
          <span className="flex items-center gap-1 text-2xl font-bold text-white drop-shadow mb-2">
            <span>Frac</span>
            <span className="text-red-600">|</span>
            <span>tured</span>
          </span>
        </span>
        {/* Subtitle always below */}
        <span className="block mt-1">
          <span className="text-white text-base drop-shadow max-w-[90%]">{description}</span>
        </span>
      </span>
    );
  } else if (cluster === "enclosed") {
    className += " transition-all duration-200 hover:tracking-tighter hover:opacity-80";
    children = (
      <>
        <h3 className="text-2xl font-bold text-white drop-shadow mb-2">{name}</h3>
        <p className="text-white text-base drop-shadow max-w-[90%]">{description}</p>
      </>
    );
  }

  return { ref, className, onMouseEnter, style, children };
} 