"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { site, primaryCta } from "@/lib/site";

/**
 * The set piece: a live LiDAR room-scan as a rotating 3D point cloud, drawn on
 * a light page (deliberately NOT the rejected dark hacker-HUD register —
 * luminous, editorial, brand-blue). The cursor is a scanner: points near it
 * lift toward the camera and warm up, then settle back.
 *
 * Engineering notes:
 * - ~2.6k points: a dome (the room) + a floor disk, projected with a tiny
 *   hand-rolled perspective camera. No WebGL, no deps — one rAF loop.
 * - Colors are read from the live theme tokens at init (brand-blue ⇄ eye-warm
 *   ramp by depth); the warm scan color is brand mt-orange (graphics-only hue).
 * - IntersectionObserver pauses the loop offscreen; ResizeObserver re-fits;
 *   DPR is capped at 2.
 * - prefers-reduced-motion: one static frame, no rotation, no cursor physics.
 * - No-JS: the canvas stays empty over the .pointcloud-texture fallback, and
 *   all copy/CTAs are server-rendered regardless.
 */

type P = { x: number; y: number; z: number; lift: number };

function buildCloud(): P[] {
  const pts: P[] = [];
  // dome: latitude rings, denser near the horizon — reads as a scanned room
  for (let ring = 0; ring < 26; ring++) {
    const elev = (ring / 26) * (Math.PI / 2);
    const r = Math.cos(elev);
    const y = Math.sin(elev);
    const n = Math.max(8, Math.round(110 * r));
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + ring * 0.13;
      // jitter keeps it organic, like real returns
      const j = 1 + (Math.sin(ring * 7 + i * 13) * 0.012);
      pts.push({ x: Math.cos(a) * r * j, y: y * j, z: Math.sin(a) * r * j, lift: 0 });
    }
  }
  // floor disk
  for (let ring = 1; ring < 12; ring++) {
    const r = ring / 12;
    const n = Math.round(56 * r);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + ring * 0.41;
      pts.push({ x: Math.cos(a) * r, y: 0, z: Math.sin(a) * r, lift: 0 });
    }
  }
  return pts;
}

function cssColor(name: string, fallback: string): [number, number, number] {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  const m = v.match(/^#?([0-9a-f]{6})$/i);
  if (!m) return cssColor("", fallback);
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function PointCloudHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pts = buildCloud();
    const near = cssColor("--brand-blue", "#007bbb");
    const far = cssColor("--eye-warm", "#31b4e7");
    const warm: [number, number, number] = [240, 90, 40]; // brand mt-orange (graphics-only)

    let w = 0, h = 0, dpr = 1, raf = 0, running = false, t = reduced ? 1.2 : 0;
    const mouse = { x: -9999, y: -9999 };

    const fit = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = w * 0.62;
      const cy = h * 0.56;
      const scale = Math.min(w, h) * 0.7;
      const sinT = Math.sin(t), cosT = Math.cos(t);

      for (const p of pts) {
        // rotate around Y, tilt the camera slightly down
        const rx = p.x * cosT - p.z * sinT;
        const rz = p.x * sinT + p.z * cosT;
        const ry = p.y * 0.92 + rz * 0.18;
        const depth = rz + 1.9; // 0.9 (near) … 2.9 (far)
        const persp = 1.55 / depth;
        let sx = cx + rx * scale * persp;
        let sy = cy - (ry - 0.34) * scale * persp;

        // cursor-as-scanner: nearby points lift toward the camera and warm up
        if (!reduced) {
          const dx = sx - mouse.x, dy = sy - mouse.y;
          const d2 = dx * dx + dy * dy;
          const target = d2 < 16900 ? 1 - Math.sqrt(d2) / 130 : 0;
          p.lift += (target - p.lift) * 0.09;
          if (p.lift > 0.003) {
            sx += (dx / (Math.sqrt(d2) + 0.001)) * p.lift * 14;
            sy += (dy / (Math.sqrt(d2) + 0.001)) * p.lift * 14;
          }
        }

        // depth ramp near→far, overridden toward warm by lift
        const f = Math.min(1, Math.max(0, (depth - 0.9) / 2));
        const k = p.lift;
        const r = (near[0] + (far[0] - near[0]) * f) * (1 - k) + warm[0] * k;
        const g = (near[1] + (far[1] - near[1]) * f) * (1 - k) + warm[1] * k;
        const b = (near[2] + (far[2] - near[2]) * f) * (1 - k) + warm[2] * k;
        const alpha = (0.95 - f * 0.45) * (1 + k * 0.5);
        const size = (2.4 - f * 1.1) * (1 + k * 1.4);

        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${Math.min(1, alpha)})`;
        ctx.fillRect(sx, sy, size, size);
      }
    };

    const loop = () => {
      if (!running) return;
      t += 0.0016;
      frame();
      raf = requestAnimationFrame(loop);
    };

    fit();
    frame(); // always paint at least one frame (reduced-motion stops here)

    const ro = new ResizeObserver(() => { fit(); frame(); });
    ro.observe(canvas);

    const io = new IntersectionObserver(([e]) => {
      if (reduced) return;
      if (e.isIntersecting && !running) { running = true; raf = requestAnimationFrame(loop); }
      else if (!e.isIntersecting) { running = false; cancelAnimationFrame(raf); }
    }, { threshold: 0.05 });
    io.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section className="relative isolate overflow-hidden">
      {/* static dot texture so no-JS still reads as a point field */}
      <div aria-hidden className="pointcloud-texture absolute inset-0 -z-10 opacity-[0.18]" />
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 -z-10 h-full w-full touch-none"
      />

      <div className="mt-container flex min-h-[92svh] flex-col justify-center py-24">
        <p className="eyebrow">{site.distributor}</p>
        <h1 className="mt-5 max-w-3xl font-display text-display-xl font-bold text-text-strong">
          A million points of sight.
        </h1>
        <p className="mt-6 max-w-xl text-lead text-text-muted">
          Our VSS-50 alone paints 540,000 points every second. {site.oneLiner}
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Button href={primaryCta.trial.href} size="lg">
            {primaryCta.trial.label}
          </Button>
          <Button href="/full-stack-perception" variant="ghost" size="lg">
            How the stack fits
          </Button>
        </div>
        <p className="mt-14 font-mono text-anno-sm uppercase tracking-[0.16em] text-text-subtle">
          ◦ Move your cursor — you&apos;re the scanner
        </p>
      </div>
    </section>
  );
}
