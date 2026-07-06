import type { CategorySlug } from "@/lib/catalog";

/** Section header copy shared by RangeLedger and AssemblyStack editors. */
export type SectionHeaderContent = {
  eyebrow: string;
  title: string;
  body: string;
};

export const defaultHeroContent = {
  headlineLine1: "Giving",
  headlineAccent: "Sight",
  headlineLine2: "to Robotics",
  chips: ["90-day risk-free trial", "Same safety class as SICK", "North American support"],
  primaryCta: { label: "Start a 90-day trial", href: "/book-a-meeting?intent=trial" },
  secondaryCta: { label: "Talk to an engineer", href: "/book-a-meeting?intent=engineer" },
  scanLabel: "OLEI LR-16F-100 · 360°×30°",
};

export const defaultRangeLedgerHeader: SectionHeaderContent = {
  eyebrow: "The line, end to end",
  title: "Every robot needs a sensing envelope.",
  body: "From 30 cm pallet pockets to 100 m yard scans, the line is easier to read as coverage: arcs, cones, rings, and beams around the machine.",
};

export const defaultAssemblyHeader: SectionHeaderContent = {
  eyebrow: "The assembly",
  title: "Four steps to sight you can certify.",
  body: "Protect, map, see, think — the same four-layer stack on every robot. Pick the application and the parts re-pick themselves. It's always going to be different; the safety floor never is.",
};

export const defaultCertifyContent = {
  eyebrow: "The safety case",
  title: "Sight you can",
  titleAccent: "certify.",
  bodyLead:
    "functional-safety scanner — the same safety class as SICK, certified to stop for people. This is its protective field at true proportions: the drawing your safety engineer signs off on, not a render.",
  bodyFollow:
    "Configured to a {configuredM} m protective radius and dimensioned against the {protectiveMax} maximum — 30 years of high-tech measurement instruments behind every ring. Nobody gets fired for choosing the safe option, and nobody gets fired for choosing us either.",
  configuredM: 2.5,
};

export const defaultCategoryBrowseContent = {
  eyebrow: "Browse the line by category",
  title: "The right sensor, sorted the way you spec.",
  body: "2D, safety, 3D — and everything between. Every unit ships on a 90-day risk-free trial, backed by 30 years of high-tech measurement instruments, not a fly-by-night manufacturer.",
  categoryOrder: [
    "lidar-for-robotics",
    "safety-lidar",
    "3d-lidar-for-robotics",
    "solid-state-lidar",
    "3d-cameras-for-robotics",
    "rangefinders",
  ] as CategorySlug[],
};

export const defaultTrustBandContent = {
  eyebrow: "Why MorpheusTEK",
  title: "Not a fly-by-night brand. Thirty years building",
  titleAccent: "high-tech measurement instruments.",
  body: "SICK is excellent — and nobody gets fired for choosing it. Nobody gets fired for choosing us either: the same safety class, proven on your floor, without the premium.",
  compareLink: { label: "See the line-by-line comparison", href: "/compare/sick-alternative-lidar" },
  supplyEyebrow: "World-scale supply",
  supplyBody:
    "Backed by one of the world's largest laser-diode purchasing footprints — not a startup, a manufacturing-backed perception partner.",
};

export const defaultBuildToSpecContent = {
  eyebrow: "Built to your spec",
  title: "Custom from housing to firmware.",
  body: "When off-the-shelf doesn't fit, we build to it. Backed by OEM/ODM laser-measurement manufacturing, MorpheusTEK tailors the sensor to your platform — then supports it into production. We build sensors; we don't just resell a fixed part number.",
  pillars: [
    { title: "Housing & mounting", body: "Custom enclosures, mounting, environmental protection, and form factors for your platform." },
    { title: "Perception tuning", body: "Field of view, range, resolution, scan rate, and safety zones tuned to the application." },
    { title: "Cables & connectors", body: "Connectors, harnesses, and interfaces matched to your robot's wiring and I/O." },
  ],
  link: { label: "Explore custom solutions", href: "/custom-solutions" },
};

export const defaultBoothMode = {
  enabled: false,
  showName: "Automate",
  location: "Chicago, IL",
  boothNumber: "",
  headline: "Meet us on the show floor.",
  subheadline: "See the full sensing stack live — safety LiDAR, 3D navigation, and edge compute on real robots.",
  cta: { label: "Book a booth meeting", href: "/shows/meet-us-at-the-booth" },
};

export const defaultProductOfMonth = {
  enabled: true,
  productSlug: "gs1-5-safety-lidar",
  headline: "Affordable safety has arrived.",
  ctaBand: {
    title: "Same safety class as SICK. A fraction of the price.",
    body: "See the GS1-5 on your own AGV next to the incumbent — risk-free for 90 days.",
    primary: { label: "Request a trial unit", href: "/book-a-meeting?intent=trial" },
    secondary: { label: "Compare to SICK", href: "/compare/sick-alternative-lidar" },
  },
};

export const defaultLayoutMetadata = {
  titleDefault: "MorpheusTEK — Giving Sight to Robotics | LiDAR, 3D Cameras & Edge Compute for Robotics",
  titleTemplate: "%s · MorpheusTEK",
  description:
    "MorpheusTEK gives robots the sensing stack they need to see, navigate, avoid obstacles, and operate safely in the real world.",
  keywords: [
    "LiDAR for robotics",
    "2D LiDAR for robot navigation",
    "3D LiDAR for obstacle avoidance",
    "safety LiDAR for AMR",
    "SIL2 safety LiDAR",
    "custom LiDAR for robotics",
    "LiDAR alternative to SICK",
    "Hokuyo LiDAR alternative",
    "LiDAR supplier North America",
    "3D cameras for robotics",
    "robot perception sensor supplier",
  ],
};
