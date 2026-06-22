/**
 * Site-wide configuration: company facts, navigation, conversions.
 * Single source of truth for chrome (header/footer/mega-menu) and metadata.
 * Facts sourced from the Olei×MorpheusTEK flyer + discovery calls + ICP doc.
 */

export const site = {
  name: "MorpheusTEK",
  tagline: "Giving Sight to Robotics",
  domain: "morpheustek.com",
  url: "https://morpheustek.com",
  email: "sales@morpheusTEK.com",
  // Per the official brand guide (06/26). NOTE: the flyer listed (302) 803-5357 — confirm with Phil/Tom.
  phone: "(302) 789-0421",
  phoneHref: "+13027890421",
  address: "Morpheus Tek, Inc. · PO Box 1988 · Silverton, OR 97381",
  // The full-stack one-liner (Phil's words, web version)
  oneLiner:
    "MorpheusTEK gives robots the sensing stack they need to see, navigate, avoid obstacles, and operate safely in the real world.",
  // StoryBrand: the visitor's PROBLEM, stated above the fold (Tom's #1 ask).
  heroProblem: "Your robot can't see well enough, safely enough, or affordably enough — yet.",
  // ICP-A dream headline that seeds the hero (keyword-rich = the H1)
  heroHeadline:
    "Give your robot the right LiDAR, camera, and perception stack to navigate, avoid obstacles, and operate safely.",
  heroHeadlineVariants: [
    "Full-stack robot perception — LiDAR, 3D cameras, safety sensing, and edge compute, from one partner.",
    "The LiDAR alternative to SICK — same safety class, a fraction of the price, proven in your environment.",
    "From prototype to production: the perception stack that gets your robot shipping.",
  ],
  differentiator:
    "Unlike everyone else, MorpheusTEK helps robotics companies deploy the right full-stack perception solution — not just buy another sensor.",
  // The three lines for every deal
  pillars: [
    "Same safety class as SICK (Type 3 / SIL2 / PL d) at a fraction of the price.",
    "Try it free for 90 days in your own environment — no commitment.",
    "The whole solution — sensor, edge compute, cameras, and North American support.",
  ],
  distributor: "Exclusive North American distributor for OLEI LiDAR",
} as const;

/** Primary CTAs — the A+ and high-value conversions. */
export const primaryCta = {
  trial: { label: "Start a 90-day trial", href: "/book-a-meeting?intent=trial" },
  meeting: { label: "Book a meeting", href: "/book-a-meeting" },
  engineer: { label: "Talk to an engineer", href: "/book-a-meeting?intent=engineer" },
  quote: { label: "Get a quote", href: "/book-a-meeting?intent=quote" },
} as const;

export type NavLink = { label: string; href: string; description?: string };

/** Top navigation (Shows surfaces as a seasonal banner, not nav). */
export const mainNav: { label: string; href: string }[] = [
  { label: "Products", href: "/products" },
  { label: "Applications", href: "/applications" },
  { label: "Compare", href: "/compare/sick-alternative-lidar" },
  { label: "Resources", href: "/resources" },
  { label: "Robotics glossary", href: "/resources/glossary" },
  { label: "Blog", href: "/blog" },
  { label: "Why us", href: "/about" },
];

/** Capability/solution pages surfaced in the Products mega-menu "Beyond the catalog"
 *  row — differentiators (build-to-spec, full-stack) otherwise only in the footer. */
export const solutionsLinks: NavLink[] = [
  { label: "Custom solutions", href: "/custom-solutions", description: "Build to your spec — FOV, housing, firmware, connectors." },
  { label: "Full-stack perception", href: "/full-stack-perception", description: "LiDAR, 3D cameras, safety, and edge compute as one stack." },
];

export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Products",
    links: [
      { label: "2D LiDAR", href: "/lidar-for-robotics" },
      { label: "Safety LiDAR", href: "/safety-lidar" },
      { label: "3D LiDAR", href: "/3d-lidar-for-robotics" },
      { label: "Solid-state LiDAR", href: "/solid-state-lidar" },
      { label: "3D cameras", href: "/3d-cameras-for-robotics" },
      { label: "Edge compute", href: "/edge-compute" },
    ],
  },
  {
    heading: "Solutions",
    links: [
      { label: "Full-stack perception", href: "/full-stack-perception" },
      { label: "Custom solutions", href: "/custom-solutions" },
      { label: "Applications", href: "/applications" },
      { label: "LiDAR alternative to SICK", href: "/compare/sick-alternative-lidar" },
      { label: "LiDAR alternative to Hokuyo", href: "/compare/hokuyo-alternative-lidar" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Technical library", href: "/resources" },
      { label: "Robotics glossary", href: "/resources/glossary" },
      { label: "Eyes at the Edge", href: "/blog" },
      { label: "Product of the month", href: "/product-of-the-month" },
      { label: "Shows we'll be at", href: "/shows" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Why MorpheusTEK", href: "/about" },
      { label: "Book a meeting", href: "/book-a-meeting" },
      { label: "Meet us at the booth", href: "/shows/meet-us-at-the-booth" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
