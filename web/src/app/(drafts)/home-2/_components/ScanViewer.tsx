"use client";

import { useEffect, useRef } from "react";
import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  DataTexture,
  DirectionalLight,
  Fog,
  HemisphereLight,
  LinearFilter,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";
import { ChevronsLeftRight } from "lucide-react";

/**
 * Draggable point-cloud viewer for the home-2 hero — renders the synthetic
 * warehouse-aisle scan from /scan/warehouse-aisle.bin (see scripts/generate-scan.mjs).
 *
 * Mounted ONLY under html.js + prefers-reduced-motion: no-preference (the
 * parent gates it); the RadarPanel SVG remains the SSR/no-JS/reduced-motion
 * state. Entrance = a radar-sweep reveal: points materialize ring by ring,
 * the way a real scan acquires. Then: slow idle orbit, drag to spin.
 */

const ASSET = "/scan/warehouse-aisle.bin";
const SCENE_ASSET = "/scan/warehouse-aisle.scene.json";
const TWO_PI = Math.PI * 2;

// reality-split: divider start position + realistic-side palette by box kind
const SPLIT_INIT = 0.42;
const SPLIT_MIN = 0.04, SPLIT_MAX = 0.96;
const REAL_SKY = 0xdfe6ec;
const KIND_COLORS: Record<string, number> = {
  steel: 0xd35c2a,        // powder-coated rack orange
  beam: 0xc94f1f,
  pallet: 0x8a6a48,       // wood
  load: 0xb5916b,         // cardboard
  forklift: 0xf2b705,     // safety yellow
  forkliftDark: 0x3a3f44, // mast/forks steel
  wall: 0xcfd6dc,         // corrugated panel
};

interface SceneSpec {
  floorY: number;
  floorBounds: { x: number; zMin: number; zMax: number };
  laneX: number;
  boxes: { min: [number, number, number]; max: [number, number, number]; kind: string; refl: number }[];
}

// === TUNE ME (the "feel") ====================================================
const ORBIT_TARGET = { x: 0, y: 0.4, z: 5.5 };  // scene point the camera circles
const RADIUS = 12.5;                            // home camera distance
const RADIUS_MIN = 5.5, RADIUS_MAX = 20;        // wheel-zoom clamps
const PITCH_INIT = 0.24, PITCH_MIN = 0.12, PITCH_MAX = 0.95; // rad above floor
const YAW_INIT = 3.3; // scouted live: AMR + field ring foreground, corridor vanishing beyond
const IDLE_SWAY = 0.22;                         // idle oscillation amplitude (rad)
const IDLE_RESUME_MS = 7000;                    // hands-off time before easing home
const SWEEP_DURATION = 2.6;                     // seconds for the reveal sweep
const POINT_SIZE = 1.35;
// =============================================================================

const VERT = /* glsl */ `
  attribute float aIntensity;
  attribute float aFlag;
  uniform float uSweep;
  uniform float uSize;
  uniform float uDpr;
  varying float vElev, vIntensity, vFlag, vGlow, vVis, vDim;

  void main() {
    float ang = atan(position.x, position.z);
    float a = ang < 0.0 ? ang + ${TWO_PI} : ang;
    vVis = step(a, uSweep);
    float behind = uSweep - a;
    // bright band trailing the sweep edge, only while the reveal runs
    vGlow = vVis * smoothstep(0.85, 0.0, behind) * (1.0 - step(7.0, uSweep));
    // elevation ramp position: floor (-0.8 m) → 0, rack tops (~3.8 m) → 1
    vElev = clamp((position.y + 0.8) / 4.6, 0.0, 1.0);
    vIntensity = aIntensity;
    vDim = 1.0 - clamp(length(position) / 38.0, 0.0, 0.3); // far returns fade
    vFlag = aFlag;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    // near-constant screen size with mild distance attenuation — the fine-grain
    // speckle look of real scan viewers (fat blobs read as fake)
    float att = clamp(9.0 / -mv.z, 0.6, 1.5);
    float sz = uSize * (aFlag > 0.5 ? 1.8 : 1.0);
    gl_PointSize = clamp(sz * uDpr * att, 1.0, 6.0);
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  uniform sampler2D uRamp;
  uniform vec3 uField;
  varying float vElev, vIntensity, vFlag, vGlow, vVis, vDim;

  void main() {
    if (vVis < 0.5) discard;
    vec2 c = gl_PointCoord - 0.5;
    if (dot(c, c) > 0.25) discard;
    // hue by elevation, brightness by return intensity — real scan-viewer look
    vec3 col = texture2D(uRamp, vec2(vElev, 0.5)).rgb * (0.3 + 0.95 * vIntensity) * vDim;
    if (vFlag > 0.5) col = uField;
    gl_FragColor = vec4(col + vGlow * 0.55, 1.0);
  }
`;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.trim().replace("#", "");
  const v = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

/** 256×1 ramp texture interpolated across the CSS pc-near…pc-far depth stops. */
function buildRampTexture(): { tex: DataTexture; field: [number, number, number] } {
  const css = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) => hexToRgb(css.getPropertyValue(name) || fallback);
  const stops = [
    read("--color-pc-near", "#ff2d55"),
    read("--color-pc-1", "#ff7a18"),
    read("--color-pc-2", "#ffd200"),
    read("--color-pc-3", "#39ff14"),
    read("--color-pc-4", "#00e5ff"),
    read("--color-pc-5", "#2e7dff"),
    read("--color-pc-far", "#7a3cff"),
  ];
  const data = new Uint8Array(256 * 4);
  for (let i = 0; i < 256; i++) {
    const t = (i / 255) * (stops.length - 1);
    const lo = Math.min(Math.floor(t), stops.length - 2);
    const f = t - lo;
    for (let ch = 0; ch < 3; ch++) {
      data[i * 4 + ch] = Math.round(stops[lo][ch] * (1 - f) + stops[lo + 1][ch] * f);
    }
    data[i * 4 + 3] = 255;
  }
  const tex = new DataTexture(data, 256, 1, RGBAFormat);
  tex.magFilter = tex.minFilter = LinearFilter;
  tex.needsUpdate = true;
  return { tex, field: read("--color-mt-yellow", "#ffcc00") };
}

export function ScanViewer({
  onReady,
  className,
  split = false,
}: {
  onReady?: () => void;
  className?: string;
  /** EXPERIMENT: realistic-render ⇄ scan divider over the same scene/camera */
  split?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef(SPLIT_INIT);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: "low-power" });
    } catch {
      return; // no WebGL → RadarPanel fallback simply stays
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.domElement.className = "h-full w-full cursor-grab select-none active:cursor-grabbing";
    renderer.domElement.style.touchAction = "pan-y"; // horizontal drag spins; vertical still scrolls
    renderer.domElement.style.userSelect = "none";
    host.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(50, 1, 0.1, 80);
    const { tex: ramp, field } = buildRampTexture();

    // ---- realistic twin of the scene (reality-split experiment) ----
    // Same geometry the rays were cast against, as lit solid meshes. One
    // camera renders both worlds; the divider decides where each shows.
    const sceneReal = new Scene();
    let realReady = false;
    const realDisposables: { dispose(): void }[] = [];
    if (split) {
      sceneReal.background = new Color(REAL_SKY);
      sceneReal.fog = new Fog(REAL_SKY, 18, 46);
      sceneReal.add(new HemisphereLight(0xf4f8ff, 0x8e949b, 1.15));
      const sun = new DirectionalLight(0xffffff, 1.6);
      sun.position.set(6, 12, -4);
      sceneReal.add(sun);

      fetch(SCENE_ASSET)
        .then((r) => {
          if (!r.ok) throw new Error(`scene spec ${r.status}`);
          return r.json() as Promise<SceneSpec>;
        })
        .then((spec) => {
          if (disposed) return;
          const unit = new BoxGeometry(1, 1, 1);
          realDisposables.push(unit);
          const mats = new Map<string, MeshLambertMaterial>();
          const matFor = (kind: string, refl: number) => {
            // cardboard loads vary slightly, keyed by reflectance bucket
            const key = kind === "load" ? `load${Math.round(refl * 10)}` : kind;
            let m = mats.get(key);
            if (!m) {
              m = new MeshLambertMaterial({ color: KIND_COLORS[kind] ?? 0x999999 });
              if (kind === "load") m.color.offsetHSL(0, 0, (refl - 0.55) * 0.35);
              mats.set(key, m);
              realDisposables.push(m);
            }
            return m;
          };
          for (const b of spec.boxes) {
            const mesh = new Mesh(unit, matFor(b.kind, b.refl));
            mesh.position.set(
              (b.min[0] + b.max[0]) / 2,
              (b.min[1] + b.max[1]) / 2,
              (b.min[2] + b.max[2]) / 2,
            );
            mesh.scale.set(
              Math.max(b.max[0] - b.min[0], 0.01),
              Math.max(b.max[1] - b.min[1], 0.01),
              Math.max(b.max[2] - b.min[2], 0.01),
            );
            sceneReal.add(mesh);
          }
          // concrete floor + painted lane lines (same positions the scan sees)
          const floorGeo = new PlaneGeometry(
            spec.floorBounds.x * 2,
            spec.floorBounds.zMax - spec.floorBounds.zMin,
          );
          const floorMat = new MeshLambertMaterial({ color: 0xb4b8bd });
          realDisposables.push(floorGeo, floorMat);
          const floor = new Mesh(floorGeo, floorMat);
          floor.rotation.x = -Math.PI / 2;
          floor.position.set(0, spec.floorY, (spec.floorBounds.zMin + spec.floorBounds.zMax) / 2);
          sceneReal.add(floor);
          const laneMat = new MeshLambertMaterial({ color: 0xe3b505 });
          realDisposables.push(laneMat);
          for (const sx of [-spec.laneX, spec.laneX]) {
            const lane = new Mesh(unit, laneMat);
            lane.position.set(sx, spec.floorY + 0.006, 7.65);
            lane.scale.set(0.14, 0.01, 16.3);
            sceneReal.add(lane);
          }
          realReady = true;
        })
        .catch(() => {/* spec failed → plain scan view keeps working */});
    }

    const material = new ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uSweep: { value: 0 },
        uSize: { value: POINT_SIZE },
        uDpr: { value: dpr },
        uRamp: { value: ramp },
        uField: { value: field.map((v) => v / 255) },
      },
      transparent: false,
      depthWrite: true,
    });

    const geometry = new BufferGeometry();
    let points: Points | null = null;
    let disposed = false;

    // ---- load + decode the packed scan ----
    fetch(ASSET)
      .then((r) => {
        if (!r.ok) throw new Error(`scan asset ${r.status}`);
        return r.arrayBuffer();
      })
      .then((ab) => {
        if (disposed) return;
        const i16 = new Int16Array(ab);
        const u8 = new Uint8Array(ab);
        const n = ab.byteLength / 8;
        const pos = new Float32Array(n * 3);
        const intensity = new Float32Array(n);
        const flag = new Float32Array(n);
        for (let i = 0; i < n; i++) {
          pos[i * 3] = i16[i * 4] / 512;
          pos[i * 3 + 1] = i16[i * 4 + 1] / 512;
          pos[i * 3 + 2] = i16[i * 4 + 2] / 512;
          intensity[i] = u8[i * 8 + 6] / 255;
          flag[i] = u8[i * 8 + 7];
        }
        geometry.setAttribute("position", new BufferAttribute(pos, 3));
        geometry.setAttribute("aIntensity", new BufferAttribute(intensity, 1));
        geometry.setAttribute("aFlag", new BufferAttribute(flag, 1));
        points = new Points(geometry, material);
        points.frustumCulled = false;
        scene.add(points);
        sweepStart = performance.now();
        onReadyRef.current?.();
      })
      .catch(() => {/* asset failed → fallback stays visible */});

    // ---- orbit state: drag writes targets, camera eases toward them ----
    let yaw = YAW_INIT, yawTarget = YAW_INIT;
    let pitch = PITCH_INIT, pitchTarget = PITCH_INIT;
    let radius = RADIUS, radiusTarget = RADIUS;
    let yawVel = 0;
    let dragging = false;
    let lastX = 0, lastY = 0;
    let lastDragAt = performance.now(); // hold the hero angle through the entrance
    let sweepStart = 0;

    const placeCamera = () => {
      const cp = Math.cos(pitch), sp = Math.sin(pitch);
      camera.position.set(
        ORBIT_TARGET.x + radius * Math.sin(yaw) * cp,
        ORBIT_TARGET.y + radius * sp,
        ORBIT_TARGET.z + radius * Math.cos(yaw) * cp,
      );
      camera.lookAt(ORBIT_TARGET.x, ORBIT_TARGET.y, ORBIT_TARGET.z);
      if (process.env.NODE_ENV !== "production") {
        host.dataset.cam = `yaw=${yaw.toFixed(3)} pitch=${pitch.toFixed(3)} r=${radius.toFixed(2)}`;
      }
    };
    if (process.env.NODE_ENV !== "production") {
      // dev-only tuning hook: __scanView(yaw, pitch) jumps the camera there
      (host as HTMLDivElement & { __scanView?: (y: number, p: number) => void }).__scanView =
        (y: number, p: number) => {
          yawTarget = y;
          pitchTarget = p;
          lastDragAt = performance.now() + 1e9; // suspend idle return while tuning
        };
    }

    const el = renderer.domElement;
    const onDown = (e: PointerEvent) => {
      e.preventDefault(); // a real drag must never start a text selection
      dragging = true;
      yawVel = 0; // grabbing the cloud stops any coast — no surprise resume
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      yawTarget -= dx * 0.0035;
      // release momentum: clamped so a fast flick coasts ~15°, never a full spin
      yawVel = Math.max(-0.045, Math.min(0.045, -dx * 0.002));
      pitchTarget = Math.min(PITCH_MAX, Math.max(PITCH_MIN, pitchTarget + dy * 0.002));
      lastDragAt = performance.now();
    };
    const onUp = () => {
      dragging = false;
      lastDragAt = performance.now();
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault(); // wheel over the scan zooms it — page scroll stays outside the panel
      radiusTarget = Math.min(
        RADIUS_MAX,
        Math.max(RADIUS_MIN, radiusTarget * Math.exp(e.deltaY * 0.0011)),
      );
      lastDragAt = performance.now(); // zooming counts as interacting
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("wheel", onWheel, { passive: false });

    // ---- divider handle drag (reality-split) ----
    const handle = handleRef.current;
    let splitDragging = false;
    const applySplit = () => {
      if (handle) handle.style.left = `${splitRef.current * 100}%`;
    };
    const onSplitDown = (e: PointerEvent) => {
      if (!e.isPrimary || (e.pointerType === "mouse" && e.button !== 0)) return;
      e.preventDefault();
      e.stopPropagation(); // the divider is not an orbit drag
      splitDragging = true;
      handle?.setPointerCapture(e.pointerId);
    };
    const onSplitMove = (e: PointerEvent) => {
      if (!splitDragging || (e.pointerType === "mouse" && !(e.buttons & 1))) return;
      const r = host.getBoundingClientRect();
      splitRef.current = Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, (e.clientX - r.left) / r.width));
      applySplit();
    };
    const onSplitUp = () => { splitDragging = false; };
    if (handle) {
      applySplit();
      handle.addEventListener("pointerdown", onSplitDown);
      handle.addEventListener("pointermove", onSplitMove);
      handle.addEventListener("pointerup", onSplitUp);
      handle.addEventListener("pointercancel", onSplitUp);
    }

    // ---- render loop (paused while offscreen / tab hidden) ----
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    io.observe(host);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;

      if (points && sweepStart) {
        const t = (now - sweepStart) / 1000 / SWEEP_DURATION;
        material.uniforms.uSweep.value =
          t >= 1 ? 10 : TWO_PI * (1 - Math.pow(1 - t, 2.2)) + 0.9; // ease-out, +0.9 glow lead
      }
      if (!dragging) {
        yawTarget += yawVel; // release momentum
        yawVel *= 0.86;      // short tail — long flings feel unanchored
        const idleFor = now - lastDragAt;
        if (idleFor > IDLE_RESUME_MS) {
          // ease back to a gently swaying home view — always composed,
          // never strands on an awkward angle, never stops feeling alive
          const home = YAW_INIT + IDLE_SWAY * Math.sin((idleFor - IDLE_RESUME_MS) / 4200);
          const dYaw = ((home - yawTarget + Math.PI) % TWO_PI + TWO_PI) % TWO_PI - Math.PI;
          yawTarget += dYaw * 0.012;
          pitchTarget += (PITCH_INIT - pitchTarget) * 0.012;
          radiusTarget += (RADIUS - radiusTarget) * 0.012;
        }
      }
      // critically-damped feel: camera chases the targets
      yaw += (yawTarget - yaw) * 0.14;
      pitch += (pitchTarget - pitch) * 0.14;
      radius += (radiusTarget - radius) * 0.14;
      placeCamera();
      if (split && realReady) {
        // one camera, two worlds: realistic render left of the divider,
        // the point cloud right of it (scissor split, CSS px — three scales by DPR)
        const sw = Math.round(viewW * splitRef.current);
        renderer.setScissorTest(true);
        renderer.setScissor(0, 0, sw, viewH);
        renderer.render(sceneReal, camera);
        renderer.setScissor(sw, 0, viewW - sw, viewH);
        renderer.render(scene, camera);
        renderer.setScissorTest(false);
      } else {
        renderer.render(scene, camera);
      }
    };

    let viewW = 0, viewH = 0;
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      if (!w || !h) return;
      viewW = w;
      viewH = h;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();
    placeCamera();
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("wheel", onWheel);
      if (handle) {
        handle.removeEventListener("pointerdown", onSplitDown);
        handle.removeEventListener("pointermove", onSplitMove);
        handle.removeEventListener("pointerup", onSplitUp);
        handle.removeEventListener("pointercancel", onSplitUp);
      }
      geometry.dispose();
      material.dispose();
      ramp.dispose();
      for (const d of realDisposables) d.dispose();
      renderer.dispose();
      el.remove();
    };
  }, [split]);

  return (
    <div ref={hostRef} className={className} aria-hidden>
      {split && (
        <div
          ref={handleRef}
          className="absolute inset-y-0 z-10 w-px cursor-ew-resize select-none bg-accent/90"
          style={{ left: `${SPLIT_INIT * 100}%`, touchAction: "none" }}
        >
          {/* invisible widened hit strip — a 1px line is unggrabbable */}
          <span className="absolute inset-y-0 -left-3 -right-3" />
          <span className="absolute left-1/2 top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-accent bg-mt-navy-900/90 text-accent shadow-[0_0_18px_rgba(255,204,0,0.35)]">
            <ChevronsLeftRight className="size-5" />
          </span>
          <span className="absolute bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
            ← the site · the scan →
          </span>
        </div>
      )}
    </div>
  );
}
