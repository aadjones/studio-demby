let pending: Promise<any> | null = null;

/**
 * Loads /p5.min.js on first use and resolves with the p5 constructor.
 *
 * p5 is ~240 KB compressed, so it is fetched only by pages that actually draw
 * a sketch rather than from the root layout. Safe to call from many components:
 * the script is injected once.
 */
export function loadP5(): Promise<any> {
  const w = window as any;
  if (w.p5) return Promise.resolve(w.p5);

  pending ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "/p5.min.js";
    script.async = true;
    script.onload = () => resolve(w.p5);
    script.onerror = () => {
      pending = null;
      script.remove();
      reject(new Error("Failed to load /p5.min.js"));
    };
    document.head.appendChild(script);
  });
  return pending;
}
