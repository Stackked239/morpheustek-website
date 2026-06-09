import type { Metadata } from "next";
import { Blocks, Cable, Cpu, Gauge, Wrench } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/marketing/PageHero";
import { CtaBand } from "@/components/marketing/CtaBand";
import { EyeIcon } from "@/components/brand/EyeIcon";

export const metadata: Metadata = {
  title: "Custom LiDAR & Camera Solutions for Robotics",
  description:
    "When off-the-shelf doesn't fit: custom field of view, range, mounting, housing, connectors, firmware, and integration — backed by OEM/ODM manufacturing and U.S.-based support.",
  alternates: { canonical: "/custom-solutions" },
};

const services = [
  { icon: Wrench, title: "Mechanical housing & mounting", body: "Custom enclosures, mounting, environmental protection, and form factors for your platform." },
  { icon: Gauge, title: "Perception performance tuning", body: "Field of view, range, resolution, scan rate, and safety zones tuned to the application." },
  { icon: Cable, title: "Cables & connectors", body: "Connectors, harnesses, and interfaces matched to your robot's wiring and I/O." },
  { icon: Cpu, title: "Firmware customization", body: "Firmware adjustments and configuration for your specific sensing requirements." },
  { icon: Blocks, title: "Software & middleware integration", body: "Drivers, SDKs, and ROS / ROS 2 integration support from prototype through production." },
];

export default function CustomSolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Custom solutions"
        title="When off-the-shelf doesn't fit, we build to your spec."
        lead="Customization is a big deal in robotics — and a big deal for us. Backed by OEM/ODM laser-measurement manufacturing, MorpheusTEK tailors the sensor to your platform, then adds the U.S.-based support to get it into production."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Custom solutions", href: "/custom-solutions" },
        ]}
      >
        <Button href="/book-a-meeting?intent=engineer" variant="primary" size="lg">
          Talk to an engineer
        </Button>
      </PageHero>

      <Section>
        <Container>
          <Eyebrow>What we tailor</Eyebrow>
          <h2 className="mt-3 max-w-2xl font-display text-h2 font-extrabold uppercase text-text-strong">
            Custom from housing to firmware.
          </h2>
          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.title} className="flex flex-col items-start">
                <EyeIcon icon={s.icon} size={84} />
                <h3 className="mt-4 font-display text-h5 font-bold uppercase text-text-strong">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="subtle">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <Eyebrow>Manufacturing-backed</Eyebrow>
              <h2 className="mt-3 font-display text-h2 font-extrabold uppercase text-text-strong">
                A custom partner, not a catalog.
              </h2>
              <p className="mt-5 text-lead text-text-muted">
                Many robotics applications need adjustments an off-the-shelf sensor can't make. Because MorpheusTEK is
                backed by a high-tech laser-measurement manufacturing network with OEM/ODM capability, we can change the
                field of view, range, mounting, housing, connectors, or firmware — and support it from prototype through
                production.
              </p>
              <div className="mt-8">
                <Button href="/book-a-meeting?intent=engineer" variant="primary" size="lg">
                  Discuss a custom build
                </Button>
              </div>
            </div>
            <ul className="grid gap-3">
              {["Custom field of view, range, and resolution", "Mounting, housing, and environmental protection", "Safety-zone configuration and firmware adjustments", "Integration support from prototype through production"].map((t) => (
                <li key={t} className="surface-card flex items-start gap-3 p-4 text-sm text-text">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Tell us what off-the-shelf can't do."
        body="Bring the spec that doesn't exist yet. We'll tailor the sensor and support it into production."
        primary={{ label: "Talk to an engineer", href: "/book-a-meeting?intent=engineer" }}
        secondary={{ label: "Browse products", href: "/products" }}
      />
    </>
  );
}
