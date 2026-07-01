/**
 * Registry of every editable content block outside the catalog tables.
 * Used by the seed script and /admin content editor.
 */

import {
  defaultAssemblyHeader,
  defaultBoothMode,
  defaultBuildToSpecContent,
  defaultCategoryBrowseContent,
  defaultCertifyContent,
  defaultHeroContent,
  defaultLayoutMetadata,
  defaultProductOfMonth,
  defaultRangeLedgerHeader,
  defaultTrustBandContent,
} from "@/lib/cms/home-defaults";

export type ContentBlockDef = {
  key: string;
  label: string;
  group: string;
  /** Default payload when seeding or CMS is offline */
  defaultData: unknown;
};

export const contentBlockRegistry: ContentBlockDef[] = [
  {
    key: "site.settings",
    label: "Site settings & navigation",
    group: "Site",
    defaultData: null, // filled at seed time from site.ts
  },
  {
    key: "layout.metadata",
    label: "Global SEO metadata",
    group: "Site",
    defaultData: defaultLayoutMetadata,
  },
  {
    key: "layout.booth_mode",
    label: "Trade-show booth mode",
    group: "Merchandising",
    defaultData: defaultBoothMode,
  },
  {
    key: "merch.product_of_month",
    label: "Product of the month",
    group: "Merchandising",
    defaultData: defaultProductOfMonth,
  },
  {
    key: "layout.topbar",
    label: "Top bar announcement",
    group: "Layout",
    defaultData: {
      message: "Catch us at Automate — June 22, Chicago",
      href: "/shows/meet-us-at-the-booth",
      boothCta: "Meet us at the booth →",
    },
  },
  {
    key: "homepage.hero",
    label: "Homepage hero",
    group: "Homepage",
    defaultData: defaultHeroContent,
  },
  {
    key: "homepage.range_ledger",
    label: "Range / sensing envelope section",
    group: "Homepage",
    defaultData: defaultRangeLedgerHeader,
  },
  {
    key: "homepage.assembly",
    label: "Assembly stack section",
    group: "Homepage",
    defaultData: defaultAssemblyHeader,
  },
  {
    key: "homepage.certify",
    label: "Certify plot section",
    group: "Homepage",
    defaultData: defaultCertifyContent,
  },
  {
    key: "homepage.category_browse",
    label: "Category browse section",
    group: "Homepage",
    defaultData: defaultCategoryBrowseContent,
  },
  {
    key: "homepage.trust_band",
    label: "Trust band section",
    group: "Homepage",
    defaultData: defaultTrustBandContent,
  },
  {
    key: "homepage.build_to_spec",
    label: "Build to spec section",
    group: "Homepage",
    defaultData: defaultBuildToSpecContent,
  },
  {
    key: "homepage.cta_band",
    label: "Homepage closing CTA",
    group: "Homepage",
    defaultData: {
      eyebrow: "The 90-day acceptance test",
      title: "Try it free, 90 days. Your floor.",
      body: "Put a MorpheusTEK unit in your own environment and prove it on your robots. If it doesn't earn its place, send it back — no commitment.",
      primary: { label: "Start a 90-day trial", href: "/book-a-meeting?intent=trial" },
      secondary: { label: "Talk to an engineer", href: "/book-a-meeting?intent=engineer" },
    },
  },
  {
    key: "page.about",
    label: "About page",
    group: "Pages",
    defaultData: null,
  },
  {
    key: "page.shows",
    label: "Shows page",
    group: "Pages",
    defaultData: {
      hero: {
        eyebrow: "Shows we'll be at",
        title: "Find us on the floor.",
        lead: "We're at the major North American robotics and automation shows — a national footprint you can meet in person.",
      },
      shows: [
        { name: "Automate", city: "Detroit, MI", when: "Late June 2026", next: true },
        { name: "MODEX", city: "Atlanta, GA", when: "2026" },
        { name: "ProMat", city: "Chicago, IL", when: "2026" },
        { name: "Robotics Summit & Expo", city: "Boston, MA", when: "2026" },
        { name: "A3 Business Forum", city: "Orlando, FL", when: "2026" },
        { name: "CES", city: "Las Vegas, NV", when: "2026" },
      ],
      cta: {
        eyebrow: "Coming to a show?",
        title: "Tell us you'll be there.",
        body: "We'll have a demo ready and save you time on the floor.",
        primary: { label: "Meet us at the booth", href: "/shows/meet-us-at-the-booth" },
        secondary: { label: "Browse products first", href: "/products" },
      },
    },
  },
  {
    key: "page.glossary",
    label: "Glossary terms",
    group: "Pages",
    defaultData: {
      title: "Robotics glossary",
      lead: "Plain-English definitions for the perception terms you'll see across our site and spec sheets.",
      terms: [
        { term: "Perception", def: "The sensors and software that let a robot sense its environment — LiDAR, cameras, depth, safety fields, and the compute that fuses them." },
        { term: "Point cloud", def: "A 3D set of points measured by a LiDAR or depth sensor, each with x/y/z (and often intensity). The raw geometry a robot uses to see." },
        { term: "SLAM", def: "Simultaneous Localization and Mapping — building a map while tracking where the robot is inside it." },
        { term: "Localization", def: "Knowing where the robot is in a map or facility frame." },
        { term: "Pose", def: "Position + orientation of the robot (or sensor) in space." },
        { term: "Field of view (FOV)", def: "The angular region a sensor can see. 360° LiDAR sees all around; a forward camera sees a cone." },
        { term: "Obstacle avoidance", def: "Detecting and reacting to obstacles — slowing, replanning, or stopping." },
        { term: "Safety-rated sensor", def: "A sensor certified for functional safety stop functions (e.g. Type 3 / SIL2 / PL d)." },
        { term: "Protective field", def: "The safety zone where a person or object triggers a stop." },
        { term: "dToF", def: "Direct time-of-flight depth — measures distance per pixel by timing light pulses." },
        { term: "ROS / ROS 2", def: "Robot Operating System — the common middleware stack for robotics software." },
        { term: "Edge compute", def: "On-vehicle processing that runs perception and inference without relying on the cloud." },
      ],
    },
  },
  {
    key: "page.compare.sick",
    label: "SICK comparison page",
    group: "Pages",
    defaultData: null,
  },
  {
    key: "page.custom_solutions",
    label: "Custom solutions page",
    group: "Pages",
    defaultData: null,
  },
  {
    key: "page.full_stack",
    label: "Full-stack perception page",
    group: "Pages",
    defaultData: null,
  },
  {
    key: "page.book_meeting",
    label: "Book a meeting page",
    group: "Pages",
    defaultData: null,
  },
  {
    key: "forms.robot_types",
    label: "Lead form robot type options",
    group: "Forms",
    defaultData: [
      "AMR",
      "AGV",
      "Autonomous forklift",
      "Robotic cleaning",
      "Outdoor mobile robot",
      "Inspection robot",
      "Other / not sure yet",
    ],
  },
  {
    key: "forms.intents",
    label: "Book-a-meeting intents",
    group: "Forms",
    defaultData: null,
  },
];
