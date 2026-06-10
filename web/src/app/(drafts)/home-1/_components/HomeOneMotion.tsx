"use client";

import { useEffect } from "react";

/* The only client code on home-1. One IntersectionObserver drives every
   animation: it adds `is-visible` once per element ([data-draw] rules,
   the [data-fig01] plot) and runs the count-up on [data-count] figures.
   CSS does all actual animation. SSR markup is the final state, so no-JS,
   crawlers, and reduced-motion users always see the finished document. */

function startCount(el: HTMLElement) {
  const target = Number(el.dataset.count);
  if (!Number.isFinite(target)) return;
  const prefix = el.dataset.prefix ?? "";
  const suffix = el.dataset.suffix ?? "";
  const duration = 900;
  const t0 = performance.now();
  const tick = (t: number) => {
    const p = Math.min(1, (t - t0) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.round(target * eased).toLocaleString("en-US") + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function HomeOneMotion() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-draw], [data-fig01], [data-count]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // CSS overrides force final states; counts keep their SSR final values.
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-visible");
          if (e.target instanceof HTMLElement && e.target.dataset.count) startCount(e.target);
          io.unobserve(e.target);
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
