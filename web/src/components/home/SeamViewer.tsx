"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
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
  Vector3,
  WebGLRenderer,
} from "three";

/**
 * SeamViewer — the home hero's signature instrument ("The Seam").
 *
 * One warehouse aisle, one PerspectiveCamera, the SAME geometry rendered two
 * ways across a divider the visitor controls: lit Lambert reality left of the
 * line, the 470k-point OLEI scan right of it. The GS1-5 protective field is
 * flag=1 points that exist ONLY in the cloud — drag toward reality and the
 * yellow arc is literally scissored away. That is the 2D-vs-3D resolution:
 * one human-sight half, one machine-sight half.
 *
 * Proven core (decode ÷512 / 8-byte stride, angular acquisition sweep, scissor
 * split, full dispose teardown) is carried verbatim from the home-2 ScanViewer.
 * New here: a self-nudging seam (the reveal motion IS the drag affordance), a
 * keyboard-accessible role="slider" divider, a live world→screen projection
 * hook for the DOM dimension overlays, a SHORT re-entry replay (no remount),
 * and mobile CAMERA/LiDAR driving via setSplitTarget(0|1).
 *
 * Mounted ONLY under html.js + prefers-reduced-motion: no-preference (the
 * parent gates it); the EyeMark poster is the SSR / no-JS / reduced-motion
 * state.
 */

const ASSET = "/scan/warehouse-aisle.bin";
const SCENE_ASSET = "/scan/warehouse-aisle.scene.json";
const TWO_PI = Math.PI * 2;

// seam: rest slightly scan-dominant so the machine's view (and the GS1-5 field +
// its measurement) lead — "these guys do LiDAR" — with reality as the reference.
// On entry the divider sweeps once (INIT → PEAK → REST) so you see it move.
const SPLIT_INIT = 0.4;
const SPLIT_REST = 0.4;
const SPLIT_PEAK = 0.58;
const SPLIT_MIN = 0.06, SPLIT_MAX = 0.94;
const NUDGE_MS = 1700; // one deliberate seam sweep across the forklift
const KEY_STEP = 0.04; // arrow-key divider nudge

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

/** Imperative handle the parent uses to glue DOM overlays + drive the seam. */
export interface SeamApi {
  /** Project a scene-space point to host-local CSS px. */
  project: (x: number, y: number, z: number) => { x: number; y: number; visible: boolean };
  /** Current divider position, 0–1 (fraction of host width). */
  getSplit: () => number;
  /** Host width in CSS px (cached — avoids a per-frame layout read in the parent). */
  getViewW: () => number;
  /** Is the hero on screen? (the viewer freezes its camera when false). */
  isActive: () => boolean;
  /** Lerp the divider toward a goal (mobile CAMERA/LiDAR pill). */
  setSplitTarget: (v: number) => void;
  /** SHORT re-entry replay: reset to entry pose + re-sweep the seam. No remount. */
  replayIntro: () => void;
}

// === TUNE ME (the "feel") ====================================================
const ORBIT_TARGET = { x: 0, y: 0.4, z: 5.5 };  // scene point the camera circles
const RADIUS = 12.5;                            // home camera distance
const PITCH_INIT = 0.24, PITCH_MIN = 0.12, PITCH_MAX = 0.95; // rad above floor
const YAW_INIT = 3.3; // scouted live: AMR + field ring foreground, corridor vanishing beyond
const IDLE_SWAY = 0.22;                         // idle oscillation amplitude (rad)
const IDLE_RESUME_MS = 7000;                    // hands-off time before easing home
const SWEEP_DURATION = 2.6;                     // seconds for the acquisition sweep
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

/** seam nudge curve: SPLIT_INIT → overshoot SPLIT_PEAK → settle SPLIT_REST, one motion. */
function nudgePosition(t: number): number {
  // t in [0,1]; smoothstep up to the peak, then smoothstep down to rest
  const up = Math.min(t / 0.42, 1);
  const down = Math.max((t - 0.42) / 0.58, 0);
  const ease = (x: number) => x * x * (3 - 2 * x);
  const peak = SPLIT_INIT + (SPLIT_PEAK - SPLIT_INIT) * ease(up);
  return peak + (SPLIT_REST - SPLIT_PEAK) * ease(down);
}

export function SeamViewer({
  onReady,
  className,
  api,
}: {
  onReady?: () => void;
  className?: string;
  /** populated with the imperative handle for the duration of the mount */
  api?: MutableRefObject<SeamApi | null>;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const apiRef = useRef(api);
  apiRef.current = api;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: "low-power" });
    } catch {
      return; // no WebGL → EyeMark poster simply stays
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    renderer.setPixelRatio(dpr);
    renderer.domElement.className = "h-full w-full cursor-grab select-none active:cursor-grabbing";
    renderer.domElement.style.touchAction = "pan-y"; // horizontal drag orbits; vertical still scrolls the page
    renderer.domElement.style.userSelect = "none";
    renderer.domElement.setAttribute("aria-hidden", "true"); // the canvas is decorative; the slider is not
    renderer.domElement.tabIndex = -1;
    host.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(50, 1, 0.1, 80);
    const { tex: ramp, field } = buildRampTexture();

    // ---- realistic twin of the scene: same geometry as lit solid meshes ----
    // One camera renders both worlds; the divider decides where each shows.
    // Light pass: hemisphere ambient + a warm key + a cool fill so the room
    // reads as a believable space rather than flat grey-box previz.
    const sceneReal = new Scene();
    let realReady = false;
    const realDisposables: { dispose(): void }[] = [];
    sceneReal.background = new Color(REAL_SKY);
    sceneReal.fog = new Fog(REAL_SKY, 18, 46);
    sceneReal.add(new HemisphereLight(0xf4f8ff, 0x8e949b, 1.05));
    const key = new DirectionalLight(0xfff4e2, 1.5);
    key.position.set(6, 12, -4);
    sceneReal.add(key);
    const fill = new DirectionalLight(0xcfe0ff, 0.45); // cool counter-fill softens the box faces
    fill.position.set(-7, 6, 9);
    sceneReal.add(fill);

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
          const matKey = kind === "load" ? `load${Math.round(refl * 10)}` : kind;
          let m = mats.get(matKey);
          if (!m) {
            m = new MeshLambertMaterial({ color: KIND_COLORS[kind] ?? 0x999999 });
            if (kind === "load") m.color.offsetHSL(0, 0, (refl - 0.55) * 0.35);
            mats.set(matKey, m);
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
        const floorMat = new MeshLambertMaterial({ color: 0xb7bbc0 });
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
    // On coarse pointers (touch) we decimate flag=0 scene returns by half for
    // perf, but NEVER the flag=1 field arc — the safety overlay stays intact.
    fetch(ASSET)
      .then((r) => {
        if (!r.ok) throw new Error(`scan asset ${r.status}`);
        return r.arrayBuffer();
      })
      .then((ab) => {
        if (disposed) return;
        const i16 = new Int16Array(ab);
        const u8 = new Uint8Array(ab);
        const total = ab.byteLength / 8;
        // single decode pass, sized to the max; a write cursor compacts in place
        // when coarse-pointer decimation drops scene points (never field points).
        const pos = new Float32Array(total * 3);
        const intensity = new Float32Array(total);
        const flag = new Float32Array(total);
        let n = 0;
        for (let i = 0; i < total; i++) {
          const fl = u8[i * 8 + 7];
          if (coarse && fl === 0 && (i & 1)) continue; // drop every other scene point on touch
          pos[n * 3] = i16[i * 4] / 512;
          pos[n * 3 + 1] = i16[i * 4 + 1] / 512;
          pos[n * 3 + 2] = i16[i * 4 + 2] / 512;
          intensity[n] = u8[i * 8 + 6] / 255;
          flag[n] = fl;
          n++;
        }
        const trim = (a: Float32Array, len: number) => (n === total ? a : a.subarray(0, len));
        geometry.setAttribute("position", new BufferAttribute(trim(pos, n * 3), 3));
        geometry.setAttribute("aIntensity", new BufferAttribute(trim(intensity, n), 1));
        geometry.setAttribute("aFlag", new BufferAttribute(trim(flag, n), 1));
        points = new Points(geometry, material);
        points.frustumCulled = false;
        scene.add(points);
        sweepStart = performance.now();
        onReadyRef.current?.();
      })
      .catch(() => {/* asset failed → poster stays visible */});

    // ---- orbit state: drag writes targets, camera eases toward them ----
    let yaw = YAW_INIT, yawTarget = YAW_INIT;
    let pitch = PITCH_INIT, pitchTarget = PITCH_INIT;
    let radius = RADIUS, radiusTarget = RADIUS;
    let yawVel = 0;
    let dragging = false;
    let lastX = 0, lastY = 0;
    let lastDragAt = performance.now(); // hold the hero angle through the entrance
    let sweepStart = 0;

    // ---- seam state ----
    let split = SPLIT_INIT, splitTarget = SPLIT_REST;
    let splitDragging = false;
    let userTookOver = false;        // any deliberate seam input cancels auto motion
    let nudgeStart = 0;              // >0 while the entry sweep runs
    let nudgeArmed = false;          // becomes true once the acquisition sweep finishes

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
      (host as HTMLDivElement & { __scanView?: (y: number, p: number) => void }).__scanView =
        (y: number, p: number) => {
          yawTarget = y;
          pitchTarget = p;
          lastDragAt = performance.now() + 1e9; // suspend idle return while tuning
        };
    }

    // ---- imperative handle for the parent (DOM overlays + mobile driving) ----
    const projV = new Vector3();
    const armNudge = () => {
      if (userTookOver) return;
      split = SPLIT_INIT;
      splitTarget = SPLIT_REST;
      nudgeStart = performance.now();
      if (!dragging && !splitDragging) {
        lastDragAt = performance.now(); // freeze idle sway: only the seam moves
        yawVel = 0; // …but never clobber a flick the user is mid-way through
      }
    };
    if (apiRef.current) {
      apiRef.current.current = {
        project: (x, y, z) => {
          projV.set(x, y, z).project(camera);
          return {
            x: (projV.x * 0.5 + 0.5) * viewW,
            y: (-projV.y * 0.5 + 0.5) * viewH,
            visible: projV.z < 1,
          };
        },
        getSplit: () => split,
        getViewW: () => viewW,
        isActive: () => visible,
        setSplitTarget: (v) => {
          userTookOver = true;
          nudgeStart = 0;
          splitTarget = Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, v));
        },
        replayIntro: () => {
          // SHORT re-entry: reset the seam + re-sweep it. No eye blink, no
          // re-acquisition, no remount — just the affordance, once more.
          userTookOver = false;
          armNudge();
        },
      };
    }

    const el = renderer.domElement;
    const onDown = (e: PointerEvent) => {
      e.preventDefault(); // a real drag must never start a text selection
      dragging = true;
      yawVel = 0;
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
      yawVel = Math.max(-0.045, Math.min(0.045, -dx * 0.002));
      pitchTarget = Math.min(PITCH_MAX, Math.max(PITCH_MIN, pitchTarget + dy * 0.002));
      lastDragAt = performance.now();
    };
    const onUp = () => {
      dragging = false;
      lastDragAt = performance.now();
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    // ---- divider handle: drag + keyboard (role="slider") ----
    const handle = handleRef.current;
    const applySplit = () => {
      if (!handle) return;
      handle.style.left = `${split * 100}%`;
      handle.setAttribute("aria-valuenow", String(Math.round(split * 100)));
    };
    const takeSeam = () => {
      userTookOver = true;
      nudgeStart = 0;
    };
    const onSplitDown = (e: PointerEvent) => {
      if (!e.isPrimary || (e.pointerType === "mouse" && e.button !== 0)) return;
      e.preventDefault();
      e.stopPropagation(); // the divider is not an orbit drag
      splitDragging = true;
      takeSeam();
      handle?.setPointerCapture(e.pointerId);
    };
    const onSplitMove = (e: PointerEvent) => {
      if (!splitDragging || (e.pointerType === "mouse" && !(e.buttons & 1))) return;
      const r = host.getBoundingClientRect();
      split = Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, (e.clientX - r.left) / r.width));
      splitTarget = split;
      applySplit();
    };
    const onSplitUp = () => { splitDragging = false; };
    const onSplitKey = (e: KeyboardEvent) => {
      const dir = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0;
      if (!dir) return;
      e.preventDefault();
      takeSeam();
      splitTarget = Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, splitTarget + dir * KEY_STEP));
    };
    if (handle) {
      applySplit();
      handle.addEventListener("pointerdown", onSplitDown);
      handle.addEventListener("pointermove", onSplitMove);
      handle.addEventListener("pointerup", onSplitUp);
      handle.addEventListener("pointercancel", onSplitUp);
      handle.addEventListener("keydown", onSplitKey);
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
        if (t >= 1 && !nudgeArmed) { nudgeArmed = true; armNudge(); } // seam wakes after acquisition
      }

      // seam: scripted nudge on entry, else ease toward the target
      if (nudgeStart) {
        const nt = (now - nudgeStart) / NUDGE_MS;
        if (nt >= 1) { nudgeStart = 0; split = SPLIT_REST; }
        else { split = nudgePosition(nt); lastDragAt = now; } // hold camera still during the sweep
        applySplit();
      } else if (!splitDragging) {
        const ds = splitTarget - split;
        if (Math.abs(ds) > 0.0005) { split += ds * 0.14; applySplit(); }
      }

      if (!dragging) {
        yawTarget += yawVel;
        yawVel *= 0.86;
        const idleFor = now - lastDragAt;
        if (idleFor > IDLE_RESUME_MS) {
          const home = YAW_INIT + IDLE_SWAY * Math.sin((idleFor - IDLE_RESUME_MS) / 4200);
          const dYaw = ((home - yawTarget + Math.PI) % TWO_PI + TWO_PI) % TWO_PI - Math.PI;
          yawTarget += dYaw * 0.012;
          pitchTarget += (PITCH_INIT - pitchTarget) * 0.012;
          radiusTarget += (RADIUS - radiusTarget) * 0.012;
        }
      }
      yaw += (yawTarget - yaw) * 0.14;
      pitch += (pitchTarget - pitch) * 0.14;
      radius += (radiusTarget - radius) * 0.14;
      placeCamera();

      if (realReady) {
        // one camera, two worlds: realistic render left of the divider, the
        // point cloud right of it (scissor split in CSS px — three scales by DPR)
        const sw = Math.round(viewW * split);
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
      if (apiRef.current) apiRef.current.current = null;
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      if (handle) {
        handle.removeEventListener("pointerdown", onSplitDown);
        handle.removeEventListener("pointermove", onSplitMove);
        handle.removeEventListener("pointerup", onSplitUp);
        handle.removeEventListener("pointercancel", onSplitUp);
        handle.removeEventListener("keydown", onSplitKey);
      }
      geometry.dispose();
      material.dispose();
      ramp.dispose();
      for (const d of realDisposables) d.dispose();
      renderer.dispose();
      el.remove();
    };
  }, []);

  return (
    <div ref={hostRef} className={className}>
      {/* the seam — a keyboard-accessible divider, not a gallery slider */}
      <div
        ref={handleRef}
        role="slider"
        tabIndex={0}
        aria-label="Reveal the LiDAR scan. Left: the aisle as you see it. Right: the same aisle as the sensor sees it."
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(SPLIT_INIT * 100)}
        className="group absolute inset-y-0 z-10 hidden w-px cursor-ew-resize select-none bg-accent/90 outline-none md:block"
        style={{ left: `${SPLIT_INIT * 100}%`, touchAction: "none" }}
      >
        {/* widened hit/focus strip — a 1px line is ungrabbable + unfocusable */}
        <span className="absolute inset-y-0 -left-4 -right-4 rounded-sm group-focus-visible:bg-accent/10" />
        {/* conversion-edge glow: reality becoming data, just inside the scan side */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-20"
          style={{ background: "linear-gradient(90deg, color-mix(in oklab, var(--accent) 30%, transparent), transparent)" }}
        />
        {/* grab knob */}
        <span className="absolute left-1/2 top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-accent bg-mt-navy-900/90 text-accent shadow-[0_0_18px_rgba(255,204,0,0.35)] transition-transform duration-150 group-hover:scale-110 group-focus-visible:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-accent group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-mt-navy-900">
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m9 7-5 5 5 5" />
            <path d="m15 7 5 5-5 5" />
          </svg>
        </span>
      </div>
    </div>
  );
}
