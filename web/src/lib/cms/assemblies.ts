// The perception-stack "assemblies" that drive <AssemblyStack>.
//
// An assembly is a pre-configured four-part build indexed to the fixed
// 01 Protect → 02 Map → 03 See → 04 Think spine (that spine's copy lives in the
// component; the *parts* beneath it are what change). Two config sets live here:
//
//   • PLATFORM_ASSEMBLIES   — the homepage selector: AMR / AGV / Humanoid / Mining
//   • APPLICATION_ASSEMBLIES — one bespoke build per /applications/[slug] (all 8)
//
// Every slug + spec below is a real catalog record (verified against catalog.ts).
// The GS1-5 is the shared safety floor on every build — it's the one part that
// never changes; the rest re-pick to the robot. Spec lines are lifted from the
// product's keySpecs (never invented).

export interface StepFrame {
  /** catalog slug — drives name + image + the /products link */
  slug: string;
  /** one real spec line, condensed from catalog.ts keySpecs (never invented) */
  spec: string;
}

export interface Assembly {
  /** on the homepage this is the platform id; on an app page it is the app slug */
  id: string;
  /** short tab label */
  label: string;
  /** the build in one engineer-credible line */
  blurb: string;
  /** four parts, indexed to the four steps (Protect, Map, See, Think) */
  parts: [StepFrame, StepFrame, StepFrame, StepFrame];
}

// Reusable, verified spec lines — keeps the two config sets in sync and DRY.
const SPEC = {
  gs15: "270° · Type 3 / SIL2 / PL d · 5 m protective",
  lr16f: "16 ch · 360° × 30° · 100 m · IP66",
  lr1f: "360° FOV · 50 m · 10–25 Hz · 2D point cloud",
  lrf240: "Solid-state · 72° × 58° · 10 m forward avoidance",
  vss50: "120° × 50° · 540k pts/s · 100,000 lux · IP67",
  ldds2: "360° × 270° · 25 m · 1–2 cm accuracy",
  lcm50g: "RGB + depth SLAM · 9-DOF IMU · mobile capture",
  s10: "dToF RGBD · 0.3–8 m · 120° × 80° · ≤ 3 cm",
  s10ultra: "dToF RGBD + 200 Hz IMU · 0.2–42 m · IP67",
  s11: "dToF RGBD · 140° × 56° · 0.1–6 m · ±1 cm @ 2 m",
  ibox: "Jetson Orin NX · 2× PoE + 2× GMSL-2 · IP66",
} as const;

// ── Platform-view builds (AMR / AGV / Humanoid / Mining) ────────────────────
// The original homepage selector. As of the per-application rollout no page
// wires this in — both the homepage and every application page now use
// APPLICATION_ASSEMBLIES below. Kept as <AssemblyStack>'s default fallback and
// as the ready-made platform view (it holds the only Humanoid/Mining builds).
export const PLATFORM_ASSEMBLIES: readonly Assembly[] = [
  {
    id: "amr",
    label: "AMR",
    blurb: "Indoor autonomous mobile robot — aisles, docks, and people, all day.",
    parts: [
      { slug: "gs1-5-safety-lidar", spec: SPEC.gs15 },
      { slug: "lr-16f-100-3d-lidar", spec: SPEC.lr16f },
      { slug: "mrdvs-s10-rgbd-camera", spec: SPEC.s10 },
      { slug: "sintrones-ibox-602p-edge-ai", spec: SPEC.ibox },
    ],
  },
  {
    id: "agv",
    label: "AGV",
    blurb: "Fixed-route guided vehicle — path-following at fleet scale, cost down.",
    parts: [
      { slug: "gs1-5-safety-lidar", spec: SPEC.gs15 },
      { slug: "lr-1f-2d-lidar", spec: SPEC.lr1f },
      { slug: "lr-f240-solid-state-lidar", spec: SPEC.lrf240 },
      { slug: "sintrones-ibox-602p-edge-ai", spec: "Jetson Orin NX · 9–60 V DC · IP66 fanless" },
    ],
  },
  {
    id: "humanoid",
    label: "Humanoid",
    blurb: "Legged platform — stairs, terrain, and close-quarters human spaces.",
    parts: [
      { slug: "gs1-5-safety-lidar", spec: SPEC.gs15 },
      { slug: "lr-16f-100-3d-lidar", spec: SPEC.lr16f },
      { slug: "mrdvs-s11-rgbd-camera", spec: SPEC.s11 },
      { slug: "sintrones-ibox-602p-edge-ai", spec: SPEC.ibox },
    ],
  },
  {
    id: "mining",
    label: "Mining",
    blurb: "Heavy outdoor autonomy — direct sun, dust, and long sightlines.",
    parts: [
      { slug: "gs1-5-safety-lidar", spec: SPEC.gs15 },
      { slug: "vss-50-solid-state-3d-lidar", spec: SPEC.vss50 },
      { slug: "mrdvs-s10-ultra-rgbd-camera", spec: SPEC.s10ultra },
      { slug: "sintrones-ibox-602p-edge-ai", spec: "Jetson Orin NX · 9–60 V DC · IP66 fanless" },
    ],
  },
] as const;

// ── One bespoke build per application (keys = application slug) ──────────────
// Ordered to match the applications page. Each is a full four-part build so the
// "four steps you can certify" story holds on every page.
export const APPLICATION_ASSEMBLIES: readonly Assembly[] = [
  {
    id: "amr",
    label: "AMR",
    blurb: "Indoor autonomous mobile robot — aisles, docks, and people, all day.",
    parts: [
      { slug: "gs1-5-safety-lidar", spec: SPEC.gs15 },
      { slug: "lr-16f-100-3d-lidar", spec: SPEC.lr16f },
      { slug: "mrdvs-s10-rgbd-camera", spec: SPEC.s10 },
      { slug: "sintrones-ibox-602p-edge-ai", spec: SPEC.ibox },
    ],
  },
  {
    id: "agv",
    label: "AGV",
    blurb: "Fixed-route guided vehicle — path-following at fleet scale, cost down.",
    parts: [
      { slug: "gs1-5-safety-lidar", spec: SPEC.gs15 },
      { slug: "lr-1f-2d-lidar", spec: SPEC.lr1f },
      { slug: "lr-f240-solid-state-lidar", spec: SPEC.lrf240 },
      { slug: "sintrones-ibox-602p-edge-ai", spec: "Jetson Orin NX · 9–60 V DC · IP66 fanless" },
    ],
  },
  {
    id: "autonomous-forklift",
    label: "Forklift",
    blurb: "Automated forklift — pallets, racking, and shared human aisles.",
    parts: [
      { slug: "gs1-5-safety-lidar", spec: SPEC.gs15 },
      { slug: "lr-16f-100-3d-lidar", spec: SPEC.lr16f },
      { slug: "mrdvs-s11-rgbd-camera", spec: SPEC.s11 },
      { slug: "sintrones-ibox-602p-edge-ai", spec: SPEC.ibox },
    ],
  },
  {
    id: "robotic-cleaning",
    label: "Cleaning",
    blurb: "Autonomous floor-care — busy public floors, full shift, low obstacles.",
    parts: [
      { slug: "gs1-5-safety-lidar", spec: SPEC.gs15 },
      { slug: "lr-1f-2d-lidar", spec: SPEC.lr1f },
      { slug: "mrdvs-s11-rgbd-camera", spec: SPEC.s11 },
      { slug: "sintrones-ibox-602p-edge-ai", spec: SPEC.ibox },
    ],
  },
  {
    id: "warehouse-logistics",
    label: "Warehouse",
    blurb: "Fleet logistics — high-throughput aisles, dock doors, mixed traffic.",
    parts: [
      { slug: "gs1-5-safety-lidar", spec: SPEC.gs15 },
      { slug: "lr-16f-100-3d-lidar", spec: SPEC.lr16f },
      { slug: "mrdvs-s10-rgbd-camera", spec: SPEC.s10 },
      { slug: "sintrones-ibox-602p-edge-ai", spec: SPEC.ibox },
    ],
  },
  {
    id: "outdoor-mobile",
    label: "Outdoor",
    blurb: "Heavy outdoor autonomy — direct sun, dust, and long sightlines.",
    parts: [
      { slug: "gs1-5-safety-lidar", spec: SPEC.gs15 },
      { slug: "vss-50-solid-state-3d-lidar", spec: SPEC.vss50 },
      { slug: "mrdvs-s10-ultra-rgbd-camera", spec: SPEC.s10ultra },
      { slug: "sintrones-ibox-602p-edge-ai", spec: "Jetson Orin NX · 9–60 V DC · IP66 fanless" },
    ],
  },
  {
    id: "mapping-digital-twin",
    label: "Mapping",
    blurb: "Survey-grade capture — as-built geometry straight into a digital twin.",
    parts: [
      { slug: "gs1-5-safety-lidar", spec: SPEC.gs15 },
      { slug: "lr-dds-2-tripod-3d-mapper", spec: SPEC.ldds2 },
      { slug: "lc-m50g-mobile-slam-mapper", spec: SPEC.lcm50g },
      { slug: "sintrones-ibox-602p-edge-ai", spec: SPEC.ibox },
    ],
  },
  {
    id: "inspection",
    label: "Inspection",
    blurb: "Autonomous inspection — repeatable routes, fine detail, edge decisions.",
    parts: [
      { slug: "gs1-5-safety-lidar", spec: SPEC.gs15 },
      { slug: "lr-16f-100-3d-lidar", spec: SPEC.lr16f },
      { slug: "mrdvs-s10-rgbd-camera", spec: SPEC.s10 },
      { slug: "sintrones-ibox-602p-edge-ai", spec: SPEC.ibox },
    ],
  },
] as const;
