import type { Metadata } from "next";
import { Camera, Cpu, Radar, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/marketing/PageHero";
import { CtaBand } from "@/components/marketing/CtaBand";

export const metadata: Metadata = {
  title: "Full-Stack Robot Perception — LiDAR, 3D Cameras, Safety & Edge Compute",
  description:
    "One partner for the whole perception stack: 2D/3D LiDAR, dToF 3D cameras, Type 3/SIL2 safety sensing, and rugged edge compute — selected, sourced, and integrated to work together.",
  alternates: { canonical: "/full-stack-perception" },
};

const layers = [
  {
    icon: Radar,
    title: "LiDAR — 2D & 3D",
    body: "Planar scanning for navigation, safety fields, and SLAM; dense 3D point clouds for volumetric obstacle detection and mapping. From $595 mini zone units to 16-line 100 m 3D.",
    href: "/lidar-for-robotics",
  },
  {
    icon: ShieldCheck,
    title: "Safety sensing",
    body: "The GS1-5 delivers Type 3 / SIL2 / PL d personnel-protection stop functions — the same safety class as SICK, at a fraction of the price, with a 90-day trial behind it.",
    href: "/safety-lidar",
  },
  {
    icon: Camera,
    title: "3D cameras",
    body: "dToF RGBD cameras return a valid depth value on every pixel — including black, reflective, and textureless surfaces that stereo cameras miss — plus aligned RGB and sunlight immunity.",
    href: "/3d-cameras-for-robotics",
  },
  {
    icon: Cpu,
    title: "Edge compute",
    body: "Rugged Jetson and Ryzen boxes that natively handle our LiDAR and cameras and run the perception stack on the robot — turning a sensor sale into a system that just works.",
    href: "/edge-compute",
  },
];

const stack = [
  { layer: "Sensor hardware", does: "Captures distance, depth, intensity, and point clouds.", note: "Where our LiDAR and 3D cameras enter the system." },
  { layer: "Drivers & SDK", does: "Moves data into the robot computer.", note: "ROS / ROS 2, Linux, Windows, Ethernet, USB, PoE." },
  { layer: "Calibration", does: "Aligns sensor data to the robot frame.", note: "Critical when multiple sensors fuse together." },
  { layer: "Perception", does: "Detects objects, free space, people, pallets, hazards.", note: "Turns raw returns into decisions the robot can use." },
  { layer: "Planning & control", does: "Navigates, stops, docks, picks, inspects.", note: "Where reliable perception becomes reliable behavior." },
];

export default function FullStackPage() {
  return (
    <>
      <PageHero
        eyebrow="The full stack"
        title="One partner for the whole perception stack."
        lead="A sensor by itself doesn't solve the application. The value is in the combination — hardware, drivers, calibration, perception, and the robot's decision. We help you get all of it working together."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Full-stack perception", href: "/full-stack-perception" },
        ]}
      >
        <Button href="/book-a-meeting?intent=engineer" variant="primary" size="lg">
          Talk to an engineer
        </Button>
        <Button href="/products" variant="ghost" size="lg">
          Browse products
        </Button>
      </PageHero>

      {/* Four layers */}
      <Section>
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            {layers.map((l) => (
              <a
                key={l.title}
                href={l.href}
                className="group flex gap-5 rounded-lg border border-border bg-surface p-7 transition-colors hover:border-border-strong"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-md bg-bg-muted text-brand-blue">
                  <l.icon className="size-6" />
                </span>
                <div>
                  <h2 className="font-display text-h4 font-bold text-text-strong group-hover:text-brand-blue">{l.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">{l.body}</p>
                </div>
              </a>
            ))}
          </div>
        </Container>
      </Section>

      {/* Perception stack chain */}
      <Section tone="subtle">
        <Container>
          <Eyebrow>The perception stack</Eyebrow>
          <h2 className="mt-3 max-w-2xl font-display text-h2 font-extrabold text-text-strong">
            From raw returns to reliable behavior.
          </h2>
          <div className="mt-10 overflow-hidden rounded-lg border border-border">
            {stack.map((s, i) => (
              <div
                key={s.layer}
                className={`grid items-center gap-4 p-5 sm:grid-cols-[auto_1fr_1.4fr] ${i % 2 ? "bg-bg-muted/40" : "bg-surface"} ${i ? "border-t border-border" : ""}`}
              >
                <span className="font-mono text-sm font-bold text-brand-blue">{`0${i + 1}`}</span>
                <span className="font-display text-h5 font-bold text-text-strong">{s.layer}</span>
                <span className="text-sm text-text-muted">
                  <span className="text-text">{s.does}</span> {s.note}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-text-muted">
            &ldquo;It sounds like this isn&apos;t just a sensor purchase — it&apos;s a perception problem.&rdquo; That&apos;s exactly
            where a full-stack partner earns its keep: matching the hardware, integration, and decision path to your robot.
          </p>
        </Container>
      </Section>

      {/* Single source value */}
      <Section>
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { t: "Less integration risk", b: "One partner coordinating LiDAR, cameras, safety, and compute — not three vendors and a hope." },
              { t: "Faster prototype to production", b: "Customization, stocking, and supplier coordination that keep your timeline intact." },
              { t: "A system, not a part", b: "Edge compute that natively handles our sensors means fewer integration headaches downstream." },
            ].map((c) => (
              <div key={c.t} className="surface-card p-6">
                <h3 className="font-display text-h5 font-bold text-text-strong">{c.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{c.b}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Build the stack with one partner."
        body="Tell us the application and we'll map LiDAR, cameras, safety, and compute that work together — on a 90-day trial."
        primary={{ label: "Book a meeting", href: "/book-a-meeting" }}
        secondary={{ label: "Custom solutions", href: "/custom-solutions" }}
      />
    </>
  );
}
