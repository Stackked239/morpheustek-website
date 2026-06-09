import type { Metadata } from "next";
import { Compass, Factory, HandshakeIcon, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/marketing/PageHero";
import Image from "next/image";
import { CtaBand } from "@/components/marketing/CtaBand";

export const metadata: Metadata = {
  title: "Why MorpheusTEK — The Full-Stack Robot Perception Partner",
  description:
    "MorpheusTEK is the exclusive North American distributor for OLEI LiDAR and a full-stack perception partner — LiDAR, 3D cameras, safety sensing, and edge compute, backed by manufacturing strength and U.S.-based support.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Why MorpheusTEK"
        title={<>We&apos;re giving sight to robotics.</>}
        lead="Robots need sight to operate safely, intelligently, and autonomously. MorpheusTEK exists to give robotics and automation systems the perception they need to understand the world around them — and the support to get from prototype to production."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Why MorpheusTEK", href: "/about" },
        ]}
      >
        <Button href="/book-a-meeting" variant="primary" size="lg">
          Book a meeting
        </Button>
      </PageHero>

      {/* Who we are */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <Eyebrow>Solutions-based, not just hardware</Eyebrow>
              <h2 className="mt-4 font-display text-h2 font-extrabold text-text-strong">
                A full-stack perception partner — not just a distributor.
              </h2>
              <p className="mt-5 text-lead text-text-muted">
                Most teams don&apos;t want to source LiDAR from one company, cameras from another, and compute from a
                third — then carry the risk of making it all work together. We help robotics and automation companies
                select, source, customize, and integrate the right combination of LiDAR, 3D cameras, safety sensing,
                and edge compute for their application.
              </p>
              <p className="mt-4 leading-relaxed text-text-muted">
                The result is less integration risk, shorter development time, and a more reliable perception system —
                with U.S.-based application support, stocking, and supplier coordination behind it.
              </p>
            </div>
            <div className="corner-crop relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src="/media/robot-eye.jpg"
                alt="An autonomous warehouse robot with a glowing sensor eye navigating a facility aisle"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              {/* brand angled stat panel */}
              <div className="angle-panel absolute bottom-0 right-0 bg-accent py-4 pl-9 pr-6 text-accent-text">
                <div className="font-display text-[2.4rem] font-black uppercase leading-none">90 days</div>
                <div className="mt-1 max-w-[12rem] font-display text-xs font-bold uppercase leading-snug">
                  Risk-free trial on every OLEI product
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Manufacturing strength — proof, not lead */}
      <section className="dark relative overflow-hidden bg-bg">
        <div className="pointcloud-texture pointer-events-none absolute inset-0" aria-hidden />
        <Container className="relative grid gap-12 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow>Manufacturing strength behind the sensing stack</Eyebrow>
            <h2 className="mt-4 font-display text-h2 font-extrabold text-text-strong">
              Lesser-known in the U.S. doesn&apos;t mean unproven.
            </h2>
            <p className="mt-5 text-lead text-text-muted">
              MorpheusTEK is the exclusive North American distributor for OLEI LiDAR. OLEI is part of a high-tech
              laser-measurement manufacturing network with deep OEM/ODM capability and one of the largest laser-diode
              purchasing footprints in the world. That&apos;s a serious manufacturing foundation entering the North
              American robotics market.
            </p>
            <p className="mt-4 leading-relaxed text-text-muted">
              MorpheusTEK adds the part that matters locally: application support, customization, stocking programs, and
              supplier coordination — so robotics OEMs and integrators get a manufacturing-backed perception partner,
              not just another sensor vendor.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Factory, k: "OEM / ODM", v: "Deep laser-measurement manufacturing capability behind the LiDAR." },
              { icon: ShieldCheck, k: "Safety options", v: "Type 3 / SIL2 / PL d safety LiDAR where a stop function is required." },
              { icon: Compass, k: "Exclusive NA", v: "The exclusive North American distributor for OLEI LiDAR." },
              { icon: HandshakeIcon, k: "U.S. support", v: "Customization, stocking, and supplier coordination on the ground." },
            ].map((s) => (
              <div key={s.k} className="surface-card h-full p-5">
                <s.icon className="size-6 text-accent" />
                <div className="mt-3 font-display text-h5 font-bold text-text-strong">{s.k}</div>
                <p className="mt-1.5 text-sm leading-snug text-text-muted">{s.v}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How we work */}
      <Section tone="subtle">
        <Container>
          <Eyebrow>How we work</Eyebrow>
          <h2 className="mt-3 max-w-2xl font-display text-h2 font-extrabold text-text-strong">
            Advisor first. Nimble by design. Honest about fit.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { t: "We start with your problem", b: "We don't sell a part number before we understand the application. The customer is the hero; we're the guide." },
              { t: "We prove it, risk-free", b: "Every OLEI product ships with a 90-day risk-free trial — validate the data in your own environment before you commit." },
              { t: "We're honest about SICK", b: "We never trash a competitor's quality. We concede it and compete on value, the full stack, and the trial." },
            ].map((c) => (
              <div key={c.t} className="surface-card p-6">
                <h3 className="font-display text-h5 font-bold text-text-strong">{c.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{c.b}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-sm text-text-muted">
            We&apos;ve already helped robotics and automation companies customize 2D and 3D LiDAR for navigation,
            obstacle avoidance, and safety. (Customer names shared on request, with permission.)
          </p>
        </Container>
      </Section>

      <CtaBand
        title="Let's give your robot sight."
        body="Tell us what you're building. We'll map the right perception stack and put a trial unit in your hands."
        primary={{ label: "Book a meeting", href: "/book-a-meeting" }}
        secondary={{ label: "See the full stack", href: "/full-stack-perception" }}
      />
    </>
  );
}
