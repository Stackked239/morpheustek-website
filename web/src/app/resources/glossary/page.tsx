import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/marketing/PageHero";
import { CtaBand } from "@/components/marketing/CtaBand";

export const metadata: Metadata = {
  title: "Robotics Perception Glossary — LiDAR, SLAM, Pose & More",
  description:
    "Plain-English definitions of robotics perception terms: LiDAR, point cloud, SLAM, localization, pose, field of view, obstacle avoidance, ROS, SDK, safety-rated sensing, and more.",
  alternates: { canonical: "/resources/glossary" },
};

const terms: { term: string; def: string }[] = [
  { term: "Perception", def: "Turning sensor data into useful understanding — objects, people, free space, distance, edges, pallet pockets, and hazards." },
  { term: "Point cloud", def: "A 3D collection of measured points. Each point is a location in space detected by LiDAR or a depth camera." },
  { term: "SLAM", def: "Simultaneous Localization and Mapping — the robot builds or updates a map while estimating where it is within that map." },
  { term: "Localization", def: "Figuring out where the robot is within a known map. Poor sensor data causes drift and failed navigation." },
  { term: "Pose", def: "The robot's position and orientation — where it is and which way it's facing." },
  { term: "Field of view (FOV)", def: "How wide and tall a sensor can see. A wide FOV reduces blind spots." },
  { term: "Obstacle avoidance", def: "Detecting an object in the robot's path and slowing, stopping, or rerouting." },
  { term: "Safety-rated sensor", def: "A sensor certified for safety functions under applicable standards (e.g. Type 3 / SIL2 / PL d). Don't claim a standard sensor is safety-rated unless it is." },
  { term: "Protective field", def: "A defined area a safety scanner monitors for intrusion, used to slow or stop a machine." },
  { term: "dToF", def: "Direct Time-of-Flight — a depth-sensing method that returns a valid depth value per pixel, even on black, reflective, or textureless surfaces." },
  { term: "ROS / ROS 2", def: "Robot Operating System — a common software framework for robotics drivers, messages, and integration." },
  { term: "Edge compute", def: "On-board computing that runs the perception stack at the robot, for non-cloud or latency-sensitive environments." },
];

export default function GlossaryPage() {
  return (
    <>
      <PageHero
        eyebrow="Robotics glossary"
        title="The perception vocabulary, in plain English."
        lead="A quick reference for the language of robot sensing — useful before a discovery call, after a trade show, or when you just want a straight definition."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Glossary", href: "/resources/glossary" },
        ]}
      />
      <Section>
        <Container>
          <dl className="grid gap-px overflow-hidden rounded-lg border border-border bg-border">
            {terms.map((t) => (
              <div key={t.term} className="grid gap-1 bg-surface p-5 sm:grid-cols-[14rem_1fr] sm:gap-6">
                <dt className="font-display text-h5 font-bold text-text-strong">{t.term}</dt>
                <dd className="text-sm leading-relaxed text-text-muted">{t.def}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>
      <CtaBand
        title="Ready to get specific?"
        body="Bring your application and we'll translate it into the right sensing stack."
        primary={{ label: "Talk to an engineer", href: "/book-a-meeting?intent=engineer" }}
        secondary={{ label: "Browse the library", href: "/resources" }}
      />
    </>
  );
}
