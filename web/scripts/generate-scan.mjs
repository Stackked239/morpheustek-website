/**
 * generate-scan.mjs — synthesizes the home-2 hero point cloud.
 *
 * Simulates an accumulated LR-16F-100 sweep (360° × 30° FOV) from a sensor
 * mast on an AMR parked in a warehouse aisle, plus the GS1-5's 270° / 5 m
 * protective-field boundary on the floor. Every ray is cast against the scene;
 * points exist only where a surface returns the beam — so occlusion shadows,
 * floor rings, and range noise come out the way a real scan looks.
 *
 * Output: public/scan/warehouse-aisle.bin (+ .meta.json)
 *   8 bytes / point: int16 x,y,z (1/512 m units) · uint8 intensity (0-255) · uint8 flag
 *   flag 0 = scene point (elevation-ramp × intensity in the shader) · 1 = field/overlay
 *
 * Realism model (matched against real mobile-mapping scans): per-surface
 * reflectance with heavy speckle, range-dependent return loss + dropouts,
 * elevation striping from discrete scan lines, hard occlusion shadows.
 *
 * Run: node scripts/generate-scan.mjs  (or: pnpm scan:gen)
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "../public/scan");

// ── sensor (LR-16F-100 on an AMR mast) ──────────────────────────────────────
const SENSOR = { x: 0, y: 0.8, z: 0 }; // 0.8 m above floor
const MAX_RANGE = 30;                  // indoor clamp (unit is rated to 100 m)
const ELEV_MIN = -15, ELEV_MAX = 15;   // 360° × 30° FOV per catalog
const ELEV_LINES = 84;                 // per pose — × 4 poses ≈ very dense accumulation
const AZ_STEP = 0.15;                  // degrees
const RANGE_NOISE = 0.012;             // σ ≈ 12 mm

// ── GS1-5 protective field (270°, 5 m max protective range) ─────────────────
const FIELD_RADIUS = 2.5;              // a configured field, well inside the 5 m max
const FIELD_ARC_DEG = 270;
const FLOOR_Y = -SENSOR.y;

// ── scene: warehouse aisle, AMR at origin, +Z down the aisle ────────────────
const boxes = [];
/** axis-aligned box helper — refl is base reflectance (0..1); kind tags the
 *  surface material for the realistic-render twin of this scene */
const box = (cx, cy, cz, w, h, d, refl = 0.6, kind = "load") =>
  boxes.push({ min: [cx - w / 2, cy, cz - d / 2], max: [cx + w / 2, cy + h, cz + d / 2], refl, kind });

// rack structure: uprights + shelf beams + cargo, both sides of the aisle
for (const side of [-1, 1]) {
  const rx = side * 3.5; // rack centerline — ~5.8 m clear aisle (dual-traffic width)
  for (let z = 1.5; z <= 13.5; z += 3) {
    box(rx, FLOOR_Y, z, 0.12, 4.2, 0.12, 0.85, "steel");              // front upright (painted steel — bright)
    box(rx + side * 1.0, FLOOR_Y, z, 0.12, 4.2, 0.12, 0.85, "steel"); // rear upright
  }
  for (const level of [0, 1.6, 3.1]) {
    box(rx + side * 0.5, FLOOR_Y + level + 1.35, 7.5, 1.1, 0.12, 12.2, 0.8, "beam"); // shelf beam
  }
  // cargo: pallets + boxes, deterministic pseudo-random sizes/gaps/reflectance
  let seed = side === -1 ? 7 : 13;
  const rand = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  for (const level of [0, 1.6, 3.1]) {
    for (let z = 2.2; z < 13.2; z += 1.35) {
      if (rand() < 0.18) continue; // empty slot — gaps make racks legible
      const h = 0.5 + rand() * 0.85;
      const w = 0.8 + rand() * 0.25;
      box(rx + side * 0.45, FLOOR_Y + level + (level ? 0.12 : 0), z, w, 0.14, 1.1, 0.35, "pallet"); // pallet (dark wood)
      box(rx + side * 0.45, FLOOR_Y + level + 0.14 + (level ? 0.12 : 0), z, w * 0.92, h, 1.0,
        0.3 + rand() * 0.5, "load"); // load — cardboard/shrink-wrap variance
    }
  }
}

// rack diagonal cross-braces — stepped segments read as braces through scan noise
for (const side of [-1, 1]) {
  for (const z0 of [1.5, 4.5, 7.5, 10.5]) {
    for (let s = 0; s < 5; s++) {
      box(side * 3.5, FLOOR_Y + 0.25 + s * 0.72, z0 + 0.35 + s * 0.5, 0.07, 0.09, 0.55, 0.75, "steel");
    }
  }
}

// parked forklift down the aisle — body, mast, forks, overhead guard
const FK = { x: 1.7, z: 9.6 };
box(FK.x, FLOOR_Y, FK.z, 1.15, 1.0, 2.2, 0.7, "forklift");               // body
box(FK.x, FLOOR_Y + 1.0, FK.z + 0.55, 1.0, 1.1, 0.9, 0.65, "forklift");  // cab/counterweight
box(FK.x - 0.45, FLOOR_Y + 1.0, FK.z - 0.2, 0.08, 1.15, 0.08, 0.8, "forkliftDark"); // guard post
box(FK.x + 0.45, FLOOR_Y + 1.0, FK.z - 0.2, 0.08, 1.15, 0.08, 0.8, "forkliftDark");
box(FK.x, FLOOR_Y + 2.1, FK.z, 1.05, 0.06, 1.6, 0.75, "forkliftDark");   // overhead guard roof
box(FK.x, FLOOR_Y, FK.z - 1.45, 0.95, 2.6, 0.18, 0.8, "forkliftDark");   // mast
box(FK.x - 0.28, FLOOR_Y, FK.z - 1.95, 0.16, 0.08, 1.0, 0.55, "forkliftDark"); // left fork
box(FK.x + 0.28, FLOOR_Y, FK.z - 1.95, 0.16, 0.08, 1.0, 0.55, "forkliftDark"); // right fork

// corrugated far wall — vertical ribs give it real scan texture
box(0, FLOOR_Y, 16.25, 18, 6, 0.2, 0.5, "wall");
for (let x = -8.8; x <= 8.8; x += 0.45) {
  box(x, FLOOR_Y, 16.1, 0.16, 6, 0.1, 0.68, "wall");
}
const FLOOR_BOUNDS = { x: 9, zMin: -6, zMax: 16.2 };

/** concrete base + painted lane lines + dock hatching — intensity texture */
function floorRefl(x, z) {
  if (Math.abs(Math.abs(x) - 2.55) < 0.07 && z > -0.5 && z < 15.8) return 0.95; // aisle lane lines
  if (z < -0.5 && (((x + z * 0.7) % 0.9) + 0.9) % 0.9 < 0.14) return 0.82;      // dock apron hatching
  return 0.45;
}

// ── raycasting ───────────────────────────────────────────────────────────────
function rayBox(o, d, b) {
  let tmin = 1e-4, tmax = MAX_RANGE;
  for (let i = 0; i < 3; i++) {
    if (Math.abs(d[i]) < 1e-9) {
      if (o[i] < b.min[i] || o[i] > b.max[i]) return Infinity;
      continue;
    }
    let t1 = (b.min[i] - o[i]) / d[i];
    let t2 = (b.max[i] - o[i]) / d[i];
    if (t1 > t2) [t1, t2] = [t2, t1];
    tmin = Math.max(tmin, t1);
    tmax = Math.min(tmax, t2);
    if (tmin > tmax) return Infinity;
  }
  return tmin;
}

function rayFloor(o, d) {
  if (d[1] >= -1e-9) return Infinity;
  const t = (FLOOR_Y - o[1]) / d[1];
  const x = o[0] + d[0] * t, z = o[2] + d[2] * t;
  return Math.abs(x) <= FLOOR_BOUNDS.x && z >= FLOOR_BOUNDS.zMin && z <= FLOOR_BOUNDS.zMax
    ? t : Infinity;
}

/** nearest hit → [t, surface reflectance, hitWasFloor] */
function cast(o, d) {
  let t = rayFloor(o, d);
  let isFloor = isFinite(t);
  let refl = isFloor ? floorRefl(o[0] + d[0] * t, o[2] + d[2] * t) : 0;
  for (const b of boxes) {
    const tb = rayBox(o, d, b);
    if (tb < t) { t = tb; refl = b.refl; isFloor = false; }
  }
  return [t, refl, isFloor];
}

// gaussian noise (Box–Muller), deterministic
let nSeed = 42;
const nRand = () => ((nSeed = (nSeed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
const gauss = () =>
  Math.sqrt(-2 * Math.log(nRand() + 1e-12)) * Math.cos(2 * Math.PI * nRand());

// ── sweep ────────────────────────────────────────────────────────────────────
// SLAM-style accumulation: the AMR scanned while driving the aisle, so the
// cloud merges sweeps from its trajectory — fills occlusion shadows and
// multiplies density exactly the way real mobile-mapping clouds are built.
// Current pose is the origin (where the protective field lives).
const POSES = [
  [0, 0],
  [-0.45, 3.5],
  [-0.5, 7],
  [-0.4, 10.5],
];

const pts = []; // [x, y, z, intensityByte, flag]

for (const [px, pz] of POSES) {
  const o = [px, SENSOR.y, pz];
  for (let li = 0; li < ELEV_LINES; li++) {
    const elev = (ELEV_MIN + (li * (ELEV_MAX - ELEV_MIN)) / (ELEV_LINES - 1)) * (Math.PI / 180);
    const cosE = Math.cos(elev), sinE = Math.sin(elev);
    for (let az = 0; az < 360; az += AZ_STEP) {
      const a = az * (Math.PI / 180);
      const d = [Math.sin(a) * cosE, sinE, Math.cos(a) * cosE];
      const [t0, refl, isFloor] = cast(o, d);
      if (!isFinite(t0) || t0 > MAX_RANGE) continue;
      // floor dominates the ray budget — thin it so structure stays the star
      if (isFloor && refl < 0.6 && nRand() < 0.55) continue;

      // return strength: surface reflectance × range loss × heavy speckle
      const rangeLoss = 1 - (t0 / MAX_RANGE) * 0.55;
      let intensity = refl * rangeLoss * (0.55 + nRand() * 0.65);
      // weak returns drop out entirely — ragged edges on dark/far surfaces
      if (intensity < 0.16 && nRand() < 0.55) continue;
      if (nRand() < 0.04) continue; // random global dropout
      intensity = Math.min(1, intensity + gauss() * 0.05);

      const t = t0 + gauss() * RANGE_NOISE * (0.5 + t0 / MAX_RANGE); // range noise
      pts.push([
        o[0] + d[0] * t, o[1] + d[1] * t, o[2] + d[2] * t,
        Math.max(0, Math.min(255, Math.round(intensity * 255))), 0,
      ]);
    }
  }
}
const sceneCount = pts.length;

// protective-field boundary: dense arc + radial end-caps at floor level
const FIELD_GAP_START = 135, FIELD_GAP_END = 225; // 90° blind sector behind the AMR (az 180 = -Z)
for (let az = 0; az < 360; az += 0.1) {
  if (az > FIELD_GAP_START && az < FIELD_GAP_END) continue;
  const a = az * (Math.PI / 180);
  for (const rr of [FIELD_RADIUS, FIELD_RADIUS - 0.025]) { // double line for weight
    pts.push([Math.sin(a) * rr, FLOOR_Y + 0.012, Math.cos(a) * rr, 0, 1]);
  }
}
for (const az of [FIELD_GAP_START, FIELD_GAP_END]) {
  const a = az * (Math.PI / 180);
  for (let r = 0.35; r < FIELD_RADIUS; r += 0.02) {
    pts.push([Math.sin(a) * r, FLOOR_Y + 0.012, Math.cos(a) * r, 0, 1]);
  }
}

// AMR footprint outline at the sensor origin (the robot can't scan itself —
// a footprint overlay is the standard fleet-UI way to anchor the field ring)
const AMR_W = 0.62, AMR_D = 0.92;
const perim = [];
for (let s = 0; s <= 1; s += 0.012) {
  perim.push([-AMR_W / 2 + s * AMR_W, -AMR_D / 2], [-AMR_W / 2 + s * AMR_W, AMR_D / 2]);
  perim.push([-AMR_W / 2, -AMR_D / 2 + s * AMR_D], [AMR_W / 2, -AMR_D / 2 + s * AMR_D]);
}
for (const [x, z] of perim) pts.push([x, FLOOR_Y + 0.012, z, 0, 1]);
// heading chevron — shows which way the AMR faces
for (let s = 0; s <= 1; s += 0.04) {
  pts.push([-0.14 + s * 0.14, FLOOR_Y + 0.012, 0.12 + s * 0.2, 0, 1]);
  pts.push([0.14 - s * 0.14, FLOOR_Y + 0.012, 0.12 + s * 0.2, 0, 1]);
}

// ── pack + write ─────────────────────────────────────────────────────────────
const SCALE = 512; // int16 units per meter
const buf = Buffer.alloc(pts.length * 8);
pts.forEach(([x, y, z, intensity, flag], i) => {
  buf.writeInt16LE(Math.round(x * SCALE), i * 8);
  buf.writeInt16LE(Math.round(y * SCALE), i * 8 + 2);
  buf.writeInt16LE(Math.round(z * SCALE), i * 8 + 4);
  buf.writeUInt8(intensity, i * 8 + 6);
  buf.writeUInt8(flag, i * 8 + 7);
});

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, "warehouse-aisle.bin"), buf);

// scene twin for the realistic-render side of the reality-split viewer —
// the exact same geometry the rays were cast against, tagged by material
writeFileSync(
  join(OUT_DIR, "warehouse-aisle.scene.json"),
  JSON.stringify({
    floorY: FLOOR_Y,
    floorBounds: FLOOR_BOUNDS,
    laneX: 2.55,
    boxes: boxes.map((b) => ({
      min: b.min.map((v) => +v.toFixed(3)),
      max: b.max.map((v) => +v.toFixed(3)),
      kind: b.kind,
      refl: +b.refl.toFixed(2),
    })),
  }),
);
writeFileSync(
  join(OUT_DIR, "warehouse-aisle.meta.json"),
  JSON.stringify(
    {
      points: pts.length,
      scenePoints: sceneCount,
      fieldPoints: pts.length - sceneCount,
      scale: SCALE,
      bytesPerPoint: 8,
      sensorHeight: SENSOR.y,
      fieldRadius: FIELD_RADIUS,
      fieldArcDeg: FIELD_ARC_DEG,
      colorModel: "elevation ramp × per-point intensity (reflectance·rangeLoss·speckle)",
      source: "simulated LR-16F-100 sweep (accumulated) + GS1-5 protective field",
    },
    null,
    2,
  ),
);

console.log(
  `wrote ${pts.length.toLocaleString()} points (${sceneCount.toLocaleString()} scene + ${(pts.length - sceneCount).toLocaleString()} field) → ${(buf.length / 1024).toFixed(0)} KB`,
);
