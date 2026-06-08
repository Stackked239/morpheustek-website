/**
 * Product catalog + applications + lead magnets.
 *
 * This is the local seed that the pages render against today; in Phase 2 it is
 * replaced 1:1 by the Supabase `products`/`categories`/`applications`/`resources`
 * tables (same shape). Specs & prices are the canonical figures from the
 * Product & Competitive Training Guide. The SIL2/Type 3/PL d certification only
 * exists on the GS1-5 record — so a safety badge can never render on another SKU.
 */

export type Availability = "in-stock" | "pre-order" | "contact";
export type Brand = "OLEI" | "Percipio" | "MRDVS" | "Sintrones";

export type CategorySlug =
  | "lidar-for-robotics"
  | "safety-lidar"
  | "3d-lidar-for-robotics"
  | "solid-state-lidar"
  | "3d-cameras-for-robotics"
  | "rangefinders"
  | "3d-mapping"
  | "edge-compute";

export interface Category {
  slug: CategorySlug;
  label: string; // short menu label
  title: string; // page H1
  keyword: string; // target SEO phrase
  blurb: string;
  intro: string;
}

export interface Spec {
  label: string;
  value: string;
}

export interface CompareRow {
  spec: string;
  mt: string;
  competitor: string;
  competitorName: string;
}

export interface Product {
  slug: string;
  model: string;
  brand: Brand;
  name: string;
  category: CategorySlug;
  tagline: string;
  /** List price in USD; undefined means "Contact for pricing". */
  price?: number;
  availability: Availability;
  availabilityNote?: string;
  featured?: boolean;
  /** 90-day risk-free trial (all OLEI products). */
  trial: boolean;
  /** Certifications — populated ONLY for the GS1-5 safety scanner. */
  certifications?: string[];
  summary: string;
  keySpecs: Spec[];
  specs: Spec[];
  bestFor: string[];
  compare?: CompareRow[];
}

export const categories: Category[] = [
  {
    slug: "lidar-for-robotics",
    label: "2D LiDAR",
    title: "2D LiDAR for robot navigation",
    keyword: "2D LiDAR for robot navigation",
    blurb: "Reliable planar scanning for AGV/AMR navigation, obstacle detection, and zone monitoring.",
    intro:
      "2D LiDAR is the workhorse of mobile-robot navigation — full-circle or wide-angle scanning that feeds SLAM, obstacle detection, and protective zones. Lead with full 360° coverage and cost-per-coverage against premium scanners.",
  },
  {
    slug: "safety-lidar",
    label: "Safety LiDAR",
    title: "Safety LiDAR for AMRs and mobile robots",
    keyword: "SIL2 safety LiDAR for AMR",
    blurb: "Functional-safety laser scanners for personnel and machine protection — the same safety class as SICK at a fraction of the price.",
    intro:
      "When a stop function protects people, you need a safety-rated scanner. The OLEI GS1-5 is certified to Type 3 / SIL2 / PL d — the same safety class as SICK's nanoScan3/microScan3 — and beats the nanoScan3 on protective range, at roughly half to a third of the price.",
  },
  {
    slug: "3d-lidar-for-robotics",
    label: "3D LiDAR",
    title: "3D LiDAR for obstacle avoidance",
    keyword: "3D LiDAR for obstacle avoidance",
    blurb: "Dense 3D point clouds for volumetric perception, mapping, and outdoor autonomy.",
    intro:
      "3D LiDAR delivers full point-cloud geometry for mapping, localization, and high-clearance obstacle detection. Win on price-per-channel for commercial robotics where 16 lines and 100 m are plenty — don't let a customer over-buy resolution they won't use.",
  },
  {
    slug: "solid-state-lidar",
    label: "Solid-State LiDAR",
    title: "Solid-state LiDAR for robotics",
    keyword: "solid-state LiDAR for robotics",
    blurb: "No moving parts — wide-FOV forward perception built for high-duty fleets and bright sunlight.",
    intro:
      "Solid-state LiDAR removes the rotating assembly for longer life in high-duty fleets. Pair a 360° scanner for navigation with a solid-state unit for forward obstacle avoidance — and reach 100k-lux sunlight immunity outdoors.",
  },
  {
    slug: "3d-cameras-for-robotics",
    label: "3D Cameras",
    title: "3D cameras for robotics",
    keyword: "3D cameras for robotics",
    blurb: "Industrial depth + RGB perception that sees black, reflective, and textureless surfaces stereo cameras miss.",
    intro:
      "3D depth and dToF RGBD cameras add close-to-mid-range scene understanding — pallet pockets, bins, low obstacles, people. Our dToF cameras return a valid depth value on every pixel, including the black, reflective, and textureless surfaces where RealSense leaves holes.",
  },
  {
    slug: "rangefinders",
    label: "1D Rangefinders",
    title: "1D laser rangefinders",
    keyword: "laser distance sensor",
    blurb: "High-precision single-point distance for positioning, gauging, and collision monitoring.",
    intro:
      "When you need one precise distance — crane and gantry positioning, gap monitoring, industrial gauging — a 1D laser rangefinder is the clean, low-friction attach.",
  },
  {
    slug: "3d-mapping",
    label: "3D Mapping",
    title: "3D mapping and digital-twin capture",
    keyword: "3D mapping scanner",
    blurb: "Tripod and mobile SLAM scanners for as-built surveying, facility capture, and digital twins.",
    intro:
      "Capture dense spatial models fast — static tripod scanning for accuracy, mobile SLAM for coverage. Expands MorpheusTEK beyond pure robotics into surveying and construction adjacencies.",
  },
  {
    slug: "edge-compute",
    label: "Edge Compute",
    title: "Edge compute for robot perception",
    keyword: "edge AI computer for robots",
    blurb: "Rugged on-vehicle compute that runs the perception stack on top of our sensors.",
    intro:
      "Edge compute is the glue that turns a sensor sale into a system sale — rugged, fanless boxes that natively handle our LiDAR and cameras and run inference at the robot, in non-cloud environments.",
  },
];

export const products: Product[] = [
  // ---------- 2D LiDAR ----------
  {
    slug: "lr-1f-2d-lidar",
    model: "LR-1F",
    brand: "OLEI",
    name: "OLEI LR-1F",
    category: "lidar-for-robotics",
    tagline: "360° 2D LiDAR — full-circle scanning for navigation and obstacle detection.",
    price: 1449,
    availability: "in-stock",
    trial: true,
    summary:
      "A 360° field-of-view 2D LiDAR with 50 m effective range for AGV/AMR navigation, obstacle detection, and real-time environment monitoring. A single LR-1F can replace two front/rear 270° scanners.",
    keySpecs: [
      { label: "Field of view", value: "360°" },
      { label: "Range", value: "50 m" },
      { label: "Scan rate", value: "10 / 15 / 20 / 25 Hz" },
      { label: "Output", value: "2D point cloud" },
    ],
    specs: [
      { label: "Field of view", value: "360°" },
      { label: "Effective range", value: "50 m" },
      { label: "Horizontal resolution", value: "0.06° @10Hz → 0.15° @25Hz" },
      { label: "Scan rate", value: "10 / 15 / 20 / 25 Hz" },
      { label: "Output", value: "2D point cloud" },
    ],
    bestFor: ["AGV / AMR navigation and SLAM", "Obstacle detection and area monitoring", "Cost-sensitive integrators replacing premium 360° scanners"],
    compare: [
      { spec: "Field of view", mt: "360°", competitor: "270° (TiM) / 190°–270° (LMS)", competitorName: "SICK TiM / LMS" },
      { spec: "Range", mt: "50 m", competitor: "~10–25 m (TiM), up to 80 m (LMS)", competitorName: "SICK TiM / LMS" },
      { spec: "Origin", mt: "OLEI · in stock · 90-day trial", competitor: "Germany", competitorName: "SICK TiM / LMS" },
    ],
  },
  {
    slug: "lr-1bs2-mini-zone-lidar",
    model: "LR-1BS2",
    brand: "OLEI",
    name: "OLEI LR-1BS2 Series",
    category: "lidar-for-robotics",
    tagline: "Mini zone LiDAR with built-in alarm outputs — the lowest entry point.",
    price: 595,
    availability: "in-stock",
    trial: true,
    summary:
      "A compact 270° / 10 m zone LiDAR with analog zone-alarm outputs, so it can trigger directly without a controller in simple presence-detection jobs. The easiest way to start a relationship — under $600, easy to attach to a trial.",
    keySpecs: [
      { label: "Field of view", value: "270°" },
      { label: "Range", value: "10 m" },
      { label: "Rating", value: "IP65" },
      { label: "Outputs", value: "Analog zone alarm" },
    ],
    specs: [
      { label: "Field of view", value: "270°" },
      { label: "Range", value: "10 m" },
      { label: "Resolution", value: "0.225°" },
      { label: "Outputs", value: "Analog zone alarm available" },
      { label: "Rating", value: "IP65" },
    ],
    bestFor: ["Zone / presence detection", "Simple anti-collision on slow vehicles", "Space-constrained mounting"],
  },
  {
    slug: "vbd1-10-2d-lidar",
    model: "VBD1-10",
    brand: "OLEI",
    name: "OLEI VBD1-10",
    category: "lidar-for-robotics",
    tagline: "High-frequency 2D ranging for fast-moving navigation tasks.",
    availability: "contact",
    trial: true,
    summary:
      "A 2D LiDAR with 10 m range and a high 27K–45 kHz ranging frequency for responsive obstacle detection where update rate matters. Cleaner data on faster platforms.",
    keySpecs: [
      { label: "Range", value: "10 m" },
      { label: "Ranging freq.", value: "27K–45 kHz" },
      { label: "Scan freq.", value: "15 / 20 / 25 Hz" },
      { label: "Rating", value: "IP65" },
    ],
    specs: [
      { label: "Range", value: "10 m" },
      { label: "Ranging frequency", value: "27K–45 kHz" },
      { label: "Scan frequency", value: "15 / 20 / 25 Hz" },
      { label: "Rating", value: "IP65" },
    ],
    bestFor: ["High-update-rate navigation", "Indoor AMR obstacle detection", "Integrators needing fast refresh in a compact unit"],
  },
  // ---------- Safety LiDAR (FEATURED) ----------
  {
    slug: "gs1-5-safety-lidar",
    model: "GS1-5",
    brand: "OLEI",
    name: "OLEI GS1-5",
    category: "safety-lidar",
    tagline: "Affordable safety has arrived — functional-safety LiDAR at a fraction of SICK pricing.",
    price: 1950,
    availability: "in-stock",
    featured: true,
    trial: true,
    certifications: ["Type 3 ESPE (IEC 61496)", "SIL2 / SILCL2 (IEC 61508 / EN 62061)", "Cat 3 / PL d (EN ISO 13849)", "Class 1 laser (IEC 60825-1)"],
    summary:
      "A 270° functional-safety laser scanner certified to Type 3, SIL2 / SILCL2, Cat 3 / PL d, and Class 1 laser. It delivers people and machine protection for industrial automation — the centerpiece of our line, and the same safety class as SICK at roughly half to a third of the price.",
    keySpecs: [
      { label: "Scanning angle", value: "270°" },
      { label: "Safety rating", value: "Type 3 · SIL2 · PL d" },
      { label: "Protective range", value: "5 m max" },
      { label: "Warning range", value: "20–30 m max" },
    ],
    specs: [
      { label: "Scanning angle", value: "270°" },
      { label: "Safety type", value: "Type 3 ESPE (IEC 61496)" },
      { label: "SIL", value: "SIL2 / SILCL2" },
      { label: "Category / PL", value: "Cat 3 / PL d (EN ISO 13849)" },
      { label: "Protective range", value: "5 m max" },
      { label: "Warning range", value: "20–30 m max" },
      { label: "Resolutions", value: "20/30/40/50/70/150/200 mm" },
      { label: "Rating", value: "IP65" },
    ],
    bestFor: ["AGV/AMR personnel-protection stop functions", "Hazardous-area and access guarding", "Integrators priced out of SICK safety scanners"],
    compare: [
      { spec: "Scanning angle", mt: "270°", competitor: "275°", competitorName: "SICK nanoScan3" },
      { spec: "Safety rating", mt: "Type 3 · SIL2 · PL d", competitor: "Type 3 · SIL2 · PL d", competitorName: "SICK nanoScan3" },
      { spec: "Protective range", mt: "5 m", competitor: "3 m", competitorName: "SICK nanoScan3" },
      { spec: "Price", mt: "A fraction of the cost · 90-day trial", competitor: "Premium", competitorName: "SICK nanoScan3" },
    ],
  },
  // ---------- 3D LiDAR ----------
  {
    slug: "lr-16f-100-3d-lidar",
    model: "LR-16F-100",
    brand: "OLEI",
    name: "OLEI LR-16F-100",
    category: "3d-lidar-for-robotics",
    tagline: "Rugged 360° 16-line 3D LiDAR with 100 m range for dense perception.",
    price: 2500,
    availability: "in-stock",
    trial: true,
    summary:
      "A 16-channel mechanical 3D LiDAR with full 360° horizontal FOV, −15° to +15° vertical FOV, and 100 m range. Produces dense point clouds for 360° perception in robotics and automation — and wins on price-per-channel for commercial robotics.",
    keySpecs: [
      { label: "Channels", value: "16" },
      { label: "Range", value: "100 m" },
      { label: "FOV", value: "360° × 30°" },
      { label: "Rating", value: "IP66" },
    ],
    specs: [
      { label: "Channels", value: "16" },
      { label: "Range", value: "100 m" },
      { label: "FOV horizontal", value: "360°" },
      { label: "FOV vertical", value: "−15° to +15°" },
      { label: "H. accuracy", value: "0.18° ±10% @10Hz" },
      { label: "V. accuracy", value: "2° ±0.1°" },
      { label: "Rating", value: "IP66" },
    ],
    bestFor: ["Mobile robot 360° perception", "Outdoor AGV / yard automation", "Mapping and localization at range"],
  },
  {
    slug: "lr-16fis-explosion-proof-3d-lidar",
    model: "LR-16FIS",
    brand: "OLEI",
    name: "OLEI LR-16FIS",
    category: "3d-lidar-for-robotics",
    tagline: "The 16-line 3D platform, certified for explosive atmospheres.",
    availability: "contact",
    trial: true,
    summary:
      "An explosion-proof variant of the LR-16F with product-safety and explosion-proof conformity certificates. Same 100 m range and 360° × 30° FOV, hardened for hazardous environments — a niche differentiator with little direct competition.",
    keySpecs: [
      { label: "Channels", value: "16" },
      { label: "Range", value: "100 m" },
      { label: "Certification", value: "Explosion-proof" },
      { label: "Rating", value: "IP66" },
    ],
    specs: [
      { label: "Channels", value: "16" },
      { label: "Range", value: "100 m" },
      { label: "FOV", value: "360° × (−15° to +15°)" },
      { label: "Certification", value: "Explosion-proof conformity" },
      { label: "Rating", value: "IP66" },
    ],
    bestFor: ["Oil & gas, chemical, mining automation", "ATEX-style hazardous-area robotics", "Any 3D perception with explosive-atmosphere requirements"],
  },
  // ---------- Solid-State ----------
  {
    slug: "lr-f240-solid-state-lidar",
    model: "LR-F240",
    brand: "OLEI",
    name: "OLEI LR-F240",
    category: "solid-state-lidar",
    tagline: "Sub-$750 solid-state obstacle avoidance with a wide field of view.",
    price: 749,
    availability: "in-stock",
    trial: true,
    summary:
      "A compact solid-state 3D obstacle-avoidance LiDAR with a wide 72° × 58° FOV and 10 m outdoor / 12 m indoor range. No spinning parts — ideal as a forward-facing safety/avoidance sensor and an easy add to any proposal.",
    keySpecs: [
      { label: "Type", value: "Solid-state" },
      { label: "FOV", value: "72° × 58°" },
      { label: "Range", value: "10 m out / 12 m in" },
      { label: "Use", value: "Obstacle avoidance" },
    ],
    specs: [
      { label: "Type", value: "Solid-state" },
      { label: "FOV", value: "72° × 58°" },
      { label: "Range", value: "10 m outdoor / 12 m indoor" },
      { label: "Use", value: "Forward obstacle avoidance" },
    ],
    bestFor: ["Forward obstacle avoidance on AMRs/AGVs", "Blind-spot and approach detection", "High-reliability builds wanting no moving parts"],
  },
  {
    slug: "vss-50-solid-state-3d-lidar",
    model: "VSS-50",
    brand: "OLEI",
    name: "OLEI VSS-50",
    category: "solid-state-lidar",
    tagline: "Dense, wide-FOV solid-state perception built for sunlight and dust.",
    availability: "contact",
    trial: true,
    summary:
      "A compact solid-state 3D LiDAR with 120° × 50° FOV, 540,000 points/sec, up to 50 m range, and resistance to 100,000 lux ambient light. Our newest solid-state unit for outdoor autonomy and smart infrastructure.",
    keySpecs: [
      { label: "FOV", value: "120° × 50°" },
      { label: "Point rate", value: "540,000 pts/s" },
      { label: "Range", value: "up to 50 m" },
      { label: "Ambient", value: "100,000 lux" },
    ],
    specs: [
      { label: "Type", value: "Solid-state" },
      { label: "FOV", value: "120° × 50°" },
      { label: "Point rate", value: "540,000 pts/sec" },
      { label: "Range", value: "up to 50 m" },
      { label: "Ambient light", value: "100,000 lux resistant" },
      { label: "Rating", value: "IP67" },
    ],
    bestFor: ["Outdoor autonomy in bright sunlight", "Smart-infrastructure / intersection sensing", "High-point-density forward perception"],
  },
  // ---------- 3D Cameras ----------
  {
    slug: "percipio-gm461-depth-camera",
    model: "GM461-E1",
    brand: "Percipio",
    name: "Percipio GM461-E1",
    category: "3d-cameras-for-robotics",
    tagline: "Cost-effective, industrial-grade RealSense replacement.",
    availability: "contact",
    trial: false,
    summary:
      "A structured-light 3D depth camera in a compact, IP65-rated industrial housing with low (~3W) power draw — positioned directly as a rugged, cost-effective, still-available alternative to Intel RealSense.",
    keySpecs: [
      { label: "Tech", value: "Structured-light depth" },
      { label: "Rating", value: "IP65" },
      { label: "Power", value: "~3 W" },
      { label: "Form", value: "Compact" },
    ],
    specs: [
      { label: "Tech", value: "Structured-light depth" },
      { label: "Rating", value: "IP65 industrial" },
      { label: "Power", value: "~3 W" },
      { label: "Form", value: "Compact / lightweight" },
    ],
    bestFor: ["Bin picking / pick-and-place vision", "RealSense replacements needing IP65 ruggedness", "Low-power embedded vision"],
  },
  {
    slug: "percipio-gm465-dual-mode-depth-camera",
    model: "GM465-E1",
    brand: "Percipio",
    name: "Percipio GM465-E1",
    category: "3d-cameras-for-robotics",
    tagline: "Switchable high-speed or high-accuracy depth in one rugged camera.",
    availability: "contact",
    trial: false,
    summary:
      "A structured-light 3D camera with dual modes — high-speed or high-accuracy depth — in an IP65 industrial housing. One SKU covers two jobs, simplifying the customer's BOM.",
    keySpecs: [
      { label: "Tech", value: "Structured-light" },
      { label: "Modes", value: "Speed / accuracy" },
      { label: "Rating", value: "IP65" },
      { label: "Form", value: "Compact" },
    ],
    specs: [
      { label: "Tech", value: "Structured-light depth" },
      { label: "Modes", value: "High-speed or high-accuracy" },
      { label: "Rating", value: "IP65 industrial" },
      { label: "Form", value: "Compact / lightweight" },
    ],
    bestFor: ["Mixed-throughput vision lines", "Quality inspection + handling on one sensor", "RealSense-class upgrades"],
  },
  {
    slug: "mrdvs-s10-rgbd-camera",
    model: "S10",
    brand: "MRDVS",
    name: "MRDVS S10",
    category: "3d-cameras-for-robotics",
    tagline: "Compact industrial dToF RGBD camera for real-time obstacle avoidance.",
    availability: "in-stock",
    availabilityNote: "Launched Q3 2025 · available now",
    trial: false,
    summary:
      "A compact industrial-grade RGBD camera built on direct Time-of-Flight (dToF), delivering synchronized depth and RGB over 0.3–8 m. Every pixel returns a valid depth value regardless of surface texture, color, or lighting — it sees black and reflective obstacles that stereo cameras miss.",
    keySpecs: [
      { label: "Tech", value: "dToF RGBD (940nm)" },
      { label: "Range", value: "0.3–8 m" },
      { label: "FOV", value: "120° × 80°" },
      { label: "Accuracy", value: "≤ 3 cm" },
    ],
    specs: [
      { label: "Tech", value: "dToF RGBD (940nm)" },
      { label: "Depth res / rate", value: "240 × 160 @ up to 20fps" },
      { label: "ToF FOV (H×V)", value: "120° × 80°" },
      { label: "RGB", value: "1632 × 1224 @ up to 20fps" },
      { label: "Range", value: "0.3–8 m (90% refl.)" },
      { label: "Accuracy", value: "≤ 3 cm" },
      { label: "Interface", value: "Ethernet" },
      { label: "IP rating", value: "IP54" },
      { label: "Operating temp", value: "−20 to 60 °C" },
      { label: "SDK", value: "C/C++/ROS1/ROS2" },
    ],
    bestFor: ["AGV/AMR and humanoid obstacle avoidance", "Last-mile delivery robots (outdoor)", "Passenger-flow counting / parcel DWS"],
  },
  {
    slug: "mrdvs-s10-ultra-rgbd-camera",
    model: "S10 Ultra",
    brand: "MRDVS",
    name: "MRDVS S10 Ultra",
    category: "3d-cameras-for-robotics",
    tagline: "Wide-FOV, long-range dToF RGBD with RGB-D-IMU fusion for SLAM.",
    availability: "pre-order",
    availabilityNote: "Testing units Q2 2026 · cert. Q3 2026",
    trial: false,
    summary:
      "A small-form-factor, wide-FOV RGBD camera that extends dToF sensing to 42 m and adds a built-in 200 Hz IMU supporting Fast-LIO / LIVO SLAM. Fully solid-state for vibration resistance — a true outdoor SLAM sensor.",
    keySpecs: [
      { label: "Tech", value: "dToF RGBD + IMU" },
      { label: "Range", value: "0.2–42 m" },
      { label: "IMU", value: "200 Hz (Fast-LIO)" },
      { label: "Rating", value: "IP67" },
    ],
    specs: [
      { label: "Tech", value: "dToF RGBD + IMU (940nm)" },
      { label: "Depth res / rate", value: "240 × 160 @ up to 10fps" },
      { label: "ToF FOV (H×V)", value: "120° × 80°" },
      { label: "Range", value: "0.2–42 m (90% refl.)" },
      { label: "Accuracy", value: "≤ 4 cm" },
      { label: "IMU", value: "Built-in, 200 Hz (Fast-LIO / LIVO)" },
      { label: "Interface", value: "Ethernet; MIPI CSI-2 (module)" },
      { label: "IP rating", value: "IP67" },
      { label: "Operating temp", value: "−20 to 75 °C" },
    ],
    bestFor: ["Robotic lawn mowers & large-area outdoor mapping", "UAV SLAM and terrain following", "Outdoor SLAM and semantic obstacle recognition"],
  },
  {
    slug: "mrdvs-s11-rgbd-camera",
    model: "S11",
    brand: "MRDVS",
    name: "MRDVS S11",
    category: "3d-cameras-for-robotics",
    tagline: "Ultra-wide 140° dToF RGBD with ±1 cm accuracy for obstacle avoidance.",
    availability: "pre-order",
    availabilityNote: "Final retuning · cert. Q3 2026",
    trial: false,
    summary:
      "A compact RGBD camera with an ultra-wide 140° horizontal FOV, obstacle avoidance to 6 m with ±1 cm accuracy, and a ~10 cm minimum distance. One S11 can replace two narrower sensors and see closer than the RealSense D435's 28 cm floor.",
    keySpecs: [
      { label: "Tech", value: "dToF RGBD (940nm)" },
      { label: "FOV", value: "140° × 56°" },
      { label: "Range", value: "0.1–6 m" },
      { label: "Accuracy", value: "±1 cm @ 2 m" },
    ],
    specs: [
      { label: "Tech", value: "dToF RGBD (940nm)" },
      { label: "Depth res / rate", value: "240 × 96 @ up to 15fps" },
      { label: "ToF FOV (H×V)", value: "140° × 56°" },
      { label: "RGB", value: "1280 × 1080" },
      { label: "Range", value: "0.1–6 m (10–90% refl.), 100 kLux" },
      { label: "Accuracy", value: "±1 cm @ 2 m; ±2 cm @ 6 m" },
      { label: "Min distance", value: "~10 cm" },
      { label: "Interface", value: "Ethernet / USB; MIPI (volume)" },
      { label: "IP rating", value: "IP54" },
    ],
    bestFor: ["Commercial cleaning robots (one S11 replaces two sensors)", "AGV/AMR and service-robot obstacle avoidance", "Quadruped robots — stair climbing, terrain"],
    compare: [
      { spec: "Depth tech", mt: "dToF (direct time-of-flight)", competitor: "Active stereo", competitorName: "Intel RealSense D435" },
      { spec: "Detection range", mt: "0.1–6 m", competitor: "0.3–3 m (ideal)", competitorName: "Intel RealSense D435" },
      { spec: "Min distance", mt: "~10 cm", competitor: "~28 cm", competitorName: "Intel RealSense D435" },
      { spec: "Black / textureless", mt: "Every pixel valid", competitor: "Holes on dark/reflective", competitorName: "Intel RealSense D435" },
      { spec: "Ambient light", mt: "Up to 100 kLux (sunlight OK)", competitor: "Degrades in direct sun", competitorName: "Intel RealSense D435" },
    ],
  },
  // ---------- 1D Rangefinder ----------
  {
    slug: "a090-laser-rangefinder",
    model: "A090",
    brand: "OLEI",
    name: "OLEI A090",
    category: "rangefinders",
    tagline: "High-precision long-range single-point distance measurement.",
    price: 690,
    availability: "in-stock",
    trial: true,
    summary:
      "A 1D laser rangefinder measuring up to 90 m at 0.1 mm resolution, with ±1.5 mm accuracy under 20 m. A clean attach for crane/hoist positioning, industrial measurement, and collision monitoring — a low-friction first order to open an account.",
    keySpecs: [
      { label: "Range", value: "up to 90 m" },
      { label: "Resolution", value: "0.1 mm" },
      { label: "Accuracy", value: "±1.5 mm <20 m" },
      { label: "Type", value: "1D rangefinder" },
    ],
    specs: [
      { label: "Range", value: "up to 90 m" },
      { label: "Resolution", value: "0.1 mm" },
      { label: "Accuracy", value: "±1.5 mm <20 m, ±3.0 mm full range" },
    ],
    bestFor: ["Crane / hoist positioning", "Industrial measurement and gauging", "Collision / gap monitoring"],
  },
  // ---------- 3D Mapping ----------
  {
    slug: "lr-dds-2-tripod-3d-mapper",
    model: "LR-DDS-2",
    brand: "OLEI",
    name: "OLEI LR-DDS-2",
    category: "3d-mapping",
    tagline: "Tripod-mounted 3D mapper for fast, accurate spatial capture.",
    price: 4000,
    availability: "in-stock",
    trial: true,
    summary:
      "A tripod-mounted 3D mapping scanner with 25 m range, 1–2 cm accuracy, 360° × 270° coverage, 70 kHz scan speed, and 4+ hours battery for surveying, construction, and digital-twin capture.",
    keySpecs: [
      { label: "Range", value: "25 m" },
      { label: "Accuracy", value: "1–2 cm" },
      { label: "Coverage", value: "360° × 270°" },
      { label: "Battery", value: ">4 hours" },
    ],
    specs: [
      { label: "Range", value: "25 m" },
      { label: "Accuracy", value: "1–2 cm" },
      { label: "Scan coverage", value: "360° × 270°" },
      { label: "Scan speed", value: "70 kHz" },
      { label: "Battery", value: ">4 hours" },
    ],
    bestFor: ["As-built surveying and construction", "Digital-twin / facility capture", "Plant and warehouse scanning"],
  },
  {
    slug: "lc-m50g-mobile-slam-mapper",
    model: "LC-M50G",
    brand: "OLEI",
    name: "OLEI LC-M50G",
    category: "3d-mapping",
    tagline: "Handheld mobile mapping with RGB-depth fusion and onboard SLAM.",
    availability: "contact",
    trial: true,
    summary:
      "A mobile 3D mapping system fusing RGB and depth with a self-developed SLAM algorithm and 9-DOF IMU. Walk-and-scan capture for fast spatial models without a fixed tripod setup.",
    keySpecs: [
      { label: "Capture", value: "RGB + depth fusion" },
      { label: "SLAM", value: "Self-developed" },
      { label: "IMU", value: "9-DOF" },
      { label: "Mode", value: "Handheld" },
    ],
    specs: [
      { label: "Capture", value: "RGB + depth fusion" },
      { label: "SLAM", value: "Self-developed algorithm" },
      { label: "IMU", value: "9-DOF" },
      { label: "Mode", value: "Mobile / handheld" },
    ],
    bestFor: ["Walk-through facility scanning", "Rapid digital-twin capture", "Large-area mobile mapping"],
  },
  // ---------- Edge Compute ----------
  {
    slug: "sintrones-ibox-602p-edge-ai",
    model: "iBOX-602P",
    brand: "Sintrones",
    name: "Sintrones iBOX-602P",
    category: "edge-compute",
    tagline: "Rugged NVIDIA Jetson Orin edge AI box for vehicles and robots.",
    availability: "contact",
    trial: false,
    summary:
      "An IP66 rugged, fanless edge AI computer on NVIDIA Jetson Orin NX, with 2× PoE + 2× GMSL-2 for cameras and LiDAR, wide 9–60 V DC input, and optional battery backup. The box that runs the perception stack on top of our sensors.",
    keySpecs: [
      { label: "Compute", value: "Jetson Orin NX" },
      { label: "I/O", value: "2× PoE + 2× GMSL-2" },
      { label: "Power", value: "9–60 V DC" },
      { label: "Build", value: "IP66 fanless" },
    ],
    specs: [
      { label: "Compute", value: "NVIDIA Jetson Orin NX" },
      { label: "I/O", value: "2× PoE + 2× GMSL-2" },
      { label: "Power", value: "9–60 V DC, optional battery backup" },
      { label: "Build", value: "IP66 rugged, fanless" },
    ],
    bestFor: ["On-vehicle perception / inference", "LiDAR + camera fusion at the edge", "Harsh-environment mobile compute"],
  },
  {
    slug: "sintrones-sbox-2624p-embedded",
    model: "SBOX-2624(P)",
    brand: "Sintrones",
    name: "Sintrones SBOX-2624(P)",
    category: "edge-compute",
    tagline: "Fanless AMD Ryzen embedded PC, EN 50155 rail-certified.",
    availability: "contact",
    trial: false,
    summary:
      "A fanless embedded computer on AMD Ryzen Embedded R2312, with dual HDMI 2.0b (4K@60Hz), up to 4× GbE with PoE, wide 9–36 V DC input, and EN 50155 certification for rail and transit.",
    keySpecs: [
      { label: "CPU", value: "AMD Ryzen R2312" },
      { label: "Display", value: "Dual HDMI 4K@60" },
      { label: "Networking", value: "up to 4× GbE PoE" },
      { label: "Certification", value: "EN 50155 (rail)" },
    ],
    specs: [
      { label: "CPU", value: "AMD Ryzen Embedded R2312" },
      { label: "Display", value: "Dual HDMI 2.0b, 4K@60Hz" },
      { label: "Networking", value: "up to 4× GbE w/ PoE (2624P)" },
      { label: "Power", value: "9–36 V DC w/ protection" },
      { label: "Certification", value: "EN 50155 (rail)" },
    ],
    bestFor: ["Rail and transit compute (EN 50155)", "Multi-camera PoE aggregation", "Industrial HMI / display systems"],
  },
];

// ---------------- Applications ----------------

export interface Application {
  slug: string;
  title: string;
  pain: string;
  fit: string;
  sensors: string[];
}

export const applications: Application[] = [
  {
    slug: "amr",
    title: "Autonomous mobile robots (AMR)",
    pain: "Navigation, aisle movement, obstacle avoidance, docking, and fleet efficiency in dynamic facilities.",
    fit: "2D LiDAR for navigation and safety fields; 3D LiDAR for richer obstacle geometry; 3D cameras for pallet, dock, and object detection.",
    sensors: ["lr-1f-2d-lidar", "gs1-5-safety-lidar", "lr-16f-100-3d-lidar", "mrdvs-s10-rgbd-camera"],
  },
  {
    slug: "agv",
    title: "Automated guided vehicles (AGV)",
    pain: "Reliable path-following, protective stops around people, and cost-down at fleet scale.",
    fit: "360° 2D LiDAR for navigation, the GS1-5 for safety-rated stop functions, and a solid-state unit for forward avoidance.",
    sensors: ["lr-1f-2d-lidar", "gs1-5-safety-lidar", "lr-f240-solid-state-lidar"],
  },
  {
    slug: "autonomous-forklift",
    title: "Autonomous forklifts",
    pain: "Pallet-pocket detection, rack approach, people detection, load handling, and docking.",
    fit: "3D cameras for close-range pallet geometry and RGB-D; LiDAR for navigation and obstacle zones; safety LiDAR where a stop function is required.",
    sensors: ["mrdvs-s11-rgbd-camera", "gs1-5-safety-lidar", "lr-16f-100-3d-lidar"],
  },
  {
    slug: "robotic-cleaning",
    title: "Robotic cleaning platforms",
    pain: "Navigation, obstacle avoidance, glass and walls, people, furniture, and docking.",
    fit: "2D LiDAR for navigation; a wide-FOV dToF RGBD camera for low obstacles and object recognition — one S11 can replace two narrower sensors.",
    sensors: ["lr-1f-2d-lidar", "mrdvs-s11-rgbd-camera"],
  },
  {
    slug: "warehouse-logistics",
    title: "Warehouse & logistics automation",
    pain: "Throughput, safe human-robot collaboration, docking accuracy, and uptime at scale.",
    fit: "A full stack — 2D navigation LiDAR, GS1-5 safety zones, 3D LiDAR for geometry, and depth cameras for parcel and pallet handling.",
    sensors: ["lr-1f-2d-lidar", "gs1-5-safety-lidar", "lr-16f-100-3d-lidar", "mrdvs-s10-rgbd-camera"],
  },
  {
    slug: "outdoor-mobile",
    title: "Outdoor mobile robots",
    pain: "Terrain, obstacles, vegetation, vehicles, humans, mapping, and localization in bright sunlight.",
    fit: "Solid-state 3D LiDAR with sunlight immunity, long-range dToF RGBD with IMU fusion for SLAM, and edge compute on board.",
    sensors: ["vss-50-solid-state-3d-lidar", "mrdvs-s10-ultra-rgbd-camera", "sintrones-ibox-602p-edge-ai"],
  },
  {
    slug: "mapping-digital-twin",
    title: "Mapping & digital twin",
    pain: "Scanning environments, creating dense point clouds, and documenting facilities quickly and accurately.",
    fit: "Tripod 3D mappers for high-accuracy detail; mobile SLAM scanners for fast large-area coverage.",
    sensors: ["lr-dds-2-tripod-3d-mapper", "lc-m50g-mobile-slam-mapper"],
  },
  {
    slug: "inspection",
    title: "Inspection robots",
    pain: "Detecting defects, inventory, assets, conditions, or hazards — with reliable navigation around the facility.",
    fit: "Cameras for visual evidence; LiDAR/depth for geometry, location, distance, and navigation; edge compute for on-board inference.",
    sensors: ["mrdvs-s10-rgbd-camera", "lr-16f-100-3d-lidar", "sintrones-ibox-602p-edge-ai"],
  },
];

// ---------------- Lead magnets (gated resources) ----------------

export interface LeadMagnet {
  slug: string;
  title: string;
  icp: string;
  blurb: string;
  contents: string[];
  primary?: boolean;
}

export const leadMagnets: LeadMagnet[] = [
  {
    slug: "sick-hokuyo-alternative-comparison-checklist",
    title: "SICK / Hokuyo Alternative Comparison Checklist",
    icp: "Builder / Integrator · Buyer",
    blurb:
      "A practical checklist for evaluating lower-cost, more flexible LiDAR alternatives to legacy safety-scanner suppliers — without increasing technical risk.",
    contents: [
      "Range, field of view, accuracy, and environmental rating side-by-side",
      "Safety certification (Type 3 / SIL2 / PL d) — what to verify",
      "Interfaces, mounting, customization, lead time, and availability",
      "Production support and total cost across a fleet",
    ],
    primary: true,
  },
  {
    slug: "lidar-selection-guide-for-robotics-oems",
    title: "LiDAR Selection Guide for Robotics OEMs",
    icp: "Builder / Integrator",
    blurb: "2D vs 3D LiDAR, range, field of view, accuracy, safety, interfaces, environment, and production considerations — in one decision guide.",
    contents: ["2D vs 3D vs depth-camera decision tree", "Range / FOV / accuracy trade-offs", "Interface & integration checklist", "From prototype to production planning"],
  },
  {
    slug: "safety-lidar-buyers-guide-for-amrs",
    title: "Safety LiDAR Buyer's Guide for AMRs & Mobile Robots",
    icp: "Engineer / Technical Evaluator",
    blurb: "Safety-rated sensing explained — SIL2 considerations, protective fields, navigation vs. safety sensing, and the key questions before selecting a scanner.",
    contents: ["What 'safety-rated' actually means", "Protective vs. warning fields", "Type 3 / SIL2 / PL d — buyer's checklist", "Questions to ask before you spec"],
  },
  {
    slug: "custom-lidar-requirements-worksheet",
    title: "Custom LiDAR Requirements Worksheet",
    icp: "Engineer / Technical Evaluator",
    blurb: "A downloadable worksheet that helps engineering teams define range, FOV, mounting, housing, interface, environment, safety, and production requirements.",
    contents: ["Define range, FOV, and accuracy targets", "Mounting, housing, and environment", "Interface, SDK, and ROS needs", "Safety and production requirements"],
  },
  {
    slug: "sample-point-cloud-demo-pack",
    title: "Sample Point-Cloud / Application Demo Pack",
    icp: "Engineer / Builder",
    blurb: "Example 2D/3D LiDAR data, robot sensing use cases, and demo footage showing obstacle detection, navigation, and safety applications.",
    contents: ["2D SLAM map + 3D point-cloud samples", "Obstacle-detection and navigation clips", "Safety-field application examples", "RGBD depth on black/reflective surfaces"],
  },
];

// ---------------- Helpers ----------------

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const productsInCategory = (slug: CategorySlug) => products.filter((p) => p.category === slug);
export const getApplication = (slug: string) => applications.find((a) => a.slug === slug);
export const getLeadMagnet = (slug: string) => leadMagnets.find((m) => m.slug === slug);
export const featuredProduct = () => products.find((p) => p.featured) ?? products[0];

export const formatPrice = (price?: number) =>
  price === undefined ? "Contact for pricing" : `$${price.toLocaleString("en-US")}`;

export const availabilityLabel: Record<Availability, string> = {
  "in-stock": "In stock",
  "pre-order": "Pre-order",
  contact: "Contact",
};
