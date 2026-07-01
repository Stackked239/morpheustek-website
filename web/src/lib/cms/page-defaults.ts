/** CMS defaults for secondary marketing pages — merged with DB overrides via getContent(). */

export type PageMeta = { title: string; description: string };
export type PageCta = { label: string; href: string };
export type CtaBandData = {
  title: string;
  body: string;
  primary: PageCta;
  secondary?: PageCta;
};

export type AboutPageData = {
  meta: PageMeta;
  hero: { eyebrow: string; title: string; lead: string; primaryCta: PageCta };
  intro: {
    eyebrow: string;
    title: string;
    body1: string;
    body2: string;
    statValue: string;
    statCaption: string;
  };
  manufacturing: {
    eyebrow: string;
    title: string;
    lead: string;
    scaleEyebrow: string;
    scaleTitle: string;
    scaleBody: string;
    closing: string;
  };
  statCards: { icon: string; title: string; body: string }[];
  howWeWork: {
    eyebrow: string;
    title: string;
    cards: { title: string; body: string }[];
    footer: string;
  };
  cta: CtaBandData;
};

export const aboutPageDefaults: AboutPageData = {
  meta: {
    title: "Why MorpheusTEK — The Full-Stack Robot Perception Partner",
    description:
      "MorpheusTEK is the exclusive North American distributor for OLEI LiDAR and a full-stack perception partner — LiDAR, 3D cameras, safety sensing, and edge compute, backed by manufacturing strength and U.S.-based support.",
  },
  hero: {
    eyebrow: "Why MorpheusTEK",
    title: "We're giving sight to robotics.",
    lead: "Robots need sight to operate safely, intelligently, and autonomously. MorpheusTEK exists to give robotics and automation systems the perception they need to understand the world around them — and the support to get from prototype to production.",
    primaryCta: { label: "Book a meeting", href: "/book-a-meeting" },
  },
  intro: {
    eyebrow: "Solutions-based, not just hardware",
    title: "A full-stack perception partner — not just a distributor.",
    body1:
      "Most teams don't want to source LiDAR from one company, cameras from another, and compute from a third — then carry the risk of making it all work together. We help robotics and automation companies select, source, customize, and integrate the right combination of LiDAR, 3D cameras, safety sensing, and edge compute for their application.",
    body2:
      "The result is less integration risk, shorter development time, and a more reliable perception system — with U.S.-based application support, stocking, and supplier coordination behind it.",
    statValue: "90 days",
    statCaption: "Risk-free trial on every OLEI product",
  },
  manufacturing: {
    eyebrow: "Manufacturing strength behind the sensing stack",
    title: "Lesser-known in the U.S. doesn't mean unproven.",
    lead: "MorpheusTEK is the exclusive North American distributor for OLEI LiDAR. OLEI is part of a high-tech laser-measurement manufacturing network with deep OEM/ODM capability — a serious manufacturing foundation entering the North American robotics market.",
    scaleEyebrow: "World-scale supply",
    scaleTitle: "One of the world's largest laser-diode purchasing footprints.",
    scaleBody:
      "Laser diodes are the heart of every LiDAR — and OLEI's network buys them at a scale a startup can't match. That's supply security behind every MorpheusTEK unit.",
    closing:
      "MorpheusTEK adds the part that matters locally: application support, customization, stocking programs, and supplier coordination — so robotics OEMs and integrators get a manufacturing-backed perception partner, not just another sensor vendor.",
  },
  statCards: [
    { icon: "factory", title: "OEM / ODM", body: "Deep laser-measurement manufacturing capability behind the LiDAR." },
    { icon: "shield", title: "Safety options", body: "Type 3 / SIL2 / PL d safety LiDAR where a stop function is required." },
    { icon: "compass", title: "Exclusive NA", body: "The exclusive North American distributor for OLEI LiDAR." },
    { icon: "handshake", title: "U.S. support", body: "Customization, stocking, and supplier coordination on the ground." },
  ],
  howWeWork: {
    eyebrow: "How we work",
    title: "Advisor first. Nimble by design. Honest about fit.",
    cards: [
      { title: "We start with your problem", body: "We don't sell a part number before we understand the application. The customer is the hero; we're the guide." },
      { title: "We prove it, risk-free", body: "Every OLEI product ships with a 90-day risk-free trial — validate the data in your own environment before you commit." },
      { title: "We're honest about SICK", body: "We never trash a competitor's quality. We concede it and compete on value, the full stack, and the trial." },
    ],
    footer:
      "We've already helped robotics and automation companies customize 2D and 3D LiDAR for navigation, obstacle avoidance, and safety. (Customer names shared on request, with permission.)",
  },
  cta: {
    title: "Let's give your robot sight.",
    body: "Tell us what you're building. We'll map the right perception stack and put a trial unit in your hands.",
    primary: { label: "Book a meeting", href: "/book-a-meeting" },
    secondary: { label: "See the full stack", href: "/full-stack-perception" },
  },
};

export type CompareSickPageData = {
  meta: PageMeta;
  hero: { eyebrow: string; title: string; lead: string; primaryCta: PageCta; secondaryCta: PageCta };
  pillars: { title: string; body: string }[];
  table: {
    eyebrow: string;
    title: string;
    footnote: string;
    rows: { spec: string; mt: string; nano: string; micro: string }[];
  };
  fleet: {
    eyebrow: string;
    title: string;
    body: string;
    resourceTitle: string;
    resourceBlurb: string;
    resourceHref: string;
  };
  cta: CtaBandData;
};

export const compareSickPageDefaults: CompareSickPageData = {
  meta: {
    title: "The LiDAR Alternative to SICK — Safety LiDAR at a Fraction of the Price",
    description:
      "The OLEI GS1-5 carries the same safety class as SICK (Type 3 / SIL2 / PL d) at a fraction of the price, and beats the nanoScan3 on protective range — backed by a 90-day risk-free trial.",
  },
  hero: {
    eyebrow: "The honest comparison",
    title: "The LiDAR alternative to SICK.",
    lead: "SICK is excellent — nobody gets fired for buying it. The real question is whether your application needs to pay the SICK premium. For most commercial robotics, it doesn't.",
    primaryCta: { label: "Start a 90-day trial", href: "/book-a-meeting?intent=trial" },
    secondaryCta: { label: "Explore safety LiDAR", href: "/safety-lidar" },
  },
  pillars: [
    { title: "Same safety class", body: "The GS1-5 is certified to Type 3 / SIL2 / PL d — the same safety class as the nanoScan3 and microScan3." },
    { title: "Better on protective range", body: "5 m protective range beats the nanoScan3's 3 m — lead with that on smaller AGVs where the nanoScan3 is the default." },
    { title: "Risk-free to prove", body: "Put it on your AGV next to the SICK and see the data yourself for 90 days — no commitment." },
  ],
  table: {
    eyebrow: "GS1-5 vs SICK safety scanners",
    title: "Same class. Different math.",
    footnote:
      "Where a deal genuinely needs 9 m protective range or 128 fields, that's microScan3 territory — we won't oversell. There, the conversation is total cost across a fleet, plus the rest of the stack: 3D LiDAR, cameras, and edge compute.",
    rows: [
      { spec: "Scanning angle", mt: "270°", nano: "275°", micro: "275°" },
      { spec: "Safety rating", mt: "Type 3 · SIL2 · PL d", nano: "Type 3 · SIL2 · PL d", micro: "Type 3 · SIL2 · PL d" },
      { spec: "Protective range", mt: "5 m", nano: "3 m", micro: "up to 9 m" },
      { spec: "90-day risk-free trial", mt: "Yes", nano: "—", micro: "—" },
      { spec: "North American stocking & support", mt: "Yes", nano: "Channel", micro: "Channel" },
    ],
  },
  fleet: {
    eyebrow: "Fleet economics",
    title: "Multiply the per-unit delta by your unit count.",
    body: "On a 50-AGV build, the difference between a premium safety scanner and the GS1-5 — at the same safety class — is frequently the customer's whole project margin. That's the number worth running.",
    resourceTitle: "SICK / Hokuyo Alternative Comparison Checklist",
    resourceBlurb:
      "Evaluate lower-cost, more flexible alternatives to legacy safety scanners — without increasing technical risk. Range, FOV, certification, lead time, support, and total cost across a fleet.",
    resourceHref: "/resources/sick-hokuyo-alternative-comparison-checklist",
  },
  cta: {
    title: "See the GS1-5 in your own environment.",
    body: "Put it on your AGV next to the SICK and validate the data for 90 days. No commitment.",
    primary: { label: "Request a trial unit", href: "/book-a-meeting?intent=trial" },
    secondary: { label: "LiDAR alternative to Hokuyo", href: "/compare/hokuyo-alternative-lidar" },
  },
};

export type CustomSolutionsPageData = {
  meta: PageMeta;
  hero: { eyebrow: string; title: string; lead: string; primaryCta: PageCta };
  services: { icon: string; title: string; body: string }[];
  manufacturing: { eyebrow: string; title: string; body: string; cta: PageCta; bullets: string[] };
  cta: CtaBandData;
};

export const customSolutionsPageDefaults: CustomSolutionsPageData = {
  meta: {
    title: "Custom LiDAR & Camera Solutions for Robotics",
    description:
      "When off-the-shelf doesn't fit: custom field of view, range, mounting, housing, connectors, firmware, and integration — backed by OEM/ODM manufacturing and U.S.-based support.",
  },
  hero: {
    eyebrow: "Custom solutions",
    title: "When off-the-shelf doesn't fit, we build to your spec.",
    lead: "Customization is a big deal in robotics — and a big deal for us. Backed by OEM/ODM laser-measurement manufacturing, MorpheusTEK tailors the sensor to your platform, then adds the U.S.-based support to get it into production.",
    primaryCta: { label: "Talk to an engineer", href: "/book-a-meeting?intent=engineer" },
  },
  services: [
    { icon: "wrench", title: "Mechanical housing & mounting", body: "Custom enclosures, mounting, environmental protection, and form factors for your platform." },
    { icon: "gauge", title: "Perception performance tuning", body: "Field of view, range, resolution, scan rate, and safety zones tuned to the application." },
    { icon: "cable", title: "Cables & connectors", body: "Connectors, harnesses, and interfaces matched to your robot's wiring and I/O." },
    { icon: "cpu", title: "Firmware customization", body: "Firmware adjustments and configuration for your specific sensing requirements." },
    { icon: "blocks", title: "Software & middleware integration", body: "Drivers, SDKs, and ROS / ROS 2 integration support from prototype through production." },
  ],
  manufacturing: {
    eyebrow: "Manufacturing-backed",
    title: "A custom partner, not a catalog.",
    body: "Many robotics applications need adjustments an off-the-shelf sensor can't make. Because MorpheusTEK is backed by a high-tech laser-measurement manufacturing network with OEM/ODM capability, we can change the field of view, range, mounting, housing, connectors, or firmware — and support it from prototype through production.",
    cta: { label: "Discuss a custom build", href: "/book-a-meeting?intent=engineer" },
    bullets: [
      "Custom field of view, range, and resolution",
      "Mounting, housing, and environmental protection",
      "Safety-zone configuration and firmware adjustments",
      "Integration support from prototype through production",
    ],
  },
  cta: {
    title: "Tell us what off-the-shelf can't do.",
    body: "Bring the spec that doesn't exist yet. We'll tailor the sensor and support it into production.",
    primary: { label: "Talk to an engineer", href: "/book-a-meeting?intent=engineer" },
    secondary: { label: "Browse products", href: "/products" },
  },
};

export type BookMeetingIntent = { eyebrow: string; title: string; lead: string; submit: string };

export type BookMeetingPageData = {
  meta: PageMeta;
  intents: Record<string, BookMeetingIntent>;
  steps: { title: string; body: string }[];
  trustBullets: string[];
};

export const bookMeetingPageDefaults: BookMeetingPageData = {
  meta: {
    title: "Book a Meeting — Talk to a Perception Engineer",
    description:
      "Tell us what your robot needs to sense. A MorpheusTEK engineer will map the right LiDAR, camera, safety, and compute stack — and line up a 90-day risk-free trial.",
  },
  intents: {
    trial: {
      eyebrow: "90-day risk-free trial",
      title: "Put a unit on your robot — risk-free for 90 days.",
      lead: "Tell us the application and we'll match the right trial unit, agree what success looks like, and get it shipping. No commitment.",
      submit: "Request a trial unit",
    },
    engineer: {
      eyebrow: "Talk to an engineer",
      title: "Get a straight answer from a perception engineer.",
      lead: "Range, FOV, environment, safety, integration — bring the hard questions. We'll map the right sensing stack for your application.",
      submit: "Talk to an engineer",
    },
    quote: {
      eyebrow: "Get a quote",
      title: "Price the right stack for your build.",
      lead: "Share your application and quantities and we'll put together a quote — sensor, edge compute, cameras, and support, where it fits.",
      submit: "Request a quote",
    },
    meeting: {
      eyebrow: "Giving sight to robotics",
      title: "Let's get your robot seeing.",
      lead: "Tell us what you're building. We'll map the right perception stack and, if it fits, put a 90-day trial unit in your hands.",
      submit: "Book a meeting",
    },
  },
  steps: [
    { title: "Discovery", body: "We learn the application — what it must detect, at what range, in what environment." },
    { title: "90-day trial", body: "We ship the right unit and agree what “it works” means in your environment." },
    { title: "Deploy", body: "Prototype to production with U.S.-based support, stocking, and customization." },
  ],
  trustBullets: [
    "No spam — just a conversation about your application",
    "We sell the whole solution, not just a sensor",
    "North American support behind every deployment",
  ],
};

export type FullStackPageData = {
  meta: PageMeta;
  hero: { eyebrow: string; title: string; lead: string; primaryCta: PageCta; secondaryCta: PageCta };
  layers: { icon: string; title: string; body: string; href: string }[];
  stack: { eyebrow: string; title: string; rows: { layer: string; does: string; note: string }[]; footer: string };
  valueProps: { title: string; body: string }[];
  cta: CtaBandData;
};

export const fullStackPageDefaults: FullStackPageData = {
  meta: {
    title: "Full-Stack Robot Perception — LiDAR, 3D Cameras, Safety & Edge Compute",
    description:
      "One partner for the whole perception stack: 2D/3D LiDAR, dToF 3D cameras, Type 3/SIL2 safety sensing, and rugged edge compute — selected, sourced, and integrated to work together.",
  },
  hero: {
    eyebrow: "The full stack",
    title: "One partner for the whole perception stack.",
    lead: "A sensor by itself doesn't solve the application. The value is in the combination — hardware, drivers, calibration, perception, and the robot's decision. We help you get all of it working together.",
    primaryCta: { label: "Talk to an engineer", href: "/book-a-meeting?intent=engineer" },
    secondaryCta: { label: "Browse products", href: "/products" },
  },
  layers: [
    {
      icon: "radar",
      title: "LiDAR — 2D & 3D",
      body: "Planar scanning for navigation, safety fields, and SLAM; dense 3D point clouds for volumetric obstacle detection and mapping. From compact mini zone units to 16-line 100 m 3D.",
      href: "/lidar-for-robotics",
    },
    {
      icon: "shield",
      title: "Safety sensing",
      body: "The GS1-5 delivers Type 3 / SIL2 / PL d personnel-protection stop functions — the same safety class as SICK, at a fraction of the price, with a 90-day trial behind it.",
      href: "/safety-lidar",
    },
    {
      icon: "camera",
      title: "3D cameras",
      body: "dToF RGBD cameras return a valid depth value on every pixel — including black, reflective, and textureless surfaces that stereo cameras miss — plus aligned RGB and sunlight immunity.",
      href: "/3d-cameras-for-robotics",
    },
    {
      icon: "cpu",
      title: "Edge compute",
      body: "Rugged Jetson and Ryzen boxes that natively handle our LiDAR and cameras and run the perception stack on the robot — turning a sensor sale into a system that just works.",
      href: "/edge-compute",
    },
  ],
  stack: {
    eyebrow: "The perception stack",
    title: "From raw returns to reliable behavior.",
    rows: [
      { layer: "Sensor hardware", does: "Captures distance, depth, intensity, and point clouds.", note: "Where our LiDAR and 3D cameras enter the system." },
      { layer: "Drivers & SDK", does: "Moves data into the robot computer.", note: "ROS / ROS 2, Linux, Windows, Ethernet, USB, PoE." },
      { layer: "Calibration", does: "Aligns sensor data to the robot frame.", note: "Critical when multiple sensors fuse together." },
      { layer: "Perception", does: "Detects objects, free space, people, pallets, hazards.", note: "Turns raw returns into decisions the robot can use." },
      { layer: "Planning & control", does: "Navigates, stops, docks, picks, inspects.", note: "Where reliable perception becomes reliable behavior." },
    ],
    footer:
      "\"It sounds like this isn't just a sensor purchase — it's a perception problem.\" That's exactly where a full-stack partner earns its keep: matching the hardware, integration, and decision path to your robot.",
  },
  valueProps: [
    { title: "Less integration risk", body: "One partner coordinating LiDAR, cameras, safety, and compute — not three vendors and a hope." },
    { title: "Faster prototype to production", body: "Customization, stocking, and supplier coordination that keep your timeline intact." },
    { title: "A system, not a part", body: "Edge compute that natively handles our sensors means fewer integration headaches downstream." },
  ],
  cta: {
    title: "Build the stack with one partner.",
    body: "Tell us the application and we'll map LiDAR, cameras, safety, and compute that work together — on a 90-day trial.",
    primary: { label: "Book a meeting", href: "/book-a-meeting" },
    secondary: { label: "Custom solutions", href: "/custom-solutions" },
  },
};

export const defaultRobotTypes = [
  "AMR",
  "AGV",
  "Autonomous forklift",
  "Robotic cleaning",
  "Outdoor mobile robot",
  "Inspection robot",
  "Other / not sure yet",
];

/** Resolve runtime fallback when content-registry defaultData is null. */
export function pageContentFallback(key: string): unknown {
  switch (key) {
    case "page.about":
      return aboutPageDefaults;
    case "page.compare.sick":
      return compareSickPageDefaults;
    case "page.custom_solutions":
      return customSolutionsPageDefaults;
    case "page.book_meeting":
      return bookMeetingPageDefaults;
    case "page.full_stack":
      return fullStackPageDefaults;
    case "forms.robot_types":
      return defaultRobotTypes;
    default:
      return null;
  }
}
