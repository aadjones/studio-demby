export const $ = (s) => document.querySelector(s);
export const $$ = (s) => [...document.querySelectorAll(s)];
export const RM = !!(
  window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches
);

// Shared drawn-curve state — live binding, readable by all modules.
export let userShape = null;
export function setUserShape(ys) {
  userShape = Float64Array.from(ys);
  $$('.btn[data-p="yours"]').forEach((b) => (b.disabled = false));
}

// Per-chapter animation ticks and resize hooks.
export const tickFns = {};
const resizeHooks = {};
export function onResize(chIdx, fn) {
  (resizeHooks[chIdx] = resizeHooks[chIdx] || []).push(fn);
}

let current = 0;
export function show(i) {
  current = i;
  [...document.querySelectorAll('.chapter')].forEach((c, j) =>
    c.classList.toggle('on', j === i)
  );
  [...document.querySelectorAll('#chapButtons button')].forEach((b, j) =>
    b.classList.toggle('on', j === i)
  );
  window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
  (resizeHooks[i] || []).forEach((f) => f());
}

export function initNav() {
  const chapters = [...document.querySelectorAll('.chapter')];
  const navBox = document.querySelector('#chapButtons');

  chapters.forEach((ch, i) => {
    const b = document.createElement('button');
    b.appendChild(document.createTextNode(`${i + 1}`));
    const tspan = document.createElement('span');
    tspan.className = 't';
    tspan.textContent = ` · ${ch.dataset.title}`;
    b.appendChild(tspan);
    b.addEventListener('click', () => show(i));
    navBox.appendChild(b);

    const pg = document.createElement('div');
    pg.className = 'pager';
    const prev = document.createElement('button');
    const next = document.createElement('button');
    if (i > 0) {
      const lab = document.createElement('span');
      lab.className = 'lab';
      lab.textContent = '← Previous';
      prev.appendChild(lab);
      prev.appendChild(document.createTextNode(chapters[i - 1].dataset.title));
    } else prev.disabled = true;
    if (i < chapters.length - 1) {
      const lab = document.createElement('span');
      lab.className = 'lab';
      lab.textContent = 'Next →';
      next.appendChild(lab);
      next.appendChild(document.createTextNode(chapters[i + 1].dataset.title));
    } else next.disabled = true;
    next.className = 'next';
    prev.addEventListener('click', () => show(i - 1));
    next.addEventListener('click', () => show(i + 1));
    pg.append(prev, next);
    ch.appendChild(pg);
  });

  window.addEventListener('resize', () => {
    (resizeHooks[current] || []).forEach((f) => f());
  });

  let lastT = performance.now();
  function loop(t) {
    const dt = Math.min(0.05, (t - lastT) / 1000);
    lastT = t;
    if (tickFns[current]) tickFns[current](dt);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
