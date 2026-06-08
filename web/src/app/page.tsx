import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Camera,
  Cpu,
  Radar,
  ScanEye,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { CtaBand } from "@/components/marketing/CtaBand";
import { HeroVideo } from "@/components/marketing/HeroVideo";
import { site } from "@/lib/site";
import { applications, getProduct } from "@/lib/catalog";

const fullStack = [
  { icon: Radar, title: "LiDAR — 2D & 3D", body: "Navigation, mapping, obstacle detection, and protective zones, from $595 mini-scanners to 16-line 3D." },
  { icon: ShieldCheck, title: "Safety sensing", body: "Type 3 / SIL2 / PL d safety LiDAR for personnel-protection stop functions — the same class as SICK." },
  { icon: Camera, title: "3D cameras", body: "dToF RGBD that returns valid depth on black, reflective, and textureless surfaces stereo cameras miss." },
  { icon: Cpu, title: "Edge compute", body: "Rugged Jetson and Ryzen boxes that run the perception stack on top of our sensors, on the robot." },
];

const plan = [
  { n: "01", title: "Discovery", body: "Tell us what your robot must detect, at what range, in what environment, and how the data gets into your stack. We map the right sensing solution — no part-number guessing." },
  { n: "02", title: "90-day trial", body: "Put the unit on your robot, next to the incumbent, and validate the point cloud in your own environment. Risk-free for 90 days — the strongest tool we have." },
  { n: "03", title: "Deploy", body: "Move from prototype to production with U.S.-based support, stocking, customization, and supplier coordination behind you." },
];

const homeProducts = ["gs1-5-safety-lidar", "lr-1f-2d-lidar", "lr-16f-100-3d-lidar", "mrdvs-s11-rgbd-camera"]
  .map(getProduct)
  .filter((p): p is NonNullable<typeof p> => Boolean(p));

const homeApps = ["amr", "autonomous-forklift", "warehouse-logistics", "outdoor-mobile"]
  .map((s) => applications.find((a) => a.slug === s))
  .filter((a): a is NonNullable<typeof a> => Boolean(a));

export default function HomePage() {
  return (
    <>
      {/* ============================== HERO ============================== */}
      <section className="dark relative isolate flex min-h-[88vh] items-center overflow-hidden bg-bg">
        <HeroVideo src="/media/hero.mp4" poster="/media/hero-warehouse.jpg" className="absolute inset-0 size-full" />
        <div className="absolute inset-0 bg-gradient-to-r from-mt-navy-900 via-mt-navy-900/85 to-mt-navy-900/25" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-mt-navy-900 via-transparent to-mt-navy-900/40" aria-hidden />
        <Container className="relative z-10 py-24 md:py-28">
          <div className="max-w-2xl">
            <Eyebrow>{site.distributor}</Eyebrow>
            <h1 className="mt-5 font-display text-[clamp(2.5rem,6vw,4.25rem)] font-extrabold leading-[1.03] tracking-[-0.02em] text-text-strong">
              {site.heroHeadline}
            </h1>
            <p className="mt-6 max-w-xl text-lead text-text">{site.oneLiner}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/book-a-meeting?intent=trial" variant="primary" size="lg">
                Start a 90-day trial
              </Button>
              <Button href="/book-a-meeting?intent=engineer" variant="ghost" size="lg">
                Talk to an engineer
              </Button>
            </div>
            <ul className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm text-text">
              {["90-day risk-free trial", "Same safety class as SICK", "North American support"].map((t) => (
                <li key={t} className="inline-flex items-center gap-2">
                  <BadgeCheck className="size-4 text-accent" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </Container>
        <div className="pointer-events-none absolute bottom-8 right-6 z-10 hidden flex-col items-end gap-2 md:flex">
          {["270° FOV", "SIL2 · PL d", "5 m protective", "100k lux"].map((label) => (
            <span
              key={label}
              className="rounded-full border border-border bg-surface/80 px-3 py-1 font-mono text-xs font-medium text-text-muted backdrop-blur"
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* ============================== PILLARS STRIP ============================== */}
      <section className="border-y border-border bg-bg-subtle">
        <Container className="grid gap-px md:grid-cols-3">
          {site.pillars.map((p, i) => (
            <div key={i} className="flex items-start gap-3 py-6 md:px-6 md:first:pl-0 md:last:pr-0">
              <span className="mt-0.5 font-mono text-sm font-bold text-brand-blue">{`0${i + 1}`}</span>
              <p className="text-sm font-medium text-text">{p}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* ============================== PROBLEM ============================== */}
      <Section>
        <Container>
          <Reveal className="max-w-3xl">
            <Eyebrow>The problem</Eyebrow>
            <h2 className="mt-4 font-display text-h2 font-extrabold text-text-strong">
              Your robot can&apos;t see well enough, safely enough, or affordably enough — yet.
            </h2>
            <p className="mt-5 text-lead text-text-muted">
              Off-the-shelf sensors don&apos;t always meet the application. Legacy suppliers are expensive and slow.
              And piecing LiDAR from one vendor, cameras from another, and compute from a third — then hoping it all
              works together — is how programs slip.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Reliable navigation & obstacle avoidance", b: "People, pallets, racks, drop-offs, and the unexpected — detected in the real world." },
              { t: "Safety & compliance", b: "Safe operation around people and equipment, with safety-rated zones where required." },
              { t: "Integration & production readiness", b: "Sensors that fit the mechanical design, the software stack, and the production timeline." },
              { t: "Cost & availability pressure", b: "An alternative to expensive legacy suppliers and long lead times, prototype to production." },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i * 60}>
                <div className="surface-card h-full p-5">
                  <h3 className="font-display text-h5 font-bold text-text-strong">{c.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">{c.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ============================== GUIDE / PLAN ============================== */}
      <Section tone="subtle">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <Reveal>
              <Eyebrow>A simple plan</Eyebrow>
              <h2 className="mt-4 font-display text-h2 font-extrabold text-text-strong">
                From &ldquo;I need a sensor&rdquo; to &ldquo;my robot ships.&rdquo;
              </h2>
              <p className="mt-5 text-lead text-text-muted">
                You know your product and your customers better than anyone. We bring the perception expertise — and a
                process that de-risks the decision at every step.
              </p>
              <p className="mt-6 max-w-md font-display text-h4 font-bold text-text-strong">
                &ldquo;{site.differentiator}&rdquo;
              </p>
            </Reveal>
            <div className="grid gap-4">
              {plan.map((s, i) => (
                <Reveal key={s.n} delay={i * 80}>
                  <div className="surface-card flex gap-5 p-6">
                    <span className="font-display text-h3 font-black text-accent">{s.n}</span>
                    <div>
                      <h3 className="font-display text-h4 font-bold text-text-strong">{s.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{s.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ============================== FULL STACK ============================== */}
      <Section>
        <Container>
          <Reveal className="max-w-3xl">
            <Eyebrow>The full stack</Eyebrow>
            <h2 className="mt-4 font-display text-h2 font-extrabold text-text-strong">
              One partner for the whole perception stack.
            </h2>
            <p className="mt-5 text-lead text-text-muted">
              LiDAR, 3D cameras, safety sensing, and edge compute — selected, sourced, and integrated to work together.
              Less integration risk, faster prototype-to-production, a more reliable perception system.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {fullStack.map((f, i) => (
              <Reveal key={f.title} delay={i * 60}>
                <div className="elevated-card flex h-full flex-col p-6">
                  <span className="grid size-11 place-items-center rounded-md bg-bg-muted text-brand-blue">
                    <f.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-display text-h5 font-bold text-text-strong">{f.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-8">
            <Button href="/full-stack-perception" variant="quiet" size="md">
              See how the stack fits together <ArrowRight className="size-4" />
            </Button>
          </div>
        </Container>
      </Section>

      {/* ============================== 90-DAY TRIAL BANNER ============================== */}
      <section className="bg-accent text-accent-text">
        <Container className="flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <BadgeCheck className="mt-1 size-8 shrink-0" />
            <div>
              <h2 className="font-display text-h3 font-extrabold text-accent-text">Try it free for 90 days, in your own environment.</h2>
              <p className="mt-1 max-w-2xl text-sm font-medium text-accent-text/80">
                Put a unit on your robot next to the incumbent and see the data yourself — no commitment. It&apos;s how
                cold-sourced deals become design-ins.
              </p>
            </div>
          </div>
          <Button href="/book-a-meeting?intent=trial" variant="secondary" size="lg" className="shrink-0">
            Request a trial unit
          </Button>
        </Container>
      </section>

      {/* ============================== FEATURED PRODUCTS ============================== */}
      <Section tone="subtle">
        <Container wide>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Reveal>
              <Eyebrow>The line-up</Eyebrow>
              <h2 className="mt-4 font-display text-h2 font-extrabold text-text-strong">Proven sensing, in stock.</h2>
            </Reveal>
            <Button href="/products" variant="ghost" size="md">
              Browse all products
            </Button>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {homeProducts.map((p, i) => (
              <Reveal key={p.slug} delay={i * 60}>
                <ProductCard product={p} className="h-full" />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ============================== APPLICATIONS ============================== */}
      <Section>
        <Container>
          <Reveal className="max-w-3xl">
            <Eyebrow>Built for your application</Eyebrow>
            <h2 className="mt-4 font-display text-h2 font-extrabold text-text-strong">
              Perception, matched to what your robot does.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {homeApps.map((a, i) => (
              <Reveal key={a.slug} delay={i * 60}>
                <Link
                  href={`/applications/${a.slug}`}
                  className="group flex items-start gap-5 rounded-lg border border-border bg-surface p-6 transition-colors hover:border-border-strong"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-md bg-bg-muted text-brand-blue">
                    <Workflow className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-h4 font-bold text-text-strong group-hover:text-brand-blue">{a.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{a.pain}</p>
                  </div>
                  <ArrowRight className="ml-auto mt-1 size-5 shrink-0 text-text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-8">
            <Button href="/applications" variant="quiet" size="md">
              All applications <ArrowRight className="size-4" />
            </Button>
          </div>
        </Container>
      </Section>

      {/* ============================== PROOF — MANUFACTURING STRENGTH ============================== */}
      <section className="dark relative overflow-hidden bg-bg">
        <div className="pointcloud-texture pointer-events-none absolute inset-0" aria-hidden />
        <Container className="relative grid gap-12 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <Eyebrow>Manufacturing strength behind the sensing stack</Eyebrow>
            <h2 className="mt-4 font-display text-h2 font-extrabold text-text-strong">
              Lesser-known in the U.S. doesn&apos;t mean unproven.
            </h2>
            <p className="mt-5 text-lead text-text-muted">
              MorpheusTEK partners with OLEI — part of a high-tech laser-measurement manufacturing network with deep
              OEM/ODM capability and one of the largest laser-diode purchasing footprints in the world. We add the
              U.S.-based application support, customization, stocking, and supplier coordination North American robotics
              companies need.
            </p>
            <div className="mt-8">
              <Button href="/about" variant="ghost" size="lg">
                The story behind the stack
              </Button>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-4">
            {[
              { k: "Exclusive", v: "North American distributor for OLEI LiDAR" },
              { k: "Full-stack", v: "LiDAR, 3D cameras, safety sensing & edge compute" },
              { k: "90 days", v: "Risk-free trial on every OLEI product" },
              { k: "U.S.-based", v: "Support, stocking & supplier coordination" },
            ].map((s, i) => (
              <Reveal key={s.k} delay={i * 60}>
                <div className="surface-card h-full p-6">
                  <div className="font-display text-h3 font-black text-accent">{s.k}</div>
                  <p className="mt-2 text-sm leading-snug text-text-muted">{s.v}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ============================== SICK REFRAME ============================== */}
      <Section tone="subtle">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <Reveal>
              <Eyebrow>The honest comparison</Eyebrow>
              <h2 className="mt-4 font-display text-h2 font-extrabold text-text-strong">
                SICK is excellent. The question is whether you need to pay the SICK premium.
              </h2>
              <p className="mt-5 text-lead text-text-muted">
                Our GS1-5 carries the same safety class — Type 3 / SIL2 / PL d — at a fraction of the price, and beats
                the nanoScan3 on protective range. At fleet scale, the per-unit delta is often your whole project margin.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/compare/sick-alternative-lidar" variant="primary" size="lg">
                  See the comparison
                </Button>
                <Button href="/safety-lidar" variant="ghost" size="lg">
                  Explore safety LiDAR
                </Button>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="surface-card overflow-hidden">
                <div className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-border bg-bg-muted text-xs font-semibold uppercase tracking-wide text-text-muted">
                  <span className="p-3">Spec</span>
                  <span className="border-l border-border bg-accent/10 p-3 text-text-strong">OLEI GS1-5</span>
                  <span className="border-l border-border p-3">SICK nanoScan3</span>
                </div>
                {[
                  ["Safety rating", "Type 3 · SIL2 · PL d", "Type 3 · SIL2 · PL d"],
                  ["Protective range", "5 m", "3 m"],
                  ["Scanning angle", "270°", "275°"],
                  ["90-day trial", "Yes", "—"],
                  ["Price", "A fraction of the cost", "Premium"],
                ].map((row, i) => (
                  <div key={row[0]} className={`tnum grid grid-cols-[1.2fr_1fr_1fr] text-sm ${i % 2 ? "bg-bg-muted/40" : ""}`}>
                    <span className="p-3 text-text-muted">{row[0]}</span>
                    <span className="border-l border-border bg-accent/10 p-3 font-semibold text-text-strong">{row[1]}</span>
                    <span className="border-l border-border p-3 text-text-muted">{row[2]}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ============================== RECURRING TEASERS ============================== */}
      <Section>
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { eyebrow: "Product of the month", icon: Boxes, title: "The GS1-5 Safety LiDAR", body: "Affordable safety has arrived — the centerpiece of our line, featured this month.", href: "/product-of-the-month" },
              { eyebrow: "Shows we'll be at", icon: ScanEye, title: "Meet us at Automate", body: "We're at the major North American robotics shows. Tell us you're coming and we'll save you a slot at the booth.", href: "/shows/meet-us-at-the-booth" },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 80}>
                <Link href={c.href} className="group block overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-border-strong">
                  <div className="dark relative h-32 overflow-hidden bg-bg">
                    <div className="circuit-motif absolute inset-0 opacity-80" />
                    <c.icon className="absolute bottom-4 left-6 size-9 text-accent" />
                  </div>
                  <div className="p-6">
                    <p className="eyebrow">{c.eyebrow}</p>
                    <h3 className="mt-2 font-display text-h4 font-bold text-text-strong group-hover:text-brand-blue">{c.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{c.body}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ============================== FINAL CTA ============================== */}
      <CtaBand
        eyebrow="Giving sight to robotics"
        title="Let's get your robot seeing."
        body="Tell us what you're building. We'll map the right perception stack and put a trial unit in your hands."
        primary={{ label: "Book a meeting", href: "/book-a-meeting" }}
        secondary={{ label: "Browse the line-up", href: "/products" }}
      />
    </>
  );
}
